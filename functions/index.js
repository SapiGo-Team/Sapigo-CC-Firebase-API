const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const express = require("express");
const app = express();
const db = admin.firestore();
const bcrypt = require("bcrypt");


app.use(express.json());

/**
 * User registration endpoint
 */
/**
 * User registration endpoint
 */
app.post("/register", (req, res) => {
  const {username, email, password} = req.body;

  // Hash the password
  const saltRounds = 10;
  const passwordHash = bcrypt.hashSync(password, saltRounds);

  admin
      .auth()
      .createUser({
        email,
        password,
      })
      .then((userRecord) => {
        const user = {
          id: userRecord.uid,
          username,
          email: userRecord.email,
          passwordHash, // Store the password hash in the user document
        };

        // Create a new document in the "users" collection with the user data
        db.collection("users")
            .doc(userRecord.uid)
            .set(user)
            .then(() => {
              res.status(200).json({
                message: "Anda telah berhasil register!",
                uid: userRecord.uid,
              });
            })
            .catch((error) => {
              console.error("Error creating user:", error);
              res.status(500).json({error: "Gagal register user."});
            });
      })
      .catch((error) => {
        console.error("Error creating user:", error);
        res.status(500).json({error: "Gagal register user."});
      });
});

/**
 * User login endpoint
 */
app.post("/login", (req, res) => {
  const {email, password} = req.body;

  admin
      .auth()
      .getUserByEmail(email)
      .then((userRecord) => {
        const uid = userRecord.uid;

        // Get the user document from Firestore based on the user's UID
        db.collection("users")
            .doc(uid)
            .get()
            .then((doc) => {
              if (doc.exists) {
                const userData = doc.data();

                // Verify the password manually
                if (passwordMatches(password, userData.passwordHash)) {
                  res.status(200).json({
                    message: "Selamat Datang di SapiGo!",
                    username: userData.username,
                  });
                } else {
                  res.status(401).json({
                    error: "Salah Password atau user tidak ada.",
                  });
                }
              } else {
                res.status(401).json({
                  error: "Salah Password atau user tidak ada.",
                });
              }
            })
            .catch((error) => {
              console.error("Error getting user data:", error);
              res.status(500).json({
                error: "Terjadi kesalahan saat login.",
              });
            });
      })
      .catch((error) => {
        console.error("Error getting user by email:", error);
        res.status(401).json({
          error: "Salah Password atau user tidak ada.",
        });
      });
});


/**
 * Helper function to check if the password matches
 * @param {string} password - The password provided by the user
 * @param {string} passwordHash - The hashed password stored in the database
 * @return {boolean} - True if the password matches, false otherwise
 */
function passwordMatches(password, passwordHash) {
  return bcrypt.compareSync(password, passwordHash);
}


// Update user endpoint
app.put("/users/:id", (req, res) => {
  const userId = req.params.id;
  const userData = req.body;

  db.collection("users")
      .doc(userId)
      .update(userData)
      .then(() => {
        res.status(200).json({message: "User berhasil diupdate!"});
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        res.status(500).json({error: "Gagal update user."});
      });
});

// Delete user endpoint
app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;

  db.collection("users")
      .doc(userId)
      .delete()
      .then(() => {
        res.status(200).json({message: "User berhasil dihapus!"});
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        res.status(500).json({error: "Gagal menghapus user."});
      });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({error: "Internal Server Error"});
});

exports.api = functions.region("asia-southeast2").https.onRequest(app);

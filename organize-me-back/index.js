const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const router = require("./routes"); // Import des routes principales

// Initialisation de l'application
const app = express();

// Middleware pour les logs des requêtes
app.use(morgan("dev"));

// Middleware pour gérer les JSON et limiter leur taille
app.use(express.json({ limit: "50mb" }));

// Middleware CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Front-end local
      "https://organize-me-front.vercel.app", // Front-end sur Vercel
    ],
    credentials: true, // Permet l'envoi de cookies et d'en-têtes d'autorisation
  })
);

// Test de connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB Connected");

    // Route de diagnostic pour MongoDB
    app.get("/mongodb-test", async (req, res) => {
      try {
        const dbStatus = await mongoose.connection.db.admin().ping();
        res.status(200).json({ message: "MongoDB fonctionne bien.", dbStatus });
      } catch (err) {
        console.error("Erreur MongoDB :", err);
        res.status(500).json({ error: "MongoDB ne répond pas." });
      }
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// Routes principales sans préfixe `/api`
app.use("/", router);

// Route de test générale pour vérifier si le serveur est actif
app.get("/connected", (req, res) => {
  res.status(200).send("Bienvenue sur l'API Organize Me!");
});

// Middleware pour les erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Une erreur interne est survenue." });
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

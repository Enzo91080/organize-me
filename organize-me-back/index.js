const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const router = require("./routes");

// Initialisation de l'application
const app = express();

// Middleware pour les logs des requêtes
app.use(morgan('dev'));

// Middleware pour gérer les JSON et limiter leur taille
app.use(express.json({ limit: "50mb" }));

// Définir les origines autorisées
const corsOptions = {
  origin: (origin, callback) => {
    console.log(`Request origin: ${origin}`);
    callback(null, true); // Autorisez tout pour vérifier si CORS est bien configuré
  },
  credentials: true,
};


// Appliquer le middleware CORS
app.use(cors(corsOptions));
// Middleware pour les requêtes préflight (OPTIONS)
app.options('*', cors(corsOptions)); // Gérer les requêtes préflight

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api', router); // Toutes les routes sont regroupées sous /api

// Route principale pour tester l'API
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API Organize Me!");
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

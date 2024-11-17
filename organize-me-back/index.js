const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const router = require("./routes/index");
const cors = require('cors');

// Initialisation de l'application
const app = express();
app.use(express.json());

// Définir les origines autorisées
const allowedOrigins = [
  'http://localhost:5173', // Front-end en local
  'https://organize-me-front.vercel.app' // Front-end déployé sur Vercel
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Permet d'envoyer les cookies et credentials
  optionsSuccessStatus: 200,
};

// Middleware CORS
app.use(cors(corsOptions));

// Limite pour le JSON
app.use(express.json({ limit: "50mb" }));

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error(err));

// Routes
app.use('/api', router);
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'api!");
});

// Middleware pour les requêtes préflight (OPTIONS)
app.options('*', cors(corsOptions)); // Gérer les requêtes préflight

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

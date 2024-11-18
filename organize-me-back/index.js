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
const allowedOrigins = [
  'http://localhost:5173', // Front-end en local
  'https://organize-me-front.vercel.app', // Front-end déployé sur Vercel
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS Error: Origin ${origin} not allowed`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Permet d'envoyer les cookies et credentials
  optionsSuccessStatus: 200,
};

// Middleware CORS
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
app.use('/', router);

// Route principale pour tester l'API
app.get("/connected", (req, res) => {
  res.send("Bienvenue sur l'API Organize Me!");
});


// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

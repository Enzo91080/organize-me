const express = require("express");
const router = express.Router();

// Importer les sous-routes
const authRoutes = require("./auth.route");
const taskRoutes = require('./task.route');

// Ajout des sous-routes
router.use("/auth", authRoutes); // Routes d'authentification
router.use("/tasks", taskRoutes); // Routes de gestion des tâches

module.exports = router;

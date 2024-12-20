const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const router = express.Router();

// Inscription
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const user = new User({ firstName, lastName, email, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Unauthorized or token expired" });
  }
});

// Connexion
router.post("/login", async (req, res) => {
  console.log("Requête reçue pour /login avec email :", req.body.email);

  const { email, password } = req.body;
  try {
    console.log("Recherche de l'utilisateur...");
    const user = await User.findOne({ email });

    if (!user) {
      console.log("Utilisateur non trouvé.");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("Vérification du mot de passe...");
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("Mot de passe incorrect.");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("Génération du token JWT...");
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("Réponse avec succès.");
    res.json({ token, user, accessToken: token, refreshToken: token });
  } catch (err) {
    console.error("Erreur pendant le processus de connexion :", err.message);
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;

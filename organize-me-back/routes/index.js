const express = require("express");
const router = express();
const morgan = require("morgan");


router.use(morgan("dev"));

const authRoutes = require("./auth.route");
const taskRoutes = require('./task.route');

router.use("/auth", authRoutes);
router.use("/tasks", taskRoutes);

module.exports = router;

const express = require("express");
const router = express.Router();

// Mengimpor file controller
const userController = require("../controller/user.controller");

// Rute-rute aplikasi
router.use("/", userController); // Menggunakan controller yang telah dibuat

module.exports = router;

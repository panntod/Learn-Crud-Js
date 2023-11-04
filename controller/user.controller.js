const express = require("express");
const router = express.Router();
const db = require("../database");

// Rute untuk halaman utama
router.get("/", (req, res) => {
  const sql = `SELECT * FROM users`;
  db.query(sql, (err, result) => {
    const users = JSON.parse(JSON.stringify(result));
    res.render("index", { users: users, title: "Daftar Siswa" });
  });
});

// Rute untuk halaman tambah siswa
router.get("/tambah", (req, res) => {
  res.render("tambah");
});

// Rute untuk menambahkan siswa
router.post("/tambah", async (req, res) => {
  try {
    const insertSql =
      "INSERT INTO users (nim, nama_lengkap, kelas, alamat, email) VALUES (?, ?, ?, ?, ?)";
    const { nim, nama_lengkap, kelas, alamat, email } = req.body;
    await db.query(insertSql, [nim, nama_lengkap, kelas, alamat, email]);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Terjadi kesalahan dalam penambahan siswa.");
  }
});

// Rute untuk halaman update siswa
router.get("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const sql = "SELECT * FROM users WHERE id = ?";
    const result = await db.query(sql, [id]);
    const userData = JSON.parse(JSON.stringify(result));
    res.render("update", { users: userData });
  } catch (err) {
    console.error(err);
    res.status(500).send("Terjadi kesalahan dalam pengambilan data siswa.");
  }
});

// Rute untuk mengupdate siswa
router.post("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updateSql =
      "UPDATE users SET nim = ?, nama_lengkap = ?, kelas = ?, alamat = ?, email = ? WHERE id = ?";
    const { nim, nama_lengkap, kelas, alamat, email } = req.body;
    await db.query(updateSql, [nim, nama_lengkap, kelas, alamat, email, id]);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Terjadi kesalahan dalam pembaruan siswa.");
  }
});

// Rute untuk menghapus siswa
router.get("/delete/:id", (req, res) => {
  const id_siswa = req.params.id; 
  if (id_siswa) {
    if (isNaN(id_siswa)) {
      res.status(400).json({ message: "ID siswa tidak valid" });
      return;
    }

    const deleteSql = `DELETE FROM users WHERE id = ${id_siswa}`;

    db.query(deleteSql, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal menghapus siswa" });
      } else {
        res.redirect('/')
      }
    });
  } else {
    res.status(400).json({ message: "ID siswa tidak valid" });
  }
});

module.exports = router;

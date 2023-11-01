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
router.post("/tambah", (req, res) => {
  const insertSql = `INSERT INTO users (nim, nama_lengkap, kelas, alamat, email) VALUES 
    ('${req.body.nim}', '${req.body.nama_lengkap}', '${req.body.kelas}', '${req.body.alamat}', '${req.body.email}');`;

  db.query(insertSql, (err, result) => {
    if (err) throw err;
    res.redirect("/");
  });
});

// Rute untuk halaman update siswa
router.get("/update/:id", (req, res) => {
  const sql = `SELECT * FROM users WHERE id = ${req.params.id}`;
  db.query(sql, (err, result) => {
    const userData = JSON.parse(JSON.stringify(result));
    res.render("update", { users: userData });
  });
});

// Rute untuk mengupdate siswa
router.post("/update/:id", (req, res) => {
  const id = req.params.id;
  const updateSql = `UPDATE users SET nim='${req.body.nim}', nama_lengkap='${req.body.nama_lengkap}', kelas='${req.body.kelas}', alamat='${req.body.alamat}', email='${req.body.email}' WHERE id = ${id}`;

  db.query(updateSql, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.redirect("/");
    }
  });
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

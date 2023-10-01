const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", "views");

const db = mysql.createConnection({
  host: "localhost",
  database: "pandhu",
  user: "root",
  password: "",
});

app.get("/", (req, res) => {
  const sql = `SELECT * FROM users`;
  db.query(sql, (err, result) => {
    const users = JSON.parse(JSON.stringify(result));
    res.render("index", { users: users, title: "Daftar Siswa" });
  });
});

app.get("/tambah", (req, res) => {
  res.render("tambah");
});

app.post("/tambah", (req, res) => {
  const insertSql = `INSERT INTO users (nim, nama_lengkap, kelas, alamat, email) VALUES 
    ('${req.body.nim}', '${req.body.nama_lengkap}', '${req.body.kelas}', '${req.body.alamat}', '${req.body.email}');`;

  db.query(insertSql, (err, result) => {
    if (err) throw err;
    res.redirect("/");
  });
});

app.get("/update/:id", (req, res) => {
  const sql = `SELECT * FROM users WHERE id = ${req.params.id}`;
  db.query(sql, (err, result) => {
    const userData = JSON.parse(JSON.stringify(result));
    res.render("update", { users: userData });
  });
});

app.post("/update/:id", (req, res) => {
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

app.get("/delete/:id", (req, res) => {
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

db.connect((err) => {
  if (err) {
    console.log("Cant connect to database" + "\n" + err.message);
    return;
  }
  console.log("Database is connected...");
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
});

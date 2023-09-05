const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({extended: true}))

app.set("view engine", "ejs")
app.set("views", "views")

const db = mysql.createConnection({
    host:"localhost",
    database:"pandhu",
    user:"root",
    password:""
})

app.get('/', (req,res) => {
        const sql = `SELECT * FROM users`
        db.query(sql, (err,result) => {
            const users = JSON.parse(JSON.stringify(result))
            res.render("index", {users: users, title: "Daftar Siswa"})
        })
})

app.get('/tambah', (req,res) => {
    res.render("tambah")
})

app.get('/update/:id', (req,res) => {
    res.render("update")
})

app.get('delete/:id', function(req,res) {
    res.render("delete")
})


app.post('/tambah', (req,res) => {
    const insertSql = `INSERT INTO users (id, nim, nama_lengkap, kelas, alamat, email) VALUES 
    (null, '${req.body.nim}', '${req.body.nama_lengkap}', '${req.body.kelas}', '${req.body.alamat}', '${req.body.email}');`
    
    db.query(insertSql, (err, result)=>{
        if(err) throw err;
        res.redirect('/')
    })
})

app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM siswa WHERE id = ?`;
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Gagal hapus siswa' });
      } else {
        res.status(200).json({ message: 'Sukses hapus siswa' });
      }
    });
  });
  
app.put('/update/:id', (req,res) => {
    const id = req.params.id
    const updateSql = `UPDATE users nim='${req.body.nim}', nama_lengkap='${req.body.nama_lengkap}', kelas='${req.body.kelas}', alamat='${req.body.alamat}', email='${req.body.email}') WHERE id = '${req.body.id};`

    db.query(updateSql, (err, result)=>{
        if(err) throw err;
        res.redirect('/')
    })
})

db.connect((err) => {
    if(err) {
        console.log("Cant connect to database" +"\n"+ err.message);
        return;
    }
    console.log("Database is connected...")
    app.listen(3000, () => {
        console.log("Server is running...")
    })
})

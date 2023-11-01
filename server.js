const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Mengimpor file rute
const userRoutes = require("./routes/user.route");

// Menggunakan rute-rute dalam aplikasi
app.use("/", userRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

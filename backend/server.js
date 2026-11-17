const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());

function leerDatos() {
  return JSON.parse(fs.readFileSync(__dirname + "/datos.json", "utf8"));
}

app.get("/api/datos", (req, res) => {
  res.json(leerDatos().productos);
});

app.get("/api/info", (req, res) => {
  const datos = leerDatos();
  res.json({ consultado_en: datos.consultado_en });
});

app.listen(3000, () => {
  console.log("servidor activo puerto 3000");
});
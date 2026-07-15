const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// El token de Mapbox se entrega en tiempo de ejecución desde una variable de
// entorno para que nunca quede grabado en el código fuente ni en GitHub.
app.get("/api/config", (req, res) => {
  res.json({ mapboxToken: process.env.MAPBOX_TOKEN || "" });
});

// Sirve todo lo que esté en /public (incluyendo index.html)
app.use(express.static(path.join(__dirname, "public")));

// Cualquier ruta no encontrada regresa el index.html (útil si en el futuro se agrega ruteo del lado del cliente)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Guía de viaje Japón corriendo en el puerto ${PORT}`);
});

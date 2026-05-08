const express = require("express");
const app = express().use(express.json());

// ESTO ES LO QUE META NECESITA PARA VALIDAR
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "voltia_madrid_2026"; // Esta es tu contraseña

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge); // Aquí le respondemos a Meta: "¡Estoy vivo!"
  } else {
    res.sendStatus(403);
  }
});

app.post("/webhook", (req, res) => {
  console.log("Mensaje recibido:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

app.listen(process.env.PORT || 3000, () => console.log("Servidor de Voltia listo"));
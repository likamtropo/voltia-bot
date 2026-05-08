const express = require("express");
const axios = require("axios"); // Necesitamos esto para enviar mensajes
const app = express().use(express.json());

const token = "EAAS6iyIaPUMBRULE71Jmowm2wFwcZAGHOniXdKXAxbYzZBmGTswhxKMwPDKlyyG58T4i0F1NZC7bRsnXSeIplHYAcMw1bZAcz9LQ78zYIoqd9UQm7EYQQhckjRQS6JDTTh24ZAtMalJkjkMep2qEZCqDl73ZByhwk5vY4hIen4YlLJZASirVfzKTHUk12IwZA0V6LMFtcdiXByKsZCgKU12d3hjxI8ewUYLw9ZBkhRuluZC5SBLT4r0OciM3s0MSZBY4Q9XrMuLOyu6qCKV4q3RZCL2gZDZD";
const phoneId = "1134346533090150";
const verifyToken = "no_tengo_2023";

// Validación de Webhook para Meta
app.get("/webhook", (req, res) => {
    if (req.query["hub.verify_token"] === verifyToken) {
        res.send(req.query["hub.challenge"]);
    } else {
        res.sendStatus(403);
    }
});

// Recepción de mensajes
app.post("/webhook", async (req, res) => {
    const body = req.body;

    if (body.object === "whatsapp_business_account") {
        if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
            const from = body.entry[0].changes[0].value.messages[0].from; // Número del cliente
            const msgBody = body.entry[0].changes[0].value.messages[0].text.body; // Texto que envió

            console.log("Mensaje de " + from + ": " + msgBody);

            // RESPUESTA AUTOMÁTICA
            try {
                await axios({
                    method: "POST",
                    url: `https://graph.facebook.com/v18.0/${phoneId}/messages`,
                    data: {
                        messaging_product: "whatsapp",
                        to: from,
                        text: { body: "¡Hola! Soy Leo, el asistente de Voltia Madrid ⚡. He recibido tu mensaje: '" + msgBody + "'. ¿En qué puedo ayudarte con tu instalación eléctrica?" },
                    },
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                });
            } catch (error) {
                console.error("Error enviando mensaje:", error.response.data);
            }
        }
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

app.listen(process.env.PORT || 3000, () => console.log("Leo Assistant de Voltia está listo!"));

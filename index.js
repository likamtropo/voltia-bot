const express = require("express");
const axios = require("axios"); // Necesitamos esto para enviar mensajes
const app = express().use(express.json());

const token = "EAAS6iyIaPUMBRWE2jlnSMFHFryeAuV3aS79buebAKKxwBqqZCFWdlYSZB9EODhw6ufb62tO99vTY4hlKukSZBhlZCL7DzDJHf1CF7mDyLdhpnIoa0O6orPKBwZA80KU7vYOIURMQqKgPMlXyfGmYt851qva8ENUrd9RTIlq7ewROxSIun1wGptbIOFQDqCYFeIVmBigdXzbCoWqK6oU6qwxRMecBrGKzmrtmdZC1TBSRAWTFT8lXyZARK6LsiHuPSWc0PuaQC41PgxySThuvAAZD";
const phoneId = "1134346533090150";
const verifyToken = "no_tengo_2026";

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

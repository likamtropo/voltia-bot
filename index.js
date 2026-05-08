const express = require("express");
const axios = require("axios"); // Necesitamos esto para enviar mensajes
const app = express().use(express.json());

const token = "EAAS6iyIaPUMBRXkKoWllob5t7TzxgiuxP82vUGdQamDmuqR1bmRha314EZAb0UZA3c4CZCqVfJqAXZBT9yNxDcPpZCWiLQsy91ZC15tLlCwNAOeOJZCAQMLPAkZA35wM0ZAgSbqIN7zzpDWjbFAsWA3vYGX6mwaWr1TpfX4tuTkF2u1FpfCJFxCSHUZCfdzzsupsrQnLCZBya1ZBFil15js97J4UcnDWWsnwqGBPfakx6z0ZBAnBGKlZCEQ4D47rNAd2iLd68mefP62jNt0qOwrgwq1QZDZD";
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

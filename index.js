const express = require("express");
const axios = require("axios");
const app = express().use(express.json());

// CONFIGURACIÓN ACTUALIZADA
const token = "EAAS6iyIaPUMBRQ3TnuO4pmrqgqD7I9eS3zr5oGK5rkzSy1VtMNyUmXJsCMmcTYkwra6oBSX9ZBq4tgGS9e976QXjZCyJWIUriiwLj7ZCLkfo3Pci8ZBVtdLFarOB0CZCCy2QblZBqgqTzd4hd2l4wqYdS56xjAudvvx6auSmqQ3UrGZAvHRuC4pkmWGZCJL8hlzZBWZA08noZAvk51HLv7v7ZB0YIz8gSobyciz5zEqrtV1zuZANB6sQ3s6Yd7g0a9v9Vmzxjr2mIFOs4E8O3pk6yUQZDZD";
const phoneId = "1134346533090150";
const verifyToken = "no_tengo_2026"; // Este es el que debes poner en el panel de Meta

// 1. Validación del Webhook (El "apretón de manos" con Meta)
app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const tokenR = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && tokenR) {
        if (mode === "subscribe" && tokenR === verifyToken) {
            console.log("¡Webhook verificado con éxito!");
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

// 2. Recepción y respuesta de mensajes
app.post("/webhook", async (req, res) => {
    const body = req.body;

    if (body.object === "whatsapp_business_account") {
        if (body.entry && 
            body.entry[0].changes && 
            body.entry[0].changes[0].value.messages && 
            body.entry[0].changes[0].value.messages[0]) {

            const message = body.entry[0].changes[0].value.messages[0];
            const from = message.from; // Número del cliente
            const msgBody = message.text ? message.text.body : "Mensaje no de texto";

            console.log("Mensaje recibido de " + from + ": " + msgBody);

            // Evitar bucles (no contestar a mensajes que no sean de texto o ecos)
            if (message.text) {
                try {
                    await axios({
                        method: "POST",
                        url: `https://graph.facebook.com/v18.0/${phoneId}/messages`,
                        data: {
                            messaging_product: "whatsapp",
                            to: from,
                            type: "text",
                            text: { body: "¡Hola! Soy Leo, el asistente de Voltia Madrid ⚡. He recibido tu mensaje: '" + msgBody + "'. ¿En qué puedo ayudarte con tu instalación eléctrica?" },
                        },
                        headers: { 
                            "Content-Type": "application/json", 
                            "Authorization": `Bearer ${token}` 
                        },
                    });
                    console.log("Respuesta enviada correctamente");
                } catch (error) {
                    console.error("Error enviando mensaje:", error.response ? error.response.data : error.message);
                }
            }
        }
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

// Puerto de escucha
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Leo Assistant de Voltia listo en puerto ${PORT}`));

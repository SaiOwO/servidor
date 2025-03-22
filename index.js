const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);

// Crear un servidor WebSocket con la instancia de http
const wss = new WebSocket.Server({ server });

const gameVariables = {};

wss.on("connection", (ws) => {
    console.log("Nuevo cliente conectado");

    setTimeout(() => {
        ws.send(JSON.stringify({ type: "sync", data: gameVariables }));
        console.log("Sync enviada a un cliente");
        console.log("DATA:", gameVariables);
    }, 1000);

    ws.on("message", (data) => {
        console.log("Comando:", data);

        const partes = data.split("|");
        const tipo = String(partes[1]);
        const para = String(partes[2]);

        if (tipo == "Timer" && para == "All") {
            const spliteado = String(partes[3]).split("~");

            const base = String(partes[0]);
            gameVariables[base + "m_timerEnabled"] = true;
            gameVariables[base + "m_startTime"] = Number(spliteado[0]);
            gameVariables[base + "m_seconds"] = Number(spliteado[1]);
        }

        // Enviar el mensaje a todos los clientes conectados
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });

    ws.on("close", () => {
        console.log("Cliente desconectado");
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor WebSocket corriendo en http://localhost:${PORT}`);
});

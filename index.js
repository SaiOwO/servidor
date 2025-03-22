const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = process.env.PORT || 4000;
const gameVariables = {};

io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado:", socket.id);

    setTimeout(() => {
        socket.emit("sync", gameVariables);
        console.log("Sync enviada a", socket.id);
	console.log("DATA:", gameVariables);

    }, 1000);
    
    socket.on("command", (data) => {
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

        io.emit("command", data);
    });

    socket.on("disconnect", () => {
        console.log("Cliente desconectado:", socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Servidor WebSocket corriendo en el Port: ${PORT}`);
});

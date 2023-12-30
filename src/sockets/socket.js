import { Server } from "socket.io";
import { addUserConnection, addUserMessage, addDisconnectMessage, messages } from "../message/messageHandler.js";

export const initSocket = (server) => {
    const io = new Server(server);

    io.on("connection", (socket) => {
        console.log(`User ${socket.id} Connection`);

        let username = "";

        socket.on("userConnection", (data) => {
            username = data.user;
            addUserConnection(socket.id, data.user);
            io.sockets.emit("userConnection", messages);
        });

        socket.on("userMessage", (data) => {
            addUserMessage(socket.id, username, data.message);
            io.sockets.emit("userMessage", messages);
        });

        socket.on("typing", (data) => {
            socket.broadcast.emit("typing", data);
        });

        socket.on("disconnect", () => {
            addDisconnectMessage(socket.id, username);
            io.sockets.emit("userConnection", messages);
        });
    });
};

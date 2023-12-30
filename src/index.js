import express from "express";
import { engine } from "express-handlebars";
import { __dirname } from "./utils.js";
import * as path from "path";
import { createServer } from "http";
import { initSocket } from "./sockets/socket.js";

const app = express();
const server = createServer(app);
const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server run Express port: ${PORT}`);
});

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));

app.use("/", express.static(__dirname + "/public"));

app.get("/", (_req, res) => {
    res.render("index");
});

initSocket(server);

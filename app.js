const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const fs = require("fs");

const cookieParser = require("cookie-parser");
const logger = require("morgan");

require("dotenv").config();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const origins = require("./config/origins");

app.all("*", (req, res, next) => {
    if(typeof req.get("origin") !== "undefined") {
        if(origins.indexOf(req.get("origin")) > -1) {
            res.header("Access-Control-Allow-Origin", req.get("origin"));
        }
    }
    
    next();
});

fs.readdirSync("./routes").forEach(route => app.use(`/${route}/`, require(`./routes/${route}/`)()));

app.get("/", (req, res) => res.send(`Running on ${process.env.NODE_ENV}.`));

io.on("connection", socket => {
    console.log(`New socket connection with id #${socket.id}`);
    socket.on("disconnect", () => console.log(`Disconnection with id #${socket.id}`));
});

const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`Listening on :${port}`));
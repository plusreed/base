module.exports = () => {
    const app = require("express")();

    app.get("/", (req, res) => res.send("Hello World!"));

    return app;
}
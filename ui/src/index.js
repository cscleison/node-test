const express = require("express");
const app = express();
const port = process.env.PORT || 80;

app.get("/health", (req, res) => res.sendStatus(200));

app.get("/", (req, res) => res.send("Hello, World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

const express = require("express");
const authRouter = require("./routes/auth.routes");

app.use("/api/aut", authRouter)

const app = express();

module.exports = app
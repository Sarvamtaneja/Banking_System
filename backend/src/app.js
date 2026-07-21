const express = require("express");
const cookieParser =  require("cookie-parser");

const authRouter = require("./routes/auth.routes");
const accountRouter =  require("./routes/account.routes");
const transactionRouter = require("./routes/transaction.routes");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.get("/", (req,res)=>{
    res.send("Banking service is up and running");
})

app.use("/api/auth", authRouter)

app.use("/api/accounts", accountRouter) 

app.use("/api/transaction", transactionRouter)


module.exports = app
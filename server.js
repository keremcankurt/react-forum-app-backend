const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require("cookie-parser")
const connectDatabase = require('./helpers/database/connectDatabase');
const router = require('./routers');
dotenv.config( {
    path: './config/env/config.env'
});

connectDatabase();

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://kckforum.netlify.app");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });
app.use(cookieParser());
app.use(express.json());
const PORT = process.env.PORT;

app.use("/api",router);

app.listen(PORT, () => {
  console.log("Server is listening on port: " + PORT)
})

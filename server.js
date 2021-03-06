const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const user = require("./routes/user");
const book = require("./routes/book");

const app = express();

app.use(express.json());
app.use("/api/v1/user", user);
app.use("/api/v1/books", book);

const PORT = process.env.PORT;

app.listen(PORT, console.log("서버개발시작  " + PORT));


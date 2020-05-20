import cookieParser from "cookie-parser";
import express from "express";
import logger from "morgan";
import path from "path";
import fetchData from "./routes/fetchData";
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// todo(perry): make cron job to perform this api call automatically
app.use("/download", fetchData);

module.exports = app;

import cookieParser from "cookie-parser";
import "core-js";
import cors from "cors";
import express from "express";
import logger from "morgan";
import path from "path";
import "regenerator-runtime";
import fetchData from "./routes/fetchData";
const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// todo(perry): make cron job to perform this api call automatically
app.use("/download", fetchData);

module.exports = app;

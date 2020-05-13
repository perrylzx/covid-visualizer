var express = require("express");
var app = express();
var cookieParser = require("cookie-parser");
var indexRouter = require("./routes/index");
var logger = require("morgan");
var path = require("path");
import download from "download-git-repo";

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use("/download", fetchData);
app.get("/download", (req, res) => {
  download("CSSEGISandData/COVID-19", "../frontend/src/dataset", (err) => {
    res.send(err ? err : "Success");
  });
});

module.exports = app;

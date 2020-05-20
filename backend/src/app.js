var express = require("express");
var app = express();
var cookieParser = require("cookie-parser");
var indexRouter = require("./routes/index");
var logger = require("morgan");
var path = require("path");
import fs from "fs";
import papa from "papaparse";

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// todo(perry): make cron job to perform this api call automatically
app.get("/download", (req, res) => {
  download("CSSEGISandData/COVID-19", "./src/dataset", (err) => {
    console.log(err ? err : "Success");
  });
  const chunks = [];
  fs.createReadStream(
    path.resolve(
      __dirname,
      "dataset",
      "csse_covid_19_data",
      "csse_covid_19_time_series",
      "time_series_covid19_confirmed_global.csv"
    )
  )
    .pipe(
      papa.parse(papa.NODE_STREAM_INPUT, {
        dynamicTyping: true,
        delimiter: ",",
        header: true,
      })
    )
    .on("error", (error) => console.error(error))
    // on data event, every append every chunk of data to chunks array
    .on("data", (chunk) => chunks.push(chunk))
    // on end event, send completed chunks array
    .on("end", () => res.send(chunks));
});

module.exports = app;

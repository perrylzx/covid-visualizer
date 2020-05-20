var express = require("express");
var router = express.Router();
import download from "download-git-repo";
import fs from "fs";
import papa from "papaparse";
import path from "path";

/* GET home page. */
router.get("/", async (req, res) => {
  await download("CSSEGISandData/COVID-19", "./src/dataset", (err) => {
    console.log(err ? err : "Success");
  });
  const chunks = [];
  fs.createReadStream(
    path.resolve(
      "src",
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

module.exports = router;

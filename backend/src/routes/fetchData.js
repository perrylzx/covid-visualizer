import download from "download-git-repo";
import express from "express";
import fs from "fs";
import cron from "node-cron";
import papa from "papaparse";
import path from "path";
const router = express.Router();

cron.schedule(
  "0 1 * * *",
  () => {
    download("CSSEGISandData/COVID-19", "./src/dataset", (err) => {
      console.log(err ? err : "Success");
    });
  },
  {
    scheduled: true,
    timezone: "Asia/Singapore",
  }
);

/* GET home page. */
router.get("/", (req, res) => {
  const countryData = [];
  const countryList = [];
  const dataToSend = [];
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
    // on data event, every append every chunk of data to countryData array
    .on("data", (chunk) => {
      const countryToCases = chunk["Province/State"]
        ? `${chunk["Country/Region"]}, ${chunk["Province/State"]}`
        : chunk["Country/Region"];
      countryList.push(countryToCases);
      delete chunk["Lat"];
      delete chunk["Long"];
      delete chunk["Country/Region"];
      delete chunk["Province/State"];
      const casesToCountry = chunk;
      countryData.push({ [countryToCases]: casesToCountry });
    })
    // on end event, send completed countryData array
    .on("end", () => {
      dataToSend.push(countryList, countryData);
      res.send(dataToSend);
    });
});

module.exports = router;

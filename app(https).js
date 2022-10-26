const express = require("express");
const app = express();
const ejs = require("ejs");
const https = require("https");

// API key
const myKey = "1e7b802bb9013ce9246c047bfd098383";

// change unit from k to cel
function kToC(k) {
  return (k - 273.15).toFixed(2);
}

// Middleware
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/:city", (req, res) => {
  let { city } = req.params;
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${myKey}`;

  // get request by node.js
  https
    .get(url, (response) => {
      console.log("statusCode:", response.statusCode);
      console.log("headers", response.headers);
      response.on("data", (d) => {
        let djs = JSON.parse(d);
        let { temp } = djs.main;
        let newTemp = kToC(temp);
        res.render("weather.ejs", { djs, newTemp });
      });
    })
    .on("error", (e) => {
      console.log(e);
    });
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});

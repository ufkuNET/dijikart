const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.get("/", (req, res) => res.send("MINIMAL OK"));

app.get("/debug", (req, res) => {
  const cwd = process.cwd();
  let files = [];
  try {
    files = fs.readdirSync(cwd).slice(0, 200);
  } catch (e) {
    files = ["readdirSync error: " + String(e)];
  }

  res.json({
    cwd,
    node: process.version,
    port: process.env.PORT,
    hasServerJs: files.includes("server.js"),
    hasBootWrapper: files.includes("boot-wrapper.js"),
    hasWrapperOk: files.includes("wrapper-ok.txt"),
    files
  });
});

app.listen(process.env.PORT, () => {
  console.log("MINIMAL BOOT", process.env.PORT);
});

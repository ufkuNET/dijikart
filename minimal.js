const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("MINIMAL OK"));

app.listen(process.env.PORT, () => {
  console.log("MINIMAL BOOT", process.env.PORT);
});

const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("MINIMAL OK"));

app.get("/try-server", (req, res) => {
  try {
    delete require.cache[require.resolve("./server.js")];
    require("./server.js");
    res.send("server.js require OK (no immediate crash)");
  } catch (e) {
    res.status(500).send(
      "server.js require FAILED:\n\n" +
      (e && e.stack ? e.stack : String(e))
    );
  }
});

app.listen(process.env.PORT, () => {
  console.log("MINIMAL BOOT", process.env.PORT);
});

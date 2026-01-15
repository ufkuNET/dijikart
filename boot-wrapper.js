const fs = require("fs");

// Crash'leri dosyaya yaz
process.on("uncaughtException", (err) => {
  try { fs.appendFileSync("fatal.log", `[uncaughtException]\n${err.stack}\n\n`); } catch(e) {}
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  try { fs.appendFileSync("fatal.log", `[unhandledRejection]\n${String(err)}\n\n`); } catch(e) {}
  process.exit(1);
});

// dotenv
try {
  require("dotenv").config();
} catch (e) {}

// Asıl app'i başlat
require("./server.js");

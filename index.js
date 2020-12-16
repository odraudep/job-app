const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Test");
});

// Others
const PORT = 8081;

app.listen(PORT);

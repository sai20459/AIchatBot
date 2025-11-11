require("dotenv").config();

//packages
const cors = require("cors");
const express = require("express");

// imports
const openai = require("./routes/openai");

const app = express();

app.use(express.json());
app.use(express.text());

// CORS config
app.use(
  cors({
    origin: function (origin, callback) {
      if (process.env.ALLOWED_HOSTS.indexOf(origin) !== -1 || !origin)
        callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
  })
);

//database connection
(async function () {
  try {
    const port = process.env.PORT;
    app.listen(port, () => console.log(`Running on port ${port}`));
  } catch (error) {
    console.log(error);
  }
})();

app.use((req, res, next) => {
  res.setHeader("Expect-CT", "max-age=86400, enforce");
  next();
});

// Routes
app.use("/api/openai", openai);
// if no route found
// app.all("*", (req, res, next) => {
//   const url = req.originalUrl;
//   next({ status: 404, message: `Can't find ${url} on this server!` });
// });

module.exports = app;

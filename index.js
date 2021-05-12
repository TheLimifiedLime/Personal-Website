const express = require("express");
const { body, validationResult } = require("express-validator");
const ratelimit = require("ratelimit-middleware");
const app = express();
const port = 3000;

// https://webdva.github.io/how-to-force-express-https-tutorial/
app.use((req, res, next) => {
  if (req.headers["x-forwarded-proto"] !== "https") {
    // the statement for performing our redirection
    return res.redirect("https://" + req.headers.host + req.url);
  } else {
    return next();
  }
});


app.use(
  "/",
  ratelimit({
    burst: 4, // Max 10 concurrent requests (if tokens)
    rate: 3, // Steady state: 1 request / 2 seconds
    ip: true,
  })
);

app.use(
  express.static(`public`, {
    extensions: ["html"],
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  console.log(`Ping!`);
  res.sendFile(`/public/index.html`, {
    root: __dirname,
  });
});

app.use(function (req, res, next) {
  res.status(404).sendFile(`/public/404.html`, { root: __dirname });
});

app.listen(port, () => {
  console.log(`Started server on port ${port}`);
});

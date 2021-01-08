const express = require("express");
const { body, validationResult } = require("express-validator");
const ratelimit = require("ratelimit-middleware");
const axios = require("axios");
const app = express();
const port = 3000;

app.use(
  "/api/form",
  ratelimit({
    burst: 1, // Max 10 concurrent requests (if tokens)
    rate: 0.1, // Steady state: 1 request / 2 seconds
    ip: true,
  })
);

app.use(
  "/",
  ratelimit({
    burst: 3, // Max 10 concurrent requests (if tokens)
    rate: 2, // Steady state: 1 request / 2 seconds
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
  console.log(`Ping!`)
  res.sendFile(`/public/index.html`, {
    root: __dirname,
  });
});

app.post(
  "/api/form",
  [
    body("h-captcha-response").not().isEmpty().trim().escape(),
    body("email")
      .isLength({
        min: 5,
        max: 50,
      })
      .isEmail()
      .normalizeEmail(),
    body("subject")
      .isLength({
        min: 40,
        max: 200,
      })
      .not()
      .isEmpty()
      .trim()
      .escape(),
    body("message")
      .isLength({
        min: 60,
        max: 400,
      })
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.sendFile("/public/error.html", {
        root: __dirname,
      });
    }

    async function run() {
      const verifier = require(`./functions/verify.js`);
      const result = await verifier.verify(req.body["h-captcha-response"]);
      return result;
    }

    const result = run().then(function (result) {
      if (result !== true) {
        return res.sendFile("/public/error.html", { root: __dirname });
      } else if (result === true) {
        res.redirect(`https://issai.club/success`);
        const data = {
          content: "📨  New message on issai.club <@738966191519039640>!",
          embeds: [
            {
              color: 3066993,
              fields: [
                {
                  name: "Email",
                  value: req.body.email,
                },
                {
                  name: "Subject",
                  value: req.body.subject,
                },
                {
                  name: "Message",
                  value: req.body.message,
                },
              ],
            },
          ],
        };
        axios
          .post(process.env.WEBHOOK, data)
          .then(function (response) {
            console.log(`Posted to webhook`);
          })
          .catch(function (error) {
            console.log(`Error!` + error);
          });
      }
    });
  }
);

app.use(function (req, res, next) {
  res.status(404).sendFile(`/public/404.html`, { root: __dirname });
});

app.listen(port, () => {
  console.log(`Started server on port ${port}`);
});

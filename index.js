const express = require("express");
const app = express()

app.use(express.static("./public", {
    extensions: ["html"]
}))

app.listen(3000, () => {
    console.log("⚡ Server Running")
})
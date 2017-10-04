"use strict"

const express = require("express")
const app = express()
const http = require("http").Server(app)
const port = process.env.PORT || 8080
const io = require("socket.io")(http)
require("./libs/game")(io)

app.set("view engine", "pug")
app.use(express.static("public"))
app.use(express.static("bower_components"))

app.get("/", (req, res) => {
	res.render("pages/index")
})

http.listen(port, () => {
	console.log(`Listening on ${port}.`)
})

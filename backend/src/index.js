const http = require("http")
const express = require("express")
const cors = require("cors")
const socketIo = require("socket.io")

const { generateMessage, generateLocation } = require("../utils/messages")

const app = express()
const server = http.createServer(app)
const Io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

const port = process.env.PORT

app.use(cors())

Io.on("connection", (socket) => {
  socket.emit("message", generateMessage("Welcome"))
  socket.broadcast.emit("message", generateMessage("New user joined"))

  socket.on("sendMessage", (clientMessage) => {
    Io.emit("message", generateMessage(clientMessage))
  })

  socket.on("sendLocation", ({ longitude, latitude }) => {
    Io.emit("locationMessage", generateLocation(`https://google.com/maps?q=${latitude},${longitude}`))
  })

  socket.on("disconnect", () => {
    Io.emit("message", generateMessage("A User left!!"))
  })
})

server.listen(port, () => {
  console.log(`Server listening to port ${port}`)
})
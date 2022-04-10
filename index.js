var express = require("express");
var socketio = require("socket.io");
var path = require("path");

var app = express();
var server = app.listen(3000)

var mainDirectory = path.join(__dirname, "main");
var gameDirectory = path.join(__dirname, "game");
app.use(express.static(mainDirectory));

var io = socketio(server);

var playerIds = new Map();
var playerIps = new Map();

const MIN_USERNAME_SIZE = 3
const MAX_USERNAME_SIZE = 20
const MAX_CHAT_LENGTH = 200

io.on('connection', function(socket){
  let playerId = socket.id
  let playerIp = socket.handshake.headers["x-forwarded-for"]

  socket.on('newConnection', function(username) {
    if(username == null) { socket.emit('returnToTitle', "No username provided!"); return }
    if(username.length > MAX_USERNAME_SIZE || username.length < MIN_USERNAME_SIZE) { socket.emit('returnToTitle', "Username must be between "+MIN_USERNAME_SIZE+"-"+MAX_USERNAME_SIZE+" characters"); return }

    for (let playerInfo of playerIps) {
      if(playerIp == playerInfo[0]) {
        socket.emit('returnToTitle', "Client is already connected")
        return
      }
    }

    console.log(username + " has connected")
    socket.emit('updateStatus', JSON.stringify(Array.from(playerIds)))
    playerIds.set(playerId, username)
    playerIps.set(playerIp, username)
    io.emit('playerAdded', username, playerId)
  })

  socket.on('sendMessage', function(message) {
    console.log(playerIds.get(playerId) + ": " + message)
    if(message.length <= MAX_CHAT_LENGTH) {
          io.emit('messageReceived', playerIds.get(playerId), message)
    }
  })

  socket.on('disconnect', function(socket) {
    console.log(playerIds.get(playerId) + " has disconnected")
    io.emit('playerRemoved', playerIds.get(playerId), playerId)
    playerIds.delete(playerId)
    playerIps.delete(playerIp)
  })
})

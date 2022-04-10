const usernameLabel = document.getElementById("username")
const statusLabel = document.getElementById("status")
const playerList = document.getElementById("playerlist")

const chatdiv = document.getElementById("chatdiv")
const chat = document.getElementById("chat")
const chatTextEntry = document.getElementById("chattextentry")
const chatSend = document.getElementById("chatsend")

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const username = urlParams.get("username")
const ip = urlParams.get("ip")

var socket

function sendMessage() {
  if (socket.connected == true) {
      socket.emit('sendMessage', chatTextEntry.value)
  }
}

function onLoad() {  
  usernameLabel.innerHTML = "Welcome " + username
  statusLabel.innerHTML = "Status: Connecting..."

  socket = io()
  socket.emit('newConnection', username)

  socket.on('updateStatus', function(transitString) {
    statusLabel.innerHTML = "Status: Connected!"

    var playerIds = new Map(JSON.parse(transitString))

    for (let playerInfo of playerIds) {
      let player = document.createElement("li")
      player.id = playerInfo[0]
      player.innerHTML = playerInfo[1]
      playerList.appendChild(player)
    }
  })

  socket.on('returnToTitle', function(errorMessage) {
    window.location = "https://online-game.okliam07.repl.co?error="+errorMessage
  })

  socket.on('messageReceived', function(username, messageText) {

    let oldCurrentScroll = chatdiv.scrollTop
    let oldMaxScroll = -(chatdiv.clientHeight - chatdiv.scrollHeight)
    
    let message = document.createElement("li")
    message.innerHTML = username + ": " + messageText
    chat.appendChild(message)
    
    if(oldCurrentScroll == oldMaxScroll) {
      chatdiv.scrollTop = -(chatdiv.clientHeight - chatdiv.scrollHeight)
    }
  })

  socket.on('playerAdded', function(username, id) {
    let newPlayer = document.createElement("li")
    newPlayer.id = id
    newPlayer.innerHTML = username
    playerList.appendChild(newPlayer)
  })

  socket.on('playerRemoved', function(username, id) {
    let removedPlayer = document.getElementById(id)
    removedPlayer.remove()
  })
}

chatSend.onclick = sendMessage
window.onload = onLoad
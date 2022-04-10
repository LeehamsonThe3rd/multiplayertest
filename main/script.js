const usernamePrompt = document.getElementById("username")
const gameIpPrompt = document.getElementById("ip")
const connectButton = document.getElementById("connect")
const errorLabel = document.getElementById("error")

const MIN_USERNAME_SIZE = 3
const MAX_USERNAME_SIZE = 20

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const errorMessage = urlParams.get("error")

var socket

function error(message) {
  errorLabel.innerHTML = message
  errorLabel.style.visibility = "visible"
}

function onLoad() {
  if (errorMessage != null) {
    error(errorMessage)
  }
}

function connect() {
    if(usernamePrompt.value.length < MIN_USERNAME_SIZE || usernamePrompt.value.length > MAX_USERNAME_SIZE) {
    error("Username must be between "+MIN_USERNAME_SIZE+"-"+MAX_USERNAME_SIZE+" characters")
    return
  }
  
  window.location.href = "/game/game.html?ip="+gameIpPrompt.value+"&username="+usernamePrompt.value
}

connectButton.onclick = connect
window.onload = onLoad()
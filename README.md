# Bullseye JS
a js library for connecting to the bullseye monitor web socket.

# Usage
const Monitor = require('./bullseye-js');

let bullseyeMonitor = new Monitor("API_KEU", "DECRYPT_KEY", ["amazon"], notificationCallback);
bullseyeMonitor.connect();

function notificationCallback(product) {
    console.log(product);
}

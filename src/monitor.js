const WebSocket = require('ws');

class Monitor {
    constructor(apiKey, decryptionKey, scopes, notificationHandler) {
        this.decryptionKey = decryptionKey;
        this.options = {
            headers: {
                "Authorization" : apiKey,
                "scopes": "[" + scopes.join(',') + "]"
            }
        };
        this.notificationHandler = notificationHandler;
    }

    connect() {
        const decryptKey = this.decryptionKey;
        const notificationHandler = this.notificationHandler

        const ws = new WebSocket('ws://api.bullseye.pw/v1/ws/', this.options);
        ws.on('open', function open() {
            ws.send("PING")
            
            //send ping every 10 seconds
            setInterval(function(){
              ws.send("PING")
            }, 10000);
        });

        ws.on('message', function message(message) {
            let buff = Buffer.from(message.toString(), 'base64').toString('ascii')
            var ord = []; var res = "";

            var i;
            for (i = 1; i <= 255; i++) {ord[String.fromCharCode(i)] = i}
         
            for (i = 0; i < buff.length; i++)
                res += String.fromCharCode(ord[buff.substr(i, 1)] ^ ord[decryptKey.substr(i % decryptKey.length, 1)]);
         
            notificationHandler(JSON.parse(res));
        });
    }
}

module.exports = Monitor;
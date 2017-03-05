var ws = require("nodejs-websocket")

// Scream server example: "hi" -> "HI!!!" 
var server = ws.createServer(function (conn) {
    console.log("New connection"); 
    
    conn.on("text", function (data) {
    	var dataObject = JSON.parse(data);
    	if(dataObject.type == "join") {
    		conn.nickName = dataObject.name;

    		sendToAll({
    			type: "status",
    			message: conn.nickName + " has joined the chat."
    		});
    	} else if(dataObject.type == "message") {
    		sendToAll({
    			type: "message",
    			name: conn.nickName,
    			message: dataObject.message
    		});
    	}
        
    });
    conn.on("close", function() {
    	if(conn.nickName) {
    		sendToAll({
    			type: "status",
    			message: conn.nickName + " has left the chat."
    		});
    	}
    });
    conn.on("error", function(e) {
    	console.log("nieoczekiwanie przerwano połączenie");
    });


}).listen(8000, "localhost", function() {
	console.log("Serwer aktywny!");
});

function sendToAll(data) {
	var msg = JSON.stringify(data);
	server.connections.forEach(function(conn){
		conn.sendText(msg);
	});
}
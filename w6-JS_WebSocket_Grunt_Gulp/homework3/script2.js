(function(){
	var chat = {

		join: function(e) {
			console.log(this.getNameInp.value);
			var name = this.getNameInp.value;

			if(name !== "") {
				this.sendData({
					type: "join",
					name: name
				});
			}
		},

		renderRow: function(dataObject) {
			var chatRow = document.createElement("div"),
				chatHr = document.createElement("HR"),
				date = new Date(),
				time = date.getHours() +":"+ date.getMinutes() +":"+ date.getSeconds(),
				message;
				console.log(dataObject);
				if(dataObject.name !== undefined) {
						message = '<span id="time">' + time + '</span><span id="name">' + ' ' + dataObject.name + '</span><span id="txt">' +  dataObject.message + '</span>';
				} else {
					message = '<span id="time">' + time + '</span><span id="name">' + ' <em>' + dataObject.message + '</em></span>';
				}
				chatRow.innerHTML = message;
				this.placeChat.appendChild(chatRow);
				this.placeChat.appendChild(chatHr);
				this.placeChat.scrollTop = this.placeChat.scrollHeight;
		},

		displayMessage: function(e) {
			var dataObject = JSON.parse(e.data);
			this.renderRow(dataObject);
		},

		sendMessage: function() {
			var message = this.getMessage.value;
			if(message !== "") {
				this.sendData({
					type: "message",
					message: message
				});

			this.getMessage.value = "";
			}
		},

		sendData: function(msgObject) {
			var data = JSON.stringify(msgObject);
			this.socket.send(data);
		},

		connectToServer: function() {
			this.socket = new WebSocket('ws://localhost:8000');
			this.socket.onmessage = this.displayMessage.bind(this);
		},

		init: function() {
			if(!window.WebSocket) return;
			this.getNameInp = document.querySelector("#getname");
			console.log(this.getNameInp);
			this.joinButton = document.querySelector("#join1");
			this.placeChat = document.querySelector("#chat");
			this.getMessage = document.querySelector("#gettxt");
			this.sendButton = document.querySelector("#send");
			this.joinButton.addEventListener("click",this.join.bind(this));
			this.sendButton.addEventListener("click",this.sendMessage.bind(this));
			this.connectToServer();
		}
	}
	chat.init();
})();


/*
var join = document.querySelector("#join1");
	join.addEventListener("click", function(){
	var socket = new WebSocket("ws://localhost:8001");
});
*/
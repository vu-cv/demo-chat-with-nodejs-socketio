var express = require('express');
var app = express();
//tất cả mọi req gửi lên đều tìm ở folder public
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", "./views"); // ./ đi về gốc
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(80);

var users = [];

app.get("/", function (req, res) {
	res.render("home");
});

io.on('connection', function(socket) {
	console.log("co nguoi ket noi: " + socket.id);

	socket.on('client-send-username', function(data) {
		console.log(data);
		if (users.indexOf(data) >= 0) {
			socket.emit("server-send-reg-fail");
		} else {
			users.push(data);
			socket.username = data;
			socket.emit("server-send-reg-ok", data);
			io.sockets.emit('server-send-list-user', users);
			console.log(users);
		}
	});

	socket.on('client-send-logout', function() {
		users.splice(users.indexOf(socket.username), 1);
		socket.broadcast.emit('server-send-list-user', users);
		console.log(users);
	});
	socket.on('disconnect', function() {
		users.splice(users.indexOf(socket.username), 1);
		socket.broadcast.emit('server-send-list-user', users);
		console.log(users);
	});

	socket.on('client-send-message', function(data) {
		io.sockets.emit('server-send-message', {usn: socket.username, content: data});
	});

	socket.on('client-send-focusin', function() {
		socket.broadcast.emit('server-send-focusin', socket.username);
		console.log("dang go");
	});
	socket.on('client-send-focusout', function() {
		socket.broadcast.emit('server-send-focusout', socket.username);
		console.log("stop go");
	});


});
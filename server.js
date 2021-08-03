var express = require('express');
var app = express();
var http = require( 'http' ).Server(app);
var io = require('socket.io')(http);
const multer = require('multer');
const path = require('path');

app.use('/src', express.static(__dirname + "/src"));

app.get( '/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

const users = {}


io.on('connection', socket => {
	console.log('new User')
	socket.emit('get-userlist', users)
	
	socket.on('new-user', name => {
		users[socket.id] = name
		socket.broadcast.emit('user-connected', { name: name, id: socket.id })
	})
	socket.on('send-chat-message', message => {
		socket.broadcast.emit('chat-message', { message: message, name: users[socket.id], id: socket.id})
	})
	socket.on('disconnect', () => {
		socket.broadcast.emit('user-disconnected', { name: users[socket.id], id: socket.id })
		delete users[socket.id]
	})
})

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf() + path.extname(file.originalname));
    }
  }),
});

app.post('/uploaded', upload.single('img'), (req, res) => {
	console.log( req.file );
	//res.sendFile(__dirname + '/uploaded.html');
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});
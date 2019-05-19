/*
 * El servidor de la aplicación 
 */

var app = require('express')();

// Maneja los archivos estaticos que estan en el directorio /public
const express = require('express');
const app_ = express();
app.use(express.static(__dirname + '/public'));

/*
 * Se suministra la app al servidor http
 */
var http = require('http').createServer(app);

/* 
 * Se inicializa una instancia del socket pasandole
 * el servidor http como parámetro
 */
var io = require('socket.io')(http);

/*
 * Se define como raíz de ruta a / que será
 * llamado cuando se inicie el sitio web y se provee
 * la página web
 */
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

/*
 * Escucha por los eventos de conexiones
 * y el evento chat message cuando un usuario
 * ha enviado algún mensaje por el chat
 */
io.on('connection', function(socket) {
	console.log("Usuario conectado");
	socket.on('chat message', function(msg) {
		console.log("Mensaje emitido " + msg);
		io.emit('chat message', msg);
	});
	socket.on('login', function(usr) {
		console.log("Usuario logueado: " + usr);
		io.emit('login', usr);
	});
});

/*
 * El servidor escucha en el puerto 8000
 */
http.listen(8000, function() {
	console.log('listening on *:8000');
});
/*
 * El servidor de la aplicación 
 */

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));

var app = require('express')();

/*
 * Se define como raíz de ruta a / que será
 * llamado cuando se inicie el sitio web y se provee
 * la página web
 */
app.get('/', function(req, res) {
	res.sendFile(__dirname + 'index.html');
});

/*
 * Lista de usuarios conectados
 */
var nicks = new Array();

/*
 * Escucha por los eventos de conexiones
 * y el evento chat message cuando un usuario
 * ha enviado algún mensaje por el chat
 */
io.on('connection', function(socket) {
	console.log("Usuario conectado");

	usuarios(socket);
	registrar(socket);
	mensaje(socket);
	desconectar(socket);

	/*socket.emit('mensaje', {text: 'Bienvenido'});
	socket.broadcast.emit('mensaje', {text: 'Un nuevo usuario se ha conectado'});

	socket.on('disconnect', function() {
		console.log("Usuario desconectado");
		socket.broadcast.emit('mensaje', {text: 'Un usuario se ha desconectado'});
	});

	socket.on('login', function(usr) {
		console.log("Usuario logueado: " + usr);
		io.emit('login', usr);
	});

	socket.on('mensaje', function(msg) {
		console.log("Mensaje emitido: " + msg);
		io.emit('linea', msg);
	});*/
});

/*
 * Envía una lista de los usuarios conectados a todos
 * los usuarios
 */
function usuarios(socket) {
	socket.emit('usuarios', {nicks: nicks});
	socket.broadcast.emit('usuarios', {nicks, nicks});
}

/*
 * Registra a un nuevo usuario con la condición que el
 * nick elegido no se haya registrado previamente
 */

function registrar(socket) {
	socket.on('nick', function(data) {
		console.log('Servidor recibe evento de nick');
		var nick = data.nick;
		console.log("Nick del usuario: " + nick);
		if(nicks.indexOf(nick) == -1) { // Usuario no registrado
			nicks.push(nick);
			console.log("Lista de nicks: " + nicks);
			socket.nick = nick;
			socket.emit('nick', {correcto: true, nick: nick}); // Envía el nick al propio usuario
			socket.broadcast.emit('nuevo_usuario', {nick: nick}); // Envía el nick al resto de los usuarios
			usuarios(socket);
		}
		else {
			socket.emit('nick', {correcto: false, nick: nick});
		}
	});
}

/*
 * El servidor espera la llegada de un nuevo mensaje y
 * se lo envía a todos los usuarios
 */
function mensaje(socket) {
	socket.on('mensaje', function(data) {
		if(socket.nick) {
			var mensaje = data.mensaje;
			var nick = socket.nick;
			socket.broadcast.emit('mensaje', {mensaje: mensaje, nick: nick});
		}
	});
}

function desconectar(socket) {
	socket.on('disconnect', function() {
		if(socket.nick) {
			nicks.splice(nicks.indexOf(socket.nick), 1);
			usuarios(socket);
		}
	});
}

/*
 * El servidor escucha en el puerto 8000
 */
server.listen(8000, function() {
	console.log('Servidor ejecutandose en http://localhost:8000');
});
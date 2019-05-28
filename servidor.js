/*
 * El servidor de la aplicación 
 */

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));

var app = require('express')();

// Se define como raíz de ruta a / que será
// llamado cuando se inicie el sitio web y se provee
// la página web
app.get('/', function(req, res) {
	res.sendFile(__dirname + 'index.html');
});

// Lista de usuarios conectados
var usuarios = new Array();

console.log('Servidor iniciado');

// Escucha por los eventos de conexiones
io.on('connection', function(socket) {
	console.log("Usuario conectado");

	enviarUsuarios(socket);
	registrarUsuario(socket);
	enviarMensaje(socket);
	desconectar(socket);
});

// Envía una lista de los usuarios conectados a todos
// los usuarios
function enviarUsuarios(socket) {
	socket.emit('enviarListaUsuarios', {usuarios: usuarios});
	socket.broadcast.emit('enviarListaUsuarios', {usuarios, usuarios});
}

// Registra a un nuevo usuario con la condición que el
// nombre de usuario elegido no se haya registrado previamente
function registrarUsuario(socket) {
	socket.on('nuevoUsuario', function(data) {
		console.log('Servidor recibe evento de nuevoUsuario');
		var usuario = data.usuario;
		console.log("Nombre de usuario: " + usuario);
		if(usuarios.indexOf(usuario) == -1) { // Usuario no registrado
			usuarios.push(usuario);
			console.log('Nombre de usuario no registrado');
			console.log("Lista de usuarios: " + usuarios);
			socket.usuario = usuario;
			console.log('Servidor envía al cliente: ' + usuario + ' el evento enviarUsuario');
			socket.emit('enviarUsuario', {correcto: true, usuario: usuario}); // Envía el nombre de usuario al propio usuario
			console.log('Servidor envía a todos los usuarios el cliente: ' + usuario);
			socket.broadcast.emit('enviarListaUsuarios', {usuario: usuario}); // Envía el nombre de usuario al resto de los usuarios
			enviarUsuarios(socket);
		}
		else {
			console.log('Nombre de usuario ya registrado');
			socket.emit('enviarUsuario', {correcto: false, usuario: usuario});
		}
		console.log('Lista de usuarios ' + usuarios);
	});
}

// El servidor espera la llegada de un nuevo mensaje y
// se lo envía a todos los usuarios
function enviarMensaje(socket) {
	socket.on('enviarMensaje', function(data) {
		if (data.mensaje.trim()){//No Enviar mensajes vacios o solo espacios 
			console.log('Servidor recibe evento de enviarMensaje');
			console.log('Mensaje: ' + data.mensaje);
			var mensaje = data.mensaje;
			var usuario = data.usuario;
			console.log('Servidor emite evento de mensaje');
			socket.emit('mensaje', {mensaje: mensaje, usuario: usuario})
			socket.broadcast.emit('mensaje', {mensaje: mensaje, usuario: usuario});
		}
	});
}

function desconectar(socket) {
	socket.on('disconnect', function() {
		console.log('Usuario: ' + socket.usuario + ' desconectado');
		usuarios.splice(usuarios.indexOf(socket.usuario), 1);
		console.log('Lista de usuarios despúes de desconexion ' + usuarios);
		enviarUsuarios(socket);
	});
}

// El servidor escucha en el puerto 8000
server.listen(8000, function() {
	console.log('Servidor ejecutandose en http://localhost:8000');
});
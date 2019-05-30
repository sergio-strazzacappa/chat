// Carga el cliente de socket.io y crea una variable
// socket global
//var socket = io.connect('http://localhost:8000');
var socket = io();

var nombre = "";

$(document).ready(function() {
    /*******************************/
    /************ LOGIN ************/
    /*******************************/
    console.log('Cliente iniciado');

    // Oculta la interfaz del chat para que
    // el usuario se registre
    $('#caja_usuario').hide();
    $('#caja_chat').hide();
    $('#chat').hide();
    $('#bienvenida').hide();

    // Hace foco en el campo de texto para ingresar
    // el nombre de usuario
    $('#u').focus();

    // Emite un evento de "nuevo_usuario" cuando un usuario
    // se registra
    $('#login').submit(function(e) {
        console.log('Cliente envía su nombre de usuario');

        var usuario = $('#u').val();

        console.log('Nombre de usuario = ' + usuario);
        console.log('Cliente emite: nuevoUsuario');
        socket.emit('nuevoUsuario', {usuario: usuario});
        nombre = usuario;
        e.preventDefault(); // Previene la recarga de la página

        //return false;
    });

    // Verifica si existe el nombre de usuario utilizado
    socket.on('enviarUsuario', function(data) {
        console.log('El cliente: ' + nombre + ' recibe el evento enviarUsuario');
        console.log('Validación del nombre de usuario ' + data.correcto);
        if(data.correcto) {
            console.log('Envío de datos correcto');
            $('#login').hide();
            $('#caja_usuario').show();
            $('#caja_chat').show();
            $('#chat').show();
            $('#bienvenida').show();
            $('#bienvenida').append('<p> Bienvenido/a ' + data.usuario + '</p>');
        }    
        else {
            console.log('Envío de datos incorrecto');
            $('#u').val('');
            usuario = '';
            alert ('Ya existe un usuario con el nombre ' + data.usuario);
        }
    });
});

/*******************************/
/***** USUARIOS CONECTADOS *****/
/*******************************/


// Recibe los usuarios conectados y los agrega al html
socket.on('enviarListaUsuarios', function(data) {
    console.log('Cliente recibe evento "enviarListaUsuarios"');
    var usuarios = data.usuarios;
    console.log("Usuarios recibidos por el cliente: " + usuarios);
    
    $('#lista_usuarios').replaceWith(
        '<ul id="lista_usuarios"> <p> Usuarios conectados: </p> </ul>');

    if(usuarios.length != undefined){
        for(var i = 0; i < usuarios.length; i++) {
            if(usuarios[i] == nombre) {
                $('#lista_usuarios').append('<li id="usuario_propio">' + usuarios[i] + '</li>');
            }
            else {
                $('#lista_usuarios').append('<li class="usuario">' + usuarios[i] + '</li>');
            }
        }
    }
});

/*******************************/
/************ CHAT *************/
/*******************************/

$(function() {
    // Emite un evento de mensaje y borra
    // el mensaje que el usuario envío del campo
    // del chat
    $('#chat').submit(function(e) {
        console.log('Cliente: ' + nombre + ' envía evento de EnviarMensaje');
        e.preventDefault(); // Previene la recarga de la página
        socket.emit('enviarMensaje', {mensaje: $('#m').val(), usuario: nombre});
        $('#m').val('');
        return false;
    });

    socket.on('mensaje', function(data) {
        $('#mensajes').append($('<li class="mensaje">').text(data.usuario + ': ' + data.mensaje));
    });
});
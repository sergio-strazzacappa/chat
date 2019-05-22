// Carga el cliente de socket.io y crea una variable
// socket global
var socket = io.connect('http://localhost:8000');

var nombre = "";

$(document).ready(function() {
    /*******************************/
    /************ LOGIN ************/
    /*******************************/

    // Oculta la interfaz del chat para que
    // el usuario se registre
    $('#caja_chat').hide();
    $('#chat').hide();

    // Hace foco en el campo de texto para ingresar
    // el nombre de usuario
    $('#u').focus();

    // Emite un evento de "nuevo_usuario" cuando un usuario
    // se registra
    $('#login').submit(function(e) {
       //console.log('Emisión del evento nuevo_usuario');

        var usuario = $('#u').val();

        //console.log('Nombre de usuario = ' + usuario);

        socket.emit('nuevo_usuario', {usuario: usuario});
        nombre = usuario;
        e.preventDefault(); // Previene la recarga de la página

        //return false;

        // Verifica si existe el nombre de usuario utilizado
        socket.on('nuevo_usuario', function(data) {
            //console.log('El cliente recibe el evento nuevo_usuario');

            if(data.correcto) {
                $('#bienvenida').append('<p> Bienvenido/a ' + data.usuario + '</p>');
                $('#login').hide();
                $('#caja_chat').show();
                $('#chat').show();
            }
            else {
                alert ('Ya existe un usuario con el nombre ' + data.usuario);
            }
        });
    });
});

// Recibe los usuarios conectados y los agrega al html
socket.on('usuarios', function(data) {
    //console.log('Cliente recibe evento "usuarios"');
    var usuarios = data.usuarios;
    //console.log("Nicks recibidos por el cliente: " + nicks);
    for(var i = 0; i < usuarios.length; i++) {
        $('#lista_usuarios').append('<li class="usuario">' + usuarios[i] + '</li>');
    }
});



    /*socket.on('mensaje', function(data) {
        console.log("Bienvenida a usuario");
        console.log(data);
        $('#mensajes').append($('<li class="mensaje">').text(data.text));
    });

    $('#chat').submit(function(e) {
        e.preventDefault(); // Previene la recarga de la página

        /* 
         * Emite un evento de mensaje y borra
         * el mensaje que el usuario envío del campo
         * del chat
         */
       /* socket.emit('linea', $('#m').val());
        $('#m').val('');
        return false;
    });

    /*
     * Captura el evento de chat message y 
     * agrega el mensaje a la página web
     */
    /*socket.on('linea', function(msg, usr) {
        $('#messages').append($('<li class="linea" style="text-decoration:none">').text(usr + ': ' + msg));
    });*/

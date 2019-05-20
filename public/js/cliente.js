$(function(){

    /*
     * Carga el cliente de socket.io y crea una variable
     * socket global
     */
    var socket = io.connect('http://localhost:8000');

    /***************************/
    /********** LOGIN **********/
    /***************************/

    /* 
     * Recibe los usuarios conectados y los agrega al html
     */
    socket.on('usuarios', function(data) {
        console.log('Cliente recibe evento "usuarios"');
        var nicks = data.nicks;
        console.log("Nicks recibidos por el cliente: " + nicks);

        for(var i = 0; i < nicks.length; i++) {
            $('#lista_usuarios').append('<li class="usuario">' + nicks[i] + '</li>');
        }
    });

    /* 
     * Emite un evento de nick cuando un usuario se registra
     */
    $('#login').submit(function(e) {
        //console.log('Emisión de evento nick');
        var nick = $('#u').val();
        //console.log('Nick = ' + nick);
        socket.emit('nick', {nick: nick});
        e.preventDefault(); // Previene la recarga de la página
        //return false;
    });

    /*
     * Verifica si existe el nick utilizado por el usuario
     */

    socket.on('nick', function(data) {
        console.log('El cliente recibe el evento nick');
        if(data.correcto) {
            $('#bienvenida').append('<p> Bienvenido/a ' + data.nick + '</p>');
            $('#login').hide();
        }
        else {
            alert ('Ya existe un usuario con el nombre ' + data.nick);
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
});
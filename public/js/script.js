$(function() {
    /*
     * Carga el cliente de socket.io y crea una variable
     * socket global
     */
    var socket = io();

    /*
     * Cuando un usuario se loguea se emite un evento de login
     */ 
    $('#login').submit(function() {
        socket.emit("login", $('#u').val());
    });

    $('#chat').submit(function(e) {
        e.preventDefault(); // Previene la recarga de la página

        /* 
         * Emite un evento de chat message y borra
         * el mensaje que el usuario envío del campo
         * del chat
         */
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
        });

        /*
         * Captura el evento de chat message y 
         * agrega el mensaje a la página web
         */
        socket.on('chat message', function(msg, usr) {
            $('#messages').append($('<li class="mensaje" style="text-decoration:none">').text(usr + ': ' + msg));
    });

        /* 
         * Captura el evento de login
         */
         socket.on('login', function(usr) {
            $('#usuario-chat').append($('<li class="mensaje" style="text-decoration:none">').text('hola'));
         });
});
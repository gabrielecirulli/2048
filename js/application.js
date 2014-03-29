// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
    var socket = new Socket(player, opponent);

    var player = new GameManagerII(4, KeyboardInputManager, HTMLActuator, LocalStorageManager, Animator, socket);
    var opponent = new GameManagerII(4, KeyboardInputManager, HTMLActuator, LocalStorageManager, Animator, socket, true);

    socket.setPlayers(player, opponent);
    socket.subscribe();
});

function Socket(player, opponent) {
    this.socket = io.connect('http://two048.herokuapp.com');
}

Socket.prototype.setPlayers = function(player, opponent) {
    this.player = player;
    this.opponent = opponent;
    this.player.opponent = opponent;
    this.opponent.opponent = player;
}

Socket.prototype.subscribe = function() {
    var player = this.player;
    var opponent = this.opponent;

    this.socket.on('gameJoined', function(data) {
        player.grid.build(data.player.cells)
        opponent.grid.build(data.opponent.cells);
        player.actuate();
        opponent.actuate();
    });

    this.socket.on('opponentMoved', function(data) {
        opponent.move(data.direction, data.newTile);
    });

    this.socket.on('gameEnded', function(data) {
        player.over = true;
        player.actuate();
    });
}

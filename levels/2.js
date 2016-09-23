module.exports = {
    init: function () {

    },
    player_definition: [{x:3, y:3}, { x:1, y:1 }, { x:3, y:8 }],
    isFinished: function (players) {
        //var fin = false;
        return players[0].position.x == 8 && players[0].position.y == 1 &&
            players[1].position.x == 1 && players[1].position.y == 1 &&
            players[2].position.x == 3 && players[2].position.y == 2;
    },
    processAction: function (player, action) {
        switch (action.toLowerCase()) {
            case 'up':
            case 'down':
            case 'left':
            case 'right':
                this.movePlayer(player, action);
                return true;
            default:
                return false;
        }
    },
    movePlayer: require('./movePlayer'),
};

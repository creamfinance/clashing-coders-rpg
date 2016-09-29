module.exports = {
    init: function () {

    },
    player_definition: [{ x:1, y:1 }],
    isFinished: function (players) {
        //var fin = false;
        return players[0].position.x == 8 && players[0].position.y == 8;
    },
    processAction: function (player, action, options) {
        options = options || {};

        switch (action.toLowerCase()) {
            case 'up':
            case 'down':
            case 'left':
            case 'right':
                this.movePlayer(player, action, options);
                return true;
            default:
                return false;
        }
    },
    movePlayer: require('./movePlayer'),
};

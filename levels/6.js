module.exports = {
    init: function () {

    },
    player_definition: [{ x:4, y:4 }],
    isFinished: function (players) {
        //var fin = false;
        return players[0].position.x == 478 && players[0].position.y == 488;
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
            case 'interact':
                this.interactPlayer(player);
                return true;
            default:
                return false;
        }
    },
    movePlayer: require('./movePlayer'),
    interactPlayer: require('./interactPlayer'),
};

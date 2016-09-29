module.exports = {
    init: function () {
        this.players[0].inventory.keys = 0;
    },
    player_definition: [{ x:1, y:99 }],
    isFinished: function (players) {
        //var fin = false;
        return players[0].position.x == 95 && players[0].position.y == 5;
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

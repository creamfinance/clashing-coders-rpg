module.exports = {
    init: function () {
        this.players[0].inventory.apples = 0;
    },
    player_definition: [{ x:99, y:99 }],
    isFinished: function (players) {
        //var fin = false;
        return players[0].inventory.apples == 15 && players[0].steps <= 400; //steps <= 900
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

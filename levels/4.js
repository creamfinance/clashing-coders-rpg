module.exports = {
    init: function () {

    },
    player_definition: [{ x:1, y:1 }],
    isFinished: function (players) {
        //var fin = false;
        return players[0].position.x == 193 && players[0].position.y == 193; //steps <= 900
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

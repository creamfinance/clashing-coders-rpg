module.exports = {
    init: function () {

    },
    player_definition: [{x: 3, y: 16}],
    isFinished: function (players) {
        return players[0].position.x == 595 && players[0].steps <= 650;
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

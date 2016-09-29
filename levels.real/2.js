module.exports = {
    init: function () {

    },
    player_definition: [{x: 5, y: 5}],
    isFinished: function (players) {
        return players[0].position.x >= 51 &&
          players[0].position.x <= 58 &&
            players[0].position.y >= 60 &&
            players[0].position.y <= 68;
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

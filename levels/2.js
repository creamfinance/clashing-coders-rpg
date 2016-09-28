module.exports = {
    init: function () {

    },
    player_definition: [{x: 3, y: 3}],
    isFinished: function (players) {
        //var fin = false;
        return players[0].position.x == 138 && players[0].position.y == 139 && players[0].steps <= 600; //step kleiner whatever
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

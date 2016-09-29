6,5 358,369
module.exports = {
    init: function () {
        this.players[0].inventory.wood = 70;
    },
    player_definition: [{ x:6, y:5 }],
    isFinished: function (players) {
        //var fin = false;
        return players[0].position.x == 358 && players[0].position.y == 369;
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

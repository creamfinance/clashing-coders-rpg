var redis = require('../redis');

module.exports = function PlayerResolver(request, next) {
    var player_id = request.variables.PLAYER_ID;

    if (player_id in request.user.players) {
        request.player = request.user.players[player_id];
        next();
    } else {
        request.sendUnauthorized();
    }
}

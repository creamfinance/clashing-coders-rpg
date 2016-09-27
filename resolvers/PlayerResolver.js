var redis = require('../redis');

module.exports = function PlayerResolver(request, next) {
    var player_id = 0;

    if (player_id in request.user.players) {
        request.player = request.user.players[player_id];
        next();
    } else {
        request.sendUnauthorized();
    }
}

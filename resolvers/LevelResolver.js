var levels = require('../repositories/LevelRepository'),
    redis = require('../redis');

function clearedLevel(user, level_id) {
    return level_id in user.level_metadata && user.level_metadata[level_id].finished !== null;
}

module.exports = function LevelResolver(request, next) {
    var level_id = 'variables' in request ? request.variables.LEVEL_ID : null;

    if (request.user.current_level) {
        request.level = request.user.current_level;
        next();
    } else if (level_id) {
        if (level_id == 1) {
            request.level = levels.get(level_id);
            next();
            return;
        }

        // if (clearedLevel(request.user, level_id - 1)) {
            return next();
        // } else {
        //     return request.sendUnauthorized();
        // }
    } else {
        return request.sendUnauthorized();
    }
}

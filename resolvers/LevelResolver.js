var levels = require('../repositories/LevelRepository'),
    redis = require('../redis');

function clearedLevel(user, level_id) {
    return level_id in user.level_metadata && user.level_metadata[level_id].finished !== null;
}

module.exports = function LevelResolver(request, next) {
    var level_id = request.variables.LEVEL_ID;

    if (level_id == 1) {
        request.level = levels.get(level_id);
        next();
        return;
    }

    redis.get(request.user.id + '.' + (level_id - 1), function (err, data) {
        if (err) {
            request.log(err);
            request.appendInfo('Redis error');
            return request.sendUnauthorized();
        }

        if (!data) {
            request.appendInfo('Token not found');
            return request.sendUnauthorized();
        }
        
        data = JSON.parse(data);
        if (data.finished === null) {
            return request.sendUnauthorized();
        }

        request.level = levels.get(request.variables.LEVEL_ID);
        next();
    });
    // Check if the user can actually access that level.
    // He can only do so for either the first level or if he has cleared the last level.
    //if (level_id != 1 && !clearedLevel(request.user, level_id - 1)) {
        //return request.sendUnauthorized();
    //}

}

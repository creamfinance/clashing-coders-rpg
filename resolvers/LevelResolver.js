/*
    Clashing Coders RPG Platform - The platform used for Creamfinance's first coding contest.
    Copyright (C) 2016 Florian Proksch

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

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
        if (level_id > 10) {
            return request.sendUnauthorized();
        }

        if (level_id == 1) {
            request.level = levels.get(level_id);
            next();
            return;
        }

        if (clearedLevel(request.user, level_id - 1)) {
            return next();
        } else {
            return request.sendUnauthorized();
        }
    } else {
        return request.sendUnauthorized();
    }
}

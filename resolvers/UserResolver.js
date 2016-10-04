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

var redis = require('../redis'),
    users = require('../repositories/UserRepository'),
    Player = require('../game/player');

module.exports = function UserResolver(request, next) {
    if ('x-token' in request.req.headers) {
        redis.get(request.req.headers['x-token'], function (err, data) {
            if (err) {
                request.log(err);
                request.appendInfo('Redis error');
                return request.sendUnauthorized();
            }

            if (!data) {
                request.appendInfo('Token not found');
                return request.sendUnauthorized();
            }

            request.user = users.users[data];
            next();
        });
    } else if ('USER_ID' in request.variables) {
        request.user = users.users[request.variables.USER_ID];

        if (!request.user) {
            return request.sendUnauthorized();
        }

        next();
    } else if ('EMAIL' in request.variables) {
        request.user = users.getWithEmail(request.variables.EMAIL);

        if (!request.user) {
            return request.sendUnauthorized();
        }

        next();
    } else {
        return request.sendUnauthorized();
    }
};

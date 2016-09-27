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

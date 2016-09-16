var redis = require('../redis'),
    users = require('../users');

module.exports = function UserResolver(request, next) {
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

        var data = JSON.parse(data);

        request.user = users.users[data.id];

        next();
    });
};

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

var Class = require('class'),
    bcrypt = require('bcrypt'),
    crypto = require('crypto'),
    pool = require('../pool'),
    redis = require('../redis'),
    users = require('../repositories/UserRepository');

var AuthenticationController = Class.bind(null, 'AuthenticationController', Object);

module.exports = AuthenticationController({
    constructor: function () {

    },
    /**
     * TODO: document
     *
     */
    registerRouter: function registerRouter(router) {
        router.registerPath('POST', '/authenticate',
            {
                requests: [
                    {
                        headers: new Validator({
                            'content-type': new EnumRule([ 'application/json' ]),
                        }),
                        body: new Validator({
                            'username': new RequiredRule(),
                            'password': new RequiredRule(),
                        }),
                        callback: this.handleAuthentication.bind(this)
                    },
                ],
            }
        );
    },

    /**
     * TODO: document
     *
     * @param request @todo
     * @param data @todo
     */
    handleAuthentication: function handleAuthentication(request) {
        var data = request.post;

        redis.get('open-registration', function (err, result) {
            if (err) {
                request.log(err);
                request.appendInfo('Redis error');
                return request.sendUnauthorized();
            }

            if (!data) {
                request.appendInfo('Token not found');
                return request.sendUnauthorized();
            }

            console.log(result);
            if (result == 'true') {
                pool.connect(function (err, client, done) {
                    client.query('SELECT * FROM users WHERE username = $1',
                        [ data.username ], function (err, result) {
                            var user = result.rows[0];

                            done();

                            if (user) {
                                if (data.password === user.password) {
                                    users.users[user.id] = user;

                                    var access_token = new Buffer(
                                        user.id + '-'
                                        + Date.now()
                                        + '-' + crypto.randomBytes(16).toString('hex')
                                    ).toString('base64');

                                    // save access token to redis
                                    redis.set(access_token, user.id, function (err, result) {
                                        if (err) {
                                            console.log('ERROR')
                                            request.log(err);
                                            request.appendInfo('Redis error: ' + err);
                                            return request.sendInternalServerError();
                                        }

                                        request.sendResponse({
                                            access_token: access_token
                                        });
                                    });
                                } else {
                                    return request.sendUnauthorized();
                                }
                            } else {
                                return request.sendUnauthorized();
                            }
                    });
                });
            } else {
                return request.sendUnauthorized();
            }
        });
    },
});

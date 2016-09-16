var Class = require('class'),
    bcrypt = require('bcrypt'),
    crypto = require('crypto'),
    pool = require('../pool'),
    redis = require('../redis');

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

        pool.connect(function (err, client, done) {
            client.query('SELECT * FROM users WHERE username = $1', 
                [ data.username ], function (err, result) {
                    var user = result.rows[0];

                    done();

                    if (user) {
                        bcrypt.compare(data.password, user.password, function (err, res) {
                            if ( ! err && res === true) {
                                var access_token = new Buffer(
                                    user.id + '-' 
                                    + Date.now() 
                                    + '-' + crypto.randomBytes(16).toString('hex')
                                ).toString('base64');
                                var access_token_data = {
                                    id: user.id
                                };

                                // save access token to redis
                                redis.set(access_token, JSON.stringify(access_token_data), function (err, result) {
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
                        });
                    } else {
                        return request.sendUnauthorized();
                    }
            });
        });
    },
});

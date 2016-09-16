var crypto = require('crypto');
var url = require('url');
var Request = require('./request.js');

module.exports = Class('AdvancedRequest', Request, {
    constructor: function (req, res) {
        this.startPrecise = process.hrtime();
        this.infos = [];
        this.handlers = [];

        this.__callParent('constructor', req, res);
    },
    /*
     * Generates a new random token for the specified
     * name, saves it to the cache and into redis
     * then continues with the request if no callback is set
     */
    generateNewToken: function (name, callback) {
        var request = this;
        var newToken = crypto.randomBytes(10).toString('hex');
        
        if (!this.session) {
            this.session = {};
        }
        
        this.session[name] = newToken;
        this.redis.hset(
            this.session_id,
            name,
            newToken,
            function () {
                if (callback) {
                    callback();
                } else {
                    request.next();
                }
            }
        );
    },
    getToken: function (name, callback) {
        var request = this;
        request.redis
            .multi()
            .hget(request.session_id, name)
            .hset(request.session_id, name, null)
            .exec(function (err, reply) {
                request.session[name] = reply[0];
                callback();
            });
    },
    clearToken: function (name, callback) {
        this.redis.hdel(
            this.session_id,
            name,
            function (err, reply) {
                callback();
            }
        );
    },
    isTokenValid: function (name) {
        return this.post &&
            name in this.post &&
            this.post[name] == this.session[name];
    },
    validateToken: function (name, callback, errCallback) {
        var that = this;
        this.getToken(name, function () {
            if (that.isTokenValid(name)) {
                that.generateNewToken(name, function () {
                    callback();
                });
            } else {
                that.generateNewToken(name, function () {
                    errCallback();
                });
            }
        });
    },
    handle: function () {
        this.handlerArguments = Array.prototype.slice.call(arguments);
        this.handlerIndex = -1;
        this.next();
    },
    next: function () {
        this.handlerIndex++;
        if (this.handlerIndex < this.handlers.length) {
            var handler = this.handlers[this.handlerIndex];
            var args = [ this ].concat(this.handlerArguments);
            handler.handle.apply(handler, args);
        } else {
            // We have no other handler
            this.end();
        }
    },
    has: function (parameter) {
        return parameter in this.query.query;
    },
    get: function (parameter) {
        return this.query.query[parameter];
    },
    parseGetData: function () {
        var path = url.parse(this.req.url, true);

        this.get = path.query;
    },
    canParsePostData: function () {
        return this.req.method == 'POST' &&
            'content-type' in this.req.headers &&
            this.req.headers['content-type'].toLowerCase().indexOf('application/x-www-form-urlencoded') == 0;
    },
    canParseJsonData: function () {
        return this.req.method == 'POST' &&
            'content-type' in this.req.headers &&
            this.req.headers['content-type'].toLowerCase().indexOf('application/json') == 0;
    },
    parsePostData: function (callback) {
        this.req.on('data', this.handleData.bind(this));
        this.req.on('end', function () {
            this.parseDataPost();
            callback();
        }.bind(this));
    },
    parseJsonData: function (callback) {
        this.req.on('data', this.handleData.bind(this));
        this.req.on('end', function () {
            try {
                this.post = JSON.parse(this.data);
                callback();
            } catch (ex) {
                callback(true, ex);
            } 
        }.bind(this));  
    },
    head: function (code, content) {
        code = code || 200;
        content = content || 'text/html; charset=utf-8';
        
        var headers = this.headers || {};
        
        headers['Content-Type'] = content;

        this.res.writeHead(
            code,
            headers
        );
    },
    appendInfo: function (info) {
        this.infos.push(info);
    },
    end: function () {
        if (!this.stop) {
            this.res.end();

            var timing = process.hrtime(this.startPrecise);
        
            var infoStr = '';
            for (var i = 0; i < this.infos.length; i++) {
                if (i != 0) {
                    infoStr += ', ';
                }
                
                infoStr += this.infos[i];
            }

            log(this.res.statusCode + ' - ' + this.req.method + ' ' + this.req.url + ' (' + infoStr + ') took ' + (parseFloat(timing[0] * 1000) + parseFloat(timing[1] / 1e6)) + ' ms');
        }
    }
});

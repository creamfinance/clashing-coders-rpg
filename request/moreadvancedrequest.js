var crypto = require('crypto');
var os = require('os');

var requestCounter = 0;
var startup = Date.now();
var hostname = os.hostname() + ':' + process.pid;

var AdvancedRequest = require('./advancedrequest');

var MoreAdvancedRequest = Class.bind(null, 'MoreAdvancedRequest', AdvancedRequest);

module.exports = MoreAdvancedRequest({
    constructor: function (req, res) {
        this.__callParent('constructor', req, res);

        this.context = null;

        requestCounter++;

        var hash = crypto.createHash('md5');

        hash.update(hostname + '-' + startup + '-' + requestCounter);

        this.identifier = 'req-' + hash.digest('hex');
        this.res.setHeader('X-Backend-Server', hostname);
        this.res.setHeader('X-Request-Identifier', this.identifier)

        this.appendInfo(this.identifier);
    },
    log: function () {
        // var args = Array.prototype.slice.apply(arguments);
        // var line = Log.prepare(args);
        // line = '[' + this.identifier + '] ' + line;
        // Log.info(line);
        console.log(arguments);
    },
    addTiming: function () {
        var timing = process.hrtime(this.startPrecise);
        this.res.setHeader('X-Request-Timing', (parseFloat(timing[0] * 1000) + parseFloat(timing[1] / 1e6)) + ' ms');
    },
    sendSuccess: function () {
        this.addTiming();
        this.res.writeHead(200);
        this.end();
    },
    sendUnauthorized: function () {
        this.addTiming();
        this.res.writeHead(401);
        this.end();
    },
    sendForbidden: function () {
        this.addTiming();
        this.res.writeHead(403);
        this.end();
    },
    sendNotFound: function () {
        this.addTiming();
        this.res.writeHead(404);
        this.end();
    },
    sendInternalServerError: function () {
        this.addTiming();
        this.res.writeHead(500);
        this.end();
    },
    sendNotImplemented: function () {
        this.addTiming();
        this.res.writeHead(501);
        this.end();
    },
    sendTooManyRequests: function () {
        this.addTiming();
        this.res.writeHead(429);
        this.end();
    },
    sendInvalidRequest: function (content) {
        if (content) {
            this.res.setHeader('Content-Type', 'application/json');
        }

        this.addTiming();
        this.res.writeHead(400);
        
        if (content) {
            this.write(content);
        }

        this.end()
    },
    sendException: function (exception) {
        this.addTiming();
        this.head(200, 'application/json');
        this.write(JSON.stringify({ error: exception }));
        this.jsonResponse = null;
        this.end();

        return true;
    },
    appendResponse: function (data) {
        if (!this.jsonResponse) {
            this.jsonResponse = {};
        }

        this.jsonResponse.appendRecursive(data);
    },
    sendResponse: function (data) {
        if (data) {
            this.appendResponse(data);
        }
        
        this.addTiming();
        this.head(200, 'application/json');
        this.write(JSON.stringify(this.jsonResponse));
        this.jsonResponse = null;
        this.end();

        return true;
    },
    end: function () {
        if (this.jsonResponse) {
            this.sendResponse();
            return;
        }

        if (!this.res.headersSent) {
            this.addTiming();
        }

        if (this.context) {
            if (this.context && this.context.requestDone) {
                this.context.requestDone(this);
            }
        }

        this.__callParent('end');
    }
});

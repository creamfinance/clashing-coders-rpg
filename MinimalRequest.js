var ip = require('ip');
var Class = require('class');
var MinimalRequest = Class.bind(null, 'MinimalRequest', Object);

module.exports = MinimalRequest({
    constructor: function (req, res, time) {
        this.req = req;
        this.res = res;

        this.startPrecise = time; 

        this.handleIp();
    },
    handleIp: function () {
        var forwardedFor = this.req.headers['x-forwarded-for'];
        var remoteAddr = this.req.connection.remoteAddress

        if (forwardedFor && Config.trustedProxies.indexOf(remoteAddr) !== -1) {
            this.ipaddress = forwardedFor;
        } else {
            this.ipaddress = this.req.connection.remoteAddress;
        }
    },
    sendTooManyRequests: function () {
        this.res.writeHead(429);
        this.res.end();
    },
});

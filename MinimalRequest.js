/*
    Clashing Coders RPG Platform - The platform used for Creamfinance's first coding contest.
    Copyright (C) 2016 Thomas Rosenstein

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

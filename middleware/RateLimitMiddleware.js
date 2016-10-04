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

var MoreAdvancedRequest = require('../request/moreadvancedrequest'),
    Middleware = require('./middleware'),
    RateLimiter = require('limiter').RateLimiter;
var RateLimitMiddleware = Class.bind(null, 'RateLimitMiddleware', Middleware);

module.exports = RateLimitMiddleware({
    constructor: function (settings) {
        this.settings = settings;
        this.rateLimiters = {};

        this.cleanupInterval = setInterval(this.cleanup.bind(this), 1000);
    },
    cleanup: function () {
        for (var ip in this.rateLimiters) {
            var state = this.rateLimiters[ip];

            // timeout all rate limiters after an hour
            if ((state.lastRequest + 3600 * 1000) < Date.now()) {
                delete this.rateLimiters[ip];
            }
        }
    },
    handle: function (request) {
        var that = this;
        var ip = request.ipaddress;

        if (!(ip in this.rateLimiters)) {
            this.rateLimiters[ip] = {
                rateLimiter: new RateLimiter(this.settings.requests, this.settings.time, true)
            };
        }

        var rateLimit = this.rateLimiters[ip];
        rateLimit.lastRequest = Date.now();
        rateLimit.rateLimiter.removeTokens(1, function (err, remainingTokens) {

            if (err || remainingTokens == -1) {
                return request.sendTooManyRequests();
            }

            // Upgrade the request to something more useful ;)
            request = new MoreAdvancedRequest(request.req, request.res);

            that.__callParent('handle', request);
        });
    },
});

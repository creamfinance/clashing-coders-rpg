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
    waiter = require('../util/waiter'),
    UserRepository = require('../repositories/UserRepository'),
    buildVariableDefinition = require('../util/buildVariableDefinition'),
    Templates = require('../templates');

var MetagameController = Class.bind(null, 'MetagameController', Object);

module.exports = MetagameController({
    constructor: function () {

    },
    registerRouter: function (router) {
        router.registerPath('GET', '/game/stats',
            {
                requests: [
                    {
                        headers: new Validator({
                            'content-type': new EnumRule([ 'application/json' ]),
                        }),
                        body: new Validator({}),
                        resolver: [ ],
                        callback: this.handleGetStats.bind(this),
                    },
                    {
                        headers: new Validator({ }),
                        body: new Validator({}),
                        resolver: [ ],
                        callback: this.handleGetStatsView.bind(this),
                    },
                ],
            }
        );

        router.registerPath('GET', '/game/stats/{LEVEL_ID}',
            {
                requests: [
                    {
                        headers: new Validator({
                            'content-type': new EnumRule([ 'application/json' ]),
                        }),
                        body: new Validator({}),
                        resolver: [ ],
                        callback: this.handleGetStatsForLevel.bind(this),
                    },
                    {
                        headers: new Validator({ }),
                        body: new Validator({}),
                        resolver: [ ],
                        callback: this.handleGetStatsForLevelView.bind(this),
                    },
                ],
                variables: buildVariableDefinition({
                    'LEVEL_ID': [ new IntegerRule() ],
                }),
            }
        );
    },

    /**
     * TODO: document
     * 
     * @param request @todo 
     */
    handleGetStats: function handleGetStats(request) {
        UserRepository.getStats(function (result) {
            request.sendResponse(result);
        });
    },

    /**
     * TODO: document
     * 
     * @param request @todo 
     */
    handleGetStatsView: function handleGetStatsView(request) {
        UserRepository.getStats(function (result) {
            request.write(Templates.get('stats')({ users: result }));
            request.end();
        });
    },
    
    /**
     * TODO: document
     * 
     * @param request @todo 
     */
    handleGetStatsForLevel: function handleGetStatsForLevel(request) {
        UserRepository.getStatsForLevel(request.variables.LEVEL_ID, function (result) {
            request.sendResponse(result);
        });
    },
    
    /**
     * TODO: document
     * 
     * @param request @todo 
     */
    handleGetStatsForLevelView: function handleGetStatsForLevel(request) {
        UserRepository.getStatsForLevel(request.variables.LEVEL_ID, function (result) {
            request.write(Templates.get('stats')({ users: result, level: request.variables.LEVEL_ID }));
            request.end();
        });
    },
});

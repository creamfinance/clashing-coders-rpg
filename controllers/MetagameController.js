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
            console.log(result);
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

var Class = require('class'),
    waiter = require('../util/waiter'),
    UserRepository = require('../repositories/UserRepository'),
    buildVariableDefinition = require('../util/buildVariableDefinition');

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

                        }),
                        body: new Validator({}),
                        resolver: [ ],
                        callback: this.handleGetStats.bind(this),
                    },
                ],
            }
        );

        router.registerPath('GET', '/game/stats/{LEVEL_ID}',
            {
                requests: [
                    {
                        headers: new Validator({ }),
                        body: new Validator({}),
                        resolver: [ ],
                        callback: this.handleGetStatsForLevel.bind(this),
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
            console.log(result);
            request.sendResponse(result);
        });
    },
    /**
     * TODO: document
     * 
     * @param request @todo 
     */
    handleGetStatsForLevel: function handleGetStatsForLevel(request) {
        UserRepository.getStatsForLevel(request.variables.LEVEL_ID, function (result) {
            console.log(result);
            request.sendResponse(result);
        });
    },
    
});

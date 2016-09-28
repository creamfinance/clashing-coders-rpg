var Class = require('class'),
    LevelResolver = require('../resolvers/LevelResolver'),
    UserResolver = require('../resolvers/UserResolver'),
    ActionResolver = require('../resolvers/ActionResolver'),
    PlayerResolver = require('../resolvers/PlayerResolver'),
    Player = require('../game/player'),
    waiter = require('../util/waiter'),
    UserRepository = require('../repositories/UserRepository'),
    LevelRepository = require('../repositories/LevelRepository'),
    tiles = require('../game/tiles'),
    tiles_map = require('../game/tiles').map(function (n, c) {
        n[this[c].prototype.display] = {
            name: c,
            weight: this[c].prototype.weight
        }; return n;
    }),
    buildVariableDefinition = require('../util/buildVariableDefinition');

var QuestController = Class.bind(null, 'QuestController', Object);

module.exports = QuestController({
    constructor: function () {

    },
    registerRouter: function (router) {
        router.registerPath( 'GET', '/level/{LEVEL_ID}',
            {
                requests: [
                    {
                        headers: new Validator({
                            'content-type': new EnumRule([ 'application/json' ]),
                            'x-token': new RequiredRule(),
                        }),
                        body: new Validator({}),
                        resolver: [
                            UserResolver, LevelResolver
                        ],
                        callback: this.handleGetLevelInformation.bind(this)
                    },
                ],
                variables: buildVariableDefinition({
                    'LEVEL_ID': [ new IntegerRule() ],
                }),
            }
        );

        router.registerPath('POST', '/level/{LEVEL_ID}/start',
            {
                requests: [
                    {
                        headers: new Validator({
                            'content-type': new EnumRule([ 'application/json' ]),
                            'x-token': new RequiredRule(),
                        }),
                        body: new Validator({}),
                        resolver: [
                            UserResolver, LevelResolver
                        ],
                        callback: this.handleStartLevel.bind(this)
                    }
                ],
                variables: buildVariableDefinition({
                    'LEVEL_ID': [ new IntegerRule() ],
                }),
            }
        );

        router.registerPath('POST', '/level/{LEVEL_ID}/end',
            {
                requests: [
                    {
                        headers: new Validator({
                            'content-type': new EnumRule([ 'application/json' ]),
                            'x-token': new RequiredRule(),
                        }),
                        body: new Validator({}),
                        resolver: [
                            UserResolver, LevelResolver
                        ],
                        callback: this.handleEndLevel.bind(this),
                    }
                ],
                variables: buildVariableDefinition({
                    'LEVEL_ID': [ new IntegerRule() ],
                }),
            }
        );

        router.registerPath( 'GET', '/player/status',
            {
                requests: [
                    {
                        headers: new Validator({
                            'content-type': new EnumRule([ 'application/json' ]),
                            'x-token': new RequiredRule(),
                        }),
                        body: new Validator({}),
                        resolver: [
                            UserResolver, LevelResolver
                        ],
                        callback: this.handleGetStatus.bind(this)
                    },
                ],
            }
        );

        router.registerPath('PUT', '/player/{ACTION}',
            {
                requests: [
                    {
                        headers: new Validator({
                            'content-type': new EnumRule([ 'application/json' ]),
                            'x-token': new RequiredRule(),
                        }),
                        body: new Validator({}),
                        resolver: [
                            UserResolver, LevelResolver, PlayerResolver//, ActionResolver
                        ],
                        callback: this.handleAction.bind(this),
                    }
                ],
                variables: buildVariableDefinition({
                    'PLAYER_ID': [ new IntegerRule() ],
                    'ACTION': [ ],
                }),
            }
        );

    },
    handleGetLevelInformation: function (request) {

    },
    handleStartLevel: function (request) {
        var wait;

        // Only allow starting the level if the level has not been finished already
        if (!(request.variables.LEVEL_ID in request.user.level_metadata) ||
            request.user.level_metadata[request.variables.LEVEL_ID].finished === null) {

            var level = LevelRepository.get(request.variables.LEVEL_ID),
                m = new Array(level.map.length);

            for (var i = 0, max = level.map.length; i < max; i += 1) {
                m[i] = ''
                for (var j = 0, jmax = level.map[i].length; j < jmax; j += 1) {
                    m[i] += level.map[i][j].display;
                }
            }

            // Initialize Players
            request.user.players = level.players;

            // Store level as current for that user
            request.user.current_level = level;

            // Create a new metadata entry for that level for that user
            UserRepository.createMetadata(request.user, request.variables.LEVEL_ID);

            request.sendResponse({
                width: level.width,
                height: level.height,
                tileset: level.tileset,
                map: m,
                players: level.players,
            });
        } else {
            request.sendResponse({
                error: 'You already cleared this level!'
            });
        }
    },
    handleGetStatus: function (request) {
        if (! request.level) {
            request.sendUnauthorized();
            return;
        }

        request.sendResponse(request.level.players);
    },
    handleAction: function (request) {
        if (! request.player) {
            request.sendUnauthorized();
            return;
        }

        // Let the level itself process the action, as different actions are possible
        // in different levels.
        if (request.level.action(request.player, request.variables.ACTION, request.post)) {
            request.sendSuccess();
        } else {
            request.sendResponse({
                error: 'not a valid action'
            });
        }
    },
    handleEndLevel: function (request) {
        if (! request.user.players) {
            return request.sendUnauthorized();
        }

        request.user.players = null;
        request.user.current_level = null;

        // Clean players
        // Check if winning conditions are met
        if (request.level.isFinished(request.level.players, request)) {
            request.user.level_metadata[request.variables.LEVEL_ID].finished = new Date();

            UserRepository.finish(request.user, request.variables.LEVEL_ID);

            request.sendResponse({
                result: 'level cleared!'
            });

        // If not, we update the failcount and return
        } else {
            UserRepository.fail(request.user, request.variables.LEVEL_ID);
            request.user.level_metadata[request.variables.LEVEL_ID].num_fails += 1;

            request.sendResponse({
                error: 'goal not met!',
                messages: request.level.messages,
                log: request.level.log
            });
        }
    },
});

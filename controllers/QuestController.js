var Class = require('class'),
    LevelResolver = require('../resolvers/LevelResolver'),
    UserResolver = require('../resolvers/UserResolver'),
    ActionResolver = require('../resolvers/ActionResolver'),
    PlayerResolver = require('../resolvers/PlayerResolver'),
    Player = require('../game/player'),
    waiter = require('../util/waiter'),
    UserRepository = require('../repositories/UserRepository'),
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

        router.registerPath( 'GET', '/level/{LEVEL_ID}/status',
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
                        // TODO: implement
                        callback: this.handleGetLevelInformation.bind(this)
                    },
                ],
                variables: buildVariableDefinition({
                    'LEVEL_ID': [ new IntegerRule() ],
                }),
            }
        );

        router.registerPath('PUT', '/player/{PLAYER_ID}/{ACTION}',
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
        var layout = request.level.map.definition.slice(0),
            position;

        // Replace player positions.
        if (request.user.players) {
            for (var i = 0, max = request.user.players.length; i < max; i += 1) {
                position = request.user.players[i].position;
                layout[position.y] = layout[position.y].replaceAt(position.x, i.toString());
            }
            console.log(layout);
        }

        request.sendResponse({
            width: request.level.map.width,
            height: request.level.map.height,
            tileset: tiles_map,
            layout: layout.join('\n'),
        });
    },
    handleStartLevel: function (request) {
        var wait;

        if (request.user.players) {
            request.sendResponse({
                error: 'already started!'
            });
            return;
        }

        // Initialize Players
        request.user.players = new Array(request.level.start.length);
        for (var i = 0, max = request.level.start.length; i < max; i += 1) {
            request.user.players[i] = new Player(request.level.start[i]);
        }
        //UserRepository.savePlayers(request.user, request.user.players);

        // Store level as current for that user
        request.user.current_level = request.level;

        // Create a new metadata entry for that level for that user
        UserRepository.createMetadata(request.user, request.variables.LEVEL_ID);

        request.sendSuccess();
    },
    handleAction: function (request) {
        if (! request.player) {
            request.sendUnauthorized();
            return;
        }

        // Let the level itself process the action, as different actions are possible
        // in different levels.
        if (request.level.processAction(request.player, request.variables.ACTION)) {
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

        // Check if winning conditions are met
        if (request.level.isFinished(request.user.players)) {

            // Clean players
            request.user.players = null;

            request.user.level_metadata[request.variables.LEVEL_ID].finished = new Date();

            // Update metadata with finishing time and fails
            UserRepository.updateMetadata(request.user, request.variables.LEVEL_ID, 
                request.user.level_metadata[request.variables.LEVEL_ID]);

            request.sendResponse({
                result: 'level cleared!'
            });

        // If not, we update the failcount and return
        } else {
            // TODO: maybe store in database?
            request.user.level_metadata[request.variables.LEVEL_ID].num_fails += 1;

            request.sendResponse({
                error: 'goal not met!'
            });
        }
    },
});

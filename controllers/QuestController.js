var Class = require('class'),
    LevelResolver = require('../resolvers/LevelResolver'),
    UserResolver = require('../resolvers/UserResolver'),
    ActionResolver = require('../resolvers/ActionResolver'),
    tiles = require('../game/tiles'),
    Player = require('../game/player'),
    UserRepository = require('../repositories/UserRepository'),
    tiles_map = Object.keys(tiles).reduce(function (n, c) 
        { n[tiles[c].prototype.display] = {
            name: c,
            weight: tiles[c].prototype.weight
        }; return n; }, {}),
    buildVariableDefinition = function (vars) {
        var ret = {},
            immediate = {};

        for (var vname in vars) {
            immediate = {};

            vars[vname].unshift(new RequiredRule());
            
            immediate[vname] = vars[vname];
            ret[vname] = new Validator(immediate);
        }

        return ret;
    };

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

        router.registerPath('PUT', '/level/{LEVEL_ID}/{ACTION}',
            {
                requests: [
                    {
                        headers: new Validator({
                            'content-type': new EnumRule([ 'application/json' ]),
                            'x-token': new RequiredRule(),
                        }),
                        body: new Validator({}),
                        resolver: [
                            UserResolver, LevelResolver//, ActionResolver
                        ],
                        callback: this.handleAction.bind(this),
                    }
                ],
                variables: buildVariableDefinition({
                    'LEVEL_ID': [ new IntegerRule() ],
                    'ACTION': [ ],
                }),
            }
        );

    },
    handleGetLevelInformation: function (request) {
        var layout = request.level.map.definition.slice(0),
            position;

        if (request.user.player) {
            position = request.user.player.position;
            layout[position.y] = layout[position.y].replaceAt(position.x, 'P');
        }

        request.sendResponse({
            width: request.level.map.width,
            height: request.level.map.height,
            tileset: tiles_map,
            layout: layout.join('\n'),
        });
    },
    handleStartLevel: function (request) {
        if (request.user.player) {
            request.sendResponse({
                error: 'already started!'
            });
            return;
        }

        request.user.player = new Player(request.level.start);
//        request.user.level_metadata[request.variables.LEVEL_ID] = {
//            started: new Date(),
//            finished: null,
//            points: null,
//            num_fails: 0,
//        };
        request.user.level_metadata[request.variables.LEVEL_ID] = 
            UserRepository.createMetadata(request.user, request.variables.LEVEL_ID, cb);

        request.sendSuccess();
    },
    handleAction: function (request) {
        if (! request.user.player) {
            request.sendUnauthorized();
            return;
        }

        if (request.level.processAction(request.user.player, request.variables.ACTION)) {
            request.sendSuccess();
        } else {
            request.sendResponse({
                error: 'not a valid action'
            });
        }
    },
    handleEndLevel: function (request) {
        if (! request.user.player) {
            request.sendUnauthorized();
        }

        if (request.level.isFinished(request.user.player)) {
            request.user.player = null;
            request.user.level_metadata[request.variables.LEVEL_ID].finished = new Date();
            request.sendSuccess();
        } else {
            // TODO: add penalty
            // request.user.player.time += 4;
            
            request.sendResponse({
                error: 'goal not met!'
            });
        }

    },
});

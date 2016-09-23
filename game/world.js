var Player = require('./player');

var World = module.exports = function World(level, players) {
    //Mixin level definitions
    for (var key in level) {
        this[key] = level[key];
    }
    this.init();

    this.width = this.map_definition.width;
    this.height = this.map_definition.height;
    this.map = new Array(this.height);

    this.players = new Array(this.player_definition.length);
    for (var i = 0, imax = this.player_definition.length; i < imax; i += 1) {
        this.players[i] = new Player(this.player_definition[i]); 
    }

    for (var i = 0, imax = this.map_definition.height; i < imax; i += 1) {
        this.map[i] = new Array(this.map_definition.width);
        for (var j = 0, jmax = this.map_definition.width; j < jmax; j += 1) {
            this.map[i][j] = new this.map_definition.tileDefinition[i][j]();
        }
    }

    for (var i = 0, imax = this.map_definition.objectDefinition.length; i < imax; i += 1) {
        var object_definition = this.map_definition.objectDefinition[i][j];
        this.map[object.x][object.y].object = new object_definition(); 
    }
}

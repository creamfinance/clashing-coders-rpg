var Player = require('./player');

function World(map, player) {
    this.map = map;
    this.player = player;

    this.player.position = this.map.start;
}


var WorldMap = require('./map');
var world = new World(new WorldMap([
    [ '#', '#', '#', '#', '#', '#', '#', '#', '#', '#' ], 
    [ '#', '.', 'T', 'T', '.', '.', 'T', '.', '.', '#' ],
    [ '#', '#', '#', '#', '#', '#', '#', '#', '#', '#' ], 
], {x: 1, y: 1}), new Player());

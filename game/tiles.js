var id = 0;

function TileDefinition(name, display, options) {
    var t = function Tile() {
        this.type = name;
        this.display = display;
    }

    t.prototype.id = id++;
    t.prototype.traversable = options.traversable === true;
    t.prototype.used = options.used === true;
    t.prototype.weight = options.weight || 1;
    t.prototype.interact = options.interact || function(){};
    return t;
}

var x = module.exports = {
    1: new TileDefinition('ground', '.', { traversable: true, weight: 1, interact: function(player){} }),
    2: new TileDefinition('wall', '#', { traversable: false, weight: 1, interact: function(player){} }),
    3: new TileDefinition('forest', 'T', { traversable: true, weight: 2, interact: function(player){} }),
    4: new TileDefinition('mountain', 'M', { traversable: true, weight: 5, interact: function(player){} }),
    5: new TileDefinition('water', '~', { traversable: false, weight: 5, interact: function(player){} }),
    6: new TileDefinition('door', 'D', { traversable: true, weight: 1, interact: function(player){} }),
    7: new TileDefinition('button', 'B', { traversable: true, weight: 1, used: false, interact: function(player){ if (!this.used) { this.used = true; }} }),
    8: new TileDefinition('keydoor', 'L', { traversable: false, weight: 1, interact: function(player){} }),
    9: new TileDefinition('key', 'K', { traversable: true, weight: 1, used: false, interact: function(player){ if (!this.used) {player.inventory.keys++; this.used = true;}} }),
    10: new TileDefinition('apple', 'A',  { traversable: true, weight: 1, used: false, interact: function(player){ if (!this.used) {player.inventory.apples++; this.used = true;}} })
    //'forest': new TileDefinition('T', { traversable: true })
}

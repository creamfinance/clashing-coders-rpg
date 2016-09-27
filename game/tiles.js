var id = 0;

function TileDefinition(name, options) {
    var t = function Tile() {
        this.object = null;
        this.type = name;
    }

    t.prototype.id = id++;
    t.prototype.traversable = options.traversable === true;
    t.prototype.used = false;
    t.prototype.interact = function(){};
    return t;
}

var x = module.exports = {
    1: new TileDefinition('ground', { traversable: true, weight: 1, interact: function(player){} }),
    2: new TileDefinition('wall', { traversable: false, weight: 1, interact: function(player){} }),
    3: new TileDefinition('forest', { traversable: true, weight: 2, interact: function(player){} }),
    4: new TileDefinition('mountain', { traversable: true, weight: 5, interact: function(player){} }),
    5: new TileDefinition('water', { traversable: false, weight: 5, interact: function(player){} }),
    6: new TileDefinition('door', { traversable: true, weight: 1, interact: function(player){} }),
    7: new TileDefinition('button', { traversable: true, weight: 1, used: false, interact: function(player){ if (!this.used) { this.used = true; }} }),
    8: new TileDefinition('keydoor', { traversable: false, weight: 1, interact: function(player){} }),
    9: new TileDefinition('key', { traversable: true, weight: 1, used: false, interact: function(player){ if (!this.used) {player.inventory.keys++; this.used = true;}} }),
    9: new TileDefinition('apple', { traversable: true, weight: 1, used: false, interact: function(player){ if (!this.used) {player.inventory.apples++; this.used = true;}} })
    //'forest': new TileDefinition('T', { traversable: true })
}

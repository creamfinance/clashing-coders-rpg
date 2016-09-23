var id = 0;

function TileDefinition(name, options) {
    var t = function Tile() {
        this.object = null;
        this.type = name;
    }

    t.prototype.id = id++;
    t.prototype.traversable = options.traversable === true;
    return t;
}

var x = module.exports = {
    1035: new TileDefinition('wall', { traversable: false }),
    353: new TileDefinition('ground', { traversable: true }),
    453: new TileDefinition('road', { traversable: true }),
    //'forest': new TileDefinition('T', { traversable: true })
}

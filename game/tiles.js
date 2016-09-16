var id = 0;

function TileDefinition(display, options) {
    var t = function () {

    }

    t.prototype.id = id++;
    t.prototype.display = display;

    t.prototype.weight = options.weight || 1;
    t.prototype.traversable = options.traversable === true;

    return t;
}

module.exports = {
    'wall': new TileDefinition('#', { weight: 0, traversable: false }),
    'land': new TileDefinition('.', { weight: 1, traversable: true }),
    'forest': new TileDefinition('T', { weight: 1.5, traversable: true})
}

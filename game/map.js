var tiles = require('./tiles'),
    tiles_map = Object.keys(tiles).reduce(function (n, c) { n[tiles[c].prototype.display] = tiles[c]; return n; }, {});

module.exports = WorldMap;

function WorldMap(definition, start) {
    this.tileset = null;
    this.start = start;
    this.definition = definition;
    this.parseDefinition();
}

WorldMap.prototype.parseDefinition = function parseDefinition() {
    this.tileset = new Array(this.definition.length);
    this.height = this.definition.length;
    this.width = this.definition[0].length;

    for (var i = 0, max = this.definition.length; i < max; i += 1) {
        this.tileset[i] = new Array(this.definition[i].length);

        for (var j = 0, jmax = this.definition[i].length; j < jmax; j += 1) {
            this.tileset[i][j] = new tiles_map[this.definition[i][j]];
        }
    }
};

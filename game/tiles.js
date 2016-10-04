/*
    Clashing Coders RPG Platform - The platform used for Creamfinance's first coding contest.
    Copyright (C) 2016 Florian Proksch

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

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
    5: new TileDefinition('water', '~', { traversable: false, weight: 1, interact: function(player){} }),
    6: new TileDefinition('door', 'D', { traversable: true, weight: 1, interact: function(player){} }),
    7: new TileDefinition('button', 'B', { traversable: true, weight: 1, used: false, interact: function(player){} }),
    8: new TileDefinition('keydoor', 'L', { traversable: false, weight: 1, interact: function(player){} }),
    9: new TileDefinition('key', 'K', { traversable: true, weight: 1, used: false, interact: function(player){} }),
    10: new TileDefinition('apple', 'A',  { traversable: true, weight: 1, used: false, interact: function(player){} }),
}

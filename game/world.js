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

var Player = require('./player');

var World = module.exports = function World(level, players) {
    //Mixin level definitions
    for (var key in level) {
        this[key] = level[key];
    }

    this.width = this.map_definition.width;
    this.height = this.map_definition.height;
    this.map = new Array(this.height);
    this.tileset = {};
    this.log = [];
    this.messages = [];

    this.players = new Array(this.player_definition.length);
    for (var i = 0, imax = this.player_definition.length; i < imax; i += 1) {
        this.players[i] = new Player(this.player_definition[i]);
    }

    for (var i = 0, imax = this.map_definition.height; i < imax; i += 1) {
        this.map[i] = new Array(this.map_definition.width);
        for (var j = 0, jmax = this.map_definition.width; j < jmax; j += 1) {
            this.map[i][j] = new this.map_definition.tileDefinition[i][j]();
            this.tileset[this.map[i][j].display] = {
                type: this.map[i][j].type,
                traversable: this.map_definition.tileDefinition[i][j].prototype.traversable,
                weight: this.map_definition.tileDefinition[i][j].prototype.weight,
            };
        }
    }

    for (var i = 0, imax = this.map_definition.objectDefinition.length; i < imax; i += 1) {
        var object_definition = this.map_definition.objectDefinition[i];
        this.map[object_definition.x][object_definition.y].object = new object_definition.object();
    }

    this.init();
}

World.prototype.action = function (player, action, data) {
    var ret = this.processAction(player, action, data);

    var inv = {};
    for (var k in player.inventory) {
        inv[k] = player.inventory[k];
    }

    return ret;
};

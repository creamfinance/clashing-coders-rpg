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

function ObjectDefinition(name, that, options) {
    var GameObject = function () { 
        for (var key in that) {
            this[key] = that[key];
        }
    }

    GameObject.prototype = options;
    GameObject.prototype.id = id++;
    GameObject.prototype.name = name;
}

module.exports = {
    228: new ObjectDefinition('lever', { active: false }, {
        interact: function () { this.active = ! this.active; }
    }),
};

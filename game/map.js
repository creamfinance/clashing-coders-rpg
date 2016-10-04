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

var tile_definition = require('./tiles'),
    object_definition = require('./objects');

var MapDefinition = module.exports = function (data) {
    this.data = data;

    this.width = data.width;
    this.height = data.height;
    this.tileDefinition = new Array(data.height);
    this.objectDefinition = [];
    // this.buttons = [];

    for (var i = 0, imax = data.height; i < imax; i += 1) {
        this.tileDefinition[i] = new Array(data.width);
        for (var j = 0, jmax = data.width; j < jmax; j += 1) {
            this.tileDefinition[i][j] = tile_definition[data.layers[0].data[j + (i * data.width)]];

            // if ((data.layers[0].data[j + (i * data.width)]) == 7) {
            //     this.buttons.push({
            //             x: j,
            //             y: i
            //         }
            //     );
            // }

            if (data.layers.length > 1 && data.layers[1].data[j + (i * data.width)] !== 0) {
                this.objectDefinition.push({
                    x: j,
                    y: i,
                    object: object_definition[data.layers[1].data[j + (i * data.width)]]
                });
            }
        }
    }
}

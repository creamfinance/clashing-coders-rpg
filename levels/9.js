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

module.exports = {
    init: function () {
        this.players[0].pushedButtons = [];
    },
    player_definition: [{ x:10, y:190 }],
    goodButtons: [
            { x: 19, y: 18 },
            { x: 30, y: 37 },
            { x: 24, y: 84 },
            { x: 24, y: 132 },
            { x: 23, y: 168 },

            { x: 55, y: 167 },
            { x: 92, y: 33 },
            { x: 69, y: 55 },
            { x: 93, y: 106 },
            { x: 121, y: 69 },

            { x: 129, y: 149 },
            { x: 145, y: 110 },
            { x: 170, y: 27 },
            { x: 182, y: 72 },
            { x: 178, y: 164 },
    ],
    isFinished: function (players, request) {
        var found = false;

        for (var pbi in players[0].pushedButtons) {
            found = false;
            var pushedButton = players[0].pushedButtons[pbi];

            for (var bi in this.goodButtons) {
                if (this.goodButtons[bi].x == pushedButton.x && this.goodButtons[bi].y == pushedButton.y) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                console.log('pushed a wrong button');
                request.level.messages.push('pushed a wrong button');
                break;
            }
        }

        found = false;

        for (var gbi in this.goodButtons) {
            found = false;
            var goodButton = this.goodButtons[gbi];

            for (var bi in players[0].pushedButtons) {
                if (players[0].pushedButtons[bi].x == goodButton.x && players[0].pushedButtons[bi].y == goodButton.y) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                console.log('not all buttons pushed');
                request.level.messages.push('not all buttons pushed');
                break;
            }
        }

        return found;
    },
    processAction: function (player, action, options) {
        options = options || {};

        switch (action.toLowerCase()) {
            case 'up':
            case 'down':
            case 'left':
            case 'right':
                this.movePlayer(player, action, options);
                return true;
            case 'interact':
                this.interactPlayer(player);
                return true;
            default:
                return false;
        }
    },
    movePlayer: require('./movePlayer'),
    interactPlayer: require('./interactPlayer'),
};

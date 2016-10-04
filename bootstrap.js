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

var LevelRepository = require('./repositories/LevelRepository'),
    Templates = require('./templates'),
    waiter = require('./util/waiter'),
    Users = require('./repositories/UserRepository');

module.exports = function (cb) {
    var wait = waiter(3, cb);

    global.log = console.log;
    require('./object/append');
    require('validation');
    // Loads exceptions into the global space!
    require('./exceptions');
    require('completionhandler');

    F(Array.prototype, 'repeat', function (count) {
        var newAr = [];

        for (var i = 0; i < count; i++) {
            newAr = newAr.concat(this.slice());
        }

        return newAr;
    });

    F(String.prototype, 'replaceAt', function (index, char) {
        return this.substr(0, index) + char + this.substr(index + char.length);
    });

    F(Object.prototype, 'map', function (cb, start) {
        return Object.keys(this).reduce(cb.bind(this), start || {});
    });

    LevelRepository.load(wait);
    Users.load(wait);
    Templates.load(wait);
};

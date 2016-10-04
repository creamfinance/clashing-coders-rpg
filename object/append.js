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

F(Object.prototype, 'append',
    function (data) {
        if (data) {
            for (var name in data) {
                this[name] = data[name];
            }
        }

        return this;
    }
);


F(Object.prototype, 'appendRecursive',
    function (data) {
        if (data) {
            for (var name in data) {
                if (name in this && typeof this[name] == 'object') {
                    this[name].appendRecursive(data[name]);
                } else {
                    this[name] = data[name];
                }
            }
        }

        return this;
    }
);


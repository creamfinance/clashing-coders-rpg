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

var fs = require('fs'),
    swig = require('swig');

module.exports = {
    templates: {},
    /**
     * TODO: document
     * 
     * @param template @todo 
     */
    get: function get(template) {
        return this.templates[template];
    },
    /**
     * TODO: recursion into directories
     * 
     * @param cb @todo 
     */
    load: function load(cb) {
        var that = this;

        fs.readdir('views', function (err, files) {
            if (err) { cb(err); return; } 

            for (var i = 0, max = files.length; i < max; i += 1) {
                that.templates[files[i].split('.')[0]] = swig.compileFile('views/' + files[i]);
            }
            cb();
        });
    },
    
}

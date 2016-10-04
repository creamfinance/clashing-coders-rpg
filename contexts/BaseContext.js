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

var BaseContext = Class.bind(null, 'BaseContext', Object);

module.exports = BaseContext({
    constructor: function (request) {
        this.request = request;

        this.queryCounterSelect = 0;
        this.queryCounterInsert = 0;
        this.queryCounterUpdate = 0;
        this.queryCounterDelete = 0;
    },
    /* Called when a query is done */
    queryDone: function (query, settings) {
        if (settings.text.toLowerCase().indexOf('SELECT'.toLowerCase()) == 0) {
            this.queryCounterSelect++;
        } else if (settings.text.toLowerCase().indexOf('UPDATE'.toLowerCase()) == 0) {
            this.queryCounterInsert++;
        } else if (settings.text.toLowerCase().indexOf('INSERT'.toLowerCase()) == 0) {
            this.queryCounterUpdate++;
        } else if (settings.text.toLowerCase().indexOf('DELETE'.toLowerCase()) == 0) {
            this.queryCounterDelete++;
        }
    },
    /* 
        Called when the associated request is done.
        Means we append infos from the context here.
    */
    requestDone: function (request) {
        request.appendInfo('Queries (' + 
            this.queryCounterSelect + ', ' +
            this.queryCounterInsert + ', ' +
            this.queryCounterUpdate + ', ' +
            this.queryCounterDelete + ')');
    },

    getAuthorization: function (type) {
        // get auth info for affiliate
        for (var i = 0; i < this.request.authorization.length; i++) {
            if (this.request.authorization[i].type == type) {
                return this.request.authorization[i];
            }
        }

        return null;
    }
});

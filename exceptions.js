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

var util = require('util');

var BaseException = Class.bind(null, 'BaseException');

BaseException(Object, {
    constructor: function () {

    },
    toJSON: function () {
        var json = { code: this.code, name: this.class };

        if (this.prepareJson) {
            json = this.prepareJson(json);
        }

        return json;
    }
});

// Request Exceptions
var BaseMessageException = Class.bind(null, 'BaseMessageException');

var InvalidRequestException = Class.bind(null, 'InvalidRequestException');
var InvalidVersionException = Class.bind(null, 'InvalidVersionException');
var InvalidTokenException = Class.bind(null, 'InvalidTokenException');
var InternalServerErrorException = Class.bind(null, 'InternalServerErrorException');
var InvalidMethodException = Class.bind(null, 'InvalidMethodException');

BaseMessageException(global.BaseException, {
    constructor: function (message) {
        if (typeof message == 'object') {
            this.object = message;
        } else {
            this.message = message;
        }

        this.__callParent('constructor');
    },
    prepareJson: function (json) {
        json.message = this.message;
        json.object = this.object;
        return json;
    }
});

InvalidRequestException(global.BaseMessageException, {
    constructor: function (message) {
        this.__callParent('constructor', message);
        this.code = 5001;
    }
});

InvalidVersionException(global.BaseMessageException, {
    constructor: function (message) {
        this.__callParent('constructor', message);
        this.code = 5002;
    }
});

InvalidTokenException(global.BaseMessageException, {
    constructor: function (message) {
        this.__callParent('constructor', message);
        this.code = 5003;
    }
});

InternalServerErrorException(global.BaseMessageException, {
    constructor: function (message) {
        this.__callParent('constructor', message);
        this.code = 5004;
    }
});

InvalidMethodException(global.BaseMessageException, {
    constructor: function (message) {
        this.__callParent('constructor', message);
        this.code = 5005
    }
});

// Data Exceptions
var InvalidLoginException = Class.bind(null, 'InvalidLoginException');
var InvalidUserException = Class.bind(null, 'InvalidUserException');
var UnauthorizedException = Class.bind(null, 'UnauthorizedException');
var InvalidAuthMethodException = Class.bind(null, 'InvalidAuthMethodException');
var SqlException = Class.bind(null, 'SqlException');

InvalidLoginException(global.BaseMessageException, {
    constructor: function (message) {
        this.__callParent('constructor', message);
        this.code = 6001;
    }
});

InvalidUserException(global.BaseMessageException, {
    constructor: function (message) {
        this.__callParent('constructor', message);
        this.code = 6002;
    }
});

InvalidAuthMethodException(global.BaseMessageException, {
    constructor: function (message) {
        this.__callParent('constructor', message);
        this.code = 6003;
    }
});

SqlException(global.BaseMessageException, {
    constructor: function (exception) {
        this.__callParent('constructor', exception);
        this.code = 6004;

        console.log(exception);
    }
});

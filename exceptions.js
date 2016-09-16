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

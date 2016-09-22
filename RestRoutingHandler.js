var contentType = 'Content-Type'.toLowerCase();
var util = require('util');

var Class = require('class');
var BaseHandler = require('./handler/BaseHandler');
var RestRoutingHandler = Class.bind(null, 'RestRoutingHandler', BaseHandler);

module.exports = RestRoutingHandler({
    constructor: function () {
        /*
            First level = http method (POST, GET, PATCH, DELETE, HEAD)
            Second level = 

            {
                POST: {
                    authentication: {
                        '^': {
                            configuration: {
                            }
                        } 
                    },
                    authorization: {
                        '^': {
                            configuration: {
    
                            }
                        }
                    }
                },
                GET: {
                    authorization: {
                        '$': {
                            name: '{AUTHORIZATION_ID}',
                            validation: new IntegerRule(),
                            'clear': {
                                '^': {
                                    configuration: {}
                                }
                            },
                            'info': {
                                '^': {
                                    configuration: {}
                                }
                            }
                        }
                    }
                }
            }
        */
        this.methodHandlers = {};
        this.controllers = {}
    },
    resolveName: function (name) {
        if (typeof name !== 'string') {
            if (!name.prototype || !name.prototype.class) {
                throw new BaseMessageException('Invalid Name for Controller');
            }

            name = name.prototype.class;
        }

        return name;
    },
    registerController: function (name, instance) {
        name = this.resolveName(name);
        
        this.controllers[name] = instance;
    },
    registerPath: function (method, path, configuration) {
        method = method.toLowerCase();

        // verify that our http method is registered
        if (!(method in this.methodHandlers)) {
            this.methodHandlers[method] = {};
        }

        // now split the path into separate pieces and traverse
        var split_path = path.split('/');

        // remove the first entry, if it's empty.
        if (split_path[0] == '') {
            split_path.shift();
        }

        // Initialize our variable detection regex
        var variableRegex = /^\{(.*)\}$/;
        var currentMethod = this.methodHandlers[method];

        // go through all parts of the supplied path
        for (var i = 0; i < split_path.length; i++) {
            var sub_path = split_path[i];
            
            // if it's a variable, then do special handling

            if (variableRegex.test(sub_path)) {
                var name = sub_path.match(variableRegex);

                if (!('$' in currentMethod)) {
                    currentMethod['$'] = [];
                }

                var variableHandler = {}, varHandlerIndex = -1;
                for (var j = 0, jmax = currentMethod['$'].length; j < jmax; j += 1) {
                    if (currentMethod['$'][j].name == name[1]) {
                        varHandlerIndex = j;
                        break;
                    }
                }

                if (varHandlerIndex != -1) {
                    variableHandler = currentMethod['$'][varHandlerIndex];
                } else {
                    variableHandler.name = name[1];
                    variableHandler.validator = configuration.variables[name[1]];

                    currentMethod['$'].push(variableHandler);
                }

                currentMethod = variableHandler;
            } else {
                // no variable, still disallow ^ and $, because we are using those as special values
                // for the handler and the variables

                if (sub_path == '^' || sub_path == '$') {
                    throw new BaseMessageException('Invalid path: contains ^ or $');
                }

                if (!(sub_path in currentMethod)) {
                    currentMethod[sub_path] = {};
                }

                // just go down the "rabbit hole"
                currentMethod = currentMethod[sub_path];
            }
        }

        // if there's already a handler for this path -> error
        if ('^' in currentMethod) {
            throw new BaseMessageException('Invalid path: handler already registered');
        }

        // now register the configuration for the path
        currentMethod['^'] = {
            configuration: configuration
        };
    },
    getController: function (name) {
        name = this.resolveName();

        return this.controllers[name];
    },
    handle: function (request) {
        var method = request.req.method.toLowerCase();

        // first check if we support this http method
        if (!(method in this.methodHandlers)) {
            // whoops, we don't have any method -> error out
            request.appendInfo('Method not found');
            return request.sendNotFound();
        }

        var currentMethod = this.methodHandlers[method];
        var split_path = request.query.path.split('/');

        // remove the first entry, if it's empty.
        if (split_path[0] == '') {
            split_path.shift();
        }

        // go through our path, if we don't have a match, return not found
        var checkSubPath = function (idx) {
            if (idx < split_path.length) {
                var sub_path = split_path[idx];

                // By default, if a request contains our special chars -> error
                if (sub_path == '^' || sub_path == '$') {
                    request.appendInfo('Special Chars in Path');
                    return request.sendNotFound();
                }

                // check if we have the default path in here
                if (sub_path in currentMethod) {
                    // descend
                    currentMethod = currentMethod[sub_path]

                    checkSubPath(idx + 1);
                } else if ('$' in currentMethod) {
                    // now it get's trickey, check each variable definition and
                    // see if the current path has a match, use the first one
                    // that matched!

                    var checkVariable = function (var_idx) {
                        if (var_idx < currentMethod['$'].length) {
                            var variable = currentMethod['$'][var_idx];

                            var data = {};
                            data[variable.name] = sub_path;

                            variable.validator.validate(data, function (context, result) {
                                if (result) {
                                    currentMethod = variable;

                                    // Set the validated variable on the request object
                                    if (!('variables' in request)) {
                                        request.variables = {};
                                    }

                                    request.variables[variable.name] = sub_path;

                                    // check next path part
                                    checkSubPath(idx + 1);
                                } else {
                                    request.log(util.inspect(context, { depth: null }));
                                    checkVariable(var_idx + 1);
                                }
                            }.bind(this));
                        } else {
                            request.appendInfo('No variable matched');
                            return request.sendNotFound();
                        }
                    }

                    checkVariable(0);                    
                } else {
                    request.appendInfo('Invalid Path');
                    return request.sendNotFound();
                }
            } else {
                // check if ^ is in the currentMethod, if yes, we got a config
                if (!('^' in currentMethod)) {
                    request.appendInfo('Configuration not found');
                    return request.sendNotFound();
                }

                // decend to the config
                currentMethod = currentMethod['^'];

                var requestConfigs = currentMethod.configuration.requests;

                var validatedContext = [];

                var findValidRequest = function (idx) {
                    if (requestConfigs && idx < requestConfigs.length) {
                        var requestConfig = requestConfigs[idx];

                        var validation = [];

                        validatedContext.push(validation);

                        validateHeaders(requestConfig, function (err, context) {
                            validation.push(context);
                            
                            if (err) {
                                return findValidRequest(idx + 1);
                            }

                            validateBody(requestConfig, function (err, context) {
                                validation.push(context);

                                if (err) {
                                    return findValidRequest(idx + 1);
                                }

                                checkForAuthorization(requestConfig);
                            });
                        });
                    } else {
                        
                        for (var i = 0; i < validatedContext.length; i++) {
                            for (var x = 0; x < validatedContext[i].length; x++) {
                                request.log(util.inspect(validatedContext[i][x], { depth: null }));
                            }
                        }

                        request.appendInfo('No matching request template found');
                        return request.sendInvalidRequest();
                    }
                }


                // so we got a config, now we need to validate stuff:
                var validateHeaders = function (requestConfig, callback) {
                    var headers = requestConfig.headers;

                    if (headers) {
                        var headerData = request.req.headers;

                        headers.validate(headerData, function (context, result) {
                            if (result) {
                                callback(null, context);
                            } else {
                                callback(new BaseMessageException('Header validation failed'), context);
                            }
                        })
                    } else {
                        callback(null);
                    }
                };

                var validateBody = function (requestConfig, callback) {
                    // if there's a body validator defined, load the body
                    var body = requestConfig.body;
                    var validateInnerBody = function () {
                        body.validate(request.post, function (context, result) {

                            if (result) {
                                callback(null, context);
                            } else {
                                callback(new BaseMessageException('Body validation failed'), context);
                            }
                        });
                    };

                    if (body && request.req.headers[contentType] &&
                        request.req.headers[contentType].indexOf('application/json') === 0) {


                        if (request.parsedData) {
                            validateInnerBody();
                        } else {
                            request.parseJsonData(function (failed, err) {
                                request.data = null; // free the used memory from received data
                                request.parsedData = true;

                                validateInnerBody();
                            });
                        }
                    } else if (request.canParsePostData()) {
                        if (request.parsedData) {
                            validateInnerBody();
                        } else {
                            request.parsePostData(function (failed, err) {
                                request.data = null;
                                request.parsedData = true;

                                validateInnerBody();             
                            });
                        }
                    } else {
                        callback();
                    }
                };

                var checkForAuthorization = function (requestConfig) {
                    if (requestConfig.authorization 
                        && requestConfig.authorization instanceof Array
                        && requestConfig.authorization.length > 0) {
                        
                        // handle
                        var handleAuthorization = function (idx) {
                            if (idx < requestConfig.authorization.length) {
                                var auth = requestConfig.authorization[idx];

                                Authorization.authorize(
                                    request.req.headers[auth.header],
                                    auth.type,
                                    auth.url,
                                    function (err, data) {
                                        if (err) {
                                            request.appendInfo('Authorization for ' + auth.type + ' was invalid');
                                            return request.sendForbidden();
                                        }

                                        request.authorization.push(data);

                                        handleAuthorization(idx + 1);
                                    }
                                );
                            } else {
                                callResolvers(requestConfig);
                            }
                        };

                        if (!('authorization' in request)) {
                            request.authorization = [];
                        }

                        handleAuthorization(0);                        
                    } else {
                        callResolvers(requestConfig);
                    }
                };

                var callResolvers = function (requestConfig) {
                    if (requestConfig.resolver
                        && requestConfig.resolver instanceof Array
                        && requestConfig.resolver.length > 0) {
                        
                        // handle
                        var handleResolver = function (idx) {
                            if (idx < requestConfig.resolver.length) {
                                var resolve = requestConfig.resolver[idx];

                                resolve(request, handleResolver.bind(null, idx + 1));
                            } else {
                                callCallback(requestConfig);
                            }
                        };

                        handleResolver(0);  
                    } else {
                        callCallback(requestConfig);
                    }
                };

                var callCallback = function (requestConfig) {
                    if (requestConfig.callback) {
                        return requestConfig.callback(request);
                    }

                    // call our callback
                    if (currentMethod.configuration.callback) {
                        currentMethod.configuration.callback(request);
                    } else {
                        request.appendInfo('Callback is undefined');
                        return request.sendNotFound();
                    }
                };



                findValidRequest(0);
            }
        }.bind(this);

        checkSubPath(0);
    }
});

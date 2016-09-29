var Class = require('class'),
    redis = require('../redis'),
    TokenResolver = require('../resolvers/TokenResolver'),
    UserResolver = require('../resolvers/UserResolver'),
    Template = require('../templates'),
    randomstring = require('randomstring'),
    UserRepository = require('../repositories/UserRepository'),
    buildVariableDefinition = require('../util/buildVariableDefinition');

var AdminController = Class.bind(null, 'AdminController', Object);

module.exports = AdminController({
    constructor: function () {

    },
    /**
     * TODO: document
     *
     * @param router @todo
     */
    registerRouter: function registerRouter(router) {
        router.registerPath('POST', '/admin/{TOKEN}/register',
            {
                requests: [
                    {
                        headers: new Validator({}),
                        body: new Validator({
                            'username': new RequiredRule()
                        }),
                        resolver: [
                            TokenResolver
                        ],
                        callback: this.handleRegisterUser.bind(this)
                    },
                ],
                variables: buildVariableDefinition({
                    'TOKEN': [ ],
                }),
            }
        );

        router.registerPath('GET', '/admin/{TOKEN}/users',
            {
                requests: [
                    {
                        headers: new Validator({}),
                        body: new Validator({}),
                        resolver: [
                            TokenResolver
                        ],
                        callback: this.handleListUsers.bind(this)
                    },
                ],
                variables: buildVariableDefinition({
                    'TOKEN': [ ],
                }),
            }
        );

        router.registerPath('POST', '/admin/{TOKEN}/checkin/{USER_ID}',
            {
                requests: [
                    {
                        headers: new Validator({}),
                        body: new Validator({}),
                        resolver: [
                            TokenResolver, UserResolver
                        ],
                        callback: this.handleCheckIn.bind(this)
                    },
                ],
                variables: buildVariableDefinition({
                    'TOKEN': [ ],
                    'USER_ID': [ new IntegerRule() ],
                }),
            }
        );

        router.registerPath('GET', '/admin/{TOKEN}/register',
            {
                requests: [
                    {
                        headers: new Validator({}),
                        body: new Validator({}),
                        resolver: [
                            TokenResolver
                        ],
                        callback: this.handleShowRegistrationPage.bind(this)
                    },
                ],
                variables: buildVariableDefinition({
                    'TOKEN': [ ],
                }),
            }
        );

        router.registerPath('GET', '/admin/{TOKEN}/user/{EMAIL}',
            {
                requests: [
                    {
                        headers: new Validator({
                        }),
                        body: new Validator({}),
                        resolver: [
                            TokenResolver, UserResolver
                        ],
                        callback: this.handleGetUserInformation.bind(this)
                    },
                ],
                variables: buildVariableDefinition({
                    'TOKEN': [ ],
                    'EMAIL': [ new EmailRule() ]
                }),
            }
        );

        router.registerPath('POST', '/admin/{TOKEN}/authentication/allow',
            {
                requests: [
                    {
                        headers: new Validator({
                        }),
                        body: new Validator({}),
                        resolver: [
                            TokenResolver
                        ],
                        callback: this.handleAllowRegistration.bind(this)
                    }
                ],
            }
        );

        router.registerPath('POST', '/admin/{TOKEN}/authentication/deny',
            {
                requests: [
                    {
                        headers: new Validator({
                        }),
                        body: new Validator({}),
                        resolver: [
                            TokenResolver
                        ],
                        callback: this.handleCloseRegistration.bind(this)
                    }
                ],
            }
        );
    },

    /**
     * TODO: document
     *
     * @param request @todo
     */
    handleRegisterUser: function handleRegisterUser(request) {
         // TODO: implement
        // store in DB
        // TODO: reload users in interval in repo
        UserRepository.create(request.post.username, randomstring.generate(12), request.post.email, function (user) {
            request.write(Template.get('user')({ user: user, token: request.token }));
            request.end();
        });
    },
    /**
     * TODO: document
     *
     * @param request @todo
     */
    handleShowRegistrationPage: function handleShowRegistrationPage(request) {
        request.write(Template.get('register')({ token: request.token }));
        request.end();
    },
    /**
     * TODO: document
     *
     * @param request @todo
     */
    handleListUsers: function handleListUsers(request) {
        request.write(Template.get('users')({ token: request.token, users: UserRepository.users }));
        request.end();
    },

    /**
     * TODO: document
     *
     * @param request @todo
     */
    handleCheckIn: function handleCheckIn(request) {
        var that = this;
        UserRepository.checkIn(request.user, function () {
            that.handleListUsers(request);
        });
    },

    /**
     * TODO: document
     *
     * @param request @todo
     */
    handleGetUserInformation: function handleGetUserInformation(request) {
        request.sendResponse(request.user);
    },

    /**
     * TODO: document
     * 
     * @param request @todo 
     */
    handleAllowRegistration: function (request) {
        redis.set('open-registration', 'true', function (err, result) {
            request.sendSuccess();
        });        
    },

    /**
     * TODO: document
     *  
     */
    handleCloseRegistration: function handleCloseRegistration(request) {
        redis.del('open-registration', function (err, result) {
            request.sendSuccess();
        });
    },
    
});

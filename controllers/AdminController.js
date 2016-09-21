var Class = require('class'),
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
        router.registerPath('GET', '/admin/{TOKEN}/{USER_ID}',
            {
                requests: [
                    {
                        headers: new Validator({}),
                        body: new Validator({}),
                        resolver: [
                            TokenResolver, UserResolver
                        ],
                        callback: this.handleShowUser.bind(this)
                    },
                ],
                variables: buildVariableDefinition({
                    'TOKEN': [ ],
                    'USER_ID': [ new IntegerRule ]
                }),
            }
        );

        router.registerPath('POST', '/admin/{TOKEN}/register',
            {
                requests: [
                        headers: new Validator({}),
                        body: new Validator({
                            'username': new RequiredRule(),
                            'password': new RequiredRule()
                        }),
                        resolver: [
                            TokenResolver
                        ],
                        callback: this.handleRegisterUser.bind(this)
                ],
                variables: buildVariableDefinition({
                    'TOKEN': [ ],
                }),
            }
        );

        router.registerPath('GET', '/admin/{TOKEN}/register',
            {
                requests: [
                    headers: new Validator({}),
                    body: new Validator({}),
                    resolver: [
                        TokenResolver
                    ],
                    callback: this.handleShowRegistrationPage.bind(this)
                ],
                variables: buildVariableDefinition({
                    'TOKEN': [ ],
                }),
            }
        );

        router.registerPath('GET', '/admin/{TOKEN}/users',
            {
                requests: [
                    headers: new Validator({}),
                    body: new Validator({}),
                    resolver: [
                        TokenResolver
                    ],
                    callback: this.handleListUsers.bind(this)
                ],
                variables: buildVariableDefinition({
                    'TOKEN': [ ],
                }),
            }
        );
    },
    /**
     * 
     * 
     * @param request @todo 
     */
    handleShowUser: function handleShowUser(request) {
        // request.user
        //
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
    },
    /**
     * TODO: document
     * 
     * @param request @todo 
     */
    handleShowRegistrationPage: function handleShowRegistrationPage(request) {
         // TODO: implement
    },
    /**
     * TODO: document
     * 
     * @param request @todo 
     */
    handleListUsers: function handleListUsers(request) {
         // TODO: implement
    },
});

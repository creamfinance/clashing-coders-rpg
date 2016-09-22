module.exports = function TokenResolver(request, next) {
    if (request.variables.TOKEN === 'lyaxGKWIvCeg') {
        request.token = request.variables.TOKEN;
        next();
    } else {
        request.sendUnauthorized();
    }
};

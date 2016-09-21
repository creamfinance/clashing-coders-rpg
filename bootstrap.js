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

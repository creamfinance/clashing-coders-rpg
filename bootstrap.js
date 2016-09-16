var LevelRepository = require('./repositories/LevelRepository'),
    Users = require('./users');

module.exports = function (cb) {
    var waiter = (function (count, cb) {
        var i = 0; return function () { if (++i == count) { cb(); } };
    }(2, cb));

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

    LevelRepository.load(waiter);
    Users.reload(waiter);
};

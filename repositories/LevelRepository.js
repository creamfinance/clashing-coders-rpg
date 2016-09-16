var WorldMap = require('../game/map'),
    fs = require('fs');

var level_definitions = {
    1: require('../levels/1'),
};

module.exports = {
    get: function (level_num) {
        return level_definitions[level_num];
    },
    load: function (cb) {
        var waiter = (function (count, cb) {
            var i = 0; return function () { if (++i == count) { cb(); } };
        }(1, cb));

        fs.readFile('levels/1.txt', 'utf8', function (err, data) {
            var data;

            if (err) {
                cb(err);
                return;
            }

            data = data.split('\n');
            data.pop();

            level_definitions[1].map = new WorldMap(data);
            waiter();
        });
    },
};

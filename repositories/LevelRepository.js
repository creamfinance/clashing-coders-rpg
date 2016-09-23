var MapDefinition = require('../game/map'),
    World = require('../game/world'),
    waiter = require('../util/waiter'),
    fs = require('fs');

module.exports = {
    levels: {
        1: require('../levels/1'),
        2: require('../levels/2'),
    },
    get: function (level_num) {
        return new World(this.levels[level_num]);
    },
    load: function (cb) {
        var wait = waiter(Object.keys(this.levels).length, cb),
            that = this;

        for (var level_id in this.levels) {
            (function (level_id) {
                fs.readFile('levels/' + level_id + '.json', 'utf8', function (err, data) {
                    var data;

                    if (err) {
                        cb(err);
                        return;
                    }

                    that.levels[level_id].map_definition = new MapDefinition(JSON.parse(data));
                    wait();
                });
            }(level_id));
        }
    },
};

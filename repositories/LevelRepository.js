var WorldMap = require('../game/map'),
    waiter = require('../util/waiter'),
    fs = require('fs');

module.exports = {
    levels: {
        1: require('../levels/1'),
        2: require('../levels/2'),
    },
    get: function (level_num) {
        return this.levels[level_num];
    },
    load: function (cb) {
        var wait = waiter(Object.keys(this.levels).length, function () {
                console.log('finished loading maps'); 
                console.log(that.levels);
                cb();

            }),
            that = this;

        for (var level_id in this.levels) {
            (function (level_id) {
                fs.readFile('levels/' + level_id + '.txt', 'utf8', function (err, data) {
                    var data;

                    if (err) {
                        cb(err);
                        return;
                    }

                    data = data.split('\n');
                    data.pop();

                    that.levels[level_id].map = new WorldMap(data);
                    wait();
                });
            }(level_id));
        }
    },
};

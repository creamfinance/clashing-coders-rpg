var redis = require('../redis'),
    pg = require('../pool');

module.exports = {
    users: {},
    load: function (cb) {
        var that = this;

        pool.connect(function (err, client, done) {
            if (err) { cb(err); }

            client.query('SELECT * FROM users', [], function (err, result) {
                if (err) { cb(err); }

                var waiter = (function (cb) {
                    var num = result.rows.length,
                        inc = 0;
                    
                    return function () { if (++inc == num) { cb(); } };
                }(cb));

                for (var i = 0, max = result.rows.length; i < max; i += 1) {
                    that.users[result.rows[i].id] = result.rows[i];
                    that.users[result.rows[i].id].level_metadata = {};

                    client.query('SELECT * FROM level_metadata WHERE user_id = $1', 
                        [ result.rows[i].id ], function (err, result) {

                        if (err) { cb(err); return; }

                        for (var i = 0, max = result.rows.length; i < max; i += 1) {
                            //that.users[result.rows[i].user_id].
                                //level_metadata[result.rows[i].level_id] = result.rows[i];
                            // TODO: HMSET
                            redis.set(user.id + '.' + result.rows[i].level_id, 
                                JSON.stringify(result.rows[i]), function (err, result) {
                                    if (err) {console.log(err, result);}
                                }
                            );
                        }

                        waiter();
                    });
                }
            });
        });
    },
    createMetadata: function (user, level_id, cb) {
        var d = new Date(),
            metadata = {
                started: d,
                finished: null,
                points: null,
                num_fails: 0
            };

        // We just put this out there, no need to wait for it
        pg.connect(function (err, client, done) {
            if (err) { console.log(err); }
            
            client.query('INSERT INTO level_metadata(user_id, level_id, started) VALUES($1, $2, $3)',
                [user.id, level_id, d], function (err, result) {
                    if (err) { console.log(err); }
                    done();
            });
        });

        // TODO: HMSET
        redis.set(user.id + '.' + level_id, JSON.stringify(metadata), function (err, result) {
            if (err) { console.log(err); }
        });

        return metadata;
    },
    updateMetadata: function (user, level_id, metadata, cb) {
        pg.connect(function (err, client, done) {
            if (err) { console.log(err); }

            client.query('UPDATE level_metadata SET finished = $1, points = $2, num_fails = $3 WHERE user_id = $4 AND level_id = $5',
                [ metadata.finished, metadata.points, metadata.num_fails, user.id, level_id ],
                function (err, result) {
                    if (err) { console.log(err); }
                    done();
                }
            );
        });

        redis.set(user.id + '.' + level_id, JSON.stringify(metadata), function (err, result) {
            if (err) { console.log(err); }
            cb();
        });
    },
};

var redis = require('../redis'),
    pool = require('../pool'),
    waiter = require('../util/waiter');

module.exports = {
    users: {},
    load: function (cb) {
        var that = this;

        pool.connect(function (err, client, done) {
            if (err) { cb(err); }

            client.query('SELECT * FROM users', [], function (err, result) {
                if (err) { cb(err); }

                var wait = waiter(result.rows.length, cb);

                for (var i = 0, max = result.rows.length; i < max; i += 1) {
                    that.users[result.rows[i].id] = result.rows[i];
                    that.users[result.rows[i].id].level_metadata = {};

                    client.query('SELECT * FROM level_metadata WHERE user_id = $1', 
                        [ result.rows[i].id ], function (err, result) {

                        if (err) { cb(err); return; }

                        for (var i = 0, max = result.rows.length; i < max; i += 1) {
                            that.users[result.rows[i].user_id].
                                level_metadata[result.rows[i].level_id] = result.rows[i];
                        }

                        wait();
                    });
                }
            });
        });
    },
    get: function (user_id) {
        return this.users[user_id]; 
    },
    createMetadata: function (user, level_id) {
        var d = new Date(),
            metadata = {
                started: d,
                finished: null,
                num_fails: 0
            };

        // We just put this out there, no need to wait for it
        pool.connect(function (err, client, done) {
            if (err) { console.log(err); }
            
            client.query('INSERT INTO level_metadata(user_id, level_id, started) VALUES($1, $2, $3)',
                [user.id, level_id, d], function (err, result) {
                    if (err) { console.log(err); }
                    done();
            });
        });

        user.level_metadata[level_id] = metadata;
    },
    updateMetadata: function (user, level_id, metadata, cb) {
        var user_metadata = user.level_metadata[level_id];

        for (var key in metadata) {
            user_metadata[key] = metadata[key];
        }

        pool.connect(function (err, client, done) {
            if (err) { console.log(err); }

            client.query('UPDATE level_metadata SET finished = $1, times_failed = $2 WHERE user_id = $3 AND level_id = $4',
                [ user_metadata.finished, user_metadata.num_fails, user.id, level_id ],
                function (err, result) {
                    if (err) { console.log(err); }
                    done();
                }
            );
        });
    },
};

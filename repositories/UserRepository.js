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
    /**
     * TODO: document
     *  
     */
    getStats: function getStats(cb) {
        pool.connect(function (err, client, done) {
            if (err) { console.log(err); }

            client.query('SELECT user_id, username, max(level_id) as level, sum(finished - started) as total_time FROM users JOIN level_metadata ON users.id=level_metadata.user_id GROUP BY user_id, username ORDER BY max(level_id), sum(finished - started)', [],
                function (err, result) {
                    if (err) { console.log(err); }
                    console.log(result.rows);

                    cb(result.rows.map(function (obj) { return {
                        user: obj.username,
                        level: obj.level,
                        time: obj.total_time.hours + ':' + obj.total_time.minutes + ':' + obj.total_time.seconds, 
                    }; }));
                    
                    done();
                }
            );
        });
    },
    /**
     * TODO: document
     * 
     * @param level_id @todo 
     */
    getStatsForLevel: function getStatsForLevel(level_id, cb) {
        pool.connect(function (err, client, done) {
            if (err) { console.log(err); }

            client.query('SELECT user_id, username, (finished - started) as time FROM users JOIN level_metadata ON users.id=level_metadata.user_id WHERE level_id = $1 ORDER BY started - finished', [ level_id],
                function (err, result) {
                    if (err) console.log(err);


                    cb(result.rows.map(function (obj) { return {
                        user: obj.username,
                        time: obj.time.hours + ':' + obj.time.minutes + ':' + obj.time.seconds, 
                    }; }));
                }
            );
        });
    },
    
    
};

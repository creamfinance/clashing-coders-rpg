var redis = require('../redis'),
    pool = require('../pool'),
    waiter = require('../util/waiter');

module.exports = {
    users: {},
    load: function (cb) {
        var that = this;

        pool.connect(function (err, client, done) {
            if (err) { console.log(err); return cb(err); }

            client.query('SELECT * FROM public.users', [], function (err, result) {

                if (err) { console.log(err); return cb(err); }

                if (result.rows.length > 0) {
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
                } else {
                    cb();
                }
            });
        });
    },
    get: function (user_id) {
        return this.users[user_id];
    },
    getWithEmail: function (email) {
        for (var id in this.users) {
            if (this.users[id].email == email) {
                return this.users[id];
            }
        }
    },
    /**
     * TODO: document
     *  
     */
    fetchAll: function fetchAll(cb) {
        pool.connect(function (err, client, done) {
            client.query('SELECT * FROM users ORDER BY name', [], function (err, result) {
                if (err) { return console.log(err); }
                done();
                cb(result.rows);
            });
        });    
    },
    /**
     * TODO: document
     *
     * @param user @todo
     */
    checkIn: function checkIn(user, cb) {
        pool.connect(function (err, client, done) {
            if (err) { cb(err); }

            client.query('UPDATE users SET checked_in = TRUE WHERE id = $1', [user.id], function (err, result) {
                if (err) { cb(err); }

                done();
                user.checked_in = true;
                cb();
            });
        });
    },

    /**
     * TODO: document
     *
     * @param username @todo
     * @param password @todo
     */
    create: function create(username, password, email, cb) {
        var that = this;
        pool.connect(function (err, client, done) {
            if (err) { cb(err); }

            client.query('INSERT INTO users(username, password, email, checked_in) VALUES($1, $2, $3, TRUE) RETURNING *', [username, password, email], function (err, result) {
                if (err) { cb(err); }

                var user = result.rows[0];
                user.level_metadata = {};
                that.users[user.id] = user;

                done();
                cb(user);
            });
        });
    },


    createMetadata: function (user, level_id) {
        var metadata = {
                finished: null,
                num_fails: 0
            };

        if ( ! (level_id in user.level_metadata)) {
            // We just put this out there, no need to wait for it
            pool.connect(function (err, client, done) {
                if (err) { console.log(err); }

                client.query('INSERT INTO level_metadata(user_id, level_id) VALUES($1, $2)',
                    [user.id, level_id], function (err, result) {
                        if (err) { console.log(err); }
                        done();
                });
            });

            user.level_metadata[level_id] = metadata;
        } else {
            // do nothing...
        }
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

            client.query('SELECT user_id, username, name, max(level_id) as level, (max(finished) - (date(now()) + interval \'12 hours\')) + sum(times_failed) * interval \'1 minute\' as total_time FROM users JOIN level_metadata ON users.id=level_metadata.user_id WHERE finished IS NOT NULL GROUP BY user_id, username ORDER BY level desc, total_time', [],
                function (err, result) {
                    done();

                    if (err) { console.log(err); }

                    cb(result.rows.map(function (obj) { return {
                        user: obj.username,
                        level: obj.level,
                        time: ~~obj.total_time.hours + ':' + ~~obj.total_time.minutes + ':' + ~~obj.total_time.seconds,
                    }; }));

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

            client.query('SELECT user_id, username, name, (coalesce(finished, now()) - (date(now()) + interval \'12 hours\')) + times_failed * interval \'1 minute\'  as time FROM users JOIN level_metadata ON users.id=level_metadata.user_id WHERE level_id = $1 ORDER BY time', [ level_id],
                function (err, result) {
                    done();

                    if (err) console.log(err);

                    cb(result.rows.map(function (obj) { return {
                        user: obj.username,
                        time: ~~obj.time.hours + ':' + ~~obj.time.minutes + ':' + ~~obj.time.seconds,
                    }; }));
                }
            );
        });
    },

    /**
     * TODO: document
     *
     * @param user @todo
     */
    fail: function fail(user, level_id) {
        pool.connect(function (err, client, done) {
            if (err) { console.log(err); }

            client.query('UPDATE level_metadata SET times_failed = times_failed + 1 WHERE user_id = $1 AND level_id = $2', [user.id, level_id],
                function (err, result) {
                    done();

                    if (err) console.log(err);
                }
            );
        });
    },

    finish: function(user, level_id) {
        var d = new Date();
        user.level_metadata[level_id].finished = d;

        pool.connect(function (err, client, done) {
            if (err) { console.log(err); }

            client.query('UPDATE level_metadata SET finished = $1 WHERE user_id = $2 AND level_id = $3', [d, user.id, level_id],
                function (err, result) {
                    done();

                    if (err) console.log(err);
                }
            );
        });
    },
};

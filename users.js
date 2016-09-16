var pool = require('./pool');

module.exports = {
    users: {},
    reload: function reload(cb) {
        var that = this;

        pool.connect(function (err, client, done) {
            if (err) { cb(err); }

            client.query('SELECT * FROM users', [], function (err, result) {
                if (err) { cb(err); }

                var waiter = (function (cb) {
                    var num = result.rows.length,
                        inc = 0;
                    
                    return function () { if (++inc == num) { cb(); } };
                }(function () {
                    cb(); 
                }));

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

                        waiter();
                    });
                }
            });
        });
    },
    update: function update(uid, cb) {
        pool.connect(function (err, client, done) {
            if (err) { cb(err); }

            //update level metadata to database
        });
    },
}

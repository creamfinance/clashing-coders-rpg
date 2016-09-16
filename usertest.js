var pool = require('./pool');
var bcrypt = require('bcrypt');

pool.connect(function (err, client, done) {
    bcrypt.genSalt(null, function (err, result) {
        bcrypt.hash('asdf', result,
            function (err, result) {
                console.log(result);
                client.query('UPDATE users SET password = $1 WHERE id = 1', [ result ],
                    function (err, result) {
                        done();
                    }
                );
        });
    });
});

var pg = require('pg');

var config = {
    user: 'postgres',
    database: 'clashing_coders',
    host: 'localhost',
    port: 5432,
    max: 10,
};
var pool = new pg.Pool(config);
module.exports = pool;

pool.on('error', function (err, client) {
  // if an error is encountered by a client while it sits idle in the pool
  // the pool itself will emit an error event with both the error and
  // the client which emitted the original error
  // this is a rare occurrence but can happen if there is a network partition
  // between your application and the database, the database restarts, etc.
  // and so you might want to handle it and at least log it out
  console.error('idle client error', err.message, err.stack)
})

module.exports = function waiter(count, cb) {
    var i = 0; return function () { if (++i == count) { cb(); } };
};

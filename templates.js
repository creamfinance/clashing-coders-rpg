var fs = require('fs'),
    swig = require('swig');

module.exports = {
    templates: {},
    /**
     * TODO: document
     * 
     * @param template @todo 
     */
    get: function get(template) {
        return this.templates[template];
    },
    /**
     * TODO: recursion into directories
     * 
     * @param cb @todo 
     */
    load: function load(cb) {
        var that = this;

        fs.readdir('views', function (err, files) {
            if (err) { cb(err); return; } 

            for (var i = 0, max = files.length; i < max; i += 1) {
                that.templates[files[i].split('.')[0]] = swig.compileFile('views/' + files[i]);
            }
            cb();
        });
    },
    
}

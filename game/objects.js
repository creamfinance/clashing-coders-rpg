var id = 0;

function ObjectDefinition(name, that, options) {
    var GameObject = function () { 
        for (var key in that) {
            this[key] = that[key];
        }
    }

    GameObject.prototype = options;
    GameObject.prototype.id = id++;
    GameObject.prototype.name = name;
}

module.exports = {
    228: new ObjectDefinition('lever', { active: false }, {
        interact: function () { this.active = ! this.active; }
    }),
};

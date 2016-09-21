module.exports = function (vars) {
    var ret = {},
        immediate = {};

    for (var vname in vars) {
        immediate = {};

        vars[vname].unshift(new RequiredRule());
        
        immediate[vname] = vars[vname];
        ret[vname] = new Validator(immediate);
    }

    return ret;
};

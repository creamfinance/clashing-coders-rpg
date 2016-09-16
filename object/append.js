F(Object.prototype, 'append',
    function (data) {
        if (data) {
            for (var name in data) {
                this[name] = data[name];
            }
        }

        return this;
    }
);


F(Object.prototype, 'appendRecursive',
    function (data) {
        if (data) {
            for (var name in data) {
                if (name in this && typeof this[name] == 'object') {
                    this[name].appendRecursive(data[name]);
                } else {
                    this[name] = data[name];
                }
            }
        }

        return this;
    }
);


var BaseContext = Class.bind(null, 'BaseContext', Object);

module.exports = BaseContext({
    constructor: function (request) {
        this.request = request;

        this.queryCounterSelect = 0;
        this.queryCounterInsert = 0;
        this.queryCounterUpdate = 0;
        this.queryCounterDelete = 0;
    },
    /* Called when a query is done */
    queryDone: function (query, settings) {
        if (settings.text.toLowerCase().indexOf('SELECT'.toLowerCase()) == 0) {
            this.queryCounterSelect++;
        } else if (settings.text.toLowerCase().indexOf('UPDATE'.toLowerCase()) == 0) {
            this.queryCounterInsert++;
        } else if (settings.text.toLowerCase().indexOf('INSERT'.toLowerCase()) == 0) {
            this.queryCounterUpdate++;
        } else if (settings.text.toLowerCase().indexOf('DELETE'.toLowerCase()) == 0) {
            this.queryCounterDelete++;
        }
    },
    /* 
        Called when the associated request is done.
        Means we append infos from the context here.
    */
    requestDone: function (request) {
        request.appendInfo('Queries (' + 
            this.queryCounterSelect + ', ' +
            this.queryCounterInsert + ', ' +
            this.queryCounterUpdate + ', ' +
            this.queryCounterDelete + ')');
    },

    getAuthorization: function (type) {
        // get auth info for affiliate
        for (var i = 0; i < this.request.authorization.length; i++) {
            if (this.request.authorization[i].type == type) {
                return this.request.authorization[i];
            }
        }

        return null;
    }
});

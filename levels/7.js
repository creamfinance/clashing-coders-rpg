module.exports = {
    init: function () {
        this.pushedButtons = [];
    },
    player_definition: [{ x:10, y:190 }],
    goodButtons: [
            { x: 19, y: 18 },
            { x: 30, y: 37 },
            { x: 24, y: 84 },
            { x: 24, y: 132 },
            { x: 23, y: 168 },

            { x: 55, y: 167 },
            { x: 92, y: 33 },
            { x: 69, y: 55 },
            { x: 93, y: 106 },
            { x: 121, y: 69 },

            { x: 129, y: 149 },
            { x: 145, y: 110 },
            { x: 170, y: 27 },
            { x: 182, y: 72 },
            { x: 178, y: 164 },
    ],
    isFinished: function (players) {
        for (var pbi in this.pushedButtons) {
            var pushedButton = this.pushedButtons[pbi];
            var found = false;

            for (var bi in this.goodButtons) {
                if (this.goodButtons[bi].x == pushedButton.x && this.goodButtons[bi].y == pushedButton.y) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                console.log('pushed a wrong button');
                return false;
            }
        }

        for (var gbi in this.goodButtons) {
            var goodButton = this.goodButtons[gbi];
            var found = false;

            for (var bi in this.pushedButtons) {
                if (this.pushedButtons[bi].x == goodButton.x && this.pushedButtons[bi].y == goodButton.y) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                console.log('not all buttons pushed');
                return false;
            }
        }

        return found;
    },
    processAction: function (player, action, options) {
        options = options || {};

        switch (action.toLowerCase()) {
            case 'up':
            case 'down':
            case 'left':
            case 'right':
                this.movePlayer(player, action, options);
                return true;
            default:
                return false;
        }
    },
    movePlayer: require('./movePlayer'),
};

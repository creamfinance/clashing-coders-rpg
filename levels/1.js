module.exports = {
    start: {x: 5, y: 5},
    isFinished: function (player) {
        return player.position.x == 8 && player.position.y == 1;
    },
    processAction: function (player, action) {
        switch (action.toLowerCase()) {
            case 'up':
            case 'down':
            case 'left':
            case 'right':
                this.movePlayer(player, action);
                return true;
            default:
                return false;
        }
    },
    movePlayer: function (player, direction) {
        var position = {x: player.position.x, y: player.position.y};

        switch (direction.toLowerCase()) {
            case 'up':
                position.y -= 1;
                break;
            case 'down':
                position.y += 1;
                break;
            case 'left':
                position.x -= 1;
                break;
            case 'right':
                position.x += 1;
                break;
        }

        if (this.map.tileset[position.y][position.x].traversable) {
            player.position = position;
            player.time += this.map.tileset[position.y][position.x].weight;
            return true;
        } else {
            return false;
        }
    },
};

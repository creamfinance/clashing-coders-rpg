module.exports = function (player, direction, options) {
    var position = {x: player.position.x, y: player.position.y},
        steps = options.steps || 1;

    for (var i = 0; i < steps; i += 1) {
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

        if (position.x >= 0 && position.y >= 0 && this.map[position.y][position.x].traversable) {
            player.position.x = position.x;
            player.position.y = position.y;
        } else {
            break;
        }
    }
};

module.exports = function (player, direction) {
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
};

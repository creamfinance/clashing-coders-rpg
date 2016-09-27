module.exports = function (player) {
    var position = {x: player.position.x, y: player.position.y};

    this.map[position.y][position.x].interact(player);
};

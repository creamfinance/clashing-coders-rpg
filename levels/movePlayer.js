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

        if (position.x >= 0 && position.y >= 0 && position.x < this.width && position.y < this.height) {
            if(this.map[position.y][position.x].type == "keydoor" && this.map[position.y][position.x].traversable == false && player.inventory.keys > 0) {
                this.map[position.y][position.x].traversable = true;
                player.inventory.keys--;

                player.position.x = position.x;
                player.position.y = position.y;

                player.steps += this.map[position.y][position.x].weight;
            }
            else if (this.map[position.y][position.x].type == "button" && this.map[position.y][position.x].used == false) {
                player.pushedButtons.push({ x: position.x, y: position.y });
                this.map[position.y][position.x].used == true;

                player.position.x = position.x;
                player.position.y = position.y;

                player.steps += this.map[position.y][position.x].weight;
            }
            else if (this.map[position.y][position.x].type == "key" && this.map[position.y][position.x].used == false) {
                player.inventory.keys++;
                this.map[position.y][position.x].used == true;

                player.position.x = position.x;
                player.position.y = position.y;

                player.steps += this.map[position.y][position.x].weight;
            }
            else if (this.map[position.y][position.x].type == "water" && this.map[position.y][position.x].traversable == false && player.inventory.wood > 0) {
                player.inventory.wood--;
                this.map[position.y][position.x].traversable == true;

                player.position.x = position.x;
                player.position.y = position.y;

                player.steps += this.map[position.y][position.x].weight;
            }
            else if (this.map[position.y][position.x].type == "apple" && this.map[position.y][position.x].used == false) {
                player.inventory.apple++;
                this.map[position.y][position.x].used == true;

                player.position.x = position.x;
                player.position.y = position.y;

                player.steps += this.map[position.y][position.x].weight;
            }
            else if(this.map[position.y][position.x].traversable) {
                player.position.x = position.x;
                player.position.y = position.y;

                player.steps += this.map[position.y][position.x].weight;
            }
        } else {
            break;
        }
    }
};

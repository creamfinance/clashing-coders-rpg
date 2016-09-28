module.exports = function Player(position) {
    this.position = {x: position.x, y: position.y};
    this.inventory = {};
    this.steps = 0;
    this.pushedButtons = [];
};

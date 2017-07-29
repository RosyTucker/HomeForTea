GameOverState = function (game) {
  this.gameTime = 0;
  this.game = game;
};

GameOverState.prototype.preload = function () {
};

GameOverState.prototype.create = function () {
  this.game.stage.setBackgroundColor('#D8D8D8');
  this.createText();
};

GameOverState.prototype.update = function () {
  if (this.game.input.activePointer.isDown) {
    this.game.state.start('game');
  }
};

GameOverState.prototype.render = function () {
};

GameOverState.prototype.createText = function () {
  const text = this.game.add.text(
    this.game.world.centerX,
    this.game.world.centerY,
    `Game Over \n You lasted ${this.gameTime} seconds, and your tea got cold \n\n Click to play again!`
  );
  text.anchor.setTo(0.5);
  text.fill = '#157871';
  text.font = 'Helvetica';
  text.fontWeight = 600;
  text.fontSize = 60;
  text.align = 'center';
};

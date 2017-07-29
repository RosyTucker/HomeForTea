function Preloader(game)
{
  this.game = game;
}

Preloader.prototype.preload = function() {
  const gameState = new GameState(this.game);
  const gameOverState = new GameOverState(this.game);
  gameState.preload();
  gameOverState.preload();
  this.game.state.add('game', gameState);
  this.game.state.add('gameOver', gameOverState);
};

Preloader.prototype.create = function() {
  // if(!this.music) {
  //   this.music = this.game.add.audio('music');
  //   this.music.play('', 0, 0.5, true);
  // }
  this.game.state.start('game');
};
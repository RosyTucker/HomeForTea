function Preloader(game)
{
  this.game = game;
}

Preloader.prototype.preload = function() {
  const gameState = new GameState(this.game);
  gameState.preload();
  this.game.state.add('game', gameState);
};

Preloader.prototype.create = function() {
  // if(!this.music) {
  //   this.music = this.game.add.audio('music');
  //   this.music.play('', 0, 0.5, true);
  // }
  this.game.state.start('game');
};
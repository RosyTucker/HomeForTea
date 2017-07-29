$(function() {
  const canvas = $('#game-canvas-container');
  const width = canvas.width();
  const height = canvas.height();
  const game = new Phaser.Game(width, height, Phaser.AUTO, 'game-canvas-container', null, false, false);
  const preloader = new Preloader(game);
  game.state.add('preloader', preloader);
  game.state.start('preloader');
});
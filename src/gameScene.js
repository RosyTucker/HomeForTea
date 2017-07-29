WorldConfig = {};

const verticalVelocityDelta = 400;
const horizontalVelocityDelta = 2;

const tileSize = 200;

Scenery = function (game, y) {

  const textures = ['scenery1', 'scenery2', 'scenery3'];
  const items = new Set();

  let nextItemX = 0;
  let spriteGroup;

  const addNewItem = function (spriteGroup) {
    const item = new SceneryItem(game, randomItem(textures), nextItemX, y);
    items.add(item);
    item.create(spriteGroup);
    nextItemX += tileSize;
    return item;
  };

  this.create = function () {
    spriteGroup = game.add.group(undefined, 'scenery', false, true, Phaser.Physics.ARCADE);
    this.spriteGroup = spriteGroup;

    const itemsRequired = Math.round(game.world.width / tileSize) + 1;

    for (let i = 0; i < itemsRequired; i++) {
      addNewItem(spriteGroup, i * tileSize);
    }
  };

  this.update = function (cursors, player) {
    items.forEach(function (item) {
      if (item.sprite.position.x > -tileSize) return;
      addNewItem(spriteGroup);
      items.delete(item);
      spriteGroup.remove(item.sprite);
      item.sprite.destroy();
    });

    items.forEach(function (item) {
      item.update(cursors, player);
    });
  }
};

SceneryItem = function (game, texture, x, y) {
  this.create = function (group) {
    this.sprite = group.create(x, y, texture);
    this.sprite.body.immovable = true;
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  };

  this.update = function (cursors, player) {
    this.sprite.body.position.x = x - player.realX;
  };
};

Player = function (game) {
  this.realX = 0;
  this.currentVelocityX = 0;

  this.create = function () {
    this.sprite = game.add.sprite(150, game.world.centerY, 'player');
    this.sprite.anchor.setTo(0.5, 0.5);
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.health = 20;
    this.sprite.body.collideWorldBounds = true;
  };

  this.update = function (cursors, ...collisionGroups) {
    const sprite = this.sprite;

    collisionGroups.forEach(function (group) {
      game.physics.arcade.collide(sprite, group);
    });

    if (cursors.right.isDown) {
      this.currentVelocityX = Math.min(30, this.currentVelocityX + horizontalVelocityDelta);
    } else {
      this.currentVelocityX = Math.max(0, this.currentVelocityX - horizontalVelocityDelta/2);
    }

    this.realX = this.realX + this.currentVelocityX;


    if (cursors.up.isDown) {
      this.sprite.body.velocity.y = -verticalVelocityDelta;
    } else if (cursors.down.isDown) {
      this.sprite.body.velocity.y = verticalVelocityDelta;
    } else {
      this.sprite.body.velocity.y = 0;
    }
  }
};

GameState = function (game) {
  let player, topScenery, bottomScenery;
  let cursors;

  this.preload = function () {
    player = new Player(game);
    topScenery = new Scenery(game, 0);
    bottomScenery = new Scenery(game, game.world.height - tileSize);
    cursors = game.input.keyboard.createCursorKeys();
    game.load.image('player', 'assets/player/player.svg');
    game.load.image('scenery1', 'assets/images/scenery1.svg');
    game.load.image('scenery2', 'assets/images/scenery2.svg');
    game.load.image('scenery3', 'assets/images/scenery3.svg');
    game.stage.backgroundColor = "#D8D8D8";
  };

  this.create = function () {
    player.create();
    topScenery.create();
    bottomScenery.create();
    game.camera.focusOnXY(0, 0);
  };

  this.update = function () {
    player.update(cursors, topScenery.spriteGroup, bottomScenery.spriteGroup);
    topScenery.update(cursors, player);
    bottomScenery.update(cursors, player);
  };

  this.render = function () {
    game.debug.text('Hello', 32, 32);
    // game.debug.body(player.sprite);
    // bottomScenery.spriteGroup.forEach(function (item) {
    //   game.debug.body(item)
    // });
    // topScenery.spriteGroup.forEach(function (item) {
    //   game.debug.body(item)
    // });
  };
};

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}
const verticalVelocityDelta = 400.0;
const powerReductionYFactor = 120;

const horizontalVelocityDelta = 2.0;
const powerReductionXFactor = 400;

const constantPowerReduction = 0.0001;

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
  this.power = 100;
  this.currentVelocityX = 0;

  this.create = function () {
    this.sprite = game.add.sprite(150, game.world.centerY, 'player');
    this.sprite.anchor.setTo(0.5, 0.5);
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.collideWorldBounds = true;
  };

  this.update = function (cursors, ...collisionGroups) {
    const sprite = this.sprite;

    collisionGroups.forEach(function (group) {
      game.physics.arcade.collide(sprite, group);
    });


    let deltaX, deltaY;
    if (cursors.right.isDown) {
      deltaX = Math.min(30, this.currentVelocityX + horizontalVelocityDelta);
    } else {
      deltaX = Math.max(0, this.currentVelocityX - horizontalVelocityDelta / 2);
    }

    this.currentVelocityX = deltaX;
    this.realX = this.realX + this.currentVelocityX;

    if (cursors.up.isDown) {
      deltaY = -verticalVelocityDelta;
    } else if (cursors.down.isDown) {
      deltaY = verticalVelocityDelta;
    } else {
      deltaY = 0;
    }

    this.sprite.body.velocity.y = deltaY;

    const powerReductionForX = Math.abs(deltaX) / powerReductionXFactor;
    const powerReductionForY = Math.abs(deltaY) / powerReductionYFactor;

    this.power -= powerReductionForX + powerReductionForY + constantPowerReduction;
  }
};

GameState = function (game) {
  let player, topScenery, bottomScenery, powerDisplay;
  let startTime;
  let cursors;

  const endGameIfNeeded = function () {
    console.error(game.time.now - startTime);
    if (player.power <= 0) {
      game.state.states['gameOver'].gameTime = (game.time.now - startTime) / 1000;
      game.state.start('gameOver');
    }
  };

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
    const style = { font: "32px Helvetica" };
    powerDisplay = game.add.text(12, game.world.height - tileSize - 50, '', style);

    game.camera.focusOnXY(0, 0);
  };

  this.update = function () {
    startTime = startTime || game.time.now;
    player.update(cursors, topScenery.spriteGroup, bottomScenery.spriteGroup);
    topScenery.update(cursors, player);
    bottomScenery.update(cursors, player);
    endGameIfNeeded(player);
  };

  this.render = function () {
    const powerToDisplay = parseFloat(player.power).toFixed(2);
    powerDisplay.fill = powerToDisplay < 30 ? "#f12d46" : "#69a758";
    powerDisplay.text = `Power ${powerToDisplay}%`;
  };
};

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}
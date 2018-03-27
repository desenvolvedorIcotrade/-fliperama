/* global Phaser */

var player;
var cursorKeys;

var game = new Phaser.Game(800, 600, Phaser.CANVAS, "canvasGame");


var statusMain = {
    preload: function () {
        game.load.image("background", "sprites/fondoSpace1.png");
        game.load.spritesheet("player", "sprites/shipP1.png", 38, 56);
    },
    create: function () {
        game.add.tileSprite(0, 0, 800, 600, "background");

        player = game.add.sprite(game.width / 2, game.height / 2, "player");
        player.anchor.setTo(0.5);
        player.scale.setTo(0.7);
        player.animations.add("acceleration", [0, 1], 15, true);

        cursorKeys = game.input.keyboard.createCursorKeys();

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        
        player.body.maxVelocity.x = 60;
        player.body.maxVelocity.y = 60;
        
        console.log(player.angle);
    },
    update: function () {
        if (cursorKeys.right.isDown) {
            player.angle += 4;
        } else if (cursorKeys.left.isDown) {
            player.angle -= 4;
        }
        if (cursorKeys.up.isDown) {
            player.animations.play("acceleration");
            player.body.velocity.x +=  Math.cos((player.angle - 90)*Math.PI/180) ;
            //console.log("Velocidad en x: " + player.body.velocity.x  );
            player.body.velocity.y +=  Math.sin((player.angle - 90)*Math.PI/180);
            //console.log("Velocidad en y: " + player.body.velocity.y  );
        } else {
            player.animations.stop("acceleration");
            //player.body.acceleration = 0;
            player.frame = 0;
        }
    }
};

game.state.add("Main", statusMain);
game.state.start("Main");



    
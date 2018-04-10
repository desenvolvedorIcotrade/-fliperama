/* global Phaser, ClientModule */

var GameModule = (function () {

    var playerList = [];

    var getPlayerList = function () {
        return playerList;
    };

    var addNewPlayer = function (playerData) {
        if (ClientModule.getPlayerId() !== playerData.playerId) {
            var newPlayer = game.add.sprite(playerData.playerX, playerData.playerY, "player");
            playerList.push({id: playerData.playerId, sprite: newPlayer});
            newPlayer.anchor.setTo(0.5);
        }
    };

    var addNewFullCell = function (posX, posY, angle) {

        var fullCell = fullCells.getFirstDead();

        if (fullCell) {
            fullCell.anchor.setTo(0.5);
            fullCell.scale.setTo(0.7);

            fullCell.reset(posX, posY);

            game.physics.arcade.enable(fullCell);
            fullCell.body.collideWorldBounds = true;

            //direction of the fullCell
            fullCell.body.velocity.x = 20 * Math.cos(angle * Math.PI / 180);
            fullCell.body.velocity.y = 20 * Math.sin(angle * Math.PI / 180);

            //bounce of the fullCell
            fullCell.body.bounce.x = 1;
            fullCell.body.bounce.y = 1;

            //Take FullCell
            fullCell.events.onDestroy.add(function () {
                //Sonido combustible cogido               
            }, this);
        }


    };
    
    var takeFullCell = function (player, cell) {
        //Aumentar Combustible y actualiza
        ClientModule.takeFullCell(cell.z);
    };

    var eliminateFullCell = function (index) {
        var killFull = Object(fullCells.getChildAt(index));
        killFull.kill();
    };
    
    var addNewCellLife = function (posX, posY) {
        var life = lives.getFirstDead();

        if (life !== null) {
            life.anchor.setTo(0.5);
            life.scale.setTo(0.7);

            life.reset(posX, posY);

            game.physics.arcade.enable(life);
            
            //Take cellLife
            life.events.onDestroy.add(function () {
                //Sonido vida cogida               
            }, this);
        }
    };
    
    var takeCellLife = function (player, cell) {
        //Aumentar vida y actualiza
        ClientModule.takeCellLife(cell.z);
    };

    var eliminateCellLife = function (index) {
        var killLife = Object(lives.getChildAt(index));
        killLife.kill();
    };

    return {
        addNewPlayer: addNewPlayer,
        getPlayerList: getPlayerList,
        addNewFullCell: addNewFullCell,
        eliminateFullCell: eliminateFullCell,
        takeFullCell: takeFullCell,
        addNewCellLife: addNewCellLife,
        takeCellLife: takeCellLife,
        eliminateCellLife: eliminateCellLife
    };

})();

var player;
var cursorKeys;
var fullCells;
var bg;
var lives;

var game = new Phaser.Game(800, 600, Phaser.CANVAS, "canvasGame");

var connected = false;

var statusMain = {
    preload: function () {
        game.load.image("background", "assets/fondoSpace1.png");

        game.load.spritesheet("player", "assets/shipP1.png", 26, 40);
        game.load.image("fullCell", "assets/fullCell.png");
        game.load.image("life", "assets/life.png");
    },
    create: function () {
        bg = game.add.tileSprite(0, 0, 800, 600, "background");


        var playerX = Math.floor(Math.random() * 801);
        var playerY = Math.floor(Math.random() * 601);

        player = game.add.sprite(playerX, playerY, "player");
        player.anchor.setTo(0.5);
        player.animations.add("acceleration", [0, 1], 15, true);

        cursorKeys = game.input.keyboard.createCursorKeys();

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.enable(player);

        player.body.collideWorldBounds = true;
        player.body.maxVelocity.x = 60;
        player.body.maxVelocity.y = 60;

        game.stage.disableVisibilityChange = true;

        fullCells = game.add.group();
        fullCells.enableBody = true;
        fullCells.createMultiple(3, "fullCell");

        lives = game.add.group();
        lives.enableBody = true;
        lives.createMultiple(3, "life");

        callback = {
            onSuccess: function () {
                ClientModule.registerPlayer(playerX, playerY);
                connected = true;
            },
            onFailure: function () {
                //alert("Can't Connect to Game Server");
            }
        };

        ClientModule.connect(callback);
    },
    update: function () {

        //Movement of the background
        bg.tilePosition.x -= 0.5;

        //Movement of the spaceship
        if (cursorKeys.right.isDown) {
            player.angle += 4;
        } else if (cursorKeys.left.isDown) {
            player.angle -= 4;
        }
        if (cursorKeys.up.isDown) {
            player.animations.play("acceleration");

            player.body.velocity.x += Math.cos((player.angle - 90) * Math.PI / 180);

            player.body.velocity.y += Math.sin((player.angle - 90) * Math.PI / 180);

        } else {
            player.animations.stop("acceleration");
            player.frame = 0;
        }

        //collision of the cells with the spaceship
        game.physics.arcade.overlap(player, fullCells, GameModule.takeFullCell, null, this);
        //collision of the life with the spaceship
        game.physics.arcade.overlap(player, lives, GameModule.takeCellLife, null, this);

        //Multiplayer position update
        if (connected === true) {
            ClientModule.sendUpdatePlayer(player.x, player.y, player.angle);
        }
    }
};

game.state.add("Main", statusMain);
game.state.start("Main");



    
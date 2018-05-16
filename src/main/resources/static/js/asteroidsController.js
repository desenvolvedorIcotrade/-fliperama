/* global Phaser, ClientModule, MenuInitial, game, points, playerLives */

var player;
var cursorKeys;
var spaceKey;
var shootFlag = false;
var restartFlag = false;
var pointsText;
var lifesText;

var connected = false;
var asteroidsGroup;
var bulletsGroup;
var fuelCells;
var bg;
var lives;

var fuelBar;
var fuelPercent = 100;


var barFlag = 40;

var GameModule = (function () {

    var playerList = [];

    var getPlayerList = function () {
        return playerList;
    };
    
    //se modifico
    var addNewPlayer = function (playerData) {
        if (ClientModule.getPlayerId() !== playerData.playerId) {
            var newPlayer = game.add.sprite(playerData.playerX, playerData.playerY, "player");

            var fBar = new HealthBar(game, {x: 140 , y: barFlag + 25, height: 10});
            fBar.setBarColor("#02daff");
            
            var pointsT= game.add.text(10 , barFlag, playerData.playerId + " 0", {
                font: "18px Arial",
                fill: "#ffffff",
                align: "center"
            });
            var lifesT = game.add.text(200, barFlag, "Lifes 3", {
                font: "18px Arial",
                fill: "#ffffff",
                align: "center"
            });
            
            barFlag += 40; 

            playerList.push({id: playerData.playerId, sprite: newPlayer, fBar: fBar, pointsT: pointsT, lifesT: lifesT});
            newPlayer.anchor.setTo(0.5);
        }
    };

    var addNewFuelCell = function (posX, posY, angle) {

        var fuelCell = fuelCells.getFirstDead();

        if (fuelCell) {
            fuelCell.anchor.setTo(0.5);
            fuelCell.scale.setTo(0.7);

            fuelCell.reset(posX, posY);

            game.physics.arcade.enable(fuelCell);
            fuelCell.body.collideWorldBounds = true;

            //direction of the fuelCell
            fuelCell.body.velocity.x = 20 * Math.cos(angle * Math.PI / 180);
            fuelCell.body.velocity.y = 20 * Math.sin(angle * Math.PI / 180);

            //bounce of the fuelCell
            fuelCell.body.bounce.x = 1;
            fuelCell.body.bounce.y = 1;

            //Take fuelCell
            fuelCell.events.onDestroy.add(function () {
                //Sonido combustible cogido               
            }, this);
        }
    };

    var takeFuelCell = function (player, cell) {
        //Aumentar Combustible 
        fuelPercent += 20;
        fuelBar.setPercent(fuelPercent);
        //Actualiza otros clientes
        ClientModule.takeFuelCell(cell.z);
        ClientModule.updateBarfuels();
    };

    var eliminateFuelCell = function (index) {
        var killfuel = Object(fuelCells.getChildAt(index));
        killfuel.kill();
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

    var addNewAsteroid = function (posX, posY, angle, asteroidId) {

        var asteroid1 = game.add.sprite(posX, posY, "asteroid1");

        game.physics.arcade.enable(asteroid1);
        asteroid1.body.collideWorldBounds = false;
        asteroid1.checkWorldBounds = true;
        asteroid1.events.onOutOfBounds.add(function () {
            asteroid1.destroy();
        }, this);
        asteroidsGroup.add(asteroid1);

        asteroid1.name = asteroidId;
        asteroid1.angle = angle;
        asteroid1.anchor.setTo(0.5);
        asteroid1.body.velocity.x = 50 * Math.cos((asteroid1.angle) * Math.PI / 180);
        asteroid1.body.velocity.y = 50 * Math.sin((asteroid1.angle) * Math.PI / 180);
    };

    var playerShoots = function (posX, posY, angle, playerId) {

        var bullet = game.add.sprite(posX, posY, "bala1");
        game.physics.arcade.enable(bullet);
        bullet.body.collideWorldBounds = false;
        bullet.checkWorldBounds = true;
        bullet.events.onOutOfBounds.add(function () {
            bullet.destroy();
        }, this);
        bulletsGroup.add(bullet);

        bullet.angle = angle - 90;
        bullet.shooter = playerId;
        bullet.anchor.setTo(0.5);
        bullet.body.velocity.x = 400 * Math.cos((bullet.angle) * Math.PI / 180);
        bullet.body.velocity.y = 400 * Math.sin((bullet.angle) * Math.PI / 180);

    };

    var destroyDeadAsteroids = function () {
        asteroidsGroup.forEachDead(function (asteroid) {
            asteroid.destroy();
        });
    };
    
    //MOdifique para que actualize el texto correspondiente 
    var updatePoints = function (shooter, points) {
        for (var _x = 0; _x < playerList.length; _x++) { 
            if(playerList[_x].id === shooter){
                playerList[_x].pointsT.setText(shooter + " " + points);
            }
        }
    };

    var updateLifes = function (plyr, lifes) {
        for (var _x = 0; _x < playerList.length; _x++) { 
            if(playerList[_x].id === plyr){
                playerList[_x].lifesT.setText("Lifes "+lifes);
            }
        }
    };

    var eliminateAsteroid = function (astId) {
        var asteroidSprite = asteroidsGroup.getByName(astId);
        if (asteroidSprite !== null) {
            asteroidSprite.kill();
        }
    };

    var testGameRestart = function () {
        if (spaceKey.r_key.isDown && (restartFlag === false)) {
            restartFlag = true;
            ClientModule.restartGame(true);
        }
    };
    
    var updateBarfuels = function (playerBarID, percent) {
        for (var _x = 0; _x < playerList.length; _x++) { 
            if(playerList[_x].id === playerBarID){
                playerList[_x].fBar.setPercent(percent);
            }
        }
    };
    
    var initStats = function () {
        playerLives = 3;
        points = 0;
        fuelPercent = 100;
    };

    return {
        addNewPlayer: addNewPlayer,
        getPlayerList: getPlayerList,
        addNewAsteroid: addNewAsteroid,
        playerShoots: playerShoots,
        destroyDeadAsteroids: destroyDeadAsteroids,
        updatePoints: updatePoints,
        updateLifes: updateLifes,
        eliminateAsteroid: eliminateAsteroid,
        testGameRestart: testGameRestart,
        addNewFuelCell: addNewFuelCell,
        eliminateFuelCell: eliminateFuelCell,
        takeFuelCell: takeFuelCell,
        addNewCellLife: addNewCellLife,
        takeCellLife: takeCellLife,
        eliminateCellLife: eliminateCellLife,
        updateBarfuels: updateBarfuels,
        initStats: initStats

    };

})();




var statusMain = {
    preload: function () {

        game.load.image("background", "assets/fondoSpace1.png");
        game.load.spritesheet("player", "assets/shipP1.png", 26, 40);
        game.load.image("fuelCell", "assets/fuelCell.png");
        game.load.image("life", "assets/life.png");
        game.load.image("asteroid1", "assets/asteroid1.png");
        game.load.image("bala1", "assets/bala.png");

    },
    create: function () {
        bg = game.add.tileSprite(0, 0, 800, 600, "background");


        var playerX = Math.floor(Math.random() * 801);
        var playerY = Math.floor(Math.random() * 601);

        player = game.add.sprite(playerX, playerY, "player");
        player.anchor.setTo(0.5);
        player.animations.add("acceleration", [0, 1], 15, true);

        cursorKeys = game.input.keyboard.createCursorKeys();
        spaceKey = game.input.keyboard.addKeys({"space": Phaser.KeyCode.SPACEBAR, "r_key": Phaser.KeyCode.R});

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.enable(player);

        player.body.collideWorldBounds = true;
        player.body.maxVelocity.x = 60;
        player.body.maxVelocity.y = 60;

        game.stage.disableVisibilityChange = true;

        fuelCells = game.add.group();
        fuelCells.enableBody = true;
        fuelCells.createMultiple(3, "fuelCell");

        lives = game.add.group();
        lives.enableBody = true;
        lives.createMultiple(3, "life");

        asteroidsGroup = game.add.group();
        asteroidsGroup.enableBody = true;
        bulletsGroup = game.add.group();
        bulletsGroup.enableBody = true;

        //create bar fuel

        fuelBar = new HealthBar(game, {x: 140, y: 30, height: 10});
        fuelBar.setBarColor("#02daff");


        pointsText = game.add.text(10, 5, "", {
            font: "18px Arial",
            fill: "#ffffff",
            align: "center"
        });
        //pointsText.anchor.setTo(0.5, 0.5);

        lifesText = game.add.text(200, 5, "", {
            font: "18px Arial",
            fill: "#ffffff",
            align: "center"
        });
        //lifesText.anchor.setTo(0.5, 0.5);

        var callback = {
            onSuccess: function () {

                ClientModule.registerPlayer(playerX, playerY);
                GameModule.initStats();
                connected = true;
                pointsText.setText(ClientModule.getPlayerId() + " " + points);
                lifesText.setText(" Lifes " + playerLives);
            },
            onFailure: function () {
                //alert("Can't Connect to Game Server");
            }
        };
        connected = false;
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
        if (cursorKeys.up.isDown && (fuelPercent > 0)) {
            player.animations.play("acceleration");

            player.body.velocity.x += Math.cos((player.angle - 90) * Math.PI / 180);

            player.body.velocity.y += Math.sin((player.angle - 90) * Math.PI / 180);

            //empty fuel          
            fuelPercent -= 0.1;
            fuelBar.setPercent(fuelPercent);
            ClientModule.updateBarfuels();

        } else {
            player.animations.stop("acceleration");
            player.frame = 0;
        }

        //collision of the cells with the spaceship
        game.physics.arcade.overlap(player, fuelCells, GameModule.takeFuelCell, null, this);
        //collision of the life with the spaceship
        game.physics.arcade.overlap(player, lives, GameModule.takeCellLife, null, this);

        if (spaceKey.space.isDown && (shootFlag === false)) {
            shootFlag = true;
            ClientModule.playerShoots(player.x, player.y, player.angle);
        } else if (!spaceKey.space.isDown && (shootFlag === true)) {
            shootFlag = false;
        }

        GameModule.testGameRestart();

        GameModule.destroyDeadAsteroids();
        game.physics.arcade.overlap(bulletsGroup, asteroidsGroup, this.destroyAsteroid, null, this);
        game.physics.arcade.overlap(player, asteroidsGroup, this.asteroidTouch, null, this);

        //Multiplayer position update - revisar
        if (connected === true) {
            ClientModule.sendUpdatePlayer(player.x, player.y, player.angle);
        }
    },
    addNewAsteroid: function () {
        GameModule.addNewAsteroid();
    },
    destroyAsteroid: function (bullet, asteroid) {
        asteroid.kill();
        bullet.kill();
        ClientModule.informAsteroidDestroyed(bullet.shooter);
    },
    asteroidTouch: function (plyr, asteroid) {
        asteroid.kill();
        ClientModule.informAsteroidTouch(asteroid.name);

    }
};


/* global Phaser, ClientModule */

var player;
var cursorKeys;
var spaceKey;
var shootFlag = false;
var restartFlag = false;
var pointsText;
var lifesText;
var game = new Phaser.Game(800, 600, Phaser.CANVAS, "canvasGame");
var connected = false;
var asteroidsGroup;
var bulletsGroup;

var GameModule = (function () {
    
    var playerList = [];
    
    var getPlayerList = function () {
        return playerList;
    };
    
    var addNewPlayer = function (playerData) {
        if (ClientModule.getPlayerId() !== playerData.playerId) {
            var newPlayer = game.add.sprite(playerData.playerX, playerData.playerY, "player");
            playerList.push({id:playerData.playerId, sprite:newPlayer});
            newPlayer.anchor.setTo(0.5);
        }
    };
    
    var addNewAsteroid = function(posX, posY, angle, asteroidId) {
        
        var asteroid1 = game.add.sprite(posX, posY, "asteroid1");
        
        game.physics.arcade.enable(asteroid1);
        asteroid1.body.collideWorldBounds = false;
        asteroid1.checkWorldBounds = true;
        asteroid1.events.onOutOfBounds.add(function() {asteroid1.destroy();}, this);
        asteroidsGroup.add(asteroid1);
        
        asteroid1.name = asteroidId;
        asteroid1.angle = angle;     
        asteroid1.anchor.setTo(0.5);
        asteroid1.body.velocity.x = 50 * Math.cos((asteroid1.angle)*Math.PI/180);
        asteroid1.body.velocity.y = 50 * Math.sin((asteroid1.angle)*Math.PI/180);
    };
    
    var playerShoots = function (posX, posY, angle, playerId) {
        
        var bullet = game.add.sprite(posX, posY, "bala1");
        game.physics.arcade.enable(bullet);
        bullet.body.collideWorldBounds = false;
        bullet.checkWorldBounds = true;
        bullet.events.onOutOfBounds.add(function() {bullet.destroy();}, this);
        bulletsGroup.add(bullet);
        
        bullet.angle = angle - 90;
        bullet.shooter = playerId;
        bullet.anchor.setTo(0.5);
        bullet.body.velocity.x = 400 * Math.cos((bullet.angle)*Math.PI/180);
        bullet.body.velocity.y = 400 * Math.sin((bullet.angle)*Math.PI/180);
        
    };
    
    var destroyDeadAsteroids = function () {
        asteroidsGroup.forEachDead(function (asteroid) {
            asteroid.destroy();
        });
    };
    
    var updatePoints = function (pointsList) {
        var text = "";
        var keysList= Object.keys(pointsList);
        var valuesList = Object.values(pointsList);
        for (var _x = 0; _x < Object.keys(pointsList).length; _x++) {
            text = text + keysList[_x] + " " + valuesList[_x] + "      ";
        }
        pointsText.setText(text);
    };
    
    var updateLifes = function (lifesList) {
        var text = "";
        var keysList= Object.keys(lifesList);
        var valuesList = Object.values(lifesList);
        for (var _x = 0; _x < Object.keys(lifesList).length; _x++) {
            text = text + keysList[_x] + " Lifes " + valuesList[_x] + "      ";
        }
        lifesText.setText(text);
    };
    
    var eliminateAsteroid = function (astId) {
        var asteroidSprite = asteroidsGroup.getByName(astId);
        if (asteroidSprite !== null) asteroidSprite.kill();
    };
    
    var testGameRestart = function () {
        if (spaceKey.r_key.isDown && (restartFlag === false)) {
            restartFlag = true;
            ClientModule.restartGame(true);
        }
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
        testGameRestart: testGameRestart
    };
}());

var statusMain = {
    preload: function () {
        game.load.image("background", "sprites/fondoSpace1.png");
        game.load.spritesheet("player", "sprites/shipP1.png", 26, 40);
        game.load.image("asteroid1", "assets/asteroid1.png");
        game.load.image("bala1", "assets/bala.png");
    },
    create: function () {
        game.add.tileSprite(0, 0, 800, 600, "background");
        var playerX = Math.floor(Math.random() * 801);
        var playerY = Math.floor(Math.random() * 601);
        player = game.add.sprite(playerX, playerY, "player");
        player.anchor.setTo(0.5);
        player.animations.add("acceleration", [0, 1], 15, true);
        
        cursorKeys = game.input.keyboard.createCursorKeys();
        spaceKey = game.input.keyboard.addKeys({"space":Phaser.KeyCode.SPACEBAR, "r_key":Phaser.KeyCode.R});

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        player.body.maxVelocity.x = 60;
        player.body.maxVelocity.y = 60;
        
        game.stage.disableVisibilityChange = true;
        
        asteroidsGroup = game.add.group();
        asteroidsGroup.enableBody = true;
        bulletsGroup = game.add.group();
        bulletsGroup.enableBody = true;
        
        pointsText = game.add.text(420, 15, "", {
            font: "22px Arial",
            fill: "#ffffff",
            align: "center"
        });
        pointsText.anchor.setTo(0.5, 0.5);
        
        lifesText = game.add.text(420, 585, "", {
            font: "22px Arial",
            fill: "#ffffff",
            align: "center"
        });
        lifesText.anchor.setTo(0.5, 0.5);
        
        var callback = {
            onSuccess:function () {
                ClientModule.registerPlayer(playerX, playerY);
                connected = true;
                pointsText.setText(ClientModule.getPlayerId() + " 0");
                lifesText.setText(ClientModule.getPlayerId() + " Lifes 3");
            },
            onFailure:function () {
                //alert("Can't Connect to Game Server");
            }
        };
        
        ClientModule.connect(callback);
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
        if (spaceKey.space.isDown && (shootFlag === false)) {
            shootFlag = true;
            ClientModule.playerShoots(player.x, player.y, player.angle);
        } else if (!spaceKey.space.isDown && (shootFlag === true)){
            shootFlag = false;
        }
        
        GameModule.testGameRestart();
        
        GameModule.destroyDeadAsteroids();
        game.physics.arcade.overlap(bulletsGroup, asteroidsGroup, this.destroyAsteroid, null, this);
        game.physics.arcade.overlap(player, asteroidsGroup, this.asteroidTouch, null, this);
        
        if (connected === true) { ClientModule.sendUpdatePlayer(player.x, player.y, player.angle);}
    },
    addNewAsteroid: function() {
        GameModule.addNewAsteroid();
    },
    destroyAsteroid: function(bullet, asteroid) {
        asteroid.kill();
        bullet.kill();
        ClientModule.informAsteroidDestroyed(bullet.shooter);
    },
    asteroidTouch: function (plyr, asteroid) {
        asteroid.kill();
        ClientModule.informAsteroidTouch(asteroid.name);
    }
};

game.state.add("Main", statusMain);
game.state.start("Main");
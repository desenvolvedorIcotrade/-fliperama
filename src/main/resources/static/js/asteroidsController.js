/* global Phaser, ClientModule */

var player;
var cursorKeys;
var spaceKey;
var shootFlag = false;
var game = new Phaser.Game(800, 600, Phaser.CANVAS, "canvasGame");
var connected = false;

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
    
    var _generateSpawnPosAsteroids = function(posX, posY) {
        var genX;
        var genY;
        if (posX <= 400 & posY <= 300) {
            if (Math.random() >= 0.5) { genX = -30; genY = posY; } else { genX = posX; genY = -30; }
        }
        else if (posX >= 400 & posY <= 300) {
            if (Math.random() >= 0.5) { genX = 830; genY = posY; } else { genX = posX; genY = -30; }
        }
        else if (posX <= 400 & posY >= 300) {
            if (Math.random() >= 0.5) { genX = -30; genY = posY; } else { genX = posX; genY = 630; }
        }
        if (posX >= 400 & posY >= 300) {
            if (Math.random() >= 0.5) { genX = 830; genY = posY; } else { genX = posX; genY = 630; }
        }
        return [genX, genY];
    };
    
    var addNewAsteroid = function() {
        var asteroid1;
        var ranX = Math.random() * 800;
        var ranY = Math.random() * 600;
        var spawnPos = _generateSpawnPosAsteroids(ranX, ranY);
        var posX = spawnPos[0];
        var posY = spawnPos[1];
        
        ranX = Math.random() * 800;
        ranY = Math.random() * 600;
        var asteroidAngle = (Math.atan2(ranY - posY, ranX - posX) * 180) / Math.PI;
        
        asteroid1 = game.add.sprite(posX, posY, "asteroid1");
        
        game.physics.arcade.enable(asteroid1);
        asteroid1.body.collideWorldBounds = false;
        asteroid1.checkWorldBounds = true;
        asteroid1.events.onOutOfBounds.add(function() {asteroid1.destroy();}, this);
        asteroid1.events.onDestroy.add(function() {console.log("Asteroid Destroyed");}, this);
        
        asteroid1.angle = asteroidAngle;
        
        asteroid1.anchor.setTo(0.5);
        asteroid1.body.velocity.x = 50 * Math.cos((asteroid1.angle)*Math.PI/180);
        asteroid1.body.velocity.y = 50 * Math.sin((asteroid1.angle)*Math.PI/180);
    };
    
    var playerShoots = function () {
        
        var bullet = game.add.sprite(player.x, player.y, "bala1");
        game.physics.arcade.enable(bullet);
        bullet.body.collideWorldBounds = false;
        bullet.checkWorldBounds = true;
        bullet.events.onOutOfBounds.add(function() {bullet.destroy();}, this);
        bullet.events.onDestroy.add(function() {console.log("Bullet Destroyed");}, this);
        bullet.angle = player.angle - 90;
        bullet.anchor.setTo(0.5);
        bullet.body.velocity.x = 400 * Math.cos((bullet.angle)*Math.PI/180);
        bullet.body.velocity.y = 400 * Math.sin((bullet.angle)*Math.PI/180);
        
    };
    
    return {
        addNewPlayer: addNewPlayer,
        getPlayerList: getPlayerList,
        addNewAsteroid: addNewAsteroid,
        playerShoots: playerShoots
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
        spaceKey = game.input.keyboard.addKeys({"space":Phaser.KeyCode.SPACEBAR});

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        player.body.maxVelocity.x = 60;
        player.body.maxVelocity.y = 60;
        
        GameModule.addNewAsteroid();
        game.time.events.loop(2500, this.addNewAsteroid, this);
        
        game.stage.disableVisibilityChange = true;
        
        var callback = {
            onSuccess:function () {
                ClientModule.registerPlayer(playerX, playerY);
                connected = true;
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
            GameModule.playerShoots();
        } else if (!spaceKey.space.isDown && (shootFlag === true)){
            shootFlag = false;
        }
        if (connected === true) { ClientModule.sendUpdatePlayer(player.x, player.y, player.angle);}
    },
    addNewAsteroid: function() {
        GameModule.addNewAsteroid();
    }
};

game.state.add("Main", statusMain);
game.state.start("Main");
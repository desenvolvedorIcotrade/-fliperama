/* global Phaser, ClientModule */

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
    
    return {
        addNewPlayer: addNewPlayer,
        getPlayerList: getPlayerList
    };

})();

var player;
var cursorKeys;
var fullCells;
var bg;
var timerFull;
var lives;
var timerLives;


var game = new Phaser.Game(800, 600, Phaser.CANVAS, "canvasGame");

var connected = false;

var statusMain = {
    preload: function () {
        game.load.image("background", "assets/fondoSpace1.png");

        game.load.spritesheet("player", "assets/shipP1.png", 26, 40);
        game.load.image("fullCell","assets/fullCell.png");
        game.load.image("life","assets/life.png");
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
        
        timerFull = game.time.events.loop(45000,this.newFullCell,this);
        timerLives = game.time.events.loop(60000,this.newLife,this);


        callback = {

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

        //Movement of the background
        bg.tilePosition.x -= 1;
        
        //Movement of the spaceship
        if (cursorKeys.right.isDown) {
            player.angle += 4;
        } else if (cursorKeys.left.isDown) {
            player.angle -= 4;
        }
        if (cursorKeys.up.isDown) {
            player.animations.play("acceleration");
            
            player.body.velocity.x +=  Math.cos((player.angle - 90)*Math.PI/180) ;
            
            player.body.velocity.y +=  Math.sin((player.angle - 90)*Math.PI/180);
            
        } else {
            player.animations.stop("acceleration");
            player.frame = 0;
        }

        
        //collision of the cells with the spaceship
        game.physics.arcade.overlap(player, fullCells, this.takeFullCell, null,  this);
        //collision of the life with the spaceship
        game.physics.arcade.overlap(player, lives, this.takeLife, null,  this);
              
        //Multiplayer position update
        if (connected === true) { ClientModule.sendUpdatePlayer(player.x, player.y, player.angle);}
    },
    newFullCell: function(){
          
        var fullCell = fullCells.getFirstDead();
        
        if(fullCell !== null){
            fullCell.anchor.setTo(0.5);
            fullCell.scale.setTo(0.7);

            fullCell.reset(Math.floor(Math.random() * 801),Math.floor(Math.random() * 601));

            game.physics.arcade.enable(fullCell);
            fullCell.body.collideWorldBounds = true;
            
            //direction of the fullCell
            if(Math.floor(Math.random() * 2) === 1){    fullCell.body.velocity.x = Math.floor(Math.random() * 30);
            }else{  fullCell.body.velocity.x = -Math.floor(Math.random() * 30); }
            
            if(Math.floor(Math.random() * 2) === 1){    fullCell.body.velocity.y = Math.floor(Math.random() * 30);
            }else{  fullCell.body.velocity.y = -Math.floor(Math.random() * 30); }

            //bounce of the fullCell
            fullCell.body.bounce.x = 1;
            fullCell.body.bounce.y = 1;
        }
        
    },
    takeFullCell: function(p, cell){
        cell.kill();
    },
    newLife: function(){
        var life = lives.getFirstDead();
        
        if(life !== null){
            life.anchor.setTo(0.5);
            life.scale.setTo(0.7);

            life.reset(Math.floor(Math.random() * 801),Math.floor(Math.random() * 601));

            game.physics.arcade.enable(life);
        }
    },
    takeLife: function(p, life){
        life.kill();
    }
};

game.state.add("Main", statusMain);
game.state.start("Main");



    
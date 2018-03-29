/* global Phaser, ClientModule */

var player;
var cursorKeys;
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

var game = new Phaser.Game(800, 600, Phaser.CANVAS, "canvasGame");

var connected = false;

var statusMain = {
    preload: function () {
        game.load.image("background", "assets/fondoSpace1.png");
        game.load.spritesheet("player", "assets/shipP1.png", 26, 40);
        game.load.image("fullCell","assets/fullCell.png");

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
        
        timerFull = game.time.events.loop(45000,this.newFullCell,this);
        
      
        
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
        
        bg.tilePosition.x -= 1;
        
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
        game.physics.arcade.overlap(player, fullCells, this.takeFullCell, null,  this);
//        var playerList = GameModule.getPlayerList();
//        for (var _x = 0; _x < playerList.length; _x++) {
//            
//        }
        if (connected === true) { ClientModule.sendUpdatePlayer(player.x, player.y, player.angle);}
    },
    newFullCell: function(){
        console.log("que paso mi perro" );  
        var fullCell = fullCells.getFirstDead();
        
        fullCell.anchor.setTo(0.5);
        fullCell.scale.setTo(0.7);
        
        fullCell.reset(Math.floor(Math.random() * 801),Math.floor(Math.random() * 601));
        
        
        game.physics.arcade.enable(fullCell);
        fullCell.body.collideWorldBounds = true;
        fullCell.body.velocity.x = Math.floor(Math.random() * 30);
        fullCell.body.velocity.y = Math.floor(Math.random() * 30);
        fullCell.body.bounce.x = 1;
        fullCell.body.bounce.y = 1;
    },
    takeFullCell: function(p, cell){
        cell.kill();
    }
};

game.state.add("Main", statusMain);
game.state.start("Main");



    
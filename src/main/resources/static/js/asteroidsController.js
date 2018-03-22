/* global Phaser, ClientModule */

/*var AsteroidsControllerModule = (function () {
 
 var player;
 
 var game = new Phaser.Game(800,600,Phaser.CANVAS,"canvasGame");
 
 var statusMain = {
 
 preload: function(){
 //Carga los recursos de nuestro juego
 
 //game.load.image("background","sprites/fondoSpace1.png");
 game.load.spritesheet("player","sprites/shipP1.png",60,60);
 
 },
 
 create: function(){
 //Una vez creado el juego muestra los recursos cargados
 
 
 //game.add.tileSprite(0,0,800,600,"background");
 
 player = game.add.sprite(100,100,"player");
 },
 
 update: function(){
 //Animamos el juego
 
 }
 
 };
 
 game.state.add("Main",statusMain);
 
 
 var init = function(){
 game.state.start("Main");
 };
 
 return{
 init: init
 };
 
 
 })();*/

var GameModule = (function () {
    
    var playerList = [];
    
    var getPlayerList = function () {
        return playerList;
    };
    
    var addNewPlayer = function (playerData) {
        if (ClientModule.getPlayerId() !== playerData.playerId) {
            var newPlayer = game.add.sprite(playerData.playerX, playerData.playerY, "player");
            playerList.push({id:playerData.playerId, sprite:newPlayer});
        }
    };
    
    return {
        addNewPlayer: addNewPlayer,
        getPlayerList: getPlayerList
    };
})();

var player;
var cursorKeys;

var game = new Phaser.Game(800, 600, Phaser.CANVAS, "canvasGame");

var connected = false;

var statusMain = {
    preload: function () {
        

        game.load.image("background", "sprites/fondoSpace1.png");
        game.load.spritesheet("player", "sprites/shipP1.png", 38, 56);

    },
    create: function () {
        
        game.add.tileSprite(0, 0, 800, 600, "background");
        var playerX = Math.floor(Math.random() * 801);
        var playerY = Math.floor(Math.random() * 601);
        player = game.add.sprite(playerX, playerY, "player");
        player.anchor.setTo(0.5);
        player.scale.setTo(0.7);
        player.animations.add("acceleration", [0, 1], 15, true);

        cursorKeys = game.input.keyboard.createCursorKeys();

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;

        player.body.maxVelocity.x = 20;
        player.body.maxVelocity.y = 20;
        
        game.stage.disableVisibilityChange = true;
        
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
        
        
//        var playerList = GameModule.getPlayerList();
//        for (var _x = 0; _x < playerList.length; _x++) {
//            
//        }
        if (connected === true) { ClientModule.sendUpdatePlayer(player.x, player.y);}
    }

};

game.state.add("Main", statusMain);


game.state.start("Main");



    
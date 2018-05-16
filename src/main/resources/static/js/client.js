/* global Stomp, GameModule, SockJS, pointsText, lifesText, fuelPercent, game, GameOver */
var playerId = null;

var playerLives = 3;

var points = 0;

var ClientModule = (function () {
    
    var stompClient = null;
    
    var connect = function (callback) {
        var socket = new SockJS("/stompendpoint");
        stompClient = Stomp.over(socket);
        stompClient.connect({}, function () {
            callback.onSuccess();
        }, function () {
            callback.onFailure();
        });
    };
    
    var subscribeToNewPlayers = function () {
        stompClient.subscribe("/client/newPlayer", function (eventbody) {
            GameModule.addNewPlayer(JSON.parse(eventbody.body));
        });
    };
    
    var updatePlayer = function (playerData) {
        var playerList = GameModule.getPlayerList();
        var spriteobj = playerList.find((_x) => (_x.id === playerData.playerId));
        if (typeof spriteobj !== "undefined") {
            var sprite = spriteobj.sprite;
            sprite.x = playerData.playerX;
            sprite.y = playerData.playerY;
            sprite.angle = playerData.playerAngle;
        }
        else {
            GameModule.addNewPlayer(playerData);
        }
    };
    
    var subscribeToPlayerUpdates = function () {
        stompClient.subscribe("/client/playerUpdate", function (eventbody) {
            updatePlayer(JSON.parse(eventbody.body));
        });
    };
    
    var subscribeToNewAsteroids = function () {
        stompClient.subscribe("/client/newAsteroid", function (eventbody) {
            var data = JSON.parse(eventbody.body);
            GameModule.addNewAsteroid(data[0], data[1], data[2], data[3]);
        });
    };
    
    var subscribeToPlayerShoots = function () {
        stompClient.subscribe("/client/playerShoots", function (eventbody) {
            var data = JSON.parse(eventbody.body);
            GameModule.playerShoots(data.playerX, data.playerY, data.playerAngle, data.playerId);
        });
    };
    
    var subscribeToUpdatePoints = function () {
        stompClient.subscribe("/client/updatePoints", function (eventbody) {
            var data = JSON.parse(eventbody.body);
            GameModule.updatePoints(data.shooter, data.points);
        });
    };
    
    var subscribeToPlayerLifes = function () {
        stompClient.subscribe("/client/updateLifes", function (eventbody) {
            var data = JSON.parse(eventbody.body);
            GameModule.updateLifes(data.playerId, data.lives);
        });
    };
    
    var subscribeToEliminateAsteroids = function () {
        stompClient.subscribe("/client/eliminateAsteroid", function (eventbody) {
            var data = JSON.parse(eventbody.body);
            GameModule.eliminateAsteroid(data.asteroidId);
        });
    };
    
    var restartGame = function (local) {
        alert("Game Restarted By Admin...");
        location.reload();
        if (local === true) { stompClient.send("/app/restartGame", {}, null); }
    };
    
    var subscribeToGameRestart = function () {
        stompClient.subscribe("/client/gameRestart", function () {
            restartGame(false);
        });
    };
    
    var sendUpdatePlayer = function (playerX, playerY, playerAngle) {
        stompClient.send("/app/updatePlayer", {}, JSON.stringify({playerId:playerId, playerX:playerX, playerY:playerY, playerAngle:playerAngle}));
    };
    
    var getPlayerId = function () {
        return playerId;
    };
    
    var registerPlayer = function (playerX, playerY) {
        
        stompClient.send("/app/registerPlayer", {}, JSON.stringify({playerId:playerId, playerX:playerX, playerY:playerY}));
        subscribeToNewPlayers();
        subscribeToPlayerUpdates();
        
        subscribeToNewAsteroids();
        subscribeToPlayerShoots();
        subscribeToUpdatePoints();
        subscribeToPlayerLifes();
        subscribeToEliminateAsteroids();
        subscribeToGameRestart();

        subscribeToFuelCells();
        suscribeToLives();
        
        subscribeToBarFuel();
        
    };
    
    //Suscribe to BarFuel
    var subscribeToBarFuel = function () {
        
        //Topico para nuevas barras de combustible
        stompClient.subscribe("/client/updateBarFuels", function (eventbody) {   
            var data = JSON.parse(eventbody.body);
            GameModule.updateBarfuels(data.playerId, data.percentBar);
        });
        
                
    };
    
    var updateBarfuels = function (){
        stompClient.send("/client/updateBarFuels", {}, JSON.stringify({playerId: playerId, percentBar: fuelPercent}));
    };
    
    //Suscribe to newFuelCells
    var subscribeToFuelCells = function () {
        
        //Topico para nuevas celulas de combustion
        stompClient.subscribe("/client/newFuelCell", function (eventbody) {           
            var data = JSON.parse(eventbody.body);
            GameModule.addNewFuelCell(data[0], data[1], data[2]);
        });
        
        //Topico para cuando toman una celula
        stompClient.subscribe("/client/takeFuelCell", function (eventbody) { 
            var data = JSON.parse(eventbody.body);
            GameModule.eliminateFuelCell(data.indexCell);
        });
        
        
    };
    
    var takeFuelCell = function (index) {
        //Envia al topico que celda fue cogida
        stompClient.send("/client/takeFuelCell", {}, JSON.stringify({indexCell: index}));

    };
    
    //Suscribe to newLives
    var suscribeToLives = function () {
        
        //Topico para nuevas vidas
        stompClient.subscribe("/client/newCellLife", function (eventbody) {           
            var data = JSON.parse(eventbody.body);
            GameModule.addNewCellLife(data[0], data[1]);
        });
        
        //Topico para cuando toman una vida
        stompClient.subscribe("/client/takeCellLife", function (eventbody) { 
            var data = JSON.parse(eventbody.body);
            GameModule.eliminateCellLife(data.indexCell);
        });  
    };
    
    var takeCellLife = function (index) {
        playerLives += 1;
        lifesText.setText("Lifes " + playerLives);
        stompClient.send("/client/takeCellLife", {}, JSON.stringify({indexCell: index}));
        stompClient.send("/client/updateLifes", {}, JSON.stringify({playerId: playerId, lives: playerLives}));
     
    };
    
    var playerShoots = function (playerX, playerY, playerAngle) {
        stompClient.send("/client/playerShoots", {}, JSON.stringify({playerId:playerId, playerX:playerX, playerY:playerY, playerAngle:playerAngle}));
    };
    
    var informAsteroidDestroyed = function (shooter) {
        if (shooter === playerId) {
            points+=100;
            pointsText.setText(playerId + " "+points);
            stompClient.send("/client/updatePoints", {}, JSON.stringify({shooter: shooter, points: points}));
        }
    };
    
    var informAsteroidTouch = function (asteroidId) {
        playerLives -= 1;
        lifesText.setText("Lifes "+playerLives);
        stompClient.send("/client/updateLifes", {}, JSON.stringify({playerId: playerId, lives: playerLives}));
        stompClient.send("/client/eliminateAsteroid", {}, JSON.stringify({asteroidId: asteroidId}));
        if(playerLives === 0){
            //se pasa al ultimo estado
            GameOver.lostScreen();
            //game.state.start("GameOver");
        } 
    };
    
    
    return {
        connect: connect,
        registerPlayer: registerPlayer,
        getPlayerId:getPlayerId,
        updatePlayer: updatePlayer,
        sendUpdatePlayer: sendUpdatePlayer,
        takeFuelCell: takeFuelCell,
        takeCellLife: takeCellLife,
        playerShoots: playerShoots,
        informAsteroidDestroyed: informAsteroidDestroyed,
        informAsteroidTouch: informAsteroidTouch,
        restartGame: restartGame,
        updateBarfuels: updateBarfuels

    };
    
}());
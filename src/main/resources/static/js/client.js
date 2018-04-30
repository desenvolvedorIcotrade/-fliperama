/* global Stomp, GameModule, SockJS */

var ClientModule = (function () {
    
    var stompClient = null;
    var playerId = 100; //esto deberia ser sacado una vez por partida del api rest
    var playerLives = 3;
    var fullPlayer = null;
    var roomId = 1000; //ESTE CAMBIA CUANDO SE IMPLEMENTE LA FORMA DE ELEGIR SALA...
    
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
        stompClient.subscribe("/client/room" + roomId + "/newPlayer", function (eventbody) {
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
        stompClient.subscribe("/client/room" + roomId + "/playerUpdate", function (eventbody) {
            updatePlayer(JSON.parse(eventbody.body));
        });
    };
    
    var subscribeToNewAsteroids = function () {
        stompClient.subscribe("/client/room" + roomId + "/newAsteroid", function (eventbody) {
            var data = JSON.parse(eventbody.body);
            GameModule.addNewAsteroid(data[0], data[1], data[2], data[3]);
        });
    };
    
    var subscribeToPlayerShoots = function () {
        stompClient.subscribe("/client/room" + roomId + "/playerShoots", function (eventbody) {
            var data = JSON.parse(eventbody.body);
            GameModule.playerShoots(data.playerX, data.playerY, data.playerAngle, data.playerId);
        });
    };
    
    var subscribeToUpdatePoints = function () {
        stompClient.subscribe("/client/room" + roomId + "/updatePoints", function (eventbody) {
            var pointsList = JSON.parse(eventbody.body);
            GameModule.updatePoints(pointsList);
        });
    };
    
    var subscribeToPlayerLifes = function () {
        stompClient.subscribe("/client/room" + roomId + "/updateLifes", function (eventbody) {
            var lifesList = JSON.parse(eventbody.body);
            GameModule.updateLifes(lifesList);
        });
    };
    
    var subscribeToEliminateAsteroids = function () {
        stompClient.subscribe("/client/room" + roomId + "/eliminateAsteroid", function (eventbody) {
            var asteroidId = JSON.parse(eventbody.body);
            GameModule.eliminateAsteroid(asteroidId);
        });
    };
    
    var restartGame = function (local) {
        alert("Game Restarted By Admin...");
        location.reload();
        if (local === true) { stompClient.send("/app/room" + roomId + "/restartGame", {}, null); }
    };
    
    var subscribeToGameRestart = function () {
        stompClient.subscribe("/client/room" + roomId + "/gameRestart", function () {
            restartGame(false);
        });
    };
    
    var sendUpdatePlayer = function (playerX, playerY, playerAngle) {
        stompClient.send("/app/room" + roomId + "/updatePlayer", {}, JSON.stringify({playerId:playerId, playerX:playerX, playerY:playerY, playerAngle:playerAngle}));
    };
    
    var getPlayerId = function () {
        return playerId;
    };
    
    var registerPlayer = function (playerX, playerY) {
        playerId = prompt("Please enter your name:", "Player1");
        stompClient.send("/app/room" + roomId + "/registerPlayer", {}, JSON.stringify({playerId:playerId, playerX:playerX, playerY:playerY}));
        subscribeToNewPlayers();
        subscribeToPlayerUpdates();
        
        subscribeToNewAsteroids();
        subscribeToPlayerShoots();
        subscribeToUpdatePoints();
        subscribeToPlayerLifes();
        subscribeToEliminateAsteroids();
        subscribeToGameRestart();

        subscribeToFullCells();
        suscribeToLives();
    };
    
    //Suscribe to newFullCells
    var subscribeToFullCells = function () {
        
        //Topico para nuevas celulas de combustion
        stompClient.subscribe("/client/room" + roomId + "/newFullCell", function (eventbody) {           
            var data = JSON.parse(eventbody.body);
            GameModule.addNewFullCell(data[0], data[1], data[2]);
        });
        
        //Topico para cuando toman una celula
        stompClient.subscribe("/client/room" + roomId + "/takefullCell", function (eventbody) { 
            var data = JSON.parse(eventbody.body);
            GameModule.eliminateFullCell(data.indexCell);
        });
        
        
    };
    
    var takeFullCell = function (index) {
        fullPlayer += 5;
        stompClient.send("/client/room" + roomId + "/takefullCell", {}, JSON.stringify({indexCell: index}));

    };
    
    //Suscribe to newLives
    var suscribeToLives = function () {
        
        //Topico para nuevas vidas
        stompClient.subscribe("/client/room" + roomId + "/newCellLife", function (eventbody) {           
            var data = JSON.parse(eventbody.body);
            GameModule.addNewCellLife(data[0], data[1]);
        });
        
        //Topico para cuando toman una vida
        stompClient.subscribe("/client/room" + roomId + "/takeCellLife", function (eventbody) { 
            var data = JSON.parse(eventbody.body);
            GameModule.eliminateCellLife(data.indexCell);
        });  
    };
    
    var takeCellLife = function (index) {
        playerLives += 1;
        stompClient.send("/client/room" + roomId + "/takeCellLife", {}, JSON.stringify({indexCell: index}));
     
    };
    
    var playerShoots = function (playerX, playerY, playerAngle) {
        stompClient.send("/app/room" + roomId + "/playerShoots", {}, JSON.stringify({playerId:playerId, playerX:playerX, playerY:playerY, playerAngle:playerAngle}));
    };
    
    var informAsteroidDestroyed = function (shooter) {
        if (shooter === playerId) {
            stompClient.send("/app/room" + roomId + "/informAsteroidDestroyed", {}, shooter);
        }
    };
    
    var informAsteroidTouch = function (asteroidId) {
        stompClient.send("/app/room" + roomId + "/informAsteroidTouch", {}, playerId);
        stompClient.send("/app/room" + roomId + "/eliminateAsteroid", {}, asteroidId);
    };
    
    return {
        connect: connect,
        registerPlayer: registerPlayer,
        getPlayerId:getPlayerId,
        updatePlayer: updatePlayer,
        sendUpdatePlayer: sendUpdatePlayer,

        takeFullCell: takeFullCell,
        takeCellLife: takeCellLife,
        
        playerShoots: playerShoots,
        informAsteroidDestroyed: informAsteroidDestroyed,
        informAsteroidTouch: informAsteroidTouch,
        restartGame: restartGame

    };
    
}());
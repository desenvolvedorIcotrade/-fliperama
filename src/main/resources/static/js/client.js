/* global Stomp, GameModule, SockJS */

var ClientModule = (function () {
    
    var stompClient = null;
    var playerId = 100; //esto deberia ser sacado una vez por partida del api rest
    var playerLives = 3;
    var fullPlayer = 150;
    
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
            var pointsList = JSON.parse(eventbody.body);
            GameModule.updatePoints(pointsList);
        });
    };
    
    var subscribeToPlayerLifes = function () {
        stompClient.subscribe("/client/updateLifes", function (eventbody) {
            var lifesList = JSON.parse(eventbody.body);
            GameModule.updateLifes(lifesList);
        });
    };
    
    var subscribeToEliminateAsteroids = function () {
        stompClient.subscribe("/client/eliminateAsteroid", function (eventbody) {
            var asteroidId = JSON.parse(eventbody.body);
            GameModule.eliminateAsteroid(asteroidId);
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
        playerId = prompt("Please enter your name:", "Player1");
        stompClient.send("/app/registerPlayer", {}, JSON.stringify({playerId:playerId, playerX:playerX, playerY:playerY}));
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
        
        subscribeToBarFuel();
    };
    
    //Suscribe to BarFuel
    var subscribeToBarFuel = function () {
        
        //Topico para nuevas barras de combustible
        stompClient.subscribe("/client/newBarFuel", function (eventbody) {           
            GameModule.addNewBarFuel(JSON.parse(eventbody.body));
        });
        
        //Topico para actualizar el combustible de los jugadore
        stompClient.subscribe("/client/updateBarFuels", function (eventbody) { 
            var data = JSON.parse(eventbody.body);
            GameModule.eliminateFullCell(data.indexCell);
        });
                
    };
    
    var updateBarFuels = function (){
        fullPlayer -= 0.5;
        stompClient.send("/client/updateBarFuels", {}, JSON.stringify({indexCell: index}));
    };
    
    //Suscribe to newFullCells
    var subscribeToFullCells = function () {
        
        //Topico para nuevas celulas de combustion
        stompClient.subscribe("/client/newFullCell", function (eventbody) {           
            var data = JSON.parse(eventbody.body);
            GameModule.addNewFullCell(data[0], data[1], data[2]);
        });
        
        //Topico para cuando toman una celula
        stompClient.subscribe("/client/takefullCell", function (eventbody) { 
            var data = JSON.parse(eventbody.body);
            GameModule.eliminateFullCell(data.indexCell);
        });
        
        
    };
    
    var takeFullCell = function (index) {
        fullPlayer += 10;
        stompClient.send("/client/takefullCell", {}, JSON.stringify({indexCell: index}));

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
        stompClient.send("/client/takeCellLife", {}, JSON.stringify({indexCell: index}));
     
    };
    
    var playerShoots = function (playerX, playerY, playerAngle) {
        stompClient.send("/app/playerShoots", {}, JSON.stringify({playerId:playerId, playerX:playerX, playerY:playerY, playerAngle:playerAngle}));
    };
    
    var informAsteroidDestroyed = function (shooter) {
        if (shooter === playerId) {
            stompClient.send("/app/informAsteroidDestroyed", {}, shooter);
        }
    };
    
    var informAsteroidTouch = function (asteroidId) {
        stompClient.send("/app/informAsteroidTouch", {}, playerId);
        stompClient.send("/app/eliminateAsteroid", {}, asteroidId);
    };
    
    var getPlayerFuel = function () {
        return fullPlayer;
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
        restartGame: restartGame,
        
        getPlayerFuel: getPlayerFuel,
        updateBarFuels: updateBarFuels

    };
    
}());
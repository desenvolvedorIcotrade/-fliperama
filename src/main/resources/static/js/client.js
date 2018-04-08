/* global Stomp, GameModule, SockJS */

var ClientModule = (function () {
    
    var stompClient = null;
    var playerId = null;
    
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
            GameModule.addNewAsteroid(data[0], data[1], data[2]);
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
    };
    
    var playerShoots = function (playerX, playerY, playerAngle) {
        stompClient.send("/app/playerShoots", {}, JSON.stringify({playerId:playerId, playerX:playerX, playerY:playerY, playerAngle:playerAngle}));
    };
    
    var informAsteroidDestroyed = function (shooter) {
        if (shooter === playerId) {
            stompClient.send("/app/informAsteroidDestroyed", {}, shooter);
        }
    };
    
    var informAsteroidTouch = function () {
        stompClient.send("/app/informAsteroidTouch", {}, playerId);
    };
    
    return {
        connect: connect,
        registerPlayer: registerPlayer,
        getPlayerId:getPlayerId,
        updatePlayer: updatePlayer,
        sendUpdatePlayer: sendUpdatePlayer,
        playerShoots: playerShoots,
        informAsteroidDestroyed: informAsteroidDestroyed,
        informAsteroidTouch: informAsteroidTouch
    };
    
}());
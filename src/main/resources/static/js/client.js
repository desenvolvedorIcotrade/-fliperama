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
            GameModule.playerShoots(data.playerX, data.playerY, data.playerAngle);
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
    };
    
    var playerShoots = function (playerX, playerY, playerAngle) {
        stompClient.send("/app/playerShoots", {}, JSON.stringify({playerId:playerId, playerX:playerX, playerY:playerY, playerAngle:playerAngle}));
    };
    
    return {
        connect: connect,
        registerPlayer: registerPlayer,
        getPlayerId:getPlayerId,
        updatePlayer: updatePlayer,
        sendUpdatePlayer: sendUpdatePlayer,
        playerShoots: playerShoots
    };
    
}());
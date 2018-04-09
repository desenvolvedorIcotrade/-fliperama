/* global Stomp, GameModule, SockJS */

var ClientModule = (function () {
    
    var stompClient = null;
    var playerId = 100; //esto deberia ser sacado una vez por partida del api rest
    var fullPlayer = null;
    
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
        subscribeToFullCells();
    };
    
    //Suscribe to newFullCells
    var subscribeToFullCells = function () {
        
        //Topico para nuevas celulas de combustion
        stompClient.subscribe("/client/newFullCell", function (eventbody) {
            //GameModule.addNewPlayer(JSON.parse(eventbody.body));
            var data = JSON.parse(eventbody.body);
            GameModule.addNewFullCell(data[0], data[1], data[2]);
        });
        
        //Topico para cuando toman una celula
        stompClient.subscribe("/client/takefullCell", function (eventbody) {
            //GameModule.addNewPlayer(JSON.parse(eventbody.body));
            console.log(eventbody.body);
            var data = JSON.parse(eventbody.body);
            GameModule.eliminateFullCell(data);
        });
        
        
    };
    
    var takeFullCell = function (index) {
        fullPlayer += 5;
        stompClient.send("/app/takeFullCell", {}, JSON.stringify(index));

    };
    return {
        connect: connect,
        registerPlayer: registerPlayer,
        getPlayerId:getPlayerId,
        updatePlayer: updatePlayer,
        sendUpdatePlayer: sendUpdatePlayer,
        takeFullCell: takeFullCell
    };
    
}());
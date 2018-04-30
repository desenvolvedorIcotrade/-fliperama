package co.edu.escuelaing.arsw.coopasteroids;


import co.edu.escuelaing.arsw.coopasteroids.RoomController;
import co.edu.escuelaing.arsw.coopasteroids.model.Player;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.messaging.handler.annotation.DestinationVariable;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author daniel
 */
public class GameController {

    private final StompMessagesHandler messageHandler;
    private ConcurrentHashMap<Integer, RoomController> currentRooms;

    GameController(StompMessagesHandler messageHandler) {
        this.messageHandler = messageHandler;
        this.currentRooms = new ConcurrentHashMap<>();
    }
    
    public void handleRegisterPlayer(Player player, int roomId) {
        if (!currentRooms.containsKey(roomId)) currentRooms.put(roomId, new RoomController(messageHandler, roomId));
        RoomController room = currentRooms.get(roomId);
        System.out.println("[ROOM " + roomId + "] New Player Received = " + player.getPlayerId() + " " + player.getPlayerX() + " " + player.getPlayerY());
        room.setPlayerLifes(player.getPlayerId(), 3);
        room.setPlayerPoints(player.getPlayerId(), 0);
        messageHandler.handleSendNewPlayer(player, roomId);
    }

    public void handleAsteroidDestroyedByPlayer(String playerId, int roomId) {
        RoomController room = currentRooms.get(roomId);
        room.asteroidDestroyedByPlayer(playerId);
        System.out.println("[ROOM " + roomId + "] Player Points: " + room.getPlayerPoints());
        messageHandler.handleSendPointsUpdate(room.getPlayerPoints(), roomId);
    }

    public void handleReduceLifeCount(String playerId, int roomId) {
        RoomController room = currentRooms.get(roomId);
        room.reduceLifeCount(playerId);
        messageHandler.handleSendLifesUpdate(room.getPlayerLifes(), roomId);
    }

    public void handleGameRestart(int roomId) {
        RoomController room = currentRooms.get(roomId);
        room.restart();
    }

    public int getAndIncrementAsteroidIdByRoom(int roomId) {
        RoomController room = currentRooms.get(roomId);
        return room.getAndIncrementAsteroidId();
    }
    
}

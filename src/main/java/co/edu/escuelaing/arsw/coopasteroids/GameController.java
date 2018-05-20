package co.edu.escuelaing.arsw.coopasteroids;

import co.edu.escuelaing.arsw.coopasteroids.model.Player;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Controls the Game as a whole, sends instructions to each room.
 * @author Daniel Ospina
 */
public class GameController {

    private final StompMessagesHandler messageHandler;
    private ConcurrentHashMap<Integer, RoomController> currentRooms;

    GameController(StompMessagesHandler messageHandler) {
        this.messageHandler = messageHandler;
        this.currentRooms = new ConcurrentHashMap<>();
    }
    
    /**
     * Adds a player to a specific Room
     * @param player player to be added
     * @param roomId room where the player is
     */
    public void handleRegisterPlayer(Player player, int roomId) {
        if (!currentRooms.containsKey(roomId)) currentRooms.put(roomId, new RoomController(messageHandler, roomId));
        System.out.println("[ROOM " + roomId + "] New Player Received = " + player.getPlayerId() + " " + player.getPlayerX() + " " + player.getPlayerY());
        messageHandler.handleSendNewPlayer(player, roomId);
    }
    
    /**
     * Restarts the game for a specific Room
     * @param roomId room to restart
     */
    public void handleGameRestart(int roomId) {
        RoomController room = currentRooms.get(roomId);
        room.restart();
    }
    
    /**
     * Returns a unique id for a new asteroid given roomId
     * @param roomId room where asteroidId belongs
     * @return id for the asteroid
     */
    public int getAndIncrementAsteroidIdByRoom(int roomId) {
        RoomController room = currentRooms.get(roomId);
        return room.getAndIncrementAsteroidId();
    }

}

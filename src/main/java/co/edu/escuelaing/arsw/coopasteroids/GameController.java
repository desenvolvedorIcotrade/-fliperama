package co.edu.escuelaing.arsw.coopasteroids;

import co.edu.escuelaing.arsw.coopasteroids.model.Player;
import java.util.concurrent.ConcurrentHashMap;

/**
 *
 * @author Daniel Ospina
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
        messageHandler.handleSendNewPlayer(player, roomId);
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

package co.edu.escuelaing.arsw.coopasteroids;

import co.edu.escuelaing.arsw.coopasteroids.model.FullCell;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import co.edu.escuelaing.arsw.coopasteroids.model.Player;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.messaging.handler.annotation.DestinationVariable;

/**
 *
 * @author Daniel Ospina - Juan Ortiz
 */
@Controller
public class StompMessagesHandler {
    
    private GameController game = null;
    
    @Autowired
    public SimpMessagingTemplate msgt;
    
    @MessageMapping("/room{roomId}/registerPlayer")
    public void handleRegisterPlayer(Player player, @DestinationVariable int roomId) {
        if (game == null) game = new GameController(this);
        game.handleRegisterPlayer(player, roomId);
    }
    
    @MessageMapping("/room{roomId}/updatePlayer")
    public void handleUpdatePlayer(Player player, @DestinationVariable int roomId) {
        msgt.convertAndSend("/client/room" + roomId + "/playerUpdate", player);
    }
    

    public void handleAddFullCell(int[] data, int roomId) {
        System.out.println("[ROOM " + roomId + "] New FullCell sent: " + data[0] + " " + data[1] + " " + data[2]);
        msgt.convertAndSend("/client/room" + roomId + "/newFullCell", data);
    }
    
    public void handleAddLifeCell(int[] data, int roomId) {
        System.out.println("[ROOM " + roomId + "] New LifeCell sent: " + data[0] + " " + data[1]);
        msgt.convertAndSend("/client/room" + roomId + "/newCellLife", data);
    }

    //TODO REVISAR
    public void handleAddNewAsteroid(int[] data, int roomId) {
        data[3] = game.getAndIncrementAsteroidIdByRoom(roomId);
        System.out.println("[ROOM " + roomId + "] New Asteroid sent: " + data[0] + " " + data[1] + " " + data[2] + " " + data[3]);
        msgt.convertAndSend("/client/room" + roomId + "/newAsteroid", data);
    }
    
    @MessageMapping("/room{roomId}/playerShoots")
    public void handlePlayerShoots(Player player, @DestinationVariable int roomId) {
        msgt.convertAndSend("/client/room" + roomId + "/playerShoots", player);
    }
    
    @MessageMapping("/room{roomId}/informAsteroidDestroyed")
    public void handleInformAsteroidDestroyed(String playerId, @DestinationVariable int roomId) {
        game.handleAsteroidDestroyedByPlayer(playerId, roomId);
    }
    
    @MessageMapping("/room{roomId}/informAsteroidTouch")
    public void handleInformAsteroidTouch(String playerId, @DestinationVariable int roomId) {
        game.handleReduceLifeCount(playerId, roomId);
    }
    
    @MessageMapping("/room{roomId}/eliminateAsteroid")
    public void handleEliminateAsteroid(String asteroidId, @DestinationVariable int roomId) {
        msgt.convertAndSend("/client/room" + roomId + "/eliminateAsteroid", asteroidId);
    }
    
    @MessageMapping("/room{roomId}/restartGame")
    public void handleGameRestart(@DestinationVariable int roomId) {
        System.out.println("[ROOM " + roomId + "] Restarting game...");
        game.handleGameRestart(roomId);
        msgt.convertAndSend("/client/room" + roomId + "/gameRestart", "");
    }

    public void handleSendNewPlayer(Player player, int roomId) {
        msgt.convertAndSend("/client/room" + roomId + "/newPlayer", player);
    }

    void handleSendPointsUpdate(ConcurrentHashMap playerPoints, int roomId) {
        msgt.convertAndSend("/client/room" + roomId + "/updatePoints", playerPoints);
    }

    void handleSendLifesUpdate(ConcurrentHashMap playerLifes, int roomId) {
        msgt.convertAndSend("/client/room" + roomId + "/updateLifes", playerLifes);
    }

}

package co.edu.escuelaing.arsw.coopasteroids;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import co.edu.escuelaing.arsw.coopasteroids.model.Player;
import org.springframework.messaging.handler.annotation.DestinationVariable;

/**
 * Stomp Message Handler, organizes the communication between backend and front end
 * @author Daniel Ospina - Juan Ortiz
 */
@Controller
public class StompMessagesHandler {
    
    private GameController game = null;
    
    @Autowired
    public SimpMessagingTemplate msgt;
    
    @MessageMapping("/room{roomId}_registerPlayer")
    public void handleRegisterPlayer(Player player, @DestinationVariable int roomId) {
        if (game == null) game = new GameController(this);
        game.handleRegisterPlayer(player, roomId);
    }    

    public void handleAddFuelCell(int[] data, int roomId) {
        System.out.println("[ROOM " + roomId + "] New FuelCell sent: " + data[0] + " " + data[1] + " " + data[2]);
        msgt.convertAndSend("/topic/room" + roomId + "_newFuelCell", data);
    }
    
    public void handleAddLifeCell(int[] data, int roomId) {
        System.out.println("[ROOM " + roomId + "] New LifeCell sent: " + data[0] + " " + data[1]);
        msgt.convertAndSend("/topic/room" + roomId + "_newCellLife", data);
    }

    public void handleAddNewAsteroid(int[] data, int roomId) {
        data[3] = game.getAndIncrementAsteroidIdByRoom(roomId);
        msgt.convertAndSend("/topic/room" + roomId + "_newAsteroid", data);
    }
    
    @MessageMapping("/room{roomId}_restartGame")
    public void handleGameRestart(@DestinationVariable int roomId) {
        System.out.println("[ROOM " + roomId + "] Restarting game...");
        game.handleGameRestart(roomId);
        msgt.convertAndSend("/topic/room" + roomId + "_gameRestart", "");
    }

    public void handleSendNewPlayer(Player player, int roomId) {
        msgt.convertAndSend("/topic/room" + roomId + "_newPlayer", player);
    }

}

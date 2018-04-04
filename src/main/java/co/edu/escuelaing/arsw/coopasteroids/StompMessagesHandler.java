package co.edu.escuelaing.arsw.coopasteroids;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import co.edu.escuelaing.arsw.coopasteroids.model.Player;

/**
 *
 * @author Daniel Ospina
 */
@Controller
public class StompMessagesHandler {
    
    private GameController game = null;
    
    @Autowired
    public SimpMessagingTemplate msgt;
    
    @MessageMapping("/registerPlayer")
    public void handleRegisterPlayer(Player player) {
        if (game == null) game = new GameController(this);
        System.out.println("New Player Received = " + player.getPlayerId() + " " + player.getPlayerX() + " " + player.getPlayerY());
        msgt.convertAndSend("/client/newPlayer", player);
    }
    
    @MessageMapping("/updatePlayer")
    public void handleUpdatePlayer(Player player) {
        msgt.convertAndSend("/client/playerUpdate", player);
    }
    
    public void handleAddNewAsteroid(int[] data) {
        System.out.println("New Asteroid sent: " + data[0] + " " + data[1] + " " + data[2]);
        msgt.convertAndSend("/client/newAsteroid", data);
    }
    
    @MessageMapping("/playerShoots")
    public void handlePlayerShoots(Player player) {
        msgt.convertAndSend("/client/playerShoots", player);
    }
}

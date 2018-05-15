package co.edu.escuelaing.arsw.coopasteroids;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import co.edu.escuelaing.arsw.coopasteroids.model.Player;

/**
 *
 * @author Daniel Ospina - Juan Ortiz
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
        //Aqui se debe  ver si la sala que manda existe o no y hacer lo que le corresponde
        msgt.convertAndSend("/client/newPlayer", player);
    }
    
    @MessageMapping("/updatePlayer")
    public void handleUpdatePlayer(Player player) {
        msgt.convertAndSend("/client/playerUpdate", player);
    }
    

    public void handleAddFullCell(int[] data) {
        System.out.println("New FullCell sent: " + data[0] + " " + data[1] + " " + data[2]);
        msgt.convertAndSend("/client/newFullCell", data);
    }
    
    public void handleAddLifeCell(int[] data) {
        System.out.println("New LifeCell sent: " + data[0] + " " + data[1]);
        msgt.convertAndSend("/client/newCellLife", data);
    }

    
    public void handleAddNewAsteroid(int[] data) {
        data[3] = game.getAndIncrementAsteroidId();
        System.out.println("New Asteroid sent: " + data[0] + " " + data[1] + " " + data[2] + " " + data[3]);
        msgt.convertAndSend("/client/newAsteroid", data);
    }
    
    @MessageMapping("/restartGame")
    public void handleGameRestart() {
        System.out.println("Restarting game...");
        game.restart();
        msgt.convertAndSend("/client/gameRestart", "");
    }

}

package co.edu.escuelaing.arsw.coopasteroids;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import co.edu.escuelaing.arsw.coopasteroids.model.Player;
import java.util.List;

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
        game.setPlayerLifes(player.getPlayerId(), 3);
        game.setPlayerPoints(player.getPlayerId(), 0);
        msgt.convertAndSend("/client/newPlayer", player);
    }
    
    @MessageMapping("/updatePlayer")
    public void handleUpdatePlayer(Player player) {
        msgt.convertAndSend("/client/playerUpdate", player);
    }
    
    public void handleAddNewAsteroid(int[] data) {
        data[3] = game.getAndIncrementAsteroidId();
        System.out.println("New Asteroid sent: " + data[0] + " " + data[1] + " " + data[2] + " " + data[3]);
        msgt.convertAndSend("/client/newAsteroid", data);
    }
    
    @MessageMapping("/playerShoots")
    public void handlePlayerShoots(Player player) {
        msgt.convertAndSend("/client/playerShoots", player);
    }
    
    @MessageMapping("/informAsteroidDestroyed")
    public void handleInformAsteroidDestroyed(String playerId) {
        System.out.println("[" + playerId + "] destroyed an asteroid.");
        game.asteroidDestroyedByPlayer(playerId);
        System.out.println("Player Points: " + game.getPlayerPoints());
        msgt.convertAndSend("/client/updatePoints", game.getPlayerPoints());
    }
    
    @MessageMapping("/informAsteroidTouch")
    public void handleInformAsteroidTouch(String playerId) {
        game.reduceLifeCount(playerId);
        msgt.convertAndSend("/client/updateLifes", game.getPlayerLifes());
    }
    
    @MessageMapping("/eliminateAsteroid")
    public void handleEliminateAsteroid(String asteroidId) {
        msgt.convertAndSend("/client/eliminateAsteroid", asteroidId);
    }
}

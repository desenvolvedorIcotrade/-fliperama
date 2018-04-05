package co.edu.escuelaing.arsw.coopasteroids;

import co.edu.escuelaing.arsw.coopasteroids.model.runnables.AsteroidRunnable;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 *
 * @author Daniel Ospina
 */
public class GameController {
    
    private final Integer POINTS_FOR_ASTEROID = 100;
    
    private final StompMessagesHandler s;
    private ConcurrentHashMap<String, Integer> playerPoints;
    
    public GameController(StompMessagesHandler s) {
        System.out.println("New Game Instance created");
        playerPoints = new ConcurrentHashMap<>();
        this.s = s;
        spawnAsteroids();
    }

    private void spawnAsteroids() {
        ScheduledExecutorService ex = Executors.newSingleThreadScheduledExecutor();
        Runnable r = new AsteroidRunnable(s);
        ex.scheduleAtFixedRate(r, 0, 2500, TimeUnit.MILLISECONDS);
    }

    public void asteroidDestroyedByPlayer(String playerId) {
        Integer current = playerPoints.getOrDefault(playerId, 0);
        playerPoints.put(playerId, current + POINTS_FOR_ASTEROID);
    }
    
    public ConcurrentHashMap getPlayerPoints() {
        return playerPoints;
    }
}

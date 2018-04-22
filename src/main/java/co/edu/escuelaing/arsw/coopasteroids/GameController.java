package co.edu.escuelaing.arsw.coopasteroids;

import co.edu.escuelaing.arsw.coopasteroids.model.runnables.AsteroidRunnable;
import co.edu.escuelaing.arsw.coopasteroids.model.runnables.FullCellRunnable;
import co.edu.escuelaing.arsw.coopasteroids.model.runnables.LifeCellRunnable;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 *
 * @author Daniel Ospina - Juan Ortiz
 */
public class GameController {
    
    private final Integer POINTS_FOR_ASTEROID = 100;
    
    private final StompMessagesHandler s;
    private ConcurrentHashMap<String, Integer> playerPoints;
    private ConcurrentHashMap<String, Integer> playerLifes;
    private ConcurrentHashMap<String, Integer> playerFuels;
    private int asteroidId;
    
    public GameController(StompMessagesHandler s) {
        this.asteroidId = 0;
        System.out.println("New Game Instance created");
        playerPoints = new ConcurrentHashMap<>();
        playerLifes = new ConcurrentHashMap<>();
        playerFuels = new ConcurrentHashMap<>();
        this.s = s;
        spawnAsteroids();
        spawnFullCells();
        spawnLifeCells();
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

    public void reduceLifeCount(String playerId) {
        Integer current = playerLifes.getOrDefault(playerId, 3);
        playerLifes.put(playerId, current - 1);
    }
    
    public ConcurrentHashMap getPlayerLifes() {
        return playerLifes;
    }

    public void setPlayerLifes(String playerId, int i) {
        playerLifes.putIfAbsent(playerId, i);
    }

    public void setPlayerPoints(String playerId, int i) {
        playerPoints.putIfAbsent(playerId, i);
    }

    public int getAndIncrementAsteroidId() {
        return asteroidId++;
    }

    public void restart() {
        this.asteroidId = 0;
        playerPoints = new ConcurrentHashMap<>();
        playerLifes = new ConcurrentHashMap<>();
                
    }
    
    private void spawnFullCells() {
        ScheduledExecutorService ex = Executors.newSingleThreadScheduledExecutor();
        Runnable r = new FullCellRunnable(s,this);
        ex.scheduleAtFixedRate(r, 45000, 45000, TimeUnit.MILLISECONDS);
    }
    
    private void spawnLifeCells() {
        ScheduledExecutorService ex = Executors.newSingleThreadScheduledExecutor();
        Runnable r = new LifeCellRunnable(s,this);
        ex.scheduleAtFixedRate(r, 60000, 60000, TimeUnit.MILLISECONDS);
    }

    public ConcurrentHashMap<String, Integer> getPlayerFuels() {
        return playerFuels;
    }

    public void setPlayerFuels(String playerId, int i) {
        playerFuels.putIfAbsent(playerId, i);
    }
    
}

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
public class GameController { //esto es una sola partida
    
    private final Integer POINTS_FOR_ASTEROID = 100;
    
    private final StompMessagesHandler s;

    private int asteroidId;
   
    public GameController(StompMessagesHandler s) {
        this.asteroidId = 0;
        System.out.println("New Game Instance created");

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

    public int getAndIncrementAsteroidId() {
        return asteroidId++;
    }

    public void restart() {
        this.asteroidId = 0;

                
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

}

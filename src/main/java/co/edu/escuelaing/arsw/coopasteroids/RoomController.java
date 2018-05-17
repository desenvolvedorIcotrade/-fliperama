package co.edu.escuelaing.arsw.coopasteroids;

import co.edu.escuelaing.arsw.coopasteroids.model.runnables.AsteroidRunnable;
import co.edu.escuelaing.arsw.coopasteroids.model.runnables.FuelCellRunnable;
import co.edu.escuelaing.arsw.coopasteroids.model.runnables.LifeCellRunnable;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 *
 * @author Daniel Ospina - Juan Ortiz
 */
public class RoomController {
    
    private final StompMessagesHandler s;
    private int asteroidId;
    private final int roomId;
    
    public RoomController(StompMessagesHandler s, int roomId) {
        this.asteroidId = 0;
        this.roomId = roomId;
        System.out.println("New Game Instance created");
        this.s = s;
        spawnAsteroids();
        spawnFuelCells();
        spawnLifeCells();
    }

    private void spawnAsteroids() {
        ScheduledExecutorService ex = Executors.newSingleThreadScheduledExecutor();
        Runnable r = new AsteroidRunnable(s, roomId);
        ex.scheduleAtFixedRate(r, 100, 2500, TimeUnit.MILLISECONDS);
    }

    public int getAndIncrementAsteroidId() {
        return asteroidId++;
    }

    public void restart() {
        this.asteroidId = 0;      
    }
    
    private void spawnFuelCells() {
        ScheduledExecutorService ex = Executors.newSingleThreadScheduledExecutor();
        Runnable r = new FuelCellRunnable(s, roomId);
        ex.scheduleAtFixedRate(r, 45000, 45000, TimeUnit.MILLISECONDS);
    }
    
    private void spawnLifeCells() {
        ScheduledExecutorService ex = Executors.newSingleThreadScheduledExecutor();
        Runnable r = new LifeCellRunnable(s, roomId);
        ex.scheduleAtFixedRate(r, 60000, 60000, TimeUnit.MILLISECONDS);
    }
    
}

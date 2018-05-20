package co.edu.escuelaing.arsw.coopasteroids;

import co.edu.escuelaing.arsw.coopasteroids.model.runnables.AsteroidRunnable;
import co.edu.escuelaing.arsw.coopasteroids.model.runnables.FuelCellRunnable;
import co.edu.escuelaing.arsw.coopasteroids.model.runnables.LifeCellRunnable;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Controls a unique Room
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
    
    /**
     * Spawns asteroids at a fixed Rate in the room
     */
    private void spawnAsteroids() {
        ScheduledExecutorService ex = Executors.newSingleThreadScheduledExecutor();
        Runnable r = new AsteroidRunnable(s, roomId);
        ex.scheduleAtFixedRate(r, 100, 1000, TimeUnit.MILLISECONDS);
    }
    
    /**
     * Returns the next Id for the asteroid in the room
     * @return id of the asteroid
     */
    public int getAndIncrementAsteroidId() {
        return asteroidId++;
    }
    
    /**
     * Restarts the Room Game
     */
    public void restart() {
        this.asteroidId = 0;      
    }
    
    /**
     * Spawns Fuel Cells at a fixed Rate in the room
     */
    private void spawnFuelCells() {
        ScheduledExecutorService ex = Executors.newSingleThreadScheduledExecutor();
        Runnable r = new FuelCellRunnable(s, roomId);
        ex.scheduleAtFixedRate(r, 25000, 20000, TimeUnit.MILLISECONDS);
    }
    
    /**
     * Spawns Life Cells at a fixed Rate in the room
     */
    private void spawnLifeCells() {
        ScheduledExecutorService ex = Executors.newSingleThreadScheduledExecutor();
        Runnable r = new LifeCellRunnable(s, roomId);
        ex.scheduleAtFixedRate(r, 35000, 45000, TimeUnit.MILLISECONDS);
    }
    
}

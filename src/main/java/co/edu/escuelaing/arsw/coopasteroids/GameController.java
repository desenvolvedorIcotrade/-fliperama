package co.edu.escuelaing.arsw.coopasteroids;

import co.edu.escuelaing.arsw.coopasteroids.model.runnables.AsteroidRunnable;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 *
 * @author Daniel Ospina
 */
public class GameController {

    private final StompMessagesHandler s;
    
    public GameController(StompMessagesHandler s) {
        System.out.println("New Game Instance created");
        this.s = s;
        spawnAsteroids();
    }

    private void spawnAsteroids() {
        ScheduledExecutorService ex = Executors.newSingleThreadScheduledExecutor();
        Runnable r = new AsteroidRunnable(s);
        ex.scheduleAtFixedRate(r, 0, 2500, TimeUnit.MILLISECONDS);
    }
}

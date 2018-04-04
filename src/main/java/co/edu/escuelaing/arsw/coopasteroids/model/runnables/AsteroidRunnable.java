package co.edu.escuelaing.arsw.coopasteroids.model.runnables;

import co.edu.escuelaing.arsw.coopasteroids.StompMessagesHandler;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author daniel
 */
public class AsteroidRunnable implements Runnable {

    private final StompMessagesHandler s;

    public AsteroidRunnable(StompMessagesHandler s) {
        this.s = s;
    }
    
    @Override
    public void run() {
        try { 
            int[] data = asteroidSpawnPosition();
            s.handleAddNewAsteroid(data);
        } catch (Exception ex) {
            Logger.getLogger(AsteroidRunnable.class.getName()).log(Level.SEVERE, "Error en AsteroidRunnable", ex);
        }
        
    }
    
    private int[] asteroidSpawnPosition() {
        int ranX = (int) (Math.random() * 800);
        int ranY = (int) (Math.random() * 600);
        int[] spawnPos = _generateSpawnPosAsteroids(ranX, ranY);
        int posX = spawnPos[0];
        int posY = spawnPos[1];
        
        ranX = (int) (Math.random() * 800);
        ranY = (int) (Math.random() * 600);
        int asteroidAngle = (int) ((Math.atan2(ranY - posY, ranX - posX) * 180) / Math.PI);
        return new int[] {posX, posY, asteroidAngle};
    }

    private int[] _generateSpawnPosAsteroids(int posX, int posY) {
        int genX = 0;
        int genY = 0;
        if (posX <= 400 & posY <= 300) {
            if (Math.random() >= 0.5) { genX = -30; genY = posY; } else { genX = posX; genY = -30; }
        }
        else if (posX >= 400 & posY <= 300) {
            if (Math.random() >= 0.5) { genX = 830; genY = posY; } else { genX = posX; genY = -30; }
        }
        else if (posX <= 400 & posY >= 300) {
            if (Math.random() >= 0.5) { genX = -30; genY = posY; } else { genX = posX; genY = 630; }
        }
        if (posX >= 400 & posY >= 300) {
            if (Math.random() >= 0.5) { genX = 830; genY = posY; } else { genX = posX; genY = 630; }
        }
        return new int[] {genX, genY};
    }
    
}

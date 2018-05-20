package co.edu.escuelaing.arsw.coopasteroids.model.runnables;

import co.edu.escuelaing.arsw.coopasteroids.StompMessagesHandler;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Selects the position, direction and sends a new Asteroid to the room
 * @author Daniel Ospina
 */
public class AsteroidRunnable implements Runnable {

    private final StompMessagesHandler s;
    private final int roomId;
   
    public AsteroidRunnable(StompMessagesHandler s, int roomId) {
        this.s = s;
        this.roomId = roomId;
    }
    
    @Override
    public void run() {
        try { 
            int[] data = asteroidSpawnPosition();
            s.handleAddNewAsteroid(data, roomId);
        } catch (Exception ex) {
            Logger.getLogger(AsteroidRunnable.class.getName()).log(Level.SEVERE, "Error en AsteroidRunnable", ex);
        }
        
    }
    
    /**
     * Selects a spawn position at the borders of the screen and a random angle pointing to the playable field
     * @return an array with spawn data: {positionX, positionY, angle, *placeholder for additional data*}
     */
    private int[] asteroidSpawnPosition() {
        int ranX = (int) (Math.random() * 800);
        int ranY = (int) (Math.random() * 600);
        int[] spawnPos = generateSpawnPosAsteroids(ranX, ranY);
        int posX = spawnPos[0];
        int posY = spawnPos[1];
        
        ranX = (int) (Math.random() * 800);
        ranY = (int) (Math.random() * 600);
        int asteroidAngle = (int) ((Math.atan2(ranY - posY, ranX - posX) * 180) / Math.PI);
        return new int[] {posX, posY, asteroidAngle, 0};
    }

    private int[] generateSpawnPosAsteroids(int posX, int posY) {
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

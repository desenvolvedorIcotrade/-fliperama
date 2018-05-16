package co.edu.escuelaing.arsw.coopasteroids.model.runnables;

import co.edu.escuelaing.arsw.coopasteroids.GameController;
import co.edu.escuelaing.arsw.coopasteroids.StompMessagesHandler;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author juan
 */
public class FuelCellRunnable implements Runnable {

    private final StompMessagesHandler s;

    private final GameController gc;

    public FuelCellRunnable(StompMessagesHandler s, GameController gc) {
        this.s = s;
        this.gc = gc;
    }

    @Override
    public void run() {
        try {        
            int[] data = asteroidSpawnPosition();
            s.handleAddFullCell(data);

        } catch (Exception ex) {
            Logger.getLogger(FuelCellRunnable.class.getName()).log(Level.SEVERE, "Error en FuelCellRunnable", ex);
        }

    }

    private int[] asteroidSpawnPosition() {
        int posX = (int) (Math.random() * 800);
        int posY = (int) (Math.random() * 600);

        //Direction
        int asteroidAngle = (int) ((Math.atan2(posY, posX) * 180) / Math.PI);

        return new int[]{posX, posY, asteroidAngle};
    }

}

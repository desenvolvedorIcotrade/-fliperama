package co.edu.escuelaing.arsw.coopasteroids.model.runnables;

import co.edu.escuelaing.arsw.coopasteroids.GameController;
import co.edu.escuelaing.arsw.coopasteroids.StompMessagesHandler;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author juan
 */
public class LifeCellRunnable implements Runnable {

    private final StompMessagesHandler s;

    private final GameController gc;

    public LifeCellRunnable(StompMessagesHandler s, GameController gc) {
        this.s = s;
        this.gc = gc;
    }

    @Override
    public void run() {
        try {
            int[] data = lifeSpawnPosition();
            s.handleAddLifeCell(data);

        } catch (Exception ex) {
            Logger.getLogger(LifeCellRunnable.class.getName()).log(Level.SEVERE, "Error en LifeCellRunnable", ex);
        }
    }

    private int[] lifeSpawnPosition() {
        int posX = (int) (Math.random() * 800);
        int posY = (int) (Math.random() * 600);

        return new int[]{posX, posY};
    }

}

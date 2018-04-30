package co.edu.escuelaing.arsw.coopasteroids.model.runnables;

import co.edu.escuelaing.arsw.coopasteroids.StompMessagesHandler;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author juan
 */
public class LifeCellRunnable implements Runnable {

    private final StompMessagesHandler s;
    private final int roomId;

    public LifeCellRunnable(StompMessagesHandler s, int roomId) {
        this.s = s;
        this.roomId = roomId;
    }

    @Override
    public void run() {
        try {
            int[] data = lifeSpawnPosition();
            s.handleAddLifeCell(data, roomId);

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

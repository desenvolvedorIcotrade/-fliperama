package co.edu.escuelaing.arsw.coopasteroids.model.runnables;

import co.edu.escuelaing.arsw.coopasteroids.StompMessagesHandler;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author juan
 */
public class FuelCellRunnable implements Runnable {

    private final StompMessagesHandler s;
    private final int roomId;

    public FuelCellRunnable(StompMessagesHandler s, int roomId) {
        this.s = s;
        this.roomId = roomId;
    }

    @Override
    public void run() {
        try {        
            int[] data = fuelCellSpawnPosition();
            s.handleAddFuelCell(data, roomId);

        } catch (Exception ex) {
            Logger.getLogger(FuelCellRunnable.class.getName()).log(Level.SEVERE, "Error en FuelCellRunnable", ex);
        }

    }

    private int[] fuelCellSpawnPosition() {
        int posX = (int) (Math.random() * 800);
        int posY = (int) (Math.random() * 600);
        int ranX = (int) (Math.random() * 800);
        int ranY = (int) (Math.random() * 600);
        int cellAngle = (int) ((Math.atan2(ranY - posY, ranX - posX) * 180) / Math.PI);
        return new int[] {posX, posY, cellAngle};
    }

}
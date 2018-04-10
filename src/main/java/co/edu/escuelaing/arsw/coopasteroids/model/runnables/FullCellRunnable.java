/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.edu.escuelaing.arsw.coopasteroids.model.runnables;

import co.edu.escuelaing.arsw.coopasteroids.GameController;
import co.edu.escuelaing.arsw.coopasteroids.StompMessagesHandler;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author juan
 */
public class FullCellRunnable implements Runnable {

    private final StompMessagesHandler s;

    private final GameController gc;

    public FullCellRunnable(StompMessagesHandler s, GameController gc) {
        this.s = s;
        this.gc = gc;
    }

    @Override
    public void run() {
        try {        
            int[] data = asteroidSpawnPosition();
            s.handleAddFullCell(data);

        } catch (Exception ex) {
            Logger.getLogger(FullCellRunnable.class.getName()).log(Level.SEVERE, "Error en FullCellRunnable", ex);
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

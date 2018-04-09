/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.edu.escuelaing.arsw.coopasteroids;

import co.edu.escuelaing.arsw.coopasteroids.model.runnables.FullCellRunnable;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

/**
 *
 * @author juan y Daniel Ospina
 */
public class GameController {
    
    private final StompMessagesHandler s;
    
    public AtomicInteger fullCellInGame = new AtomicInteger(0);
    
    public GameController(StompMessagesHandler s) {
        System.out.println("New Game Instance created");
        this.s = s;
        spawnFullCells();
        
    }

    private void spawnFullCells() {
        ScheduledExecutorService ex = Executors.newSingleThreadScheduledExecutor();
        Runnable r = new FullCellRunnable(s,this);
        ex.scheduleAtFixedRate(r, 45000, 45000, TimeUnit.MILLISECONDS);
    }
    
    public void takeFullCell(){
        fullCellInGame.decrementAndGet();
    }

    
}

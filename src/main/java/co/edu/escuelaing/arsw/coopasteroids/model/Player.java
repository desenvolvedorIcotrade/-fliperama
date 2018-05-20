package co.edu.escuelaing.arsw.coopasteroids.model;

/**
 * A representation of a player in the Game
 * @author Daniel Ospina y Juan Ortiz
 */
public class Player {
    private double playerX;
    private double playerY;
    private String playerId;
    private int playerAngle;
    
    private int  numID;

    public int getNumID() {
        return numID;
    }

    public void setNumID(int numID) {
        this.numID = numID;
    }

    public double getPlayerX() {
        return playerX;
    }

    public void setPlayerX(double playerX) {
        this.playerX = playerX;
    }

    public double getPlayerY() {
        return playerY;
    }

    public void setPlayerY(double playerY) {
        this.playerY = playerY;
    }

    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }

    public int getPlayerAngle() {
        return playerAngle;
    }

    public void setPlayerAngle(int playerAngle) {
        this.playerAngle = playerAngle;
    }
}

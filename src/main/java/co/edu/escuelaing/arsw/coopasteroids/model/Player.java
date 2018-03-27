package co.edu.escuelaing.arsw.coopasteroids.model;

/**
 * //TODO
 * @author Daniel Ospina
 */
public class Player {
    private double playerX;
    private double playerY;
    private String playerId;
    private int playerAngle;

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

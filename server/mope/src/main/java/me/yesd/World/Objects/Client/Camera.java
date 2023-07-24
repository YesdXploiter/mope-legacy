package me.yesd.World.Objects.Client;

import me.yesd.Constants;
import me.yesd.Utilities.Utilities;

public class Camera {
    public int x;
    public int y;
    public int zoom = 1000;
    private int dx;
    private int dy;

    public Camera(int x, int y) {
        this.x = x;
        this.y = y;
        this.dx = Utilities.randomBoolean() ? 5 : -5;
        this.dy = Utilities.randomBoolean() ? 5 : -5;
    }

    public void setX(int x) {
        if (Utilities.isValidDouble(x)) {
            if (x - 5 - 1 < 1) {
                this.x = 1 + 5;
                dx *= -1; // Force direction change
            } else if (x + 5 + 1 > Constants.WIDTH) {
                this.x = Constants.WIDTH - 5 - 1;
                dx *= -1; // Force direction change
            } else {
                this.x = x;
            }
        }
    }

    public void setY(int y) {
        if (Utilities.isValidDouble(y)) {
            if (y - 5 - 1 < 1) {
                this.y = 1 + 5;
                dy *= -1; // Force direction change
            } else if (y + 5 + 1 > Constants.HEIGHT) {
                this.y = Constants.HEIGHT - 5 - 1;
                dy *= -1; // Force direction change
            } else {
                this.y = y;
            }
        }
    }

    public void addX(int x) {
        setX(this.x + x);
    }

    public void addY(int y) {
        setY(this.y + y);
    }

    public void setZoom(int zoom) {
        this.zoom = zoom;
    }

    public void updateBounce() {
        addX(dx);
        addY(dy);
        if ((x <= 0 && dx < 0) || (x >= Constants.WIDTH - 10 && dx > 0)) {
            dx *= -1;
        }
        if ((y <= 0 && dy < 0) || (y >= Constants.HEIGHT - 10 && dy > 0)) {
            dy *= -1;
        }
    }
}
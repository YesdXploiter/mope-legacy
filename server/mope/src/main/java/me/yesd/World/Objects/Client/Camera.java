package me.yesd.World.Objects.Client;

public class Camera {
    public int x;
    public int y;
    public int zoom = 1000;

    public Camera(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public void setX(int x) {
        this.x = x;
    }

    public void setY(int y) {
        this.y = y;
    }

    public void addX(int x) {
        this.x += x;
    }

    public void addY(int y) {
        this.y += y;
    }

    public void setZoom(int zoom) {
        this.zoom = zoom;
    }
}

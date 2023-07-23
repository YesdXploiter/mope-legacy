package me.yesd.World.Objects;

public class Rectangle extends GameObject {

    private double width;
    private double height;

    public Rectangle(int id, double x, double y, double width, double height, int type) {
        super(id, x, y, 0, type);

        this.width = width;
        this.height = height;

        this.isCircle = false;
        this.isRectangle = true;
    }

    public double getWidth() {
        return width;
    }

    public double getHeight() {
        return height;
    }
}

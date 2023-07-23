package me.yesd.Utilities;

import me.yesd.World.Objects.GameObject;
import me.yesd.World.Objects.Rectangle;

public class RectangleUtils {
    private double x;
    private double y;
    private double width;
    private double height;
    private double bottom;
    private double left;
    private double right;
    private double top;

    public RectangleUtils(double x, double y, double width, double height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.top = this.y - this.height / 2;
        this.bottom = this.y + this.height / 2;
        this.left = this.x - this.width / 2;
        this.right = this.y + this.width / 2;
    }

    public boolean intersectsPoint(GameObject point) {
        return this.top <= point.getY() && point.getY() <= this.bottom &&
                this.left <= point.getX() && point.getX() <= this.right;
    }

    public boolean intersectsCircle(GameObject circle) {
        double radius = circle.getRadius();

        double distX = Math.abs(circle.getX() - this.x);
        double distY = Math.abs(circle.getY() - this.y);

        if (distX > (this.width / 2 + radius))
            return false;
        if (distY > (this.height / 2 + radius))
            return false;

        if (distX <= (this.width / 2))
            return true;
        if (distY <= (this.height / 2))
            return true;

        double hypot = (distX - this.width / 2) * (distX - this.width / 2)
                + (distY - this.height / 2) * (distY - this.height / 2);
        return hypot <= (radius * radius);
    }

    public boolean intersectsRectangle(Rectangle rectangle) {
        double xa = this.left,
                ya = this.top,
                wa = this.width,
                ha = this.height,
                xb = rectangle.getX() - rectangle.getWidth(),
                yb = rectangle.getY() - rectangle.getHeight(),
                wb = rectangle.getWidth() * 1.5,
                hb = rectangle.getHeight() * 1.5;

        return xa <= xb + wb &&
                xa + wa >= xb &&
                ya <= yb + hb &&
                ya + ha >= yb;

    }
}

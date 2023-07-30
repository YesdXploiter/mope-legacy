package me.yesd.World.Collision.QuadTree;

import me.yesd.World.Objects.GameObject;

public class Rectangle {
    private int x, y, width, height;

    public Rectangle(int x, int y, int width, int height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public int getX() {
        return x;
    }

    public int getY() {
        return y;
    }

    public int getWidth() {
        return width;
    }

    public int getHeight() {
        return height;
    }

    public boolean contains(GameObject circle) {
        double circleX = circle.getX();
        double circleY = circle.getY();
        double circleRadius = circle.getRadius();

        double rectLeft = x;
        double rectRight = x + width;
        double rectTop = y;
        double rectBottom = y + height;

        boolean insideX = (circleX + circleRadius >= rectLeft) && (circleX - circleRadius <= rectRight);
        boolean insideY = (circleY + circleRadius >= rectTop) && (circleY - circleRadius <= rectBottom);

        return insideX && insideY;
    }
}
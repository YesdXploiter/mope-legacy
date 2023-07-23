package me.yesd.World.Objects;

import me.yesd.Constants;
import me.yesd.Sockets.MsgWriter;
import me.yesd.Utilities.Utilities;

public class GameObject {

    private int type;
    private double x;
    private double y;
    private double z;
    private int radius;
    private int id;
    protected int biome;
    private double velocityX;
    private double velocityY;

    public boolean isCircle = true;
    public boolean isRectangle = false;
    public boolean updatingAngle = false;
    private double angle = 0;
    private int species = 0;
    public boolean showHP = false;
    public boolean isHurted = false;
    public boolean showWater = false;
    protected int health = 0;
    protected int maxHealth = 0;
    protected int water = 100;
    protected int maxWater = 100;
    public int getWater() { return this.water; }
    public void addWater(int amount) {
        this.water += amount;

        if (this.water > this.getMaxWater()) this.water = this.getMaxWater();
    }
    public void removeWater(int amount) {
        this.water -= amount;

        if (this.water < 0) this.water = 0;
    }
    public int getMaxWater() { return this.maxWater; }
    public void setMaxWater(int amount) { this.maxWater = amount; } // мб у некоторых животных будет другое кол-во макс воды эфф

    public void setBiome(int biome) {
        this.biome = biome;
    }

    public double getVelocityX() {
        return this.velocityX;
    }

    public void setVelocityX(final double velocityX) {
        this.velocityX = velocityX;
    }

    public void remVelocityX(final double velocityX) {
        this.velocityX -= velocityX;
    }

    public void remVelocityY(final double velocityY) {
        this.velocityY -= velocityY;
    }

    public double getVelocityY() {
        return this.velocityY;
    }

    public void setVelocityY(final double velocityY) {
        this.velocityY = velocityY;
    }

    public void update() {
        this.velocityX += this.accelerationX;
        this.velocityY += this.accelerationY;

        this.setX(this.getX() + this.getVelocityX());
        this.setY(this.getY() + this.getVelocityY());

        this.setVelocityX(this.getVelocityX() * 0.8);
        this.setVelocityY(this.getVelocityY() * 0.8);

        this.accelerationX = 0;
        this.accelerationY = 0;
    }

    public void addAccelerationX(double accelerationX) {
        this.accelerationX += accelerationX;
    }

    public void addAccelerationY(double accelerationY) {
        this.accelerationY += accelerationY;
    }

    public void setAccelerationX(double accelerationX) {
        this.accelerationX = accelerationX;
    }

    public void setAccelerationY(double accelerationY) {
        this.accelerationY = accelerationY;
    }

    public double getAccelerationX() {
        return this.accelerationX;
    }

    public double getAccelerationY() {
        return this.accelerationY;
    }

    private double accelerationX = 0.0;
    private double accelerationY = 0.0;

    public void addAcceleration(double angle, double force) {
        this.accelerationX += Math.cos(angle) * force;
        this.accelerationY += Math.sin(angle) * force;
    }

    public void addAngle(double angle) {
        this.angle += angle;
    }

    public void setAngle(double angle) {
        this.angle = angle;
    }

    public void addAccelerationTowards(double targetX, double targetY, double force) {
        double dx = targetX - this.x;
        double dy = targetY - this.y;

        double angle = Math.atan2(dy, dx);

        this.accelerationX += Math.cos(angle) * force;
        this.accelerationY += Math.sin(angle) * force;
    }

    public void setX(final double x) {
        if (Utilities.isValidDouble(x)) {
            if (x - this.radius - 1 < 1)
                this.x = 1 + this.radius;
            else if (x + this.radius + 1 > Constants.WIDTH)
                this.x = Constants.WIDTH - this.radius - 1;
            else
                this.x = x;
        }
    }

    public void setXUnsafe(final double x) {
        this.x = x;
    }

    public void setYUnsafe(final double y) {
        this.y = y;
    }

    public void setY(final double y) {
        if (Utilities.isValidDouble(y)) {
            if (y - this.radius - 1 < 1)
                this.y = 1 + this.radius;
            else if (y + this.radius + 1 > Constants.HEIGHT)
                this.y = Constants.HEIGHT - this.radius - 1;
            else
                this.y = y;
        }
    }

    public GameObject(final int id, final double x, final double y, final int radius, final int type) {
        this.type = type;
        this.id = id;
        this.x = Math.max(x, 0);
        this.y = Math.max(y, 0);
        this.radius = radius;
        this.biome = 0;
    }

    public int getHP() {
        return (health / maxHealth) * 100;
    }

    public void writeCustomData_onAdd(MsgWriter writer) {

    }

    public void writeCustomData_onUpdate(MsgWriter writer) {

    }

    public int getID() {
        return this.id;
    }

    public int getType() {
        return this.type;
    }

    public int getRadius() {
        return this.radius;
    }

    public double getX() {
        return this.x;
    }

    public double getY() {
        return this.y;
    }

    public double getZ() {
        return this.z;
    }

    public int getBiome() {
        return this.biome;
    }

    public boolean isRectangle() {
        return isRectangle;
    }

    public boolean isSendsAngle() {
        return updatingAngle;
    }

    public void setSendsAngle(boolean sends) {
        updatingAngle = sends;
    }

    public double getAngle() {
        return this.angle;
    }

    public int getSpecies() {
        return this.species;
    }

    public void onAdd() {
    }

    public boolean isDead() {
        return isDead;
    }

    public void setDead(boolean dead) {
        isDead = dead;
    }

    private boolean isDead;

    public boolean isCircle() {
        return isCircle;
    }

}

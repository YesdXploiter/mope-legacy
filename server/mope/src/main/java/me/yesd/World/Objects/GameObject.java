package me.yesd.World.Objects;

import me.yesd.Constants;
import me.yesd.Sockets.MsgWriter;
import me.yesd.Utilities.Utilities;
import java.util.concurrent.locks.ReentrantLock;

public class GameObject {

    private int type;
    private volatile double x;
    private volatile double y;
    private volatile double z;
    private int radius;
    private int id;
    protected int biome;
    private volatile double velocityX;
    private volatile double velocityY;
    private boolean solid = true;

    public boolean isCircle = true;
    public boolean isRectangle = false;
    public boolean updatingAngle = false;
    protected volatile double angle = 0;
    private int species = 0;
    public boolean showHP = false;
    public boolean isHurted = false;
    protected int health = 0;
    protected int maxHealth = 0;

    public void setBiome(int biome) {
        this.biome = biome;
    }

    public void setSolid(boolean solid) {
        this.solid = solid;
    }

    public boolean isSolid() {
        return this.solid;
    }

    public double getVelocityX() {
        return this.velocityX;
    }

    private final ReentrantLock lock = new ReentrantLock();

    private void withLock(Runnable r) {
        lock.lock();
        try {
            r.run();
        } finally {
            lock.unlock();
        }
    }

    public void setVelocityX(final double velocityX) {
        withLock(() -> this.velocityX = velocityX);
    }

    public void remVelocityX(final double velocityX) {
        withLock(() -> this.velocityX -= velocityX);
    }

    public void remVelocityY(final double velocityY) {
        withLock(() -> this.velocityY -= velocityY);
    }

    public void addVelocityX(final double velocityX) {
        withLock(() -> this.velocityX += velocityX);
    }

    public void addVelocityY(final double velocityY) {
        withLock(() -> this.velocityY += velocityY);
    }

    public double getVelocityY() {
        return this.velocityY;
    }

    public void setVelocityY(final double velocityY) {
        withLock(() -> this.velocityY = velocityY);
    }

    private boolean isMovable = true;

    public boolean isMovable() {
        return isMovable;
    }

    public void setMovable(boolean movable) {
        isMovable = movable;
    }

    public void update() {
        withLock(() -> {
            this.velocityX += this.accelerationX;
            this.velocityY += this.accelerationY;

            this.setX(this.getX() + this.getVelocityX());
            this.setY(this.getY() + this.getVelocityY());

            this.velocityX = this.getVelocityX() * 0.8;
            this.velocityY = this.getVelocityY() * 0.8;

            this.accelerationX = 0;
            this.accelerationY = 0;
        });
    }

    public void addAccelerationX(double accelerationX) {
        withLock(() -> this.accelerationX += accelerationX);
    }

    public void addAccelerationY(double accelerationY) {
        withLock(() -> this.accelerationY += accelerationY);
    }

    public void setAccelerationX(double accelerationX) {
        withLock(() -> this.accelerationX = accelerationX);
    }

    public void setAccelerationY(double accelerationY) {
        withLock(() -> this.accelerationY = accelerationY);
    }

    public double getAccelerationX() {
        return this.accelerationX;
    }

    public double getAccelerationY() {
        return this.accelerationY;
    }

    private volatile double accelerationX = 0.0;
    private volatile double accelerationY = 0.0;

    public void addAcceleration(double angle, double force) {
        withLock(() -> {
            this.accelerationX += Math.cos(angle) * force;
            this.accelerationY += Math.sin(angle) * force;
        });
    }

    public void addAngle(double angle) {
        withLock(() -> this.angle += angle);
    }

    public void setAngle(double angle) {
        withLock(() -> this.angle = angle);
    }

    public void addAccelerationTowards(double targetX, double targetY, double force) {
        withLock(() -> {
            double dx = targetX - this.x;
            double dy = targetY - this.y;

            double angle = Math.atan2(dy, dx);

            this.accelerationX += Math.cos(angle) * force;
            this.accelerationY += Math.sin(angle) * force;
        });
    }

    public void setX(final double x) {
        withLock(() -> {
            if (Utilities.isValidDouble(x)) {
                if (x - this.radius - 1 < 1)
                    this.x = 1 + this.radius;
                else if (x + this.radius + 1 > Constants.WIDTH)
                    this.x = Constants.WIDTH - this.radius - 1;
                else
                    this.x = x;
            }
        });
    }

    public void setXUnsafe(final double x) {
        withLock(() -> this.x = x);
    }

    public void setYUnsafe(final double y) {
        withLock(() -> this.y = y);
    }

    public void setY(final double y) {
        withLock(() -> {
            if (Utilities.isValidDouble(y)) {
                if (y - this.radius - 1 < 1)
                    this.y = 1 + this.radius;
                else if (y + this.radius + 1 > Constants.HEIGHT)
                    this.y = Constants.HEIGHT - this.radius - 1;
                else
                    this.y = y;
            }
        });
    }

    private double mass = 1.0;

    public double getMass() {
        return mass;
    }

    public void setMass(double mass) {
        withLock(() -> this.mass = mass);
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

    public void setPosition(double x, double y) {
        withLock(() -> {
            setX(x);
            setY(y);
        });
    }

}

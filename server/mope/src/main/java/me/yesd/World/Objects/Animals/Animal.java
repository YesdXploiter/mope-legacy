package me.yesd.World.Objects.Animals;

import java.util.Date;

import me.yesd.Constants;
import me.yesd.Sockets.FlagWriter;
import me.yesd.Sockets.MsgWriter;
import me.yesd.World.Objects.GameObject;
import me.yesd.World.Objects.Client.GameClient;
import me.yesd.World.Objects.Client.Pointer;

public class Animal extends GameObject {

    public AnimalInfo info = null;

    private int biome;
    private boolean divePossible = false;
    private boolean diveMain = false;
    private boolean diveUsable = false;
    private boolean diveRecharging = false;
    private boolean diveActive = false;

    public boolean flag_lowWat;
    public boolean flag_inHomeBiome;
    public boolean flag_underWater;
    public boolean flag_eff_invincible;
    public boolean flag_usingAbility;
    public boolean flag_tailBitten;
    public boolean flag_eff_stunned;
    public boolean flag_iceSliding;
    public boolean flag_eff_frozen;
    public boolean flag_eff_onFire;
    public boolean flag_eff_healing;
    public boolean flag_eff_poison;
    public boolean flag_constricted;
    public boolean flag_webStuck;
    public boolean flag_dirtStuck;
    public boolean flag_stealth;
    public boolean flag_eff_bleeding;
    public boolean flag_flying;
    public boolean flag_isGrabbed;
    public boolean flag_eff_aniInClaws;
    public boolean flag_eff_stunk;
    public boolean flag_cold;
    public boolean flag_inWater;
    public boolean flag_inLava;
    public boolean flag_canClimbHill;
    public boolean flag_isClimbingHill;
    public boolean flag_isDevMode;
    public boolean flag_eff_slimed;
    public boolean flag_eff_wobbling;
    public boolean flag_eff_hot;
    public boolean flag_eff_sweatPoisoned;
    public boolean flag_eff_shivering;
    public boolean flag_inHidingHole;
    public boolean flag_eff_grabbedByFlytrap;
    public boolean flag_eff_aloeveraHealing;
    public boolean flag_eff_tossedInAir;
    public boolean flag_eff_isOnSpiderWeb;
    public boolean flag_fliesLikeDragon;
    public boolean flag_eff_isInMud;
    public boolean flag_eff_statue;
    public boolean flag_eff_isOnTree;
    public boolean flag_eff_isUnderTree;
    public boolean flag_speared;
    public boolean flag_eff_dirty;
    public boolean flag_eff_virusInfection;
    public boolean flag_eff_wearingMask;
    public boolean flag_eff_sanitized;
    public boolean flag_viewing1v1Invite;
    public boolean flag_ytmode;
    public boolean flag_zombieInfection;
    public boolean effecT_isZombie;

    private boolean canClimbHills = false;
    private boolean isBoosting = false;
    private double lastBoostTimeout = 1500;
    private double boostingAmount = 0;
    private double targetAngle = 0;
    private double boostingAngle = 0;
    private double boostSpeed = 0.5 * 50;

    public boolean setBoostingAmount(double boostingAmount) {
        this.boostingAmount = boostingAmount;
        return canClimbHills;
    }

    public boolean getBoost() {
        return this.isBoosting;
    }

    public void changeBoost(boolean boost) {
        this.isBoosting = boost;
    }

    public void setCanClimbHills(boolean a) {
        this.canClimbHills = a;
    }

    public boolean getCanClimbHills() {
        return this.canClimbHills;
    }

    private Bar bar;

    public String playerName;

    protected long godmode_time;
    protected boolean godMode = false;

    public long lastBoostTime;

    public Animal(int id, double x, double y, AnimalInfo info, String playerName, GameClient client) {
        super(id, x, y, Tier.byOrdinal(info.getTier()).getBaseRadius(), 2);

        this.bar = new Bar(0, 100);
        this.client = client;
        this.playerName = playerName;
        this.info = info;
        this.setSendsAngle(true);
        this.godMode = true;
        this.godmode_time = new Date().getTime() + 3000;
    }

    public AnimalInfo getInfo() {
        return info;
    }

    public int getBiome() {
        return biome;
    }

    public boolean isDivePossible() {
        return divePossible;
    }

    public boolean isDiveRecharging() {
        return diveRecharging;
    }

    @Override
    public void update() {
        super.update();

        Pointer mouse = this.getClient().getMouse();

        movement();
        rotateTowards(mouse.x, mouse.y);

        if (this.health > this.maxHealth)
            this.health = this.maxHealth;

        if (godMode) {
            if (godmode_time > new Date().getTime()) {
                this.flag_eff_invincible = true;
            } else {
                this.flag_eff_invincible = false;
                godMode = false;
            }
        }

    }

    protected int speed = 3;

    // public void rotateTowards(double targetX, double targetY) {
    // double playerX = this.getX(); // player x position
    // double playerY = this.getY(); // player y position
    // double smoothness = Constants.SMOOTHNESS; // smoothness of rotation

    // // Add dependency on radius
    // double radius = this.getRadius();
    // double radiusFactor = Math.max(1, radius /
    // Constants.RADIUS_NORMALIZATION_FACTOR);
    // smoothness /= radiusFactor;

    // // Calculate the target angle
    // this.targetAngle = Math.atan2(targetY - playerY, targetX - playerX) * (180 /
    // Math.PI);

    // // Adjust for game's coordinate system
    // if (this.targetAngle < 0) {
    // this.targetAngle += 360;
    // }
    // this.targetAngle = (this.targetAngle + 180) % 360;

    // double currentAngle = (this.getAngle() + 360) % 360;

    // // Calculate the difference in angle
    // double diff = this.targetAngle - currentAngle;
    // if (diff > 180) {
    // diff -= 360;
    // } else if (diff < -180) {
    // diff += 360;
    // }

    // // Use lerp to smoothly rotate towards the target angle
    // //double newAngle = this.tier < 10 ? currentAngle + diff : currentAngle +
    // diff * smoothness;
    // double newAngle = currentAngle + diff * smoothness;

    // // Ensure newAngle is within [0, 360)
    // newAngle = (newAngle + 360) % 360;

    // // Set the new angle
    // this.addAngle(newAngle - this.getAngle());

    // }

    public void rotateTowards(double mx, double my) {
        double playerX = this.getX(); // player x position
        double playerY = this.getY(); // player y position

        this.targetAngle = (Math.atan2(my - playerY, mx - playerX) * 180) / Math.PI;
        if (this.targetAngle < 0) {
            this.targetAngle += 360;
        }

        this.targetAngle += 180;

        double dtheta = this.targetAngle - this.getAngle();

        if (dtheta > 180)
            dtheta -= 360;
        else if (dtheta < -180)
            dtheta += 360;

        double rotationSpeed = Constants.ROTATIONSPEED;
        double distance = Math.abs(dtheta);
        if (distance <= 6) {
            rotationSpeed *= distance / 6; // Изменяем скорость поворота от 0 до максимальной за 6 градусов
        }

        this.addAngle(rotationSpeed * dtheta);

        if (this.getAngle() < 0) {
            this.addAngle(360);
        } else if (this.getAngle() > 360) {
            this.addAngle(-360);
        }
    }

    private void movement() {
        Pointer mouse = this.getClient().getMouse();
        double dx = mouse.x - this.getX();
        double dy = mouse.y - this.getY();

        double distance = Math.sqrt(dx * dx + dy * dy);

        double moveDistance = Math.min(this.speed, distance);

        distance = Math.max(distance, 1);

        double ratio = moveDistance / distance;

        double newX = dx * ratio;
        double newY = dy * ratio;

        this.setVelocityX(newX);
        this.setVelocityY(newY);

        this.boost();

        /*
         * int x = this.getClient().getMouse().x;
         * int y = this.getClient().getMouse().y;
         * 
         * this.addAccelerationTowards(x, y, speed);
         */
    }

    private double rotateVectorToAngleX(double cx, double cy, double x, double y, double angle,
            boolean anticlock_wise) {
        if (angle == 0) {
            return x;
        }
        double radians = ((angle * Math.PI) / 180) * (anticlock_wise ? 1 : -1);
        double cos = Math.cos(radians);
        double sin = Math.sin(radians);
        double nx = cos * (x - cx) + sin * (y - cy) + cx;
        return nx;
    }

    private double rotateVectorToAngleY(double cx, double cy, double x, double y, double angle,
            boolean anticlock_wise) {
        if (angle == 0) {
            return y;
        }
        double radians = ((angle * Math.PI) / 180) * (anticlock_wise ? 1 : -1);
        double cos = Math.cos(radians);
        double sin = Math.sin(radians);
        double ny = cos * (y - cy) - sin * (x - cx) + cy;
        return ny;
    }

    private void boost() {
        double currentTime = new Date().getTime();
        if (this.getBoost()) {
            if (currentTime - this.lastBoostTime >= this.lastBoostTimeout &&
                    this.getBar().getValue() > 25) {
                // isBoosting = true;
                // this.lastBoostTime = new Date().getTime();
            }
            if (currentTime - this.lastBoostTime >= this.lastBoostTimeout && this.isBoosting
                    && this.getBar().getValue() > 25) {
                if (this.boostingAmount == 0) {
                    this.boostingAngle = this.targetAngle + 180;
                }
                this.boostingAmount++;
                double speed = this.boostSpeed / this.boostingAmount;
                double newPosX = rotateVectorToAngleX(0, 0, 0 + speed, 0, this.boostingAngle, false);
                double newPosY = rotateVectorToAngleY(0, 0, 0 + speed, 0, this.boostingAngle, false);
                this.addVelocityX(newPosX);
                this.addVelocityY(newPosY);
                this.lastBoostTime = new Date().getTime();
                if (this.boostingAmount >= 8) {
                    this.boostingAmount = 0;
                    // isBoosting = false;
                }
            }
        }
    };

    public double speedManipulation(double speed) {
        /*
         * if (this.stunnedSeconds > 0)
         * speed /= 1.5;
         * if (this.waterAniSlowingSeconds > 0 && !this.bypass_waterani_slowness)
         * speed /= 2;
         * if (this.frozenSeconds > 0)
         * speed /= 2;
         * if (this.paralizedSeconds > 0)
         * speed /= 4;
         * if (this.isWaterfowl() && this.getBiome() != 1)
         * speed /= 2;
         * if (!this.isFastInWater() && this.getBiome() == 1 &&
         * !this.flag_fliesLikeDragon)
         * speed /= 2;
         * if (!this.isFastInMud() && this.flag_eff_isInMud &&
         * !this.flag_fliesLikeDragon)
         * speed /= 2.5;
         * if (this.isWaterfowl() && this.getBiome() == 1)
         * speed *= 1.3;
         * if (this.isDiveActive())
         * speed /= 1.3;
         * if (!this.abilSpeed.isDone() && !this.bypassAbilSpeed)
         * speed /= 2;
         */
        return speed;
    }

    @Override
    public void writeCustomData_onAdd(MsgWriter writer) {
        writer.writeString(this.playerName);
        writer.writeUInt8(this.info.getAnimalSpecies());
        writer.writeUInt8(1); // name color
    }

    @Override
    public void writeCustomData_onUpdate(MsgWriter writer) {
        writer.writeUInt8(this.getSpecies());
        writer.writeUInt8(0); // species sub
        // angle in degrees!
        writer.writeUInt16((short) this.getAngle());
        writer.writeUInt8(this.getBiome());
        // flags
        FlagWriter flagWriter = new FlagWriter();

        flagWriter.writeBoolean(this.flag_lowWat);
        flagWriter.writeBoolean(this.flag_inHomeBiome);
        flagWriter.writeBoolean(this.flag_underWater);
        flagWriter.writeBoolean(this.flag_eff_invincible);
        flagWriter.writeBoolean(this.getInfo().getAbility() != null ? this.getInfo().getAbility().isActive() : false);
        flagWriter.writeBoolean(this.flag_tailBitten);
        flagWriter.writeBoolean(this.flag_eff_stunned);
        flagWriter.writeBoolean(this.flag_iceSliding);
        flagWriter.writeBoolean(this.flag_eff_frozen);
        flagWriter.writeBoolean(this.flag_eff_onFire);
        flagWriter.writeBoolean(this.flag_eff_healing);
        flagWriter.writeBoolean(this.flag_eff_poison);
        flagWriter.writeBoolean(this.flag_constricted);
        flagWriter.writeBoolean(this.flag_webStuck);
        flagWriter.writeBoolean(this.flag_stealth);
        flagWriter.writeBoolean(this.flag_eff_bleeding);
        flagWriter.writeBoolean(this.flag_flying);
        flagWriter.writeBoolean(this.flag_isGrabbed);
        flagWriter.writeBoolean(this.flag_eff_aniInClaws);
        flagWriter.writeBoolean(this.flag_eff_stunk);
        flagWriter.writeBoolean(this.flag_cold);
        flagWriter.writeBoolean(this.flag_inWater);
        flagWriter.writeBoolean(this.flag_inLava);
        flagWriter.writeBoolean(this.canClimbHills);
        flagWriter.writeBoolean(this.flag_isDevMode);
        flagWriter.writeBoolean(this.flag_eff_slimed);
        flagWriter.writeBoolean(this.flag_eff_wobbling);
        flagWriter.writeBoolean(this.flag_eff_hot);
        flagWriter.writeBoolean(this.flag_eff_sweatPoisoned);
        flagWriter.writeBoolean(this.flag_eff_shivering);
        flagWriter.writeBoolean(false); // in hole
        flagWriter.writeBoolean(this.flag_eff_grabbedByFlytrap);
        flagWriter.writeBoolean(this.flag_eff_aloeveraHealing);
        flagWriter.writeBoolean(this.flag_eff_tossedInAir);
        flagWriter.writeBoolean(this.flag_eff_isOnSpiderWeb);
        flagWriter.writeBoolean(this.flag_fliesLikeDragon);
        flagWriter.writeBoolean(this.flag_eff_isInMud);
        flagWriter.writeBoolean(this.flag_eff_statue);
        flagWriter.writeBoolean(this.flag_eff_isOnTree);
        flagWriter.writeBoolean(this.flag_eff_isUnderTree);
        writer.writeFlags(flagWriter);
        writer.writeBoolean(this.flag_speared);
        writer.writeBoolean(this.flag_eff_dirty);
        writer.writeBoolean(false); // pvp enabled
        writer.writeBoolean(false); // in arena

        writer.writeUInt8(0); // arena wins
        writer.writeUInt8(0); // player num

        if (this.flag_isDevMode)
            writer.writeUInt8(0); // developerModeNumber

        if (this.flag_eff_statue)
            writer.writeUInt8(0); // statue type

        if (this.flag_constricted)
            writer.writeUInt8(0); // eff_constrictedSpecies

        if (this.flag_webStuck)
            writer.writeUInt8(0); // eff_webStuckType

        if (this.flag_eff_dirty)
            writer.writeUInt8(0); // eff_dirtType
    }

    public boolean isDiveActive() {
        return diveActive;
    }

    public Bar getBar() {
        return this.bar;
    }

    private GameClient client;

    public GameClient getClient() {
        return this.client;
    }
}

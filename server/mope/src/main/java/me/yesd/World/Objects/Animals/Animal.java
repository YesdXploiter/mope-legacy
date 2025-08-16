package me.yesd.World.Objects.Animals;

import java.util.Date;
import java.util.EnumSet;

import me.yesd.Constants;
import me.yesd.Sockets.FlagWriter;
import me.yesd.Sockets.MsgWriter;
import me.yesd.World.Objects.GameObject;
import me.yesd.World.Objects.Client.GameClient;
import me.yesd.World.Objects.Client.Pointer;

public class Animal extends GameObject {

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

    public AnimalInfo info = null;

    private int biome;
    private Bar bar;
    private int speed = 3;
    private GameClient client;

    private boolean divePossible = false;
    private boolean diveMain = false;
    private boolean diveUsable = false;
    private boolean diveRecharging = false;
    private boolean diveActive = false;

    private EnumSet<StatusEffect> statusEffects = StatusEffect.none();

    private double targetAngle = 0;

    public long lastBoostTime;
    private long boostTimestamp;
    private boolean isBoosting = false;
    protected long boostCooldown = 1500;
    protected double boostForce = 25;

    public String playerName;

    private boolean godMode = false;
    private long godmode_time;

    public boolean getBoost() {
        return this.isBoosting;
    }

    public void changeBoost(boolean boost) {
        this.isBoosting = boost;
    }

    public void setCanClimbHills(boolean a) {
        setStatus(StatusEffect.CAN_CLIMB_HILL, a);
    }

    public boolean getCanClimbHills() {
        return hasStatus(StatusEffect.CAN_CLIMB_HILL);
    }

    public boolean hasStatus(StatusEffect effect) {
        return this.statusEffects.contains(effect);
    }

    public void setStatus(StatusEffect effect, boolean value) {
        if (value)
            this.statusEffects.add(effect);
        else
            this.statusEffects.remove(effect);
    }

    public AnimalInfo getInfo() {
        return info;
    }

    public int getBiome() {
        return biome;
    }

    public void setSpeed(int speed) {
        this.speed = speed;
    }

    public int getSpeed() {
        return speed;
    }

    public Bar getBar() {
        return this.bar;
    }

    public GameClient getClient() {
        return this.client;
    }

    public boolean isDiveActive() {
        return diveActive;
    }

    public boolean isDiveMain() {
        return diveMain;
    }

    public boolean isDiveUsable() {
        return diveUsable;
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

        double[] coordinates = calculateNewCoordinates();
        applyMovement(coordinates[0], coordinates[1]);

        boost();
        rotateTowards(mouse.x, mouse.y);

        if (this.health > this.maxHealth)
            this.health = this.maxHealth;

        if (godMode) {
            if (godmode_time > new Date().getTime()) {
                setStatus(StatusEffect.EFF_INVINCIBLE, true);
            } else {
                setStatus(StatusEffect.EFF_INVINCIBLE, false);
                godMode = false;
            }
        }

    }

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

        double dynamicRotationSpeed = Constants.ROTATIONSPEED * (Math.abs(dtheta) / 180);

        this.addAngle(dynamicRotationSpeed * dtheta);

        if (this.getAngle() < 0) {
            this.addAngle(360);
        } else if (this.getAngle() > 360) {
            this.addAngle(-360);
        }
    }

    private double[] calculateNewCoordinates() {
        Pointer mouse = this.getClient().getMouse();
        double dx = mouse.x - this.getX();
        double dy = mouse.y - this.getY();

        double distance = Math.sqrt(dx * dx + dy * dy);
        double moveDistance = Math.min(this.speed, distance);
        distance = Math.max(distance, 1);

        double ratio = moveDistance / distance;
        double angleDifference = Math.abs(Math.toDegrees(Math.atan2(dy, dx)) - this.getAngle());
        if (angleDifference < 0) {
            angleDifference += 360;
        } else if (angleDifference > 360) {
            angleDifference -= 360;
        }

        double newX, newY;
        if (angleDifference > 90 && angleDifference < 270) {
            newX = dx * ratio;
            newY = dy * ratio;
        } else {
            double oppositeAngle = this.getAngle() + 180;
            if (oppositeAngle < 0) {
                oppositeAngle += 360;
            } else if (oppositeAngle > 360) {
                oppositeAngle -= 360;
            }

            newX = -Math.cos(Math.toRadians(oppositeAngle)) * moveDistance;
            newY = -Math.sin(Math.toRadians(oppositeAngle)) * moveDistance;
        }

        return new double[] { newX, newY };
    }

    private void applyMovement(double newX, double newY) {
        this.setVelocityX(newX);
        this.setVelocityY(newY);
    }

    private void boost() {
        long currentTime = new Date().getTime();
        if (this.getBoost()) {
            if (boostTimestamp + boostCooldown < currentTime) {
                double[] boostcoordinates = calculateNewCoordinates();
                this.setVelocityX(boostcoordinates[0] * boostForce);
                this.setVelocityY(boostcoordinates[1] * boostForce);
                boostTimestamp = currentTime;
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

        flagWriter.writeBoolean(hasStatus(StatusEffect.LOW_WATER));
        flagWriter.writeBoolean(hasStatus(StatusEffect.IN_HOME_BIOME));
        flagWriter.writeBoolean(hasStatus(StatusEffect.UNDER_WATER));
        flagWriter.writeBoolean(hasStatus(StatusEffect.EFF_INVINCIBLE));
        flagWriter.writeBoolean(this.getInfo().getAbility() != null ? this.getInfo().getAbility().isActive() : false);
        flagWriter.writeBoolean(hasStatus(StatusEffect.TAIL_BITTEN));
        flagWriter.writeBoolean(hasStatus(StatusEffect.EFF_STUNNED));
        flagWriter.writeBoolean(hasStatus(StatusEffect.ICE_SLIDING));
        flagWriter.writeBoolean(hasStatus(StatusEffect.EFF_FROZEN));
        flagWriter.writeBoolean(hasStatus(StatusEffect.EFF_ON_FIRE));
        flagWriter.writeBoolean(hasStatus(StatusEffect.EFF_HEALING));
        flagWriter.writeBoolean(hasStatus(StatusEffect.EFF_POISON));
        flagWriter.writeBoolean(hasStatus(StatusEffect.CONSTRICTED));
        flagWriter.writeBoolean(hasStatus(StatusEffect.WEB_STUCK));
        flagWriter.writeBoolean(hasStatus(StatusEffect.STEALTH));
        flagWriter.writeBoolean(hasStatus(StatusEffect.EFF_BLEEDING));
        flagWriter.writeBoolean(hasStatus(StatusEffect.FLYING));
        flagWriter.writeBoolean(hasStatus(StatusEffect.IS_GRABBED));
        flagWriter.writeBoolean(hasStatus(StatusEffect.EFF_ANI_IN_CLAWS));
        flagWriter.writeBoolean(hasStatus(StatusEffect.EFF_STUNK));
        flagWriter.writeBoolean(hasStatus(StatusEffect.COLD));
        flagWriter.writeBoolean(hasStatus(StatusEffect.IN_WATER));
        flagWriter.writeBoolean(hasStatus(StatusEffect.IN_LAVA));
        flagWriter.writeBoolean(hasStatus(StatusEffect.CAN_CLIMB_HILL));
        flagWriter.writeBoolean(hasStatus(StatusEffect.IS_DEV_MODE));
        flagWriter.writeBoolean(hasStatus(StatusEffect.EFF_SLIMED));
        flagWriter.writeBoolean(hasStatus(StatusEffect.EFF_WOBBLING));
        flagWriter.writeBoolean(hasStatus(StatusEffect.EFF_HOT));
        flagWriter.writeBoolean(hasStatus(StatusEffect.EFF_SWEAT_POISONED));
        flagWriter.writeBoolean(hasStatus(StatusEffect.EFF_SHIVERING));
        flagWriter.writeBoolean(false); // in hole
        flagWriter.writeBoolean(hasStatus(StatusEffect.EFF_GRABBED_BY_FLYTRAP));
        flagWriter.writeBoolean(hasStatus(StatusEffect.EFF_ALOEVERA_HEALING));
        flagWriter.writeBoolean(hasStatus(StatusEffect.EFF_TOSSED_IN_AIR));
        flagWriter.writeBoolean(hasStatus(StatusEffect.EFF_IS_ON_SPIDER_WEB));
        flagWriter.writeBoolean(hasStatus(StatusEffect.FLIES_LIKE_DRAGON));
        flagWriter.writeBoolean(hasStatus(StatusEffect.EFF_IS_IN_MUD));
        flagWriter.writeBoolean(hasStatus(StatusEffect.EFF_STATUE));
        flagWriter.writeBoolean(hasStatus(StatusEffect.EFF_IS_ON_TREE));
        flagWriter.writeBoolean(hasStatus(StatusEffect.EFF_IS_UNDER_TREE));
        writer.writeFlags(flagWriter);
        writer.writeBoolean(hasStatus(StatusEffect.SPEARED));
        writer.writeBoolean(hasStatus(StatusEffect.EFF_DIRTY));
        writer.writeBoolean(false); // pvp enabled
        writer.writeBoolean(false); // in arena

        writer.writeUInt8(0); // arena wins
        writer.writeUInt8(0); // player num

        if (hasStatus(StatusEffect.IS_DEV_MODE))
            writer.writeUInt8(0); // developerModeNumber

        if (hasStatus(StatusEffect.EFF_STATUE))
            writer.writeUInt8(0); // statue type

        if (hasStatus(StatusEffect.CONSTRICTED))
            writer.writeUInt8(0); // eff_constrictedSpecies

        if (hasStatus(StatusEffect.WEB_STUCK))
            writer.writeUInt8(0); // eff_webStuckType

        if (hasStatus(StatusEffect.EFF_DIRTY))
            writer.writeUInt8(0); // eff_dirtType
    }
}

package me.yesd.World.Objects.Biome;

import java.util.ArrayList;

import me.yesd.Utilities.PerlinNoise;
import me.yesd.Utilities.Utilities;
import me.yesd.World.Room;
import me.yesd.World.Objects.GameObject;
import me.yesd.World.Objects.Rectangle;
import me.yesd.World.Objects.Static.Hill;

public class Biome extends Rectangle {
    protected Room room;
    public ArrayList<GameObject> objects;

    public Biome(int id, int type, double x, double y, double width, double height, int biome, Room room) {
        super(id, x, y, width, height, type);

        this.setBiome(biome);
        this.setSolid(false);
        this.setMovable(false);
        this.room = room;

        this.objects = new ArrayList<>();

        this.preSpawn();
        this.spawn();
        this.postSpawn();
    }

    // override
    public void spawn() {

    }

    public void preSpawn() {
        // Main.log.info("Started generating biome: " +
        // this.getClass().getSimpleName().toUpperCase());
    }

    public void postSpawn() {
        // Main.log.info("Finished generating biome: " +
        // this.getClass().getSimpleName().toUpperCase());
    }

    public void spawnHills(int amount) {
        int minX = (int) (this.getX() - this.getWidth() / 2) + 20;
        int minY = (int) (this.getY() - this.getHeight() / 2) + 20;

        int maxX = (int) (minX + this.getWidth()) - 20;
        int maxY = (int) (minY + this.getHeight()) - 20;

        for (int i = 0; i < amount; i++) {
            int rad = Utilities.randomInt(60, 80);
            double x = Utilities.randomDouble(minX + rad, maxX - rad);
            double y = Utilities.randomDouble(minY + rad, maxY - rad);

            double noise = PerlinNoise.noise(x / 100.0, y / 100.0);
            noise = (noise + 1) / 2;
            int scaledRad = (int) (rad + noise * 20);

            Hill hill = new Hill(this.room.getID(), x, y, scaledRad, this.getBiome());
            this.room.addObj(hill);
        }
    }
}

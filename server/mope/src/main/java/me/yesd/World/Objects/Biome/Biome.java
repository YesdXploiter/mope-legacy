package me.yesd.World.Objects.Biome;

import java.util.ArrayList;

import me.yesd.World.Room;
import me.yesd.World.Objects.GameObject;
import me.yesd.World.Objects.Rectangle;

public class Biome extends Rectangle {
    protected Room room;
    public ArrayList<GameObject> objects;

    public Biome(int id, int type, double x, double y, double width, double height, int biome, Room room) {
        super(id, x, y, width, height, type);

        this.setBiome(biome);
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

}

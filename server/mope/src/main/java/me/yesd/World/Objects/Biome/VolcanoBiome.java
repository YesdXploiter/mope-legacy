package me.yesd.World.Objects.Biome;

import me.yesd.Utilities.BiomeType;
import me.yesd.World.Room;
import me.yesd.World.Objects.GameObject;

public class VolcanoBiome extends GameObject {
    private Room room;

    public VolcanoBiome(int id, double x, double y, int radius, Room room, int spawnid) {
        super(id, x, y, radius, 47);
        this.setBiome(BiomeType.VOLCANO.ordinal());
        this.room = room;
    }
}

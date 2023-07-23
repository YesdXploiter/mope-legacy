package me.yesd.World.Objects.Biome;

import me.yesd.Utilities.BiomeType;
import me.yesd.World.Room;

public class Land extends Biome {

    public Land(int id, double x, double y, double width, double height, Room room) {
        super(id, 1, x, y, width, height, BiomeType.LAND.ordinal(), room);
    }

    @Override
    public void spawn() {
        super.spawn();
    }

}

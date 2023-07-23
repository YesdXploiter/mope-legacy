package me.yesd.World.Objects.Biome;

import me.yesd.Utilities.BiomeType;
import me.yesd.World.Room;

public class Ocean extends Biome {
    public Ocean(int id, double x, double y, double width, double height, Room room) {
        super(id, 12, x, y, width, height, BiomeType.OCEAN.ordinal(), room);
    }

    @Override
    public void update() {
        super.update();
    }
}

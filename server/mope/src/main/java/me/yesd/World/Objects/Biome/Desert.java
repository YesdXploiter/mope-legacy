package me.yesd.World.Objects.Biome;

import me.yesd.Utilities.BiomeType;
import me.yesd.World.Room;

public class Desert extends Biome {
    public Desert(int id, double x, double y, double width, double height, Room room) {
        super(id, 79, x, y, width, height, BiomeType.DESERT.ordinal(), room);
    }

    @Override
    public void update() {
        super.update();
    }
}

package me.yesd.World.Objects.Biome;

import me.yesd.Utilities.BiomeType;
import me.yesd.World.Room;

public class Arctic extends Biome {
    public Arctic(int id, double x, double y, double width, double height, Room room) {
        super(id, 16, x, y, width, height, BiomeType.ARCTIC.ordinal(), room);
    }

    @Override
    public void update() {
        super.update();
    }
}

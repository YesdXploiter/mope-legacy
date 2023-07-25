package me.yesd.World.Objects.Static;

import me.yesd.World.Objects.GameObject;

public class Hill extends GameObject {
    public Hill(int id, double x, double y, int rad, int biome) {
        super(id, x, y, rad, 3);
        this.setBiome(biome);
        this.setMovable(false);
    }
}

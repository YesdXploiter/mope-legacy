package me.yesd.World.Objects.Biome;

import me.yesd.World.Objects.Rectangle;
import me.yesd.Utilities.ObjectTypes;
import me.yesd.World.Room;

public class Beach extends Rectangle {

    public final int direction;
    public final Room room;

    public Beach(int id, double x, double y, double width, double height, Room room, int direction) {
        super(id, x, y, width, height, ObjectTypes.Beach.getType());
        this.room = room;
        this.direction = direction;
    }

    public void generate() {

    }
}

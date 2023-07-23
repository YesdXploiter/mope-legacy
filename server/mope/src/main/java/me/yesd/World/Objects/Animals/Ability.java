package me.yesd.World.Objects.Animals;

import me.yesd.Sockets.MsgWriter;
import me.yesd.World.Objects.GameObject;

public class Ability extends GameObject {

    public int is1v1Target;
    private int secondaryType;

    public Ability(int id, double x, double y, int type, int radius, int is1v1Target) {
        super(id, x, y, radius, 14);
        this.secondaryType = type;
        this.is1v1Target = is1v1Target;
    }

    public int getSecondaryType() {
        return secondaryType;
    }

    @Override
    public void writeCustomData_onUpdate(MsgWriter writer) {
        writer.writeUInt8(0); // spec type
        writer.writeUInt8(0); // spec type 2
        writer.writeUInt8(this.is1v1Target);
    }

    @Override
    public void writeCustomData_onAdd(MsgWriter writer) {
        writer.writeUInt8(0); // spec type
        writer.writeUInt8(0); // spec type 2
        writer.writeUInt8(0); // species
    }
}

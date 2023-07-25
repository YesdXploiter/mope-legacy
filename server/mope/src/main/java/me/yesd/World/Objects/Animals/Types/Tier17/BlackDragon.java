package me.yesd.World.Objects.Animals.Types.Tier17;

import me.yesd.Sockets.MsgWriter;
import me.yesd.World.Objects.Animals.Animal;
import me.yesd.World.Objects.Animals.AnimalInfo;
import me.yesd.World.Objects.Animals.Animals;
import me.yesd.World.Objects.Animals.Bar;
import me.yesd.World.Objects.Client.GameClient;

public class BlackDragon extends Animal {

    public BlackDragon(int id, double x, double y, AnimalInfo info, String playerName, GameClient client) {
        super(id, x, y, Animals.BlackDragon, playerName, client);

        this.setCanClimbHills(true);
        this.getBar().setBarType(2);
    }

    @Override
    public void writeCustomData_onAdd(MsgWriter writer) {
        super.writeCustomData_onAdd(writer);
        writer.writeUInt8(this.getBar().getValue());
    }

    @Override
    public void writeCustomData_onUpdate(MsgWriter writer) {
        super.writeCustomData_onUpdate(writer);
        writer.writeUInt8(this.getBar().getValue());
    }
}

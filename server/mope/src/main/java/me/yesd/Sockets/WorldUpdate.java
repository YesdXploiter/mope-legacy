package me.yesd.Sockets;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import me.yesd.Utilities.MessageType;
import me.yesd.World.Room;
import me.yesd.World.Objects.GameObject;
import me.yesd.World.Objects.Rectangle;
import me.yesd.World.Objects.Animals.Ability;
import me.yesd.World.Objects.Animals.Animal;
import me.yesd.World.Objects.Animals.AnimalInfo;
import me.yesd.World.Objects.Client.GameClient;

public class WorldUpdate {
    public static MsgWriter create(GameClient client, Room room) {
        MsgWriter writer = new MsgWriter();
        writer.writeType(MessageType.WORLDUPDATE);

        writer.writeUInt16((short) (client.getCamera().x * 4));
        writer.writeUInt16((short) (client.getCamera().y * 4));
        writer.writeUInt32(client.getCamera().zoom);

        writer.writeBoolean(client.isDeveloper());

        Animal ani = client.getPlayer();
        AnimalInfo info = ani != null ? ani.getInfo() : null;

        writer.writeBoolean(client.isAlive());

        if (client.isAlive()) {
            writer.writeUInt8(ani.getBar().getPercentage()); // water bar percent
            writer.writeUInt8(ani.getBar().type); // bar type;

            writer.writeUInt32(client.getXP()); // current experience
            writer.writeUInt8(client.getXPPercentage()); // experience percent;
        }

        HashMap<Integer, GameObject> add = new HashMap<Integer, GameObject>(client.getAddList());
        HashMap<Integer, GameObject> update = new HashMap<Integer, GameObject>(client.getUpdateList());
        HashMap<GameObject, GameObject> remove = new HashMap<GameObject, GameObject>(client.getRemoveList());
        Set<Map.Entry<Integer, GameObject>> addp = add.entrySet();
        Iterator<Map.Entry<Integer, GameObject>> itAdd = addp.iterator();

        int addSize = addp.size();

        writer.writeUInt16((short) addSize);

        while (itAdd.hasNext()) {
            Map.Entry<Integer, GameObject> entry = itAdd.next();
            GameObject o = entry.getValue();
            WorldUpdate.writeObject(writer, o);
            o.writeCustomData_onAdd(writer);
            client.getAddList().remove(entry.getKey());
        }

        Set<Map.Entry<Integer, GameObject>> upd = update.entrySet();
        Iterator<Map.Entry<Integer, GameObject>> itUpd = upd.iterator();
        int updateSize = upd.size();

        writer.writeUInt16((short) updateSize);

        while (itUpd.hasNext()) {
            Map.Entry<Integer, GameObject> entry = itUpd.next();
            GameObject o = entry.getValue();
            WorldUpdate.writeUpdateObject(writer, o, client);
            o.writeCustomData_onUpdate(writer);
            client.getUpdateList().remove(entry.getKey());
        }

        Set<Map.Entry<GameObject, GameObject>> rem = remove.entrySet();
        Iterator<Map.Entry<GameObject, GameObject>> itRem = rem.iterator();
        int removeSize = rem.size();

        writer.writeUInt16((short) removeSize);

        while (itRem.hasNext()) {
            Map.Entry<GameObject, GameObject> entry = itRem.next();
            GameObject victim = entry.getKey();
            GameObject killer = entry.getValue();
            writer.writeUInt32(victim.getID());
            writer.writeBoolean(killer != null);
            if (killer != null) {
                writer.writeUInt32(killer.getID());
            }
            client.getRemoveList().remove(victim);
        }

        return writer;
    }

    public static void writeObject(MsgWriter writer, GameObject o) {
        writer.writeUInt8(o.getType());
        if (o instanceof Animal) {
            writer.writeUInt8(((Animal) o).getInfo().getAnimalType());
        }
        if (o instanceof Ability) {
            writer.writeUInt8(((Ability) o).getSecondaryType());
        }

        writer.writeUInt32(o.getID());
        writer.writeUInt32((int) Math.round(o.getRadius() + o.getZ()));
        writer.writeUInt16((short) (o.getX() * 4));
        writer.writeUInt16((short) (o.getY() * 4));

        writer.writeUInt8(o.getBiome());

        // writer.writeBoolean(false); // spawned from
        writer.writeBoolean(o.isRectangle()); // rectangle
        writer.writeBoolean(o.isSendsAngle()); // angle?

        // if (o.isSpawnedFromID())
        // writer.writeUInt32(o.getSpawnID());

        if (o.isRectangle()) {
            Rectangle rect = (Rectangle) o;
            writer.writeUInt16((short) rect.getWidth());
            writer.writeUInt16((short) rect.getHeight());
        }

        if (o.isSendsAngle()) {
            writer.writeUInt16((short) o.getAngle());
        }

    }

    public static void writeTreeInfo(MsgWriter writer, Animal ani) {
        // TO:DO finish this.

        // is player under tree
        writer.writeBoolean(false);
    }

    public static void writeUnderneathAnimalsInfo(MsgWriter writer, Animal ani) {
        // TO:DO finish this.

        // is player underneath animal?
        writer.writeBoolean(false);
    }

    public static void writeUpdateObject(MsgWriter writer, GameObject o, GameClient client) {
        writer.writeUInt32(o.getID());

        writer.writeUInt16((short) (o.getX() * 4));
        writer.writeUInt16((short) (o.getY() * 4));
        writer.writeUInt32((int) Math.round(o.getRadius() + o.getZ()));

        writer.writeUInt8(o.getSpecies());

        writer.writeBoolean(o.showHP); // show hp
        writer.writeBoolean(o.isHurted); // flash

        if (o.showHP) {
            writer.writeUInt8(o.getHP());
        }

        if (o.isSendsAngle()) {
            writer.writeUInt16((short) o.getAngle());
        }
    }
}
package me.yesd.World;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import org.java_websocket.WebSocket;

import me.yesd.Constants;
import me.yesd.Sockets.MsgWriter;
import me.yesd.Utilities.GameList;
import me.yesd.Utilities.MessageType;
import me.yesd.Utilities.Utilities;
import me.yesd.World.Collision.Collision;
import me.yesd.World.Objects.GameObject;
import me.yesd.World.Objects.Biome.Arctic;
import me.yesd.World.Objects.Biome.Beach;
import me.yesd.World.Objects.Biome.Land;
import me.yesd.World.Objects.Biome.Ocean;
import me.yesd.World.Objects.Biome.VolcanoBiome;
import me.yesd.World.Objects.Client.GameClient;

public class Room extends Thread {

    public final HashMap<WebSocket, GameClient> clients = new HashMap<>();

    private int width;
    private int height;
    private int mode;

    private int object_id = 0;

    private Arctic arctic;

    private Land land;
    private Beach beach1;
    private Beach beach2;

    private VolcanoBiome volcanoBiome;

    public static GameList objects;

    private Ocean oleft;

    private Ocean oright;

    private Collision collision;

    public Room() {
        this.width = Constants.WIDTH;
        this.height = Constants.HEIGHT;
        this.mode = Constants.GAMEMODE;
        this.objects = new GameList();
        this.collision = new Collision(this);
    }

    public void sendChat(GameClient client, String msg) {
        if (client.getPlayer() == null)
            return;

        GameObject ani = client.getPlayer();

        for (GameClient client1 : clients.values()) {
            if (client1.getVisibleList().containsKey(ani.getID())) {
                MsgWriter writer = new MsgWriter();
                writer.writeType(MessageType.CHAT);
                writer.writeUInt32(ani.getID());
                writer.writeString(msg);

                client1.send(writer);
            }
        }
    }

    public void addClient(GameClient client) {
        clients.put(client.socket, client);
    }

    public MsgWriter getRoomInfo(GameClient client) {
        MsgWriter writer = new MsgWriter();
        writer.writeType(MessageType.NEWGAMEROOM);
        writer.writeUInt8(!client.isAlive() ? 1 : 0);

        writer.writeUInt16((short) this.width);
        writer.writeUInt16((short) this.height);
        writer.writeUInt8(this.mode);

        writer.writeUInt16((short) (client.getCamera().x * 4));
        writer.writeUInt16((short) (client.getCamera().y * 4));
        writer.writeUInt32(client.getCamera().zoom);

        writer.writeUInt16((short) Constants.OCEANW);
        writer.writeUInt16((short) Constants.ARCTICW);
        writer.writeUInt16((short) Constants.ARCTICH);

        writer.writeUInt16((short) 0); // rivers

        writer.writeUInt16((short) 0); // volcano biome
        // writer.writeUInt16(volcanoBiome.getRadius() / 5);
        // writer.writeUInt16((short) Math.round(volcanoBiome.getX()));
        // writer.writeUInt16((short) Math.round(volcanoBiome.getY()));

        writer.writeUInt16((short) 0); // lakes

        writer.writeUInt16((short) 0); // mud

        writer.writeUInt16((short) 0); // arcticIce

        writer.writeUInt16((short) 0); // hills

        writer.writeUInt16((short) 0); // lakeisland

        writer.writeUInt16((short) 0); // berryspot

        writer.writeUInt16((short) 0); // waterSpot

        return writer;
    }

    public void removeClient(WebSocket socket) {
        clients.remove(socket);
    }

    public GameClient getClient(WebSocket conn) {
        return clients.get(conn);
    }

    public int getMode() {
        return Constants.GAMEMODE;
    }

    public short getOnline() {
        return 0;
    }

    public short getVersion() {
        return Constants.VERSION;
    }

    public int getID() {
        this.object_id++;
        return this.object_id;
    }

    public void addObj(GameObject object) {
        object.setDead(false);
        this.objects.add(object);
        object.onAdd();
    }

    private void generate() {
        this.arctic = new Arctic(this.getID(), Constants.ARCTICW / 2,
                Constants.ARCTICH / 2, Constants.ARCTICW,
                Constants.ARCTICH, this);
        this.addObj(arctic);
        // int id, double x, double y, double width, double height, Room room, int
        // direction
        this.beach1 = new Beach(this.getID(), Constants.OCEANW + Constants.BEACHW / 2,
                Constants.HEIGHT / 2 + Constants.ARCTICH / 2,
                Constants.BEACHW, Constants.HEIGHT - Constants.ARCTICH, this, 1);
        this.addObj(beach1);
        this.beach2 = new Beach(this.getID(), Constants.WIDTH - Constants.OCEANW - Constants.BEACHW / 2,
            Constants.HEIGHT / 2 + Constants.ARCTICH / 2,
            Constants.BEACHW, Constants.HEIGHT - Constants.ARCTICH, this, 1);
        this.addObj(beach2);

        this.land = new Land(this.getID(), Constants.WIDTH / 2, Constants.HEIGHT / 2,
                Constants.LANDW, Constants.LANDH,
                this);
        this.addObj(land);
        land.spawnHills(150);

        this.oleft = new Ocean(this.getID(), Constants.OCEANW / 2, Constants.HEIGHT /
                2, Constants.OCEANW,
                Constants.OCEANH, this);
        this.addObj(oleft);

        this.oright = new Ocean(this.getID(), Constants.WIDTH - (Constants.OCEANW /
                2), Constants.HEIGHT / 2,
                Constants.OCEANW,
                Constants.OCEANH, this);
        this.addObj(oright);

        this.volcanoBiome = new VolcanoBiome(this.getID(), Constants.WIDTH / 2,
                Constants.HEIGHT / 2, 800, this,
                land.getID());
        this.addObj(volcanoBiome);
    }

    private void update() {
        Set<Map.Entry<WebSocket, GameClient>> clientsSet = clients.entrySet();
        Iterator<Map.Entry<WebSocket, GameClient>> clientsIterator = clientsSet.iterator();
        while (clientsIterator.hasNext()) {
            Map.Entry<WebSocket, GameClient> entry = clientsIterator.next();
            GameClient client = entry.getValue();
            client.update();
        }

        collision.update();
    }

    public void removeObj(GameObject object, GameObject killer) {
        if (object == null)
            return;
        object.setDead(true);
        this.objects.remove(object);

        HashMap<WebSocket, GameClient> clients = new HashMap<WebSocket, GameClient>(this.clients);
        Set<Map.Entry<WebSocket, GameClient>> clientsp = clients.entrySet();
        Iterator<Map.Entry<WebSocket, GameClient>> clientspit = clientsp.iterator();
        while (clientspit.hasNext()) {
            Map.Entry<WebSocket, GameClient> entry = clientspit.next();
            GameClient client = entry.getValue();
            if (client.getVisibleList().containsKey(object.getID())) {
                client.hideFromView(object, killer);
            }
        }
    }

    public GameObject getBiomeByID(int id, GameObject obj) {
        if (id == 0 || id == 5)
            return land;
        if (id == 1) {
            if (obj == null)
                return Utilities.randomBoolean() ? oleft : oright;
            else {
                double distance = Utilities.distance(oleft.getX(), obj.getX(), oleft.getY(), obj.getY());
                double distance2 = Utilities.distance(oright.getX(), obj.getX(), oright.getY(), obj.getY());
                if (distance > distance2)
                    return oright;
                else
                    return oleft;
            }
        }
        if (id == 2)
            return arctic;
        if (id == 3)
            return volcanoBiome;
        else
            return land;
    }

    @Override
    public void run() {
        this.generate();
        while (true) {
            try {
                this.update();

                Thread.sleep(1000 / Constants.TICKS_PER_SECOND);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public GameList getObjects() {
        return objects;
    }
}

package me.yesd.World.Objects.Client;

import java.lang.reflect.Constructor;
import java.util.HashMap;
import java.util.List;

import org.java_websocket.WebSocket;

import me.yesd.Constants;
import me.yesd.Sockets.MsgReader;
import me.yesd.Sockets.MsgWriter;
import me.yesd.Sockets.Network;
import me.yesd.Sockets.WorldUpdate;
import me.yesd.Utilities.MessageType;
import me.yesd.Utilities.PacketException;
import me.yesd.Utilities.RectangleUtils;
import me.yesd.Utilities.Utilities;
import me.yesd.World.Room;
import me.yesd.World.Objects.GameObject;
import me.yesd.World.Objects.Rectangle;
import me.yesd.World.Objects.Animals.Animal;
import me.yesd.World.Objects.Animals.AnimalInfo;
import me.yesd.World.Objects.Animals.Tier;
import me.yesd.World.Objects.Biome.Biome;

public class GameClient {
    public Room room;
    public WebSocket socket;
    public String session;
    public boolean alive = false;
    public String playerName;
    public int canvasW;
    public int canvasH;
    public boolean joined;
    private int xp = 0;
    private boolean inUpgrade;
    private int tier;
    private int inUpgradeTimer;
    private Animal player;
    private List<AnimalInfo> selectionList;
    private Camera camera;
    private int developer = 0;
    private HashMap<Integer, GameObject> addList = new HashMap<>();
    private HashMap<Integer, GameObject> updateList = new HashMap<>();
    private HashMap<GameObject, GameObject> removeList = new HashMap<>();
    private HashMap<Integer, GameObject> visibleList = new HashMap<>();
    private Pointer mouse;

    public GameClient(WebSocket socket, Room room) {
        this.room = room;
        this.socket = socket;
        this.camera = new Camera(0, 0);
        this.mouse = new Pointer(0, 0);
    }

    public void handlePing() {
        MsgWriter writer = new MsgWriter();
        writer.writeType(MessageType.PING);
        this.socket.send(writer.getData());
    }

    public void onMessage(byte[] bytes) {
        MsgReader reader = new MsgReader(bytes);
        try {
            int type = reader.readUInt8();
            MessageType messageType = MessageType.byOrdinal(type);
            if (messageType == null) {
                throw new PacketException();
            }

            System.out.println(messageType + "");

            switch (messageType) {
                case FIRSTCONNECT: {
                    this.handleFirstConnect(reader);
                    break;
                }

                case REQUESTJOIN: {
                    this.handleRequest(reader);
                    break;
                }

                case PING: {
                    this.handlePing();
                    break;
                }

                case GAMESELECTANIMAL:
                    this.handleSelection(reader);
                    break;

                case CLIENTRESIZE: {
                    break;
                }

                case MOUSEPOS: {
                    short mouseX = reader.readInt16();
                    short mouseY = reader.readInt16();
                    this.mouse.setX(mouseX);
                    this.mouse.setY(mouseY);
                    break;
                }

                default:
                    break;
            }
        } catch (Exception | PacketException e) {
            e.printStackTrace();
            this.sendDisconnect("MOPERR_000");
        }
    }

    public void hideFromView(GameObject object, GameObject killer) {
        addList.remove(object.getID());
        updateList.remove(object.getID());
        visibleList.remove(object.getID());
        removeList.put(object, killer);
    }

    public int getNextXP() {
        return Tier.byOrdinal(this.getPlayer().getInfo().getTier()).getUpgradeXP();
    }

    public int getPreviousXP() {
        return Tier.byOrdinal(this.getPlayer().getInfo().getTier()).getPreviousXP();
    }

    public int getStartXP() {
        return Tier.byOrdinal(this.getPlayer().getInfo().getTier()).getStartXP();
    }

    public void handleSelection(MsgReader reader) {
        int selected = -1;
        try {
            selected = reader.readUInt8();
        } catch (PacketException e) {
            this.sendDisconnect("MOPERR_5_24");
            return;
        }
        if (this.selectionList.size() <= selected || !this.inUpgrade)
            return;

        AnimalInfo info = this.selectionList.get(selected);
        if (info == null)
            return;

        double[] bounds = getBounds(info);
        if (this.player == null) {
            this.player = createAnimal(info, bounds);
            this.room.addObj(this.player);

            this.alive = true;
            this.send(Network.createSelection(this, 5, 0, 0, null));
            this.send(Network.changeAnimal(this.player, 1));
            this.inUpgrade = false;

            MsgWriter writer = new MsgWriter();
            writer.writeType(MessageType.PLAYERALIVE);
            this.send(writer);

        } else {
            this.room.removeObj(this.player, null);

            double newx = this.player.getX();
            double newy = this.player.getY();
            if (this.player.getX() > bounds[1]) {
                newx = bounds[1];
            }
            if (this.player.getX() < bounds[0]) {
                newx = bounds[0];
            }
            if (this.player.getY() > bounds[3]) {
                newy = bounds[3];
            }
            if (this.player.getY() < bounds[2]) {
                newy = bounds[2];
            }

            this.player = createAnimal(info, new double[] { newx, newy });
            this.room.addObj(this.player);

            this.send(Network.createSelection(this, 5, 0, 0, null));
            this.send(Network.changeAnimal(this.player, 1));
            this.inUpgrade = false;
        }
    }

    private double[] getBounds(AnimalInfo info) {
        GameObject biome = this.room.getBiomeByID(info.getBiome(), this.player);
        System.out.println("A: " + info.getBiome());
        double[] bounds = new double[4];
        double radius = Tier.byOrdinal(info.getTier()).getBaseRadius() * 2;
        if (biome instanceof Biome) {
            bounds[0] = ((Biome) biome).getX() + radius - (((Biome) biome).getWidth() / 2);
            bounds[1] = ((Biome) biome).getX() - radius + (((Biome) biome).getWidth() / 2);
            bounds[2] = ((Biome) biome).getY() + radius - (((Biome) biome).getHeight() / 2);
            bounds[3] = ((Biome) biome).getY() - radius + (((Biome) biome).getHeight() / 2);
        } else {
            bounds[0] = biome.getX() + radius - biome.getRadius();
            bounds[1] = biome.getX() - radius + biome.getRadius();
            bounds[2] = biome.getY() + radius - biome.getRadius();
            bounds[3] = biome.getY() - radius + biome.getRadius();
        }
        return bounds;
    }

    private Animal createAnimal(AnimalInfo info, double[] bounds) {
        Animal animal = null;
        if (info.getType().hasCustomClass()) {
            try {
                Constructor<Animal> aa = info.getType().getAnimalClass().getConstructor(int.class, double.class,
                        double.class, AnimalInfo.class, String.class, GameClient.class);
                animal = aa.newInstance(this.room.getID(), Utilities.randomDouble(bounds[0], bounds[1]),
                        Utilities.randomDouble(bounds[2], bounds[3]),
                        info, this.playerName, this);
            } catch (Exception e) {
                this.sendDisconnect("MOPERR_0_1");
                e.printStackTrace();
            }
        } else {
            animal = new Animal(this.room.getID(), Utilities.randomDouble(bounds[0], bounds[1]),
                    Utilities.randomDouble(bounds[2], bounds[3]), info, this.playerName, this);
        }
        return animal;
    }

    public void send(MsgWriter writer) {
        if (this.socket.isOpen())
            this.socket.send(writer.getData());
    }

    public boolean isAlive() {
        return alive;
    }

    public boolean isJoined() {
        return joined;
    }

    public void handleRequest(MsgReader reader) {
        if (this.isAlive())
            return;

        boolean isSpectator;
        String playerName = "mope.io";
        int canvasW;
        int canvasH;
        try {
            playerName = reader.readString();
            canvasW = reader.readUInt16();
            canvasH = reader.readUInt16();
            isSpectator = reader.readUInt8() == 1;
            if (canvasW == 0 || canvasH == 0) {
                throw new PacketException();
            }
        } catch (PacketException e) {
            this.sendDisconnect("MOPERR_002");
            return;
        }

        this.playerName = playerName.trim();

        this.canvasW = canvasW;
        this.canvasH = canvasH;

        if (isSpectator) {
            if (!this.joined) {
                this.joined = true;
                this.alive = false;

                this.send(Network.sendJoinPacket(this.room, this, true));

                MsgWriter writer = new MsgWriter();
                writer.writeUInt8(MessageType.REQUESTJOIN.value());
                writer.writeUInt8(1);
                writer.writeUInt8(1);
                System.out.println("sas");
                this.send(writer);

                this.send(this.room.getRoomInfo(this));
            }
        } else {
            System.out.println("sas2");
            this.send(Network.sendJoinPacket(this.room, this, false));
            this.send(Network.createSelection(this, 1, 15,
                    (Tier.byOrdinal(Constants.STARTING_TIER).getNormal(this.getXP())),
                    Tier.byOrdinal((Tier.byOrdinal(Constants.STARTING_TIER).getNormal(this.getXP()))).getAnimalInfo()));
        }
    }

    public boolean isDeveloper() {
        return this.developer >= 1;
    }

    public boolean isSuperDeveloper() {
        return this.developer >= 2;
    }

    public int getXP() {
        return xp;
    }

    public int getXPPercentage() {
        return ((this.xp - Tier.byOrdinal(this.tier).getStartXP())
                / (Tier.byOrdinal(this.tier).getUpgradeXP() - Tier.byOrdinal(this.tier).getStartXP())) * 100;
    }

    public void handleFirstConnect(MsgReader reader) {
        MsgWriter writer = new MsgWriter();
        writer.writeType(MessageType.FIRSTCONNECT);
        writer.writeUInt8(this.room.getMode());
        writer.writeUInt8(0); // game state
        writer.writeUInt16((short) this.room.getOnline());
        writer.writeUInt16((short) this.room.getVersion());

        this.send(writer);
    }

    public void sendDisconnect(String msg) {
        MsgWriter writer = new MsgWriter();
        writer.writeType(MessageType.DCED);
        writer.writeString(msg);

        if (this.socket.isOpen()) {
            this.socket.send(writer.getData());
            this.socket.close();
        }
    }

    public void setInUpgrade(boolean inUpgrade) {
        this.inUpgrade = inUpgrade;
    }

    public void setTier(int tier) {
        this.tier = tier;
    }

    public void setUpgradeTimer(int timeout) {
        this.inUpgradeTimer = timeout;
    }

    public Animal getPlayer() {
        return this.player;
    }

    public List<AnimalInfo> getSelectionList() {
        return selectionList;
    }

    public void setSelectionList(List<AnimalInfo> selectionList) {
        this.selectionList = selectionList;
    }

    public void updateView() {
        double wVisible = Math.abs(3700 - (this.camera.zoom)) / 10;
        double hVisible = Math.abs(3700 - (this.camera.zoom)) / 10;

        RectangleUtils utils = new RectangleUtils(this.camera.x, this.camera.y, wVisible, hVisible);

        for (GameObject object : this.room.getObjects()) {

            if (object.isDead())
                continue;
            if (this.visibleList.containsKey(object.getID())) {
                boolean intersected;

                if (object instanceof Rectangle) {
                    intersected = utils.intersectsRectangle((Rectangle) object);
                } else if (this.player == object) {
                    intersected = true;
                } else if (object.isCircle()) {
                    intersected = utils.intersectsCircle(object);
                } else {
                    intersected = utils.intersectsPoint(object);
                }

                if (!intersected) {
                    this.removeList.put(object, null);
                    this.visibleList.remove(object.getID());
                } else {
                    this.updateList.put(object.getID(), object);
                }
            } else {
                boolean intersected;

                if (object instanceof Rectangle) {
                    intersected = utils.intersectsRectangle((Rectangle) object);
                } else if (this.player == object) {
                    intersected = true;
                } else if (object.isCircle()) {
                    intersected = utils.intersectsCircle(object);
                } else {
                    intersected = utils.intersectsPoint(object);
                }

                if (intersected) {
                    this.addList.put(object.getID(), object);
                    this.visibleList.put(object.getID(), object);
                }
            }
        }
    }

    public void update() {
        this.updateView();
        if (this.isAlive()) {
            this.camera.setX((int) this.player.getX());
            this.camera.setY((int) this.player.getY());
        } else {
            this.camera.addX(1);
            this.camera.addY(1);
        }
        if (this.joined) {
            this.send(WorldUpdate.create(this, this.room));
        }
    }

    public Camera getCamera() {
        return this.camera;
    }

    public HashMap<Integer, GameObject> getAddList() {
        return this.addList;
    }

    public HashMap<Integer, GameObject> getUpdateList() {
        return this.updateList;
    }

    public HashMap<GameObject, GameObject> getRemoveList() {
        return this.removeList;
    }

    public HashMap<Integer, GameObject> getVisibleList() {
        return this.visibleList;
    }

    public Pointer getMouse() {
        return mouse;
    }
}

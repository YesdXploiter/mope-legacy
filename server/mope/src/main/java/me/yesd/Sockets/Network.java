package me.yesd.Sockets;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

import me.yesd.Constants;
import me.yesd.Utilities.MessageType;
import me.yesd.World.Room;
import me.yesd.World.Objects.Animals.Animal;
import me.yesd.World.Objects.Animals.AnimalInfo;
import me.yesd.World.Objects.Animals.Animals;
import me.yesd.World.Objects.Client.GameClient;

public class Network {
    public static MsgWriter sendJoinPacket(Room room, GameClient player, boolean isSpectator) {
        MsgWriter writer = new MsgWriter();
        writer.writeType(MessageType.REQUESTJOIN);
        if (room.getOnline() > Constants.MAX_PLAYERS) {
            writer.writeUInt8(0);
            writer.writeString("Server is full!");
            writer.writeUInt8(isSpectator ? 1 : 0);
            player.sendDisconnect("Server is full!");
        } else {
            writer.writeUInt8(1);
            writer.writeString("Success");
            writer.writeUInt8(isSpectator ? 1 : 0);
        }
        return writer;
    }

    public static MsgWriter br_playerCount(Room room, int players, boolean isAlive) {
        MsgWriter writer = new MsgWriter();
        writer.writeType(MessageType.GAMEMODEHANDLE);
        writer.writeUInt8(82); // type
        writer.writeUInt16(1); // players
        writer.writeString(isAlive ? "alive" : "joined");
        return writer;
    }

    public static MsgWriter captcha() {
        MsgWriter writer = new MsgWriter();
        writer.writeType(MessageType.RECAPTCHA);
        return writer;
    }

    public static MsgWriter popup(String msg, String type, int time) {
        MsgWriter writer = new MsgWriter();
        writer.writeType(MessageType.POPUPMSG);
        writer.writeString(msg);
        writer.writeString(type);
        writer.writeUInt8(time);
        return writer;
    }

    // public static MsgWriter leaderBoardPacket(Room room, GameClient player) {
    // List<GameClient> plrs = new ArrayList<>();
    // for (Map.Entry<WebSocket, GameClient> set : room.clients.entrySet()) {
    // WebSocket socket = set.getKey();
    // GameClient client = set.getValue();
    // }
    // Collections.sort(plrs, new Comparator<GameClient>() {
    // @Override
    // public int compare(GameClient o1, GameClient o2) {
    // return Integer.valueOf(o2.getXP()).compareTo(o1.getXP());
    // }
    // });
    // int a = -1;
    // int b = 0;
    // for (GameClient pl : plrs) {
    // b++;
    // if (pl == player)
    // a = b;
    // }
    // int ab = Math.min(plrs.size(), 10);
    // plrs = plrs.subList(0, ab);
    // if (a > ab && a != -1) {
    // plrs.remove(9);
    // plrs.add(player);
    // }
    // MsgWriter writer = new MsgWriter();
    // writer.writeType(MessageType.GAMESCOREUPDATE);
    // writer.writeUInt16(a); // own rank
    // int ownrank = a + 1;
    // ownrank--;
    // writer.writeUInt8(plrs.size()); // players in lb
    // a = 0;

    // if (player.stat != null) {
    // if (player.stat.rank > player.stat.topRank)
    // player.stat.topRank = (short) ownrank;
    // player.stat.rank = (short) ownrank;

    // if (player.stat.maxXP < player.getXP())
    // player.stat.maxXP = player.getXP();

    // }
    // for (GameClient pl : plrs) {
    // a++;
    // writer.writeUInt16(pl == player ? ownrank : a);
    // String name = "mope.io";
    // if (pl.getPlayer() != null)
    // name = pl.getPlayer().getPlayerName();
    // writer.writeString(name);
    // writer.writeUInt32(pl.getXP());
    // writer.writeString("white");
    // }
    // room.topplayer = plrs.size() > 0 ? plrs.get(0) : null;
    // return writer;
    // }

    public static MsgWriter personalGameEvent(int type, String msg) {
        MsgWriter writer = new MsgWriter();
        writer.writeType(MessageType.PERSONALGAMEEVENT);
        writer.writeUInt8(type);
        if (type == 255) {
            writer.writeString(msg != null ? msg : "message");
        }
        return writer;
    }

    public static MsgWriter promptReason(String msg) {
        MsgWriter writer = new MsgWriter();
        writer.writeType(MessageType.PROMPT);
        writer.writeString(msg);
        return writer;
    }

    // public static MsgWriter customInterface(Room room, BlackDragon ani, int type)
    // {
    // MsgWriter writer = new MsgWriter();
    // writer.writeType(MessageType.CUSTOMINTERFACE);
    // writer.writeUInt8(type);
    // if (type == 1) {
    // writer.writeUInt8(15);
    // writer.writeBoolean(ani.checkApex(46)); // bd
    // writer.writeBoolean(ani.checkApex(71)); // land
    // writer.writeBoolean(ani.checkApex(73)); // dino
    // writer.writeBoolean(ani.checkApex(70)); // sea
    // writer.writeBoolean(ani.checkApex(72)); // ice
    // writer.writeBoolean(ani.checkApex(95)); // scorp
    // writer.writeBoolean(ani.checkApex(68)); // phoenix
    // writer.writeBoolean(ani.checkApex(14)); // dragon
    // writer.writeBoolean(ani.checkApex(53)); // trex
    // writer.writeBoolean(ani.checkApex(24)); // kraken
    // writer.writeBoolean(ani.checkApex(61)); // king crab
    // writer.writeBoolean(ani.checkApex(32)); // yeti
    // writer.writeBoolean(ani.checkApex(96)); // pterodactyl
    // }
    // return writer;
    // }

    public static MsgWriter playerCountPacket(Room room) {
        MsgWriter writer = new MsgWriter();
        writer.writeType(MessageType.SERVERSTATSUPDATE);
        writer.writeUInt16((short) room.getOnline());
        return writer;
    }

    // public static MsgWriter changeAnimal(Animal animal, int type) {
    // MsgWriter writer = new MsgWriter();
    // writer.writeType(MessageType.ANIMALCHANGE);
    // writer.writeUInt8(animal.getInfo().getAnimalType());
    // writer.writeUInt8(animal.getInfo().getAnimalSpecies());
    // writer.writeUInt8(type);

    // // writer.writeUInt8(0); // tier
    // writer.writeUInt32(animal.getId());
    // writer.writeUInt32(animal.getClient().getNextXP()); // max xp

    // // eddible types
    // ArrayList<AnimalInfo> dangerTypes = new ArrayList<>();
    // ArrayList<AnimalInfo> edibleTypes = new ArrayList<>();
    // ArrayList<AnimalInfo> tailbiteTypes = new ArrayList<>();

    // for (AnimalInfo t : Animals.getAllAnimals()) {
    // if (t.isDanger(animal))
    // dangerTypes.add(t);
    // }

    // for (AnimalInfo t : Animals.getAllAnimals()) {
    // if (t.isEdible(animal))
    // edibleTypes.add(t);
    // }
    // for (AnimalInfo info : dangerTypes) {
    // if (info.isBiteable(animal))
    // tailbiteTypes.add(info);
    // }

    // writer.writeUInt8(dangerTypes.size()); // dangerAniTypes
    // for (AnimalInfo info : dangerTypes) {
    // writer.writeUInt8(info.getAnimalType());
    // }
    // writer.writeUInt8(edibleTypes.size()); // edible
    // for (AnimalInfo info : edibleTypes) {
    // writer.writeUInt8(info.getAnimalType());
    // }

    // writer.writeUInt8(tailbiteTypes.size()); // tailbite
    // for (AnimalInfo info : tailbiteTypes) {
    // writer.writeUInt8(info.getAnimalType());
    // }

    // int edibleObjTypes = 0;
    // if (animal.getInfo().getTier() > 0) {
    // edibleObjTypes += 2;
    // }
    // if (animal.getInfo().getTier() > 0 && !(animal instanceof Bee)) {
    // edibleObjTypes += 1;
    // }
    // if (animal.getInfo().getTier() >= 3) {
    // edibleObjTypes += 1;
    // }
    // if (animal.getInfo().getTier() >= 6) {
    // edibleObjTypes += 6;
    // }
    // if (animal.getInfo().getTier() >= 4) {
    // edibleObjTypes += 1;
    // }
    // if (animal.getInfo().getTier() >= 9) {
    // edibleObjTypes += 3;
    // }
    // if (animal.getInfo().getTier() >= 8) {
    // edibleObjTypes += 1;
    // }
    // if (animal.getInfo().getTier() >= 2) {
    // edibleObjTypes += 1;
    // }
    // if (animal.getInfo().getTier() <= 8) {
    // edibleObjTypes += 2;
    // }
    // if (animal.getInfo().getTier() >= 11) {
    // edibleObjTypes += 4;
    // }
    // if (animal.getInfo().getTier() >= 12) {
    // edibleObjTypes += 1;
    // }
    // if (animal.getBarType() == 0) {
    // edibleObjTypes += 1;
    // }
    // if (animal.getInfo().getTier() >= 3 && animal.getInfo().getTier() <= 9) {
    // edibleObjTypes += 1;
    // }
    // if (animal.getInfo().getTier() >= 1 && animal.getInfo().getTier() <= 9) {
    // edibleObjTypes += 1;
    // }
    // if (animal.getInfo().getTier() >= 7) {
    // edibleObjTypes += 3;
    // }
    // if (animal.getInfo().getTier() >= 5) {
    // edibleObjTypes += 2;
    // }
    // if (animal.getInfo().getTier() >= 3) {
    // edibleObjTypes += 1;
    // }
    // if (animal.getInfo().getTier() >= 10) {
    // edibleObjTypes += 1;
    // }
    // writer.writeUInt8(edibleObjTypes); // edibleObjTypes
    // if (edibleObjTypes > 0) {
    // if (animal.getInfo().getTier() > 0) {
    // writer.writeUInt8(52);
    // writer.writeUInt8(97);
    // }
    // if (animal.getInfo().getTier() > 0 && !(animal instanceof Bee)) {
    // writer.writeUInt8(69);
    // }
    // if (animal.getInfo().getTier() >= 6) {
    // writer.writeUInt8(53);
    // writer.writeUInt8(51);
    // writer.writeUInt8(24);
    // writer.writeUInt8(37);
    // writer.writeUInt8(36);
    // writer.writeUInt8(35);
    // }
    // if (animal.getInfo().getTier() >= 3) {
    // writer.writeUInt8(63);
    // }
    // if (animal.getInfo().getTier() >= 5) {
    // writer.writeUInt8(23);
    // writer.writeUInt8(60);
    // }
    // if (animal.getInfo().getTier() >= 4) {
    // writer.writeUInt8(22);
    // }
    // if (animal.getInfo().getTier() >= 9) {
    // writer.writeUInt8(29);
    // writer.writeUInt8(30);
    // writer.writeUInt8(39);
    // }
    // if (animal.getInfo().getTier() >= 8) {
    // writer.writeUInt8(95);
    // }
    // if (animal.getInfo().getTier() >= 2) {
    // writer.writeUInt8(49);
    // }
    // if (animal.getInfo().getTier() >= 3) {
    // writer.writeUInt8(31);
    // }
    // if (animal.getInfo().getTier() >= 7) {
    // writer.writeUInt8(25);
    // writer.writeUInt8(32);
    // writer.writeUInt8(48);
    // }
    // if (animal.getInfo().getTier() >= 12) {
    // writer.writeUInt8(82);
    // }
    // if (animal.getInfo().getTier() >= 10) {
    // writer.writeUInt8(68);
    // }
    // if (animal.getInfo().getTier() >= 1 && animal.getInfo().getTier() <= 9) {
    // writer.writeUInt8(90);
    // }
    // if (animal.getInfo().getTier() >= 3 && animal.getInfo().getTier() <= 9) {
    // writer.writeUInt8(93);
    // }
    // if (animal.getInfo().getTier() <= 8) {
    // writer.writeUInt8(20);
    // writer.writeUInt8(26);
    // }
    // if (animal.getInfo().getTier() >= 11) {
    // writer.writeUInt8(54);
    // writer.writeUInt8(50);
    // writer.writeUInt8(96);
    // writer.writeUInt8(38);
    // }
    // if (animal.getBarType() == 0) {
    // writer.writeUInt8(21);
    // }
    // }
    // return writer;
    // }

    public static MsgWriter rechargingAbility(boolean isDive, int time, Room room) {
        MsgWriter writer = new MsgWriter();
        writer.writeType(MessageType.PLAYERABILITY);
        writer.writeBoolean(isDive);
        writer.writeUInt8((int) Math.round(time * (10)));
        return writer;
    }

    public static MsgWriter createSelection(GameClient client, int msgKind, int timeout, int tier,
            List<AnimalInfo> animalInfoList) {
        MsgWriter writer = new MsgWriter();
        writer.writeType(MessageType.GAMESELECTANIMAL);

        writer.writeUInt8(msgKind);
        // msg kind 5 is close
        if (msgKind != 5) {
            client.setInUpgrade(true);
            client.setTier(tier);
            client.setUpgradeTimer(timeout);

            writer.writeUInt8(timeout);

            AnimalInfo[] animalInfoListFinish = animalInfoList.toArray(new AnimalInfo[animalInfoList.size()]);
            final int biome = client.getPlayer() != null ? client.getPlayer().getBiome() : 0;
            Arrays.sort(animalInfoListFinish, new Comparator<AnimalInfo>() {
                @Override
                public int compare(AnimalInfo o1, AnimalInfo o2) {
                    if (o1.getBiome() == biome && o2.getBiome() != biome) {
                        return -1;
                    } else if (o1.getBiome() != biome && o2.getBiome() == biome) {
                        return 1;
                    } else {
                        return o1.getBiome() - o2.getBiome();
                    }
                }
            });
            client.setSelectionList(Arrays.asList(animalInfoListFinish));
            writer.writeUInt8(animalInfoListFinish.length);

            for (AnimalInfo info : animalInfoListFinish) {
                writer.writeUInt8(info.getAnimalType());
                writer.writeUInt8(info.getBiome());
                writer.writeUInt8(info.getAnimalSpecies());
            }
        } else {
            client.setInUpgrade(false);
        }
        return writer;
    }

    public static MsgWriter deathPacket(int reason, String coins, double newxp) {
        MsgWriter writer = new MsgWriter();
        writer.writeType(MessageType.YOUDIED);
        writer.writeUInt8(reason);
        writer.writeUInt32((int) newxp);
        writer.writeString(coins);
        return writer;
    }

    public static MsgWriter changeAnimal(Animal animal, int type) {
        MsgWriter writer = new MsgWriter();
        writer.writeType(MessageType.ANIMALCHANGE);
        AnimalInfo info = animal.getInfo();
        writer.writeUInt8(info.getAnimalType());
        writer.writeUInt8(info.getAnimalSpecies());
        writer.writeUInt8(type);
        writer.writeUInt32(animal.getID());
        writer.writeUInt32(animal.getClient().getNextXP());

        ArrayList<AnimalInfo> dangerTypes = new ArrayList<>();
        ArrayList<AnimalInfo> edibleTypes = new ArrayList<>();
        ArrayList<AnimalInfo> tailbiteTypes = new ArrayList<>();

        for (AnimalInfo t : Animals.getAllAnimals()) {
            if (t.isDanger(animal))
                dangerTypes.add(t);
            if (t.isEdible(animal))
                edibleTypes.add(t);
        }

        for (AnimalInfo t : dangerTypes) {
            if (t.isBiteable(animal))
                tailbiteTypes.add(t);
        }

        writeList(writer, dangerTypes);
        writeList(writer, edibleTypes);
        writeList(writer, tailbiteTypes);

        int edibleObjTypes = calculateEdibleObjTypes(info, animal.getBar().type);
        writer.writeUInt8(edibleObjTypes);

        if (edibleObjTypes > 0) {
            writeEdibleObjTypes(writer, info, animal);
        }

        return writer;
    }

    private static void writeList(MsgWriter writer, ArrayList<AnimalInfo> list) {
        writer.writeUInt8(list.size());
        for (AnimalInfo info : list) {
            writer.writeUInt8(info.getAnimalType());
        }
    }

    private static int calculateEdibleObjTypes(AnimalInfo info, int barType) {
        int tier = info.getTier();
        int edibleObjTypes = 0;
        if (tier > 0)
            edibleObjTypes += 3;
        if (tier >= 2)
            edibleObjTypes += 2;
        if (tier >= 3)
            edibleObjTypes += 4;
        if (tier >= 4)
            edibleObjTypes += 1;
        if (tier >= 5)
            edibleObjTypes += 2;
        if (tier >= 6)
            edibleObjTypes += 6;
        if (tier >= 7)
            edibleObjTypes += 3;
        if (tier >= 8)
            edibleObjTypes += 3;
        if (tier >= 9)
            edibleObjTypes += 4;
        if (tier >= 10)
            edibleObjTypes += 1;
        if (tier >= 11)
            edibleObjTypes += 4;
        if (tier >= 12)
            edibleObjTypes += 1;
        if (barType == 0)
            edibleObjTypes += 1;
        return edibleObjTypes;
    }

    private static void writeEdibleObjTypes(MsgWriter writer, AnimalInfo info, Animal ani) {
        int tier = info.getTier();
        List<Integer> objTypes = new ArrayList<>();
        if (tier > 0)
            objTypes.addAll(Arrays.asList(52, 97, 69));
        if (tier >= 2)
            objTypes.add(49);
        if (tier >= 3)
            objTypes.addAll(Arrays.asList(63, 31, 93));
        if (tier >= 4)
            objTypes.add(22);
        if (tier >= 5)
            objTypes.addAll(Arrays.asList(23, 60));
        if (tier >= 6)
            objTypes.addAll(Arrays.asList(53, 51, 24, 37, 36, 35));
        if (tier >= 7)
            objTypes.addAll(Arrays.asList(25, 32, 48));
        if (tier >= 8)
            objTypes.addAll(Arrays.asList(95, 20, 26));
        if (tier >= 9)
            objTypes.addAll(Arrays.asList(29, 30, 39, 90));
        if (tier >= 10)
            objTypes.add(68);
        if (tier >= 11)
            objTypes.addAll(Arrays.asList(54, 50, 96, 38));
        if (tier >= 12)
            objTypes.add(82);
        if (ani.getBar().type == 0)
            objTypes.add(21);
        objTypes.forEach(writer::writeUInt8);
    }

}

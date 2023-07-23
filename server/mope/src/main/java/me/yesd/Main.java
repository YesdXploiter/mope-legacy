package me.yesd;

import me.yesd.Sockets.GameServer;
import me.yesd.World.Room;

public final class Main {

    private static final Room room = new Room();

    public static void main(String[] args) {
        System.setProperty("file.encoding", "UTF-8");
        room.start();
        GameServer gameServer = new GameServer(room);
        gameServer.start();
    }
}

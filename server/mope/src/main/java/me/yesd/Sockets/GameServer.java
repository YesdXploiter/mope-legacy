package me.yesd.Sockets;

import java.net.InetSocketAddress;
import java.nio.ByteBuffer;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import me.yesd.World.Room;
import me.yesd.World.Objects.Client.GameClient;

public class GameServer extends WebSocketServer {

    private Room room;

    public GameServer(Room room) {
        super(new InetSocketAddress("0.0.0.0", 2255));
        this.setReuseAddr(true);
        this.room = room;
    }

    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        GameClient client = new GameClient(conn, room);
        room.addClient(client);
        System.out.println("acc");
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        room.getClient(conn).onClose();
        room.removeClient(conn);
        System.out.println("deacc");
    }

    @Override
    public void onMessage(WebSocket conn, String message) {
        //
    }

    @Override
    public void onMessage(WebSocket conn, final ByteBuffer blob) {
        try {
            room.getClient(conn).onMessage(blob.array());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onError(WebSocket conn, Exception ex) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'onError'");
    }

    @Override
    public void onStart() {
        System.out.println("Started");
    }
}

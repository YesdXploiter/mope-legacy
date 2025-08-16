package me.yesd.Sockets;

import java.net.InetSocketAddress;
import java.nio.ByteBuffer;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.DefaultSSLWebSocketServerFactory;
import org.java_websocket.server.WebSocketServer;

import me.yesd.Constants;
import me.yesd.World.Room;
import me.yesd.World.Objects.Client.GameClient;

public class GameServer extends WebSocketServer {

    private Room room;

    public GameServer(Room room) {
        super(new InetSocketAddress("0.0.0.0", 2255));
        this.setReuseAddr(true);
        if (Constants.USINGSSL) {
            this.setWebSocketFactory(new DefaultSSLWebSocketServerFactory(SSL.getContext()));
        }
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
        ex.printStackTrace();
        if (conn != null) {
            try {
                conn.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public void onStart() {
        System.out.println("Started");
    }
}

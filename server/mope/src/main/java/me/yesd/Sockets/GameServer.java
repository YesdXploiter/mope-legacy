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
        GameClient client = room.getClient(conn);
        if (client != null) {
            client.onClose();
        } else {
            System.out.println("Client not found on close: " + conn);
        }
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
            GameClient client = room.getClient(conn);
            if (client != null) {
                client.onMessage(blob.array());
            } else {
                System.out.println("Client not found for message: " + conn);
            }
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

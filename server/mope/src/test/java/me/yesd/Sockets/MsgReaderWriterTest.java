package me.yesd.Sockets;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import me.yesd.Utilities.PacketException;

public class MsgReaderWriterTest {
    @Test
    void roundTripString() throws PacketException {
        String original = "Привет";
        MsgWriter writer = new MsgWriter();
        writer.writeString(original);
        MsgReader reader = new MsgReader(writer.getData());
        assertEquals(original, reader.readString());
    }
}

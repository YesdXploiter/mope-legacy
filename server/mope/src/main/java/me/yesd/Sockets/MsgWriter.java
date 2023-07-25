package me.yesd.Sockets;

import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.List;

import me.yesd.Utilities.MessageType;
import me.yesd.Utilities.Utilities;

public class MsgWriter {
    private List<java.lang.Byte> data;

    public MsgWriter() {
        this.data = new ArrayList<>();
    }

    private void writeByte(final byte byteData) {
        this.data.add(byteData);
    }

    public void writeUInt8(final int num) {
        writeByte((byte) num);
    }

    public void writeType(MessageType type) {
        writeUInt8(type.value());
    }

    public void writeBoolean(final boolean bool) {
        writeUInt8(bool ? 1 : 0);
    }

    private void writeBytes(final byte[] bytes) {
        for (byte b : bytes) {
            writeByte(b);
        }
    }

    public void writeUInt16(final short num) {
        writeBytes(ByteBuffer.allocate(2).putShort(num).array());
    }

    public void writeInt16(final short num) {
        writeBytes(ByteBuffer.allocate(2).putShort(num).array());
    }

    public void writeUInt16(final int snum) {
        writeUInt16((short) snum);
    }

    public void writeUInt32(final int num) {
        writeBytes(ByteBuffer.allocate(4).putInt(num).array());
    }

    public void writeFlags(final FlagWriter writer) {
        for (java.lang.Byte b : writer.getBytes()) {
            writeUInt8((int) b);
        }
    }

    public void writeString(String string) {
        string = Utilities.encode_utf8(string);
        writeUInt16((short) (string.length() + 1));

        for (int i = 0; i < string.length(); ++i) {
            writeByte((byte) string.charAt(i));
        }

        writeByte((byte) 109);
    }

    public byte[] getData() {
        byte[] ret = new byte[this.data.size()];
        for (int i = 0; i < this.data.size(); ++i) {
            ret[i] = this.data.get(i);
        }
        return ret;
    }
}
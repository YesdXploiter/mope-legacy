package me.yesd.Sockets;

import me.yesd.Utilities.PacketException;
import me.yesd.Utilities.Utilities;

public class MsgReader {
    private int offset;
    private byte[] data;

    public MsgReader(final byte[] data) {
        this.offset = 0;
        this.data = data;
    }

    public byte[] getData() {
        return this.data;
    }

    private void checkOffset(int size) throws PacketException {
        if (this.data.length <= this.offset + size - 1) {
            throw new PacketException("Failed to read UInt" + size * 8);
        }
    }

    public short readInt16() throws PacketException {
        checkOffset(2);
        final short ret = (short) (((this.data[this.offset] & 0xFF) << 8) + (this.data[this.offset + 1] & 0xFF));
        this.offset += 2;
        return ret;
    }

    public short readUInt16() throws PacketException {
        checkOffset(2);
        final int firstByte = 0xFF & this.data[this.offset];
        final int secondByte = 0xFF & this.data[this.offset + 1];
        this.offset += 2;
        return (short) (firstByte << 8 | secondByte);
    }

    public int readUInt32() throws PacketException {
        checkOffset(4);
        final int firstByte = 0xFF & this.data[this.offset];
        final int secondByte = 0xFF & this.data[this.offset + 1];
        final int thirdByte = 0xFF & this.data[this.offset + 2];
        final int fourthByte = 0xFF & this.data[this.offset + 3];
        this.offset += 4;
        return firstByte << 24 | secondByte << 16 | thirdByte << 8 | fourthByte;
    }

    public int readUInt8() throws PacketException {
        checkOffset(1);
        final int toReturn = this.data[this.offset] & 0xFF;
        ++this.offset;
        return toReturn;
    }

    public String readString() throws PacketException {
        StringBuilder sb = new StringBuilder();
        int length = this.readUInt16();
        for (int i = 0; i < length; ++i) {
            sb.append((char) this.readUInt8());
        }
        return Utilities.decode_utf8(sb.toString());
    }
}
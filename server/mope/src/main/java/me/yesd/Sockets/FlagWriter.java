package me.yesd.Sockets;

import java.util.ArrayList;
import java.util.List;

import me.yesd.Utilities.Utilities;

public class FlagWriter {
    public List<java.lang.Byte> bytes = new ArrayList<java.lang.Byte>();
    public int bitIndex = 1;
    public byte currentByte = 0;

    public void writeBool(boolean bit) {
        currentByte = Utilities.set_bit(currentByte, this.bitIndex, bit);
        this.bitIndex++;
        if (bitIndex >= 8) {

            bytes.add(currentByte);
            currentByte = 0;
            this.bitIndex = 1;

        }

    }

    public void writeBoolean(boolean bit) {
        this.writeBool(bit);
    }

    public void writeByteWithBitCount(int integer, int bits) {
        for (int i = 0; i < bits; i++) {
            this.writeBool(Utilities.get_bit((byte) integer, i));

        }
    }

    public List<java.lang.Byte> getBytes() {
        int size = this.bytes.size();
        if (size <= 0)
            this.bytes.add(currentByte);
        for (int i = 0; i < size; i++) {
            if (i != size - 1)
                bytes.set(i, Utilities.set_bit(bytes.get(i), 0, true));
        }

        return bytes;
    }

}
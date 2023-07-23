package me.yesd.Sockets;

import me.yesd.Utilities.Utilities;

public class Byte {
    private byte fByte;

    public Byte() {
        this.fByte = 0;
    }

    public void set_bit(int bit, boolean value) {
        fByte = Utilities.set_bit(fByte, bit, value);
    }

    public byte get() {
        return this.fByte;
    }
}

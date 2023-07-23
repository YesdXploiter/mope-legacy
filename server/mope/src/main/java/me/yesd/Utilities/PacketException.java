package me.yesd.Utilities;

public class PacketException extends Throwable {
    static final long serialVersionUID = -3387516993124229948L;

    public PacketException() {
        super();
    }

    public PacketException(String message) {
        super(message);
    }

    public PacketException(String message, Throwable cause) {
        super(message, cause);
    }

    public PacketException(Throwable cause) {
        super(cause);
    }

    protected PacketException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}

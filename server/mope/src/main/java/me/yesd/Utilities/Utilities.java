package me.yesd.Utilities;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.security.SecureRandom;
import java.text.CharacterIterator;
import java.text.StringCharacterIterator;
import java.util.concurrent.ThreadLocalRandom;

import org.apache.commons.text.StringEscapeUtils;

public class Utilities {
    static final String AB = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    static SecureRandom rnd = new SecureRandom();

    public static boolean isValidDouble(double d) {
        if (!Double.isNaN(d) && !Double.isInfinite(d))
            return true;
        return false;
    }

    public static int parseInt(String str) {
        int res = 0;
        try {
            res = Integer.parseInt(str);
        } catch (NumberFormatException e) {
            return 0;
        }
        return res;
    }

    public static double seedAngle(long seed) {
        return (double) (seed % 360);
    }

    public static String humanReadableByteCountSI(long bytes) {
        if (-1000 < bytes && bytes < 1000) {
            return bytes + " B";
        }
        CharacterIterator ci = new StringCharacterIterator("kMGTPE");
        while (bytes <= -999_950 || bytes >= 999_950) {
            bytes /= 1000;
            ci.next();
        }
        return String.format("%.1f %cB", bytes / 1000.0, ci.current());
    }

    public static boolean randomBoolean() {
        return Math.random() < 0.5;
    }

    public static String randomString(int len) {
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++)
            sb.append(AB.charAt(rnd.nextInt(AB.length())));
        return sb.toString();
    }

    public static double randomDouble(double min, double max) {
        return ThreadLocalRandom.current().nextDouble(min, max);
    }

    public static double calculateValue(double percentage, double minValue, double maxValue) {
        if (percentage < 0 || percentage > 100) {
            return 0;
        }
        double range = maxValue - minValue;
        return (percentage / 100.0) * range + minValue;
    }

    public static double calculatePercentage(double currentValue, double minValue, double maxValue) {
        if (currentValue < minValue) {
            return 0;
        }

        if (currentValue > maxValue) {
            return 100;
        }

        double range = maxValue - minValue;
        double valueFromMin = currentValue - minValue;

        return (valueFromMin / range) * 100.0;
    }

    public static int randomInt(int min, int max) {
        if (max <= min)
            return min;
        return ThreadLocalRandom.current().nextInt(min, max + 1);
    }

    public static String encode_utf8(final String string) {
        return encodeURIComponent(string);
    }

    public static boolean toBool(String a) {
        return Boolean.parseBoolean(a);
    }

    public static boolean toBool(int a) {
        return a == 1;
    }

    public static int toInt(String a) {
        int val;
        try {
            val = Integer.parseInt(a);
        } catch (NumberFormatException e) {
            val = 0;
        }
        return val;
    }

    public static double toDouble(String a) {
        double val;
        try {
            val = Double.parseDouble(a);
        } catch (NumberFormatException e) {
            val = 0;
        }
        return val;
    }

    public static String decode_utf8(final String string) {
        return decodeURIComponent(string);
    }

    public static String decodeURIComponent(final String string) {
        try {
            return URLDecoder.decode(string, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return null;
        }
    }

    public static String getReadableTime(Long nanos) {
        long tempSec = nanos / (1000 * 1000 * 1000);
        long sec = tempSec % 60;
        long min = (tempSec / 60) % 60;
        long hour = (tempSec / (60 * 60)) % 24;
        long day = (tempSec / (24 * 60 * 60)) % 24;

        return String.format("%dd %dh %dm %ds", day, hour, min, sec);
    }

    public static String encodeURIComponent(String s) {
        String result = null;

        try {
            result = URLEncoder.encode(s, "UTF-8")
                    .replaceAll("\\+", "%20")
                    .replaceAll("\\%21", "!")
                    .replaceAll("\\%27", "'")
                    .replaceAll("\\%28", "(")
                    .replaceAll("\\%29", ")")
                    .replaceAll("\\%7E", "~");
        } catch (UnsupportedEncodingException e) {
            result = s;
        }

        return result;
    }

    public static String escape(final String string) {
        return StringEscapeUtils.escapeEcmaScript(string);
    }

    public static String unescape(final String string) {
        return StringEscapeUtils.unescapeEcmaScript(string);
    }

    public static boolean methodExists(Class clazz, String method) {
        boolean result = false;
        try {
            clazz.getMethod(method);
            result = true;
        } catch (NoSuchMethodException e) {
            // method doesnt exist!
        }
        return result;
    }

    public static double distance(double x1, double x2, double y1, double y2) {
        double a = x1 - x2;
        double b = y1 - y2;
        return Math.sqrt(a * a + b * b);
    }

    public static double lerp(double start, double end, double t) {
        return start * (1 - t) + end * t;
    }

    public static double constrain(double n, double low, double high) {
        return Math.max(Math.min(n, high), low);
    }

    public static double normalize(double n, double min, double max) {
        return (n - min) / (max - min);
    }

    public static boolean isNumeric(String strNum) {
        if (strNum == null) {
            return false;
        }
        try {
            Double.parseDouble(strNum);
        } catch (NumberFormatException nfe) {
            return false;
        }
        return true;
    }

    public static double smooth(double t) {
        return 1f - Math.cos(t * Math.PI * 0.5f);

    }

    public static byte set_bit(byte num, int bit, boolean value) {
        if (value)
            return (byte) (num | 1 << bit);
        else
            return (byte) (num & ~(1 << bit));

    }

    public static boolean get_bit(byte num, int bit) {
        return ((num >> bit) % 2 != 0);
    }
}

package me.yesd.Utilities;

import java.util.Random;

public class PerlinNoise {

    private static final int[] p = new int[256];

    static {
        Random rand = new Random();
        for (int i = 0; i < 256; i++) {
            p[i] = rand.nextInt(256);
        }
        for (int i = 0; i < 256; i++) {
            int j = rand.nextInt(256);
            int temp = p[i];
            p[i] = p[j];
            p[j] = temp;
        }
    }

    public static double noise(double x, double y) {
        int X = (int) Math.floor(x) & 255;
        int Y = (int) Math.floor(y) & 255;
        x -= Math.floor(x);
        y -= Math.floor(y);
        double u = fade(x);
        double v = fade(y);
        int A = p[X] + Y;
        int AA = p[A & 255];
        int AB = p[(A + 1) & 255];
        int B = p[(X + 1) & 255] + Y;
        int BA = p[B & 255];
        int BB = p[(B + 1) & 255];
        return lerp(v, lerp(u, grad(p[AA], x, y), grad(p[BA], x - 1, y)),
                lerp(u, grad(p[AB], x, y - 1), grad(p[BB], x - 1, y - 1)));
    }

    private static double fade(double t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    private static double lerp(double t, double a, double b) {
        return a + t * (b - a);
    }

    private static double grad(int hash, double x, double y) {
        int h = hash & 3;
        double u = h < 2 ? x : y;
        double v = h < 1 ? y : x;
        return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
    }
}
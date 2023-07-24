package me.yesd.World.Objects.Animals;

public class Bar {
    public int value = 100;
    public int max = 100;
    public int type;

    public Bar(int type) {
        this.type = type;
    }

    public Bar(int type, int max) {
        this.type = type;
        this.max = max;
        this.value = max;
    }

    public int getValue() {
        return value;
    }

    public int getPercentage() {
        return (value / max) * 100;
    }

    public void addBarValue(int amount) {
        this.value += amount;
        if (this.value > this.max) this.value = this.max;
        if (this.value < 0) this.value = 0;
    }
}

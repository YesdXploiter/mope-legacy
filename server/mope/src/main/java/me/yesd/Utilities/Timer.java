package me.yesd.Utilities;

public class Timer {
    public boolean isRunning = false;
    public long tim = 0;
    private long maxtim = 0;

    public Timer(int t) {
        this.tim = t;
        this.maxtim = t;
        this.isRunning = true;
    }

    public void update(int ticks) {
        if (this.isRunning)
            this.tim -= (1000 / ticks);
        if (this.tim < 1)
            this.isRunning = false;
    }

    public boolean isDone() {
        return !this.isRunning;
    }

    public void setMaximumTime(int t) {
        this.maxtim = t;
    }

    public long getMaximumTime() {
        return this.maxtim;
    }

    public void reset() {
        this.isRunning = true;
        this.tim = this.maxtim;
    }
}
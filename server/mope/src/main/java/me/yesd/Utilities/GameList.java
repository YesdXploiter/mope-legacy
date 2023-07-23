package me.yesd.Utilities;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

import me.yesd.World.Objects.GameObject;

public class GameList implements Iterable<GameObject> {
    public ConcurrentHashMap<Integer, GameObject> gameMap;

    public GameList(final GameList copy) {
        this.gameMap = new ConcurrentHashMap<Integer, GameObject>();
        this.gameMap = new ConcurrentHashMap<Integer, GameObject>(copy.gameMap);
    }

    public List<GameObject> subList(int startIndex, int endIndex) {
        List<GameObject> list = new ArrayList<>();
        if (endIndex > gameMap.size())
            endIndex = gameMap.size();
        for (int i = startIndex; i < endIndex; i++) {
            list.add(gameMap.get(i));
        }
        return list;
    }

    public List<GameObject> toList() {
        List<GameObject> list = new ArrayList<>();
        for (GameObject o : this) {
            list.add(o);
        }
        return list;
    }

    public GameList() {
        this.gameMap = new ConcurrentHashMap<Integer, GameObject>();
    }

    public Object get(final int id) {
        return this.gameMap.get(id);
    }

    public void add(final GameObject object) {
        this.gameMap.put(object.getID(), object);
    }

    public void add(final int id, final GameObject object) {
        this.gameMap.put(object.getID(), object);
    }

    public void remove(final GameObject object) {
        this.gameMap.remove(object.getID(), object);
    }

    @Override
    public Iterator<GameObject> iterator() {
        return this.gameMap.values().iterator();
    }

    public int size() {
        return this.gameMap.size();
    }
}

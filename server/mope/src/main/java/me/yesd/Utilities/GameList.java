package me.yesd.Utilities;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import me.yesd.World.Objects.GameObject;

public class GameList implements Iterable<GameObject> {
    private final HashMap<Integer, GameObject> gameMap;

    public GameList(final GameList copy) {
        this.gameMap = new HashMap<Integer, GameObject>(copy.gameMap);
    }

    public List<GameObject> subList(int startIndex, int endIndex) {
        List<GameObject> values = new ArrayList<>(gameMap.values());
        int from = Math.max(0, startIndex);
        int to = Math.min(endIndex, values.size());
        if (from > to) {
            return new ArrayList<>();
        }
        return new ArrayList<>(values.subList(from, to));
    }

    public List<GameObject> toList() {
        List<GameObject> list = new ArrayList<>();
        for (GameObject o : this) {
            list.add(o);
        }
        return list;
    }

    public GameList() {
        this.gameMap = new HashMap<Integer, GameObject>();
    }

    public GameObject get(final int id) {
        return this.gameMap.get(id);
    }

    public void add(final GameObject object) {
        this.gameMap.put(object.getID(), object);
    }

    public void add(final int id, final GameObject object) {
        this.gameMap.put(id, object);
    }

    public void remove(final GameObject object) {
        this.gameMap.remove(object.getID(), object);
    }

    public Map<Integer, GameObject> getGameMap() {
        return this.gameMap;
    }

    @Override
    public Iterator<GameObject> iterator() {
        return this.gameMap.values().iterator();
    }

    public int size() {
        return this.gameMap.size();
    }
}

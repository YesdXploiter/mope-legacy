package me.yesd.World.Collision.QuadTree;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.locks.ReentrantReadWriteLock;

import me.yesd.World.Objects.GameObject;

public class QuadTree {
    private int MAX_OBJECTS = 5;
    private int MAX_LEVELS = 10;

    private int level;
    private final List<GameObject> objects;
    private final Rectangle bounds;
    private final QuadTree[] nodes;
    private final ReentrantReadWriteLock lock = new ReentrantReadWriteLock();

    public QuadTree(int pLevel, Rectangle pBounds) {
        level = pLevel;
        objects = new ArrayList<GameObject>();
        bounds = pBounds;
        nodes = new QuadTree[4];
    }

    public void clear() {
        lock.writeLock().lock();
        try {
            objects.clear();

            for (int i = 0; i < nodes.length; i++) {
                if (nodes[i] != null) {
                    nodes[i].clear();
                    nodes[i] = null;
                }
            }
        } finally {
            lock.writeLock().unlock();
        }
    }

    // Split the node into 4 subnodes
    private void split() {
        int subWidth = bounds.getWidth() / 2;
        int subHeight = bounds.getHeight() / 2;
        int x = bounds.getX();
        int y = bounds.getY();

        nodes[0] = new QuadTree(level + 1, new Rectangle(x + subWidth, y, subWidth, subHeight));
        nodes[1] = new QuadTree(level + 1, new Rectangle(x, y, subWidth, subHeight));
        nodes[2] = new QuadTree(level + 1, new Rectangle(x, y + subHeight, subWidth, subHeight));
        nodes[3] = new QuadTree(level + 1, new Rectangle(x + subWidth, y + subHeight, subWidth, subHeight));
    }

    // Determine which node the object belongs to.
    private ArrayList<Integer> getIndex(GameObject circle) {
        ArrayList<Integer> index = new ArrayList<>();
        double verticalMidpoint = bounds.getX() + (bounds.getWidth());
        double horizontalMidpoint = bounds.getY() + (bounds.getHeight());

        // Object can completely fit within the top quadrants
        boolean topQuadrant = (circle.getY() < horizontalMidpoint
                && circle.getY() + circle.getRadius() < horizontalMidpoint);
        // Object can completely fit within the bottom quadrants
        boolean bottomQuadrant = (circle.getY() > horizontalMidpoint
                && circle.getY() - circle.getRadius() > horizontalMidpoint);

        // Object can completely fit within the left quadrants
        if (circle.getX() < verticalMidpoint && circle.getX() + circle.getRadius() < verticalMidpoint) {
            if (topQuadrant) {
                index.add(1);
            } else if (bottomQuadrant) {
                index.add(2);
            }
            // Object can completely fit within the right quadrants
        } else if (circle.getX() > verticalMidpoint && circle.getX() - circle.getRadius() < verticalMidpoint) {
            if (topQuadrant) {
                index.add(0);
            } else if (bottomQuadrant) {
                index.add(3);
            }
        }

        return index;
    }

    // Insert the object
    public void insert(GameObject circle) {
        lock.writeLock().lock();
        try {
            if (nodes[0] != null) {
                ArrayList<Integer> index = getIndex(circle);

                if (index.size() > 0) {
                    for (Integer ind : index) {
                        if (nodes[ind].bounds.contains(circle)) {
                            QuadTree child = nodes[ind];
                            lock.writeLock().unlock();
                            child.insert(circle);
                            return;
                        }
                    }
                }
            }

            objects.add(circle);

            if (objects.size() > MAX_OBJECTS && level < MAX_LEVELS) {
                if (nodes[0] == null) {
                    split();
                }

                int i = 0;
                while (i < objects.size()) {
                    ArrayList<Integer> index = getIndex(objects.get(i));
                    if (index.size() > 0) {
                        GameObject obj = objects.remove(i);
                        for (Integer ind : index) {
                            if (nodes[ind].bounds.contains(obj)) {
                                QuadTree child = nodes[ind];
                                lock.writeLock().unlock();
                                child.insert(obj);
                                lock.writeLock().lock();
                            }
                        }
                    } else {
                        i++;
                    }
                }
            }
        } finally {
            if (lock.writeLock().isHeldByCurrentThread()) {
                lock.writeLock().unlock();
            }
        }
    }

    public List<GameObject> retrieve(List<GameObject> returnObjects, GameObject circle) {
        lock.readLock().lock();
        try {
            ArrayList<Integer> index = getIndex(circle);
            if (index.size() > 0 && nodes[0] != null) {
                for (Integer ind : index) {
                    if (nodes[ind].bounds.contains(circle)) {
                        QuadTree child = nodes[ind];
                        lock.readLock().unlock();
                        child.retrieve(returnObjects, circle);
                        lock.readLock().lock();
                    }
                }
            }

            returnObjects.addAll(objects);
        } finally {
            lock.readLock().unlock();
        }

        return returnObjects;
    }

    public QuadTree[] getNodes() {
        return nodes;
    }

    public List<GameObject> getObjects() {
        return objects;
    }

}
package me.yesd.World.Collision.QuadTree;

import java.util.ArrayList;
import java.util.List;

import me.yesd.World.Objects.GameObject;

public class QuadTree {
    private int MAX_OBJECTS = 5;
    private int MAX_LEVELS = 10;

    private int level;
    private List<GameObject> objects;
    private Rectangle bounds;
    private QuadTree[] nodes;

    public QuadTree(int pLevel, Rectangle pBounds) {
        level = pLevel;
        objects = new ArrayList<GameObject>();
        bounds = pBounds;
        nodes = new QuadTree[4];
    }

    public void clear() {
        objects.clear();

        for (int i = 0; i < nodes.length; i++) {
            if (nodes[i] != null) {
                nodes[i].clear();
                nodes[i] = null;
            }
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
    private int getIndex(GameObject circle) {
        int index = -1;
        double verticalMidpoint = bounds.getX() + (bounds.getWidth() / 2);
        double horizontalMidpoint = bounds.getY() + (bounds.getHeight() / 2);

        // Object can completely fit within the top quadrants
        boolean topQuadrant = (circle.getY() < horizontalMidpoint
                && circle.getY() + circle.getRadius() < horizontalMidpoint);
        // Object can completely fit within the bottom quadrants
        boolean bottomQuadrant = (circle.getY() > horizontalMidpoint);

        // Object can completely fit within the left quadrants
        if (circle.getX() < verticalMidpoint && circle.getX() + circle.getRadius() < verticalMidpoint) {
            if (topQuadrant) {
                index = 1;
            } else if (bottomQuadrant) {
                index = 2;
            }
            // Object can completely fit within the right quadrants
        } else if (circle.getX() > verticalMidpoint) {
            if (topQuadrant) {
                index = 0;
            } else if (bottomQuadrant) {
                index = 3;
            }
        }

        return index;
    }

    // Insert the object
    public void insert(GameObject circle) {
        if (nodes[0] != null) {
            int index = getIndex(circle);

            if (index != -1) {
                nodes[index].insert(circle);
                return;
            }
        }

        objects.add(circle);

        if (objects.size() > MAX_OBJECTS && level < MAX_LEVELS) {
            if (nodes[0] == null) {
                split();
            }

            int i = 0;
            while (i < objects.size()) {
                int index = getIndex(objects.get(i));
                if (index != -1) {
                    nodes[index].insert(objects.remove(i));
                } else {
                    i++;
                }
            }
        }
    }

    // Return all objects that could collide with the given object
    public List<GameObject> retrieve(List<GameObject> returnObjects, GameObject circle) {
        int index = getIndex(circle);
        if (index != -1 && nodes[0] != null) {
            nodes[index].retrieve(returnObjects, circle);
        }

        returnObjects.addAll(objects);

        return returnObjects;
    }
}
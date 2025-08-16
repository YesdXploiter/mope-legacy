package me.yesd.World.Collision;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.RecursiveTask;

import me.yesd.Constants;
import me.yesd.World.Room;
import me.yesd.World.Collision.QuadTree.QuadTree;
import me.yesd.World.Collision.QuadTree.Rectangle;
import me.yesd.World.Objects.GameObject;

public class Collision {

    private Room room;
    private QuadTree tree;

    public Collision(Room room) {
        this.room = room;
        this.tree = new QuadTree(0, new Rectangle(0, 0, Constants.WIDTH, Constants.HEIGHT));
    }

    public void update() {
        tree.clear();

        HashMap<Integer, GameObject> objects = new HashMap<>(room.getObjects().gameMap);
        for (GameObject o : objects.values()) {
            tree.insert(o);
        }

        ForkJoinPool pool = ForkJoinPool.commonPool();
        List<CollisionPair> collisions = pool.invoke(new CollisionTask(tree));

        for (CollisionPair pair : collisions) {
            impulseCollision(pair.a, pair.b);
        }
    }

    private class CollisionTask extends RecursiveTask<List<CollisionPair>> {
        private final QuadTree node;

        CollisionTask(QuadTree node) {
            this.node = node;
        }

        @Override
        protected List<CollisionPair> compute() {
            List<CollisionPair> result = new ArrayList<>();
            QuadTree[] children = node.getNodes();
            List<CollisionTask> tasks = new ArrayList<>();

            for (QuadTree child : children) {
                if (child != null) {
                    CollisionTask task = new CollisionTask(child);
                    task.fork();
                    tasks.add(task);
                }
            }

            for (CollisionTask task : tasks) {
                result.addAll(task.join());
            }

            for (GameObject o : node.getObjects()) {
                List<GameObject> returnObjects = new ArrayList<>();
                tree.retrieve(returnObjects, o);
                o.update();

                for (GameObject obj : returnObjects) {
                    if (obj.isSolid() && o.isSolid() && o.isCircle() && obj.isCircle()) {
                        result.add(new CollisionPair(o, obj));
                    }
                }
            }
            return result;
        }
    }

    private static class CollisionPair {
        final GameObject a;
        final GameObject b;

        CollisionPair(GameObject a, GameObject b) {
            this.a = a;
            this.b = b;
        }
    }

    private static void impulseCollision(GameObject obj1, GameObject obj2) {
        double dx = obj2.getX() - obj1.getX();
        double dy = obj2.getY() - obj1.getY();
        double distance = Math.sqrt(dx * dx + dy * dy);

        // Check collision
        if (distance < obj1.getRadius() + obj2.getRadius()) {
            // Calculate angle and displacement
            double angle = Math.atan2(dy, dx);
            double overlap = obj1.getRadius() + obj2.getRadius() - distance;

            // Calculate displacement vectors
            double displacementX = overlap * Math.cos(angle);
            double displacementY = overlap * Math.sin(angle);

            // Displace objects
            if (obj1.isMovable() && obj2.isMovable()) {
                double totalMass = obj1.getMass() + obj2.getMass();
                double obj1Ratio = obj2.getMass() / totalMass;
                double obj2Ratio = obj1.getMass() / totalMass;

                obj1.setPosition(obj1.getX() - displacementX * obj1Ratio, obj1.getY() - displacementY * obj1Ratio);
                obj2.setPosition(obj2.getX() + displacementX * obj2Ratio, obj2.getY() + displacementY * obj2Ratio);
            } else if (obj1.isMovable()) {
                obj1.setPosition(obj1.getX() - displacementX, obj1.getY() - displacementY);
            } else if (obj2.isMovable()) {
                obj2.setPosition(obj2.getX() + displacementX, obj2.getY() + displacementY);
            }
        }
    }

    public static void HillsCollision(GameObject obj1, GameObject obj2) {
        double dx = obj2.getX() - obj1.getX();
        double dy = obj2.getY() - obj1.getY();
        double distance = Math.sqrt(dx * dx + dy * dy);

        // Проверка столкновения
        if (distance < (obj1.getRadius() + obj2.getRadius())) {
            // Расчет угла и смещения
            double angle = Math.atan2(dy, dx);
            double minTranslationDistance = obj1.getRadius() * 1.5 + obj2.getRadius() * 1.5 - distance;

            // Смещение объектов
            if (obj1.isMovable() && obj2.isMovable()) {
                obj1.setPosition(obj1.getX() - minTranslationDistance * Math.cos(angle),
                        obj1.getY() - minTranslationDistance * Math.sin(angle));
                obj2.setPosition(obj2.getX() + minTranslationDistance * Math.cos(angle),
                        obj2.getY() + minTranslationDistance * Math.sin(angle));
            } else if (obj1.isMovable()) {
                obj1.setPosition(obj1.getX() - minTranslationDistance * Math.cos(angle),
                        obj1.getY() - minTranslationDistance * Math.sin(angle));
            } else if (obj2.isMovable()) {
                obj2.setPosition(obj2.getX() + minTranslationDistance * Math.cos(angle),
                        obj2.getY() + minTranslationDistance * Math.sin(angle));
            }
        } /*
           * else if(distance > (obj1.getRadius() + obj2.getRadius()) && distance >
           * (obj1.getRadius() * 2 + obj2.getRadius() * 2) && obj2.getType() == 3) {
           * Room.objects.remove(obj2);
           * }
           */
    }
}

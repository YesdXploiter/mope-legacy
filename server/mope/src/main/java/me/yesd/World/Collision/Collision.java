package me.yesd.World.Collision;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

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
        // Import objects
        tree.clear();

        HashMap<Integer, GameObject> objects = new HashMap<Integer, GameObject>(room.getObjects().gameMap);
        Set<Map.Entry<Integer, GameObject>> objectsSet = objects.entrySet();
        Iterator<Map.Entry<Integer, GameObject>> objectsIterator = objectsSet.iterator();

        while (objectsIterator.hasNext()) {
            Map.Entry<Integer, GameObject> entry = objectsIterator.next();
            GameObject o = entry.getValue();
            tree.insert(o);
        }

        // Calculate
        Iterator<Map.Entry<Integer, GameObject>> objectsIterator2 = objectsSet.iterator();
        while (objectsIterator2.hasNext()) {
            Map.Entry<Integer, GameObject> entry = objectsIterator2.next();
            GameObject o = entry.getValue();
            List<GameObject> returnObjects = new ArrayList<>();
            tree.retrieve(returnObjects, o);
            o.update();

            for (GameObject obj : returnObjects) {
                if (obj.isSolid() && o.isSolid() && o.isCircle() && obj.isCircle()) {
                    impulseCollision(o, obj);
                }
            }
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

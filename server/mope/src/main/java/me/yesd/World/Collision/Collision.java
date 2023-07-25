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
                collision(o, obj);
            }
        }
    }

    public static void collision(GameObject obj1, GameObject obj2) {
        double dx = obj2.getX() - obj1.getX();
        double dy = obj2.getY() - obj1.getY();
        double distance = Math.sqrt(dx * dx + dy * dy);

        // Проверка столкновения
        if (distance < obj1.getRadius() + obj2.getRadius()) {
            // Расчет угла и минимального смещения
            double angle = Math.atan2(dy, dx);
            double minTranslationDistance = obj1.getRadius() + obj2.getRadius() - distance;

            // Если оба объекта могут двигаться, смещаем каждый на половину расстояния
            if (obj1.isMovable() && obj2.isMovable()) {
                obj1.setPosition(obj1.getX() - (minTranslationDistance / 2) * Math.cos(angle),
                        obj1.getY() - (minTranslationDistance / 2) * Math.sin(angle));
                obj2.setPosition(obj2.getX() + (minTranslationDistance / 2) * Math.cos(angle),
                        obj2.getY() + (minTranslationDistance / 2) * Math.sin(angle));
            }
            // Иначе, смещаем только движущийся объект на полное расстояние
            else if (obj1.isMovable()) {
                obj1.setPosition(obj1.getX() - minTranslationDistance * Math.cos(angle),
                        obj1.getY() - minTranslationDistance * Math.sin(angle));
            } else if (obj2.isMovable()) {
                obj2.setPosition(obj2.getX() + minTranslationDistance * Math.cos(angle),
                        obj2.getY() + minTranslationDistance * Math.sin(angle));
            }
        }
    }
}

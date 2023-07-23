package me.yesd.World.Objects.Animals;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.ArrayList;

import me.yesd.Utilities.BiomeType;

public class Animals {
    // hacky way?
    public static AnimalInfo BlackDragon = new AnimalInfo(AnimalType.BLACKDRAGON, BiomeType.VOLCANO, 17, 30);
    public static AnimalInfo Mouse = new AnimalInfo(AnimalType.MOUSE, BiomeType.LAND, 1);
    public static AnimalInfo Rabbit = new AnimalInfo(AnimalType.RABBIT, BiomeType.LAND, 2, 1);
    public static AnimalInfo Pig = new AnimalInfo(AnimalType.PIG, BiomeType.LAND, 4);
    public static AnimalInfo Fox = new AnimalInfo(AnimalType.FOX, BiomeType.LAND, 6);
    public static AnimalInfo Deer = new AnimalInfo(AnimalType.DEER, BiomeType.LAND, 5);
    public static AnimalInfo Mole = new AnimalInfo(AnimalType.MOLE, BiomeType.LAND, 3);
    public static AnimalInfo Zebra = new AnimalInfo(AnimalType.ZEBRA, BiomeType.LAND, 7);
    public static AnimalInfo Lion = new AnimalInfo(AnimalType.LION, BiomeType.LAND, 13, 11);
    public static AnimalInfo Cheetah = new AnimalInfo(AnimalType.BIGCAT, BiomeType.LAND, 9, 15);
    public static AnimalInfo Bear = new AnimalInfo(AnimalType.BEAR, BiomeType.LAND, 10);
    public static AnimalInfo Crocodile = new AnimalInfo(AnimalType.CROC, BiomeType.LAND, 11);
    public static AnimalInfo Rhino = new AnimalInfo(AnimalType.RHINO, BiomeType.LAND, 12, 9);
    public static AnimalInfo Hippo = new AnimalInfo(AnimalType.HIPPO, BiomeType.LAND, 13, 18);
    public static AnimalInfo Dragon = new AnimalInfo(AnimalType.DRAGON, BiomeType.LAND, 15, 19);
    public static AnimalInfo Shrimp = new AnimalInfo(AnimalType.SHRIMP, BiomeType.OCEAN, 1);
    public static AnimalInfo Trout = new AnimalInfo(AnimalType.TROUT, BiomeType.OCEAN, 2);
    public static AnimalInfo Crab = new AnimalInfo(AnimalType.CRAB, BiomeType.OCEAN, 3);
    public static AnimalInfo Squid = new AnimalInfo(AnimalType.SQUID, BiomeType.OCEAN, 5);
    public static AnimalInfo Shark = new AnimalInfo(AnimalType.SHARK, BiomeType.OCEAN, 12);
    public static AnimalInfo Stingray = new AnimalInfo(AnimalType.STINGRAY, BiomeType.OCEAN, 8);
    public static AnimalInfo Turtle = new AnimalInfo(AnimalType.TURTLE, BiomeType.OCEAN, 7, 2);
    public static AnimalInfo SeaHorse = new AnimalInfo(AnimalType.SEAHORSE, BiomeType.OCEAN, 4);
    public static AnimalInfo JellyFish = new AnimalInfo(AnimalType.JELLYFISH, BiomeType.OCEAN, 6);
    public static AnimalInfo Kraken = new AnimalInfo(AnimalType.KRAKEN, BiomeType.OCEAN, 15, 5);
    public static AnimalInfo PufferFish = new AnimalInfo(AnimalType.PUFFERFISH, BiomeType.OCEAN, 9);
    public static AnimalInfo KillerWhale = new AnimalInfo(AnimalType.KILLERWHALE, BiomeType.OCEAN, 13, 28);
    public static AnimalInfo SwordFish = new AnimalInfo(AnimalType.SWORDFISH, BiomeType.OCEAN, 10);
    public static AnimalInfo Gorilla = new AnimalInfo(AnimalType.GORILLA, BiomeType.LAND, 9, 24);
    public static AnimalInfo Octopus = new AnimalInfo(AnimalType.OCTOPUS, BiomeType.OCEAN, 11);
    public static AnimalInfo Wolf = new AnimalInfo(AnimalType.WOLF, BiomeType.ARCTIC, 10);
    public static AnimalInfo ArcticHare = new AnimalInfo(AnimalType.ARCTICHARE, BiomeType.ARCTIC, 2);
    public static AnimalInfo Yeti = new AnimalInfo(AnimalType.YETI, BiomeType.ARCTIC, 15, 11);
    public static AnimalInfo Chipmunk = new AnimalInfo(AnimalType.CHIPMUNK, BiomeType.ARCTIC, 1);
    public static AnimalInfo Muskox = new AnimalInfo(AnimalType.MUSKOX, BiomeType.ARCTIC, 7);
    public static AnimalInfo Penguin = new AnimalInfo(AnimalType.PENGUIN, BiomeType.ARCTIC, 3);
    public static AnimalInfo PolarBear = new AnimalInfo(AnimalType.POLARBEAR, BiomeType.ARCTIC, 11);
    public static AnimalInfo Seal = new AnimalInfo(AnimalType.SEAL, BiomeType.ARCTIC, 4);
    public static AnimalInfo SnowLeopard = new AnimalInfo(AnimalType.SNOWLEOPARD, BiomeType.ARCTIC, 9);
    public static AnimalInfo Walrus = new AnimalInfo(AnimalType.WALRUS, BiomeType.ARCTIC, 8);
    public static AnimalInfo Reindeer = new AnimalInfo(AnimalType.REINDEER, BiomeType.ARCTIC, 5);
    public static AnimalInfo ArcticFox = new AnimalInfo(AnimalType.ARCTICFOX, BiomeType.ARCTIC, 6);
    public static AnimalInfo Wolverine = new AnimalInfo(AnimalType.WOLVERINE, BiomeType.ARCTIC, 12);
    public static AnimalInfo Mammoth = new AnimalInfo(AnimalType.MAMMOTH, BiomeType.ARCTIC, 14);
    public static AnimalInfo Donkey = new AnimalInfo(AnimalType.DONKEY, BiomeType.LAND, 7, 20);
    public static AnimalInfo Snail = new AnimalInfo(AnimalType.SNAIL, BiomeType.OCEAN, 8, 2);
    public static AnimalInfo SabertoothTiger = new AnimalInfo(AnimalType.SABERTOOTHTIGER, BiomeType.ARCTIC, 13);
    public static AnimalInfo Elephant = new AnimalInfo(AnimalType.ELEPHANT, BiomeType.LAND, 14, 97);
    public static AnimalInfo BlueWhale = new AnimalInfo(AnimalType.BLUEWHALE, BiomeType.OCEAN, 14, 98);
    public static AnimalInfo Cobra = new AnimalInfo(AnimalType.COBRA, BiomeType.LAND, 8);
    public static AnimalInfo BoaConstrictor = new AnimalInfo(AnimalType.BOACONSTRICTOR, BiomeType.LAND, 13);
    public static AnimalInfo GiantSpider = new AnimalInfo(AnimalType.GIANTSPIDER, BiomeType.LAND, 14);
    public static AnimalInfo Trex = new AnimalInfo(AnimalType.TREX, BiomeType.LAND, 15, 37);
    public static AnimalInfo Tiger = new AnimalInfo(AnimalType.TIGER, BiomeType.LAND, 10, 38);
    public static AnimalInfo Giraffe = new AnimalInfo(AnimalType.GIRAFFE, BiomeType.LAND, 8);
    public static AnimalInfo Eagle = new AnimalInfo(AnimalType.EAGLE, BiomeType.LAND, 12, 47);
    public static AnimalInfo Hedgehog = new AnimalInfo(AnimalType.HEDGEHOG, BiomeType.LAND, 6);
    public static AnimalInfo Duck = new AnimalInfo(AnimalType.DUCK, BiomeType.LAND, 6);
    public static AnimalInfo Duckling = new AnimalInfo(AnimalType.DUCKLING, BiomeType.LAND, 3);
    public static AnimalInfo Lemming = new AnimalInfo(AnimalType.LEMMING, BiomeType.ARCTIC, 1);
    public static AnimalInfo KingCrab = new AnimalInfo(AnimalType.KINGCRAB, BiomeType.OCEAN, 15, 51);
    public static AnimalInfo Frog = new AnimalInfo(AnimalType.FROG, BiomeType.LAND, 9, 1);
    public static AnimalInfo Ostrich = new AnimalInfo(AnimalType.OSTRICH, BiomeType.LAND, 13);
    public static AnimalInfo Pelican = new AnimalInfo(AnimalType.PELICAN, BiomeType.OCEAN, 10);
    public static AnimalInfo Falcon = new AnimalInfo(AnimalType.FALCON, BiomeType.LAND, 11);
    public static AnimalInfo SnowyOwl = new AnimalInfo(AnimalType.SNOWYOWL, BiomeType.ARCTIC, 8);
    public static AnimalInfo HoneyBee = new AnimalInfo(AnimalType.HONEYBEE, BiomeType.LAND, 6, 60);
    public static AnimalInfo Phoenix = new AnimalInfo(AnimalType.PHOENIX, BiomeType.VOLCANO, 15, 61);
    public static AnimalInfo OstrichBaby = new AnimalInfo(AnimalType.OSTRICHBABY, BiomeType.LAND, 0);
    public static AnimalInfo SeaMonster = new AnimalInfo(AnimalType.SEAMONSTER, BiomeType.OCEAN, 16, 63);
    public static AnimalInfo LandMonster = new AnimalInfo(AnimalType.LANDMONSTER, BiomeType.VOLCANO, 16, 66);
    public static AnimalInfo IceMonster = new AnimalInfo(AnimalType.ICEMONSTER, BiomeType.ARCTIC, 16, 69);
    public static AnimalInfo DinoMonster = new AnimalInfo(AnimalType.DINOMONSTER, BiomeType.LAND, 16, 70);
    public static AnimalInfo Pigeon = new AnimalInfo(AnimalType.PIGEON, BiomeType.LAND, 2);
    public static AnimalInfo Toucan = new AnimalInfo(AnimalType.TOUCAN, BiomeType.LAND, 9, 65);
    public static AnimalInfo Macaw = new AnimalInfo(AnimalType.MACAW, BiomeType.LAND, 7);
    public static AnimalInfo Flamingo = new AnimalInfo(AnimalType.FLAMINGO, BiomeType.OCEAN, 5);
    public static AnimalInfo Cassowary = new AnimalInfo(AnimalType.CASSOWARY, BiomeType.LAND, 14);
    public static AnimalInfo Chicken = new AnimalInfo(AnimalType.CHICKEN, BiomeType.LAND, 3);
    public static AnimalInfo Woodpecker = new AnimalInfo(AnimalType.WOODPECKER, BiomeType.LAND, 4);
    public static AnimalInfo Peacock = new AnimalInfo(AnimalType.PEACOCK, BiomeType.LAND, 6);
    public static AnimalInfo KangarooRat = new AnimalInfo(AnimalType.KANGAROORAT, BiomeType.DESERT, 1);
    public static AnimalInfo DesertChipmunk = new AnimalInfo(AnimalType.DESERTCHIPMUNK, BiomeType.DESERT, 2);
    public static AnimalInfo Meerkat = new AnimalInfo(AnimalType.MEERKAT, BiomeType.DESERT, 3);
    public static AnimalInfo Gazelle = new AnimalInfo(AnimalType.GAZELLE, BiomeType.DESERT, 5);
    public static AnimalInfo Armadillo = new AnimalInfo(AnimalType.ARMADILLO, BiomeType.DESERT, 4);
    public static AnimalInfo FennecFox = new AnimalInfo(AnimalType.FENNECFOX, BiomeType.DESERT, 6);
    public static AnimalInfo Camel = new AnimalInfo(AnimalType.CAMEL, BiomeType.DESERT, 8);
    public static AnimalInfo Warthog = new AnimalInfo(AnimalType.WARTHOG, BiomeType.DESERT, 7);
    public static AnimalInfo Hyena = new AnimalInfo(AnimalType.HYENA, BiomeType.DESERT, 10);
    public static AnimalInfo RattleSnake = new AnimalInfo(AnimalType.RATTLESNAKE, BiomeType.DESERT, 9);
    public static AnimalInfo Vulture = new AnimalInfo(AnimalType.VULTURE, BiomeType.DESERT, 11, 47);
    public static AnimalInfo Bison = new AnimalInfo(AnimalType.BISON, BiomeType.DESERT, 12, 70);
    public static AnimalInfo KomodoDragon = new AnimalInfo(AnimalType.KOMODODRAGON, BiomeType.DESERT, 13);
    public static AnimalInfo GiantScorpion = new AnimalInfo(AnimalType.GIANTSCORPION, BiomeType.DESERT, 16, 91);
    public static AnimalInfo Pterodactyl = new AnimalInfo(AnimalType.PTERODACTYL, BiomeType.DESERT, 15, 93);
    public static AnimalInfo GobiBear = new AnimalInfo(AnimalType.GOBIBEAR, BiomeType.DESERT, 10);
    public static AnimalInfo BlackWidow = new AnimalInfo(AnimalType.BLACKWIDOW, BiomeType.DESERT, 14);
    public static AnimalInfo BulletAnt = new AnimalInfo(AnimalType.BULLETANT, BiomeType.DESERT, 5, 1);
    public static AnimalInfo KingDragon = new AnimalInfo(AnimalType.KINGDRAGON, BiomeType.VOLCANO, 17, 99);
    public static AnimalInfo SandStorm = new AnimalInfo(AnimalType.SANDSTORM, BiomeType.DESERTVOLCANO, 17);
    public static AnimalInfo DragonFire = new AnimalInfo(AnimalType.DRAGONFIRE, BiomeType.VOLCANO, 17);
    public static AnimalInfo Snowman = new AnimalInfo(AnimalType.SNOWMAN, BiomeType.ARCTIC, 15, 11);
    public static AnimalInfo Santa = new AnimalInfo(AnimalType.SANTA, BiomeType.ARCTIC, 15);
    public static AnimalInfo Rudolph = new AnimalInfo(AnimalType.RUDOLPH, BiomeType.ARCTIC, 15);
    public static AnimalInfo DeathWorm = new AnimalInfo(AnimalType.DEATHWORM, BiomeType.DESERT, 0);
    public static AnimalInfo Markhor = new AnimalInfo(AnimalType.MARKHOR, BiomeType.ARCTIC, 12);
    public static AnimalInfo BigFoot = new AnimalInfo(AnimalType.BIGFOOT, BiomeType.FOREST, 15, 112);
    public static AnimalInfo AIBoss = new AnimalInfo(AnimalType.AIBOSS, BiomeType.FOREST, 16);
    public static AnimalInfo Raven = new AnimalInfo(AnimalType.RAVEN, BiomeType.FOREST, 6);
    public static AnimalInfo Kakapo = new AnimalInfo(AnimalType.KAKAPO, BiomeType.FOREST, 4);
    public static AnimalInfo Pheasant = new AnimalInfo(AnimalType.PHEASANT, BiomeType.FOREST, 0);
    public static AnimalInfo WhiteGiraffe = new AnimalInfo(AnimalType.WHITEGIRAFFE, BiomeType.FOREST, 0);
    public static AnimalInfo Turkey = new AnimalInfo(AnimalType.TURKEY, BiomeType.FOREST, 11);

    // very dangerous shenanigans
    public static ArrayList<AnimalInfo> getAllAnimals() {
        ArrayList<AnimalInfo> info = new ArrayList<>();
        try {
            Field[] fields = Animals.class.getDeclaredFields();
            for (Field f : fields) {
                if (Modifier.isStatic(f.getModifiers())) {
                    Class<?> type = f.getType();
                    info.add(new AnimalInfo((AnimalInfo) f.get(type)));
                }
            }
            return info;
        } catch (IllegalAccessException e) {
            return null;
        }
    }

    public static AnimalInfo byName(String name) {
        try {
            Field[] fields = Animals.class.getDeclaredFields();
            for (Field f : fields) {
                if (Modifier.isStatic(f.getModifiers()) && f.getName().equalsIgnoreCase(name)) {
                    Class<?> type = f.getType();
                    return new AnimalInfo((AnimalInfo) f.get(type));
                }
            }
            return null;
        } catch (IllegalAccessException e) {
            return null;
        }
    }

    public static AnimalInfo byID(int id) {
        try {
            Field[] fields = Animals.class.getDeclaredFields();
            for (Field f : fields) {
                if (Modifier.isStatic(f.getModifiers())) {
                    Class<?> type = f.getType();
                    AnimalInfo info = (AnimalInfo) f.get(type);
                    if (info.getType().ordinal() != id)
                        continue;
                    return new AnimalInfo(info);
                }
            }
            return null;
        } catch (IllegalAccessException e) {
            return null;
        }
    }
}

package me.yesd.World.Objects.Animals;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public enum Tier {
    ONE(1, new AnimalInfo[] { Animals.byType(AnimalType.MOUSE), Animals.byType(AnimalType.SHRIMP), Animals.byType(AnimalType.CHIPMUNK) }, 12, 3.768, 0, 425,
            225, 14),
    TWO(2, new AnimalInfo[] { Animals.byType(AnimalType.RABBIT), Animals.byType(AnimalType.PIGEON), Animals.byType(AnimalType.TROUT), Animals.byType(AnimalType.ARCTICHARE) }, 12, 3.5, 50, 435,
            230, 14),
    THREE(3, new AnimalInfo[] { Animals.byType(AnimalType.MOLE), Animals.byType(AnimalType.CRAB) }, 16,
            3.4, 150, 435, 230, 19),
    FOUR(4, new AnimalInfo[] { Animals.byType(AnimalType.PIG), Animals.byType(AnimalType.SEAL), Animals.byType(AnimalType.SEAHORSE) }, 20,
            3.23, 500, 445, 235, 22),
    FIVE(5, new AnimalInfo[] { Animals.byType(AnimalType.DEER), Animals.byType(AnimalType.SQUID), Animals.byType(AnimalType.REINDEER) }, 20,
            3.05, 1000, 445, 235, 22),
    SIX(6, new AnimalInfo[] { Animals.byType(AnimalType.FOX), Animals.byType(AnimalType.HEDGEHOG), Animals.byType(AnimalType.JELLYFISH),
            Animals.byType(AnimalType.ARCTICFOX) }, 20, 2.80, 2000, 470, 235, 22),
    SEVEN(7, new AnimalInfo[] { Animals.byType(AnimalType.ZEBRA), Animals.byType(AnimalType.DONKEY), Animals.byType(AnimalType.TURTLE), Animals.byType(AnimalType.MUSKOX) }, 20, 2.70, 4000, 490,
            235, 22),
    EIGHT(8, new AnimalInfo[] { Animals.byType(AnimalType.COBRA), Animals.byType(AnimalType.GIRAFFE), Animals.byType(AnimalType.STINGRAY), Animals.byType(AnimalType.WALRUS), Animals.byType(AnimalType.SNOWYOWL) },
            20, 2.60, 8000, 490, 235, 23),
    NINE(9, new AnimalInfo[] { Animals.byType(AnimalType.BIGCAT), Animals.byType(AnimalType.GORILLA), Animals.byType(AnimalType.TOUCAN), Animals.byType(AnimalType.SNOWLEOPARD),
            Animals.byType(AnimalType.PUFFERFISH) }, 20, 2.50, 16000, 515, 235, 22),
    TEN(10, new AnimalInfo[] { Animals.byType(AnimalType.BEAR), Animals.byType(AnimalType.TIGER), Animals.byType(AnimalType.SWORDFISH), Animals.byType(AnimalType.PELICAN), Animals.byType(AnimalType.WOLF) }, 20,
            2.35, 32000, 530, 235, 22),
    ELEVEN(11,
            new AnimalInfo[] { Animals.byType(AnimalType.CROC), Animals.byType(AnimalType.LION), Animals.byType(AnimalType.FALCON), Animals.byType(AnimalType.OCTOPUS), Animals.byType(AnimalType.POLARBEAR) },
            20, 2.25, 64000, 545, 235, 23),
    TWELVE(12,
            new AnimalInfo[] { Animals.byType(AnimalType.RHINO), Animals.byType(AnimalType.EAGLE), Animals.byType(AnimalType.SHARK), Animals.byType(AnimalType.WOLVERINE) },
            20, 2.20, 120000, 570, 235, 26),
    THIRTEEN(13,
            new AnimalInfo[] { Animals.byType(AnimalType.HIPPO), Animals.byType(AnimalType.BOACONSTRICTOR), Animals.byType(AnimalType.OSTRICH), Animals.byType(AnimalType.KILLERWHALE),
                    Animals.byType(AnimalType.SABERTOOTHTIGER) },
            20, 2.15, 250000, 570, 235, 27),
    FOURTEEN(14,
            new AnimalInfo[] { Animals.byType(AnimalType.ELEPHANT), Animals.byType(AnimalType.GIANTSPIDER), Animals.byType(AnimalType.MAMMOTH),
                    Animals.byType(AnimalType.BLUEWHALE) },
            38, 2.0, 500000, 610, 255, 42),
    FIFTEEN(15,
            new AnimalInfo[] { Animals.byType(AnimalType.DRAGON), Animals.byType(AnimalType.TREX), Animals.byType(AnimalType.KRAKEN), Animals.byType(AnimalType.KINGCRAB), Animals.byType(AnimalType.YETI),
                    Animals.byType(AnimalType.PHOENIX) },
            43, 1.9, 1000000, 645, 265, 46),
    SIXTEEN(16,
            new AnimalInfo[] { Animals.byType(AnimalType.DINOMONSTER), Animals.byType(AnimalType.LANDMONSTER), Animals.byType(AnimalType.SEAMONSTER),
                    Animals.byType(AnimalType.ICEMONSTER) },
            44, 1.8, 5000000, 675, 275, 52),
    SEVENTEEN(17, new AnimalInfo[] { Animals.byType(AnimalType.BLACKDRAGON) },
            100, 1.2, 10000000, 710, 290, 120);

    int value;
    AnimalInfo[] exclusiveAnimalInfos;
    AnimalInfo[] animalInfo;
    AnimalInfo[] aniInfo;

    int baseRadius;
    int maxRadius;
    double baseZoom;
    int startXP;
    int width = -1;
    int height = -1;

    Tier(int value, AnimalInfo[] animalInfos, int baseRadius, double baseZoom, int startXP, int maxRadius) {
        this.value = value;
        this.maxRadius = maxRadius;
        this.animalInfo = animalInfos;
        this.baseRadius = baseRadius;
        this.baseZoom = baseZoom;
        this.startXP = startXP;
    }

    Tier(int value, AnimalInfo[] animalInfos, AnimalInfo[] exclusiveAnimalInfos, int baseRadius, double baseZoom,
            int startXP, int width, int height, int maxRadius) {
        this.value = value;
        this.animalInfo = animalInfos;
        this.maxRadius = maxRadius;
        this.exclusiveAnimalInfos = exclusiveAnimalInfos;
        this.baseRadius = baseRadius;
        this.baseZoom = baseZoom;
        this.startXP = startXP;
        this.width = (int) Math.round(width * 1.3);
        this.height = (int) Math.round(height * 1.3);
    }

    Tier(int value, AnimalInfo[] animalInfos, AnimalInfo[] exclusiveAnimalInfos, AnimalInfo[] aniInfo, int baseRadius,
            double baseZoom, int startXP, int width, int height, int maxRadius) {
        this.value = value;
        this.animalInfo = animalInfos;
        this.maxRadius = maxRadius;
        this.exclusiveAnimalInfos = exclusiveAnimalInfos;
        this.baseRadius = baseRadius;
        this.baseZoom = baseZoom;
        this.startXP = startXP;
        this.aniInfo = aniInfo;
        this.width = (int) Math.round(width * 1.3);
        this.height = (int) Math.round(height * 1.3);
    }

    Tier(int value, AnimalInfo[] animalInfos, int baseRadius, double baseZoom, int startXP, int width, int height,
            int maxRadius) {
        this.value = value;
        this.animalInfo = animalInfos;
        this.baseRadius = baseRadius;
        this.maxRadius = maxRadius;
        this.baseZoom = baseZoom;
        this.startXP = startXP;
        this.width = width;
        this.height = height;
    }

    public int getWidth() {
        return width;
    }

    public int getMaxRadius() {
        return this.maxRadius;
    }

    public int getHeight() {
        return height;
    }

    public int getValue() {
        return value;
    }

    public List<AnimalInfo> getAniSkin() {
        return Arrays.asList(aniInfo);
    }

    public List<AnimalInfo> getAnimalInfo() {
        List<AnimalInfo> infos = Arrays.asList(animalInfo);
        List<AnimalInfo> newInfos = new ArrayList<>();
        for (AnimalInfo a : infos) {
            AnimalInfo newa = Animals.byID(a.getAnimalType());
            newInfos.add(newa);
        }
        if (exclusiveAnimalInfos != null && exclusiveAnimalInfos.length > 0) {
            List<AnimalInfo> remInfos = new ArrayList<>();
            for (AnimalInfo a : newInfos) {
                for (AnimalInfo ao : exclusiveAnimalInfos) {
                    if (a.getAnimalType() == ao.getAnimalType())
                        remInfos.add(a);
                }
            }
            newInfos.removeAll(remInfos);
        }
        return newInfos;
    }

    public static Tier byOrdinal(int ord) {
        for (Tier m : Tier.values()) {
            if (m.value == ord) {
                return m;
            }
        }
        return null;
    }

    public int getStartXP() {
        return startXP;
    }

    public int getPreviousXP() {
        for (Tier m : Tier.values()) {
            if (m.value == value - 1) {
                return m.getStartXP();
            }
        }
        return 0;
    }

    public int getUpgradeXP() {
        for (Tier m : Tier.values()) {
            if (m.value == value + 1) {
                return m.getStartXP();
            }
        }
        return 20000000;
    }

    public int getUpgradeRadius() {
        for (Tier m : Tier.values()) {
            if (m.value == value + 1) {
                return m.getBaseRadius() == this.getBaseRadius() ? this.getBaseRadius() + 10 : m.getBaseRadius();
            }
        }
        return 120;
    }

    public int getBaseRadius() {
        return baseRadius;
    }

    public double getBaseZoom() {
        return baseZoom;
    }

    public int getNormal(int xp) {
        int a = 1;
        for (Tier m : Tier.values()) {
            if (m.startXP < xp) {
                a = m.value;
            }
        }
        return a;
    }

    public int getUpgraded(int xp) {
        int a = 1;
        for (Tier m : Tier.values()) {
            if (m.startXP <= xp) {
                a = m.value;
            }
        }
        return a;
    }

    public static Tier getTierByMass(double mass) {
        for (Tier tier : Tier.values()) {
            if (tier.value == 17 && mass >= tier.startXP) {
                return tier;
            }
            if (mass >= tier.startXP && mass < tier.getUpgradeXP()) {
                return tier;
            }
        }
        return null;
    }

}

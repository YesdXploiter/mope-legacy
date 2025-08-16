package me.yesd.World.Objects.Animals;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import me.yesd.Utilities.BiomeType;

/**
 * Utility class providing access to {@link AnimalInfo} definitions.
 *
 * <p>The information is loaded from an external CSV resource located at
 * {@code /animals.csv} on the classpath. Each row defines a single animal with
 * its type, biome, tier and optional ability. The data is cached in several
 * lookup collections to allow fast search by type, name or id without using
 * reflection.</p>
 */
public class Animals {

    private static final List<AnimalInfo> ALL_ANIMALS = new ArrayList<>();
    private static final Map<AnimalType, AnimalInfo> BY_TYPE = new HashMap<>();
    private static final Map<String, AnimalInfo> BY_NAME = new HashMap<>();
    private static final Map<Integer, AnimalInfo> BY_ID = new HashMap<>();

    static {
        load();
    }

    /**
     * Loads animal definitions from {@code animals.csv} if the resource is
     * present. Malformed lines are ignored silently.
     */
    private static void load() {
        InputStream in = Animals.class.getResourceAsStream("/animals.csv");
        if (in == null) {
            return; // no data available
        }
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(in))) {
            String line = reader.readLine(); // skip header
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty() || line.startsWith("#"))
                    continue;
                String[] parts = line.split(",");
                if (parts.length < 4)
                    continue;
                String name = parts[0].trim();
                AnimalType type = AnimalType.valueOf(parts[1].trim());
                BiomeType biome = BiomeType.valueOf(parts[2].trim());
                int tier = Integer.parseInt(parts[3].trim());
                int ability = parts.length > 4 ? Integer.parseInt(parts[4].trim()) : 0;

                AnimalInfo info = ability == 0
                        ? new AnimalInfo(type, biome, tier)
                        : new AnimalInfo(type, biome, tier, ability);

                ALL_ANIMALS.add(info);
                BY_TYPE.put(type, info);
                BY_NAME.put(name.toUpperCase(), info);
                BY_ID.put(type.ordinal(), info);
            }
        } catch (IOException | IllegalArgumentException e) {
            // ignore malformed lines
        }
    }

    /**
     * Returns a copy of the list of all loaded animals.
     */
    public static List<AnimalInfo> getAllAnimals() {
        return new ArrayList<>(ALL_ANIMALS);
    }

    /**
     * Returns animal information by its {@link AnimalType}.
     */
    public static AnimalInfo byType(AnimalType type) {
        AnimalInfo info = BY_TYPE.get(type);
        return info != null ? new AnimalInfo(info) : null;
    }

    /**
     * Returns animal information by its name (case-insensitive).
     */
    public static AnimalInfo byName(String name) {
        AnimalInfo info = BY_NAME.get(name.toUpperCase());
        return info != null ? new AnimalInfo(info) : null;
    }

    /**
     * Returns animal information by its numeric id (ordinal of {@link AnimalType}).
     */
    public static AnimalInfo byID(int id) {
        AnimalInfo info = BY_ID.get(id);
        return info != null ? new AnimalInfo(info) : null;
    }
}


package me.yesd.World.Objects.Animals;

import java.util.EnumSet;

/**
 * Enumeration of all possible status effects that can be applied to an {@link Animal}.
 */
public enum StatusEffect {
    LOW_WATER,
    IN_HOME_BIOME,
    UNDER_WATER,
    EFF_INVINCIBLE,
    USING_ABILITY,
    TAIL_BITTEN,
    EFF_STUNNED,
    ICE_SLIDING,
    EFF_FROZEN,
    EFF_ON_FIRE,
    EFF_HEALING,
    EFF_POISON,
    CONSTRICTED,
    WEB_STUCK,
    DIRT_STUCK,
    STEALTH,
    EFF_BLEEDING,
    FLYING,
    IS_GRABBED,
    EFF_ANI_IN_CLAWS,
    EFF_STUNK,
    COLD,
    IN_WATER,
    IN_LAVA,
    CAN_CLIMB_HILL,
    IS_CLIMBING_HILL,
    IS_DEV_MODE,
    EFF_SLIMED,
    EFF_WOBBLING,
    EFF_HOT,
    EFF_SWEAT_POISONED,
    EFF_SHIVERING,
    IN_HIDING_HOLE,
    EFF_GRABBED_BY_FLYTRAP,
    EFF_ALOEVERA_HEALING,
    EFF_TOSSED_IN_AIR,
    EFF_IS_ON_SPIDER_WEB,
    FLIES_LIKE_DRAGON,
    EFF_IS_IN_MUD,
    EFF_STATUE,
    EFF_IS_ON_TREE,
    EFF_IS_UNDER_TREE,
    SPEARED,
    EFF_DIRTY,
    EFF_VIRUS_INFECTION,
    EFF_WEARING_MASK,
    EFF_SANITIZED,
    VIEWING_1V1_INVITE,
    YT_MODE,
    ZOMBIE_INFECTION,
    EFF_IS_ZOMBIE;

    /**
     * Convenience method to create an empty set of status effects.
     */
    public static EnumSet<StatusEffect> none() {
        return EnumSet.noneOf(StatusEffect.class);
    }
}

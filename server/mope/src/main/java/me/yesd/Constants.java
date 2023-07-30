package me.yesd;

import me.yesd.Utilities.Utilities;

public class Constants {
        private static Config conf = new Config();
        public static final int WIDTH = 8500;
        public static final int HEIGHT = 7500;
        public static final int LANDW = 5400;
        public static final int LANDH = 4800;
        public static final int ARCTICW = 8500;
        public static final int ARCTICH = 1350;
        public static final int DESERTW = 8500;
        public static final int DESERTH = 1350;
        public static final int OCEANW = 1550;
        public static final int OCEANH = 4800;
        public static final int FORESTW = 1400;
        public static final int FORESTH = 1400;
        public static final int BEACHW = 150;
        public static final int PORT = Utilities.toInt(conf.GetProp("serverPort", "2255"));
        public static final int GAMEMODE = Utilities.toInt(conf.GetProp("gameMode", "0"));
        public static final int MAX_PLAYERS = Utilities.toInt(conf.GetProp("max_players", "500"));
        public static final int TICKS_PER_SECOND = 20;
        public static final int VERSION = 1;
        public static final int STARTING_TIER = Utilities.toInt(conf.GetProp("startTier", "1"));
        public static final double ROTATIONSPEED = 0.02;
}

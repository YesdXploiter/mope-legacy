package me.yesd.Utilities;

public enum MessageType {
    FIRSTCONNECT(1),
    REQUESTJOIN(2),
    NEWGAMEROOM(3),
    WORLDUPDATE(4),
    MOUSEPOS(5),
    PLAYERALIVE(6),
    STARTSPEEDBOOST(7),
    GAMESCOREUPDATE(8),
    LEAVEGAME(9),
    SERVERSTATSUPDATE(10),
    DCED(11),
    POWERUPEFFECT(12),
    PLAYERLEFT(13),
    YOUDIED(14),
    CREATENEWACCOUNT(15),
    POPUPMSG(16),
    CLIENTRESIZE(17),
    ANIMALCHANGE(18),
    CHAT(19),
    RIGHTCLICK(20),
    LEFTCLICK(21),
    GENERATEPARTY(22),
    PERSONALGAMEEVENT(23),
    GAMESELECTANIMAL(24),
    PLAYERABILITY(25),
    UPGRADE(26),
    DOWNGRADE(27),
    WATERSHOOT(28),
    KEYE(29),
    KEYD(30),
    PING(255),
    TEAMMODE(51),
    INVITE1V1(52),
    REQUESTACTION(53),
    YOUWON(54),
    TOPPERINFO(55),
    SPECTATEMODE(56),
    CUSTOMTEXT(58),
    CUSTOMINTERFACE(59),
    ZOOM(60),
    CUSTOMINTERFACEBTN(61),
    ADBLOCKCHECK(62),
    MOPECHECK(63),
    RECAPTCHA(64),
    READYTOPLAY(65),
    CAMERAANCHORMOVE(66),
    CHATFILTERKEY(67),
    BUTTONCLICKEDID(68),
    DISPLAYPLAYERNICK(69),
    DISPLAYDEVPRINT(70),
    RELOADACCOUNTDATA(71),
    SENDLOGINCRED(72),
    GAMEMODEHANDLE(81),
    GAMEMODECOUNT(82),
    GAMEMODESTATUSBAR(83),
    GAMEMODEBATTLEROYALESTART(84),

    SNOWFALL(100),
    GAMEBTN_HOTKEY(101),
    LOADUSERDATA(102),
    PROMPT(103),
    REDIRECT(104),
    VERIFY(105);

    private int value;

    MessageType(int value) {
        this.value = value;
    }

    public int value() {
        return this.value;
    }

    public static MessageType byOrdinal(int ord) {
        for (MessageType m : MessageType.values()) {
            if (m.value == ord) {
                return m;
            }
        }
        return null;
    }
}

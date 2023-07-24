var gamever = 1;
var KTestingModeON = true;
var disableInterpolate = true, angleLerpRate = 0.21;
var KTestingBetaMode = true && !KTestingModeON;
console.log("\n\n\n");
console.log(
  "-----------Game Version " +
  gamever +
  (KTestingBetaMode ? " (BETA)" : "") +
  " ----------------"
);
console.log("\n\n\n");

var isAliveInGame = false;

var get_bit = function (_0x11761d, _0x56706b) {
  return 0 != (_0x11761d >> _0x56706b) % 0x2;
},
  set_bit = function (_0x3dd688, _0x1bc0bb, _0x849d32) {
    return _0x849d32 ? _0x3dd688 | 0x1 << _0x1bc0bb : _0x3dd688 & ~(0x1 << _0x1bc0bb);
  };

//import all js files (correct order matters if using global, lower lvl files first! Eg. GameObj before GameObjBerry)

///////
// file: js_src/gameobj/GameObjType.js
///////

//definitions of game objects (variables declared without 'var' are GLOBAL)

var o_biome_land = 1,
  o_animal = 2,
  o_hill = 3,
  o_waterSpot = 4,
  o_hidingHole = 5,
  o_hidingBush = 6,
  o_mudSpot = 7,
  o_rockHill = 8,
  o_bigHidingHole = 9,
  o_lake = 10,
  o_lakeIsland = 11,
  o_biome_ocean = 12,
  o_hidingHoleOcean = 13,
  o_abilityGObj = 14,
  o_fruitTree = 15,
  o_biome_arctic = 16,
  o_arcticIce = 17,
  o_fireBall = 18,
  o_snowBall = 19,
  o_berry = 20,
  o_water = 21,
  o_mushroom = 22,
  o_lillypad = 23,
  o_bigMushroom = 24,
  o_bigMushroomBush = 25,
  o_plankton = 26,
  o_berryBush = 27,
  o_planktonBush = 28,
  o_banana = 29,
  o_coconut = 30,
  o_raspberry = 31,
  o_pear = 32,
  o_beach = 33,
  o_biome_ocean_extraWater = 34,
  o_seaweed = 35,
  o_starfish = 36,
  o_kelp = 37,
  o_clam = 38,
  o_conchShell = 39,
  o_river = 40,
  o_volcano = 42,
  o_lava = 43,
  o_lavaLake = 44,
  o_healingStone = 46,
  o_biome_volcano = 47,
  o_arcticNut = 48,
  o_carrot = 49,
  o_watermelon = 50,
  o_watermelonSlice = 51,
  o_meatSmall = 52,
  o_meatMedium = 53,
  o_meatLarge = 54,
  // poison biome
  o_biome_poison = 55,
  o_poisonBerry = 56,
  o_spiderWeb = 57,
  o_bog = 58,
  o_poisonBall = 59,
  o_cloudBerry = 60,
  o_flock = 61,
  o_flockspot = 62,
  o_egg = 63,
  o_sleigh = 64,
  o_quill = 65,
  o_ostrichEgg = 66,
  o_waterDrop = 67,
  o_beeHive = 68,
  o_honeyComb = 69,
  o_fire = 70,
  o_fireTornado = 71,
  o_sinkHole = 72,
  o_DangerAreaCircle = 73,
  o_animalCarcass = 74,
  o_chilli = 75,
  o_safeArea = 76,
  o_spawnEgg = 77,
  o_teamStone = 78,
  o_biome_desert = 79,
  o_infectionDrop = 80;
var GameObjType = {
  //makes it easy to add new subclasses- each class will add itself!
  customClassesForOType: {},

  setClassForAnimalType: function (theClass, aniT) {
    this.setCustomClassForGameObjType(theClass, o_animal, aniT);
  },

  //set a class to be used for creating GameObjs with a certain 'oType' and/or secondaryType (eg. animalType)
  setCustomClassForGameObjType: function (theClass, oType, secondaryType) {
    //if (!(oType in this.customClassesForOType)) { //create def. if doesnt exist
    if (!this.customClassesForOType[oType]) {
      //create def. if doesnt exist
      this.customClassesForOType[oType] = {
        oTypeMainClass: null,
        secondaryTypeClasses: {},
      };
    }
    var classesObj = this.customClassesForOType[oType];

    if (secondaryType == null) {
      //no eg. 'animalType', just the classes

      if (classesObj.oTypeMainClass != null)
        //if something already set
        console.log(
          "ERROR 'GameObjType.setCustomClassForGameObjType': a class (" +
          this.customClassesForOType[oType] +
          ") is already set for oType " +
          oType +
          "! Check for duplicate calls!"
        );
      classesObj.oTypeMainClass = theClass;
    } else {
      //secondary type

      if (secondaryType in classesObj.secondaryTypeClasses)
        //if something already set
        console.log(
          "ERROR 'GameObjType.setCustomClassForGameObjType': a class is already set for oType " +
          oType +
          " AND secondaryType (eg. animalType) " +
          secondaryType +
          "! Check for duplicate calls!"
        );

      classesObj.secondaryTypeClasses[secondaryType] = theClass;
    }
    this.onClassSet(theClass, oType, secondaryType);
  },

  getClassForGameObjType: function (oType, secondaryType) {
    if (oType in this.customClassesForOType) {
      var classesObj = this.customClassesForOType[oType];

      if (secondaryType == null || secondaryType == 0)
        return classesObj.oTypeMainClass;
      else {
        if (secondaryType in classesObj.secondaryTypeClasses)
          //if has a subclass for the secondary type (aniT), use this
          return classesObj.secondaryTypeClasses[secondaryType];
        //otherwise, return the main type class (eg. Animal)
        else return classesObj.oTypeMainClass;
      }
    } else return GameObj;
  },

  /*setGameObjClassForGameObjType:function(theClass, theOType){
        this.registedClassesAtObjTypes[theOType]=theClass;
    }*/

  //creates gameobj of correct GameObj subclass for newlyVisible Msg
  newlyVis_createGameObjFromMsg: function (msg) {
    var oType = msg.readUInt8();

    var secondaryType = null;

    if (oType == o_animal || oType == o_abilityGObj) {
      //read secondary type for certain object types
      secondaryType = msg.readUInt8();
    }
    //console.log("oType: " + oType + " 2: " + secondaryType);
    //create the GameObj
    var newObj = GameObjType.createGameObjOfOType(oType, secondaryType);

    //setup from msg
    newObj.worldUpd_readMsgNewlyVisible(msg, oType, secondaryType);
    return newObj;
  },

  //sepearte method, useful for stand-alone gameObjs, eg for octopus
  createGameObjOfOType: function (oType, secondaryType) {
    var chosenClass = this.getClassForGameObjType(oType, secondaryType); //class to create obj
    //console.log("Class for oType "+oType+" (secondaryType "+secondaryType+") is "+chosenClass.name);

    //create the GameObj
    var newObj = new chosenClass(oType, secondaryType);
    return newObj;
  },
  onClassSet: function (theClass) { },
};

//window.GameObjType=GameObjType;

///////
// file: js_src/gameobj/animal/AnimalType.js
///////

var a_mouse = 1,
  a_rabbit = 2,
  a_pig = 3,
  a_fox = 4,
  a_deer = 5,
  a_mole = 6,
  a_zebra = 7,
  a_lion = 8,
  a_bigCat = 9,
  a_bear = 10,
  a_croc = 11,
  a_rhino = 12,
  a_hippo = 13,
  a_dragn = 14,
  a_shrimp = 15,
  a_trout = 16,
  a_crab = 17,
  a_squid = 18,
  a_shark = 19,
  a_stingray = 20,
  a_turtle = 21,
  a_seaHorse = 22,
  a_jellyFish = 23,
  a_kraken = 24,
  a_pufferFish = 25,
  a_killerWhale = 26,
  a_swordfish = 27,
  a_gorilla = 28,
  a_octopus = 29,
  a_wolf = 30,
  a_arcticHare = 31,
  a_yeti = 32,
  a_chipmunk = 33,
  a_muskox = 34,
  a_penguin = 35,
  a_polarBear = 36,
  a_seal = 37,
  a_snowLeopard = 38,
  a_walrus = 39,
  a_reindeer = 40,
  a_arcticFox = 41,
  a_wolverine = 42,
  a_mammoth = 43,
  a_donkey = 44,
  a_snail = 45,
  a_blackDragon = 46,
  a_sabertoothTiger = 47,
  a_elephant = 48,
  a_blueWhale = 49,
  a_cobra = 50,
  a_boaConstrictor = 51,
  a_giantSpider = 52,
  a_trex = 53,
  a_tiger = 54,
  a_giraffe = 55,
  a_eagle = 56,
  a_hedgehog = 57,
  a_duck = 58,
  a_duckling = 59,
  a_lemming = 60,
  a_kingCrab = 61,
  a_frog = 62,
  a_ostrich = 63,
  a_pelican = 64,
  a_falcon = 65,
  a_snowyOwl = 66,
  a_honeyBee = 67,
  a_phoenix = 68,
  a_ostrichBaby = 69,
  a_seaMonster = 70,
  a_landMonster = 71,
  a_iceMonster = 72,
  a_dinoMonster = 73,
  a_pigeon = 74,
  a_toucan = 75;

var infoForAnimalType = function (aniT) {
  var infoO = {};
  switch (aniT) {
    case a_snail:
      infoO.aniName = "Snail";
      infoO.aniDesc = "";
      infoO.upgradeText = "You're a super slow snail!";

      infoO.aniCol = "#fcc02b";
      infoO.skinName = "snail";
      break;
    case a_mouse:
      infoO.aniName = "Mouse";
      infoO.aniDesc = "";
      infoO.upgradeText = "";

      infoO.aniCol = "#9BA9B9";
      infoO.skinName = "mouse";
      break;
    case a_rabbit:
      infoO.aniName = "Rabbit";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to RABBIT! \nPress W to burrow a hole to hide in!";
      infoO.aniCol = "#AA937E";
      infoO.skinName = "rabbit";
      break;
    case a_pig:
      infoO.aniName = "Pig";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to PIG!\n Pigs move FAST through MUD! (Can use 'stink' on mud/ hiding holes!)";
      infoO.aniCol = "#DD6BD4";
      infoO.skinName = "pig";
      break;
    case a_fox:
      infoO.aniName = "Fox";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to FOX! ,\n You can kick players out of hiding holes! (Press W when in one!)\n+ Hide in red berry bushes!";
      infoO.aniCol = "#FF9D43";
      infoO.skinName = "fox";
      break;
    case a_deer:
      infoO.aniName = "Deer";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to DEER! \nPress W to dig up food! \nDig in mud for better food!\n Hint:Check water areas for new food sources!";
      infoO.aniCol = "#C4773E";
      infoO.skinName = "deer";
      break;
    case a_mole:
      infoO.aniName = "Mole";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to MOLE!\n Hold W to dig underground!\nGo under anything, do surprise attacks!";
      infoO.aniCol = "#4C4A45";
      infoO.skinName = "mole";
      break;
    case a_zebra:
      infoO.aniName = "Zebra";
      infoO.aniDesc = "";
      infoO.upgradeText = "UPGRADED to ZEBRA! \nPress W to kick side ways!";
      infoO.aniCol = "#FFFFFF";
      infoO.skinName = "zebra";
      break;
    case a_lion:
      infoO.aniName = "Lion";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to LION!\n Press W to release a mighty ROAR (Rawr!)!";
      infoO.aniCol = "#f8c923";
      infoO.skinName = "lion";
      break;

    case a_bigCat:
      infoO.aniName = "CHEETAH";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to CHEETAH!\n Press W to get a speed boost! (Every 8 seconds)!";
      infoO.aniCol = "#CAC05B";
      infoO.skinName = "bigcat/cheetah";
      break;
    case a_bear:
      infoO.aniName = "Bear";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to BEAR!\n Bears climb through green hills! (Press W to use your claw!)";
      infoO.aniCol = "#99591C";
      infoO.skinName = "bear";
      break;
    case a_croc:
      infoO.aniName = "Croc";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to CROCODILE!\n Press W to bite and drag around animals! \n+ (Now hide in water spots)+ Swim well in Mud, Lakes & Oceans!";
      infoO.aniCol = "#30F51C";
      infoO.skinName = "croc";
      break;
    case a_hippo:
      infoO.aniName = "Hippo";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to HIPPO!\nHippos are great swimmers, dominate the Lakes/Oceans/Mud!";
      infoO.aniCol = "#945A99";
      infoO.skinName = "hippo";
      break;
    case a_rhino:
      infoO.aniName = "Rhino";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to RHINO!\n Press W to CHARGE with your mighty horn!";
      infoO.aniCol = "#94a3a9";
      infoO.skinName = "rhino";
      break;
    case a_shrimp:
      infoO.aniName = "Shrimp";
      infoO.aniDesc = "";
      infoO.upgradeText = "";
      infoO.aniCol = "#f88e37";
      infoO.skinName = "shrimp";
      break;
    case a_trout:
      infoO.aniName = "Trout";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to TROUT!\nHint: Hold Left-click to RUN! (Uses extra water)";
      infoO.aniCol = "#ac8686";
      infoO.skinName = "trout";
      break;
    case a_crab:
      infoO.aniName = "Crab";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to CRAB!\n Crabs can survive on dry land!\n (On land, Press W to go into your shell!)";
      infoO.aniCol = "#bf2408";
      infoO.skinName = "crab";
      break;
    case a_squid:
      infoO.aniName = "Squid";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to SQUID!\n Squids can use INK when injured (press W!) \n+ you can hide in plankton bushes!";
      infoO.aniCol = "#40dda4";
      infoO.skinName = "squid";
      break;
    case a_shark:
      infoO.aniName = "Shark";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to SHARK!\n A vicious predator of the oceans!";
      infoO.aniCol = "#999fc6";
      infoO.skinName = "shark";
      break;
    case a_seaHorse:
      infoO.aniName = "Sea-horse";
      infoO.aniDesc = "";
      infoO.upgradeText = "UPGRADED to SEA HORSE!\n An agile hunter!";
      infoO.aniCol = "#73BE2F";
      infoO.skinName = "seahorse";
      break;
    case a_jellyFish:
      infoO.aniName = "Jellyfish";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to JELLYFISH!\n A slowly-turning animal that can grow quite large!";
      infoO.aniCol = "#FDB9BA";
      infoO.skinName = "jellyfish";
      break;
    case a_turtle:
      infoO.aniName = "Turtle";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to TURTLE!\n Lives well on land & water! (On land, Press W to go into your shell!)";
      infoO.aniCol = "#502E1A";
      infoO.skinName = "turtle";
      break;
    case a_stingray:
      infoO.aniName = "Stringray";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to STINGRAY!\n Use electic shock (Release W key!) to shock animals! \n(Takes time to recharge)";
      infoO.aniCol = "#164336";
      infoO.skinName = "stingray";
      break;
    case a_kraken:
      infoO.aniName = "The Kraken";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to THE KRAKEN!\n Terrorize the oceans, and be feared by all!\n (Release W to use whirlpool ability!)";
      infoO.aniCol = "#64a034";
      infoO.skinName = "kraken";
      break;
    case a_pufferFish:
      infoO.aniName = "Pufferfish";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to PUFFERFISH!\n (Hold W to inflate- become spiky, and dangerous to touch!)";
      infoO.aniCol = "#6C5C2C";
      infoO.skinName = "pufferfish";
      break;
    case a_killerWhale:
      infoO.aniName = "Killer Whale";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to Killer Whale! \nWhales blow out water when diving! (And sometimes other loot!)";
      infoO.aniCol = "#141414";
      infoO.skinName = "killerwhale";
      break;
    case a_swordfish:
      infoO.aniName = "Swordfish";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n (Press W to rush with your sharp nose!)";
      infoO.aniCol = "#689CD7";
      infoO.skinName = "swordfish";
      break;
    case a_gorilla:
      infoO.aniName = "Gorilla";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Gorillas are very fast on hills/trees!\n Press W to throw bananas! (from trees)";
      infoO.aniCol = "#323232";
      infoO.skinName = "gorilla";
      break;
    case a_octopus:
      infoO.aniName = "Octopus";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to Octopus!\nHold W to use your 'Disguise' ability!\n(Hint: wait for prey to bite you- they get stunned!)";
      infoO.aniCol = "#ff8340";
      infoO.skinName = "octopus";
      break;
    case a_dragn:
      infoO.aniName = "Dragon";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n (You're amazing!) \nFly over everything, Hold W to shoot fire!";
      infoO.aniCol = "#22FF8A";
      infoO.skinName = "dragon";
      break;
    case a_blackDragon:
      infoO.aniName = "Black Dragon";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Black dragons drink lava instead of water! Black dragons only heal on healing stones/lava!";
      infoO.aniCol = "black";
      infoO.skinName = "blackdragon";
      break;

    case a_giantSpider:
      infoO.aniName = "Giant Spider";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Place web around the game to catch prey!";
      infoO.aniCol = "black";
      infoO.skinName = "giantSpider";
      break;

    case a_cobra:
      infoO.aniName = "Cobra";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Hold W to Spit venom, and poison animals with your bite!";
      infoO.aniCol = "black";
      infoO.skinName = "cobra";
      break;

    case a_boaConstrictor:
      infoO.aniName = "Boa Constrictor";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Coil and suffocate other animals!";
      infoO.aniCol = "black";
      infoO.skinName = "boaConstrictor";
      break;

    case a_trex:
      infoO.aniName = "T-REX";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        " The Dinosaur!\n This ancient dinosaur has powerful jaws that can drag prey around!!";
      infoO.aniCol = "#862A2A";
      infoO.skinName = "trex";
      break;
    case a_tiger:
      infoO.aniName = "Tiger";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to Tiger!\n Tigers can launch an ambush attack (HOLD W to grow a bush) Release to attack!";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "tiger";
      break;

    case a_giraffe:
      infoO.aniName = "Giraffe";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to Giraffe!\nGiraffe have huge legs and stomp anyone in their way!";
      infoO.aniCol = "#E9BD23";
      infoO.skinName = "giraffe";
      break;

    case a_eagle:
      infoO.aniName = "Eagle";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to Eagle!\nEagles can fly up other animals in the air! !\n";
      infoO.aniCol = "#5b400d";
      infoO.skinName = "eagle";
      break;

    case a_arcticFox:
      infoO.aniName = "Arctic Fox";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n You can kick players out of hiding holes! (Press W when in one!)\n+ Hide in red berry bushes!";
      infoO.aniCol = "#CFCFCF";
      infoO.skinName = "arctic/arcticfox";
      break;
    case a_arcticHare:
      infoO.aniName = "Arctic Hare";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n \nPress W to burrow a hole to hide in!";
      infoO.aniCol = "#D5D5D5";
      infoO.skinName = "arctic/arctichare";
      break;
    case a_yeti:
      infoO.aniName = "The Yeti!";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n So it really exists... \n Hold W to turn into snow, release W to freeeeeze!";
      infoO.aniCol = "#839eb5";
      infoO.skinName = "arctic/yeti";
      break;
    case a_chipmunk:
      infoO.aniName = "Chipmunk";
      infoO.aniDesc = "";
      infoO.upgradeText = ""; //A little "+infoO.aniName+"...";
      infoO.aniCol = "#A77C30";
      infoO.skinName = "arctic/chipmunk";
      break;

    case a_muskox:
      infoO.aniName = "Muskox";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Press W to charge with your horns! \nPlus move decently on ice!";
      infoO.aniCol = "#231f18";
      infoO.skinName = "arctic/muskox";
      break;
    case a_penguin:
      infoO.aniName = "Penguin";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Left-click to run!\n (HOLD W to slide FAST on ice)!";
      infoO.aniCol = "#FFFFFF";
      infoO.skinName = "arctic/penguin";
      break;
    case a_polarBear:
      infoO.aniName = "Polar Bear";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Polar bears can climb hills! \n+ They're amazing swimmers!";
      infoO.aniCol = "#e4e4e4";
      infoO.skinName = "arctic/polarbear";
      break;
    case a_seal:
      infoO.aniName = "Seal";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Seals can slide on ice (Hold W) + can climb hills (rocks too!)";
      infoO.aniCol = "#cfcfcf";
      infoO.skinName = "arctic/seal";
      break;
    case a_snowLeopard:
      infoO.aniName = "Snow leopard";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Press W to get a speed boost! (Every 8 seconds)!";
      infoO.aniCol = "#cfcfcf";
      infoO.skinName = "arctic/snowleopard";
      break;
    case a_walrus:
      infoO.aniName = "Walrus";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n You can slide on ice (Hold W) + can climb hills (rocks too!)";
      infoO.aniCol = "#633838";
      infoO.skinName = "arctic/walrus";
      break;
    case a_reindeer:
      infoO.aniName = "Reindeer";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Press W to dig up food! \n Your sharp hooves let you turn very well on ice!";
      infoO.aniCol = "#a68976";
      infoO.skinName = "arctic/reindeer";
      break;
    case a_wolf:
      infoO.aniName = "Wolf";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Wolf paws turn very well on ice!\n Press W to howl!";
      infoO.aniCol = "#6B6B6B";
      infoO.skinName = "arctic/wolf";
      break;
    case a_wolverine:
      infoO.aniName = "Wolverine";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Press W to Let out a Powerful GROWL! (Knocks back prey!)";
      infoO.aniCol = "#843A0F";
      infoO.skinName = "arctic/wolverine";
      break;
    case a_mammoth:
      infoO.aniName = "Mammoth";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Press W to roll snowballs with your trunk!\n The bigger the snowball gets, the longer the freeze!";
      infoO.aniCol = "#9d4717";
      infoO.skinName = "arctic/mammoth";
      break;
    case a_donkey:
      infoO.aniName = "Donkey";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Press W to Kick any animal behind you";
      infoO.aniCol = "#8c7c64";
      infoO.skinName = "donkey";
      break;
    /* NEW ANIMALS */
    case a_sabertoothTiger:
      infoO.aniName = "Sabertooth Tiger";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to Sabertooth Tiger!\nSabertooth Tigers are great swimmers, dominate the Lakes/Oceans/Mud!";
      infoO.aniCol = "#945A99";
      infoO.skinName = "sabertoothtiger";
      break;
    case a_elephant:
      infoO.aniName = "Elephant";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Use your long trunk to attack and eat food!";
      infoO.aniCol = "#945A99";
      infoO.skinName = "elephant";
      break;

    case a_blueWhale:
      infoO.aniName = "Blue Whale";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to Blue Whale!\n Smash with your powerful tail!";
      infoO.aniCol = "#945A99";
      infoO.skinName = "bluewhale";
      break;

    // case a_duck:
    //     infoO.aniName = "Duck";
    //     infoO.aniDesc = "";
    //     infoO.upgradeText = "UPGRADED to a DUCK!";
    //     infoO.aniCol = "#FF9000";
    //     infoO.skinName = "duck";
    //     break;
    case a_duckling:
      infoO.aniName = "Duckling";
      infoO.aniDesc = "";
      infoO.upgradeText = "UPGRADED to a DUCK!";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "duck/duckling";
      break;

    case a_hedgehog:
      infoO.aniName = "Hedgehog";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to Hedgehog!\n (Hold W to become spiky, and dangerous to touch!)";
      infoO.aniCol = "#5b400d";
      infoO.skinName = "hedgehog";
      break;

    case a_kingCrab:
      infoO.aniName = "King Crab";
      infoO.aniDesc = "";
      infoO.upgradeText = "UPGRADED to a KING CRAB!";
      infoO.aniCol = "#971f0e";
      infoO.skinName = "kingcrab";
      break;
    case a_lemming:
      infoO.aniName = "Lemming";
      infoO.aniDesc = "";
      infoO.upgradeText = ""; //A little "+infoO.aniName+"...";
      infoO.aniCol = "#A77C30";
      infoO.skinName = "arctic/lemming";
      break;

    case a_frog:
      infoO.aniName = "Frog";
      infoO.aniDesc = "";
      infoO.upgradeText = "UPGRADED to Frog!!";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "frog/frog";

      break;

    case a_ostrich:
      infoO.aniName = "Ostrich";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to Ostrich! Lay eggs to hatch babies! \nCommand babies by placing your crosshair (right-click/W)-\n They can attack prey!";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "ostrich/ostrich";

      break;
    case a_pelican:
      infoO.aniName = "Pelican";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to Pelican! \nPick up water (and prey!) in your mouth,\nfly, and drop water on prey! (press W again)";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "pelican/pelican";

      break;
    case a_falcon:
      infoO.aniName = "Falcon";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to Falcon! \nFly, and do a powerful dive attack! Aim it well.";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "falcon/falcon";

      break;

    case a_snowyOwl:
      infoO.aniName = "Snowy Owl";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to Snowy Owl!\n Aim the crosshair, \n right click/W when it's on top of prey, to attack!";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "snowyowl/snowyowl";

      break;

    case a_ostrichBaby:
      infoO.aniName = "Baby Ostrich";
      infoO.aniDesc = "";
      infoO.upgradeText = "UPGRADED to Baby Ostrich!!";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "ostrich/baby-ostrich";

      break;
    case a_phoenix:
      infoO.aniName = "Phoenix";
      infoO.upgradeText =
        "UPGRADED to Phoenix!\nCreate powerful fire tornados to burn your enemies alive!";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "phoenix/phoenix";
      break;

    case a_seaMonster:
      infoO.aniName = "Sea Monster";
      infoO.upgradeText = "UPGRADED to Sea Monster!";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "seamonster";
      break;
    case a_landMonster:
      infoO.aniName = "Land Monster";
      infoO.upgradeText = "UPGRADED to Land Monster!";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "landmonster";
      break;
    case a_iceMonster:
      infoO.aniName = "Ice Monster";
      infoO.upgradeText = "UPGRADED to Ice Monster!";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "icemonster";
      break;
    case a_dinoMonster:
      infoO.aniName = "Dino Monster";
      infoO.upgradeText = "UPGRADED to Dino Monster!";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "dinomonster";
      break;
    case a_pigeon:
      infoO.aniName = "Pigeon";
      infoO.upgradeText = "UPGRADED to Pigeon!\nHold W to fly around. ";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "pigeon/pigeon";
      break;
    case a_toucan:
      infoO.aniName = "Toucan";
      infoO.upgradeText = "UPGRADED to Toucan!\nHold W to fly around. ";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "toucan/toucan";
      break;

    default:
      infoO.aniName = "(Animal)";
      infoO.aniDesc = "";
      infoO.aniCol = "#000000";
      infoO.upgradeText = "UPGRADED!";
  }

  return infoO;
};

function onAniTypeSet() { }

///////
// file: js_src/gameobj/ability/AbilityType.js
///////

var ability_dive = 100,
  ability_boost = 101,
  ability_none = 0,
  ability_digUnderground = 1,
  ability_shell = 2,
  ability_stingRayShock = 3,
  ability_squidInk = 4,
  ability_krakenSpec = 5,
  ability_whaleBlow = 6,
  ability_octoDisguise = 7,
  ability_iceSlide = 8,
  ability_charge = 9,
  ability_pufferFishPuff = 10,
  //new abilities! :)
  ability_yetiTransform = 11,
  ability_wolfHowl = 12,
  ability_snowShot = 13,
  ability_clawSlash = 14,
  ability_extraBoost = 15,
  ability_snowPoop = 16,
  ability_mammothThrow = 17,
  ability_lionRoar = 18,
  ability_fireShoot = 19,
  ability_backLegKick = 20,
  ability_crocWaterGrab = 21,
  ability_makeHidingHole = 22,
  ability_foxhidingHoleKickout = 23,
  ability_fruitThrow = 24,
  ability_foodSlowDig = 25,
  ability_jellyFishSting = 26,
  ability_spawnGrass = 27,
  ability_orcaWave = 28,
  ability_fireShoot2 = 30,
  ability_elephantTrunkSmack = 31,
  ability_whaleTailHit = 32,
  ability_sabertoothJawAttack = 33,
  ability_cobraVenomSpit = 34,
  ability_spiderWeb = 35,
  ability_boaSuffocate = 36,
  // trex update
  ability_trexShake = 37,
  ability_tiger = 38,
  ability_tigerSlash = 39,
  ability_tigerJump = 40,
  ability_pounce = 41,
  ability_giraffeStomp = 42,
  ability_zebraKick = 43,
  ability_sharkBite = 46,
  ability_eagleAttack = 47,
  ability_fart = 48,
  ability_hedgehogAttack = 49,
  ability_crabSmash = 51,
  ability_ostrich = 54,
  ability_pelican = 55,
  ability_waterSplash = 56,
  ability_falconAttack = 57,
  ability_owlAttack = 58,
  ability_targetCircle = 59,
  ability_honeyBee = 60,
  ability_phoenix = 61,
  ability_bearSlash = 62,
  // monster update
  ability_seaMonsterSpec = 63,
  ability_pigeon = 64,
  ability_toucan = 65,
  ability_landmonsterSpec = 66,
  ability_1v1 = 67,
  ability_1v1Arena = 68,
  ability_soccerPass = 69,
  ability_soccerKick = 70,
  ability_goalScored = 71,
  ability_zombieInfection = 72,
  ability_tsunamiWave = 73;
var infoForAbilityT = function (abilT) {
  var infoO = {};
  var zombieFolder = "";

  var myPlayer = gameObjsByID[myPlayerID];

  switch (abilT) {
    case ability_whaleTailHit:
      infoO.abilName = "Tail Slap";
      infoO.abilImg =
        "skins/" +
        zombieFolder +
        infoForAnimalType(myPlayerLastAniT).skinName +
        ".png";
      break;
    case ability_elephantTrunkSmack:
      infoO.abilName = "Trunk Hit";
      infoO.abilImg =
        "skins/" +
        zombieFolder +
        infoForAnimalType(myPlayerLastAniT).skinName +
        ".png";
      break;
    case ability_dive:
      infoO.abilName = "Dive";
      infoO.abilImg = "img/ability_dive.png";
      break;
    case ability_foodSlowDig:
      infoO.abilName = "Dig For Food";
      infoO.abilImg =
        "skins/" +
        zombieFolder +
        infoForAnimalType(myPlayerLastAniT).skinName +
        ".png";
      break;
    case ability_shell:
      infoO.abilName = "Shell";
      infoO.abilImg =
        "skins/" +
        zombieFolder +
        infoForAnimalType(myPlayerLastAniT).skinName +
        "2.png";
      break;
    case ability_crocWaterGrab:
      infoO.abilName = "Bite Drag";
      infoO.abilImg =
        "skins/" +
        zombieFolder +
        infoForAnimalType(myPlayerLastAniT).skinName +
        ".png";
      break;
    case ability_boaSuffocate:
      infoO.abilName = "Suffocate prey";
      infoO.abilImg =
        "skins/" +
        zombieFolder +
        infoForAnimalType(myPlayerLastAniT).skinName +
        ".png";
      break;

    case ability_pelican:
      infoO.abilName = "Fly with water";
      infoO.abilImg = "skins/pelican/ability_pelican.png";
      break;

    case ability_octoDisguise:
      infoO.abilName = "Disguise";
      infoO.abilImg =
        "skins/" +
        zombieFolder +
        infoForAnimalType(myPlayerLastAniT).skinName +
        ".png";
      break;
    case ability_makeHidingHole:
      infoO.abilName = "Burrow Hole";
      infoO.abilImg =
        "skins/" +
        zombieFolder +
        infoForAnimalType(myPlayerLastAniT).skinName +
        ".png";
      break;
    case ability_foxhidingHoleKickout:
      infoO.abilName = "Pull from Hole";
      infoO.abilImg =
        "skins/" +
        zombieFolder +
        infoForAnimalType(myPlayerLastAniT).skinName +
        ".png";
      break;

    case ability_charge:
      infoO.abilName = "Charge";
      infoO.abilImg =
        "skins/" +
        zombieFolder +
        infoForAnimalType(myPlayerLastAniT).skinName +
        ".png";
      break;
    case ability_mammothThrow:
      infoO.abilName = "Roll snow";
      infoO.abilImg = "img/snowball.png";
      break;
    case ability_cobraVenomSpit:
      infoO.abilName = "Venom Spit";
      infoO.abilImg =
        "skins/" +
        zombieFolder +
        infoForAnimalType(myPlayerLastAniT).skinName +
        ".png";
      break;
    case ability_spiderWeb:
      infoO.abilName = "Spin Web";
      infoO.abilImg = "img/spiderWeb.png";
      break;
    case ability_snowShot:
      infoO.abilName = "Throw Snow";
      infoO.abilImg =
        "skins/" +
        zombieFolder +
        infoForAnimalType(myPlayerLastAniT).skinName +
        ".png";
      break;
    case ability_snowPoop:
      infoO.abilName = "Drop Snow";
      infoO.abilImg = "img/snowball.png";
      break;

    case ability_lionRoar:
      infoO.abilName = "Loud Noise";
      infoO.abilImg =
        "skins/" +
        zombieFolder +
        infoForAnimalType(myPlayerLastAniT).skinName +
        ".png";
      break;
    case ability_clawSlash:
      infoO.abilName = "Claw Slash";
      infoO.abilImg = "img/ability_claw.png";
      break;
    case ability_squidInk:
      infoO.abilName = "Ink";
      infoO.abilImg =
        "skins/" +
        zombieFolder +
        infoForAnimalType(myPlayerLastAniT).skinName +
        ".png";
      break;
    case ability_stingRayShock:
      infoO.abilName = "Shock";
      infoO.abilImg =
        "skins/" +
        zombieFolder +
        infoForAnimalType(myPlayerLastAniT).skinName +
        ".png";
      break;
    case ability_digUnderground:
      infoO.abilName = "Hold to Dig";
      infoO.abilImg =
        "skins/" +
        zombieFolder +
        infoForAnimalType(myPlayerLastAniT).skinName +
        ".png";
      break;
    case ability_wolfHowl:
      infoO.abilName = "Howl";
      infoO.abilImg =
        "skins/" +
        zombieFolder +
        infoForAnimalType(myPlayerLastAniT).skinName +
        ".png";
      break;
    case ability_fruitThrow:
      infoO.abilName = "Throw Banana";
      infoO.abilImg =
        "skins/" +
        +zombieFolder +
        infoForAnimalType(myPlayerLastAniT).skinName +
        ".png";
      break;
    case ability_orcaWave:
      infoO.abilName = "Cause Wave";
      infoO.abilImg =
        "skins/" +
        zombieFolder +
        infoForAnimalType(myPlayerLastAniT).skinName +
        ".png";
      break;
    case ability_extraBoost:
      infoO.abilName = "Extra Boost";

      if (myPlayerLastAniT == a_bigCat) {
        if (myPlayer) {
          var aniInfoO = myPlayer.animalInfo();
          infoO.abilImg = "skins/" + zombieFolder + aniInfoO.skinName + ".png";
        }
      } else
        infoO.abilImg =
          "skins/" +
          zombieFolder +
          infoForAnimalType(myPlayerLastAniT).skinName +
          ".png";
      break;
    case ability_iceSlide:
      infoO.abilName = "Slide on ice";
      infoO.abilImg =
        "skins/" +
        zombieFolder +
        infoForAnimalType(myPlayerLastAniT).skinName +
        ".png";
      break;

    case ability_pufferFishPuff:
      infoO.abilName = "Inflate";
      infoO.abilImg =
        "skins/" +
        zombieFolder +
        infoForAnimalType(myPlayerLastAniT).skinName +
        ".png";
      break;
    case ability_hedgehogAttack:
      infoO.abilName = "Spikes";
      infoO.abilImg =
        "skins/" +
        zombieFolder +
        infoForAnimalType(myPlayerLastAniT).skinName +
        "2.png";
      break;
    case ability_fireShoot:
      infoO.abilName = "Fire";
      infoO.abilImg = "img/fire.png";
      break;

    case ability_fireShoot2:
      infoO.abilName = "Fire";
      infoO.abilImg = "img/fire.png";
      break;

    case ability_crabSmash:
      infoO.abilName = "Arm Smash";

      infoO.abilImg = "img/ability_crabSmashSkin.png";
      break;

    case ability_trexShake:
      infoO.abilName = "Jaws Bite";
      infoO.abilImg =
        "skins/" +
        zombieFolder +
        infoForAnimalType(myPlayerLastAniT).skinName +
        ".png";
      break;

    case ability_sharkBite:
      infoO.abilName = "Jaws Bite";
      infoO.abilImg =
        "skins/" +
        zombieFolder +
        infoForAnimalType(myPlayerLastAniT).skinName +
        ".png";
      break;

    case ability_ostrich:
      infoO.abilName = "Command Babies";
      infoO.abilImg = "skins/" + zombieFolder + "ostrich/ostrich-baby.png";
      break;

    case ability_owlAttack:
      infoO.abilName = "Target prey";
      infoO.abilImg =
        "skins/" +
        zombieFolder +
        infoForAnimalType(myPlayerLastAniT).skinName +
        ".png";
      break;
    case ability_falconAttack:
      infoO.abilName = "Sky dive";
      infoO.abilImg =
        "skins/" +
        zombieFolder +
        infoForAnimalType(myPlayerLastAniT).skinName +
        ".png";
      break;

    case ability_tiger:
      infoO.abilName = "Ambush Attack";
      var myPlayer = gameObjsByID[myPlayerID];

      if (myPlayer) {
        var aniInfoO = myPlayer.animalInfo();
        infoO.abilImg = "skins/" + zombieFolder + aniInfoO.skinName + ".png";
      }
      //infoO.abilImg = "skins/" + infoForAnimalType(myPlayerLastAniT).skinName + ".png";
      break;

    case ability_giraffeStomp:
      infoO.abilName = "Stomp";
      infoO.abilImg =
        "skins/" +
        zombieFolder +
        infoForAnimalType(myPlayerLastAniT).skinName +
        ".png";
      break;
    case ability_eagleAttack:
      infoO.abilName = "Fly with prey";

      if (myPlayer) {
        var aniInfoO = myPlayer.animalInfo();

        infoO.abilImg =
          "skins/" +
          zombieFolder +
          "eagle/" +
          myPlayer.animalSpecies +
          "/eagle" +
          ".png";
      }
      /*
      infoO.abilImg =
        "skins/" + infoForAnimalType(myPlayerLastAniT).skinName + ".png";
        */
      break;
    case ability_fart:
      infoO.abilName = "Stink";
      infoO.abilImg =
        "skins/" +
        zombieFolder +
        infoForAnimalType(myPlayerLastAniT).skinName +
        ".png";
      break;
    case ability_pigeon:
    case ability_toucan:
      infoO.abilName = "HOLD to fly";

      var myPlayer = gameObjsByID[myPlayerID];

      if (myPlayer) {
        var aniInfoO = myPlayer.animalInfo();
        infoO.abilImg = "skins/" + zombieFolder + aniInfoO.skinName + ".png";
      }
      break;

    case ability_phoenix:
      infoO.abilName = "Fire Tornado";
      infoO.abilImg = "img/firetornado.png";
      break;

    case ability_landmonsterSpec:
      infoO.abilName = "Sink Hole";

      infoO.abilImg =
        "skins/" + infoForAnimalType(myPlayerLastAniT).skinName + ".png";

      break;
    case ability_seaMonsterSpec:
      infoO.abilName = "Giant Whirlpool";

      infoO.abilImg =
        "skins/" + infoForAnimalType(myPlayerLastAniT).skinName + ".png";

      break;

    case ability_zombieInfection:
      infoO.abilName = "Zombie Infection";
      infoO.abilImg = "img/ability_infection.png";
      break;

    default:
      infoO.abilName = "Ability";
      infoO.abilImg =
        "skins/" +
        zombieFolder +
        infoForAnimalType(myPlayerLastAniT).skinName +
        ".png";
      break;
  }
  return infoO;
};

///////
// file: js_src/game/utils.js
///////

//UTILITIES
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
var getRandomDouble = function (min, max) {
  return Math.random() * (max - min) + min;
};

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var angle_1to360 = function (angle) {
  var angle = (Math.trunc(angle) % 360) + (angle - Math.trunc(angle)); //converts angle to range -360 + 360
  if (angle > 0.0) return angle;
  else return angle + 360.0;
};
//convert ip string to int32
var dot2numIP = function (dot) {
  var d = dot.split(".");
  return ((+d[0] * 256 + +d[1]) * 256 + +d[2]) * 256 + +d[3];
};
//convert int32 num to ip string
var num2dotIP = function (num) {
  var d = num % 256;
  for (var i = 3; i > 0; i--) {
    num = Math.floor(num / 256);
    d = (num % 256) + "." + d;
  }
  return d;
};
//replace part of url
var removeParam = function (key, sourceURL) {
  var rtn = sourceURL.split("?")[0],
    param,
    params_arr = [],
    queryString = sourceURL.indexOf("?") !== -1 ? sourceURL.split("?")[1] : "";
  if (queryString !== "") {
    params_arr = queryString.split("&");
    for (var i = params_arr.length - 1; i >= 0; i -= 1) {
      param = params_arr[i].split("=")[0];
      if (param === key) {
        params_arr.splice(i, 1);
      }
    }
    rtn = rtn + "?" + params_arr.join("&");
  }
  return rtn;
};

var toDegrees = function (angle) {
  return angle * (180 / Math.PI);
};

var toRadians = function (angle) {
  return angle * (Math.PI / 180);
};

//returns angle in rad
var angleAimingBetweenPoints = function (x1, y1, x2, y2) {
  return Math.atan2(y2 - y1, x2 - x1);
};

var bit_get = function (num, bit) {
  return (num >> bit) % 2 != 0;
};

var bit_set = function (num, bit, setTo1) {
  if (setTo1) return num | (1 << bit); //set 1
  else return num & ~(1 << bit); //set 0
};

/** gives shortest angle dist between two angles, (dist negative or positive!)*/
//accepts/returns RADIANS
var distBetweenAngles = function (fromAngle, toAngle) {
  var rawDiff = toAngle - fromAngle;
  var d = angle_1to360(toDegrees(rawDiff));
  if (d > 180.0)
    //going backwards is shorter
    d = d - 360; //gives negative angle
  return toRadians(d);
};

var clamp = function (n, min, max) {
  return Math.min(max, Math.max(min, n));
};

var encode_utf8 = function (s) {
  return unescape(encodeURIComponent(s));
};

var decode_utf8 = function (s) {
  return decodeURIComponent(escape(s));
};

var fillTextMultiLine = function (text, x, y) {
  var lineHeight = ctx.measureText("M").width * 1.2;
  var lines = text.split("\n");
  for (var i = 0; i < lines.length; ++i) {
    ctx.fillText(lines[i], x, y);
    y += lineHeight;
  }
};

var formatTimeSecs = function (theT) {
  var sec_num = parseInt(theT, 10); // don't forget the second param
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - hours * 3600) / 60);
  var seconds = sec_num - hours * 3600 - minutes * 60;

  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return minutes + ":" + seconds;
};

var numberWithCommas = function (x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

var formatNumK = function (num) {
  return abbreviate_number(num);
  /*if (num < 1000)
      return num; //theS.toLocaleString();
  else if (num < 1000000)
      return (Math.trunc(10 * (num / 1000)) / 10.0) + "k";
  else
      return (Math.trunc(100 * (num / 1000000)) / 100.0) + "m";*/
};
var abbreviate_number = function (num, fixed) {
  if (num === null) {
    return null;
  } // terminate early
  if (num === 0) {
    return "0";
  } // terminate early
  fixed = !fixed || fixed < 0 ? 0 : fixed; // number of decimal places to show
  var b = num.toPrecision(2).split("e"), // get power
    k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
    c = k < 1 ? num.toFixed(0 + fixed) : (num / Math.pow(10, k * 3)).toFixed(2), // divide by power
    d = c < 0 ? c : Math.abs(c), // enforce -0 is 0
    e = d + ["", "K", "M", "B", "T"][k]; // append power
  return e;
};

var drawCircle = function (x, y, rad, col) {
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0, rad), 0, Math.PI * 2);
  ctx.fill();
};

var drawStroke = function (x, y, rad, lineWidth, col) {
  ctx.strokeStyle = col;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0, rad), 0, Math.PI * 2);
  ctx.stroke();
};

var getAnimFrame = function (tSinceSpawn, period, shiftAm, sinF) {
  var moveA = shiftAm * Math.sin(((sinF * Math.PI) / period) * tSinceSpawn);
  return moveA;
};

var log = function (txt, showLog) {
  if (KTestingModeON || showLog) {
    //if(txt=="Stats.onInterfaceReset")
    // throw new Error();
    console.log(txt);
  }
};

function secToTime(sec) {
  var date = new Date(null);
  date.setSeconds(sec); // specify value for SECONDS here
  var mm = date.getMinutes();
  var ss = date.getSeconds();

  var result = "";
  if (mm > 0) result = mm + "m ";
  if (ss > 0) result += ss + "s";

  return result;
}

///////
// file: js_src/interface/CachedText.js
///////

//a node that can cache text, call draw() to draw it, set pos with .x, .y
CachedText.prototype = {
  //can edit stroke vars, before first render!
  strokeW: 1.0, //0 to turn off stroke
  strokeColor: "#000000",
  multiLine: false,

  _text: "",
  _color: "#000000",
  x: 0,
  y: 0, //pos drawn at
  _fntSize: 16,
  _canvas: null,
  _ctx: null,
  _dirty: false,
  //text can be rendered larger for clearer text when scaling
  renderScale: 1.5,
  _scale: 1, //not used atm

  //read-ony vars
  width: 0,
  height: 0, //canvas w/h (fast)

  /*setScale: function(a) {
      if (this._scale != a) {
          this._scale = a;
          this._dirty = true;
      }
  },
  */
  setColor: function (a) {
    if (this._color != a) {
      this._color = a;
      this._dirty = true;
    }
  },
  setFontSize: function (a) {
    if (this._fntSize != a) {
      this._fntSize = a;
      this._dirty = true;
    }
  },

  setText: function (a) {
    if (a != this._text) {
      this._text = a;
      this._dirty = true;
    }
  },
  //updates cached txt canvas, returns canvas (to draw!)
  getRenderedCanvas: function () {
    if (null == this._canvas) {
      this._canvas = document.createElement("canvas");
      this._ctx = this._canvas.getContext("2d");
    }
    //render canvas if needed
    if (this._dirty) {
      this._dirty = false;
      var _canvas = this._canvas,
        _ctx = this._ctx,
        text = this._text,
        scale = this._scale,
        fontsize = this._fntSize * this.renderScale,
        font = fontsize + "px Arial";

      _ctx.font = font;
      var h = ~~(0.2 * fontsize);
      _ctx.font = font; //set font before measureText

      //_ctx.scale(scale, scale);

      if (this.multiLine) {
        //basic multi-line fill!
        var lineHeight = _ctx.measureText("M").width * 1.2;
        var lines = text.split("\n");

        //re-size the canvas for mutiple lines...
        var maxW = 0;
        for (var i = 0; i < lines.length; ++i) {
          maxW = Math.max(maxW, _ctx.measureText(lines[i]).width);
        }
        this.width = (maxW + 6) * scale;
        this.height = (lineHeight * lines.length + h) * scale;
        _canvas.width = this.width;
        _canvas.height = this.height;
        //fix size for renderScale
        this.width /= this.renderScale;
        this.height /= this.renderScale;

        _ctx.globalAlpha = 1;
        _ctx.font = font;
        //_ctx.lineWidth = 6;
        if (this.strokeW > 0.0) {
          _ctx.shadowOffsetX = this.strokeW; //0.3333 *this.renderScale;
          _ctx.shadowOffsetY = this.strokeW; //0.3333 * this.renderScale;
          _ctx.shadowColor = this.strokeColor; //"black";
        }
        var x = 3 + _canvas.width / 2,
          y = fontsize - h / 2;
        if (this._color == "gradient") {
          this._color = ctx.createLinearGradient(x, y, x + 50, y + 50);
          this._color.addColorStop(0, "purple");
          this._color.addColorStop(1, "blue");
        }
        _ctx.fillStyle = this._color;
        _ctx.fillStyle = this._color;
        _ctx.textAlign = "center";
        //  _ctx.textBaseline = "middle"; //vertical center

        for (var i = 0; i < lines.length; ++i) {
          _ctx.fillText(lines[i], x, y);
          y += lineHeight;
        }
      } else {
        this.width = (_ctx.measureText(text).width + 6) * scale;
        this.height = (fontsize + h) * scale;
        _canvas.width = this.width;
        _canvas.height = this.height;
        //fix size for renderScale
        this.width /= this.renderScale;
        this.height /= this.renderScale;

        //set style/font
        _ctx.globalAlpha = 1;
        _ctx.font = font;
        //_ctx.lineWidth = 6;
        if (this.strokeW > 0.0) {
          _ctx.shadowOffsetX = this.strokeW; //0.3333 *this.renderScale;
          _ctx.shadowOffsetY = this.strokeW; //0.3333 * this.renderScale;
          _ctx.shadowColor = this.strokeColor; //"black";
        }
        if (this._color == "gradient") {
          this._color = ctx.createLinearGradient(
            3,
            fontsize - h / 2,
            8 + 50,
            fontsize - h / 2 + 50
          );
          this._color.addColorStop(0, "purple");
          this._color.addColorStop(1, "blue");
        }
        _ctx.fillStyle = this._color;

        _ctx.fillText(text, 3, fontsize - h / 2);
      }
      //console.log("cached name : "+text);
    }
    return this._canvas;
  },

  //convinience method to draw pre-rendered canvas at x/y pos
  draw: function () {
    if (this._text) {
      var nscale = this.renderScale;
      var rnchache = this.getRenderedCanvas(),
        nw = rnchache.width / nscale, //scale down by camzoom (constant font size!)
        nh = rnchache.height / nscale;
      this.setPos(nw, nh);
      ctx.drawImage(rnchache, this.x - nw / 2.0, this.y - nh / 2.0, nw, nh);
    }
  },
  setPos: function (w, h) { },
};

function CachedText(uFntSize, ucolor) {
  uFntSize && (this._fntSize = uFntSize);
  ucolor && (this._color = ucolor);
}

window.CachedText = CachedText;

///////
// file: js_src/interface/InterfaceButtons.js
///////

//button that appears in animal choice interface
function AniChoiceButton(x, y, w, h, aniT, biomeNum, spec) {
  //button gets resized on draw (due to varying screen size)
  this.x = x;
  this.y = y;
  this.w = w; //width of pressable region
  this.h = h;
  this.aniT = aniT;
  this.species = spec;
  this.teamID = 0;

  //this.text = infoForAnimalType(aniT).aniName;//isOcean ? "Ocean Animal" : "Land Animal";
  this.buttonTXT = new CachedText(12.0, "white");
  this.buttonTXT.renderScale = 1.5;
  this.buttonTXT.setText(infoForAnimalType(aniT).aniName);

  this.isHighLighted = false; //highlight if mouse goes on it
  this.biomeNum = biomeNum; //draw ocean or land background
  //drawn animal img
  //var anO = new Animal(0, o_animal, 0, 0, 30);
  var anO = GameObjType.createGameObjOfOType(o_animal, aniT);
  anO.animalType = aniT;
  anO.animalSpecies = spec;
  anO.lava = 100;
  this.buttonTXT.setText(anO.animalInfo().aniName);

  anO.x = anO.ox = anO.nx = 0;
  anO.y = anO.oy = anO.ny = 0;
  anO.rad = anO.oRad = anO.nRad = 30;
  anO.alwaysPlainOutline = true;
  this.drawnAniObj = anO;

  this.buttonScaleF = 1.0; //scale primary button
  //this.touchMarginEx=20.0;

  //used to check clicks
  this.testPosHitsButton = function (posX, posY) {
    if (posX < this.x - this.w / 2 || posX > this.x + this.w / 2)
      //outside x bounds
      return false;
    if (posY < this.y - this.w / 2 || posY > this.y + this.w / 2) {
      //outside y bounds
      return false;
    } else return true;
  };
  (this.setPosAndSize = function (newX, newY, newW, newH, anchorX, anchorY) {
    this.w = newW;
    this.h = newH;
    //set middle x/y based on anchorX/anchorY -(0,0) is top-left corner
    this.x = newX + newW * (0.5 - anchorX);
    this.y = newY + newH * (0.5 - anchorY);
  }),
    (this.draw = function () {
      //ani draw mod
      //draw button bg square
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.scale(this.buttonScaleF, this.buttonScaleF);
      var origA = ctx.globalAlpha;

      //console.log("drawing button at "+this.x,this.y);

      //bg square
      ctx.globalAlpha = origA * 0.75;
      switch (this.biomeNum) {
        case 1:
          ctx.fillStyle = "#1C91B8";
          break;
        case 0:
          ctx.fillStyle = "#26A73A";
          break; //ocean
        case 2:
          ctx.fillStyle = "#B2B2B2";
          break; //arctic
        case 3:
          ctx.fillStyle = "#d2633c";
          break;
      }
      ctx.fillRect(0 - this.w / 2, 0 - this.h / 2, this.w, this.h);
      //draw highlight
      if (this.isHighLighted) {
        ctx.fillStyle = "white";
        ctx.globalAlpha = origA * 0.2;
        ctx.fillRect(0 - this.w / 2, 0 - this.h / 2, this.w, this.h);
      }

      //draw animal
      ctx.globalAlpha = origA;

      this.drawnAniObj.nRad = this.drawnAniObj.rad =
        ((0.6 * w) / 2.0) * interfS;
      ctx.save();
      ctx.scale(2.0, 2.0);
      this.drawnAniObj.teamID = teamID;
      this.drawnAniObj.draw();
      ctx.restore();

      this.buttonTXT.setFontSize(23 * interfS);
      this.buttonTXT.x = 0;
      this.buttonTXT.y = -this.h * 0.5 * 0.75;
      this.buttonTXT.draw();

      //ctx.font = 23 * interfS + "px Arial";
      //ctx.fillText(this.text, 0, -this.h *0.5 * 0.75);
      //}
      ctx.restore();
    });
}
window.AniChoiceButton = AniChoiceButton;

//button for touch controls (and abilities display)
TouchButton.prototype = {
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  visible: true,
  buttonTXT: null,
  pressed: false,
  pressedTouchID: -1,
  touchEnabled: true,
  //does this position land inside the button
  testPosHitsButton: function (posX, posY) {
    //x/y are always the middle of the button

    if (posX < this.x - this.w / 2 || posX > this.x + this.w / 2)
      //outside x bounds
      return false;

    if (posY < this.y - this.w / 2 || posY > this.y + this.w / 2) {
      //outside y bounds
      return false;
    } else return true;
  },
  //set x/y, set to an anchorpoint (0)=0.5
  setPosAndSize: function (newX, newY, newW, newH, anchorX, anchorY) {
    this.w = newW;
    this.h = newH;
    //set middle x/y based on anchorX/anchorY -(0,0) is top-left corner
    this.x = newX + newW * (0.5 - anchorX);
    this.y = newY + newH * (0.5 - anchorY);
  },
  //set this for each button
  onButtonTouchStart: function () {
    //console.log("button touch started!");
  },
  onButtonTouchEnd: function () {
    //console.log("button touch ended!");
  },
};

function TouchButton(text) {
  this.buttonTXT = new CachedText(10.0, "white");
  this.buttonTXT.renderScale = 1.5;
  this.buttonTXT.setText(text);

  this.draw = function () {
    if (!this.visible) return;

    //draw button square
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = this.pressed ? "white" : "#000000";
    ctx.fillRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);

    //draw button text
    ctx.globalAlpha = 0.2;

    this.buttonTXT.setFontSize(25 * interfS);
    this.buttonTXT.x = this.x;
    this.buttonTXT.y = this.y;
    this.buttonTXT.draw();

    ctx.restore();
  };
}
window.TouchButton = TouchButton;

var AbilityButton = function () {
  this.buttonTXT = new CachedText(10.0, "white");
  this.buttonTXT.renderScale = 1.5;
  //this.buttonTXT.setText("");

  //abilities vars (if ability button)
  this.isMiniRechargeBut = false; //shows above W button, when dive is available
  this.abil_Type = 0;
  this.abil_possible =
    this.abil_usable =
    this.abil_recharging =
    this.abil_active =
    false;
  (this.abil_rechargeEndT = 0), (this.abil_rechargeTotalT = 0);
  (this.abil_rechargeBarA = 0), (this.abil_avilableA = 0);

  this.draw = function () {
    if (!this.visible) return;

    this.abil_rechargeBarA +=
      ((this.abil_recharging ? 1.0 : 0.0) - this.abil_rechargeBarA) * 0.1;
    this.abil_avilableA +=
      ((this.abil_usable || this.abil_active ? 1.0 : 0.2) -
        this.abil_avilableA) *
      0.1;
    if (this.isMiniRechargeBut) {
      this.h = this.w * 0.6;
    }

    if (this.abil_possible) {
      var oAlpha = 1.0;
      ctx.save();

      if (this.isMiniRechargeBut) {
        this.h = this.w * 0.8;
        ctx.translate(this.x, this.y + this.h * 0.36);
        ctx.scale(0.65, 0.65);
      } else ctx.translate(this.x, this.y);

      //draw button square
      var fillOp = 0.2 * this.abil_avilableA;
      var fillCol =
        this.pressed || controls_rightClicked ? "#CECECE" : "#000000";
      if (this.abil_active) {
        fillCol = col_edibleOutline;
        fillOp = 0.7;
      }
      ctx.fillStyle = fillCol;
      ctx.globalAlpha = oAlpha * fillOp;
      ctx.fillRect(0 - this.w / 2, 0 - this.h / 2, this.w, this.h);

      //ability img
      var abilityInfo = infoForAbilityT(this.abil_Type);

      if (
        this.abil_Type == ability_fireShoot ||
        this.abil_Type == ability_fireShoot2
      ) {
        var imNum = Math.trunc(timestamp / 120) % 5;
        //var theImg = getLoadedImg(imNum == 1 ? "img/fire.png" : "img/fire2.png");
        var theImg = getLoadedImg("img/fireball/" + imNum + ".png");
        if (theImg) {
          var rad = this.w * 0.4;
          var frame = 0;
          if (gameObjsByID[myPlayerID]) {
            var tSpawn = gameObjsByID[myPlayerID].spawnTime;

            var tSinceSpawn = (timestamp - tSpawn) / 1000.0;
            frame = getAnimFrame(tSinceSpawn, 1, 10, 2);
          }
          ctx.globalAlpha = oAlpha * this.abil_avilableA;
          ctx.drawImage(
            theImg,
            -rad,
            -rad * 0.85 - frame,
            2 * rad,
            2 * rad + frame
          );
        }
      } else {
        var abilImg = abilityInfo.abilImg;
        //  console.log("abilImg: " + abilImg)

        var myPlayer = gameObjsByID[myPlayerID];
        if (
          myPlayer &&
          myPlayer.animalType == a_phoenix &&
          this.abil_Type == ability_dive
        )
          abilImg = "img/ability_dive_lava.png";

        var theImg = getLoadedImg(abilImg);
        //console.log("image info "+theImg);
        if (theImg) {
          var rad = this.w * 0.4;
          ctx.globalAlpha = oAlpha * this.abil_avilableA;
          ctx.drawImage(theImg, -rad, -rad * 0.85, 2 * rad, 2 * rad);
        }
      }
      this.buttonTXT.setText(abilityInfo.abilName);
      this.buttonTXT.setFontSize(25 * interfS);
      this.buttonTXT.x = 0;
      this.buttonTXT.y = -this.w * 0.35;
      this.buttonTXT.draw();

      //rercharging bar (fade based on updated recharing var, as more accurte)
      var tTillRecharged = Math.max(0, this.abil_rechargeEndT - timestamp);
      //console.log("recharged in "+tTillRecharged);
      this.abil_rechargeBarA +=
        ((this.abil_recharging ? 1.0 : 0.0) - this.abil_rechargeBarA) * 0.1;

      if (this.abil_rechargeBarA > 0.01) {
        //recharge bar
        ctx.globalAlpha = oAlpha * this.abil_rechargeBarA * 0.35;
        ctx.fillStyle = "#000000"; //bar bg
        var bx = 0,
          by = 0;
        var barW = this.w * 0.8;
        var barH = this.h * 0.5;

        ctx.fillRect(bx - barW / 2, by - barH / 2, barW, barH); //bg
        ctx.globalAlpha = oAlpha * this.abil_rechargeBarA * 1.0;
        ctx.fillStyle = "#F3C553";
        ctx.fillRect(
          bx - barW / 2,
          by - barH / 2,
          barW * (tTillRecharged / this.abil_rechargeTotalT),
          barH
        ); //fill
      }

      ctx.restore();
    }
  };
};
AbilityButton.prototype = Object.create(TouchButton.prototype); //inherit from TouchButton

window.AbilityButton = AbilityButton;

///////
// file: js_src/game/typedefs.js
///////

// GET url arguments (?arg=2)
function getQueryParams(qs) {
  qs = qs.split("+").join(" ");
  var params = {},
    tokens,
    re = /[?&]?([^=]+)=([^&]*)/g;
  while ((tokens = re.exec(qs))) {
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
  }
  return params;
}
var $_GET = getQueryParams(document.location.search);

//read link/ app flags
var isMobileAppIOS = $_GET["mobileios"] > 0;
var isMobileAppAndroid = $_GET["mobileAndroid"] > 0;
var isMobileApp = isMobileAppIOS || isMobileAppAndroid;

var alwaysShowVideo = $_GET["videoson"] > 0;

//var urlServerName = ($_GET['server']);

//for now, most defs are in here (other than subclassed ones)
var lerpI = 0.175; //@10fps; // 0.12 for 20fps;  //ag@r is 0.125

//common game colors
var col_gameBg = "#3FBA54"; //light-green background color of mope.io
var col_snowcolor = "#f7f7f7";
var col_outline_land = "#09992F";
var col_outline_ocean = "#007ec0";
var col_outline_arctic = "grey";
var col_bg3 = "#09992F"; //"#3D7447";
var col_wat1 = "#4E66E4";
var col_lava = "#ff6000";
var col_wat2 = "#5e69a0"; //#4651a6 - non snow color
var col_ocean = col_wat2; // "#1898bd";// (old oc)
var col_ocean_sand = "#c8b745";
var col_outline_desert = "#a59215";
var col_desert_hill = "#d6c348";

var col_food1 = "#F35F53";
var col_food2 = "#CF6259";
var col_plankton1 = "#FF911E";
var col_plankton2 = "#C67019";

var col_dangerOutline = "#EF3C31";
var col_edibleOutline = "#4AE05E";
var col_rockHill = "#8C9688";
var col_rockHill_desert = "#878053";

var outlineColForBiome = function (biomeN) {
  switch (biomeN) {
    case biome_ocean:
      return col_outline_ocean;
    case biome_arctic:
      return col_outline_arctic;
    case biome_desert:
      return col_outline_desert;
    default:
    case biome_land:
      return col_outline_land;
  }
};
// custom interface buttons
var interfaceButtons = [];
//biome types
var biome_land = 0;
var biome_ocean = 1;
var biome_arctic = 2;
var biome_volcano = 3;
var biome_desert = 4;

//HANDLE WORLD UPDATE
var timestamp = +new Date();
var lastUpdT = +new Date();

// Team Mode vars start
var teamID = 0;
// team mode vars end

//
var isInArena = false;
var isAbility1v1Active = false;
var isSoccerEnabled = false;
var show1v1Button = false;
var can1v1 = false;
var btn1v1 = null;
var player1v1ArenaWins = 0;
var playerGoalsScore = 0;
var serverAllTimeGoals = 0;
var playersInfected = 0;
var zombiesKilled = 0;
var player1v1Requests = [];
var isInBonusRound = false;
var bonusRoundDur = 0;
var homeButton = null;
var isSpectateMode = false;
var eggID = 0;
var isDevMode = false;
//canvases
var canvas = document.getElementById("gCanvas");
var lbCanvas = null;
var miniMapCanvas = null;
var nPlayersViewing = 0;
var nPlayersAlive = 0;
var ctx = canvas.getContext("2d");
ctx.shadowColor = "black"; //default for everything
//global settings
var localStorageOn = false;
var pixelRat = Math.min(window.devicePixelRatio, 2.0); //limit to 2 for performance
//set mobile
var isTouchEnabled =
  ("ontouchstart" in window || navigator.maxTouchPoints) == true;
if (isTouchEnabled) console.log("mobile touch device detected!");

//music, game music lazy loaded (to prevent initial lag!)
var loadedAudio = {};

var getLazyLoadAudio = function (theUrl) {
  //start loading audio (if it's not muted!)
  if (!loadedAudio.hasOwnProperty(theUrl) && !options_musicMuted) {
    //start loading if not loaded
    var newAudio = new Audio(theUrl);
    console.log("loading audio: " + theUrl);
    loadedAudio[theUrl] = newAudio;

    /*if (theUrl == menuMusicURL) { //loop menu music!
        newAudio.addEventListener('ended', function() {
            this.currentTime = 0; //restart on music end
            try {
                this.play();
            } catch (err) {}
        }, false);
    }*/
    newAudio.volume = 0.7;
    newAudio.muted = options_musicMuted;
  }

  return loadedAudio[theUrl];
};
var currentMusic = null; //currently playing music audio instance
var currentMusicUrl = ""; //url that would be playing (even if muted)
//var menuMusicURL = 'audio/music_menu.mp3';
var gameMusicURL = "audio/music_game.mp3";

var changeMusicTo = function (theUrl) {
  if (currentMusic) {
    //stop/reset current music
    currentMusic.pause();
    currentMusic.currentTime = 0;
  }
  currentMusicUrl = theUrl;
  if (!options_musicMuted) {
    //dont load music if sound is muted!
    console.log("changed music to " + theUrl);
    currentMusic = getLazyLoadAudio(theUrl, true);
    try {
      currentMusic.play();
    } catch (err) { }
  }
};

//mute button was pressed, update muted
var onMuteButtonChange = function () {
  var theDOM = document.getElementById("button_mute_img"); //button img
  if (theDOM) {
    theDOM.src = options_musicMuted ? "img/sound_off.png" : "img/sound_on.png";

    //update .muted for all already-loaded audio/music
    for (var aProp in loadedAudio) {
      if (loadedAudio.hasOwnProperty(aProp)) {
        loadedAudio[aProp].muted = options_musicMuted;
      }
    }

    //start current music (if music should be playing, but not loaded!)
    if (!options_musicMuted && currentMusicUrl && currentMusic == null) {
      changeMusicTo(currentMusicUrl);
    }
  }
};

//camera
var instantSetCamNextUpd = false;
var camzoom = (camzoom_n = 2.7); //effective zoom
var camzoom = 1.0; //zoom effect on start
var camx = 0.0;
var camy = 0.0;
var camx_n = 0.0;
var camy_n = 0.0;
var camx_o = 0.0;
var camy_o = 0.0;
var interfS = 1.0; //scale of ingame interfaces
//interFaceA=0.0; //pretty animation

//mouse
var rawMouseX = 0, //in CANVAS coordinates (multiplied by pix ratio)
  rawMouseY = 0,
  gameMouseX = 0, //in actual game
  gameMouseY = 0,
  lastMouseX = 0,
  lastMouseY = 0;
//game controls (for use with multiple buttons)
var controls_leftClicked = false,
  controls_rightClicked = false;
//game size, vars, get set on game join
var canvasW = 0;
var canvasH = 0;
var gameW = 0,
  gameH = 0; //size of game area (for bounds)

var gameMode_FFA = 0;
var gameMode_sandbox = 1;
//var gameMode_battleRoyal = 2; discontinued game mode
var gameMode_teamMode = 3;
var gameMode_troll = 4;
var gameMode_zombie = 5;
var gameMode = gameMode_FFA; //NOT USED ATM

var gameState = 0;

//varsa

//get lazy loaded img (calling this starts load)
var loadedImgs = {};

var getLoadedImg = function (imgUrl) {
  if (!loadedImgs.hasOwnProperty(imgUrl)) {
    //start loading if not loaded
    loadedImgs[imgUrl] = new Image();
    loadedImgs[imgUrl].src = imgUrl; //"./skins/" + skinName + '.png';
  }
  if (0 != loadedImgs[imgUrl].width && loadedImgs[imgUrl].complete) {
    return loadedImgs[imgUrl];
  } else {
    return null;
  }
};

//game vars
var xpNextAni = 100;
var dangerAniTypes = Array.apply(null, new Array(50)).map(
  Number.prototype.valueOf,
  0
);
var edibAniTypes = Array.apply(null, new Array(50)).map(
  Number.prototype.valueOf,
  0
);
var tailBiteAniTypes = Array.apply(null, new Array(50)).map(
  Number.prototype.valueOf,
  0
);
var edibleObjTypes = Array.apply(null, new Array(50)).map(
  Number.prototype.valueOf,
  0
);
var clearedTypesSinceSpawnRequest = false;

var gameObjs = []; //sorted drawn list of objs
var gameObjsByID = {}; //hashed list by ID
var remGameObjs = []; //to be deleted after draw
//latest recharging msg info (global for player)
var abil_recharging = false;
var abil_rechargeTotalT = 0;
var abil_rechargeEndT = 1.0;
var abil_dive_recharging = false;
var abil_dive_rechargeTotalT = 0;
var abil_dive_rechargeEndT = 1.0;

//global vars
var abil_dive_isMain = false;
var ocean_anim_startT = +new Date(); //sync all ocean water

//load options
var options_noImages = false;
var options_noNames = false;
var options_lowGraphics = false; //main optimizations: next shadows off,
var options_noJoystick = false;
var options_leftHanded = false;
var options_noXpPopup = false;
var options_musicMuted = false;
var options_winterskins = false;
//options_snowfall = false;

function addDOMOptionHtml(opID, opDesc, opColor) {
  var contaierElem = document.getElementById("optionsContainer");
  var lab = document.createElement("label");
  lab.innerHTML =
    "<input type='checkbox' id='" +
    opID +
    "'><span style='color: " +
    opColor +
    ";''>" +
    opDesc +
    "</span>";
  contaierElem.appendChild(lab);
}
addDOMOptionHtml("options_noImages", "No Animal images  ", "black");
addDOMOptionHtml("options_noNames", "No Names & Chat  ", "black");
addDOMOptionHtml("options_lowGraphics", "Use Low graphics ", "black");
if (isTouchEnabled) {
  addDOMOptionHtml("options_noJoystick", "No Joystick", "#194614");
  addDOMOptionHtml("options_leftHanded", "LEFT-handed Joystick", "#194614");
}
addDOMOptionHtml("options_noXpPopup", "Don't show +XP popups", "black");

if (window.localStorage) {
  options_noNames = window.localStorage.getItem("options_noNames") + 0 > 0;
  var theDOM = document.getElementById("options_noNames");
  if (theDOM) {
    theDOM.checked = options_noNames;
  }
  options_noImages = window.localStorage.getItem("options_noImages") + 0 > 0;
  var theDOM = document.getElementById("options_noImages");
  if (theDOM) {
    theDOM.checked = options_noImages;
  }

  options_lowGraphics =
    window.localStorage.getItem("options_lowGraphics") + 0 > 0;
  var theDOM = document.getElementById("options_lowGraphics");
  if (theDOM) {
    theDOM.checked = options_lowGraphics;
  }

  options_noJoystick =
    window.localStorage.getItem("options_noJoystick") + 0 > 0;
  var theDOM = document.getElementById("options_noJoystick");
  if (theDOM) {
    theDOM.checked = options_noJoystick;
  }

  options_leftHanded =
    window.localStorage.getItem("options_leftHanded") + 0 > 0;
  var theDOM = document.getElementById("options_leftHanded");
  if (theDOM) {
    theDOM.checked = options_leftHanded;
  }

  options_noXpPopup = window.localStorage.getItem("options_noXpPopup") + 0 > 0;
  var theDOM = document.getElementById("options_noXpPopup");
  if (theDOM) theDOM.checked = options_noXpPopup;

  //mute button
  options_musicMuted = window.localStorage.getItem("options_muted") + 0 > 0;
  onMuteButtonChange();
}

//mute button
var theDom = document.getElementById("button_mute");
if (theDom) {
  theDom.onclick = function () {
    options_musicMuted = !options_musicMuted;
    onMuteButtonChange();
    try {
      window.localStorage.setItem("options_muted", options_musicMuted ? 1 : 0);
    } catch (err) { } //no localStorage
  };
}
document.getElementById("settingsButton").onclick = function () {
  var theDom = document.getElementById("optionsDiv");
  let setsOpen = theDom.style.display == "block";
  if (!setsOpen) {
    masterServer_getServerStats();
  }
  theDom.style.display = setsOpen ? "none" : "block";

  //play sound (if not muted)
  var sound_click = getLazyLoadAudio("audio/click.mp3");
  if (sound_click) {
    try {
      sound_click.play();
    } catch (err) { }
  }
};
document.getElementById("closeBut").onclick = function () {
  var theDom = document.getElementById("optionsDiv");
  theDom.style.display = theDom.style.display == "block" ? "none" : "block";

  //play sound (if not muted)
  var sound_click = getLazyLoadAudio("audio/click.mp3");
  if (sound_click) {
    try {
      sound_click.play();
    } catch (err) { }
  }
};
//save options

// normal options
var theDom = document.getElementById("options_noImages");
if (theDom) {
  theDom.onchange = function () {
    if (window.localStorage) {
      options_noImages = this.checked;
      try {
        window.localStorage.setItem(
          "options_noImages",
          options_noImages ? 1 : 0
        );
      } catch (err) { } //no localStorage

      //console.log("options_noimages: saved as " + window.localStorage.getItem("options_noImages"));
    }
  };
}
var theDom = document.getElementById("options_noNames");
if (theDom) {
  theDom.onchange = function () {
    if (window.localStorage) {
      options_noNames = this.checked;
      try {
        window.localStorage.setItem("options_noNames", options_noNames ? 1 : 0);
      } catch (err) { } //no localStorage

      //console.log("options_noNames: saved as " + window.localStorage.getItem("options_noNames"));
    }
  };
}

var theDom = document.getElementById("options_lowGraphics");
if (theDom) {
  theDom.onchange = function () {
    if (window.localStorage) {
      options_lowGraphics = this.checked;
      try {
        window.localStorage.setItem(
          "options_lowGraphics",
          options_lowGraphics ? 1 : 0
        );
      } catch (err) { } //no localStorage

      //resize canvas
      onResize();

      //console.log("options_lowGraphics: saved as " + window.localStorage.getItem("options_lowGraphics"));
    }
  };
}

var theDom = document.getElementById("options_noJoystick");
if (theDom) {
  theDom.onchange = function () {
    if (window.localStorage) {
      options_noJoystick = this.checked;
      try {
        window.localStorage.setItem(
          "options_noJoystick",
          options_noJoystick ? 1 : 0
        );
      } catch (err) { } //no localStorage

      //resize canvas
      onResize();

      //console.log("options_noJoystick: saved as " + window.localStorage.getItem("options_noJoystick"));
    }
  };
}
var theDom = document.getElementById("options_leftHanded");
if (theDom)
  theDom.onchange = function () {
    if (window.localStorage) {
      options_leftHanded = this.checked;
      try {
        window.localStorage.setItem(
          "options_leftHanded",
          options_leftHanded ? 1 : 0
        );
      } catch (err) { } //no localStorage

      //resize canvas
      onResize();

      console.log(
        "options_leftHanded: saved as " +
        window.localStorage.getItem("options_leftHanded")
      );
    }
  };

var theDom = document.getElementById("options_noXpPopup");
if (theDom) {
  theDom.onchange = function () {
    if (window.localStorage) {
      options_noXpPopup = this.checked;
      try {
        window.localStorage.setItem(
          "options_noXpPopup",
          options_noXpPopup ? 1 : 0
        );
      } catch (err) { } //no localStorage

      //resize canvas
      onResize();

      //console.log("options_noXpPopup: saved as " + window.localStorage.getItem("options_noXpPopup"));
    }
  };
}

var fps_framesCount = 0;
var fps_drawTimeCount = 0;
var fps_timeStart = +new Date();
var fpsText = "... fps";
var fps_startTime = +new Date();
var fps_totalFramesDone = 0;
var fps_totalTime = 0;

//current game vars
var plOnlineStr = "...";
var myBrowserUniqueID = 0;
var myPlayerID = 0;
var myPlayerLastAniT = a_mouse;
var serverCon_aliveInAGame = false;
var serverCon_spectatingInAGame = false;
var serverConnected = false;
var serverFirstConnected = false;
var afkTimeStart = +new Date();
var dcedFromAfk = false;

var isAirBar = false;
var animalBarType = 0;
var waterBarPerc = (waterBarPerc_n = 100);
var xpPer_n = (xp = xpPer = 0);
var infectionBarPerc = (infectionBarPerc_n = 100);
//interface/animation vars
var waterBarTXT = new CachedText(16.0, "white");
var player1v1TXT = new CachedText(16.0, "white");
var xpBarTXT = new CachedText(16.0, "white");
var screenTXT = new CachedText(16.0, "white");
var playersOnlTXT = new CachedText(10.0, "white");
screenTXT.multiLine = true;
screenTXT.renderScale = 1.0; //better quality
playersOnlTXT.renderScale = 1.0; //better quality
var showPlaersOnServer = false;
var lowBarPercLabelA = 0.0;
var respawnMsgA = 0.0; //'respawn with 10.3k xp!'
var respawnMsgText = "";
//hurtTintA = hurtTintA_n = 0.0;

//create touch buttons
var allTouchButtons = []; //all drawn/active buttons
var button_w = new AbilityButton();
button_w.onButtonTouchStart = function () {
  controlsPressEvent(cNum_rightClick, true);
};
button_w.onButtonTouchEnd = function () {
  controlsPressEvent(cNum_rightClick, false);

  //unselect run (if pressed through sliding down finger)
  if (button_run.pressed && button_run.pressedTouchID == -1) {
    //button RELEASED!
    button_run.pressed = false;
    controlsPressEvent(cNum_leftClick, false);
  }
};
allTouchButtons.push(button_w);

var button_w_mini = new AbilityButton(); //not pressable
button_w_mini.isMiniRechargeBut = true;
button_w_mini.touchEnabled = false;
//no touch handlers (doesn't get touched)
allTouchButtons.push(button_w_mini);

var button_run = new TouchButton("HOLD TO RUN");
button_run.onButtonTouchStart = function () {
  controlsPressEvent(cNum_leftClick, true);
};
button_run.onButtonTouchEnd = function () {
  controlsPressEvent(cNum_leftClick, false);
};
allTouchButtons.push(button_run);

var button_chat = new TouchButton("CHAT");
button_chat.onButtonTouchStart = function () {
  toggleChatOpen();
};
allTouchButtons.push(button_chat);

var button_sKey = new TouchButton("S"); //in sandbox
button_sKey.onButtonTouchStart = function () {
  controlsPressEvent(cNum_watershoot, true);
};
allTouchButtons.push(button_sKey);

var button_SBdowngrade = new TouchButton("DOWN↓");
button_SBdowngrade.onButtonTouchStart = function () {
  controlsPressEvent(cNum_SBdowngrade, true);
};
allTouchButtons.push(button_SBdowngrade);

var button_SBupgrade = new TouchButton("UP↑");
button_SBupgrade.onButtonTouchStart = function () {
  controlsPressEvent(cNum_SBupgrade, true);
};
allTouchButtons.push(button_SBupgrade);

//joystickDisabled = false, //temporary
var joyStickOpen = false,
  joysickTouchID = -1,
  joystickStartX = 0,
  joystickStartY = 0,
  joystickTipX = 0,
  joystickTipY = 0,
  joystickRad = 50.0, //in CANVAS coords
  joystickA = 0.0,
  joystickDirArrowAngle = 0,
  joystickDirArrowAngle_nDelta = 0,
  joystickDistF = 0.0,
  joystickDistF_n = 0.0;

/*abil_possible=false;
var abil_usable=false;
var abil_recharging=false;
var abil_active=false;*/

//update/lerpF
var lastUpdT = +Date.now();

var ws = null;

///////
// file: js_src/client/login.js
///////

//handles login stuff

//handle logins
var $_GET = getQueryParams(document.location.search);
var token = $_GET["token"];

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace("-", "+").replace("_", "/");
  return JSON.parse(window.atob(base64));
}

function loginWithFB() { }

///////
// file: js_src/client/desktopAds.js
///////

//adblock detected
//detect adblock
var vidAdCount = 0;
var adBlockEnabled = false;
if (!isMobileApp) {
  var testAd = document.createElement("div");
  testAd.innerHTML = "&nbsp;";
  testAd.className = "adsbox";
  document.body.appendChild(testAd);
  window.setTimeout(function () {
    if (testAd.offsetHeight === 0) {
      //adblocker detected

      console.log("@@@@@@@@@@ is is blocked");
      adBlockEnabled = true;
      document.getElementById("blockedImg").style.display = "block";
    }
    testAd.remove();
    console.log("AdBlock Enabled? ", adBlockEnabled);
  }, 1000);
}

//@@@@@@@@@@@@@@@ load google analytics @@@@@@@@@@@@@@@@@

if (!isMobileApp) {
  //load analytics.js file
  (function (i, s, o, g, r, a, m) {
    i["GoogleAnalyticsObject"] = r;
    (i[r] =
      i[r] ||
      function () {
        (i[r].q = i[r].q || []).push(arguments);
      }),
      (i[r].l = 1 * new Date());
    (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
  })(
    window,
    document,
    "script",
    "https://www.google-analytics.com/analytics.js",
    "ga"
  );

  //creates google analytics trackers
  ga("create", "UA-36494583-11", "auto"); //regular mope.io player (always track)
  //send pageviews
  ga("send", "pageview");
}

//video ads  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
var gamesPlayedSinceLastAd = 0;
var lastAdShowT = 0;

if (window.localStorage) {
  //load last ad show time
  var savT = window.localStorage.getItem("lastAdShowT") * 1 || 0;
  var tSinceLastShow = +new Date() - savT; //make sure last ad shown time is in the past!
  lastAdShowT = tSinceLastShow > 0 ? savT : 0;
  //console.log("videoAd: ad last shown " + (tSinceLastShow / 1000.0) + "s ago!");
  //load games played since ad
  gamesPlayedSinceLastAd = window.localStorage.getItem("gamesSinceAd") * 1;
  //console.log("videoAd: " + gamesPlayedSinceLastAd + " games since last ad!");
}
var gamesPlayedThisSession = 0; //dont show ads on first game
var sessionStartT = +new Date();
var videoAdIsPlaying = false; //ad is being displayed at the moment?

//should ad be displayed this game
var shouldShowVideoAd = function () {
  if (!videoAdsAvailable()) {
    console.log("videoAd: no show: ads disabled");
    return false;
  }
  if (alwaysShowVideo) {
    console.log("videoAd: test mode, always show video ad!");
    return true;
  }
  if (adBlockEnabled) {
    console.log("videoAd: no show: ad blocker on!");
    return false;
  }
  //show ads for NEW players (test)
  /*if (gamesPlayedThisSession < 1 && lastAdShowT == 0) {
      console.log("videoAd: no show: NEW PLAYER, no games yet started!");
      return false;
  }*/

  //show ad if 5+ mins passed
  var tSecsSinceLastShow = (+new Date() - lastAdShowT) / 1000.0;
  if (tSecsSinceLastShow > 2 * 60 && gamesPlayedSinceLastAd > 0) {
    //only if actually started a game!
    console.log("videoAd: show: time limit passed!");
    return true;
  }
  if (gamesPlayedSinceLastAd >= 2) {
    console.log("videoAd: show: 3+ games passed!");
    return true;
  }
  //reached here, no ad this time

  //console.log("videoAd: no show: no ad this time (next ad in " + (5 * 60.0 - tSecsSinceLastShow) + "s) OR in " + (3 - gamesPlayedSinceLastAd) + " games started.");
  return false;
};

var videoAdsADINPLAY = false; //true;

var videoAdsAvailable = function () {
  var isTestMode = KTestingModeON;
  var adPossible = !isMobileApp && !isTestMode;
  if (videoAdsADINPLAY) return adPossible && typeof adplayer != "undefined";
  //adinplay
  else return adPossible;
};

var initVideoAds = function () {
  //ADINPLAY VIDEO ADS @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  if (videoAdsADINPLAY) {
    getScript(
      "//api.adinplay.com/player/v2/MOP/mope.io/player.min.js",
      function () {
        if (typeof aipPlayer != "undefined") {
          console.log("Loading video preroll...");
          adplayer = new aipPlayer({
            AD_WIDTH: 960, //1200
            AD_HEIGHT: 540, //675
            AD_FULLSCREEN: false,
            PREROLL_ELEM: document.getElementById("preroll"),
            AIP_COMPLETE: function () {
              //alert("prerollComplete");
              console.log("Video ad finished.");
              onVideoAdFinished(true); //successfully played and finished
            },
          });
        } else {
          // failed to load the adslib ads are probably blocked don't call startPreRoll
          console.log("Video ad (blocked) -finished.");
          onVideoAdFinished(false);
        }
      }
    );
  } else {
    //PLAYVIEW MEDIA VIDEO ADS @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //load is done on-play
  }
};

function refreshBannerAds() {
  if (isMobileApp) return;

  try {
    console.log("refreshing banner ads...");

    console.log("CALLED FROM: " + new Error().stack);

    //CURSE
    //curse refresh banners

    factorem.refreshAds([1, 2], true);

    //setTimeout(factorem.refreshAds.bind(factorem, null, true), 800);

    //adinplay
    //googletag.pubads().refresh();
  } catch (ex) {
    //factorem/ads dont exist
    console.log("error refreshing ad: " + ex);
  }
}

//remove ads when menu is hidden- > to be reloaded later

//play a loaded ad
var videoAdShowLoading = false; //show loading... animation
var videoAdStartedPlaying = false;
var videoAdShowLoadingTXT = new CachedText(10.0, "white");
videoAdShowLoadingTXT.setText("Connecting...");
videoAdShowLoadingTXT.renderScale = 1.0; //better quality

var playVideoAd = function () {
  onVideoAdPlaying();
  //lower music volume for the ad
  if (currentMusic) currentMusic.volume = 0.2;
  videoAdIsPlaying = true;

  setSiteMenuVisible(false);

  // do something while video ad is played!

  videoAdShowLoading = true;
  videoAdStartedPlaying = false;

  //adinplay video
  if (videoAdsADINPLAY) {
    adplayer.startPreRoll();
  } else {
    //bolt/playview video
    document.getElementById("pvVidContainer").style.display = "block";

    playPVAd();
  }
};

//ad finished, start game
var onVideoAdFinished = function (successfulPlay) {
  if (!videoAdIsPlaying) {
    console.log("ad isn't playing!");
    //return;
  }

  videoAdIsPlaying = false;

  videoAdStartedPlaying = false;
  videoAdShowLoading = false; //stop showing loading... animation
  //successfulPlay=true; //always success

  //adinplay video
  if (videoAdsADINPLAY) {
  } else {
    //hide video container
    document.getElementById("pvVidContainer").style.display = "none";
    document.getElementById("my-content-2").style.display = "none";
  }

  //save that ad played (only on success!)
  if (successfulPlay) {
    gamesPlayedSinceLastAd = 0;
    lastAdShowT = +new Date();
    if (window.localStorage) {
      //save last ad show time
      try {
        window.localStorage.setItem("lastAdShowT", lastAdShowT);
        window.localStorage.setItem("gamesSinceAd", gamesPlayedSinceLastAd);
      } catch (err) { } //no localStorage
    }
  }

  // so if onFinished function is executed, and if the player is NOT alive in game or Ani-choice
  // shown then join the player otherwise ignore (it could be false execution)

  if (!serverCon_aliveInAGame && !aniChoice_isOpen) {
    //restore music volume for the ad
    if (currentMusic) currentMusic.volume = 0.7;
    //play sound (if not muted)
    var sound_click = getLazyLoadAudio("audio/click.mp3");
    if (sound_click) {
      try {
        sound_click.play();
      } catch (err) { }
    }

    console.log("Video done (success: " + successfulPlay + "), joining game!");
    joinGame(false); //not spectator
  }
};

//helper to load adinplay ads script
var getScript = function (src, callback) {
  var headElm = document.head || document.getElementsByTagName("head")[0];
  var script = document.createElement("script");
  var once = true;
  script.async = "async";
  script.type = "text/javascript";
  script.charset = "UTF-8";
  script.src = src;
  script.onload = script.onreadystatechange = function () {
    if (
      once &&
      (!script.readyState || /loaded|complete/.test(script.readyState))
    ) {
      once = false;
      callback();
      script.onload = script.onreadystatechange = null;
    }
  };

  headElm.appendChild(script);
};

//load video ads
if (!isMobileApp) {
  initVideoAds();
  //initBannerAds();
}

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  PLAYWIRE MEDIA video ads
var pvAdSuccess = false;
var pvAdStartTimeout = null;
var boltPlayerID = "player-2";

var pvFirstLoad = true; //preload ad
var playPVAd = function (firstLoad) {
  pvAdSuccess = false;

  //load/ play ad
  var pvVidContainer = document.getElementById("pvVidContainer");

  //if ad wont start playing for x seconds, skip it!
  pvAdStartTimeout = setTimeout(function () {
    //if this runs, script/ad failed to load
    console.log("Error: ad failed to start playing in time!");
    onVideoAdFinished(true); //prevent trying to play ad again, if failing to load
  }, 10000);

  //start loading ad
  try {
    script = document.createElement("script");
    script.src = "http://cdn.playwire.com/bolt/js/zeus/embed.js";
    script.type = "text/javascript";
    script.id = "script";
    script.setAttribute("charset", "utf-8");
    script.setAttribute(
      "data-config",
      "http://config.playwire.com/1018393/v2/pre_content.json"
    );
    script.setAttribute("data-width", "100%");
    script.setAttribute("data-height", "100%");
    script.setAttribute("data-id", boltPlayerID); //name of player

    //added data-onready attribute
    script.setAttribute("data-onready", "onBoltLoaded");
    script.setAttribute("data-post-ad-container", "my-content-2");

    script.setAttribute(
      "data-theme",
      "http://cdn.playwire.com/bolt/js/zeus/themes/orion/main.js"
    );

    pvVidContainer.appendChild(script);
    console.log("loading player...");
  } catch (e) {
    console.log("Error: " + e);
  }
};

//prevent obfuscation of callback method, create var from string!
window["onBoltLoaded"] = function (playerName) {
  console.log("onBoltLoaded: playerName '" + playerName + "'");

  Bolt.on(playerName, "showHiddenContainer", function () {
    console.log("BOLT showHiddenContainer fired");
    onVideoAdFinished(pvAdSuccess);
  });
  Bolt.on(playerName, Bolt.BOLT_AD_STARTED, function () {
    clearTimeout(pvAdStartTimeout);
    console.log("AD STARTED: SUCCESS");

    videoAdStartedPlaying = true;
    pvAdSuccess = true; //mark that ad finished!
  });
  Bolt.on(playerName, Bolt.BOLT_AD_ERROR, function () {
    console.log("AD ERROR EVENT FIRED");
    onVideoAdFinished(pvAdSuccess); //could have started, but experienced an error later
  });
  /*Bolt.on(playerName, Bolt.BOLT_AD_COMPLETE, function() {
    // do something
    console.log( 'BOLT_AD_COMPLETE Fired' );
    pvAdSuccess = true;
    onVideoAdFinished(true);
});*/
};

///////
// file: js_src/client/mobileApp.js
///////

//detelct mobile app/ mobile browser @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

//console.log("is mobile? " + isMobileAppIOS);

//obj-c bridge for ios app
var jsObjcBridge;

function setupWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
    return callback(WebViewJavascriptBridge);
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback);
  }
  window.WVJBCallbacks = [callback];
  var WVJBIframe = document.createElement("iframe");
  WVJBIframe.style.display = "none";
  WVJBIframe.src = "wvjbscheme://__BRIDGE_LOADED__";
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function () {
    document.documentElement.removeChild(WVJBIframe);
  }, 0);
}

if (isMobileAppIOS) {
  setupWebViewJavascriptBridge(function (bridge) {
    var uniqueId = 1;
    jsObjcBridge = bridge;
  });
}
//call this to show ad in ios mobile app
var showAdMobileIOS = function () {
  if (jsObjcBridge && isMobileAppIOS) {
    console.log("Showing ad IOS...");
    jsObjcBridge.callHandler(
      "adShowCallBack",
      {
        foo: "bar",
      },
      function (response) {
        console.log("JS got response " + response);
      }
    );
  }
};

//android app ads calling
var showAdMobileAndroid = function () {
  console.log("Showing ad android...");
  window.location = "myscheme://showAdmob";
};

function showMobileAd() {
  console.log("showing mobile ad......");
  if (isMobileAppIOS) showAdMobileIOS();
  if (isMobileAppAndroid) showAdMobileAndroid();
}

//@@@@@@@@@@@@@@@@@@@@  SETUP MOBILE @@@@@@@@@@@@@@@@@@@@@@@@@@

//detect iOS device (redirect to app!)
var isiOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
var isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1;
if ((isiOS || isAndroid) && !isMobileApp) {
  var oldVisitor = false;
  if (window.localStorage) {
    //dont redirect people more than once
    oldVisitor = window.localStorage.getItem("oldVisitor") > 0;
    try {
      window.localStorage.setItem("oldVisitor", 1);
    } catch (err) {
      oldVisitor = true;
    } //no localStorage= no redirects
  }
  if (!oldVisitor) {
    //console.log("ios device detected, sending to app store!");
    if (isiOS)
      window.location.href =
        "https://itunes.apple.com/us/app/mope.io/id1086471119?ls=1&mt=8";
    else if (isAndroid)
      window.location.href =
        "https://play.google.com/store/apps/details?id=tatarnykov.stan.mopeioandroid";
  } else {
    //console.log("ios/android device: not redirecting anymore!");
  }
}

///////
// file: js_src/interface/interface.js
///////

//like a static class, for better organization
var GameInterface = {};
function drawGameInterface() {
  if (!serverCon_aliveInAGame) return;

  ctx.save();

  //ease animated vars
  waterBarPerc += (waterBarPerc_n - waterBarPerc) * 0.1;

  xpPer += (xpPer_n - xpPer) * 0.03;
  //flashing LOW water animation

  var myPlayer = gameObjsByID[myPlayerID];
  if (myPlayer) {
    myPlayerLastAniT = myPlayer.animalType;
  }

  var waterBarA = 1.0;
  var lowBarPerc = waterBarPerc <= 25;
  if (lowBarPerc) {
    var period = 1.2; //periodic func with time
    var p_min = 0.4,
      p_max = 1.0;
    var amp = 0.5 * (p_max - p_min);
    waterBarA =
      p_min +
      amp +
      amp * Math.sin(((2.0 * Math.PI) / period) * (timestamp / 1000.0));
  }

  //water bar
  var barW = Math.min(450, canvasW * 0.9) * interfS,
    barH = 30 * interfS;
  var bx = canvasW / 2, //from bottom
    by = canvasH - 60 * interfS;
  ctx.globalAlpha = 0.35 * waterBarA; //bar bg
  ctx.fillStyle = "#000000";
  ctx.fillRect(bx - barW / 2, by - barH / 2, barW, barH);

  ctx.globalAlpha = waterBarA;
  if (animalBarType == 2)
    // myPlayerLastAniT == a_blackDragon || myPlayerLastAniT == a_phoenix)
    ctx.fillStyle = col_lava;
  else ctx.fillStyle = isAirBar || animalBarType == 1 ? "#8CCEF4" : col_wat1; //bar fill

  ctx.fillRect(
    bx - barW / 2,
    by - barH / 2,
    barW * (waterBarPerc / 100.0),
    barH
  );

  ctx.fillStyle = controls_leftClicked
    ? lowBarPerc
      ? col_food1
      : "orange"
    : lowBarPerc
      ? col_food1
      : "white";
  ctx.globalAlpha = 1.0 * waterBarA;

  //text settings
  var barTxt;
  if (animalBarType == 1) barTxt = lowBarPerc ? "LOW AIR" : "AIR";
  else if (animalBarType == 2) barTxt = lowBarPerc ? "LOW LAVA" : "LAVA";
  else if (animalBarType == 3) barTxt = lowBarPerc ? "LOW ICE" : "ICE";
  else {
    barTxt = lowBarPerc ? "LOW WATER" : "WATER";
  }

  waterBarTXT.setText(barTxt);
  waterBarTXT.setFontSize(22.0 * interfS);
  if (animalBarType == 4) waterBarTXT.setColor("black");
  else waterBarTXT.setColor(lowBarPerc ? col_food1 : "white");
  waterBarTXT.x = bx;
  waterBarTXT.y = by;
  ctx.globalAlpha *= lowBarPerc ? 1.0 : 0.5;
  waterBarTXT.draw();

  ctx.globalAlpha = 0.35;
  ctx.fillStyle = "#000000"; //bar bg
  by = canvasH - barH / 2 - 5;
  // by = by + 5 + barH;
  barW = canvasW * 0.9;

  ctx.fillRect(bx - barW / 2, by - barH / 2, barW, barH); //bg
  ctx.globalAlpha = 1.0;
  ctx.fillStyle = "#F3C553"; //col_food2; //bar
  ctx.fillRect(bx - barW / 2, by - barH / 2, barW * (xpPer / 100.0), barH); //fill
  ctx.globalAlpha = 1.0;

  xpBarTXT.setText(
    "" + formatNumK(xp) + " xp  (" + formatNumK(xpNextAni) + " xp Next Animal)"
  );
  xpBarTXT.setFontSize(22.0 * interfS);
  xpBarTXT.x = bx;
  xpBarTXT.y = by;
  xpBarTXT.draw();

  ctx.globalAlpha = 1.0;
  //}

  //draw touch/ability buttons
  for (var k = 0; k < allTouchButtons.length; k++) {
    var aTouchBut = allTouchButtons[k];
    aTouchBut.draw();
  }

  create1v1Button();

  if (isTouchEnabled) {
    //draw joystick
    joystickA += ((joyStickOpen ? 1.0 : 0.0) - joystickA) * 0.1;
    if (joystickA > 0.005 && serverCon_aliveInAGame) {
      //base
      ctx.globalAlpha = 0.3 * joystickA;
      ctx.beginPath();
      ctx.arc(
        joystickStartX,
        joystickStartY,
        joystickRad * pixelRat,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = "#000000";
      ctx.fill();
      //top
      ctx.globalAlpha = 0.5 * joystickA;
      ctx.beginPath();
      ctx.arc(
        joystickTipX,
        joystickTipY,
        joystickRad * pixelRat * 0.57,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = "#000000";
      ctx.fill();

      //direciton arrow (on screen center)
      var dChange = joystickDirArrowAngle_nDelta * 0.3; //* a;
      joystickDirArrowAngle_nDelta -= dChange;
      joystickDirArrowAngle += dChange;
      joystickDistF += (joystickDistF_n - joystickDistF) * 0.1;
      ctx.save();
      ctx.translate(canvasW / 2, canvasH / 2); //center to screen middle
      ctx.rotate(joystickDirArrowAngle);
      ctx.globalAlpha = 0.5 * joystickA;
      ctx.beginPath();

      ctx.fillStyle = "#000000";

      var arrowRad = 40.0 * pixelRat;
      if (gameObjsByID[myPlayerID])
        //set to own animal rad
        arrowRad = (9.0 + gameObjsByID[myPlayerID].rad) * camzoom;
      arrowRad *= 0.1 + 0.9 * joystickDistF;
      var arrowW = 15.0 * pixelRat; //this gets complied away anyways
      var arrowL = 30.0 * pixelRat * (0.2 + 0.8 * joystickDistF);
      //console.log("len "+arrowL+" f "+joystickDistF);
      //start at angle 0 (rad), so move rightwards
      ctx.moveTo(arrowRad + arrowL, 0); //tip of arrow
      ctx.lineTo(arrowRad, arrowW / 2);
      ctx.lineTo(arrowRad, -arrowW / 2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  //DRAW: xp plus popups
  for (var k = plusXpPopups.length - 1; k >= 0; k--) {
    //iterate backwards to allow removing
    var anItem = plusXpPopups[k];
    anItem.draw();

    if (anItem.timedOut) plusXpPopups.splice(k, 1); //remove timed out item
  }

  ctx.restore();

  if (endScreenCanvas != null) {
    ctx.save();
    endScreenCanvas.width &&
      ctx.drawImage(
        endScreenCanvas,
        canvasW / 2 - endScreenCanvas.width / 2,
        endScreenY,
        endScreenCanvas.width,
        endScreenCanvas.height
      );
    ctx.restore();
  }
}

//draw big midscreen text
var screenText = "Ready to survive!";
var screenTextFontSize = 25.0;
var screenTextCol = "white";
var screenTextEndT = +new Date() + 0;

//instructions
var screenIns_objsEdible = []; //array of new edible objs (shown in instructions)
var screenIns_EndT = +new Date() + 0;
var screenIns_A = 0.0;
var screenIns_objsEdible_fullW = 100;
var screenIns_scaleF = 2.0;
var screenIns_drawNewPlayerIns = false;

//animal choice interface
var aniChoice_isOpen = false;
var aniChoice_A = 0.0;
var aniChoice_choiceButtons = []; //buttons to be rendered
var aniChoice_joinGameAfter = false;
var aniChoice_startT = 0;
var aniChoice_timeOutT = 0;

function showScreenTextWithDur(newText, newDur) {
  screenText = newText;
  screenTextEndT = +new Date() + newDur;
}

function drawScreenText() {
  //draw screen text
  var fadeDur = 1.0;
  var a = (screenTextEndT - timestamp) / 1000.0 / fadeDur;
  a = 0 > a ? 0 : 1 < a ? 1 : a; //clamp from 0-1
  if (a > 0) {
    ctx.save();
    ctx.globalAlpha = a;

    /*ctx.font = 25.0 * interfS + "px Arial";
        ctx.lineWidth = 1;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle"; //vertical center
        if (!options_lowGraphics) {
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.shadowColor = "black";
        }
        ctx.fillStyle = screenTextCol;

        fillTextMultiLine(screenText, canvasW / 2, canvasH * 0.3); */

    screenTXT.setText(screenText);
    screenTXT.setColor(screenTextCol);
    screenTXT.setFontSize(screenTextFontSize * interfS);
    screenTXT.x = canvasW / 2;
    screenTXT.y = canvasH * 0.3;
    screenTXT.draw();

    ctx.restore();
  }

  //draw instructions if needed
  var idealA = screenIns_EndT - timestamp > 0 ? 1.0 : 0.0;
  screenIns_A += (idealA - screenIns_A) * 0.05;
  //var fadeDur = 1.0;
  //var a = (screenIns_EndT - timestamp) / 1000.0 / fadeDur;
  //a = 0 > a ? 0 : 1 < a ? 1 : a; //clamp from 0-1
  //screenIns_A=a;
  if (screenIns_A > 0.01 && !options_lowGraphics) {
    //draw NEW things that you can eat

    //draw extra instructions for NEW players
    //console.log(screenIns_A);
    if (screenIns_drawNewPlayerIns) {
      ctx.save();

      ctx.translate(canvasW / 2, canvasH * (0.9 + 0.3 * (1.0 - screenIns_A))); //draw relative to center

      //draw instuctions image
      var eatImg = getLoadedImg("./img/howToPlay1.png");
      if (eatImg) {
        var rectW = canvasH * 0.2; // *interfS;
        //console.log("interface scale "+interfS+", canvas min "+canvasH+" rectW="+rectW);
        var scaleF = (rectW / eatImg.height) * screenIns_A;
        ctx.drawImage(
          eatImg,
          -0.5 * eatImg.width * scaleF,
          -1.0 * eatImg.height * scaleF,
          eatImg.width * scaleF,
          eatImg.height * scaleF
        );
      }

      ctx.restore();
    }

    //ctx.restore();
  }

  //draw animal choice interface
  //draw instructions if needed
  var idealA = aniChoice_isOpen ? 1.0 : 0.0;
  aniChoice_A += (idealA - aniChoice_A) * 0.1;
  if (aniChoice_A > 0.01) {
    //draw NEW things that you can eat

    if (aniChoice_choiceButtons.length > 0) {
      ctx.save();
      ctx.translate(0, canvasH * (-0.5 * (1.0 - aniChoice_A))); //move-in effect

      //re-position all buttons (in case of re-size)
      var buttonW = 170 * interfS; //aniChoice_choiceButtons[0].w;
      var spacingW = 10; //distance between objs

      var primaryButtonW = buttonW + 20.0;
      var totalW =
        Math.max(0, aniChoice_choiceButtons.length - 1) * (spacingW + buttonW) +
        (primaryButtonW - buttonW); //total W of all spacings (can easily position as fractions of this)

      var nextX = canvasW / 2.0 - totalW / 2;
      for (var J = 0; J < aniChoice_choiceButtons.length; J++) {
        var anO = aniChoice_choiceButtons[J];

        if (J == 0) anO.buttonScaleF = primaryButtonW / buttonW;
        else anO.buttonScaleF = 1.0;

        anO.w = buttonW;
        anO.h = buttonW;

        anO.x = nextX; //canvasW / 2.0 - (totalW / 2) + totalW * (J / Math.max(1, aniChoice_choiceButtons.length - 1));
        anO.y = canvasH * 0.25;
        nextX += (anO.w / 2) * anO.buttonScaleF + buttonW / 2 + spacingW;

        //anO.oRad=anO.rad;

        //anO.nRad=idealRad; ////scaled by 2X later
      }

      ctx.globalAlpha = aniChoice_A;
      //ctx.scale(2,2); //scaled up
      for (var J = 0; J < aniChoice_choiceButtons.length; J++) {
        var anO = aniChoice_choiceButtons[J];
        anO.draw();
      }
      //ctx.restore();
    }

    //draw extra instructions for NEW players
    var tLeftS = Math.max(0, aniChoice_timeOutT - timestamp) / 1000.0; //before interface times out

    //flash text when low time
    var textA = 1.0;
    if (tLeftS != 0 && tLeftS < 8) {
      var period = 1.2; //periodic func with time
      var p_min = 0.4,
        p_max = 1.0;
      var amp = 0.5 * (p_max - p_min);
      textA =
        p_min +
        amp +
        amp * Math.sin(((2.0 * Math.PI) / period) * (timestamp / 1000.0));
    }

    ctx.save();
    ctx.globalAlpha = aniChoice_A * textA;
    ctx.fillStyle = tLeftS != 0 && tLeftS < 8 ? "red" : "white";
    ctx.font = 25.0 * interfS + "px Arial";
    ctx.lineWidth = 1;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"; //vertical center
    if (!options_lowGraphics) {
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.shadowColor = "black";
    }
    var yTop = aniChoice_choiceButtons[0].y - aniChoice_choiceButtons[0].w / 2;

    var tString = tLeftS > 0 ? " (auto in " + Math.trunc(tLeftS) + "s)" : ""; //round to 1 dec
    ctx.fillText(
      aniChoice_joinGameAfter
        ? "Choose which animal to spawn as:" + tString
        : "Choose an upgrade:" + tString,
      canvasW / 2,
      yTop - 25 * pixelRat
    );
    ctx.restore();

    ctx.restore();
  }

  // we need an anchor here to inject custom interface methods
  /// battle royal messages:
  //    if (window.gameMode_interface)
  //        window.gameMode_interface();
  if (_gameMode != null) {
    _gameMode.interface();
  }

  buildInviteScreen();

  if (inviteScreenCanvas != null) {
    inviteScreenCanvas.width &&
      ctx.drawImage(
        inviteScreenCanvas,
        canvasW / 2 - inviteScreenCanvas.width / 2,
        inviteScreenPos,
        inviteScreenCanvas.width,
        inviteScreenCanvas.height
      );
  }
  gameModeDrawInterfaceButtons();
  display1v1TopperInfo();
}
function gameModeDrawInterfaceButtons() {
  if (_gameMode != null)
    if (_gameMode.interfaceButtons) {
      for (var i = 0; i < _gameMode.interfaceButtons.length; i++) {
        var aBut = _gameMode.interfaceButtons[i];
        if (aBut.isVisible) {
          aBut.draw();
        }
      }
    }
}
var minimapW = 250.0,
  minimapH = 250.0; //width of the canvas (used during draw)

var oceanWid = 0;
var arcticW = 0;
var arcticH = 0;
function generateMinimap(msg) {
  //scale minimap based on ratio for minimap
  minimapW = minimapH * (gameW / gameH);

  //offscreen canvas to render and save minimap (performance+ease)
  if (!miniMapCanvas) miniMapCanvas = document.createElement("canvas");

  miniMapCanvas.width = minimapW;
  miniMapCanvas.height = minimapH;
  var ctx_ = miniMapCanvas.getContext("2d");

  ctx_.globalAlpha = 0.35;
  ctx_.fillStyle = "#000000";
  ctx_.fillRect(0, 0, miniMapCanvas.width, miniMapCanvas.height);

  //parse msg, draw data on miniMap
  var minimapScaleF_x = minimapW / 200.0; // / size scaled to for msg send
  var minimapScaleF_y = minimapH / 200.0;

  //oceans: just send width (oceans are always at left/right sides)
  oceanWid = msg.readUInt16();
  arcticW = msg.readUInt16();
  arcticH = msg.readUInt16();

  //if(!snowflakesDrawnForActic) drawSnowFlakesInArctic(arcticW, arcticH);
  for (var i = 0; i < 2; i++) {
    ctx_.fillStyle = col_ocean;
    ctx_.globalAlpha = 0.5;
    var tF = minimapW / gameW;
    if (i == 0)
      //left SIDE
      ctx_.fillRect(0 * tF, arcticH * tF, oceanWid * tF, gameH * tF);
    //r SIDE
    else
      ctx_.fillRect(
        (gameW - oceanWid) * tF,
        arcticH * tF,
        oceanWid * tF,
        gameH * tF
      );
  }
  //draw arctic (centered at top)
  ctx_.fillStyle = "white";
  ctx_.globalAlpha = 0.5;
  var tF = minimapW / gameW;
  ctx_.fillRect(
    (gameW / 2 - arcticW / 2) * tF,
    0 * tF,
    arcticW * tF,
    arcticH * tF
  );

  //draw river
  var numWater = msg.readUInt16();
  ctx_.fillStyle = col_ocean;
  ctx_.globalAlpha = 0.5;
  for (var i = 0; i < numWater; i++) {
    // rivers
    var riverW = msg.readUInt16() * (minimapW / gameW);
    var riverH = msg.readUInt16() * (minimapH / gameH);
    var riverX = msg.readUInt16() * (minimapW / gameW);
    var riverY = msg.readUInt16() * (minimapH / gameH);

    ctx_.globalAlpha = 0.5;
    var tF = minimapW / gameW;
    ctx_.fillRect(riverX - riverW / 2, riverY - riverH / 2, riverW, riverH);
  }

  //volcano biome
  var numWater = msg.readUInt16();
  ctx_.fillStyle = col_lava;
  for (var i = 0; i < numWater; i++) {
    var volcanoRad = msg.readUInt8() * 5.0;
    var volcanoX = msg.readUInt16() * (minimapW / gameW);
    var volcanoY = msg.readUInt16() * (minimapH / gameH);
    ctx_.beginPath();
    ctx_.arc(
      volcanoX,
      volcanoY,
      Math.max(1, volcanoRad * (minimapW / gameW)),
      0,
      2 * Math.PI
    );
    ctx_.fill();
  }

  // danger area
  /*var numWater = msg.readUInt16();
    for (var i = 0; i < numWater; i++) {
        var mainRad = msg.readUInt8() * 5.0;
        var shrinkRad = msg.readUInt8() * 5.0;
        var areaX = msg.readUInt16() * (minimapW / gameW);
        var areaY = msg.readUInt16() * (minimapH / gameH);
        var areaW = msg.readUInt16() * (minimapW / gameW);
        var areaH = msg.readUInt16() * (minimapH / gameH);
        ctx_.beginPath();
        ctx_.fillStyle = "red";
        ctx_.globalAlpha = 0.3;
        ctx_.fillRect(areaX - areaW / 2, areaY - areaH / 2, areaW, areaH);


        ctx_.fillStyle = "limegreen";
        ctx_.globalAlpha = 0.7;
        ctx_.arc(areaX, areaY, Math.max(1, shrinkRad * (minimapW / gameW)), 0, 2 * Math.PI);
        ctx_.fill()
    }*/

  //lakes
  var numWater = msg.readUInt16();
  ctx_.fillStyle = col_wat1;
  ctx_.globalAlpha = 0.5;
  for (var i = 0; i < numWater; i++) {
    //lakes
    var x = msg.readUInt8() * minimapScaleF_x;
    var y = msg.readUInt8() * minimapScaleF_y;
    var rad = msg.readUInt8() * 5.0; //scaled down here
    ctx_.beginPath();
    ctx_.arc(x, y, Math.max(1, rad * (minimapW / gameW)), 0, 2 * Math.PI);
    ctx_.fill();
  }

  //mud spots
  var numWater = msg.readUInt16();
  ctx_.fillStyle = "#907A33";
  ctx_.globalAlpha = 0.7;
  for (var i = 0; i < numWater; i++) {
    //mud areas
    var x = msg.readUInt8() * minimapScaleF_x;
    var y = msg.readUInt8() * minimapScaleF_y;
    var rad = msg.readUInt8() * 5.0; //scaled down here
    ctx_.beginPath();
    ctx_.arc(x, y, Math.max(1, rad * (minimapW / gameW)), 0, 2 * Math.PI);
    ctx_.fill();
  }
  var numWater = msg.readUInt16();
  ctx_.fillStyle = "#7BB7BB";
  ctx_.globalAlpha = 0.85;
  for (var i = 0; i < numWater; i++) {
    //ice areas
    var x = msg.readUInt8() * minimapScaleF_x;
    var y = msg.readUInt8() * minimapScaleF_y;
    var rad = msg.readUInt8() * 5.0; //scaled down here
    ctx_.beginPath();
    ctx_.arc(x, y, Math.max(1, rad * (minimapW / gameW)), 0, 2 * Math.PI);
    ctx_.fill();
  }
  var numWater = msg.readUInt16();
  ctx_.fillStyle = col_outline_land;
  ctx_.globalAlpha = 1.0;
  for (var i = 0; i < numWater; i++) {
    //hills
    var x = msg.readUInt8() * minimapScaleF_x;
    var y = msg.readUInt8() * minimapScaleF_y;
    var rad = msg.readUInt8() * 5.0; //scaled down here
    ctx_.beginPath();
    ctx_.arc(x, y, Math.max(1, rad * (minimapW / gameW)), 0, 2 * Math.PI);
    ctx_.fill();
  }
  var numWater = msg.readUInt16();
  ctx_.fillStyle = "#A89937";
  ctx_.globalAlpha = 0.6;
  for (var i = 0; i < numWater; i++) {
    //lake islands
    var x = msg.readUInt8() * minimapScaleF_x;
    var y = msg.readUInt8() * minimapScaleF_y;
    var rad = msg.readUInt8() * 5.0; //scaled down here
    ctx_.beginPath();
    ctx_.arc(x, y, Math.max(1, rad * (minimapW / gameW)), 0, 2 * Math.PI);
    ctx_.fill();
  }
  var numWater = msg.readUInt16(); //food spots
  ctx_.fillStyle = col_food1;
  ctx_.globalAlpha = 1.0;
  for (var i = 0; i < numWater; i++) {
    var x = msg.readUInt8() * minimapScaleF_x;
    var y = msg.readUInt8() * minimapScaleF_y;

    ctx_.beginPath();
    ctx_.arc(x, y, Math.max(2.5, 40.0 * (minimapW / gameW)), 0, 2 * Math.PI);
    ctx_.fill();
  }

  var numWater = msg.readUInt16(); //water spots
  ctx_.fillStyle = col_wat1;
  ctx_.globalAlpha = 1.0;
  for (var i = 0; i < numWater; i++) {
    var x = msg.readUInt8() * minimapScaleF_x;
    var y = msg.readUInt8() * minimapScaleF_y;

    ctx_.beginPath();
    ctx_.arc(x, y, Math.max(2.5, 50.0 * (minimapW / gameW)), 0, 2 * Math.PI);
    ctx_.fill();
  }
}

//XP popups
var plusXpPopups = [];
var lastPopupXPAm = 0;
var lastPopupT = 0;
function interface_onXPAmountUpdate(newAmount, oldAmount) {
  var xpGained = newAmount - lastPopupXPAm;

  if (
    newAmount - lastPopupXPAm != 0 &&
    (timestamp - lastPopupT) / 1000.0 > 0.7
  ) {
    //over 0.5s since last popup
    lastPopupXPAm = newAmount;
    lastPopupT = timestamp;

    //new popup
    var newPop = new PlusXPPopup(xpGained);

    plusXpPopups.push(newPop);
  }
}

function drawLeaderboard() {
  // if (gameMode != gameMode_teamMode)
  //   if (lbCanvas && serverCon_aliveInAGame) {
  //     lbCanvas.width &&
  //       ctx.drawImage(
  //         lbCanvas,
  //         10 * pixelRat,
  //         28 * pixelRat,
  //         lbCanvas.width * interfS,
  //         lbCanvas.height * interfS
  //       );
  //   }

  if (_gameMode != null) _gameMode.drawLeaderboard();
}

function drawMinimap() {
  //draw minimap (pre-rendered)
  if (
    canvasW / pixelRat >= 500 &&
    miniMapCanvas &&
    miniMapCanvas.width &&
    serverCon_aliveInAGame
  ) {
    ctx.drawImage(
      miniMapCanvas, //minimapCanvas == width & height of minimapW/H
      canvasW - (10 * pixelRat + miniMapCanvas.width * interfS),
      10 * pixelRat,
      minimapW * interfS, //minimapW && h == 250;
      minimapH * interfS //interfS = 0.85 * pixelRat * Math.max(windowW / 1920, windowH / 1080); || maybe 1.0
    );

    //draw own player on minimap
    var myPlayerObj = gameObjsByID[myPlayerID];
    if (myPlayerObj) drawPlayerOnMiniMap(myPlayerObj, "white", 1.0);
  }
}

function drawPlayerOnMiniMap(myPlayerObj, color, radF) {
  if (myPlayerObj) {
    ctx.fillStyle = color;
    ctx.beginPath();
    var plR =
      pixelRat * Math.max(3, myPlayerObj.rad * (miniMapCanvas.width / gameW));
    ctx.arc(
      canvasW -
      (10 * pixelRat + miniMapCanvas.width * interfS) +
      (myPlayerObj.x * (miniMapCanvas.width * interfS)) / gameW,
      10 * pixelRat +
      (myPlayerObj.y * (miniMapCanvas.height * interfS)) / gameH,
      plR * radF,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }
}

function drawObjOnMiniMap(obj, color, radF) {
  if (obj) {
    ctx.fillStyle = color;
    ctx.beginPath();
    var plR = pixelRat * Math.max(2, obj.rad);
    ctx.arc(
      canvasW -
      (10 * pixelRat + miniMapCanvas.width * interfS) +
      (obj.x * (miniMapCanvas.width * interfS)) / gameW,
      10 * pixelRat + (obj.y * (miniMapCanvas.height * interfS)) / gameH,
      plR * radF,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }
}

//generate leaderboard
function updateLeaderBoard(lbData, roomPlayers, ownRank) {
  lbCanvas = null;
  if (0 != lbData.length) {
    lbCanvas = document.createElement("canvas");
    var ctx_ = lbCanvas.getContext("2d"),
      boardLength = 55;
    var nameH = 22;
    boardLength = boardLength + nameH * lbData.length;
    lbCanvas.width = 270;
    lbCanvas.height = boardLength;

    ctx_.globalAlpha = 0.2;
    ctx_.fillStyle = "#000000";
    ctx_.fillRect(0, 0, lbCanvas.width, lbCanvas.height);

    ctx_.globalAlpha = 1;
    ctx_.fillStyle = "#FFFFFF";
    var str = curServer.name; //"Top Players";
    ctx_.font = "24px Arial";
    if (!options_lowGraphics) {
      ctx_.shadowOffsetX = 1;
      ctx_.shadowOffsetY = 1;
    }
    ctx_.shadowColor = "black";
    ctx_.fillText(
      str,
      lbCanvas.width / 2 - ctx_.measureText(str).width / 2,
      40
    );
    var rank;

    ctx_.textAlign = "left";
    //ctx_.textBaseline = "middle"; //vertical center

    for (ctx_.font = "17px Arial", rank = 0; rank < lbData.length; ++rank) {
      str = options_noNames ? "" : lbData[rank].name || "mope.io";

      if (ownRank == lbData[rank].rank) {
        ctx_.fillStyle = "#FEED92";
        if (options_noNames) str = "you";
      } else ctx_.fillStyle = "#FFFFFF";

      str =
        lbData[rank].rank +
        ". " +
        str +
        " (" +
        formatNumK(lbData[rank].score) +
        ")";
      ctx_.fillText(str, 15, 65 + nameH * rank);
    }
  }
}

//interface hide/shows
function setSiteMenuVisible(visible) {
  document.getElementById("startMenuWrapper").style.display = visible
    ? "block"
    : "none";
}
function onClickContinue() {
  playPressed();
  //setSiteMenuVisible(true);
  document.getElementById("endScreen").style.display = "none";
}

function hideEndScreen() {
  var endScreen = document.getElementById("endScreen");
  if (endScreen) {
    this.endScreenDisplayed = true;
    endScreen.innerHTML = "";
    endScreen.style.display = "none";
    endScreen.style.marginTop = "0px";
  }
}
function onClickShowMenu() {
  setSiteMenuVisible(true);
  document.getElementById("moneyRectangle").style.marginTop = "55px";
  document.getElementById("mopeMenu").style.display = "block";
  document.getElementById("endScreen").style.display = "none";
}

function showBannerAds() { }

function showMopeMenu() {
  document.getElementById("mopeMenu").style.display = "block";
}

function resetClient() {
  // call this funciton when a game mode is reset. this way client no longer retains old game objects
  // start again!
  console.log("client objs reset!");
  gameObjs = [];
  gameObjsByID = {};
  remGameObjs = [];
}

var drawLabelValueOn = function (c, label, value, x, y) {
  c.fillText(label, x, y);
  c.fillText(": " + value, x + 120, y);
};

function create1v1Button() {
  if (can1v1) {
    if (btn1v1 == null) {
      btn1v1 = new InterfaceButton(0, 0, 60, 60, "Invite for 1v1", 30);
      btn1v1.showLabeleOnHover = true;
      btn1v1.textShadow = true;
      btn1v1.drawTextOnHowever = function () {
        this.drawText(this.w / 2, this.h + this.h / 2);
      };

      btn1v1.onClick = function () {
        if (!this.clicked) {
          this.isVisible = false;
          this.clicked = true;
          this.isHighLighted = false;
          var mes = new MsgWriter(2);
          mes.writeUInt8(52); // Msg_1v1Mode_invitePlayer;
          mes.writeUInt8(0); //1=down, 0=up
          wsSendMsg(mes);
        }
      };
      btn1v1.onMouseMove = function () { };
      btn1v1.update = function () {
        this.x = canvasW / 2 - this.w / 2;
        this.y = 45 * interfS + this.h / 2; //(canvasH / 2) - 250;
        //if (gameMode == gameMode_battleRoyal) this.y += 50 * interfS;
      };

      btn1v1.onInterfaceReset = function () {
        this.isVisible = false;
        btn1v1 = null;
      };

      btn1v1.onAfterDraw = function () {
        var theImg = getLoadedImg("img/icons/1v1.png");
        if (theImg) {
          ctx.save();

          var iw = this.w * 0.8;
          var pad = (this.w - iw) / 2;
          ctx.drawImage(theImg, this.x + pad, this.y + pad, iw, iw);
          ctx.restore();
        }
      };
      _gameMode.interfaceButtons.push(btn1v1);
    } else {
      if (btn1v1 != null) {
        btn1v1.isVisible = show1v1Button;
        if (btn1v1.isVisible) btn1v1.clicked = false;
        btn1v1.draw();
      }
    }
  }
}

var _displayPlayerCounter = 0;
function displayPlayerStats() {
  _displayPlayerCounter++;

  if (_displayPlayerCounter % 500 == 0) {
    _displayPlayerCounter = 0;
    if (displayWinsGoals == 1) displayWinsGoals = 0;
    else displayWinsGoals = 1;
  }

  if (!can1v1 || player1v1ArenaWins == 0) displayWinsGoals = 1;

  if (player1v1ArenaWins > 0 || playerGoalsScore > 0) {
    var displayCounterNumb = 0;
    var displayLabel = "";
    if (displayWinsGoals == 0) {
      displayCounterNumb = player1v1ArenaWins;
      displayLabel = "1v1 WINS";
    } else if (displayWinsGoals == 1) {
      displayCounterNumb = playerGoalsScore;
      displayLabel = "GOALS";
    }

    if (displayCounterNumb > 0) {
      ctx.save();
      player1v1TXT.setText(displayLabel + ": " + displayCounterNumb);
      player1v1TXT.setFontSize(30.0 * interfS);
      player1v1TXT.setColor("white");
      player1v1TXT.x = canvasW / 2;
      player1v1TXT.y = canvasH - 95 * interfS;
      ctx.globalAlpha = 1;
      player1v1TXT.draw();
      ctx.restore();
    }
  }
}
var displayWinsGoals = 0;
var inviteScreenCanvas = null;
var inviteScreenPos = 0;
function buildInviteScreen() {
  /* player1v1Requests = [];
  for (i = 0; i < 1; i++) {
    var id = i;
    var fromPlayer = "test " + (i + 1);
    var reqDur = 10000;
    player1v1Requests.push({
      id: id,
      requestee: fromPlayer,
      aniType: 1,
      wins: 1,
      teamID: 1,
      rank: 1,
      dur: reqDur
    });
  }
  */
  if (player1v1Requests.length == 0) {
    removeExpiredRequestButtons();
    inviteScreenCanvas = null;
    return;
  }

  if (inviteScreenCanvas == null)
    inviteScreenCanvas = document.createElement("canvas");

  if (inviteScreenCanvas == null) return;

  var ctx_ = inviteScreenCanvas.getContext("2d");
  var boardLength = 55;
  var nameH = 40;
  var pad = 5;

  var borad_height = 200 + player1v1Requests.length * 80;
  var borad_width = 420;

  boardLength = borad_height + pad * 2;
  inviteScreenCanvas.width = borad_width + pad * 2;
  inviteScreenCanvas.height = boardLength;
  var screenPos = 300;
  inviteScreenPos = screenPos;
  ctx_.globalAlpha = 0.2;
  ctx_.fillStyle = "#000000";
  ctx_.fillRect(0, 0, inviteScreenCanvas.width, inviteScreenCanvas.height);
  ctx_.fillStyle = "#000000";
  ctx_.fillRect(
    pad,
    pad,
    inviteScreenCanvas.width - pad * 2,
    inviteScreenCanvas.height - pad * 2
  );
  var y = pad;
  ctx_.globalAlpha = 1;
  ctx_.fillStyle = "#FFFFFF";
  ctx_.font = "30px Arial";

  y += 55;

  var str = "1v1 REQUEST"; //"Top Players";
  ctx_.font = "30px Arial";
  ctx_.fillText(
    str,
    inviteScreenCanvas.width / 2 - ctx_.measureText(str).width / 2,
    y
  );

  //screenPos -= boardLength / 2;
  // screenPos += 40;
  screenPos = 100;
  var btnY = 0;
  for (r = 0; r < player1v1Requests.length; r++) {
    var req = player1v1Requests[r];
    ctx_.save();
    ctx_.fillStyle = "red";
    ctx_.globalAlpha = 0.5;
    ctx_.fillRect(inviteScreenCanvas.width - 60, 10, 50, 50);
    ctx_.restore();
    ctx_.save();
    str = "" + req.dur;
    ctx_.font = "30px Arial";
    ctx_.fillText(
      str,
      inviteScreenCanvas.width - 35 - ctx_.measureText(str).width / 2,
      45
    );
    ctx_.restore();
    ctx_.font = "20px Arial";

    str = req.requestee + " invites you for 1v1 ";
    ctx_.fillText(
      str,
      inviteScreenCanvas.width / 2 - ctx_.measureText(str).width / 2,
      screenPos
    );

    var x = pad + 15;
    y = screenPos + 40;
    drawLabelValueOn(ctx_, "Animal", "", x, y);

    var aniInfo = infoForAnimalType(req.aniType);
    var theImg = getLoadedImg("./skins/" + aniInfo.skinName + ".png");

    if (theImg) {
      ctx_.save();
      ctx_.drawImage(theImg, x + 130, y - 30, 50, 50);
      ctx_.restore();
    }

    x += 210;
    drawLabelValueOn(ctx_, "1v1 Wins", req.wins, x, y);
    y += 40;
    x = pad + 15;
    var teamLabel = gameMode == gameMode_teamMode ? "Team" : "Kills";
    var teamVal = gameMode == gameMode_teamMode ? "" : req.kills;
    drawLabelValueOn(ctx_, teamLabel, "", x, y);

    if (gameMode == gameMode_teamMode) {
      ctx_.save();
      var cx = x + 155;
      var cy = y - 10 / 2;
      ctx_.fillStyle = _gameMode.teamColors[req.teamID];
      ctx_.beginPath();
      ctx_.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx_.fill();

      ctx_.restore();
    }
    x += 210;
    drawLabelValueOn(ctx_, "Rank", req.rank, x, y);
    screenPos += 100;
    var btnAccept = create1v1RequestButton(req, "Accept");

    btnAccept.yPos = screenPos;
    btnAccept.update = function () {
      this.x = canvasW / 2 - 140;
      this.y = inviteScreenPos + this.yPos + 10;
    };

    var btnReject = create1v1RequestButton(req, "Reject");
    btnReject.yPos = screenPos;
    btnReject.update = function () {
      this.x = canvasW / 2 - 40;
      this.y = inviteScreenPos + this.yPos + 10;
    };

    var btnIgnore = create1v1RequestButton(req, "Ignore");
    btnIgnore.yPos = screenPos;
    btnIgnore.update = function () {
      this.x = canvasW / 2 + 60;
      this.y = inviteScreenPos + this.yPos + 10;
    };

    screenPos += 80;
  }
}

function create1v1RequestButton(req, label) {
  var hasFound = false;
  for (i = 0; i < _gameMode.interfaceButtons.length; i++) {
    btn = _gameMode.interfaceButtons[i];
    if (btn.reqID == req.id && btn.label == label) {
      hasFound = true;
      return btn;
    }
  }

  if (hasFound) return;

  var btn = new InterfaceButton(0, 0, 80, 40, label, 20);
  btn.reqID = req.id;
  btn.reqAction = btn.onClick = function () {
    this.isHighLighted = false;
    var actionType = 0;
    switch (this.label) {
      case "Accept":
        actionType = 1;
        break;
      case "Reject":
        actionType = 0;
        break;
      case "Ignore":
        actionType = 2;
        break;
    }
    var mes = new MsgWriter(3);
    mes.writeUInt8(53); // Msg_1v1Mode_RequestAction;
    mes.writeUInt8(actionType); //1=accept, 0=reject,2=ignore
    mes.writeUInt8(this.reqID);
    wsSendMsg(mes);
  };
  btn.onInterfaceReset = function () {
    this.isVisible = true;
  };

  btn.isVisible = true;
  _gameMode.interfaceButtons.push(btn);

  return btn;
}

function removeExpiredRequestButtons() {
  if (_gameMode == null || _gameMode.interfaceButtons == null) return;
  for (d = 0; d < _gameMode.interfaceButtons.length; d++) {
    var aBut = _gameMode.interfaceButtons[d];

    if (aBut.reqID !== undefined) {
      var activeRequest = true;
      var found = false;
      for (r = 0; r < player1v1Requests.length; r++) {
        var req = player1v1Requests[r];
        if (req.id == aBut.reqID) {
          found = true;
          break;
        }
      }

      if (!found) activeRequest = false;

      if (!activeRequest || isInArena) {
        var tmp = _gameMode.interfaceButtons.indexOf(aBut);
        if (-1 != tmp) {
          _gameMode.interfaceButtons.splice(tmp, 1);
        }
      }
    }
  }
}

var topperInfoX = 10 * pixelRat;
var topperInfoY = 15 * pixelRat;
var top1v1_isHistoric = false;
var top1v1_wins = "";
var top1v1_name = "";
var topperInfoTxt = null;
var top1v1_since = "";
function buildTopperInfo() {
  var name = "" + top1v1_name;
  if (name.lenght == 0) name = "mope.io";

  var gameType = "";
  var achievType = "";

  gameType = "1v1";
  achievType = "WINS";
  var txt =
    (top1v1_isHistoric ? " ALL TIME " : "") +
    gameType +
    " Pro: " +
    name +
    " (" +
    achievType +
    ": " +
    top1v1_wins +
    ") " +
    "SINCE " +
    top1v1_since;
  if (null == topperInfoTxt) {
    topperInfoTxt = new CachedText(20, "#FFFFFF"); //"#043400");
    topperInfoTxt.strokeW = 2;
    topperInfoTxt.multiLine = true;
    topperInfoTxt.renderScale = 2.0; //render larger to undo 'zoom of 3x'
    topperInfoTxt.setText(txt);
    topperInfoTxt.setPos = function (nw, nx) {
      this.x += nw / 2;
    };
  } else {
    topperInfoTxt.setFontSize(20);
    topperInfoTxt.setText(txt);
    topperInfoTxt.setPos = function (nw, nx) {
      this.x += nw / 2;
    };
  }
}

function display1v1TopperInfo() {
  if (topperInfoTxt != null) {
    topperInfoTxt.x = topperInfoX;
    topperInfoTxt.y = topperInfoY;
    topperInfoTxt.draw();
  }
}

///////
// file: js_src/client/masterServerClient.js
///////

//client interface for talking with the master server
var gotMasterServerStats = false;

let KMasterServMsg_serverPlayerCounts = 100;
let KMasterServMsg_bestBrServer = 101;

//update client player coutns from server
function masterServer_getServerStats() {
  masterServer_ConnectWithRequestType(KMasterServMsg_serverPlayerCounts);
}

//get best BR server, then calls callback func
var callback_masterServer_getBestBRServer = null; //arguments (bestServerIP string, noServerFound boolean)

function masterServer_getBestBRServer(callBackFunc) {
  callback_masterServer_getBestBRServer = callBackFunc; //returns result on success
  console.log("Getting best br server...");
  masterServer_ConnectWithRequestType(KMasterServMsg_bestBrServer);
}

//connects to the master server, will recieve a reply based on the requested data
function masterServer_ConnectWithRequestType(msgType) {
  var wsProtocol = window.location.protocol === "https:" ? "wss://" : "ws://";
  var wsPort = wsProtocol == "wss://" ? 7501 : 7500;
  var masterServerIP = "45.77.216.41"; //"0.0.0.0";//"master1.mope.io";
  var conUrl = wsProtocol + masterServerIP + ":" + wsPort;
  console.log("Master server: connecting " + conUrl + "...");
  //console.log("Protocol is " + wsProtocol + ", window protocol is " + window.location.protocol);
  var masterWs = new WebSocket(conUrl);
  masterWs.binaryType = "arraybuffer";
  masterWs.onopen = function () {
    //console.log("MasterServer: Connected!");

    //authenticate as client, with correct data request
    var authmsg = new MsgWriter(1);
    var masterServerRequestType = 1; //1- get stats, 2- get best BR server
    authmsg.writeUInt8(msgType);
    //send msg
    masterWs.send(authmsg.dataView.buffer);
  };
  masterWs.onmessage = function (msg) {
    //handle message
    var msg = new MsgReader(new DataView(msg.data));
    var msgType = msg.readUInt8();
    //console.log("MasterServer: Msg of type "+msgType);

    switch (msgType) {
      case KMasterServMsg_serverPlayerCounts:
        masterServer_gotReponse_getServerStats(msg);
        break;
      case KMasterServMsg_bestBrServer:
        masterServer_gotRespose_getBestBRServer(msg);
        break;

      default:
        console.log("Unknown master server msg type " + msgType);
        break;
    }
  };
  masterWs.onerror = function (err) {
    console.log("MasterServer: error connecting!");
  };
  masterWs.onclose = function (evt) {
    //console.log("Disconnected from master server!");
  };
}
function masterServer_gotReponse_getServerStats(msg) {
  gotMasterServerStats = true;
  //read players online # for each 'connected' server
  var nPlayers = msg.readUInt32();
  console.log(
    "MasterServer got server stats! " + nPlayers + " total players online!"
  );
  playersOnlTXT.setText(numberWithCommas(nPlayers) + " players");

  var numServers = msg.readUInt16();
  //console.log("MasterServer: " + numServers + " servers online!");
  for (var i = 0; i < numServers; i++) {
    var aServIp = num2dotIP(msg.readUInt32());
    var aServNumPl = msg.readUInt16();
    var gameMode = msg.readUInt8();
    var BR_waitingForPlayers = msg.readUInt8();

    //console.log("info for server "+aServIp);

    //find matching gameServer info-obj in list
    var matchF = false;
    for (var j = 0; j < gameServersList.length; j++) {
      /*var clientServerIP =
        gameServersList[j].name == "LOCAL"
          ? "110.93.246.138"
          : gameServersList[j].ip;*/

      if (gameServersList[j].ip == aServIp) {
        var theServ = gameServersList[j];
        if (aServNumPl == 60000) {
          // 60000 players recieved = offline server
          theServ.playersCount = -1;
        } else theServ.playersCount = aServNumPl;

        theServ.gameMode = gameMode;
        //console.log("--matched server " + theServ.ip + " gameMode " + gameMode + " "+theServ.playersCount+ "players ");
        theServ.BR_waitingForPlayers = BR_waitingForPlayers;

        matchF = true;
        //console.log("Match found for server");
        //console.log(aServNumPl + " in server " + gameServersList[j].name);
        break;
      }
    }
    //if (!matchF)
    // console.log(" No matching server def for ip " + aServIp);
  }

  updateRegionsList();
  updateServersList(); //update options shown
  updateGmModeButtons();
}

function masterServer_gotRespose_getBestBRServer(msg) {
  var bestIPEnc = msg.readUInt32();
  var noValidServer = bestIPEnc == 0;
  var bestBRServerIP = num2dotIP(bestIPEnc);

  //IP can be 0!
  console.log("Got new BEST BR server! " + bestBRServerIP);

  //call callback func
  if (callback_masterServer_getBestBRServer != null)
    callback_masterServer_getBestBRServer(bestBRServerIP, noValidServer);
}

masterServer_getServerStats();

//masterServer_getBestBRServer();

///////
// file: js_src/client/gameServer.js
///////

//servers in list
var gameServersList = [];
var gameRegions = [];
var gameServersByRegion = {};

var gameRegionsNoPingTest = ["Team Mode", "Wild Mope"]; //these regions DONT get included in auto join (eg, game modes)

function addRegionDef(regName) {
  gameRegions.push(regName);
  gameServersByRegion[regName] = []; //set empty array for each region key
}
//for (var i = 0; i < gameRegions.length; i++)
//addRegionDef(gameRegions[i]);

GameServer.prototype = {
  name: "Server",

  ip: "0.0.0.0",
  serverConnURL: "0.0.0.0", //url to connect to (needed for wss to work!)
  region: "",
  playersCount: -2,
  gameMode: 0,
  BR_waitingForPlayers: false,
  ping: 10000,
  domOptionIndex: 0, //what index is this server in the option dom

  getServerListString: function () {
    var brWaitingStr = "";
    if (this.gameMode == 2)
      brWaitingStr = this.BR_waitingForPlayers
        ? " -STARTING NEW GAME"
        : " -GAME IN PROGRESS";
    var plStr = this.playersCount < 0 ? "..." : this.playersCount;

    var theStr =
      this.name +
      " [" +
      plStr +
      " players " +
      (this.playersCount >= numFULLServerPlayers ? "-FULL!" : "") +
      "]" +
      brWaitingStr;
    return theStr;
  },
};
function GameServer(nm, ip, theReg, port) {
  this.name = nm;
  this.ip = ip;
  this.serverConnURL = ip;
  this.region = theReg;
  this.port = port;
}

function addServerDef(nm, ip, theReg, port) {
  var newDef = new GameServer(nm, ip, theReg, port);
  //auto-change IP to URL (for ssl wildcard certificate to work)
  //if (!KTestingModeON && !isNaN(parseInt((newDef.ip).substring(0, 1), 10)))
  //    newDef.serverConnURL = "gameserv-" + ((newDef.ip + "").replace(/\./g, '-')) + ".mope.io";

  gameServersList.push(newDef);
  if (!(theReg in gameServersByRegion)) addRegionDef(theReg);

  gameServersByRegion[theReg].push(newDef); //add
  // else
  //   console.log("Region doesn't exist: " + theReg);
  return newDef;
}

/*function addServerWithPortDef(nm, ip, port, theReg) {
 var newDef = {
   name: nm,
   ip: ip,
   serverConnURL: ip, //url to connect to (needed for wss to work!)
   serverPort: port,
   region: theReg,
   playersCount: -1,
   ping: 10000,
   domOptionIndex: 0 //what index is this server in the option dom
 };
 //auto-change IP to URL (for ssl wildcard certificate to work)
 //if (!KTestingModeON && !isNaN(parseInt((newDef.ip).substring(0, 1), 10)))
 //    newDef.serverConnURL = "gameserv-" + ((newDef.ip + "").replace(/\./g, '-')) + ".mope.io";

 log(
   "region: " +
   theReg +
   " => " +
   newDef.serverConnURL +
   ":" +
   newDef.serverPort
 );
 gameServersList.push(newDef);
 gameServersByRegion[theReg].push(newDef); //add
 return newDef;
}*/

reg = "LOCAL";
addServerDef("LOCAL", "localhost", reg, 2255);

//check for server name in link

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ SERVER PING AUTO-SELECT @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//ping one server from each region
var RegionPingTester = function (serverObj) {
  this.serverObj = serverObj;

  var wsProtocol = window.location.protocol === "https:" ? "wss://" : "ws://";
  var wsPort = 2000;
  var conUrl = wsProtocol + this.serverObj.serverConnURL + ":" + wsPort;
  // if (KTestingBetaMode) conUrl = wsProtocol + this.serverObj.serverConnURL + ":" + this.serverObj.serverPort;

  this.testWs = new WebSocket(conUrl); //connect, but measure time to connect?
  this.startT = +new Date();
  this.testWs.binaryType = "arraybuffer";
  //console.log("pingtest: Connecting to " + this.serverObj.name + "...");
  var that = this;
  this.pingsRec = 0;
  this.pingsDelayMsTot = 0;

  this.testWs.onopen = function () {
    //console.log("connected to ping server "+conUrl);
    that.sendPing();
  };
  this.sendPing = function () {
    //send ping
    var authmsg = new MsgWriter(1);
    authmsg.writeUInt8(255);
    that.testWs.send(authmsg.dataView.buffer);
    this.startT = +new Date(); //start timing message
  };
  this.testWs.onmessage = function (msg) {
    //handle message
    var msg = new MsgReader(new DataView(msg.data));
    //console.log("got msg");
    if (msg.readUInt8() == 255) {
      var connectPingMs = +new Date() - that.startT;
      that.pingsRec += 1;
      that.pingsDelayMsTot += connectPingMs;
      //console.log("pingtest: Got PING from " + that.serverObj.name + " after " + connectPingMs + "ms ");

      if (that.pingsRec >= 3) {
        //got final ping for this server!
        that.serverObj.ping = that.pingsDelayMsTot / that.pingsRec;

        console.log(
          "pingtest: Final PING " +
          that.serverObj.ping +
          " from " +
          that.serverObj.name
        );
        that.testWs.close();
        aRegPingTestFinished(that);
      } else {
        that.sendPing(); //send next ping
      }
    }
  };
  this.testWs.onerror = function (err) {
    console.log("TestWS: error connecting! " + err);
  };
  this.testWs.onclose = function (evt) {
    console.log("TestWS: disconnected");
    //console.log("Disconnected from master server!");
  };
};

//pick random server by default
var curRegion = KTestingModeON
  ? gameRegions[0]
  : gameRegions[getRandomInt(0, Math.max(0, gameRegions.length - 1 - 1))]; //pick a random region (for those who fail ping test) (except asia, LAST ONE)
var curServerIndex = 0; //
var curServer = gameServersByRegion[curRegion][curServerIndex];
var curRegion = curServer.region;

//find server with lowest ping, connect to a server there
var lowestPingRegServer = curServer; //this server will be used if none work (make it random)
//var bestRegion = lowestPingRegServer.region;
var pingTestCons = [];

var pingTestOnGoing = false;
var pingTestDoneOnce = false; //only test ping once
var slowTimeout;

function regionNotPingTested(theReg) {
  for (var h = 0; h <= gameRegionsNoPingTest.length; h++) {
    if (gameRegionsNoPingTest[h] == theReg) return true;
  }
  return false;
}

function findAndConnectToNearestServer() {
  //if already tested ping, just use the result!
  if (pingTestDoneOnce) {
    quickestConnectRegionFound();
    return;
  }

  if (pingTestOnGoing) return;

  pingTestOnGoing = true;
  for (var aRegion in gameServersByRegion) {
    if (
      gameServersByRegion.hasOwnProperty(aRegion) &&
      gameServersByRegion[aRegion].length > 0 &&
      !regionNotPingTested(aRegion)
    ) {
      var mainServer = gameServersByRegion[aRegion][0]; //pick first one as main
      //console.log("Pinging Region "+aRegion+" with server "+mainServer.name+")........");
      pingTestCons.push(new RegionPingTester(mainServer));
    }
  }

  slowTimeout = setTimeout(function () {
    //end ping test early (slower ones are likely too slow anyways)
    //console.log("pingtest: too long passed, ending early");
    //close all remaining test connections
    for (var i = 0; i < pingTestCons.length; i++) {
      pingTestCons[i].testWs.close();
    }
    quickestConnectRegionFound();
  }, 1200);
}

//a region finished getting ping
function aRegPingTestFinished(aTest) {
  if (aTest.serverObj.ping < lowestPingRegServer.ping) {
    lowestPingRegServer = aTest.serverObj;
  }
  //remove from conn list, check if all are done
  var tmp = pingTestCons.indexOf(aTest);
  if (-1 != tmp) {
    pingTestCons.splice(tmp, 1);
  }
  if (pingTestCons.length == 0) {
    //test done!
    //console.log("pingtest: all finished");
    if (slowTimeout) clearTimeout(slowTimeout);
    quickestConnectRegionFound();
  }
}

function quickestConnectRegionFound() {
  if (pingTestOnGoing) {
    pingTestDoneOnce = true;
  }
  pingTestOnGoing = false;

  console.log(
    "@@@@  Fastest region is " +
    lowestPingRegServer.region +
    " with ping " +
    lowestPingRegServer.ping +
    "ms "
  );
  curRegion = lowestPingRegServer.region; //set region to fastest one
  //update region/servers list

  //connect to server!
  joinBestServerInRegion();
}

//picks best gameServer for the current region
var numIdealServerPlayers = 400.0; //dont let servers overfill to second room
var numFULLServerPlayers = 500.0; //dont let servers overfill to second room

function joinBestServerInRegion() {
  console.log("Joining best server...");
  console.log(
    "region " + curRegion + " servsInReg " + gameServersByRegion[curRegion]
  );
  var serversInReg = gameServersByRegion[curRegion].slice(); //copies array
  //sort by number of players
  function compare(a, b) {
    if (a.playersCount < b.playersCount) return 1;
    if (a.playersCount > b.playersCount) return -1;
    return 0;
  }
  serversInReg.sort(compare);

  //pick most-popular server that's NOT overfilled in your region
  var found = false;
  var allServersInRegionFull = true;

  for (var i = 0; i < serversInReg.length; i++) {
    var aServ = serversInReg[i];
    //console.log("-checking server "+aServ.name+" players "+aServ.playersCount);
    if (aServ.playersCount < numFULLServerPlayers && aServ.playersCount >= 0)
      //also check if all servers are FULLY full
      allServersInRegionFull = false;

    if (aServ.playersCount < numIdealServerPlayers && aServ.playersCount >= 0) {
      //fill servers to X players
      curServer = aServ;
      curServerIndex = gameServersByRegion[curRegion].indexOf(curServer); //serversInReg is not the same array!
      found = true;
      break;
    }
  }

  if (!found) {
    //if all servers in region over ideal #, spread players across all servers evenly
    if (!allServersInRegionFull || !gotMasterServerStats) {
      //random server in region
      curServer = serversInReg[getRandomInt(0, serversInReg.length - 1)];
      curServerIndex = serversInReg.indexOf(curServer);
    } else {
      //all regions are full/no player count available- pick ANY non-full server across ALL regions
      if (!gotMasterServerStats)
        console.log(
          "Error loading server player counts from master server! Picking random server..."
        );
      else
        console.log(
          "All servers in region " +
          curRegion +
          " are full/offline! Picking random server..."
        );
      var allServersInRegionFull = true;
      for (var i = 0; i < gameServersList.length; i++) {
        if (gameServersList[i].playersCount < numFULLServerPlayers) {
          curServer = gameServersList[i];
          curServerIndex =
            gameServersByRegion[curServer.region].indexOf(curServer);
          curRegion = curServer.region;
          break;
        }
      }
    }
  }

  console.log("Connecting to best server...");
  /*if (wsIsOpen()) {
     ws.close();
   }*/
  gameServerConnect(curServer);
}

var retryTimeout;
var connectFailsCount = 0;
var lastConnectServer = null;

function findGameServerObjForIP(serverIP) {
  for (var i = 0; i < gameServersList.length; i++) {
    var aServer = gameServersList[i];
    //console.log("a server " + aServer.ip);
    if (aServer.ip == serverIP) return aServer;
  }
  return null;
}

//connectes to a server with this IP (creates it in the list if it doesnt Exist)
function gameServerConnectForIP(serverIP, autoClickPlay = false) {
  console.log("connecting to server of IP: " + serverIP);
  //find if it exists
  var serverObj = findGameServerObjForIP(serverIP);
  //console.log("server for ip " + serverIP + " is " + findGameServerObjForIP(serverIP).name);

  /*//create server DEF if it doesnt exist?
  if(serverObj==null){

  }*/
  if (serverObj == null) {
    console.log("No client server DEF exists for server IP " + serverIP);
    addServerDef("Unknown server", serverIP, "Unknown servers");
  }

  gameServerConnect(serverObj, autoClickPlay);
}

//connect to current gameserver (newGameServer is def from gameServersList)
var autoClickPlayOnJoin = false;
function gameServerConnect(newGameServer, autoClickPlay = false) {
  autoClickPlayOnJoin = autoClickPlay; //server
  //just in case

  curServer = newGameServer;
  curRegion = newGameServer.region;
  curServerIndex =
    gameServersByRegion[newGameServer.region].indexOf(newGameServer);

  updateGmModeButtons();
  updateRegionsList();
  updateServersList();
  udpForServIndex();

  if (wsIsOpen()) {
    //close current ws
    theWs = ws;
    ws = null; //prevent reconnect
    theWs.close();
  }

  //after two failed connections, try connecting to another server!
  //console.log("con fails "+connectFailsCount);
  if (newGameServer == lastConnectServer) {
    if (connectFailsCount > 1) {
      console.log("too many fails, trying next server");
      //choose NEXT server
      curServerIndex += 1;
      if (curServerIndex > gameServersByRegion[curRegion].length - 1)
        curServerIndex = 0;
      curServer = gameServersList[curServerIndex];
      curRegion = curServer.region;
      udpForServIndex(); //update gui
    }
  } else {
    //new server, reset fails count
    //console.log("fails reset because new server");
    connectFailsCount = 0;
    lastConnectServer = newGameServer;
  }

  dcedFromAfk = false; //reset on connect

  document.getElementById("connecting").style.visibility = "visible";
  document.getElementById("txtServer").innerHTML = "(" + curServer.name + ")";

  var wsProtocol = window.location.protocol === "https:" ? "wss://" : "ws://";

  var conUrl = wsProtocol + curServer.serverConnURL + ":" + curServer.port;

  /*
    if (KTestingBetaMode) {
        conUrl = wsProtocol + curServer.serverConnURL + ":" + curServer.serverPort;
    }
  */
  console.log("Connecting to " + curServer.name + " (" + conUrl + ")...");
  ws = new WebSocket(conUrl); //Main server connection

  ws.binaryType = "arraybuffer";
  ws.onopen = function () {
    try {
      var msgLen = 1; //4 bytes auth msg + msgType
      var mes = new MsgWriter(msgLen);
      mes.writeUInt8(1);
      wsSendMsg(mes);
      console.log("handshake connection");
    } catch (e) {
      console.log(e);
    }
    //console.log("socket connected!");
    connectFailsCount = 0;

    document.getElementById("startMenu").style.visibility = "visible";
    document.getElementById("connecting").style.visibility = "hidden";
  };
  ws.onmessage = function (msg) {
    //console.log("socket message! " + msg.data);
    handleWsMessage(new DataView(msg.data));
  };
  ws.onclose = function (evt) {
    if (this == ws) {
      //active ws closed- retry soon!
      connectFailsCount += 1;
      serverConnected = false;
      serverCon_aliveInAGame = false;
      serverCon_spectatingInAGame = false;
      //console.log("Current socket closed- retrying soon...");
      if (!dcedFromAfk) {
        retryTimeout = setTimeout(function () {
          //console.log("Timeout hit, trying!!!!");
          gameServerConnect(newGameServer);
        }, 2000);
        //show connecting label
        document.getElementById("connecting").style.visibility = "visible";
      } else {
        //dced, show dom?
      }
    } else {
      //old ws closed, ignore
      //, ignore, ignore
      //console.onsole.log("OLD socket closed.");
    }
  };
  ws.onerror = function () {
    console.log("socket error!");
  };
}

//@@@@@@@@@@@@@@@@@@@@  CONNECT TO GAME SERVER @@@@@@@@@@@@@@@@@@@@@@@@@

//find URL server in list
findAndConnectToNearestServer();

//try to connect to master server, grab stats

//user selected new server
document.getElementById("serverSelect").onchange = onServerChanged;

function onServerChanged() {
  var e = document.getElementById("serverSelect");
  curServerIndex = e.selectedIndex - 1;
  console.log(gameServersByRegion);
  curServer = gameServersByRegion[curRegion][curServerIndex];
  udpForServIndex();

  console.log("Server changed to " + curServer.name + "...");
  if (wsIsOpen()) {
    ws.close();
  }

  //hide label
  var xpLab = document.getElementById("spawnXpLabel");
  xpLab.style.opacity = 0;

  partyLinkIP = null;
  partyLinkKey = null;

  gameServerConnect(curServer);
  //connect AFTER close
}

document.getElementById("regionSelect").onchange = onRegionChanged;

function onRegionChanged() {
  console.log("Region changed...");
  var e = document.getElementById("regionSelect");
  var curRegIndex = e.selectedIndex - 1;
  curRegion = gameRegions[curRegIndex];

  console.log(curRegion);
  //udpForServIndex();

  if (wsIsOpen()) {
    ws.close();
  }

  //hide label
  var xpLab = document.getElementById("spawnXpLabel");
  xpLab.style.opacity = 0;

  joinBestServerInRegion();
  //gameServerConnect(curServer);
  //connect AFTER close
}
//set index of selected server
function udpForServIndex() {
  //save last used server
  /*if (window.localStorage) {
       try {
           window.localStorage.setItem("lastServerIP", curServer.ip);
       } catch (err) {} //no localStorage
       //console.log("Last used server is NOW " + localStorage.getItem("lastServerIP"));
   }*/
  //update gui selected index
  var e = document.getElementById("serverSelect");
  e.selectedIndex = curServerIndex + 1;
}

//server list got  updated
function updateServersList() {
  //clear current options
  var selNode = document.getElementById("serverSelect");
  while (selNode.lastChild) {
    selNode.removeChild(selNode.lastChild);
  }
  //add title
  var newOp = document.createElement("option");
  newOp.text = "Choose a server:";
  newOp.disabled = true;
  selNode.add(newOp);
  //newOp<option selected disabled>Choose one</option>

  //add new ones
  var foundIndex = -1;
  var serversInReg = gameServersByRegion[curRegion];
  for (var i = 0; i < serversInReg.length; i++) {
    var aServ = serversInReg[i];
    var newOp = document.createElement("option");

    newOp.text = aServ.getServerListString();

    if (aServ.ip == curServer.ip) {
      //effectively the same server
      foundIndex = i;
    }
    selNode.add(newOp);
  }
  if (foundIndex == -1)
    //if current server no longer in list
    foundIndex = 0;
  selNode.selectedIndex = foundIndex + 1; //0;
}

function updateRegionsList() {
  //clear current options
  var selNode = document.getElementById("regionSelect");
  while (selNode.lastChild) {
    selNode.removeChild(selNode.lastChild);
  }
  //add title
  var newOp = document.createElement("option");
  newOp.text = "Choose a region:";
  newOp.disabled = true;
  selNode.add(newOp);

  //add new ones
  var foundIndex = -1;
  for (var i = 0; i < gameRegions.length; i++) {
    //find total players in region (add up servers in it)
    var aReg = gameRegions[i];
    var serversInReg = gameServersByRegion[aReg];
    var numPl = 0;
    for (var j = 0; j < serversInReg.length; j++) {
      numPl +=
        serversInReg[j].playersCount >= 0 ? serversInReg[j].playersCount : 0;
    }

    var newOp = document.createElement("option");
    newOp.text = aReg + " [" + numPl + " players ]";

    if (aReg == curRegion) {
      //set current region
      foundIndex = i;
    }
    selNode.add(newOp);
  }
  if (foundIndex == -1)
    //if cant find cur region
    foundIndex = 0;
  selNode.selectedIndex = foundIndex + 1; //0;
}

/*//network debugging
var bytesLastSec=0;
window.setInterval(function(){
 /// call your function here
 console.log("Current packet rate Kb/s "+bytesLastSec*8/1000.0);
 bytesLastSec=0;
}, 1000);
*/

//connected to a game server, joined as a spectator
function onConnectedAndJoinedGameServer() {
  //joining the game makes this a successful server connection!
  serverConnected = true;
  //first time server connected!
  if (!serverFirstConnected) {
    document.getElementById("onconnectDiv").style.visibility = "visible";
  }
  serverFirstConnected = true; //doesnt change after first connect
  setSiteMenuVisible(true);

  if (autoClickPlayOnJoin) playPressed(); //press play to join server

  updateGmModeButtons();
}

//connected to a game server (not joined a room yet)
function onConnectedToGameServer() {
  //update URL to show ?server= ...
  /*if (!isMobileApp) {
       var serverName = ((curServer.name).replace(/\W/g, '')).toUpperCase(); //remove non-alphanum
       var newURL_noParams = window.location.href.split('?')[0]; //URL without params
       //console.log("URL is "+location.protocol + '//' + location.host + location.pathname);
       window.history.replaceState({ foo: "foo" }, "mope.io (" + serverName + ")", newURL_noParams + "?server=" + serverName);
   }*/

  //show INTERFACE
  setSiteMenuVisible(true);

  joinGame(true); //spectator
}

function gmModeButtonClicked(whichButtonID) {
  //play sound (if not muted)
  var sound_click = getLazyLoadAudio("audio/click.mp3");
  if (sound_click) {
    try {
      sound_click.play();
    } catch (err) { }
  }

  if (whichButtonID == "gmButton_FFA") {
    //switch to FFA
    findAndConnectToNearestServer();
  } else if (whichButtonID == "gmButton_TEAMS") {
    //find server in teams to join
    curRegion = "Team Mode";
    joinBestServerInRegion();
  } else if (whichButtonID == "gmButton_WILD") {
    //find server in teams to join
    curRegion = "Wild Mope";
    joinBestServerInRegion();
  }

  updateGmModeButtons();
}

function updateGmModeButtons() {
  /* var theDom = document.getElementById("gmButton_FFA");
  if (gameMode == 0) {
  //  theDom.style.opacity = 0.5;
  } else theDom.style.opacity = 1.0;

  var theDom = document.getElementById("gmButton_TEAMS");
  if (gameMode == 3) {
    theDom.style.opacity = 0.5;
  } else theDom.style.opacity = 1.0;

  var theDom = document.getElementById("gmButton_WILD");
  if (gameMode == 4) {
    theDom.style.opacity = 0.5;
  } else theDom.style.opacity = 1.0;*/
}

///////
// file: js_src/interface/PlusXpPopup.js
///////

function PlusXPPopup(xpAm) {
  this.animStep = 1;
  this.animStartT = timestamp;
  this.animDur = 3000;
  this.timedOut = false;

  //allow nice turning animation
  this.xShift = getRandomDouble(-10, 10);
  this.yShift = getRandomDouble(-10, 10);
  this.anlgeShift = getRandomDouble(-10, 10);

  this.text = new CachedText(16.0, "white");
  this.text.setText((xpAm >= 0 ? "+ " : "") + abbreviate_number(xpAm) + " XP");
  //set special params for higher xp amounts
  this.textFontSz = 30;
  var xpCol = "white";
  if (xpAm > 10000) {
    xpCol = "#c7b753"; // yellow 10K+
    this.textFontSz = 40;
    this.animDur += 1000;
  }
  if (xpAm > 100000) {
    xpCol = "#fdca5b"; //yellow 100K+
    this.textFontSz = 45;
    this.animDur += 2000;
  }
  if (xpAm > 1000000) {
    xpCol = "#c7b753"; //yellow 1M+
    this.textFontSz = 51;
    this.animDur += 2000;
  }

  if (xpAm < 0) {
    xpCol = "#c65f59"; //red -ve
    this.animDur += 2000;
  }
  this.text.setColor(xpCol);

  //console.log("popup + "+abbreviate_number(xpAm)+" XP");

  //call draw manually
  this.draw = function () {
    if (options_noXpPopup) return;

    var anim0_1 = clamp((timestamp - this.animStartT) / this.animDur, 0, 1);

    ctx.save();

    var posX = canvasW / 2;
    var posY = canvasH - 85 * interfS + anim0_1 * (-150 * interfS);

    ctx.translate(posX, posY);

    //animate the text

    ctx.rotate(toRadians(this.anlgeShift * anim0_1));
    //ctx.translate(this.xShift,this.yShift);
    ctx.globalAlpha = 1.0 - anim0_1;

    this.text.setFontSize(this.textFontSz * interfS);
    this.text.x = 0;
    this.text.y = 0;
    this.text.draw();
    //console.log("drawing pop!" +anim0_1);

    ctx.restore();

    if (timestamp >= this.animStartT + this.animDur) this.timedOut = true;
  };
}

///////
// file: js_src/interface/TextPopup.js
///////

function TextPopup(text, fontSize, color, dur) {
  this.animStep = 1;
  this.animStartT = timestamp;
  this.timedOut = false;
  //allow nice turning animation
  this.xShift = getRandomDouble(-10, 10);
  this.yShift = getRandomDouble(-10, 10);
  this.anlgeShift = getRandomDouble(-10, 10);
  this.text = new CachedText(fontSize, color);
  this.text.setText(text);
  //set special params for higher xp amounts
  this.textFontSz = fontSize;
  this.animDur = dur;
  this.text.setColor(color);

  //console.log("popup + "+abbreviate_number(xpAm)+" XP");

  //call draw manually
  this.draw = function () {
    if (options_noXpPopup) return;

    var anim0_1 = clamp((timestamp - this.animStartT) / this.animDur, 0, 1);

    ctx.save();

    var posX = canvasW / 2;
    var posY = canvasH - 85 * interfS + anim0_1 * (-150 * interfS);

    ctx.translate(posX, posY);

    //animate the text

    // ctx.rotate( toRadians( this.anlgeShift * anim0_1 ));
    //ctx.translate(this.xShift,this.yShift);
    ctx.globalAlpha = 1.0 - anim0_1;

    this.text.setFontSize(this.textFontSz * interfS);
    this.text.x = 0;
    this.text.y = 0;
    this.text.draw();
    //console.log("drawing pop!" +anim0_1);

    ctx.restore();

    if (timestamp >= this.animStartT + this.animDur) this.timedOut = true;
  };
}

///////
// file: js_src/gameobj/GameObj.js
///////

//basic 'class' declaration (declare anything that will be thisClassed in PROTOTYPE!)
GameObj.prototype = {
  id: 0,
  oType: o_berry,
  spawnTime: 0,
  rPer: 0,
  updateTime: 0,
  x: 0,
  y: 0,
  ox: 0,
  oy: 0,
  nx: 0,
  ny: 0,
  rad: 0,
  oRad: 0,
  nRad: 0,
  //some objs have angles
  angle: 0,
  oAngle: 0,
  angleDelta: 0,
  moveUpdF: 0.0,
  z: 0,

  name: "",
  dead: false,
  type: 0, //type of animal/ type of abilityCircle
  curBiome: 0, //display outline based on biome
  //rect stuff
  isRectangle: false,
  rectW: 0,
  rectH: 0,
  specType: 0,
  toString: function () {
    return "[GObj t=" + this.oType + " id=" + this.id + "]";
  },
};

//declare extra vars
GameObj.prototype.flag_hurt = false; //all objs can have hp
GameObj.prototype.hpPer =
  GameObj.prototype.hpPer_n =
  GameObj.prototype.hpBarA =
  0.0;
GameObj.prototype.infectionPer =
  GameObj.prototype.infectionPer_n =
  GameObj.prototype.infectionBarA =
  0.0;
GameObj.prototype.hpBarTimeoutT = 0;
GameObj.prototype.alwaysPlainOutline = false; //for display objs\

//stretches sideways and back
GameObj.prototype.doesDrawEffectScale = false;
GameObj.prototype.drawEffectScale_Slow = false;

// if an object has to be manually drawn by the interface then set this to true
GameObj.prototype.customInterfaceDraw = false;

// obj spawn with radius animation
// some objects dont need this animation so set this to false in their subclasses
GameObj.prototype.animateRadOnSpawn = true;

//subclassable
GameObj.prototype.customDraw = function (batchDrawOutline) {
  // switch(this.oType ) {
  //     case 20:
  //     case 21:
  //     case 22:
  //     case 40:
  //     case 1:
  //     case 7:
  //     case 4:
  //     case 24:
  //     case 3:
  //     case 8:
  //     case 36:
  //     case 5:
  //     case 52:
  //     case  53:
  //     case  54:
  //     case  49:
  //     case  38:
  //     break;
  //     default:
  //     console.log("this.oType: " + this.oType);
  // }
  switch (this.oType) {
    case o_hill:
      {
        switch (this.curBiome) {
          case biome_desert:
            //drawn as batch: (either draw outline or top part)
            if (batchDrawOutline)
              //1) first draw outline circle (only)
              drawCircle(0, 0, this.rad, col_outline_desert);
            //2) draw top parts (that will combine)
            else drawCircle(0, 0, this.rad - 1.5, col_desert_hill);

            break;

          case biome_ocean:
            //drawn as batch: (either draw outline or top part)
            if (batchDrawOutline)
              //1) first draw outline circle (only)
              drawCircle(0, 0, this.rad, this.getOutlineColor());
            //2) draw top parts (that will combine)
            else drawCircle(0, 0, this.rad - 1.5, col_ocean_sand);

            break;
          case biome_arctic:
            //this.drawOutlinedCircle("", col_outline_land); //col_outline_land);
            if (batchDrawOutline)
              //1) first draw outline circle (only)
              drawCircle(0, 0, this.rad, "white");
            // this.getOutlineColor());
            else {
              //2) draw top parts (that will combine)
              drawCircle(0, 0, this.rad - 1.5, col_snowcolor); //"#1f893a");
              //
              /*var theImg = getLoadedImg("img/fir2.png");
                            if (theImg) {
                                var rad = this.rad*1.22;
                                //ctx.rotate(this.rPer * Math.PI * 2.0);
                                ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);
                                //console.log("drawing banana");
                            }*/
            }

            break;

          case biome_land:
          default:
            if (batchDrawOutline)
              //1) first draw outline circle (only)
              drawCircle(0, 0, this.rad, this.getOutlineColor());
            else drawCircle("", col_outline_land); //col_outline_land);
            break;
        }
      }
      break;
    case o_berryBush:
      {
        //this.drawOutlinedCircle("", col_food2);

        //draw bush animation
        ctx.save();
        var rShift = 0;
        var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
        var period = 2.0;
        var shiftAm = 1.5;
        rShift = shiftAm * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

        var bushColor =
          this.curBiome == biome_ocean ? col_plankton2 : col_food2;
        ctx.fillStyle = bushColor;
        var drawRad = this.rad * 0.8;

        this.drawOutlinedCircle("", bushColor); //"#00B343");
        ctx.globalAlpha *= 0.98;

        var dx = -drawRad * 0.5,
          dy = -drawRad * 0.5 + 10.0 * this.rPer,
          drad = Math.max(0, drawRad * 0.65 + rShift) + 2;
        //drawCircle(dx, dy, drad+2, col_outline_land); //outline
        drawCircle(dx, dy, drad, bushColor); //outline

        var dx = drawRad * 0.5,
          dy = -drawRad * 0.5 - 10.0 * this.rPer,
          drad = Math.max(0, drawRad * 0.73 - rShift);
        //drawCircle(dx, dy, drad+2, col_outline_land); //outline
        drawCircle(dx, dy, drad, bushColor); //outline
        var dx = drawRad * 0.6,
          dy = drawRad * 0.4,
          drad = Math.max(0, drawRad * 0.78 + rShift);
        //drawCircle(dx, dy, drad+2, col_outline_land); //outline
        drawCircle(dx, dy, drad, bushColor); //outline

        var dx = -drawRad * 0.5,
          dy = drawRad * 0.5 + 10.0 * this.rPer,
          drad = Math.max(0, drawRad * 0.6 + this.rPer - rShift);
        //drawCircle(dx, dy, drad+2, col_outline_land); //outline
        drawCircle(dx, dy, drad, bushColor); //outline

        ctx.restore();

        //draw berries on bush
        /*var drawRad=this.rad*1.0;
                var dx=drawRad*-0.3, dy=drawRad*-0.2, drad=7;
                drawCircle(dx, dy, drad+2, col_outline_land); //outline
                drawCircle(dx, dy, drad, col_food1);
                var dx=drawRad*0.3, dy=drawRad*-0.1, drad=8;
                drawCircle(dx, dy, drad+2, col_outline_land); //outline
                drawCircle(dx, dy, drad, col_food1);
                var dx=drawRad*0.1, dy=drawRad*0.2, drad=7;
                drawCircle(dx, dy, drad+2, col_outline_land); //outline
                drawCircle(dx, dy, drad, col_food1);*/
      }
      break;
    case o_fruitTree:
      {
        this.drawOutlinedCircle("", "#1AAE31"); //less diff. spawner colors, so no extra col
        ctx.save();

        var rShift = 0;
        var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
        var period = 2.0;
        var shiftAm = 1.5;
        rShift = shiftAm * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

        ctx.fillStyle = col_gameBg;
        var rad = this.rad * 0.75;

        ctx.globalAlpha *= 0.8;
        ctx.beginPath();
        ctx.arc(
          -rad * 0.5,
          -rad * 0.5 + 10.0 * this.rPer,
          Math.max(0, rad * 0.65 + rShift),
          0,
          2 * Math.PI
        );
        ctx.fill();
        ctx.beginPath();
        ctx.arc(
          rad * 0.5,
          -rad * 0.5 - 10.0 * this.rPer,
          Math.max(0, rad * 0.73 - rShift),
          0,
          2 * Math.PI
        );
        ctx.fill();
        ctx.beginPath();
        //ctx.globalAlpha = 0.95;
        ctx.arc(
          rad * 0.6,
          rad * 0.4,
          Math.max(0, rad * 0.78 + rShift),
          0,
          2 * Math.PI
        );
        ctx.fill();
        ctx.beginPath();
        ctx.arc(
          -rad * 0.5,
          rad * 0.5,
          Math.max(0, rad * 0.6 + this.rPer - rShift),
          0,
          2 * Math.PI
        );
        ctx.fill();

        ctx.restore();
      }
      break;
    case o_planktonBush:
      {
        //this.drawOutlinedCircle("", col_plankton2);

        //draw bush animation
        ctx.save();
        var rShift = 0;
        var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
        var period = 2.0;
        var shiftAm = 1.5;
        rShift = shiftAm * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

        //ctx.fillStyle = ;
        var drawRad = this.rad * 0.8;
        var drawCol = col_plankton2;

        this.drawOutlinedCircle("", drawCol); //"#00B343");
        ctx.globalAlpha *= 0.98;

        var dx = -drawRad * 0.5,
          dy = -drawRad * 0.5 + 10.0 * this.rPer,
          drad = Math.max(0, drawRad * 0.65 + rShift) + 2;
        //drawCircle(dx, dy, drad+2, col_outline_land); //outline
        drawCircle(dx, dy, drad, drawCol); //outline

        var dx = drawRad * 0.5,
          dy = -drawRad * 0.5 - 10.0 * this.rPer,
          drad = Math.max(0, drawRad * 0.73 - rShift);
        //drawCircle(dx, dy, drad+2, col_outline_land); //outline
        drawCircle(dx, dy, drad, drawCol); //outline
        var dx = drawRad * 0.6,
          dy = drawRad * 0.4,
          drad = Math.max(0, drawRad * 0.78 + rShift);
        //drawCircle(dx, dy, drad+2, col_outline_land); //outline
        drawCircle(dx, dy, drad, drawCol); //outline

        var dx = -drawRad * 0.5,
          dy = drawRad * 0.5 + 10.0 * this.rPer,
          drad = Math.max(0, drawRad * 0.6 + this.rPer - rShift);
        //drawCircle(dx, dy, drad+2, col_outline_land); //outline
        drawCircle(dx, dy, drad, drawCol); //outline

        ctx.restore();

        //draw berries on bush
        /*var drawRad=this.rad*1.0;
                var dx=drawRad*-0.3, dy=drawRad*-0.2, drad=7;
                drawCircle(dx, dy, drad+2, col_outline_land); //outline
                drawCircle(dx, dy, drad, col_food1);
                var dx=drawRad*0.3, dy=drawRad*-0.1, drad=8;
                drawCircle(dx, dy, drad+2, col_outline_land); //outline
                drawCircle(dx, dy, drad, col_food1);
                var dx=drawRad*0.1, dy=drawRad*0.2, drad=7;
                drawCircle(dx, dy, drad+2, col_outline_land); //outline
                drawCircle(dx, dy, drad, col_food1);*/
      }
      break;
    case o_waterSpot:
      {
        ctx.save();

        var col = this.curBiome == biome_arctic ? "#7790d8" : col_wat2;
        this.drawOutlinedCircle("", col);

        if (!options_lowGraphics) ctx.rotate(this.rPer * 2 * Math.PI);

        var rShift = 0;
        var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
        var period = 7.0;
        var shiftAm = 4; //5.5
        rShift = shiftAm * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

        /*//sand 'outline'
                var strokeW = 4;
                ctx.fillStyle = col_ocean_sand;
                ctx.beginPath();
                ctx.arc(0, 0, this.rad, 0, Math.PI * 2);
                ctx.fill();*/

        //ctx.fillStyle = "#73602A"; //98803A";

        if (this.curBiome == biome_arctic) ctx.fillStyle = "#7790d8";
        else ctx.fillStyle = col_wat2; //98803A";
        //ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(0, 0, Math.max(0, this.rad - strokeW + rShift), 0, Math.PI * 2);
        ctx.fill();

        if (!options_lowGraphics) {
          ctx.beginPath(); //top right
          ctx.arc(
            this.rad * 0.3,
            -this.rad * 0.35 + 15.0 * this.rPer,
            Math.max(0, this.rad * 0.35 + rShift),
            0,
            2 * Math.PI
          );
          ctx.fill();

          ctx.beginPath(); //bottom right
          ctx.arc(
            this.rad * 0.5,
            this.rad * 0.5 + 15.0 * this.rPer,
            Math.max(0, this.rad * 0.4 + rShift),
            0,
            2 * Math.PI
          );
          ctx.fill();

          ctx.beginPath(); //bottom left
          ctx.arc(
            -this.rad * 0.55 * 0.707,
            +this.rad * 0.55 * 0.707 + 15.0 * this.rPer,
            Math.max(0, this.rad * 0.5 + rShift),
            0,
            2 * Math.PI
          );
          ctx.fill();
          ctx.beginPath();
          ctx.arc(
            -this.rad * 0.75,
            -this.rad * 0.35 + 15.0 * this.rPer,
            Math.max(0, this.rad * 0.3 + rShift),
            0,
            2 * Math.PI
          );
          ctx.fill();

          /*ctx.beginPath();
                    ctx.arc(this.rad + 10 * this.rPer, 50 * this.rPer, 8, 0, 2 * Math.PI);
                    ctx.fill();

                    ctx.beginPath();
                    ctx.arc(this.rad - 20 * this.rPer, 50 * this.rPer, 10, 0, 2 * Math.PI);
                    ctx.fill();*/
        }

        ctx.restore();
      }
      break;
    case o_berry:
      {
        var berryCol = col_food1;
        if (this.curBiome == biome_arctic) {
          berryCol = "#ac443c";
        }
        this.drawOutlinedCircle("", berryCol); //draws with outline

        //arctic berry
        /*if(this.curBiome==biome_arctic){
                        //planktop eyes
                        ctx.rotate(this.rPer * Math.PI * 2.0);
                        drawCircle(this.rad * 0.25, this.rad * 0.4, (0.1 + 0.15 * this.rPer) * this.rad, "#723730");
                      }*/
      }
      break;
    case o_banana:
      {
        //draw banana img
        var theImg = getLoadedImg(
          "img/banana" + (this.isEdibleOutlined() ? "_e" : "") + ".png"
        );
        if (theImg) {
          var rad = this.rad;
          ctx.rotate(this.rPer * Math.PI * 2.0);
          ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);
          //console.log("drawing banana");
        }
      }
      break;
    case o_raspberry:
      {
        //draw banana img
        var theImg = getLoadedImg(
          "img/rasp" + (this.isEdibleOutlined() ? "_e" : "") + ".png"
        );
        if (theImg) {
          var rad = this.rad;
          ctx.rotate(this.rPer * Math.PI * 2.0);
          ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);
          //console.log("drawing banana");
        }
      }
      break;
    case o_pear:
      {
        //draw banana img
        var theImg = getLoadedImg(
          "img/pear" + (this.isEdibleOutlined() ? "_e" : "") + ".png"
        );
        if (theImg) {
          var rad = this.rad;
          ctx.rotate(this.rPer * Math.PI * 2.0);
          ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);
          //console.log("drawing banana");
        }
      }
      break;

    case o_seaweed:
      {
        //draw banana img
        var theImg = getLoadedImg(
          "img/seaweed" + (this.isEdibleOutlined() ? "_e" : "") + ".png"
        );
        if (theImg) {
          var rad = this.rad;

          ctx.rotate(this.rPer * Math.PI * 2.0);
          ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);
          //console.log("drawing banana");
        }
      }
      break;
    case o_starfish:
      {
        //draw banana img
        var theImg = getLoadedImg(
          "img/starfish" + (this.isEdibleOutlined() ? "_e" : "") + ".png"
        );
        if (theImg) {
          var rad = this.rad;
          ctx.rotate(this.rPer * Math.PI * 2.0);
          ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);
          //console.log("drawing banana");
        }
      }
      break;
    case o_kelp:
      {
        //draw banana img
        var theImg = getLoadedImg(
          "img/kelp" + (this.isEdibleOutlined() ? "_e" : "") + ".png"
        );
        if (theImg) {
          var rad = this.rad;
          ctx.rotate(this.rPer * Math.PI * 2.0);
          ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);
          //console.log("drawing banana");
        }
      }
      break;
    case o_clam:
      {
        //draw banana img
        var theImg = getLoadedImg(
          "img/clam" + (this.isEdibleOutlined() ? "_e" : "") + ".png"
        );
        if (theImg) {
          var rad = this.rad;
          ctx.rotate(this.rPer * Math.PI * 2.0);
          ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);
          //console.log("drawing banana");
        }
      }
      break;
    case o_conchShell:
      {
        //draw banana img
        var theImg = getLoadedImg(
          "img/conch" + (this.isEdibleOutlined() ? "_e" : "") + ".png"
        );
        if (theImg) {
          var rad = this.rad * 1.0;
          ctx.save();
          ctx.rotate(this.rPer * Math.PI * 2.0);
          ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);
          //console.log("drawing banana");
          ctx.restore();
        }
      }
      break;

    case o_coconut:
      {
        //draw banana img
        var theImg = getLoadedImg(
          "img/coconut" + (this.isEdibleOutlined() ? "_e" : "") + ".png"
        );
        if (theImg) {
          var rad = this.rad;
          ctx.rotate(this.rPer * Math.PI * 2.0);
          ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);
          //console.log("drawing banana");
        }
      }
      break;
    case o_flockspot:
    case o_flock: {
      //drawCircle(0,0, this.rad, "black");
      break;
    }
    case o_sleigh:
      {
        //draw banana img
        var theImg = getLoadedImg("img/santa/sleig.png");
        if (theImg) {
          var rad = this.rad;
          ctx.save();
          ctx.rotate(this.angle);
          ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);
          ctx.restore();
          //console.log("drawing banana");
        }
      }
      break;
      break;
    case o_ostrichEgg:
      {
        var theImg = getLoadedImg(
          "img/ostrichEgg" + (this.isEdibleOutlined() ? "_e" : "") + ".png"
        );
        if (theImg) {
          var rad = this.rad;
          ctx.save();
          ctx.rotate(this.rPer * Math.PI * 2.0);
          ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);
          ctx.restore();
        }
      }
      break;

    case o_egg:
      {
        //draw banana img

        var golden = "";
        if (this.specType == 1) golden = "golden";
        var theImg = getLoadedImg(
          "img/" +
          golden +
          "egg" +
          (this.isEdibleOutlined() ? "_e" : "") +
          ".png"
        );
        if (theImg) {
          var rad = this.rad;
          ctx.save();

          ctx.rotate(this.rPer * Math.PI * 2.0);
          ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);
          ctx.restore();
          //console.log("drawing banana");
        }
      }
      break;
    case o_beeHive:
      {
        //draw banana img
        // console.log("bee hive");
        var theImg = getLoadedImg(
          "img/beehive" + (this.isEdibleOutlined() ? "_e" : "") + ".png"
        );
        if (theImg) {
          var rad = this.rad;
          ctx.save();
          ctx.rotate(this.rPer * 0.5 * Math.PI * 2.0);
          ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);
          ctx.restore();
          //console.log("drawing banana");
        }
      }
      break;
    case o_honeyComb:
      {
        var theImg = getLoadedImg(
          "img/honeycomb" + (this.isEdibleOutlined() ? "_e" : "") + ".png"
        );
        if (theImg) {
          var rad = this.rad;
          ctx.save();
          ctx.rotate(this.rPer * 0.5 * Math.PI * 2.0);
          ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);
          ctx.restore();
          //console.log("drawing banana");
        }
      }
      break;
    case o_quill:
      {
        //draw banana img
        var theImg = getLoadedImg("img/quill.png");
        if (theImg) {
          var rad = this.rad;
          ctx.rotate(this.angle);
          ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);
          //console.log("drawing banana");
        }
      }
      break;
    case o_plankton:
      {
        this.drawOutlinedCircle("", col_plankton1); //draws with outline
        //planktop eyes
        ctx.rotate(this.rPer * Math.PI * 2.0);
        drawCircle(
          this.rad * 0.25,
          this.rad * 0.4,
          (0.3 + 0.15 * this.rPer) * this.rad,
          "#905113"
        );
      }
      break;
    case o_healingStone:
      {
        //set correct biome outline
        var biomeExt = "";
        switch (this.curBiome) {
          case biome_ocean:
            biomeExt = "_ocean";
            break;
          case biome_arctic:
            biomeExt = "_arctic";
            break;
          case biome_land:
          default:
            biomeExt = "";
            break;
        }
        var theImg = getLoadedImg("img/healingStone" + biomeExt + ".png");
        if (theImg) {
          var rad = this.rad;
          ctx.save();
          ctx.rotate(this.rPer * Math.PI * 2.0);
          ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);

          ctx.restore();
        }
      }
      break;

    case o_volcano:
      {
        /*var theImg = getLoadedImg("img/volcano_im.png");
                if (theImg) {
                    var rad = this.rad*(300.0/236.0);
                    ctx.save()
                    ctx.rotate(this.rPer * Math.PI * 2.0);
                    ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);

                    ctx.restore();
                }*/

        //drawCircle(0, 0, Math.max(0, this.rad*1.0), "#09992f");

        drawCircle(0, 0, Math.max(0, this.rad * 1), "#815427");

        drawCircle(0, 0, Math.max(0, this.rad * 0.6), "#6e4b29");

        drawCircle(0, 0, Math.max(0, this.rad * 0.5), "#543d28");

        drawCircle(0, 0, Math.max(0, this.rad * 0.45), "#3f3124");

        drawCircle(0, 0, Math.max(0, this.rad * 0.33), "#241e19");

        drawCircle(0, 0, Math.max(0, this.rad * 0.25), "#120f0d");

        drawCircle(0, 0, Math.max(0, this.rad * 0.2), col_lava);
      }

      break;

    case o_lavaLake:
      {
        ctx.save();

        var rShift = 0;
        var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
        var period = 4.0;
        var shiftAm = 2.5;
        rShift = shiftAm * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

        if (batchDrawOutline) {
          //sand 'outline'
          var strokeW = 4;
          ctx.fillStyle = col_lava;
          ctx.beginPath();
          ctx.arc(0, 0, this.rad, 0, Math.PI * 2);
          ctx.fill();
        } else {
          //ctx.fillStyle = "#73602A"; //98803A";
          ctx.fillStyle = col_lava; //98803A";
          //ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(
            0,
            0,
            Math.max(0, this.rad - strokeW + rShift),
            0,
            Math.PI * 2
          );
          ctx.fill();

          if (!options_lowGraphics) {
            ctx.beginPath(); //top right
            ctx.arc(
              this.rad * 0.45,
              -this.rad * 0.45 + 15.0 * this.rPer,
              Math.max(0, this.rad * 0.5 + rShift),
              0,
              2 * Math.PI
            );
            ctx.fill();

            ctx.beginPath(); //bottom right
            ctx.arc(
              this.rad * 0.5,
              this.rad * 0.5 + 15.0 * this.rPer,
              Math.max(0, this.rad * 0.4 + rShift),
              0,
              2 * Math.PI
            );
            ctx.fill();

            ctx.beginPath(); //bottom left
            ctx.arc(
              -this.rad * 0.55 * 0.707,
              +this.rad * 0.55 * 0.707 + 15.0 * this.rPer,
              Math.max(0, this.rad * 0.5 + rShift),
              0,
              2 * Math.PI
            );
            ctx.fill();
            ctx.beginPath();
            ctx.arc(
              -this.rad * 0.75,
              -this.rad * 0.35 + 15.0 * this.rPer,
              Math.max(0, this.rad * 0.3 + rShift),
              0,
              2 * Math.PI
            );
            ctx.fill();

            ctx.beginPath();
            ctx.arc(
              this.rad + 10 * this.rPer,
              50 * this.rPer,
              8,
              0,
              2 * Math.PI
            );
            ctx.fill();

            ctx.beginPath();
            ctx.arc(
              this.rad - 20 * this.rPer,
              50 * this.rPer,
              10,
              0,
              2 * Math.PI
            );
            ctx.fill();
          }

          ctx.save();
          ctx.globalAlpha = 1.0 - this.underwaterA; //bubbles appear as animal fades

          var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
          var period = 1.5;
          var shiftAm = 8.0;
          var moveA =
            shiftAm * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

          if (this.flag_underWater) {
            ctx.globalAlpha *= 0.5;

            if (this.animalType == a_croc) ctx.globalAlpha = 0.3;
          }
          ctx.fillStyle = "yellow";
          var bubRad = this.rad * 0.15;
          ctx.beginPath(); //top left, right

          var bubbles = 1;
          for (i = 1; i <= bubbles; i++) {
            ctx.save();
            ctx.globalAlpha = 0.2;
            ctx.rotate(this.rPer * Math.PI * 2.0 * i);
            ctx.beginPath(); //top left, right
            ctx.arc(
              this.rad * -0.35,
              this.rad * -0.33,
              Math.max(0, bubRad + moveA),
              0,
              Math.PI * 2
            );
            ctx.fill();
            ctx.beginPath();
            ctx.arc(
              this.rad * 0.35,
              this.rad * -0.32,
              Math.max(0, bubRad - moveA),
              0,
              Math.PI * 2
            );
            ctx.fill();

            ctx.beginPath(); //bottom 2
            ctx.arc(
              this.rad * 0.35,
              this.rad * 0.36,
              Math.max(0, bubRad + moveA),
              0,
              Math.PI * 2
            );
            ctx.fill();
            ctx.beginPath();
            ctx.arc(
              this.rad * -0.35,
              this.rad * 0.35,
              Math.max(0, bubRad - moveA),
              0,
              Math.PI * 2
            );
            ctx.fill();
            ctx.restore();
          }
          ctx.restore();
        }

        ctx.restore();
      }
      break;

    case o_bog:
      {
        ctx.save();

        var rShift = 0;
        var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
        var period = 4.0;
        var shiftAm = 2.5;
        rShift = shiftAm * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

        if (batchDrawOutline) {
          //sand 'outline'
          var strokeW = 4;
          ctx.fillStyle = "#5e5348";
          ctx.beginPath();
          ctx.arc(0, 0, this.rad, 0, Math.PI * 2);
          ctx.fill();
        } else {
          //ctx.fillStyle = "#73602A"; //98803A";
          ctx.fillStyle = "#706962"; //98803A";
          //ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(
            0,
            0,
            Math.max(0, this.rad - strokeW + rShift),
            0,
            Math.PI * 2
          );
          ctx.fill();

          if (!options_lowGraphics) {
            ctx.beginPath(); //top right
            ctx.arc(
              this.rad * 0.45,
              -this.rad * 0.45 + 15.0 * this.rPer,
              Math.max(0, this.rad * 0.5 + rShift),
              0,
              2 * Math.PI
            );
            ctx.fill();

            ctx.beginPath(); //bottom right
            ctx.arc(
              this.rad * 0.5,
              this.rad * 0.5 + 15.0 * this.rPer,
              Math.max(0, this.rad * 0.4 + rShift),
              0,
              2 * Math.PI
            );
            ctx.fill();

            ctx.beginPath(); //bottom left
            ctx.arc(
              -this.rad * 0.55 * 0.707,
              +this.rad * 0.55 * 0.707 + 15.0 * this.rPer,
              Math.max(0, this.rad * 0.5 + rShift),
              0,
              2 * Math.PI
            );
            ctx.fill();
            ctx.beginPath();
            ctx.arc(
              -this.rad * 0.75,
              -this.rad * 0.35 + 15.0 * this.rPer,
              Math.max(0, this.rad * 0.3 + rShift),
              0,
              2 * Math.PI
            );
            ctx.fill();

            ctx.beginPath();
            ctx.arc(
              this.rad + 10 * this.rPer,
              50 * this.rPer,
              8,
              0,
              2 * Math.PI
            );
            ctx.fill();

            ctx.beginPath();
            ctx.arc(
              this.rad - 20 * this.rPer,
              50 * this.rPer,
              10,
              0,
              2 * Math.PI
            );
            ctx.fill();
          }

          ctx.save();
          ctx.globalAlpha = 1.0 - this.underwaterA; //bubbles appear as animal fades

          var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
          var period = 1.5;
          var shiftAm = 8.0;
          var moveA =
            shiftAm * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

          if (this.flag_underWater) {
            ctx.globalAlpha *= 0.5;

            if (this.animalType == a_croc) ctx.globalAlpha = 0.3;
          }
          ctx.fillStyle = "yellow";
          var bubRad = this.rad * 0.15;
          ctx.beginPath(); //top left, right

          var bubbles = 1;
          for (i = 1; i <= bubbles; i++) {
            ctx.save();
            ctx.globalAlpha = 0.2;
            ctx.rotate(this.rPer * Math.PI * 2.0 * i);
            ctx.beginPath(); //top left, right
            ctx.arc(
              this.rad * -0.35,
              this.rad * -0.33,
              Math.max(0, bubRad + moveA),
              0,
              Math.PI * 2
            );
            ctx.fill();
            ctx.beginPath();
            ctx.arc(
              this.rad * 0.35,
              this.rad * -0.32,
              Math.max(0, bubRad - moveA),
              0,
              Math.PI * 2
            );
            ctx.fill();

            ctx.beginPath(); //bottom 2
            ctx.arc(
              this.rad * 0.35,
              this.rad * 0.36,
              Math.max(0, bubRad + moveA),
              0,
              Math.PI * 2
            );
            ctx.fill();
            ctx.beginPath();
            ctx.arc(
              this.rad * -0.35,
              this.rad * 0.35,
              Math.max(0, bubRad - moveA),
              0,
              Math.PI * 2
            );
            ctx.fill();
            ctx.restore();
          }
          ctx.restore();
        }

        ctx.restore();
      }
      break;

    case o_cloudBerry:
      {
        var theImg = getLoadedImg(
          "img/cloudberry" + (this.isEdibleOutlined() ? "_e" : "") + ".png"
        );
        if (theImg) {
          var rad = this.rad;
          ctx.save();

          var rad = this.rad;
          ctx.rotate(this.rPer * Math.PI * 2.0);
          ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);

          ctx.restore();
        }
      }
      break;

    case o_arcticNut:
      {
        var theImg = getLoadedImg(
          "img/arcticNut" + (this.isEdibleOutlined() ? "_e" : "") + ".png"
        );
        if (theImg) {
          var rad = this.rad;
          ctx.save();

          var rad = this.rad;
          ctx.rotate(this.rPer * Math.PI * 2.0);
          ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);

          ctx.restore();
        }
      }
      break;

    case o_carrot:
      {
        var theImg = getLoadedImg(
          "img/carrot" + (this.isEdibleOutlined() ? "_e" : "") + ".png"
        );
        if (theImg) {
          var rad = this.rad;
          ctx.save();
          ctx.rotate(this.rPer * Math.PI * 2.0);
          ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);

          ctx.restore();
        }
      }
      break;
    case o_watermelon:
      {
        var theImg = getLoadedImg(
          "img/watermelon" + (this.isEdibleOutlined() ? "_e" : "") + ".png"
        );
        if (theImg) {
          var rad = this.rad;
          ctx.save();
          ctx.rotate(this.rPer * Math.PI * 2.0);
          ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);

          ctx.restore();
        }
      }
      break;
    case o_poisonBerry:
      {
        ctx.save();
        //outlineCol
        drawCircle(
          0,
          0,
          this.rad,
          !this.isEdibleOutlined()
            ? outlineColForBiome(this.curBiome)
            : col_edibleOutline
        );
        drawCircle(0, 0, Math.max(0, this.rad - 2), "#74e61e");

        ctx.restore();

        /*var theImg = getLoadedImg("img/poisonBerry1.png");// + (this.isEdibleOutlined() ? "_e" : "") + ".png");
                            if (theImg) {
                                var rad = this.rad;
                                ctx.save();
                                ctx.rotate(this.rPer * Math.PI * 2.0);
                                ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);

                                ctx.restore();
                            }*/
      }

      break;
    case o_watermelonSlice:
      {
        var theImg = getLoadedImg(
          "img/watermelonSlice" + (this.isEdibleOutlined() ? "_e" : "") + ".png"
        );
        if (theImg) {
          var rad = this.rad;
          ctx.save();
          ctx.rotate(this.rPer * Math.PI * 2.0);
          ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);

          ctx.restore();
        }
      }
      break;

    case o_meatSmall:
    case o_meatMedium:
    case o_meatLarge:
      {
        var meatType = 0;
        var theImg = getLoadedImg(
          "img/" +
          meatType +
          "meat" +
          (this.isEdibleOutlined() ? "_e" : "") +
          ".png"
        );
        if (theImg) {
          var rad = this.rad;
          ctx.save();
          ctx.rotate(this.rPer * Math.PI * 2.0);
          ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);
          ctx.restore();
        }
      }
      break;

    case o_mushroom:
    case o_bigMushroom:
      {
        var strokeW = 2;
        var wid = this.oType == o_bigMushroom ? 15 : 9;

        //mushroom leg stroke outline
        ctx.fillStyle = this.getOutlineColor();
        ctx.beginPath();
        ctx.rect(
          -wid / 2 - strokeW,
          -strokeW,
          wid + strokeW * 2,
          this.rad * 0.8 + strokeW * 2
        );
        ctx.fill();

        //mushroom leg
        ctx.fillStyle = "#FFCA49";
        ctx.beginPath();
        ctx.rect(-wid / 2, 0 + strokeW / 2, wid, this.rad * 0.8 - strokeW / 2);
        ctx.fill();

        //head outline
        if (!options_lowGraphics) {
          ctx.beginPath();
          ctx.arc(0, 0, Math.max(0, this.rad), Math.PI, 2 * Math.PI);
          ctx.fillStyle = this.getOutlineColor(); //col_outline_land;
          ctx.fill();
        }
        //head
        ctx.beginPath();
        ctx.arc(0, 0, Math.max(0, this.rad - strokeW), Math.PI, 2 * Math.PI);
        ctx.fillStyle = this.oType == o_bigMushroom ? "#B8413B" : "#CFAD59";
        ctx.fill();
      }
      break;
    case o_bigMushroomBush:
      {
        //ctx.strokeStyle = col_outline_land; //outline
        //ctx.lineWidth = 2;
        var strokeW = 2;
        //console.log("big mush!");

        ctx.save();

        var rShift = 0;
        var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
        var period = 2.0;
        var shiftAm = 1.5;
        rShift = shiftAm * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

        ctx.fillStyle = "#45D157";

        ctx.globalAlpha *= 0.93;
        ctx.beginPath();
        ctx.arc(
          -this.rad * 0.5,
          -this.rad * 0.5 + 10.0 * this.rPer,
          Math.max(0, this.rad * 0.55 + rShift),
          0,
          2 * Math.PI
        );
        ctx.fill();
        ctx.beginPath();
        ctx.arc(
          this.rad * 0.5,
          -this.rad * 0.5 - 10.0 * this.rPer,
          Math.max(0, this.rad * 0.43 - rShift),
          0,
          2 * Math.PI
        );
        ctx.fill();
        ctx.beginPath();
        //ctx.globalAlpha = 0.95;
        ctx.arc(
          this.rad * 0.6,
          this.rad * 0.4,
          Math.max(0, this.rad * 0.48 + rShift),
          0,
          2 * Math.PI
        );
        ctx.fill();
        ctx.beginPath();
        ctx.arc(
          -this.rad * 0.5,
          this.rad * 0.5,
          Math.max(0, this.rad * 0.4 + this.rPer - rShift),
          0,
          2 * Math.PI
        );
        ctx.fill();

        ctx.restore();

        var wid = 20;
        //stroke outline
        ctx.fillStyle = this.getOutlineColor();
        ctx.beginPath();
        ctx.rect(
          -wid / 2 - strokeW,
          -strokeW,
          wid + strokeW * 2,
          this.rad * 0.8 + strokeW * 2
        );
        ctx.fill();
        //mushroom leg
        ctx.fillStyle = "#FFCA49";
        ctx.beginPath();
        ctx.rect(-wid / 2, 0 + strokeW / 2, wid, this.rad * 0.8 - strokeW / 2);
        ctx.fill();
        //ctx.stroke();

        //outline
        ctx.beginPath();
        ctx.arc(0, 0, Math.max(0, this.rad * 0.8), Math.PI, 2 * Math.PI);
        ctx.fillStyle = this.getOutlineColor();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(
          0,
          0,
          Math.max(0, this.rad * 0.8 - strokeW),
          Math.PI,
          2 * Math.PI
        );
        ctx.fillStyle = "#B8413B";
        ctx.fill();
        //ctx.stroke();
      }
      break;
    case o_lillypad:
      {
        //outline drawing

        var theImg = getLoadedImg(
          "img/lillypad" + (this.isEdibleOutlined() ? "_e" : "") + ".png"
        );

        if (theImg) {
          var rad = this.rad;
          ctx.rotate(this.rPer * Math.PI * 2.0);
          ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);
          //console.log("drawing banana");
          /*if(this.rPer<0.2){
                      var rad=this.rad*0.25;
                        var flowImg=getLoadedImg("img/lilly_fl.png");
                        if(flowImg){
                        ctx.drawImage(flowImg, -rad , -rad , 2 * rad, 2 * rad);
                      }
                    }*/
        }
      }
      break;
    case o_hidingHole:
      {
        this.drawOutlinedCircle("", "#9F8641");

        drawCircle(
          0 - this.rPer,
          0 - this.rPer,
          Math.max(0, this.rad - 7),
          "#7E6A35"
        );

        drawCircle(0 + this.rPer, 1, Math.max(0, this.rad - 12), "#5C4E28");
      }
      break;
    case o_abilityGObj:
      {
        console.log("ERROR: " + this + " should be subclassed!");

        //drawCircle(0 + this.rPer, 1, Math.max(0, this.rad - 12), "#5C4E28");
      }
      break;
    case o_hidingHoleOcean:
      {
        var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
        var period = 1.2;
        var xShift = 2.5 * Math.cos(((2.0 * Math.PI) / period) * tSinceSpawn);
        var yShift = 2.5 * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

        this.drawOutlinedCircle("", "#2CAAC4");

        if (!options_lowGraphics) {
          drawCircle(
            0 + xShift / 2 - this.rPer,
            0 + yShift / 2 - this.rPer,
            Math.max(0, this.rad - 6),
            "#2D93B0"
          );
        }
        drawCircle(
          0 + xShift / 4.5 + this.rPer,
          1 + yShift / 1.5,
          Math.max(0, this.rad - 14),
          "#29A0BA"
        );
        drawCircle(
          0 + xShift / 1.5 - this.rPer * 2,
          yShift,
          Math.max(0, this.rad - 18.5 + yShift / 5),
          "#2B8CAA"
        );
        drawCircle(
          0 + xShift / 1.5 - this.rPer * 2,
          yShift,
          Math.max(0, this.rad - 24.5 + yShift / 11),
          "#28829E"
        );
      }
      break;
    case o_bigHidingHole:
      {
        this.drawOutlinedCircle("", "#9F8641");
        //drawCircle(0, 0, this.rad, "#9F8641");

        if (!options_lowGraphics) {
          drawCircle(
            0 - this.rPer,
            0 - this.rPer,
            Math.max(0, this.rad - 7),
            "#7E6A35"
          );
        }

        drawCircle(0 + this.rPer, 1, Math.max(0, this.rad - 14), "#5C4E28");
        drawCircle(
          0 - this.rPer * 2 - 3,
          1,
          Math.max(0, this.rad - 18.5),
          "#40371D"
        );
      }
      break;
    case o_hidingBush:
      {
        ctx.save();

        //draw bush animation
        var rShift = 0;
        var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
        var period = 2.0;
        var shiftAm = 1.5;
        rShift = shiftAm * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

        var bushBgCol = "#45D157";
        switch (this.curBiome) {
          case biome_ocean:
            bushBgCol = "#786810";
            break;
          case biome_arctic:
            bushBgCol = "#CED0D0";
            break;
          default:
          case biome_land:
            bushBgCol = "#45D157";
            break;
        }
        ctx.fillStyle = bushBgCol;

        ctx.globalAlpha *= 0.93;
        ctx.beginPath();
        ctx.arc(
          -this.rad * 0.5,
          -this.rad * 0.5 + 10.0 * this.rPer,
          Math.max(0, this.rad * 0.65 + rShift),
          0,
          2 * Math.PI
        );
        ctx.fill();
        ctx.beginPath();
        ctx.arc(
          this.rad * 0.5,
          -this.rad * 0.5 - 10.0 * this.rPer,
          Math.max(0, this.rad * 0.73 - rShift),
          0,
          2 * Math.PI
        );
        ctx.fill();
        ctx.beginPath();
        //ctx.globalAlpha = 0.95;
        ctx.arc(
          this.rad * 0.6,
          this.rad * 0.4,
          Math.max(0, this.rad * 0.78 + rShift),
          0,
          2 * Math.PI
        );
        ctx.fill();
        ctx.beginPath();
        ctx.arc(
          -this.rad * 0.5,
          this.rad * 0.5,
          Math.max(0, this.rad * 0.6 + this.rPer - rShift),
          0,
          2 * Math.PI
        );
        ctx.fill();

        ctx.restore();
      }
      break;
    case o_biome_volcano:
      {
        ctx.save();
        if (!options_lowGraphics) ctx.rotate(this.rPer * 2 * Math.PI);

        var rShift = 0;
        var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
        var period = 6.0;
        var shiftAm = 1.5;
        rShift = shiftAm * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

        //console.log("Mud");
        //ctx.globalAlpha = 1;
        //green outline (without stroke- optimized)
        var strokeW = 4;
        ctx.fillStyle = "#604729";
        ctx.beginPath();
        ctx.arc(0, 0, this.rad, 0, Math.PI * 2);
        ctx.fill();

        if (!options_lowGraphics) {
          ctx.fillStyle = "#8A681B";
          //ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(
            0,
            0,
            Math.max(0, this.rad - strokeW + rShift),
            0,
            Math.PI * 2
          );
          ctx.fill();

          ctx.beginPath(); //top right
          ctx.arc(
            this.rad * 0.45,
            -this.rad * 0.45 + 15.0 * this.rPer,
            Math.max(0, this.rad * 0.5 + rShift),
            0,
            2 * Math.PI
          );
          ctx.fill();

          ctx.beginPath(); //bottom right
          ctx.arc(
            this.rad * 0.5,
            this.rad * 0.5 + 15.0 * this.rPer,
            Math.max(0, this.rad * 0.4 + rShift),
            0,
            2 * Math.PI
          );
          ctx.fill();

          ctx.beginPath(); //bottom left
          ctx.arc(
            -this.rad * 0.55 * 0.707,
            +this.rad * 0.55 * 0.707 + 15.0 * this.rPer,
            Math.max(0, this.rad * 0.5 + rShift),
            0,
            2 * Math.PI
          );
          ctx.fill();
          ctx.beginPath();
          ctx.arc(
            -this.rad * 0.75,
            -this.rad * 0.35 + 15.0 * this.rPer,
            Math.max(0, this.rad * 0.3 + rShift),
            0,
            2 * Math.PI
          );
          ctx.fill();
          ctx.beginPath();
          ctx.beginPath();
          ctx.arc(this.rad + 10 * this.rPer, 50 * this.rPer, 8, 0, 2 * Math.PI);
          ctx.fill();
          ctx.beginPath();
          ctx.beginPath();
          ctx.arc(
            this.rad - 20 * this.rPer,
            50 * this.rPer,
            10,
            0,
            2 * Math.PI
          );
          ctx.fill();
          ctx.beginPath();
        }

        ctx.restore();
      }
      break;
    case o_biome_poison:
      {
        ctx.save();
        if (!options_lowGraphics) ctx.rotate(this.rPer * 2 * Math.PI);

        var rShift = 0;
        var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
        var period = 6.0;
        var shiftAm = 1.5;
        rShift = shiftAm * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

        //console.log("Mud");
        //ctx.globalAlpha = 1;
        //green outline (without stroke- optimized)
        var strokeW = 4;
        ctx.fillStyle = "#605649";
        ctx.beginPath();
        ctx.arc(0, 0, this.rad, 0, Math.PI * 2);
        ctx.fill();

        if (!options_lowGraphics) {
          ctx.fillStyle = "#5e4f36";
          //ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(
            0,
            0,
            Math.max(0, this.rad - strokeW + rShift),
            0,
            Math.PI * 2
          );
          ctx.fill();

          ctx.beginPath(); //top right
          ctx.arc(
            this.rad * 0.45,
            -this.rad * 0.45 + 15.0 * this.rPer,
            Math.max(0, this.rad * 0.5 + rShift),
            0,
            2 * Math.PI
          );
          ctx.fill();

          ctx.beginPath(); //bottom right
          ctx.arc(
            this.rad * 0.5,
            this.rad * 0.5 + 15.0 * this.rPer,
            Math.max(0, this.rad * 0.4 + rShift),
            0,
            2 * Math.PI
          );
          ctx.fill();

          ctx.beginPath(); //bottom left
          ctx.arc(
            -this.rad * 0.55 * 0.707,
            +this.rad * 0.55 * 0.707 + 15.0 * this.rPer,
            Math.max(0, this.rad * 0.5 + rShift),
            0,
            2 * Math.PI
          );
          ctx.fill();
          ctx.beginPath();
          ctx.arc(
            -this.rad * 0.75,
            -this.rad * 0.35 + 15.0 * this.rPer,
            Math.max(0, this.rad * 0.3 + rShift),
            0,
            2 * Math.PI
          );
          ctx.fill();
          ctx.beginPath();
          ctx.beginPath();
          ctx.arc(this.rad + 10 * this.rPer, 50 * this.rPer, 8, 0, 2 * Math.PI);
          ctx.fill();
          ctx.beginPath();
          ctx.beginPath();
          ctx.arc(
            this.rad - 20 * this.rPer,
            50 * this.rPer,
            10,
            0,
            2 * Math.PI
          );
          ctx.fill();
          ctx.beginPath();
        }

        ctx.restore();
      }
      break;
    case o_mudSpot:
      {
        ctx.save();
        if (!options_lowGraphics) ctx.rotate(this.rPer * 2 * Math.PI);

        var rShift = 0;
        var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
        var period = 6.0;
        var shiftAm = 1.5;
        rShift = shiftAm * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

        //console.log("Mud");
        //ctx.globalAlpha = 1;
        //green outline (without stroke- optimized)
        var strokeW = 4;
        ctx.fillStyle = "#8B7833";
        ctx.beginPath();
        ctx.arc(0, 0, this.rad, 0, Math.PI * 2);
        ctx.fill();

        if (!options_lowGraphics) {
          ctx.fillStyle = "#98803A";
          //ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(
            0,
            0,
            Math.max(0, this.rad - strokeW + rShift),
            0,
            Math.PI * 2
          );
          ctx.fill();

          ctx.beginPath(); //top right
          ctx.arc(
            this.rad * 0.45,
            -this.rad * 0.45 + 15.0 * this.rPer,
            Math.max(0, this.rad * 0.5 + rShift),
            0,
            2 * Math.PI
          );
          ctx.fill();

          ctx.beginPath(); //bottom right
          ctx.arc(
            this.rad * 0.5,
            this.rad * 0.5 + 15.0 * this.rPer,
            Math.max(0, this.rad * 0.4 + rShift),
            0,
            2 * Math.PI
          );
          ctx.fill();

          ctx.beginPath(); //bottom left
          ctx.arc(
            -this.rad * 0.55 * 0.707,
            +this.rad * 0.55 * 0.707 + 15.0 * this.rPer,
            Math.max(0, this.rad * 0.5 + rShift),
            0,
            2 * Math.PI
          );
          ctx.fill();
          ctx.beginPath();
          ctx.arc(
            -this.rad * 0.75,
            -this.rad * 0.35 + 15.0 * this.rPer,
            Math.max(0, this.rad * 0.3 + rShift),
            0,
            2 * Math.PI
          );
          ctx.fill();
          ctx.beginPath();
          ctx.beginPath();
          ctx.arc(this.rad + 10 * this.rPer, 50 * this.rPer, 8, 0, 2 * Math.PI);
          ctx.fill();
          ctx.beginPath();
          ctx.beginPath();
          ctx.arc(
            this.rad - 20 * this.rPer,
            50 * this.rPer,
            10,
            0,
            2 * Math.PI
          );
          ctx.fill();
          ctx.beginPath();
        }

        ctx.restore();
      }
      break;
    case o_arcticIce:
      {
        ctx.save();
        if (!options_lowGraphics) ctx.rotate(this.rPer * 2 * Math.PI);

        var rShift = 0;
        var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
        var period = 6.0;
        var shiftAm = 1.5;
        rShift = shiftAm * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

        //console.log("Mud");
        //ctx.globalAlpha = 1;
        //green outline (without stroke- optimized)
        var strokeW = 4;
        ctx.fillStyle = "#8CC3C7";
        ctx.beginPath();
        ctx.arc(0, 0, this.rad, 0, Math.PI * 2);
        ctx.fill();

        if (!options_lowGraphics) {
          ctx.fillStyle = "#9DDADE";
          //ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(
            0,
            0,
            Math.max(0, this.rad - strokeW + rShift),
            0,
            Math.PI * 2
          );
          ctx.fill();

          ctx.beginPath(); //top right
          ctx.arc(
            this.rad * 0.45,
            -this.rad * 0.45 + 15.0 * this.rPer,
            Math.max(0, this.rad * 0.5 + rShift),
            0,
            2 * Math.PI
          );
          ctx.fill();

          ctx.beginPath(); //bottom right
          ctx.arc(
            this.rad * 0.5,
            this.rad * 0.5 + 15.0 * this.rPer,
            Math.max(0, this.rad * 0.4 + rShift),
            0,
            2 * Math.PI
          );
          ctx.fill();

          ctx.beginPath(); //bottom left
          ctx.arc(
            -this.rad * 0.55 * 0.707,
            +this.rad * 0.55 * 0.707 + 15.0 * this.rPer,
            Math.max(0, this.rad * 0.5 + rShift),
            0,
            2 * Math.PI
          );
          ctx.fill();
          ctx.beginPath();
          ctx.arc(
            -this.rad * 0.75,
            -this.rad * 0.35 + 15.0 * this.rPer,
            Math.max(0, this.rad * 0.3 + rShift),
            0,
            2 * Math.PI
          );
          ctx.fill();
          ctx.beginPath();
          ctx.beginPath();
          ctx.arc(this.rad + 10 * this.rPer, 50 * this.rPer, 8, 0, 2 * Math.PI);
          ctx.fill();
          ctx.beginPath();
          ctx.beginPath();
          ctx.arc(
            this.rad - 20 * this.rPer,
            50 * this.rPer,
            10,
            0,
            2 * Math.PI
          );
          ctx.fill();
          ctx.beginPath();
        }

        ctx.restore();
      }
      break;
    case o_lake:
      {
        ctx.save();
        if (!options_lowGraphics) ctx.rotate(this.rPer * 2 * Math.PI);

        var rShift = 0;
        var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
        var period = 4.0;
        var shiftAm = 5.5;
        rShift = shiftAm * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

        //sand 'outline'
        var strokeW = 4;
        ctx.fillStyle = col_ocean_sand;
        ctx.beginPath();
        ctx.arc(0, 0, this.rad, 0, Math.PI * 2);
        ctx.fill();

        //ctx.fillStyle = "#73602A"; //98803A";

        if (this.curBiome == biome_arctic) ctx.fillStyle = "#8da0d6";
        else ctx.fillStyle = col_wat2; //98803A";
        //ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(0, 0, Math.max(0, this.rad - strokeW + rShift), 0, Math.PI * 2);
        ctx.fill();

        if (!options_lowGraphics) {
          ctx.beginPath(); //top right
          ctx.arc(
            this.rad * 0.45,
            -this.rad * 0.45 + 15.0 * this.rPer,
            Math.max(0, this.rad * 0.5 + rShift),
            0,
            2 * Math.PI
          );
          ctx.fill();

          ctx.beginPath(); //bottom right
          ctx.arc(
            this.rad * 0.5,
            this.rad * 0.5 + 15.0 * this.rPer,
            Math.max(0, this.rad * 0.4 + rShift),
            0,
            2 * Math.PI
          );
          ctx.fill();

          ctx.beginPath(); //bottom left
          ctx.arc(
            -this.rad * 0.55 * 0.707,
            +this.rad * 0.55 * 0.707 + 15.0 * this.rPer,
            Math.max(0, this.rad * 0.5 + rShift),
            0,
            2 * Math.PI
          );
          ctx.fill();
          ctx.beginPath();
          ctx.arc(
            -this.rad * 0.75,
            -this.rad * 0.35 + 15.0 * this.rPer,
            Math.max(0, this.rad * 0.3 + rShift),
            0,
            2 * Math.PI
          );
          ctx.fill();

          ctx.beginPath();
          ctx.arc(this.rad + 10 * this.rPer, 50 * this.rPer, 8, 0, 2 * Math.PI);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(
            this.rad - 20 * this.rPer,
            50 * this.rPer,
            10,
            0,
            2 * Math.PI
          );
          ctx.fill();
        }

        ctx.restore();
      }
      break;
    //water pouring out of the ocean
    case o_biome_ocean_extraWater:
      {
        ctx.save();
        if (!options_lowGraphics) ctx.rotate(this.rPer * 2 * Math.PI);
        var rShift = 0;
        var tSinceSpawn = (timestamp - ocean_anim_startT) / 1000.0;
        var period = 5.0;
        var shiftAm = 5.5;
        rShift = shiftAm * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

        var strokeW = 4;

        //sand 'outline'
        if (batchDrawOutline) {
          /*var strokeW = 4;
                    ctx.fillStyle = col_ocean_sand;
                    ctx.beginPath();
                    ctx.arc(0, 0, this.rad, 0, Math.PI * 2);
                    ctx.fill();*/
        } else {
          ctx.fillStyle = col_ocean; //98803A";
          ctx.beginPath();
          ctx.arc(
            0,
            0,
            Math.max(0, this.rad - strokeW + rShift),
            0,
            Math.PI * 2
          );
          ctx.fill();

          if (!options_lowGraphics) {
            ctx.beginPath(); //little puddles around 'lake'
            ctx.arc(
              this.rad + 10 * this.rPer,
              50 * this.rPer,
              8,
              0,
              2 * Math.PI
            );
            ctx.fill();

            ctx.beginPath();
            ctx.arc(
              this.rad - 20 * this.rPer,
              50 * this.rPer,
              10,
              0,
              2 * Math.PI
            );
            ctx.fill();
          }
        }

        ctx.restore();
      }
      break;
    case o_biome_ocean:
      {
        //draw ocean (just a rectangle)
        var waveDelta = 0;
        var tSinceSpawn = (timestamp - ocean_anim_startT) / 1000.0;
        var period = 5.0;
        var shiftAm = -8.5;
        waveDelta =
          shiftAm * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

        var beachW = 10.0;

        var oceanNum = this.x > gameW / 2 ? 1 : 0; //left vs. right ocean
        if (oceanNum == 1) {
          //RIGHT side =1, 0=right

          //dark rect outside ocean bounds
          /*var wid = 500.0;
                    var oAlpha = ctx.globalAlpha;
                    ctx.globalAlpha = oAlpha * 1.0;
                    ctx.fillStyle = "#16799F"; //"#3A4495";
                    ctx.fillRect((this.rectW / 2), (-this.rectH / 2), wid, this.rectH + 2 * wid); //right
                    //ctx.fillRect((-this.rectW/ 2) , (-this.rectH/ 2) - wid, this.rectW, wid + 1); //top
                    ctx.fillRect((-this.rectW / 2), (this.rectH / 2) - 0.5, this.rectW, wid + 1); //bottom*/

          //beach L
          /*ctx.globalAlpha = oAlpha * 1.0;
                    ctx.fillStyle = col_ocean_sand;
                    ctx.fillRect(-this.rectW / 2 - beachW, -this.rectH / 2, beachW * 2, this.rectH);
                    //beach top (beach aligns with top, fills gap)
                    ctx.fillRect(-this.rectW / 2 - beachW, -this.rectH / 2, this.rectW + beachW, beachW * 2);*/
          //main water
          ctx.fillStyle = col_ocean;

          ctx.fillRect(
            -this.rectW / 2 + waveDelta,
            -this.rectH / 2 + waveDelta + beachW,
            this.rectW - waveDelta,
            this.rectH - waveDelta - beachW
          );
          //circle
          ctx.beginPath();
          ctx.arc(
            -this.rectW / 2 + 50,
            -this.rectH / 2 + 50,
            70.0 - waveDelta,
            0,
            2 * Math.PI
          );
          ctx.fill();

          var minusForEdge = 35;
          fillGrid(
            -this.rectW / 2 + minusForEdge,
            -this.rectH / 2 + minusForEdge,
            this.rectW / 2 - minusForEdge,
            this.rectH / 2 - minusForEdge,
            this.x,
            this.y
          );
        } else {
          //LEFT side

          //dark rect outside ocean bounds
          /*var wid = 1200.0;
                    var oAlpha = ctx.globalAlpha;
                    ctx.globalAlpha = oAlpha * 1.0;
                    ctx.fillStyle = "#16799F"; //"#3A4495";
                    ctx.fillRect((-this.rectW / 2) - wid, (-this.rectH / 2), wid + 0.5, this.rectH + 2 * wid); //left
                    //ctx.fillRect((-this.rectW/ 2) , (-this.rectH/ 2) - wid, this.rectW, wid + 2); //top
                    ctx.fillRect((-this.rectW / 2), (this.rectH / 2) - 0.5, this.rectW, wid + 1); //bottom*/

          //beach R (overlaps by beachW in)
          /*ctx.globalAlpha = oAlpha * 1.0;
                    ctx.fillStyle = col_ocean_sand;
                    ctx.fillRect(this.rectW / 2 - beachW, -this.rectH / 2, beachW * 2, this.rectH);
                    //beach top
                    ctx.fillRect(-this.rectW / 2, -this.rectH / 2, this.rectW + beachW, beachW * 2);*/
          //main water
          ctx.fillStyle = col_ocean;
          waveDelta *= -1;
          ctx.fillRect(
            -this.rectW / 2,
            -this.rectH / 2 - waveDelta + beachW,
            this.rectW + waveDelta,
            this.rectH + waveDelta - beachW
          );

          var minusForEdge = 25;
          fillGrid(
            -this.rectW / 2 + minusForEdge,
            -this.rectH / 2 + minusForEdge,
            this.rectW / 2 - minusForEdge,
            this.rectH / 2 - minusForEdge,
            this.x,
            this.y
          );
        }
      }
      break;
    case o_beach:
      {
        //draw jagged un-even polygon
        ctx.fillStyle = col_ocean_sand;
        //ctx.fillRect(-this.rectW / 2, -this.rectH / 2, this.rectW, this.rectH);

        var x_min = -this.rectW / 2; //of box to draw jagged around
        var x_max = this.rectW / 2;
        var y_min = -this.rectH / 2;
        var y_max = this.rectH / 2;

        //jagged vertically (top-bottom)
        ctx.beginPath();
        ctx.moveTo(x_min, y_min);
        var extraBeachW = 20.0;

        var offsetsLst = [-15, 10, -10, 12, 0, 5, -10, 5, -12, 5, 10, 0, -6];
        var oSpread = 45; //dist between offset points
        var oCount = 0;

        //clamp vars to keep drawing in room!
        var relMaxX = gameW - this.x;
        var relMinX = 0 - this.x;
        var relMaxY = gameH - this.y;
        var relMinY = 0 - this.y;
        //jagged: top-left to bottom-left
        var dy;
        var dx = x_min - extraBeachW;
        for (dy = y_min; dy < y_max; dy += oSpread) {
          ctx.lineTo(
            Math.min(relMaxX, Math.max(relMinX, dx + offsetsLst[oCount])),
            dy
          );
          oCount = (oCount + 1) % offsetsLst.length; //loop through offsets
        }

        ctx.lineTo(x_min, y_max); //connect to bl

        // jagged: bl - br
        dy = y_max + extraBeachW;
        for (dx = x_min; dx < x_max; dx += oSpread) {
          ctx.lineTo(
            dx,
            Math.min(relMaxY, Math.max(relMinY, dy + offsetsLst[oCount]))
          );
          oCount = (oCount + 1) % offsetsLst.length; //loop through offsets
        }
        ctx.lineTo(x_max, y_max); //connect to br

        //X jagged: br- tr
        dx = x_max + extraBeachW;
        for (dy = y_max; dy > y_min; dy -= oSpread) {
          ctx.lineTo(
            Math.min(relMaxX, Math.max(relMinX, dx + offsetsLst[oCount])),
            dy
          ); //clamp to keep drawing in-game
          oCount = (oCount + 1) % offsetsLst.length; //loop through offsets
        }
        ctx.lineTo(x_max, y_min); //to tr

        //X jagged: tr-tl
        dy = y_min - extraBeachW;
        for (dx = x_max; dx > x_min; dx -= oSpread) {
          ctx.lineTo(
            dx,
            Math.min(relMaxY, Math.max(relMinY, dy + offsetsLst[oCount]))
          );
          oCount = (oCount + 1) % offsetsLst.length; //loop through offsets
        }

        ctx.closePath(); //to tl
        ctx.fill();

        //draw dark grid
        //fillGrid(-this.rectW / 2, -this.rectH / 2, this.rectW / 2, this.rectH / 2);
      }
      break;
    case o_biome_desert:
      {
        var oAlpha = ctx.globalAlpha;
        //ctx.globalAlpha = oAlpha * 0.8;
        //var gradLen = 30.0;
        ctx.fillStyle = col_ocean_sand; // col_wat2;
        ctx.fillRect(-this.rectW / 2, -this.rectH / 2, this.rectW, this.rectH);

        var minusForEdge = 35;
        fillGrid(
          -this.rectW / 2 + minusForEdge,
          -this.rectH / 2 + minusForEdge,
          this.rectW / 2 - minusForEdge,
          this.rectH / 2 - minusForEdge,
          this.x,
          this.y
        );

        //top of river
        var edgeW = 15;
        {
          ctx.fillStyle = col_ocean_sand;

          var x_min = -this.rectW / 2; //of box to draw jagged around
          var x_max = this.rectW / 2;
          var y_min = -this.rectH / 2 + 3.0;
          var y_max = -this.rectH / 2 - edgeW;

          //jagged vertically (top-bottom)
          ctx.beginPath();
          ctx.moveTo(x_min, y_min);
          var extraBeachW = 0.0;

          var offsetsLst = [
            -15, 5, 10, 0, -10, 3, 12, 4, 0, 3, 5, -10, 5, -12, 5, 10, 0, -6,
          ];
          var oSpread = 60; //dist between offset points
          var oCount = 0;

          //clamp vars to keep drawing in room!
          var relMaxX = gameW - this.x;
          var relMinX = 0 - this.x;
          var relMaxY = gameH - this.y;
          var relMinY = 0 - this.y;
          //jagged: top-left to bottom-left
          var dy;
          var dx = x_min - extraBeachW;
          /*for(dy=y_min; dy<y_max; dy+=oSpread){
                      ctx.lineTo(Math.min(relMaxX, Math.max(relMinX,dx+ offsetsLst[oCount])), dy);
                      oCount=(oCount+1)%(offsetsLst.length); //loop through offsets
                    }*/

          ctx.lineTo(x_min, y_max); //connect to bl

          // jagged: bl - br
          dy = y_max + extraBeachW;
          for (dx = x_min; dx < x_max; dx += oSpread) {
            ctx.lineTo(
              dx,
              Math.min(relMaxY, Math.max(relMinY, dy + offsetsLst[oCount]))
            );
            oCount = (oCount + 1) % offsetsLst.length; //loop through offsets
          }

          ctx.lineTo(x_max, y_max); //connect to br

          //X jagged: br- tr
          /*dx=x_max + extraBeachW;
                    for(dy=y_max; dy>y_min; dy-=oSpread){
                      ctx.lineTo(Math.min(relMaxX, Math.max(relMinX,dx+ offsetsLst[oCount])), dy); //clamp to keep drawing in-game
                      oCount=(oCount+1)%(offsetsLst.length); //loop through offsets
                    }*/
          ctx.lineTo(x_max, y_min); //to tr

          //X jagged: tr-tl
          /*dy=y_min - extraBeachW;
                    for(dx=x_max; dx>x_min; dx-=oSpread){
                      ctx.lineTo(dx , Math.min(relMaxY, Math.max(relMinY,dy+offsetsLst[oCount])));
                      oCount=(oCount+1)%(offsetsLst.length); //loop through offsets
                    }*/

          ctx.closePath(); //to tl

          ctx.fill();
        }
      }
      break;
    case o_biome_arctic:
      {
        var oAlpha = ctx.globalAlpha;
        //ctx.globalAlpha = oAlpha * 0.8;
        //var gradLen = 30.0;
        ctx.fillStyle = "#ececec"; // col_wat2;
        ctx.fillRect(-this.rectW / 2, -this.rectH / 2, this.rectW, this.rectH);

        //ctx.fillStyle = col_ocean_sand;
        //ctx.fillRect(-this.rectW / 2, -this.rectH / 2, this.rectW, this.rectH);

        var x_min = -this.rectW / 2; //of box to draw jagged around
        var x_max = this.rectW / 2;
        var y_min = this.rectH / 2 - 20;
        var y_max = this.rectH / 2;

        snowLandWidth = this.rectW;
        snowLandHeight = this.rectH;

        //jagged vertically (top-bottom)
        ctx.beginPath();
        ctx.moveTo(x_min, y_min);
        var extraBeachW = 20.0;

        var offsetsLst = [
          -15, 5, 10, 0, -10, 3, 12, 4, 0, 3, 5, -10, 5, -12, 5, 10, 0, -6,
        ];
        var oSpread = 60; //dist between offset points
        var oCount = 0;

        //clamp vars to keep drawing in room!
        var relMaxX = gameW - this.x;
        var relMinX = 0 - this.x;
        var relMaxY = gameH - this.y;
        var relMinY = 0 - this.y;
        //jagged: top-left to bottom-left
        var dy;
        var dx = x_min - extraBeachW;
        /*for(dy=y_min; dy<y_max; dy+=oSpread){
                    ctx.lineTo(Math.min(relMaxX, Math.max(relMinX,dx+ offsetsLst[oCount])), dy);
                    oCount=(oCount+1)%(offsetsLst.length); //loop through offsets
                }*/

        ctx.lineTo(x_min, y_max); //connect to bl

        // jagged: bl - br
        dy = y_max + extraBeachW;
        for (dx = x_min; dx < x_max; dx += oSpread) {
          ctx.lineTo(
            dx,
            Math.min(relMaxY, Math.max(relMinY, dy + offsetsLst[oCount]))
          );
          oCount = (oCount + 1) % offsetsLst.length; //loop through offsets
        }
        ctx.lineTo(x_max, y_max); //connect to br

        //X jagged: br- tr
        /*dx=x_max + extraBeachW;
                for(dy=y_max; dy>y_min; dy-=oSpread){
                    ctx.lineTo(Math.min(relMaxX, Math.max(relMinX,dx+ offsetsLst[oCount])), dy); //clamp to keep drawing in-game
                    oCount=(oCount+1)%(offsetsLst.length); //loop through offsets
                }*/
        ctx.lineTo(x_max, y_min); //to tr

        //X jagged: tr-tl
        /*dy=y_min - extraBeachW;
                for(dx=x_max; dx>x_min; dx-=oSpread){
                    ctx.lineTo(dx , Math.min(relMaxY, Math.max(relMinY,dy+offsetsLst[oCount])));
                    oCount=(oCount+1)%(offsetsLst.length); //loop through offsets
                }*/

        ctx.closePath(); //to tl
        ctx.fill();

        //draw dark grid
        var minusForEdge = 20;
        fillGrid(
          -this.rectW / 2 + minusForEdge,
          -this.rectH / 2 + minusForEdge,
          this.rectW / 2 - minusForEdge,
          this.rectH / 2 - minusForEdge,
          this.x,
          this.y
        );
      }
      break;
    case o_river:
      {
        var oAlpha = ctx.globalAlpha;
        //ctx.globalAlpha = oAlpha * 0.8;
        //var gradLen = 30.0;

        ctx.fillStyle = col_wat2;
        ctx.fillRect(-this.rectW / 2, -this.rectH / 2, this.rectW, this.rectH);

        //top of river
        var edgeW = 15;
        {
          ctx.fillStyle = col_wat2;

          var x_min = -this.rectW / 2; //of box to draw jagged around
          var x_max = this.rectW / 2;
          var y_min = -this.rectH / 2 + 3.0;
          var y_max = -this.rectH / 2 - edgeW;

          //jagged vertically (top-bottom)
          ctx.beginPath();
          ctx.moveTo(x_min, y_min);
          var extraBeachW = 0.0;

          var offsetsLst = [
            -15, 5, 10, 0, -10, 3, 12, 4, 0, 3, 5, -10, 5, -12, 5, 10, 0, -6,
          ];
          var oSpread = 60; //dist between offset points
          var oCount = 0;

          //clamp vars to keep drawing in room!
          var relMaxX = gameW - this.x;
          var relMinX = 0 - this.x;
          var relMaxY = gameH - this.y;
          var relMinY = 0 - this.y;
          //jagged: top-left to bottom-left
          var dy;
          var dx = x_min - extraBeachW;
          /*for(dy=y_min; dy<y_max; dy+=oSpread){
                      ctx.lineTo(Math.min(relMaxX, Math.max(relMinX,dx+ offsetsLst[oCount])), dy);
                      oCount=(oCount+1)%(offsetsLst.length); //loop through offsets
                    }*/

          ctx.lineTo(x_min, y_max); //connect to bl

          // jagged: bl - br
          dy = y_max + extraBeachW;
          for (dx = x_min; dx < x_max; dx += oSpread) {
            ctx.lineTo(
              dx,
              Math.min(relMaxY, Math.max(relMinY, dy + offsetsLst[oCount]))
            );
            oCount = (oCount + 1) % offsetsLst.length; //loop through offsets
          }

          ctx.lineTo(x_max, y_max); //connect to br

          //X jagged: br- tr
          /*dx=x_max + extraBeachW;
                    for(dy=y_max; dy>y_min; dy-=oSpread){
                      ctx.lineTo(Math.min(relMaxX, Math.max(relMinX,dx+ offsetsLst[oCount])), dy); //clamp to keep drawing in-game
                      oCount=(oCount+1)%(offsetsLst.length); //loop through offsets
                    }*/
          ctx.lineTo(x_max, y_min); //to tr

          //X jagged: tr-tl
          /*dy=y_min - extraBeachW;
                    for(dx=x_max; dx>x_min; dx-=oSpread){
                      ctx.lineTo(dx , Math.min(relMaxY, Math.max(relMinY,dy+offsetsLst[oCount])));
                      oCount=(oCount+1)%(offsetsLst.length); //loop through offsets
                    }*/

          ctx.closePath(); //to tl

          ctx.fill();
        }

        {
          ctx.fillStyle = col_wat2;

          var x_min = -this.rectW / 2; //of box to draw jagged around
          var x_max = this.rectW / 2;
          var y_min = this.rectH / 2 - 3.0;
          var y_max = this.rectH / 2 + edgeW;

          //jagged vertically (top-bottom)
          ctx.beginPath();
          ctx.moveTo(x_min, y_min);
          var extraBeachW = 0.0;

          var offsetsLst = [
            -15, 5, 10, 0, -10, 3, 12, 4, 0, 3, 5, -10, 5, -12, 5, 10, 0, -6,
          ];
          var oSpread = 60; //dist between offset points
          var oCount = 0;

          //clamp vars to keep drawing in room!
          var relMaxX = gameW - this.x;
          var relMinX = 0 - this.x;
          var relMaxY = gameH - this.y;
          var relMinY = 0 - this.y;
          //jagged: top-left to bottom-left
          var dy;
          var dx = x_min - extraBeachW;
          /*for(dy=y_min; dy<y_max; dy+=oSpread){
                      ctx.lineTo(Math.min(relMaxX, Math.max(relMinX,dx+ offsetsLst[oCount])), dy);
                      oCount=(oCount+1)%(offsetsLst.length); //loop through offsets
                    }*/

          ctx.lineTo(x_min, y_max); //connect to bl

          // jagged: bl - br
          dy = y_max + extraBeachW;
          for (dx = x_min; dx < x_max; dx += oSpread) {
            ctx.lineTo(
              dx,
              Math.min(relMaxY, Math.max(relMinY, dy + offsetsLst[oCount]))
            );
            oCount = (oCount + 1) % offsetsLst.length; //loop through offsets
          }

          ctx.lineTo(x_max, y_max); //connect to br

          //X jagged: br- tr
          /*dx=x_max + extraBeachW;
                    for(dy=y_max; dy>y_min; dy-=oSpread){
                      ctx.lineTo(Math.min(relMaxX, Math.max(relMinX,dx+ offsetsLst[oCount])), dy); //clamp to keep drawing in-game
                      oCount=(oCount+1)%(offsetsLst.length); //loop through offsets
                    }*/
          ctx.lineTo(x_max, y_min); //to tr

          //X jagged: tr-tl
          /*dy=y_min - extraBeachW;
                    for(dx=x_max; dx>x_min; dx-=oSpread){
                      ctx.lineTo(dx , Math.min(relMaxY, Math.max(relMinY,dy+offsetsLst[oCount])));
                      oCount=(oCount+1)%(offsetsLst.length); //loop through offsets
                    }*/

          ctx.closePath(); //to tl

          ctx.fill();
        }
        //draw dark grid
        var minusForEdge = 20;

        var theImg = getLoadedImg(
          "img/riverCurrent" + this.riverSpecT + ".png"
        );

        if (theImg) {
          var imgX = -this.rectW / 2;
          var imgWid = 100;
          var riverFlowSpeed = 120.0; //same as server! (but 60* larger)
          for (i = 0; i < 40; i++) {
            var waveMoveTms =
              this.riverFlowSpeedX * (imgWid / riverFlowSpeed) * 1000; //ms to one full movement- t=dist * v
            var fac0to1 =
              ((timestamp - this.spawnTime) % waveMoveTms) / waveMoveTms;
            var dist = imgWid;
            var waveX = imgX + dist * fac0to1;

            ctx.drawImage(theImg, waveX, -this.rectH / 2, imgWid, this.rectH);
            imgX += imgWid;
          }
        }

        // fillGrid(-this.rectW / 2 + minusForEdge, -this.rectH / 2 + minusForEdge, this.rectW / 2 - minusForEdge, this.rectH / 2 - minusForEdge);
      }
      break;
    case o_biome_land:
      {
        ctx.fillStyle = col_gameBg;
        ctx.fillRect(-this.rectW / 2, -this.rectH / 2, this.rectW, this.rectH);

        //draw dark grid
        var minusForEdge = 45;
        fillGrid(
          -this.rectW / 2 + minusForEdge,
          -this.rectH / 2 + minusForEdge,
          this.rectW / 2 - minusForEdge,
          this.rectH / 2 - minusForEdge,
          this.x,
          this.y
        );
      }
      break;
    case o_rockHill:
      {
        //draw outline

        /*var theImg=getLoadedImg("img/rockhill.png");
                if(theImg){
                  //outline green
                  drawCircle(0,0,this.rad,col_outline_land);

                  var rad=this.rad - 2.5;
                  ctx.rotate(this.rPer * Math.PI * 2.0);
                  ctx.drawImage(theImg, -rad , -rad , 2 * rad, 2 * rad);
                    //console.log("drawing banana");
                }
                else*/
        //this.drawOutlinedCircle("", col_rockHill);

        var rockColor =
          this.curBiome == biome_desert ? col_rockHill_desert : col_rockHill;

        if (batchDrawOutline)
          //first draw outline circle (only)
          drawCircle(0, 0, this.rad, this.getOutlineColor());
        else drawCircle(0, 0, this.rad - 1.5, rockColor);
      }
      break;
    case o_lakeIsland:
      {
        ctx.fillStyle = col_ocean_sand;
        ctx.beginPath();
        ctx.arc(0, 0, Math.max(0, this.rad), 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#E4D04C";
        ctx.beginPath();
        ctx.arc(
          -5 + this.rPer * 10,
          -5 + this.rPer * 10,
          this.rad * 0.8,
          0,
          2 * Math.PI
        );
        ctx.fill();
      }
      break;
    case o_waterDrop:
      var rShift = 0;
      var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
      var frame = getAnimFrame(tSinceSpawn, 1, 5, 2);
      var frame2 = getAnimFrame(tSinceSpawn, 1, 0.2, 2);

      ctx.globalAlpha = 0.5;
      drawCircle(0, 0, this.rad, col_wat1);

      var extraRotate = -(-0.2 + frame) * toRadians(90.0); //spin animation
      ctx.save();
      ctx.scale(1, 1 + frame2);
      ctx.globalAlpha = 0.3;

      ctx.rotate(extraRotate);
      drawCircle(0, 0, this.rad - frame, "#2CAAC4");
      ctx.restore();

      ctx.save();
      ctx.scale(1 + frame2, 1);
      ctx.globalAlpha = 0.1;

      ctx.rotate(extraRotate);
      drawCircle(0, 0, this.rad * 0.9 - frame, "white");
      ctx.restore();

      break;
    case o_water:
      {
        var col = this.curBiome == biome_arctic ? "#8fa4e0" : col_wat1;

        this.drawOutlinedCircle("", col);

        //console.log("spectype "+this.specType);
        /*else {
                  var theImg = getLoadedImg("img/santa/gifts/" + this.specType + ".png");
                  if (theImg) {
                    ctx.save();
                    var rad = this.rad;
                    ctx.rotate(this.angle);
                    ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);
                    ctx.restore();
                    //console.log("drawing banana");
                  }
                }*/
      }
      break;

    case o_snowBall:
      {
        //DEBUG
        //this.drawOutlinedCircle("", "white");
        var theImg = getLoadedImg("img/snowball.png");
        if (theImg) {
          var rad = this.rad;
          ctx.rotate(this.rPer * Math.PI * 2.0);
          ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);
          //console.log("drawing banana");
        } else this.drawOutlinedCircle("", "white");
      }
      break;

    case o_spiderWeb:
      {
        //console.log("spiderweb draw: handled by subcalss now!");
      }
      break;

    case o_poisonBall:
      {
        //DEBUG

        ctx.save();
        //outlineCol
        drawCircle(
          0,
          0,
          this.rad,
          !this.isEdibleOutlined()
            ? outlineColForBiome(this.curBiome)
            : col_edibleOutline
        );
        drawCircle(0, 0, Math.max(0, this.rad - 2), col_wat1);

        ctx.restore();

        //on fire glow

        //POISON outline 'glow'

        ctx.save();

        //effect also flashes
        var period = 1.2; //periodic func with time
        var p_min = 0.3,
          p_max = 0.7;
        var amp = 0.5 * (p_max - p_min);
        ctx.globalAlpha *=
          p_min +
          amp +
          amp *
          Math.sin(
            ((2.0 * Math.PI) / period) *
            ((timestamp - this.spawnTime) / 1000.0)
          );

        ctx.globalAlpha *= this.effA_poison;
        var effectRad = 2.6;
        drawCircle(0, 0, this.rad + effectRad, "#7FF600");

        ctx.restore();
      }
      break;
    case o_infectionDrop:
      {
        //DEBUG

        ctx.save();
        //outlineCol
        drawCircle(
          0,
          0,
          this.rad,
          !this.isEdibleOutlined()
            ? outlineColForBiome(this.curBiome)
            : col_edibleOutline
        );
        drawCircle(0, 0, Math.max(0, this.rad - 2), "#f87b05");

        ctx.restore();

        //on fire glow

        //POISON outline 'glow'

        ctx.save();

        //effect also flashes
        var period = 1.2; //periodic func with time
        var p_min = 0.3,
          p_max = 0.7;
        var amp = 0.5 * (p_max - p_min);
        ctx.globalAlpha *=
          p_min +
          amp +
          amp *
          Math.sin(
            ((2.0 * Math.PI) / period) *
            ((timestamp - this.spawnTime) / 1000.0)
          );

        ctx.globalAlpha *= this.effA_poison;
        var effectRad = 2.6;
        drawCircle(0, 0, this.rad + effectRad, "#f00");

        ctx.restore();
      }
      break;
    case o_fireTornado:
      {
        ctx.save();

        var tornado = getLoadedImg("img/firetornado.png");
        if (tornado) {
          var rad = this.rad;

          var rps = 60 / 60;
          var rotationTms = 1000 / rps; //ms to one full movement- t=dist * v
          var fac0to1 =
            ((timestamp - this.spawnTime) % rotationTms) / rotationTms;
          var rotation1 = fac0to1 * 2 * Math.PI;

          var rps = 30 / 60;
          var rotationTms = 1000 / rps; //ms to one full movement- t=dist * v
          var fac0to1 =
            ((timestamp - this.spawnTime) % rotationTms) / rotationTms;
          var rotation2 = fac0to1 * 2 * Math.PI;

          ctx.save();
          ctx.rotate(rotation1);
          //ctx.drawImage(tornado, -rad, -rad, 2 * rad, 2 * rad);

          var oldA = ctx.globalAlpha;
          ctx.globalAlpha = 1 * oldA;
          //var rad = Math.max(0, this.rad - 30);

          var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
          var period = 2.2;
          var xShift = 6.5 * Math.cos(((2.0 * Math.PI) / period) * tSinceSpawn);
          var yShift = 6.5 * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

          ctx.globalAlpha = 1;
          ctx.drawImage(tornado, -rad - xShift / 2.2, -rad, 2 * rad, 2 * rad);
          ctx.restore();

          ctx.save();
          ctx.rotate(rotation2);
          ctx.drawImage(tornado, -rad - xShift / 2.2, -rad, 2 * rad, 2 * rad);
          ctx.restore();
        }

        ctx.restore();
      }
      break;
    case o_fireBall:
      {
        //DEBUG

        //on fire glow

        //glow stronger/weaker like a fire
        var period = 1.0; //periodic func with time
        var p_min = 0.15,
          p_max = 0.8; //set these!
        var amp = 0.5 * (p_max - p_min);
        var flashA =
          p_min +
          amp +
          amp * Math.sin(((2.0 * Math.PI) / period) * (timestamp / 1000.0));

        ctx.save();
        ctx.globalAlpha *= flashA;
        drawCircle(0, 0, Math.max(0, this.rad), "#F6EA65");
        ctx.restore();

        //glow stronger/weaker like a fire
        var period = 1.0; //periodic func with time
        var p_min = 0.85,
          p_max = 1.0; //set these!
        var amp = 0.5 * (p_max - p_min);
        var moveA =
          p_min +
          amp +
          amp * Math.sin(((2.0 * Math.PI) / period) * (timestamp / 1000.0));

        var imNum = Math.trunc(timestamp / 300) % 2;
        var theImg = getLoadedImg(
          imNum == 1 ? "img/fire.png" : "img/fire2.png"
        );
        if (theImg) {
          var imX = 0,
            imY = this.rad * 0.3;
          var imW = (this.rad * 2.0 * (2.0 + moveA * 2.0)) / 3.0,
            imH = this.rad * 2.0 * moveA;
          var imAnchorX = 0.5,
            imAnchorY = 0.95; //top-left= 0,0, bottom-right=1,1 (canvas coords)

          ctx.save();
          if (theImg) {
            ctx.globalAlpha *= this.onFireEffA * moveA;
            ctx.drawImage(
              theImg,
              imX + imW * -imAnchorX,
              imY + imH * -imAnchorY,
              imW,
              imH
            );
          }

          ctx.restore();
        }
      }
      break;
    case o_animal:
      {
        //this.drawAnimal(f);
        //console.log("SHOULD BE HANDLED BY ANIMAL thisClass METHOD! Type? " + this.constructor.name);
        //this.drawPlayerText(f);
      }
      break;

    default:
      {
        //console.log("Unhandled obj " + this);
        //console.log("rect? " + this.isRectangle + " pos " + this.x + "," + this.y);
        //unknown type
        if (this.isRectangle) {
          ctx.fillStyle = "black"; // col_wat2;
          ctx.fillRect(
            -this.rectW / 2,
            -this.rectH / 2,
            this.rectW,
            this.rectH
          );
        } else this.drawOutlinedCircle("????", "black");
      }
      break;
  } //end of .oType switch()
};

//main draw method (NOT subclassable)

GameObj.prototype.draw = function (batchDrawOutline) {
  //console.log("drawing obj "+this.id);

  //");
  //apply interpolation (before translate)
  this.moveUpdF = this.moveUpdate();

  ctx.save();
  ctx.translate(this.x, this.y);

  //zoom in/out effect
  if (this.doesDrawEffectScale && !options_lowGraphics) {
    var rShift = 0;
    var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
    var period = 1.5; // (this.oType == o_mushroom || this.oType == o_bigMushroom || this.oType == o_lillypad) ? 2.0 : 1.3; //slower warping
    var shiftAm = 0.1;
    if (this.drawEffectScale_Slow) {
      period = 2.5;
      shiftAm = 0.04;
    }
    rShift = shiftAm * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

    ctx.scale(1.0 + rShift, 1.0 + rShift / 2);
  }

  var outlineCol = this.getOutlineColor();
  var strokeW = 2; //default

  //fade on death
  if (this.dead) ctx.globalAlpha *= 1 - this.moveUpdF;
  //fade in on spawn
  else {
    //if (oType != o_biome_ocean) {
    ctx.globalAlpha *= Math.min(
      1.0,
      (timestamp - this.spawnTime) / (lerpI * 1000.0)
    );
    //console.log("a * "+Math.min(1.0, (timestamp-this.spawnTime)/(lerpI*1000.0)));
  }

  //draw method without applying extra scaling

  this.customDraw(batchDrawOutline);

  //hurt red glow
  if (this.flag_hurt) {
    ctx.fillStyle = "rgba(255,0,0,0.3)";
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(0, this.rad - strokeW), 0, Math.PI * 2);
    ctx.fill();
  }

  //draw HP bar
  this.drawHealthBar();

  ctx.restore(); //restore from fade
};

GameObj.prototype.drawHealthBar = function () {
  ctx.save();
  //ease vars
  var hpBarA_n = timestamp < this.hpBarTimeoutT ? 1.0 : 0.0;
  this.hpBarA += (hpBarA_n - this.hpBarA) * 0.04;

  if (this.hpBarA > 0.001) {
    this.hpPer += (this.hpPer_n - this.hpPer) * 0.1;

    //draw bar
    var eyeS = Math.max(1.0, this.rad / 25.0);
    var barW = 20.0 * eyeS,
      barH = 5 * eyeS;
    var bx = 0,
      by = -this.rad - 10 * eyeS;
    ctx.globalAlpha *= this.hpBarA; //bar bg
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(bx - barW / 2, by - barH / 2, barW, barH);

    //ctx.globalAlpha = this.hpBarA * f;
    ctx.fillStyle = "#16D729"; //bar fill
    ctx.fillRect(
      bx - barW / 2,
      by - barH / 2,
      barW * (this.hpPer / 100.0),
      barH
    );
  }
  ctx.restore(); //restore from fade

  if (this.id == myPlayerID) this.drawInfectionBar();
};

GameObj.prototype.drawInfectionBar = function () {
  var infectionBarA_n = timestamp < this.infectionBarTimeoutT ? 1.0 : 0.0;
  this.infectionBarA += (infectionBarA_n - this.infectionBarA) * 0.04;
  if (this.infectionBarA > 0.001) {
    this.infectionPer += (this.infectionPer_n - this.infectionPer) * 0.1;

    this.drawBar("red", this.infectionBarA, this.infectionPer, 10);
  }
};

GameObj.prototype.drawBar = function (color, hpBarA, hpPer, yPoz) {
  ctx.save();

  //draw bar
  var eyeS = Math.max(1.0, this.rad / 25.0);
  var barW = 20.0 * eyeS,
    barH = 2.5 * eyeS;
  var bx = 0,
    by = -this.rad - yPoz * eyeS;
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillRect(bx - barW / 2, by - barH / 2, barW, barH);

  //ctx.globalAlpha = this.hpBarA * f;
  ctx.globalAlpha = 0.7;
  ctx.fillStyle = color; //bar fill
  ctx.fillRect(bx - barW / 2, by - barH / 2, barW * (hpPer / 100.0), barH);
  ctx.restore(); //restore from fade
};
GameObj.prototype.drawChat = function () {
  if (this.chatLines.length < 1) return;

  ctx.save();
  //set text settings
  ctx.font = "10px Arial";
  ctx.lineWidth = 1;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle"; //vertical center

  var baseY = this.hpBarA > 0.01 ? -10.0 : 0.0; //raise chat when hp bar is open
  var toDelete = [];
  for (var i = this.chatLines.length - 1; i >= 0; i--) {
    var aLine = this.chatLines[i];
    var textY = (this.chatLines.length - 1 - i) * -13.0 + baseY; //draw earlies text at bottom

    //time-out text
    var idealA = timestamp > aLine.chatFadeT ? 0.0 : 1.0;
    aLine.chatA += (idealA - aLine.chatA) * 0.1;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    if (aLine.chatA < 0.02) {
      if (idealA < 0.02) aLine.chatTxt = ""; //timed out text
      toDelete.push(i); //push index
      continue;
    }
    //green chat bg
    var text_w = ctx.measureText(aLine.chatTxt).width;
    var text_h = 10.0; //same as font height
    var padx = 1,
      pady = 1;
    ctx.globalAlpha = 0.8 * aLine.chatA;
    ctx.fillStyle = outlineColForBiome(this.curBiome); //"white";

    ctx.fillRect(
      this.x - padx - text_w / 2,
      textY + this.y - this.rad - 10 - text_h / 2 - pady,
      text_w + padx * 2,
      text_h + pady * 2
    );

    ctx.fillStyle = "#F1C34C";
    if (!options_lowGraphics) {
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.shadowColor = "black";
    }
    ctx.globalAlpha = aLine.chatA;
    ctx.fillText(aLine.chatTxt, this.x, textY + this.y - this.rad - 10);
  }

  //remove timed-out text
  for (var i = 0; i < toDelete.length; i++) {
    this.chatLines.splice(toDelete[i], 1);
  }
  ctx.restore();
};

GameObj.prototype.getOutlineColor = function () {
  if (this.alwaysPlainOutline) {
    //used for interfaces
    return col_outline_land;
  }
  if (this.isEdibleOutlined()) {
    return col_edibleOutline;
  }
  //red outline for dangerous animals
  if (
    this.oType == o_animal &&
    dangerAniTypes[this.animalType - 1] > 0 &&
    this.id != myPlayerID
  ) {
    return col_dangerOutline;
  }
  //plain outline (based on biome)
  var biome = this.curBiome;

  if (this.flag_inWater) biome = biome_ocean;
  else if (this.flag_inLava) return "#c64a00";

  return outlineColForBiome(biome);
};

GameObj.prototype.isEdibleOutlined = function () {
  if (this.oType == o_animal)
    return edibAniTypes[this.animalType - 1] > 0 && this.id != myPlayerID;
  else return edibleObjTypes[this.oType - 1] > 0;
};
GameObj.prototype.gotChat = function (chatTxt) {
  if (this.chatLines) {
    this.chatLines.push({
      chatTxt: chatTxt,
      chatFadeT: timestamp + 4000,
      chatA: 0.0,
    });
    if (this.chatLines.length > 5)
      this.chatLines.splice(this.chatLines.length - 1, 1); //remove last chat item
  }
};

GameObj.prototype.drawOutlinedCircle = function (nm, col) {
  var outlineCol = this.getOutlineColor();

  //green outline (without stroke- optimized)
  var strokeW = 1.5;
  if (!(options_lowGraphics && outlineCol == col_outline_land))
    //dont draw plain outlines!
    drawCircle(0, 0, this.rad, outlineCol);
  drawCircle(0, 0, Math.max(0, this.rad - strokeW), col);
};

//moves the obj,  interpolating between udpates
GameObj.prototype.moveUpdate = function () {
  var a = (timestamp - this.updateTime) / 1000 / lerpI;
  a = 0 > a ? 0 : 1.0 < a ? 1.0 : a; //clamp from 0-1
  /*if (a > 1.0) { //lag smoothing?{
        a = Math.pow(a, 0.25);
    }*/

  if (this.dead && a >= 1) {
    //dead, done anim
    remGameObjs.push(this); //delete after draw loop
  }

  //  console.log("a=" + a);
  this.x = a * (this.nx - this.ox) + this.ox;
  this.y = a * (this.ny - this.oy) + this.oy;

  //if(this.oType==o_abilityGObj)
  //console.log("(dead? "+this.dead+") a= "+a+"x="+this.x+" nx "+this.nx+" ox "+this.ox);

  this.rad += (this.nRad - this.rad) * 0.1; //a * (this.nRad - this.oRad) + this.oRad;;
  if (this.angle != undefined) {
    if (!disableInterpolate) {
      let diff = this.tangle - this.angle;
      while (diff < -Math.PI) diff += 2 * Math.PI;
      while (diff > Math.PI) diff -= 2 * Math.PI;
      this.angle += diff * angleLerpRate;
      while (this.angle > Math.PI) this.angle -= 2 * Math.PI;
      while (this.angle < -Math.PI) this.angle += 2 * Math.PI;
    } else {
      this.angle = this.tangle;
    }
  }
  return Math.min(1.0, a); //re-use move factor
};

//read data that is only written for a certain object type (oType) / oType class
GameObj.prototype.readCustomData_onUpdate = function (msg) {
  //console.log("Gameobj read update custom data id "+this.id);
};

//read data that is only written for a certain object type (oType) / oType class
//custom data for this class (must be matched by server-side write of this data!)
GameObj.prototype.readCustomData_onNewlyVisible = function (msg) {
  //special vars

  switch (this.oType) {
    case o_river:
    case o_poisonBerry:
    case o_meatLarge:
    case o_meatMedium:
    case o_meatSmall:
      this.specType = msg.readUInt8();
  }

  if (this.oType == o_river) {
    // river flow direction
    var riverSpecT = this.specType; // msg.readUInt8();
    this.riverSpecT = riverSpecT;
    this.riverFlowSpeedX = riverSpecT == 0 ? 1.0 : -1.0;
  }

  // if (this.oType == o_poisonBerry) {
  //   // which color this berry is?
  //   this.specType = msg.readUInt8();
  // }

  /*if (this.oType == o_spiderWeb) {
      //1 or 9, is the web transparent
      this.specType = msg.readUInt8();
    }*/
};

//overridden by Animal, makes code neat
GameObj.prototype.setObjTypes = function (oType, secondaryType) {
  this.oType = oType;
};

//setup from newly visible message
GameObj.prototype.worldUpd_readMsgNewlyVisible = function (
  msg,
  oType,
  secondaryType
) {
  //thisClasses eg. Aniaml have a seconary type 'animalType' that affects class
  this.setObjTypes(oType, secondaryType);
  //console.log(msg.data.getUint32(19, false))
  var nw_id = msg.readUInt32();
  var nw_rad = msg.readUInt32();
  var nw_x = msg.readUInt16() / 4.0;
  var nw_y = msg.readUInt16() / 4.0;

  this.id = nw_id;
  this.ox = this.x = this.nx = nw_x; //set initial vars here
  this.oy = this.y = this.ny = nw_y; //'new' vars will be set after create
  this.nRad = nw_rad;
  this.oRad = this.rad = 0; //default: objs animate in from 0 rad (on spawn)

  //these objs start at full rad (no anim)
  if (
    oType == o_biome_poison ||
    oType == o_biome_volcano ||
    oType == o_mudSpot ||
    oType == o_arcticIce ||
    oType == o_lake ||
    oType == o_abilityGObj ||
    oType == o_hill ||
    oType == o_rockHill ||
    oType == o_fruitTree ||
    oType == o_lakeIsland
  ) {
    this.animateRadOnSpawn = false;
  }

  if (!this.animateRadOnSpawn) this.oRad = this.rad = nw_rad;

  // cur biome of the obj (since we have more biomes so they dont fit in 0-3 bits)
  var f_curBiome = msg.readUInt8();
  //read flags
  /* var oFlags = msg.readBitGroup();
  var f_spawnedFromID = oFlags.getBool(); //bit_get(flags, 0) > 0;
  var f_rectObj = oFlags.getBool();
  var f_sendsAngle = oFlags.getBool();*/
  //var oFlags = msg.readBitGroup();
  var f_spawnedFromID = false; //msg.readUInt8() == 1;
  var f_rectObj = msg.readUInt8() == 1;
  var f_sendsAngle = msg.readUInt8() == 1;
  //var f_curBiome = oFlags.getInt0to3(); //2 * bit_get(flags, 3) + 1 * bit_get(flags, 2); //encoded 2-bit num

  this.curBiome = f_curBiome;
  this.objGetsAngleUpdate = f_sendsAngle;

  //show animation spawning from original obj
  var spawnFromObj = null;
  if (f_spawnedFromID) {
    spawnFromObj = gameObjsByID[msg.readUInt32()];
  }
  if (spawnFromObj) {
    this.updateTime = timestamp;
    this.nx = this.x;
    this.ny = this.y;
    this.ox = spawnFromObj.x;
    this.oy = spawnFromObj.y;
    this.x = spawnFromObj.x;
    this.y = spawnFromObj.y;
  }

  //rectangle objs (eg. biomes)
  if (f_rectObj) {
    this.isRectangle = true;
    this.rectW = msg.readUInt16();
    this.rectH = msg.readUInt16();
  }

  //this.objGetsAngleUpdate = msg.readUInt8() == 1;
  if (this.objGetsAngleUpdate) {
    // || this.oType == o_sleigh || this.oType == o_water) {

    var angleDeg = msg.readUInt16();
    //console.log("angle: " + angleDeg/3)  //heree
    var angleCorrection = this.oType == o_abilityGObj ? 180 : 90;
    this.tangle = toRadians(angleDeg + angleCorrection);
    //this.specType = msg.readUInt8();
  }

  //now, read custom data!

  this.readCustomData_onNewlyVisible(msg);
};

GameObj.prototype.worldUpd_readMsgUpdate = function (msg) {
  var px = msg.readUInt16() / 4.0;
  var py = msg.readUInt16() / 4.0;
  var rad = msg.readUInt32();
  this.specType = msg.readUInt8();
  /* //universal obj 'flags'
  var objFlags = msg.readBitGroup();
  var flag_sendHp = objFlags.getBool();
  var flag_flashHurt = objFlags.getBool();
*/

  //var objFlags = msg.readUInt8();
  var flag_sendHp = msg.readUInt8() == 1;
  var flag_flashHurt = msg.readUInt8() == 1;

  this.updateTime = timestamp; //only set timestamp for moving items
  this.ox = this.x;
  this.oy = this.y;
  this.nx = px;
  this.ny = py;
  this.oRad = this.rad;
  this.nRad = rad;

  this.flag_hurt = flag_flashHurt;
  if (flag_sendHp) {
    //update/show health bar
    var hpPer = msg.readUInt8();
    if (this.hpBarA < 0.001) {
      //bar appeared, instantly set to full hp amount
      this.hpPer = hpPer;
    }
    this.hpPer_n = hpPer;
    //this.hpBarA_n = 1.0;

    //if(this.oType!=o_animal){
    //non-animals get quickly-dissapearing hp bars
    this.hpBarTimeoutT = +new Date() + 3000.0;
    //}
  } else {
    this.hpBarTimeoutT = +new Date(); //hp bar timed out
  }

  if (this.objGetsAngleUpdate) {
    var angleDeg = msg.readUInt16();
    var angleCorrection = this.oType == o_abilityGObj ? 180 : 90;
    this.tangle = toRadians(angleDeg + angleCorrection);
    //console.log("angle1: " + angleDeg)
    // this.specType = msg.readUInt8();
  }

  //CUSTOM DATA!
  this.readCustomData_onUpdate(msg);

  this.firstPosUpd = false;
};

GameObj.prototype.worldUpd_readMsgRemovedObj = function (msg) {
  var killerId = msg.readUInt8() > 0 ? msg.readUInt32() : 0;
  var killerObj = killerId > 0 ? gameObjsByID[killerId] : undefined;

  this.dead = true;
  this.updateTime = timestamp; //count as update, kill on next upd

  if (this.oType == o_abilityGObj) {
    //no radius animation
    this.ox = this.x;
    this.oy = this.y;
    //this.oRad = this.rad;
    this.nx = this.x;
    this.ny = this.y;
  } else if (killerObj) {
    //kill with animation
    this.ox = this.x;
    this.oy = this.y;
    this.oRad = this.rad;
    this.nx = killerObj.nx; //move to future pos
    this.ny = killerObj.ny;
    this.nRad = Math.min(this.rad, killerObj.rad);

    //fade possible hp bar
    this.hp_n = 0;
  } else {
    //kill with animation
    this.ox = this.x;
    this.oy = this.y;
    this.oRad = this.rad;
    this.nx = this.x;
    this.ny = this.y;
    this.nRad = 0;
  }
};

//call on draw
GameObj.prototype.updateZ = function () {
  switch (this.oType) {
    case o_biome_land:
      this.z = -220;
      break;
    case o_biome_desert:
    case o_biome_arctic: //for water to pour on top
      this.z = -210;
      break;
    case o_biome_volcano:
    case o_biome_poison:
      this.z = -209;
      break;
    case o_beach:
      this.z = -202;
      break;
    case o_biome_ocean_extraWater:
      this.z = -201;
      break;

    case o_river:
    case o_lake:
    case o_lavaLake:
    case o_bog:
      this.z = -159;
      break;
    case o_biome_ocean:
    case o_mudSpot:
      this.z = -158;
      break;

    //on top of volcano biome, under everything else
    case o_volcano:
      this.z = -158;
      break;
    case o_arcticIce:
      this.z = -156;
      break;
    case o_waterSpot:
      this.z = -155;
      break;
    case o_lakeIsland:
      this.z = -154;
      break;

    case o_abilityGObj:
      if (
        this.type == ability_eagleAttack ||
        this.type == ability_falconAttack ||
        this.type == ability_owlAttack ||
        this.type == ability_targetCircle ||
        this.type == ability_bearSlash
      ) {
        this.z = 100002;
        break;
      }

      //if(this.type==ability_krakenSpec || this.type==ability_stingRayShock || this.type==ability_squidInk)
      if (
        this.type == ability_iceSlide ||
        this.type == ability_clawSlash ||
        this.type == ability_backLegKick ||
        this.type == ability_whaleTailHit ||
        this.type == ability_elephantTrunkSmack ||
        this.type == ability_crabSmash ||
        this.type == ability_crocWaterGrab ||
        this.type == ability_boaSuffocate ||
        this.type == ability_sabertoothJawAttack ||
        this.type == ability_trexShake ||
        this.type == ability_tigerSlash ||
        this.type == ability_pounce ||
        //this.type == ability_tigerJump ||
        this.type == ability_giraffeStomp ||
        this.type == ability_zebraKick ||
        this.type == ability_sharkBite ||
        this.type == ability_fart
      )
        this.z = 10001;
      //above all
      else if (this.type == ability_orcaWave) this.z = 1002;
      //above lake island, above hills
      else if (this.type == ability_waterSplash) this.z = 10001;
      //above lake island, above hills
      else if (this.type == ability_pelican) {
        if (this.specType == 1) this.z = 10001;
        //above lake island, above hills
        else if (this.specType == 2)
          // beak with animal
          this.z = 1013; // below animal grabbed
      } else this.z = -152; //below everything, but above ground stuff
      break;
    case o_hidingHoleOcean:
      this.z = -150;
      break;

    case o_bigHidingHole:
      this.z = -101;
      break;
    case o_hidingHole:
      this.z = -100;
      break;
    case o_healingStone:
      this.z = -99;
      break;

    case o_hill:
      this.z = 999;
      break;
    case o_quill:
    case o_fruitTree:
      this.z = 1000; //above hill
      break;
    case o_honeyComb:
      this.z = 1002; //above all hills, just below drag
      break;
    case o_beeHive:
    case o_rockHill:
      this.z = 1002; //above all hills, just below drag
      break;
    case o_spiderWeb:
      this.z = 1003;
      break;

    case o_berryBush: //above hill, and above tree-climbers
    case o_planktonBush:
      this.z = 1002 + this.rad;
      break;

    case o_hidingBush: //bushes hide everything
      this.z = 10000;
      break;

    case o_waterDrop:
      this.z = 1015; // splashes on top of all objects
      break;

    case o_coconut:
    case o_banana: //fruit shows up on top
      this.z = 1006;
      break;
    case o_fireTornado:
      this.z = 1020; // above black dragon
      break;

    case o_fireBall:
    case o_poisonBall:
      this.z = 1006; //fireball just under dragon
      break;

    case o_animal:
      if (this.flag_flying) {
        this.z = 100000;

        if (!this.flag_isGrabbed) this.z += this.rad;
        if (this.specType2 == 100) {
          // grabed by pelican
          this.z = 1014; // below water splash
        }
      } else {
        // if not flying then

        // if under water

        if (
          this.flag_underWater ||
          (this.flag_usingAbility && this.animalType == a_mole)
        ) {
          this.z = -100; //above lake and lake island
        } else {
          // not in under water!

          if (
            this.flag_usingAbility &&
            (this.animalType == a_eagle || this.animalType == a_pelican)
          )
            this.z = 10001 + this.rad;
          //flies even above blackdragon
          else if (
            this.flag_canClimbHill ||
            this.animalType == a_bear ||
            this.animalType == a_rhino ||
            this.animalType == a_gorilla ||
            this.animalType == a_polarBear ||
            this.animalType == a_crab ||
            this.animalType == a_turtle ||
            this.animalType == a_seal ||
            this.animalType == a_walrus ||
            this.animalType == a_yeti ||
            this.animalType == a_sabertoothTiger ||
            this.animalType == a_boaConstrictor ||
            this.animalType == a_giantSpider
          )
            this.z = 1000 + this.rad;
          else if (this.animalType == a_blackDragon) this.z = 1009 + this.rad;
          //flies above hill, water/food also
          else if (this.animalType == a_trex)
            this.z = 1008 + (this.flag_usingAbility ? 1 : 0) + this.rad;
          else if (this.animalType == a_dragn) this.z = 1007;
          //flies above hill, water/food also
          else this.z = this.rad;
        }
      }

      break;
    default:
      this.z = this.rad;

      break;
  }
};

function GameObj(oType) {
  this.oType = oType;

  //spawn vars
  this.rPer = getRandomDouble(0, 1.0);
  this.spawnTime = timestamp;
  this.updateTime = timestamp;
  this.firstPosUpd = true; //for things like setting animal angle instantly

  //init certain vars in here, they arent shared
  this.chatLines = []; //certain objs can show chat (eg. hiding holes)

  //set general drawing vars (example)
  switch (this.oType) {
    case o_berry:
    case o_banana:

    case o_raspberry:
    case o_pear:
    case o_coconut:

    case o_water:
    case o_fireBall:
    case o_poisonBall:
    case o_spiderWeb:

    case o_mushroom:
    case o_bigMushroom:
    case o_lillypad:
    case o_hidingHole:
    case o_hidingHoleOcean:
    case o_bigHidingHole:

    //ocean food
    case o_plankton:
    case o_seaweed:
    case o_starfish:
    case o_kelp:
    case o_clam:
    case o_conchShell:
    case o_cloudBerry:
    case o_arcticNut:
    case o_carrot:
    case o_poisonBerry:
    case o_watermelon:
    case o_watermelonSlice:
    case o_meatSmall:
    case o_meatMedium:
    case o_meatLarge:
    case o_egg:
    case o_ostrichEgg:
    case o_quill:
    case o_beeHive:
    case o_honeyComb:
      this.doesDrawEffectScale = true;
      break;
    default:
      break;
  }

  if (
    this.oType == o_hidingHole ||
    this.oType == o_bigHidingHole ||
    this.oType == o_hidingHoleOcean ||
    this.oType == o_spiderWeb
  )
    this.drawEffectScale_Slow = true;
}

window.GameObj = GameObj;

//console.log("GameObj method: "+GameObj.factory_NewlyVisibleObjMessage);

//module.exports= GameObj; //sets the 'return' type if this module 'kinda like a class'

///////
// file: js_src/gameobj/GameObjBatchDraw.js
///////

//class for batch-drawing a list of GameObjs with the same z, implements gameObj-style  draw, z

//SUBCLASS! inherit prototype/properties from superclass
var subClass = GameObjBatchDraw;
var superClass = GameObj;
subClass.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
subClass.prototype.constructor = subClass;

function GameObjBatchDraw() {
  this.objs = [];

  this.updateZ = function () {
    //assumes all objs (of this type) will have same Z
    if (this.objs.length > 0) {
      this.objs[0].updateZ(); //force extra update (to be sure)
      this.z = this.objs[0].z;
    }
  };
  this.draw = function () {
    //console.log("drawing t "+this.oType+"batched os ("+this.objs.length+" objs) z="+this.z);
    //draw outline
    for (var i = 0; i < this.objs.length; i++) {
      var anObj = this.objs[i];
      anObj.draw(true);
      //console.log("->drawing batched o: "+anObj);
    }

    //draw rest of obj
    for (var i = 0; i < this.objs.length; i++) {
      var anObj = this.objs[i];
      anObj.draw(false);
    }
  };
  this.addBatchedObj = function (newObj) {
    if (this.objs.length == 0) {
      //this.z=newObj.z; //z may not be updated
      this.oType = newObj.oType;
      this.objs = [];
    }
    this.objs.push(newObj);
  };
}

//make this class globally acessible
window.GameObjBatchDraw = GameObjBatchDraw;

///////
// file: js_src/gameobj/animal/AnimalType.js
///////

var a_mouse = 1,
  a_rabbit = 2,
  a_pig = 3,
  a_fox = 4,
  a_deer = 5,
  a_mole = 6,
  a_zebra = 7,
  a_lion = 8,
  a_bigCat = 9,
  a_bear = 10,
  a_croc = 11,
  a_rhino = 12,
  a_hippo = 13,
  a_dragn = 14,
  a_shrimp = 15,
  a_trout = 16,
  a_crab = 17,
  a_squid = 18,
  a_shark = 19,
  a_stingray = 20,
  a_turtle = 21,
  a_seaHorse = 22,
  a_jellyFish = 23,
  a_kraken = 24,
  a_pufferFish = 25,
  a_killerWhale = 26,
  a_swordfish = 27,
  a_gorilla = 28,
  a_octopus = 29,
  a_wolf = 30,
  a_arcticHare = 31,
  a_yeti = 32,
  a_chipmunk = 33,
  a_muskox = 34,
  a_penguin = 35,
  a_polarBear = 36,
  a_seal = 37,
  a_snowLeopard = 38,
  a_walrus = 39,
  a_reindeer = 40,
  a_arcticFox = 41,
  a_wolverine = 42,
  a_mammoth = 43,
  a_donkey = 44,
  a_snail = 45,
  a_blackDragon = 46,
  a_sabertoothTiger = 47,
  a_elephant = 48,
  a_blueWhale = 49,
  a_cobra = 50,
  a_boaConstrictor = 51,
  a_giantSpider = 52,
  a_trex = 53,
  a_tiger = 54,
  a_giraffe = 55,
  a_eagle = 56,
  a_hedgehog = 57,
  a_duck = 58,
  a_duckling = 59,
  a_lemming = 60,
  a_kingCrab = 61,
  a_frog = 62,
  a_ostrich = 63,
  a_pelican = 64,
  a_falcon = 65,
  a_snowyOwl = 66,
  a_honeyBee = 67,
  a_phoenix = 68,
  a_ostrichBaby = 69,
  a_seaMonster = 70,
  a_landMonster = 71,
  a_iceMonster = 72,
  a_dinoMonster = 73,
  a_pigeon = 74,
  a_toucan = 75;

var infoForAnimalType = function (aniT) {
  var infoO = {};
  switch (aniT) {
    case a_snail:
      infoO.aniName = "Snail";
      infoO.aniDesc = "";
      infoO.upgradeText = "You're a super slow snail!";

      infoO.aniCol = "#fcc02b";
      infoO.skinName = "snail";
      break;
    case a_mouse:
      infoO.aniName = "Mouse";
      infoO.aniDesc = "";
      infoO.upgradeText = "";

      infoO.aniCol = "#9BA9B9";
      infoO.skinName = "mouse";
      break;
    case a_rabbit:
      infoO.aniName = "Rabbit";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to RABBIT! \nPress W to burrow a hole to hide in!";
      infoO.aniCol = "#AA937E";
      infoO.skinName = "rabbit";
      break;
    case a_pig:
      infoO.aniName = "Pig";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to PIG!\n Pigs move FAST through MUD! (Can use 'stink' on mud/ hiding holes!)";
      infoO.aniCol = "#DD6BD4";
      infoO.skinName = "pig";
      break;
    case a_fox:
      infoO.aniName = "Fox";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to FOX! ,\n You can kick players out of hiding holes! (Press W when in one!)\n+ Hide in red berry bushes!";
      infoO.aniCol = "#FF9D43";
      infoO.skinName = "fox";
      break;
    case a_deer:
      infoO.aniName = "Deer";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to DEER! \nPress W to dig up food! \nDig in mud for better food!\n Hint:Check water areas for new food sources!";
      infoO.aniCol = "#C4773E";
      infoO.skinName = "deer";
      break;
    case a_mole:
      infoO.aniName = "Mole";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to MOLE!\n Hold W to dig underground!\nGo under anything, do surprise attacks!";
      infoO.aniCol = "#4C4A45";
      infoO.skinName = "mole";
      break;
    case a_zebra:
      infoO.aniName = "Zebra";
      infoO.aniDesc = "";
      infoO.upgradeText = "UPGRADED to ZEBRA! \nPress W to kick side ways!";
      infoO.aniCol = "#FFFFFF";
      infoO.skinName = "zebra";
      break;
    case a_lion:
      infoO.aniName = "Lion";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to LION!\n Press W to release a mighty ROAR (Rawr!)!";
      infoO.aniCol = "#f8c923";
      infoO.skinName = "lion";
      break;

    case a_bigCat:
      infoO.aniName = "CHEETAH";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to CHEETAH!\n Press W to get a speed boost! (Every 8 seconds)!";
      infoO.aniCol = "#CAC05B";
      infoO.skinName = "bigcat/cheetah";
      break;
    case a_bear:
      infoO.aniName = "Bear";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to BEAR!\n Bears climb through green hills! (Press W to use your claw!)";
      infoO.aniCol = "#99591C";
      infoO.skinName = "bear";
      break;
    case a_croc:
      infoO.aniName = "Croc";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to CROCODILE!\n Press W to bite and drag around animals! \n+ (Now hide in water spots)+ Swim well in Mud, Lakes & Oceans!";
      infoO.aniCol = "#30F51C";
      infoO.skinName = "croc";
      break;
    case a_hippo:
      infoO.aniName = "Hippo";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to HIPPO!\nHippos are great swimmers, dominate the Lakes/Oceans/Mud!";
      infoO.aniCol = "#945A99";
      infoO.skinName = "hippo";
      break;
    case a_rhino:
      infoO.aniName = "Rhino";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to RHINO!\n Press W to CHARGE with your mighty horn!";
      infoO.aniCol = "#94a3a9";
      infoO.skinName = "rhino";
      break;
    case a_shrimp:
      infoO.aniName = "Shrimp";
      infoO.aniDesc = "";
      infoO.upgradeText = "";
      infoO.aniCol = "#f88e37";
      infoO.skinName = "shrimp";
      break;
    case a_trout:
      infoO.aniName = "Trout";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to TROUT!\nHint: Hold Left-click to RUN! (Uses extra water)";
      infoO.aniCol = "#ac8686";
      infoO.skinName = "trout";
      break;
    case a_crab:
      infoO.aniName = "Crab";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to CRAB!\n Crabs can survive on dry land!\n (On land, Press W to go into your shell!)";
      infoO.aniCol = "#bf2408";
      infoO.skinName = "crab";
      break;
    case a_squid:
      infoO.aniName = "Squid";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to SQUID!\n Squids can use INK when injured (press W!) \n+ you can hide in plankton bushes!";
      infoO.aniCol = "#40dda4";
      infoO.skinName = "squid";
      break;
    case a_shark:
      infoO.aniName = "Shark";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to SHARK!\n A vicious predator of the oceans!";
      infoO.aniCol = "#999fc6";
      infoO.skinName = "shark";
      break;
    case a_seaHorse:
      infoO.aniName = "Sea-horse";
      infoO.aniDesc = "";
      infoO.upgradeText = "UPGRADED to SEA HORSE!\n An agile hunter!";
      infoO.aniCol = "#73BE2F";
      infoO.skinName = "seahorse";
      break;
    case a_jellyFish:
      infoO.aniName = "Jellyfish";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to JELLYFISH!\n A slowly-turning animal that can grow quite large!";
      infoO.aniCol = "#FDB9BA";
      infoO.skinName = "jellyfish";
      break;
    case a_turtle:
      infoO.aniName = "Turtle";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to TURTLE!\n Lives well on land & water! (On land, Press W to go into your shell!)";
      infoO.aniCol = "#502E1A";
      infoO.skinName = "turtle";
      break;
    case a_stingray:
      infoO.aniName = "Stringray";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to STINGRAY!\n Use electic shock (Release W key!) to shock animals! \n(Takes time to recharge)";
      infoO.aniCol = "#164336";
      infoO.skinName = "stingray";
      break;
    case a_kraken:
      infoO.aniName = "The Kraken";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to THE KRAKEN!\n Terrorize the oceans, and be feared by all!\n (Release W to use whirlpool ability!)";
      infoO.aniCol = "#64a034";
      infoO.skinName = "kraken";
      break;
    case a_pufferFish:
      infoO.aniName = "Pufferfish";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to PUFFERFISH!\n (Hold W to inflate- become spiky, and dangerous to touch!)";
      infoO.aniCol = "#6C5C2C";
      infoO.skinName = "pufferfish";
      break;
    case a_killerWhale:
      infoO.aniName = "Killer Whale";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to Killer Whale! \nWhales blow out water when diving! (And sometimes other loot!)";
      infoO.aniCol = "#141414";
      infoO.skinName = "killerwhale";
      break;
    case a_swordfish:
      infoO.aniName = "Swordfish";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n (Press W to rush with your sharp nose!)";
      infoO.aniCol = "#689CD7";
      infoO.skinName = "swordfish";
      break;
    case a_gorilla:
      infoO.aniName = "Gorilla";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Gorillas are very fast on hills/trees!\n Press W to throw bananas! (from trees)";
      infoO.aniCol = "#323232";
      infoO.skinName = "gorilla";
      break;
    case a_octopus:
      infoO.aniName = "Octopus";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to Octopus!\nHold W to use your 'Disguise' ability!\n(Hint: wait for prey to bite you- they get stunned!)";
      infoO.aniCol = "#ff8340";
      infoO.skinName = "octopus";
      break;
    case a_dragn:
      infoO.aniName = "Dragon";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n (You're amazing!) \nFly over everything, Hold W to shoot fire!";
      infoO.aniCol = "#22FF8A";
      infoO.skinName = "dragon";
      break;
    case a_blackDragon:
      infoO.aniName = "Black Dragon";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Black dragons drink lava instead of water! Black dragons only heal on healing stones/lava!";
      infoO.aniCol = "black";
      infoO.skinName = "blackdragon";
      break;

    case a_giantSpider:
      infoO.aniName = "Giant Spider";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Place web around the game to catch prey!";
      infoO.aniCol = "black";
      infoO.skinName = "giantSpider";
      break;

    case a_cobra:
      infoO.aniName = "Cobra";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Hold W to Spit venom, and poison animals with your bite!";
      infoO.aniCol = "black";
      infoO.skinName = "cobra";
      break;

    case a_boaConstrictor:
      infoO.aniName = "Boa Constrictor";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Coil and suffocate other animals!";
      infoO.aniCol = "black";
      infoO.skinName = "boaConstrictor";
      break;

    case a_trex:
      infoO.aniName = "T-REX";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        " The Dinosaur!\n This ancient dinosaur has powerful jaws that can drag prey around!!";
      infoO.aniCol = "#862A2A";
      infoO.skinName = "trex";
      break;
    case a_tiger:
      infoO.aniName = "Tiger";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to Tiger!\n Tigers can launch an ambush attack (HOLD W to grow a bush) Release to attack!";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "tiger";
      break;

    case a_giraffe:
      infoO.aniName = "Giraffe";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to Giraffe!\nGiraffe have huge legs and stomp anyone in their way!";
      infoO.aniCol = "#E9BD23";
      infoO.skinName = "giraffe";
      break;

    case a_eagle:
      infoO.aniName = "Eagle";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to Eagle!\nEagles can fly up other animals in the air! !\n";
      infoO.aniCol = "#5b400d";
      infoO.skinName = "eagle";
      break;

    case a_arcticFox:
      infoO.aniName = "Arctic Fox";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n You can kick players out of hiding holes! (Press W when in one!)\n+ Hide in red berry bushes!";
      infoO.aniCol = "#CFCFCF";
      infoO.skinName = "arctic/arcticfox";
      break;
    case a_arcticHare:
      infoO.aniName = "Arctic Hare";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n \nPress W to burrow a hole to hide in!";
      infoO.aniCol = "#D5D5D5";
      infoO.skinName = "arctic/arctichare";
      break;
    case a_yeti:
      infoO.aniName = "The Yeti!";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n So it really exists... \n Hold W to turn into snow, release W to freeeeeze!";
      infoO.aniCol = "#839eb5";
      infoO.skinName = "arctic/yeti";
      break;
    case a_chipmunk:
      infoO.aniName = "Chipmunk";
      infoO.aniDesc = "";
      infoO.upgradeText = ""; //A little "+infoO.aniName+"...";
      infoO.aniCol = "#A77C30";
      infoO.skinName = "arctic/chipmunk";
      break;

    case a_muskox:
      infoO.aniName = "Muskox";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Press W to charge with your horns! \nPlus move decently on ice!";
      infoO.aniCol = "#231f18";
      infoO.skinName = "arctic/muskox";
      break;
    case a_penguin:
      infoO.aniName = "Penguin";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Left-click to run!\n (HOLD W to slide FAST on ice)!";
      infoO.aniCol = "#FFFFFF";
      infoO.skinName = "arctic/penguin";
      break;
    case a_polarBear:
      infoO.aniName = "Polar Bear";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Polar bears can climb hills! \n+ They're amazing swimmers!";
      infoO.aniCol = "#e4e4e4";
      infoO.skinName = "arctic/polarbear";
      break;
    case a_seal:
      infoO.aniName = "Seal";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Seals can slide on ice (Hold W) + can climb hills (rocks too!)";
      infoO.aniCol = "#cfcfcf";
      infoO.skinName = "arctic/seal";
      break;
    case a_snowLeopard:
      infoO.aniName = "Snow leopard";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Press W to get a speed boost! (Every 8 seconds)!";
      infoO.aniCol = "#cfcfcf";
      infoO.skinName = "arctic/snowleopard";
      break;
    case a_walrus:
      infoO.aniName = "Walrus";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n You can slide on ice (Hold W) + can climb hills (rocks too!)";
      infoO.aniCol = "#633838";
      infoO.skinName = "arctic/walrus";
      break;
    case a_reindeer:
      infoO.aniName = "Reindeer";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Press W to dig up food! \n Your sharp hooves let you turn very well on ice!";
      infoO.aniCol = "#a68976";
      infoO.skinName = "arctic/reindeer";
      break;
    case a_wolf:
      infoO.aniName = "Wolf";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Wolf paws turn very well on ice!\n Press W to howl!";
      infoO.aniCol = "#6B6B6B";
      infoO.skinName = "arctic/wolf";
      break;
    case a_wolverine:
      infoO.aniName = "Wolverine";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Press W to Let out a Powerful GROWL! (Knocks back prey!)";
      infoO.aniCol = "#843A0F";
      infoO.skinName = "arctic/wolverine";
      break;
    case a_mammoth:
      infoO.aniName = "Mammoth";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Press W to roll snowballs with your trunk!\n The bigger the snowball gets, the longer the freeze!";
      infoO.aniCol = "#9d4717";
      infoO.skinName = "arctic/mammoth";
      break;
    case a_donkey:
      infoO.aniName = "Donkey";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Press W to Kick any animal behind you";
      infoO.aniCol = "#8c7c64";
      infoO.skinName = "donkey";
      break;
    /* NEW ANIMALS */
    case a_sabertoothTiger:
      infoO.aniName = "Sabertooth Tiger";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to Sabertooth Tiger!\nSabertooth Tigers are great swimmers, dominate the Lakes/Oceans/Mud!";
      infoO.aniCol = "#945A99";
      infoO.skinName = "sabertoothtiger";
      break;
    case a_elephant:
      infoO.aniName = "Elephant";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Use your long trunk to attack and eat food!";
      infoO.aniCol = "#945A99";
      infoO.skinName = "elephant";
      break;

    case a_blueWhale:
      infoO.aniName = "Blue Whale";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to Blue Whale!\n Smash with your powerful tail!";
      infoO.aniCol = "#945A99";
      infoO.skinName = "bluewhale";
      break;

    // case a_duck:
    //     infoO.aniName = "Duck";
    //     infoO.aniDesc = "";
    //     infoO.upgradeText = "UPGRADED to a DUCK!";
    //     infoO.aniCol = "#FF9000";
    //     infoO.skinName = "duck";
    //     break;
    case a_duckling:
      infoO.aniName = "Duckling";
      infoO.aniDesc = "";
      infoO.upgradeText = "UPGRADED to a DUCK!";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "duck/duckling";
      break;

    case a_hedgehog:
      infoO.aniName = "Hedgehog";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to Hedgehog!\n (Hold W to become spiky, and dangerous to touch!)";
      infoO.aniCol = "#5b400d";
      infoO.skinName = "hedgehog";
      break;

    case a_kingCrab:
      infoO.aniName = "King Crab";
      infoO.aniDesc = "";
      infoO.upgradeText = "UPGRADED to a KING CRAB!";
      infoO.aniCol = "#971f0e";
      infoO.skinName = "kingcrab";
      break;
    case a_lemming:
      infoO.aniName = "Lemming";
      infoO.aniDesc = "";
      infoO.upgradeText = ""; //A little "+infoO.aniName+"...";
      infoO.aniCol = "#A77C30";
      infoO.skinName = "arctic/lemming";
      break;

    case a_frog:
      infoO.aniName = "Frog";
      infoO.aniDesc = "";
      infoO.upgradeText = "UPGRADED to Frog!!";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "frog/frog";

      break;

    case a_ostrich:
      infoO.aniName = "Ostrich";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to Ostrich! Lay eggs to hatch babies! \nCommand babies by placing your crosshair (right-click/W)-\n They can attack prey!";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "ostrich/ostrich";

      break;
    case a_pelican:
      infoO.aniName = "Pelican";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to Pelican! \nPick up water (and prey!) in your mouth,\nfly, and drop water on prey! (press W again)";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "pelican/pelican";

      break;
    case a_falcon:
      infoO.aniName = "Falcon";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to Falcon! \nFly, and do a powerful dive attack! Aim it well.";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "falcon/falcon";

      break;

    case a_snowyOwl:
      infoO.aniName = "Snowy Owl";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to Snowy Owl!\n Aim the crosshair, \n right click/W when it's on top of prey, to attack!";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "snowyowl/snowyowl";

      break;

    case a_ostrichBaby:
      infoO.aniName = "Baby Ostrich";
      infoO.aniDesc = "";
      infoO.upgradeText = "UPGRADED to Baby Ostrich!!";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "ostrich/baby-ostrich";

      break;
    case a_phoenix:
      infoO.aniName = "Phoenix";
      infoO.upgradeText =
        "UPGRADED to Phoenix!\nCreate powerful fire tornados to burn your enemies alive!";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "phoenix/phoenix";
      break;

    case a_seaMonster:
      infoO.aniName = "Sea Monster";
      infoO.upgradeText = "UPGRADED to Sea Monster!";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "seamonster";
      break;
    case a_landMonster:
      infoO.aniName = "Land Monster";
      infoO.upgradeText = "UPGRADED to Land Monster!";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "landmonster";
      break;
    case a_iceMonster:
      infoO.aniName = "Ice Monster";
      infoO.upgradeText = "UPGRADED to Ice Monster!";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "icemonster";
      break;
    case a_dinoMonster:
      infoO.aniName = "Dino Monster";
      infoO.upgradeText = "UPGRADED to Dino Monster!";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "dinomonster";
      break;
    case a_pigeon:
      infoO.aniName = "Pigeon";
      infoO.upgradeText = "UPGRADED to Pigeon!\nHold W to fly around. ";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "pigeon/pigeon";
      break;
    case a_toucan:
      infoO.aniName = "Toucan";
      infoO.upgradeText = "UPGRADED to Toucan!\nHold W to fly around. ";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "toucan/toucan";
      break;

    default:
      infoO.aniName = "(Animal)";
      infoO.aniDesc = "";
      infoO.aniCol = "#000000";
      infoO.upgradeText = "UPGRADED!";
  }

  return infoO;
};

function onAniTypeSet() { }

///////
// file: js_src/gameobj/ability/AbilityObj.js
///////

//thisClass! inherit prototype/properties from superclass
//global AbilityObj;
var thisClass = AbilityObj;
var superClass = GameObj;
thisClass.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
thisClass.prototype.constructor = thisClass;
thisClass.superClass = superClass; //'class' var

AbilityObj.prototype.abilityType = ability_none;
AbilityObj.prototype.showHalloweenSkins = true;

//call on draw
AbilityObj.prototype.updateZ = function () {
  ///console.log("inside ability updateZ: " + this.abilityType);

  if (
    this.abilityType == ability_eagleAttack ||
    this.abilityType == ability_falconAttack ||
    this.abilityType == ability_owlAttack ||
    this.abilityType == ability_targetCircle ||
    this.abilityType == ability_bearSlash
  ) {
    this.z = 100002;
  }
  //if(this.abilityType==ability_krakenSpec || this.abilityType==ability_stingRayShock || this.abilityType==ability_squidInk)
  else if (
    this.abilityType == ability_bearSlash ||
    this.abilityType == ability_iceSlide ||
    this.abilityType == ability_clawSlash ||
    this.abilityType == ability_backLegKick ||
    this.abilityType == ability_whaleTailHit ||
    this.abilityType == ability_elephantTrunkSmack ||
    this.abilityType == ability_crabSmash ||
    this.abilityType == ability_crocWaterGrab ||
    this.abilityType == ability_boaSuffocate ||
    this.abilityType == ability_sabertoothJawAttack ||
    this.abilityType == ability_trexShake ||
    this.abilityType == ability_tigerSlash ||
    this.abilityType == ability_pounce ||
    //this.abilityType == ability_tigerJump ||
    this.abilityType == ability_giraffeStomp ||
    this.abilityType == ability_zebraKick ||
    this.abilityType == ability_sharkBite ||
    this.abilityType == ability_fart
  )
    this.z = 10001;
  //above all
  else if (
    this.abilityType == ability_orcaWave ||
    this.abilityType == ability_tsunamiWave ||
    this.abilityType == ability_tsunamiWave
  )
    this.z = 1002;
  //above lake island, above hills
  else if (this.abilityType == ability_waterSplash) this.z = 10001;
  //above lake island, above hills
  else if (this.abilityType == ability_pelican) {
    if (this.specType == 1) this.z = 10001;
    //above lake island, above hills
    else if (this.specType == 2)
      // beak with animal
      this.z = 1013; // below animal grabbed
  } else this.z = -152; //below everything, but above ground stuff
};
//subclassable part of draw()
AbilityObj.prototype.customDraw = function (batchDrawOutline) {
  switch (this.abilityType) {
    case ability_ostrich:
    case ability_hedgehogAttack: {
      // do nothing!
      break;
    }
    case ability_yetiTransform:
      {
        ctx.save();
        var oldA = ctx.globalAlpha;
        ctx.globalAlpha = 0.4 * oldA;
        drawCircle(0, 0, this.rad, "#7EBCC0");

        //snowflake
        ctx.globalAlpha = 1.0 * oldA;
        ctx.strokeStyle = "white";
        ctx.beginPath();

        var wid = 10;
        //make X on 3 axis

        ctx.translate(-5, this.rad * -0.7);
        ctx.moveTo(0, -wid); //vertical lineTo
        ctx.lineTo(0, wid);
        ctx.moveTo(-wid, -wid);
        ctx.lineTo(wid, wid);
        ctx.moveTo(wid, -wid);
        ctx.lineTo(-wid, wid);
        ctx.moveTo(-wid, 0);
        ctx.lineTo(wid, 0);
        ctx.lineWidth = 3.0;
        ctx.stroke();
        ctx.restore();
      }
      break;

    case ability_extraBoost:
      {
        ctx.save();
        var oldA = ctx.globalAlpha;
        ctx.globalAlpha = 0.15 * oldA;
        drawCircle(0, 0, this.rad, "#755A2A");

        ctx.restore();
      }
      break;
    case ability_sabertoothJawAttack:
      {
        ctx.save();
        var oldA = ctx.globalAlpha;
        //ctx.globalAlpha = 0.1 * oldA;
        //drawCircle(0, 0, this.rad, "#755A2A");

        ctx.globalAlpha = 1.0 * oldA;
        var theImg = getLoadedImg("img/ability_sabertoothJawAttack.png");
        if (theImg) {
          var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 200.0);

          var rad = this.rad - 2.5;
          ctx.rotate(this.rPer * Math.PI * 2.0);
          //clip to sliwly show the claw
          ctx.drawImage(
            theImg,
            0,
            0,
            theImg.width * fac0to1,
            theImg.height,
            -rad,
            -rad,
            2 * rad * fac0to1,
            2 * rad
          ); //sx,sy,swidth,sheight,x,y,width,height);
          //ctx.drawImage(theImg, );
          //console.log("drawing banana");
        }

        ctx.restore();
      }
      break;
    case ability_clawSlash:
      {
        ctx.save();
        var oldA = ctx.globalAlpha;
        //ctx.globalAlpha = 0.1 * oldA;
        //drawCircle(0, 0, this.rad, "#755A2A");

        ctx.globalAlpha = 1.0 * oldA;
        var theImg = getLoadedImg("img/ability_claw.png");
        if (theImg) {
          var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 200.0);

          var rad = this.rad - 2.5;
          ctx.rotate(this.rPer * Math.PI * 2.0);
          //clip to sliwly show the claw
          ctx.drawImage(
            theImg,
            0,
            0,
            theImg.width * fac0to1,
            theImg.height,
            -rad,
            -rad,
            2 * rad * fac0to1,
            2 * rad
          ); //sx,sy,swidth,sheight,x,y,width,height);
          //ctx.drawImage(theImg, );
          //console.log("drawing banana");
        }

        ctx.restore();
      }
      break;
    case ability_whaleTailHit:
      {
        ctx.save();
        var oldA = ctx.globalAlpha;

        ctx.globalAlpha = 0.1 * oldA;
        drawCircle(0, 0, this.rad, "#5B7EC7");

        ctx.globalAlpha = 1.0 * oldA;
        var skinFolder = "img";
        if (_gameMode.isHalloween) skinFolder = "skins/zombie/ability_skins";

        var theImg = getLoadedImg(skinFolder + "/ability_whaleTailHit.png");
        if (theImg) {
          var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 200.0);

          //clip to sliwly show the claw
          var rad = this.rad * 0.85;
          ctx.rotate(this.angle);
          var imX = 0,
            imY = this.rad;
          var imW = rad * 2.0,
            imH = rad * 2.0 * fac0to1;
          var imAnchorX = 0.5,
            imAnchorY = 0.95; //top-left= 0,0, bottom-right=1,1 (canvas coords)

          ctx.drawImage(
            theImg,
            imX + imW * -imAnchorX,
            imY + imH * -imAnchorY,
            imW,
            imH
          );

          //console.log("drawing banana");
        }

        ctx.restore();
      }
      break;

    case ability_bearSlash:
      {
        var oldA = ctx.globalAlpha;

        ctx.save();
        var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
        var period = 1.5;
        var shiftAm = 1.0;
        var moveA =
          shiftAm * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

        var theA = ctx.globalAlpha;
        ctx.globalAlpha *= 0.6 * moveA; //- 0.2 * moveA;
        ctx.rotate(this.angle);
        ctx.globalAlpha = 0.15 * oldA;
        if (this.specType2 == 0) drawCircle(0, 0, this.rad, "#96661C");
        else drawCircle(0, 0, this.rad, "#e0dfde");

        ctx.restore();
        ctx.save();

        var skinFolder = "img";

        if (_gameMode.isHalloween) skinFolder = "skins/zombie/ability_skins";

        var theImg = getLoadedImg(
          skinFolder + "/ability_bearSlash" + this.specType2 + ".png"
        );
        if (theImg) {
          var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 200.0);
          var rotfac0to1 = clamp(
            (timestamp - this.spawnTime) / 300.0,
            0.0,
            1.0
          ); //delay rotate animation a bit
          var extraRotate = -(-0.5 + rotfac0to1) * toRadians(90.0); //spin animation

          //clip to sliwly show the claw

          var angle = this.angle; // + (toRadians(45) * (Math.random() > 0.5 ? -1 : 1));
          ctx.rotate(this.angle + extraRotate * (this.specType == 0 ? 1 : -1));

          //ctx.rotate(angle);
          //clip to sliwly show the claw
          var rad = -this.rad * 1;
          //ctx.rotate(toRadians(180));
          var imX = 0,
            imY = this.rad;
          var imW = rad * 2.0,
            imH = rad * 2.0 * fac0to1;
          var imAnchorX = 0.5,
            imAnchorY = 0.8; //top-left= 0,0, bottom-right=1,1 (canvas coords)

          ctx.drawImage(
            theImg,
            imX + imW * -imAnchorX,
            imY + imH * -imAnchorY + rad,
            imW,
            imH
          );

          //console.log("drawing banana");
        }
        ctx.restore();
        /*
                              ctx.save();
                                var oldA = ctx.globalAlpha;
                                //ctx.globalAlpha = 0.1 * oldA;
                                //drawCircle(0, 0, this.rad, "#755A2A");
  
                                ctx.globalAlpha = 1.0 * oldA;
                                var theImg = getLoadedImg("img/ability_claw.png");
                                if (theImg) {
                                  var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 200.0);
  
                                  var rad = this.rad - 2.5;
                                  ctx.rotate(this.angle);
                                  //clip to sliwly show the claw
                                  ctx.drawImage(theImg, this.rad, 0, theImg.width * fac0to1, theImg.height, -rad, -rad, 2 * rad * fac0to1, 2 * rad);
                                }
  
  
                                ctx.restore();
                              */
      }
      break;

    case ability_fart:
      {
        var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
        var frame = getAnimFrame(tSinceSpawn, 1, 0.1, 1);

        ctx.save();
        var oldA = ctx.globalAlpha;
        ctx.globalAlpha = 0.1 - frame;
        //	drawCircle(0, 0, this.rad, "brown");
        ctx.restore();

        ctx.save();
        var rShift = 0;
        var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
        var period = 2.0;
        var shiftAm = 1.5;
        rShift = shiftAm * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

        ctx.fillStyle = "white";
        var drawRad = this.rad * 0.7;

        ctx.globalAlpha = 0.3 - frame;

        //this.drawOutlinedCircle("", "white"); //"#00B343");

        var dx = -drawRad * 0.6,
          dy = -drawRad * 0.5 + 10.0 * this.rPer,
          drad = Math.max(0, drawRad * 0.65 + rShift) + 2;
        //drawCircle(dx, dy, drad+2, col_outline_land); //outline
        drawCircle(dx, dy, drad, "#654321"); //outline

        var dx = drawRad * 0.5,
          dy = -drawRad * 0.5 - 10.0 * this.rPer,
          drad = Math.max(0, drawRad * 0.73 - rShift);
        //drawCircle(dx, dy, drad+2, col_outline_land); //outline
        drawCircle(dx, dy, drad, "#654321"); //outline
        var dx = drawRad * 0.6,
          dy = drawRad * 0.5,
          drad = Math.max(0, drawRad * 0.78 + rShift);
        //drawCircle(dx, dy, drad+2, col_outline_land); //outline
        drawCircle(dx, dy, drad, "#654321"); //outline

        var dx = -drawRad * 0.5,
          dy = drawRad * 0.5 + 10.0 * this.rPer,
          drad = Math.max(0, drawRad * 0.6 + this.rPer - rShift);
        //drawCircle(dx, dy, drad+2, col_outline_land); //outline
        drawCircle(dx, dy, drad, "#654321"); //outline

        ctx.restore();
      }
      break;
    case ability_eagleAttack:
      {
        //ctx.globalAlpha = 0.5;
        //drawCircle(0, 0, this.rad, "red");
      }
      break;

    case ability_falconAttack:
      {
        // do nothing.
        //ctx.globalAlpha = 0.2;
        //drawCircle(0, 0, this.rad, "limegreen");
      }
      break;

    case ability_honeyBee:
      {
        // do nothing.
        //ctx.globalAlpha = 0.2;
        // drawCircle(0, 0, this.rad, "red");
      }
      break;
    case ability_phoenix:
      {
        //ctx.globalAlpha = 0.5;
        // drawCircle(0, 0, this.rad, "#ef6e24");
      }
      break;

    case ability_targetCircle:
      {
        this.drawEffectScale_Slow = true;
        this.doesDrawEffectScale = true;

        ctx.globalAlpha = 0.2;
        drawCircle(0, 0, this.rad * 0.85, "white");

        //console.log(this.specType);
        var spec = this.specType == 3 ? "_e" : "";

        var theImg = getLoadedImg("img/target" + spec + ".png");
        if (theImg) {
          var rad = this.rad;
          ctx.save();
          ctx.globalAlpha = 0.5; //this.specType  == 3 ? 1 : 0.5;
          ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);
          ctx.restore();
        }

        ctx.save();
        if (this.is1v1Target && this.timerTxt != null) {
          ctx.globalAlpha = 1;
          this.timerTxt.x = 0;
          this.timerTxt.y = 0;
          this.timerTxt.draw();
        }
        ctx.restore();
      }
      break;
    case ability_owlAttack:
      {
        ctx.globalAlpha = 0.5;
        //drawCircle(0, 0, this.rad, "white");
      }
      break;

    case ability_crabSmash:
      {
        ctx.save();
        var oldA = ctx.globalAlpha;

        ctx.globalAlpha = 0.05 * oldA;
        drawCircle(0, 0, this.rad, "#B32E10");

        ctx.globalAlpha = 1.0 * oldA;
        var skinFolder = "img";

        if (_gameMode.isHalloween) skinFolder = "skins/zombie/ability_skins";

        var theImg = getLoadedImg(
          skinFolder + "/ability_crabSmash" + this.specType + ".png"
        );
        if (theImg) {
          //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

          var rotfac0to1 = clamp(
            (timestamp - this.spawnTime) / 200.0,
            0.0,
            1.0
          ); //delay rotate animation a bit
          var mf = this.specType == 1 ? -1 : 1;
          var extraRotate = -(-0.2 + rotfac0to1) * toRadians(-90.0 * mf); //spin animation
          extraRotate = mf * (0.3 + rotfac0to1) + toRadians(mf * -30); //spin animation
          //	extraRotate = -(0.3 + rotfac0to1) + toRadians(30); //spin animation

          //clip to sliwly show the claw
          var rad = this.rad * 0.6;
          ctx.rotate(this.angle + extraRotate);
          var imX = 0,
            imY = this.rad;
          var imW = rad * 2.0 * 0.7,
            imH = rad * 2.0; // * fac0to1;
          var imAnchorX = 0.75,
            imAnchorY = 0.95; //top-left= 0,0, bottom-right=1,1 (canvas coords)

          if (this.specType == 1) {
            (imAnchorX = 0.25), (imAnchorY = 0.95); //top-left= 0,0, bottom-right=1,1 (canvas coords)
          }
          ctx.drawImage(
            theImg,
            imX + imW * -imAnchorX,
            imY + imH * -imAnchorY,
            imW,
            imH
          );

          //console.log("drawing banana");
        }

        ctx.restore();
      }
      break;
    case ability_elephantTrunkSmack:
      {
        ctx.save();
        var oldA = ctx.globalAlpha;

        ctx.globalAlpha = 0.05 * oldA;
        drawCircle(0, 0, this.rad, "#E4E7C8");

        ctx.globalAlpha = 1.0 * oldA;

        var skinFolder = "img";

        if (_gameMode.isHalloween) skinFolder = "skins/zombie/ability_skins";

        var theImg = getLoadedImg(
          skinFolder + "/ability_elephantTrunkSmack.png"
        );
        if (theImg) {
          //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

          var rotfac0to1 = clamp(
            (timestamp - this.spawnTime) / 300.0,
            0.0,
            1.0
          ); //delay rotate animation a bit
          var extraRotate = -(-0.5 + rotfac0to1) * toRadians(90.0); //spin animation

          //clip to sliwly show the claw
          var rad = this.rad * 0.6;
          ctx.rotate(this.angle + extraRotate);
          var imX = 0,
            imY = this.rad;
          var imW = rad * 2.0 * 0.7,
            imH = rad * 2.0; // * fac0to1;
          var imAnchorX = 0.75,
            imAnchorY = 0.95; //top-left= 0,0, bottom-right=1,1 (canvas coords)

          ctx.drawImage(
            theImg,
            imX + imW * -imAnchorX,
            imY + imH * -imAnchorY,
            imW,
            imH
          );

          //console.log("drawing banana");
        }

        ctx.restore();
      }
      break;
    case ability_backLegKick:
      {
        ctx.save();
        var oldA = ctx.globalAlpha;

        ctx.globalAlpha = 0.1 * oldA;
        drawCircle(0, 0, this.rad, "#755A2A");

        ctx.globalAlpha = 1.0 * oldA;
        var skinFolder = "img";

        if (_gameMode.isHalloween) skinFolder = "skins/zombie/ability_skins";

        var theImg = getLoadedImg(skinFolder + "/ability_backkick.png");
        if (theImg) {
          var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 200.0);

          //clip to sliwly show the claw
          var rad = this.rad * 0.6;
          ctx.rotate(this.angle);
          var imX = 0,
            imY = this.rad;
          var imW = rad * 2.0,
            imH = rad * 2.0 * fac0to1;
          var imAnchorX = 0.5,
            imAnchorY = 0.95; //top-left= 0,0, bottom-right=1,1 (canvas coords)

          ctx.drawImage(
            theImg,
            imX + imW * -imAnchorX,
            imY + imH * -imAnchorY,
            imW,
            imH
          );

          //console.log("drawing banana");
        }

        ctx.restore();
      }
      break;
    case ability_crocWaterGrab:
      {
        ctx.save();
        var oldA = ctx.globalAlpha;

        ctx.globalAlpha = 0.25 * oldA;
        drawCircle(0, 0, this.rad, "#44d31f");

        ctx.globalAlpha = 1.0 * oldA;
        var theImg = getLoadedImg("img/ability_crocBite.png");
        if (theImg) {
          var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 200.0);

          //clip to sliwly show the claw
          var rad = this.rad * 0.6;
          ctx.rotate(this.angle);

          var imX = 0,
            imY = this.rad;
          var imW = rad * 2.5,
            imH = rad * 2.5 * fac0to1;
          var imAnchorX = 0.5,
            imAnchorY = 0.95; //top-left= 0,0, bottom-right=1,1 (canvas coords)

          ctx.drawImage(
            theImg,
            imX + imW * -imAnchorX,
            imY + imH * -imAnchorY,
            imW,
            imH
          );

          //clip to sliwly show the claw
          //var rad=this.rad * 0.85;
          ctx.rotate(Math.PI);
          var imX = 0,
            imY = this.rad * 0.5;
          var imW = rad * 2.5,
            imH = rad * 2.5 * fac0to1;
          var imAnchorX = 0.5,
            imAnchorY = 0.95; //top-left= 0,0, bottom-right=1,1 (canvas coords)

          ctx.drawImage(
            theImg,
            imX + imW * -imAnchorX,
            imY + imH * -imAnchorY,
            imW,
            imH
          );

          //console.log("drawing banana");
        }

        ctx.restore();
      }
      break;

    case ability_boaSuffocate:
      {
        ctx.save();
        var oldA = ctx.globalAlpha;

        ctx.globalAlpha = 0.25 * oldA;
        drawCircle(0, 0, this.rad, "#44d31f");

        var skinFolder = "img";

        if (_gameMode.isHalloween) skinFolder = "skins/zombie/ability_skins";

        ctx.globalAlpha = 1.0 * oldA;
        var theImg = getLoadedImg(skinFolder + "/ability_boaBite.png");
        if (theImg) {
          var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 200.0);

          //clip to sliwly show the claw
          var rad = this.rad * 0.6;
          ctx.rotate(this.angle);

          var imX = 0,
            imY = this.rad;
          var imW = rad * 2.5,
            imH = rad * 2.5 * fac0to1;
          var imAnchorX = 0.5,
            imAnchorY = 0.95; //top-left= 0,0, bottom-right=1,1 (canvas coords)

          ctx.drawImage(
            theImg,
            imX + imW * -imAnchorX,
            imY + imH * -imAnchorY,
            imW,
            imH
          );

          //clip to sliwly show the claw
          //var rad=this.rad * 0.85;
          ctx.rotate(Math.PI);
          var imX = 0,
            imY = this.rad * 0.5;
          var imW = rad * 2.5,
            imH = rad * 2.5 * fac0to1;
          var imAnchorX = 0.5,
            imAnchorY = 0.95; //top-left= 0,0, bottom-right=1,1 (canvas coords)

          ctx.drawImage(
            theImg,
            imX + imW * -imAnchorX,
            imY + imH * -imAnchorY,
            imW,
            imH
          );

          //console.log("drawing banana");
        }

        ctx.restore();
      }
      break;
    // trex update abilities
    case ability_tigerJump:
      {
        ctx.save();
        var oldA = ctx.globalAlpha;

        ctx.globalAlpha = 0.1 * oldA;
        drawCircle(0, 0, this.rad, "#755A2A");

        ctx.globalAlpha = 1.0 * oldA;

        var skinFolder = "skins";

        if (_gameMode.isHalloween) skinFolder = "skins/zombie";

        var theImg = getLoadedImg(
          skinFolder + "/tiger/" + this.specType2 + "/ability_tigerJump.png"
        );
        if (theImg) {
          var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 100.0);

          //clip to sliwly show the claw
          var rad = this.rad * 1.1;
          ctx.rotate(this.angle);
          var imX = 0,
            imY = this.rad;
          var imW = rad * 2.0,
            imH = rad * 2.0 * fac0to1;
          var imAnchorX = 0.5,
            imAnchorY = 1; //top-left= 0,0, bottom-right=1,1 (canvas coords)

          ctx.drawImage(
            theImg,
            imX + imW * -imAnchorX,
            imY + imH * -imAnchorY,
            imW,
            imH
          );

          //console.log("drawing banana");
        }

        ctx.restore();
      }
      break;

    case ability_pounce:
      {
        ctx.save();
        var oldA = ctx.globalAlpha;

        ctx.globalAlpha = 0.05 * oldA;
        drawCircle(0, 0, this.rad, "#44d31f");

        ctx.globalAlpha = 1.0 * oldA;
        var theImgUpper = getLoadedImg("img/ability_pounce2.png");
        var theImgLower = getLoadedImg("img/ability_pounce1.png");

        if (theImgUpper && theImgLower) {
          var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 200.0);

          //clip to sliwly show the claw
          var rad = this.rad * 0.4;
          ctx.rotate(this.angle);

          var imX = 0,
            imY = this.rad;
          var imW = rad * 2.5,
            imH = rad * 2.5 * fac0to1;
          var imAnchorX = 0.5,
            imAnchorY = 0.95; //top-left= 0,0, bottom-right=1,1 (canvas coords)

          ctx.drawImage(
            theImgUpper,
            imX + imW * -imAnchorX,
            imY + imH * -imAnchorY,
            imW,
            imH
          );

          //clip to sliwly show the claw
          //var rad=this.rad * 0.85;
          //ctx.rotate(Math.PI);
          rad = this.rad * 0.6;
          var imX = 0,
            imY = this.rad * 0.5;
          var imW = rad * 2.5,
            imH = rad * 2.5 * fac0to1;
          var imAnchorX = 0.5,
            imAnchorY = 0.95; //top-left= 0,0, bottom-right=1,1 (canvas coords)

          ctx.drawImage(
            theImgLower,
            imX + imW * -imAnchorX,
            imY + imH * -imAnchorY,
            imW,
            imH
          );
        }

        ctx.restore();
      }
      break;

    case ability_tigerSlash:
      {
        ctx.save();
        var oldA = ctx.globalAlpha;

        ctx.globalAlpha = 0.05 * oldA;
        drawCircle(0, 0, this.rad, "#E4E7C8");

        ctx.globalAlpha = 1.0 * oldA;

        var img =
          "skins/tiger/" +
          this.specType2 +
          "/ability_tigerSlash" +
          this.specType +
          ".png";

        var theImg = getLoadedImg(img);

        if (theImg) {
          //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

          var rotfac0to1 = clamp(
            (timestamp - this.spawnTime) / 300.0,
            0.0,
            1.0
          ); //delay rotate animation a bit
          var extraRotate =
            (this.specType == 1 ? 1 : -1) *
            (-0.6 + rotfac0to1) *
            toRadians(90.0); //spin animation

          //clip to sliwly show the claw
          var rad = this.rad * 1.2;
          ctx.rotate(this.angle + extraRotate);
          var imX = 0,
            imY = this.rad;
          var imW = rad * 2.0 * 0.7,
            imH = rad * 2.0; // * fac0to1;
          var imAnchorX = 0.2,
            imAnchorY = 0.5; //top-left= 0,0, bottom-right=1,1 (canvas coords)

          ctx.drawImage(
            theImg,
            imX + imW * -imAnchorX,
            imY + imH * -imAnchorY,
            imW,
            imH
          );

          //console.log("drawing banana");
        }

        ctx.restore();
      }
      break;
    case ability_zebraKick:
      {
        ctx.save();
        var oldA = ctx.globalAlpha;

        ctx.globalAlpha = 0.1 * oldA;
        drawCircle(0, 0, this.rad, "#755A2A");

        ctx.globalAlpha = 1.0 * oldA;

        var skinFolder = "img";

        if (_gameMode.isHalloween) skinFolder = "skins/zombie/ability_skins";

        var theImg = getLoadedImg(skinFolder + "/ability_zebraKick.png");
        if (theImg) {
          var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 200.0);

          //clip to sliwly show the claw
          var rad = this.rad * 0.6;
          ctx.rotate(this.angle);
          var imX = 0,
            imY = this.rad;
          var imW = rad * 2.0,
            imH = rad * 3.0 * fac0to1;
          var imAnchorX = 0.5,
            imAnchorY = 1; //top-left= 0,0, bottom-right=1,1 (canvas coords)

          ctx.drawImage(
            theImg,
            imX + imW * -imAnchorX,
            imY + imH * -imAnchorY,
            imW,
            imH
          );

          //console.log("drawing banana");
        }

        ctx.restore();
      }
      break;
    case ability_giraffeStomp:
      {
        var oldA = ctx.globalAlpha;

        ctx.save();
        var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
        var period = 1.5;
        var shiftAm = 1.0;
        var moveA =
          shiftAm * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

        var theA = ctx.globalAlpha;
        ctx.globalAlpha *= 0.6 * moveA; //- 0.2 * moveA;
        ctx.rotate(this.angle);
        ctx.globalAlpha = 0.15 * oldA;
        //drawCircle(0, 0, this.rad, "#E4E7C8");
        drawCircle(
          this.rad * 0.3,
          0,
          this.rad * (0.9 + 0.12 * moveA),
          "#E4E7C8"
        );
        drawCircle(
          -this.rad * 0.3,
          0,
          this.rad * (1.05 + 0.09 * moveA),
          "#E4E7C8"
        );
        ctx.globalAlpha = theA;
        ctx.restore();
        ctx.save();

        var skinFolder = "img";

        if (_gameMode.isHalloween) skinFolder = "skins/zombie/ability_skins";

        var theImg = getLoadedImg(skinFolder + "/ability_giraffeStompLeg.png");
        if (theImg) {
          var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 200.0);

          var angle = this.angle; // + (toRadians(45) * (Math.random() > 0.5 ? -1 : 1));
          ctx.rotate(angle);
          //clip to sliwly show the claw
          var rad = -this.rad * 1;
          //ctx.rotate(toRadians(180));
          var imX = 0,
            imY = this.rad;
          var imW = rad * 2.0,
            imH = rad * 2.0 * fac0to1;
          var imAnchorX = 0.5,
            imAnchorY = 0.8; //top-left= 0,0, bottom-right=1,1 (canvas coords)

          ctx.drawImage(
            theImg,
            imX + imW * -imAnchorX,
            imY + imH * -imAnchorY + rad,
            imW,
            imH
          );

          //console.log("drawing banana");
        }
        ctx.restore();

        /*
                var bubbles = 1
                for (i = 1; i <= bubbles; i++) {
                  ctx.save();
  
                  ctx.fillStyle = "#6183d3";
                  ctx.globalAlpha = 0.1;
                  ctx.rotate(this.rPer * Math.PI * 2.0 * i);
                  ctx.beginPath(); //top left, right
                  ctx.arc(0, this.rad * 0.3, this.rad * (0.9 + 0.12 * moveA), 0, Math.PI * 2);
                  ctx.fill();
                  ctx.beginPath();
                  ctx.arc(0, -this.rad * 0.3, this.rad * (1.05 + 0.09 * moveA), 0, Math.PI * 2);
                  ctx.fill();
  
                   ctx.restore();
                }
                */

        /*
                                  ctx.save();
                                  var oldA = ctx.globalAlpha;
  
                                  ctx.globalAlpha = 0.1 * oldA;
                                  drawCircle(0, 0, this.rad, "#755A2A");
  
                                  ctx.globalAlpha = 1.0 * oldA;
                                  var theImg = getLoadedImg("img/ability_giraffeStomp.png");
                                  if (theImg) {
                                      var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 200.0);
  
                                      //clip to sliwly show the claw
                                      var rad = this.rad * 1.0;
                                      ctx.rotate(this.angle + toRadians(180));
                                      var imX = 0,
                                          imY = this.rad;
                                      var imW = (rad * 2.0),
                                          imH = (rad * 2.0) * fac0to1;
                                      var imAnchorX = 0.5,
                                          imAnchorY = 1.2; //top-left= 0,0, bottom-right=1,1 (canvas coords)
  
                                      ctx.drawImage(theImg, imX + (imW) * (-imAnchorX), imY + (imH) * (-imAnchorY), imW, imH);
  
                                      //console.log("drawing banana");
                                  }
  
  
                                  ctx.restore();
                                  */
      }
      break;
    case ability_sharkBite:
      {
        ctx.save();
        var oldA = ctx.globalAlpha;

        var oldA = ctx.globalAlpha;

        ctx.globalAlpha = 0.15 * oldA;

        ctx.globalAlpha = 1.0 * oldA;

        var skinFolder = "img";

        if (_gameMode.isHalloween) skinFolder = "skins/zombie/ability_skins";

        var theImg = getLoadedImg("img/ability_sharkBite.png");

        if (theImg) {
          var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 200.0);

          //clip to sliwly show the claw
          var rad = this.rad * 0.6;
          ctx.rotate(this.angle);

          var imX = 0,
            imY = this.rad;
          var imW = rad * 2.5,
            imH = rad * 2.5 * fac0to1;
          var imAnchorX = 0.5,
            imAnchorY = 0.95; //top-left= 0,0, bottom-right=1,1 (canvas coords)

          ctx.drawImage(
            theImg,
            imX + imW * -imAnchorX,
            imY + imH * -imAnchorY,
            imW,
            imH
          );

          //clip to sliwly show the claw
          //var rad=this.rad * 0.85;
          ctx.rotate(Math.PI);
          var imX = 0,
            imY = this.rad * 0.5;
          var imW = rad * 2.5,
            imH = rad * 2.5 * fac0to1;
          var imAnchorX = 0.5,
            imAnchorY = 1.35; //top-left= 0,0, bottom-right=1,1 (canvas coords)

          ctx.drawImage(
            theImg,
            imX + imW * -imAnchorX,
            imY + imH * -imAnchorY,
            imW,
            imH
          );

          //console.log("drawing banana");
        }
        var skinFolder = "img";

        if (_gameMode.isHalloween) skinFolder = "skins/zombie/ability_skins";
        var theImg = getLoadedImg(skinFolder + "/shark-head.png");
        if (theImg) {
          var frame = Math.min(1.0, (timestamp - this.spawnTime) / 200.0);
          ctx.globalAlpha = 0.9;
          //clip to sliwly show the claw
          var rad = -this.rad * 1.75;
          ctx.rotate(toRadians(180));
          var imX = 0,
            imY = this.rad;
          var imW = rad * 2.0,
            imH = rad * 2.0 * frame;
          var imAnchorX = 0.5,
            imAnchorY = 0.5; //top-left= 0,0, bottom-right=1,1 (canvas coords)

          ctx.drawImage(
            theImg,
            imX + imW * -imAnchorX,
            imY + imH * -imAnchorY + rad,
            imW,
            imH
          );

          //console.log("drawing banana");
        }

        ctx.restore();
      }
      break;
    case ability_waterSplash:
      {
        ctx.save();
        var oldA = ctx.globalAlpha;
        ctx.globalAlpha = 0.5 * oldA;
        var rad = this.rad;

        var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
        var period = 2.2;
        var xShift = 6.5 * Math.cos(((2.0 * Math.PI) / period) * tSinceSpawn);
        var yShift = 6.5 * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

        ctx.globalAlpha = 0.3 * oldA;
        drawCircle(0, 0, rad, "#2CAAC4");

        ctx.globalAlpha = 0.5 * oldA;

        drawCircle(
          0 + xShift / 4.5 + this.rPer,
          1 + yShift / 1.5,
          Math.max(0, rad - 14),
          "#29A0BA"
        );
        drawCircle(
          0 + xShift / 1.5 - this.rPer * 2,
          yShift,
          Math.max(0, rad - 38.5 + yShift / 5),
          "#2B8CAA"
        );
        drawCircle(
          0 + xShift / 1.5 - this.rPer * 2,
          yShift,
          Math.max(0, rad - 54.5 + yShift / 11),
          "#28829E"
        );
        ctx.restore();
      }
      break;
    case ability_pelican: {
      if (this.specType == 0 || this.specType == 2) {
        ctx.save();
        //drawCircle(0, 0, this.rad, "red");
        var btype = ""; //this.specType == 0 ? "" : "2";
        var theImg = getLoadedImg(
          "skins/pelican/ability_pelican" + btype + ".png"
        );
        if (theImg) {
          //clip to sliwly show the claw
          var rad = -this.rad * 1.5;
          ctx.rotate(this.angle);
          var imX = 0,
            imY = this.rad;
          var imW = rad,
            imH = rad;
          var imAnchorX = 0.5,
            imAnchorY = 0.5; //top-left= 0,0, bottom-right=1,1 (canvas coords)

          ctx.drawImage(
            theImg,
            imX + imW * -imAnchorX,
            imY + imH * -imAnchorY + rad,
            imW,
            imH
          );
        }

        ctx.restore();
      }
      break;
    }
    case ability_trexShake:
      {
        ctx.save();
        var oldA = ctx.globalAlpha;

        ctx.globalAlpha = 0.15 * oldA;
        //drawCircle(0, 0, this.rad, "#862A2A");

        ctx.globalAlpha = 1.0 * oldA;

        var theImg = getLoadedImg("img/ability_trexBite.png");

        if (theImg) {
          var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 200.0);

          //clip to sliwly show the claw
          var rad = this.rad * 0.6;
          ctx.rotate(this.angle);

          var imX = 0,
            imY = this.rad;
          var imW = rad * 2.5,
            imH = rad * 2.5 * fac0to1;
          var imAnchorX = 0.5,
            imAnchorY = 0.95; //top-left= 0,0, bottom-right=1,1 (canvas coords)

          ctx.drawImage(
            theImg,
            imX + imW * -imAnchorX,
            imY + imH * -imAnchorY,
            imW,
            imH
          );

          //clip to sliwly show the claw
          //var rad=this.rad * 0.85;
          ctx.rotate(Math.PI);
          var imX = 0,
            imY = this.rad * 0.5;
          var imW = rad * 2.5,
            imH = rad * 2.5 * fac0to1;
          var imAnchorX = 0.5,
            imAnchorY = 0.95; //top-left= 0,0, bottom-right=1,1 (canvas coords)

          ctx.drawImage(
            theImg,
            imX + imW * -imAnchorX,
            imY + imH * -imAnchorY,
            imW,
            imH
          );

          //console.log("drawing banana");
        }
        var skinFolder = "img";

        if (_gameMode.isHalloween) skinFolder = "skins/zombie/ability_skins";

        var theImg = getLoadedImg(skinFolder + "/trex-head.png");
        if (theImg) {
          var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 200.0);

          //clip to sliwly show the claw
          var rad = -this.rad * 1.5;
          ctx.rotate(toRadians(180));
          var imX = 0,
            imY = this.rad;
          var imW = rad * 2.0,
            imH = rad * 2.0 * fac0to1;
          var imAnchorX = 0.5,
            imAnchorY = 0.5; //top-left= 0,0, bottom-right=1,1 (canvas coords)

          ctx.drawImage(
            theImg,
            imX + imW * -imAnchorX,
            imY + imH * -imAnchorY + rad,
            imW,
            imH
          );

          //console.log("drawing banana");
        }

        ctx.restore();
      }
      break;

    // trex update end
    case ability_wolfHowl:
      {
        ctx.save();
        var oldA = ctx.globalAlpha;
        ctx.globalAlpha = 0.15 * oldA;
        drawCircle(0, 0, this.rad, "#6D7471");
        ctx.restore();
      }
      break;
    case ability_cobraVenomSpit:
      {
        ctx.save();
        var oldA = ctx.globalAlpha;
        ctx.globalAlpha = 0.15 * oldA;
        drawCircle(0, 0, this.rad, "#6D7471");
        ctx.restore();
      }
      break;
    case ability_spiderWeb:
      {
        ctx.save();
        var oldA = ctx.globalAlpha;
        ctx.globalAlpha = 0.15 * oldA;
        drawCircle(0, 0, this.rad, "#f2f2f2");
        ctx.restore();
      }
      break;
    case ability_tsunamiWave:
    case ability_orcaWave:
      {
        ctx.save();
        if (this.abilityType == ability_tsunamiWave)
          ctx.rotate(this.angle - toRadians(90.0));
        else ctx.rotate(this.angle + toRadians(180.0));

        var oldA = ctx.globalAlpha;
        //ctx.globalAlpha = 0.1 * oldA;
        //drawCircle(0, 0, this.rad, "#1898BD");

        ctx.globalAlpha = 0.8 * oldA;
        var theImg = getLoadedImg("img/wave.png");
        if (theImg) {
          var rad = this.rad;

          ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);
          //console.log("drawing banana");
        }
        ctx.restore();
      }
      break;
    case ability_lionRoar:
      {
        ctx.save();
        var oldA = ctx.globalAlpha;
        ctx.globalAlpha = 0.2 * oldA;
        drawCircle(0, 0, this.rad, "#746B3E");
        ctx.restore();
      }
      break;
    case ability_stingRayShock:
      {
        ctx.save();
        var oldA = ctx.globalAlpha;
        ctx.globalAlpha = 0.5 * oldA;
        drawCircle(0, 0, this.rad, "#62C5FF");

        //bolt
        ctx.globalAlpha = 1.0 * oldA;
        ctx.strokeStyle = "#62C5FF";
        ctx.beginPath();
        var px = this.rad * -0.7,
          py = -5;
        var boltSz = 10;
        ctx.moveTo(px, py);
        ctx.lineTo(px - boltSz * 0.4, py + boltSz);
        ctx.lineTo(px + boltSz * 0.4, py + boltSz * 0.7);
        ctx.lineTo(px + boltSz * 0.4 * 0.5, py + boltSz * 2);
        ctx.lineWidth = 3.0;
        ctx.stroke();

        ctx.restore();
      }
      break;
    case ability_seaMonsterSpec:
      {
        ctx.save();
        var oldA = ctx.globalAlpha;
        ctx.globalAlpha = 0.5 * oldA;
        var rad = Math.max(0, this.rad - 30);

        var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
        var period = 2.2;
        var xShift = 6.5 * Math.cos(((2.0 * Math.PI) / period) * tSinceSpawn);
        var yShift = 6.5 * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

        ctx.globalAlpha = 0.05 * oldA;
        drawCircle(0, 0, rad, "#2CAAC4");

        ctx.globalAlpha = 0.05 * oldA;
        if (!options_lowGraphics) {
          drawCircle(
            0 + xShift / 2 - this.rPer,
            0 + yShift / 2 - this.rPer,
            Math.max(0, rad - 6),
            "#2D93B0"
          );
        }
        drawCircle(
          0 + xShift / 1.5 - this.rPer * 2,
          yShift,
          Math.max(0, rad - 54.5 + yShift / 11),
          "#28829E"
        );

        ctx.restore();
        ctx.save();
        var oldA = ctx.globalAlpha;

        var rad = Math.max(0, this.rad - 30);

        var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
        var period = 3.2;
        var xShift = 30 * Math.cos(((2.0 * Math.PI) / period) * tSinceSpawn);
        var yShift = 30 * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

        ctx.globalAlpha = 0.05 * oldA;
        drawCircle(0, 0, rad, "white");
        drawCircle(
          0 + xShift / 2 - this.rPer,
          0 + yShift / 2 - this.rPer,
          Math.max(0, rad * 0.95),
          "white"
        );
        drawCircle(
          0 + xShift / 4.5 + this.rPer,
          1 + yShift / 1.5,
          Math.max(0, rad * 0.85),
          "white"
        );

        ctx.restore();

        var tornado = getLoadedImg("img/whirlpool.png");
        if (tornado) {
          var rad = this.rad;

          var rps = 5 / 60;
          var rotationTms = 1000 / rps; //ms to one full movement- t=dist * v
          var fac0to1 =
            ((timestamp - this.spawnTime) % rotationTms) / rotationTms;
          var rotation1 = fac0to1 * 2 * Math.PI;

          rps = 8 / 60;
          rotationTms = 1000 / rps; //ms to one full movement- t=dist * v
          fac0to1 = ((timestamp - this.spawnTime) % rotationTms) / rotationTms;
          rotation2 = fac0to1 * 2 * Math.PI;

          ctx.save();
          ctx.rotate(rotation1);
          //ctx.drawImage(tornado, -rad, -rad, 2 * rad, 2 * rad);

          var oldA = ctx.globalAlpha;
          ctx.globalAlpha = 1 * oldA;
          //var rad = Math.max(0, this.rad - 30);

          var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
          var period = 2.2;
          var xShift = 6.5 * Math.cos(((2.0 * Math.PI) / period) * tSinceSpawn);
          var yShift = 6.5 * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

          ctx.globalAlpha = 0.2;
          ctx.drawImage(tornado, -rad - xShift / 2.2, -rad, 2 * rad, 2 * rad);
          ctx.restore();

          ctx.save();
          ctx.globalAlpha = 0.1;
          ctx.rotate(rotation2 * 0.8);
          ctx.drawImage(tornado, -rad - xShift / 2.2, -rad, 2 * rad, 2 * rad);
          ctx.restore();

          ctx.save();
          ctx.globalAlpha = 0.2;
          ctx.rotate(rotation2);
          ctx.drawImage(tornado, -rad - xShift / 2.2, -rad, 2 * rad, 2 * rad);
          ctx.restore();

          ctx.save();
          ctx.globalAlpha = 0.2;
          ctx.rotate(rotation2);
          ctx.drawImage(tornado, -rad - xShift / 2.2, -rad, 2 * rad, 2 * rad);
          ctx.restore();

          ctx.save();
          ctx.globalAlpha = 0.2;
          ctx.rotate(rotation1);
          ctx.drawImage(tornado, -rad - xShift / 2.2, -rad, 2 * rad, 2 * rad);
          ctx.restore();

          ctx.save();
          ctx.globalAlpha = 0.2;
          ctx.rotate(rotation1);
          ctx.drawImage(tornado, -rad - xShift / 2.2, -rad, 2 * rad, 2 * rad);
          ctx.restore();
        }
      }
      break;

    case ability_krakenSpec:
      {
        ctx.save();
        var oldA = ctx.globalAlpha;
        ctx.globalAlpha = 0.5 * oldA;
        var rad = Math.max(0, this.rad - 30);

        var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
        var period = 2.2;
        var xShift = 6.5 * Math.cos(((2.0 * Math.PI) / period) * tSinceSpawn);
        var yShift = 6.5 * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

        ctx.globalAlpha = 0.4 * oldA;
        drawCircle(0, 0, rad, "#2CAAC4");

        ctx.globalAlpha = 0.7 * oldA;
        if (!options_lowGraphics) {
          drawCircle(
            0 + xShift / 2 - this.rPer,
            0 + yShift / 2 - this.rPer,
            Math.max(0, rad - 6),
            "#2D93B0"
          );
        }
        drawCircle(
          0 + xShift / 4.5 + this.rPer,
          1 + yShift / 1.5,
          Math.max(0, rad - 14),
          "#29A0BA"
        );
        drawCircle(
          0 + xShift / 1.5 - this.rPer * 2,
          yShift,
          Math.max(0, rad - 38.5 + yShift / 5),
          "#2B8CAA"
        );
        drawCircle(
          0 + xShift / 1.5 - this.rPer * 2,
          yShift,
          Math.max(0, rad - 54.5 + yShift / 11),
          "#28829E"
        );

        ctx.restore();
      }
      break;
    case ability_squidInk:
      {
        ctx.save();
        var oldA = ctx.globalAlpha;

        if (!options_lowGraphics) ctx.rotate(this.rPer * 2 * Math.PI);

        var rShift = 0;
        var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
        var period = 6.0;
        var shiftAm = 1.5;
        rShift = shiftAm * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

        //console.log("Mud");
        ctx.globalAlpha = 0.7 * oldA;
        //green outline (without stroke- optimized)
        var strokeW = 4;
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(0, 0, this.rad, 0, Math.PI * 2);
        ctx.fill();

        if (!options_lowGraphics) {
          ctx.fillStyle = "black";
          ctx.globalAlpha = 0.5 * oldA;
          ctx.beginPath();
          ctx.arc(
            0,
            0,
            Math.max(0, this.rad - strokeW + rShift),
            0,
            Math.PI * 2
          );
          ctx.fill();
          ctx.beginPath(); //top right
          ctx.arc(
            this.rad * 0.45,
            -this.rad * 0.45 + 15.0 * this.rPer,
            Math.max(0, this.rad * 0.5 + rShift),
            0,
            2 * Math.PI
          );
          ctx.fill();
          ctx.beginPath(); //bottom right
          ctx.arc(
            this.rad * 0.5,
            this.rad * 0.5 + 15.0 * this.rPer,
            Math.max(0, this.rad * 0.4 + rShift),
            0,
            2 * Math.PI
          );
          ctx.fill();
          ctx.beginPath(); //bottom left
          ctx.arc(
            -this.rad * 0.55 * 0.707,
            +this.rad * 0.55 * 0.707 + 15.0 * this.rPer,
            Math.max(0, this.rad * 0.5 + rShift),
            0,
            2 * Math.PI
          );
          ctx.fill();
          ctx.beginPath();
          ctx.arc(
            -this.rad * 0.75,
            -this.rad * 0.35 + 15.0 * this.rPer,
            Math.max(0, this.rad * 0.3 + rShift),
            0,
            2 * Math.PI
          );
          ctx.fill();
          ctx.beginPath();
          ctx.beginPath();
          ctx.arc(this.rad + 10 * this.rPer, 50 * this.rPer, 8, 0, 2 * Math.PI);
          ctx.fill();
          ctx.beginPath();
          ctx.beginPath();
          ctx.arc(
            this.rad - 20 * this.rPer,
            50 * this.rPer,
            10,
            0,
            2 * Math.PI
          );
          ctx.fill();
          ctx.beginPath();
        }

        ctx.restore();
      }
      break;
    case ability_makeHidingHole:
      {
        ctx.save();
        var oldA = ctx.globalAlpha;
        ctx.globalAlpha = 0.25 * oldA;
        drawCircle(0, 0, this.rad, "#9F8641");

        ctx.restore();
      }
      break;

    case ability_foxhidingHoleKickout:
      {
        ctx.save();
        var oldA = ctx.globalAlpha;
        ctx.globalAlpha = 0.25 * oldA;
        drawCircle(0, 0, this.rad, "#785228");

        ctx.restore();
      }
      break;

    default:
      {
        ctx.save();
        var oldA = ctx.globalAlpha;
        ctx.globalAlpha = 0.15 * oldA;
        drawCircle(0, 0, this.rad, "black");

        ctx.restore();
      }
      break;
  }
};

//this method is important in the subclassing hierachry
AbilityObj.prototype.setObjTypes = function (oType, secondaryType) {
  this.oType = oType;
  this.abilityType = secondaryType; //secondaryType can be different for eg.
};

//override this to read in custom spawn data
AbilityObj.prototype.readCustomData_onNewlyVisible = function (msg) {
  AbilityObj.superClass.prototype.readCustomData_onNewlyVisible.call(this, msg);

  //console.log("reading ABILITY ONNEWLYVIS");
  this.specType = msg.readUInt8();
  this.specType2 = msg.readUInt8();

  //start at 0 rad! (animate in, by default it doesnt)
  if (
    this.abilityType == ability_yetiTransform ||
    this.abilityType == ability_wolfHowl ||
    this.abilityType == ability_orcaWave ||
    this.abilityType == ability_tsunamiWave ||
    this.abilityType == ability_lionRoar ||
    this.abilityType == ability_foxhidingHoleKickout
  ) {
    this.rad = this.oRad = 0;
  }
};

AbilityObj.prototype.readCustomData_onUpdate = function (msg) {
  AbilityObj.superClass.prototype.readCustomData_onUpdate.call(this, msg); //call superclass version of this method

  //console.log("reading ABILITY ONUPDATE");
  this.specType = msg.readUInt8();
  this.specType2 = msg.readUInt8();

  this.is1v1Target = msg.readUInt8() == 1;

  if (this.is1v1Target) {
    this.timer = msg.readUInt16() / 100.0;
    if (this.timer < 15) this.updateTimer();
  }
};

AbilityObj.prototype.updateTimer = function () {
  this.timer = Math.round(this.timer);

  var txt = this.timer;

  this.setTimer(txt);
};
AbilityObj.prototype.timerTxt = null;

AbilityObj.prototype.setTimer = function (a) {
  var txt = "" + a;
  if (null == this.timerTxt) {
    this.timerTxt = new CachedText(20, "#FFFFFF"); //"#043400");
    this.timerTxt.strokeW = 2;
    this.timerTxt.multiLine = true;
    this.timerTxt.renderScale = 5.0;
    this.timerTxt.setText(txt);
  } else {
    this.timerTxt.setFontSize(20);
    this.timerTxt.setText(txt);
  }
};

function AbilityObj() {
  AbilityObj.superClass.call(this, o_abilityGObj); //call superclass init method (if needed, or write a new one below)

  //  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@AbilityObj constructor run");
}

window.AbilityObj = AbilityObj; //make class global!

//add this class as a thisClass for the right oType!
GameObjType.setCustomClassForGameObjType(AbilityObj, o_abilityGObj);

///////
// file: js_src/gameobj/ability/AbilityObjElephant.js
///////

var thisClass = AbilityObjElephant;
var superClass = AbilityObj;
thisClass.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
thisClass.prototype.constructor = thisClass;
thisClass.superClass = superClass; //'class' var

//subclassable part of draw()
AbilityObjElephant.prototype.customDraw = function (batchDrawOutline) {
  ctx.save();
  var oldA = ctx.globalAlpha;

  ctx.globalAlpha = 0.05 * oldA;
  drawCircle(0, 0, this.rad, "#E4E7C8");

  ctx.globalAlpha = 1.0 * oldA;
  var skinFolder = "img";
  if (_gameMode.isHalloween) skinFolder = "skins/zombie/ability_skins";

  var theImg = getLoadedImg(skinFolder + "/ability_elephantTrunkSmack.png");
  if (theImg) {
    //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

    var rotfac0to1 = clamp((timestamp - this.spawnTime) / 300.0, 0.0, 1.0); //delay rotate animation a bit
    var extraRotate = -(-0.5 + rotfac0to1) * toRadians(90.0); //spin animation

    //clip to sliwly show the claw
    var rad = this.rad * 0.6;
    ctx.rotate(this.angle + extraRotate);
    var imX = 0,
      imY = this.rad;
    var imW = rad * 2.0 * 0.7,
      imH = rad * 2.0; // * fac0to1;
    var imAnchorX = 0.75,
      imAnchorY = 0.95; //top-left= 0,0, bottom-right=1,1 (canvas coords)

    ctx.drawImage(
      theImg,
      imX + imW * -imAnchorX,
      imY + imH * -imAnchorY,
      imW,
      imH
    );

    //console.log("drawing banana");
  }

  ctx.restore();
};

//override this to read in custom spawn data
AbilityObjElephant.prototype.readCustomData_onNewlyVisible = function (msg) {
  AbilityObjElephant.superClass.prototype.readCustomData_onNewlyVisible.call(
    this,
    msg
  );

  //console.log("reading ELE ONNEWLYVIS a=" + toDegrees(this.angle));
};

AbilityObjElephant.prototype.readCustomData_onUpdate = function (msg) {
  AbilityObjElephant.superClass.prototype.readCustomData_onUpdate.call(
    this,
    msg
  ); //call superclass version of this method

  // console.log("reading ELE ONUPDATE a=" + toDegrees(this.angle));
};

function AbilityObjElephant() {
  AbilityObjElephant.superClass.call(this); //call superclass init method (if needed, or write a new one below)

  // console.log(
  //   "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@AbilityObjElephant constructor run"
  // );
}

window.AbilityObjElephant = AbilityObjElephant; //make class global!

//add this class as a thisClass for the right oType!
GameObjType.setCustomClassForGameObjType(
  AbilityObjElephant,
  o_abilityGObj,
  ability_elephantTrunkSmack
);

//subclassed animals

///////
// file: js_src/gameobj/animal/Animal.js
///////

//thisClass! inherit prototype/properties from superclass
//global Animal;
var thisClass = Animal;
var superClass = GameObj;
thisClass.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
thisClass.prototype.constructor = thisClass;
thisClass.superClass = superClass; //'class' var

Animal.prototype.animalType = a_mouse;
Animal.prototype.animalSpecies = 0; // if ani has different skill set will use this var to show them
Animal.prototype.nickName = "";
Animal.prototype.skinImgName = null; //eg. mouse.png
Animal.prototype.skinNotLoadedColor = "#75ce67"; //draw color when no skin is yet loaded

Animal.prototype.flag_lowWat = false;
Animal.prototype.flag_tailBitten = false;
Animal.prototype.flag_underWater = false;
Animal.prototype.flag_eff_stunned = false;
Animal.prototype.flag_eff_frozen = false;

Animal.prototype.flag_usingAbility = false;
Animal.prototype.flag_eff_invincible = false;
Animal.prototype.flag_eff_healing =
  Animal.prototype.flag_eff_poison =
  Animal.prototype.flag_eff_bleeding =
  false;
Animal.prototype.flag_eff_hot = false;

Animal.prototype.flag_iceSliding = false;
Animal.prototype.underwaterA = 0.0; //for fading animal under water
Animal.prototype.nickNameA = 0.0;
Animal.prototype.bleedingA = 0.0;
Animal.prototype.stunA = 0.0; //for fading animal under water
Animal.prototype.frozenEffA =
  Animal.prototype.onFireEffA =
  Animal.prototype.effA_healing =
  Animal.prototype.effA_hot =
  0.0;
Animal.prototype.effA_poison =
  Animal.prototype.effA_bleeding =
  Animal.prototype.effA_stunk =
  0.0;
Animal.prototype.effA_constricted =
  Animal.prototype.effA_slimed =
  Animal.prototype.effA_webStuck =
  0.0; //for fading animal under water

Animal.prototype.nameA = 0.0;
Animal.prototype.loadedSkinImg = null;
Animal.prototype.outlineW = null;
Animal.prototype.teamID = 0;
Animal.prototype.wins1v1 = 0;
Animal.prototype.birdNoAnimationFlyWingAngle = -0.2;
//name font size
Animal.prototype.getNameSize = function () {
  return 10.0; //Math.max(~~(.3 * this.size), 24)
};

Animal.prototype.setNick = function (a) {
  //if (this.nickName = a) {
  this.nickName = a;

  if (null == this.nickTXT) {
    this.nickTXT = new CachedText(this.getNameSize(), this.nameColor); //"#043400");
    this.nickTXT.strokeW = 1.5;
    this.nickTXT.multiLine = true;
    this.nickTXT.playername = true;

    this.nickTXT.renderScale = 5.0; //render larger to undo 'zoom of 3x'
    this.nickTXT.setText(this.nickName);
  } else {
    this.nickTXT.setFontSize(this.getNameSize());
    this.nickTXT.setText(this.nickName);
  }

  //}
};

//drawing helpers
Animal.prototype.drawEyeAtPos = function (x, y) {
  var eyeRad = 4.5;

  ctx.beginPath();
  ctx.arc(x, y, eyeRad, 0, Math.PI * 2); //white bg
  ctx.fillStyle = "black";
  //ctx.globalAlpha = 1;
  ctx.fill();

  //ctx.restore();

  ctx.beginPath();
  ctx.fillStyle = "white"; //"rgba(255,255,255,0.8)";
  var px = x - 2;
  var py = y - 1; //+ eyeRad * 0.41 * Math.sin(-this.angle + 3.29);
  ctx.arc(px, py, eyeRad * 0.22, 0, Math.PI * 2); //pupil
  //ctx.arc(x - 2, y - 1, eyeRad * 0.2, 0, Math.PI * 2); //pupil
  ctx.fill();
};
Animal.prototype.animalInfo = function () {
  var infoO = {};
  switch (this.animalType) {
    case a_snail:
      infoO.aniName = "Snail";
      infoO.aniDesc = "";
      infoO.upgradeText = "You're a super slow snail!";

      infoO.aniCol = "#fcc02b";
      infoO.skinName = "snail";
      break;
    case a_mouse:
      infoO.aniName = "Mouse";
      infoO.aniDesc = "";
      infoO.upgradeText = "";

      infoO.aniCol = "#9BA9B9";
      infoO.skinName = "mouse";
      break;
    case a_rabbit:
      infoO.aniName = "Rabbit";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to RABBIT! \nPress W to burrow a hole to hide in!";
      infoO.aniCol = "#AA937E";
      infoO.skinName = "rabbit";
      break;
    case a_pig:
      infoO.aniName = "Pig";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to PIG!\n Pigs move FAST through MUD! (Can use 'stink' on mud/ hiding holes!)";
      infoO.aniCol = "#DD6BD4";
      infoO.skinName = "pig";
      break;
    case a_fox:
      infoO.aniName = "Fox";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to FOX! ,\n You can kick players out of hiding holes! (Press W when in one!)\n+ Hide in red berry bushes!";
      infoO.aniCol = "#FF9D43";
      infoO.skinName = "fox";
      break;
    case a_deer:
      infoO.aniName = "Deer";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to DEER! \nPress W to dig up food! \nDig in mud for better food!\n Hint:Check water areas for new food sources!";
      infoO.aniCol = "#C4773E";
      infoO.skinName = "deer";
      break;
    case a_mole:
      infoO.aniName = "Mole";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to MOLE!\n Hold W to dig underground!\nGo under anything, do surprise attacks!";
      infoO.aniCol = "#4C4A45";
      infoO.skinName = "mole";
      break;
    case a_zebra:
      infoO.aniName = "Zebra";
      infoO.aniDesc = "";
      infoO.upgradeText = "UPGRADED to ZEBRA! \nPress W to kick side ways!";
      infoO.aniCol = "#FFFFFF";
      infoO.skinName = "zebra";
      break;
    case a_lion:
      infoO.aniName = "Lion";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to LION!\n Press W to release a mighty ROAR (Rawr!)!";
      infoO.aniCol = "#f8c923";
      infoO.skinName = "lion";
      break;

    //case a_cheetah:
    //    infoO.aniName = "Cheetah";
    //    infoO.aniDesc = "";
    //    infoO.upgradeText = "UPGRADED to CHEETAH!\n Press W to get a speed boost! (Every 8 seconds)!";
    //    infoO.aniCol = "#CAC05B";
    //    infoO.skinName = "cheetah";
    //    break;
    case a_bear:
      infoO.aniName = "Bear";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to BEAR!\n Bears climb through green hills! (Press W to use your claw!)";
      infoO.aniCol = "#99591C";
      infoO.skinName = "bear";
      break;
    case a_croc:
      infoO.aniName = "Croc";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to CROCODILE!\n Press W to bite and drag around animals! \n+ (Now hide in water spots)+ Swim well in Mud, Lakes & Oceans!";
      infoO.aniCol = "#30F51C";
      infoO.skinName = "croc";
      break;
    case a_hippo:
      infoO.aniName = "Hippo";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to HIPPO!\nHippos are great swimmers, dominate the Lakes/Oceans/Mud!";
      infoO.aniCol = "#945A99";
      infoO.skinName = "hippo";
      break;
    case a_rhino:
      infoO.aniName = "Rhino";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to RHINO!\n Press W to CHARGE with your mighty horn!";
      infoO.aniCol = "#94a3a9";
      infoO.skinName = "rhino";
      break;
    case a_shrimp:
      infoO.aniName = "Shrimp";
      infoO.aniDesc = "";
      infoO.upgradeText = "";
      infoO.aniCol = "#f88e37";
      infoO.skinName = "shrimp";
      break;
    case a_trout:
      infoO.aniName = "Trout";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to TROUT!\nHint: Hold Left-click to RUN! (Uses extra water)";
      infoO.aniCol = "#ac8686";
      infoO.skinName = "trout";
      break;
    case a_crab:
      infoO.aniName = "Crab";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to CRAB!\n Crabs can survive on dry land!\n (On land, Press W to go into your shell!)";
      infoO.aniCol = "#bf2408";
      infoO.skinName = "crab";
      break;
    case a_squid:
      infoO.aniName = "Squid";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to SQUID!\n Squids can use INK when injured (press W!) \n+ you can hide in plankton bushes!";
      infoO.aniCol = "#40dda4";
      infoO.skinName = "squid";
      break;
    case a_shark:
      infoO.aniName = "Shark";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to SHARK!\n A vicious predator of the oceans!";
      infoO.aniCol = "#999fc6";
      infoO.skinName = "shark";
      break;
    case a_seaHorse:
      infoO.aniName = "Sea-horse";
      infoO.aniDesc = "";
      infoO.upgradeText = "UPGRADED to SEA HORSE!\n An agile hunter!";
      infoO.aniCol = "#73BE2F";
      infoO.skinName = "seahorse";
      break;
    case a_jellyFish:
      infoO.aniName = "Jellyfish";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to JELLYFISH!\n A slowly-turning animal that can grow quite large!";
      infoO.aniCol = "#FDB9BA";
      infoO.skinName = "jellyfish";
      break;
    case a_turtle:
      infoO.aniName = "Turtle";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to TURTLE!\n Lives well on land & water! (On land, Press W to go into your shell!)";
      infoO.aniCol = "#502E1A";
      infoO.skinName = "turtle";
      break;
    case a_stingray:
      infoO.aniName = "Stringray";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to STINGRAY!\n Use electic shock (Release W key!) to shock animals! \n(Takes time to recharge)";
      infoO.aniCol = "#164336";
      infoO.skinName = "stingray";
      break;
    case a_kraken:
      infoO.aniName = "The Kraken";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to THE KRAKEN!\n Terrorize the oceans, and be feared by all!\n (Release W to use whirlpool ability!)";
      infoO.aniCol = "#64a034";
      infoO.skinName = "kraken";
      break;
    case a_pufferFish:
      infoO.aniName = "Pufferfish";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to PUFFERFISH!\n (Hold W to inflate- become spiky, and dangerous to touch!)";
      infoO.aniCol = "#6C5C2C";
      infoO.skinName = "pufferfish";
      break;
    case a_killerWhale:
      infoO.aniName = "Killer Whale";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to Killer Whale! \nWhales blow out water when diving! (And sometimes other loot!)";
      infoO.aniCol = "#141414";
      infoO.skinName = "killerwhale";
      break;
    case a_swordfish:
      infoO.aniName = "Swordfish";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n (Press W to rush with your sharp nose!)";
      infoO.aniCol = "#689CD7";
      infoO.skinName = "swordfish";
      break;
    case a_gorilla:
      infoO.aniName = "Gorilla";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Gorillas are very fast on hills/trees!\n Press W to throw bananas! (from trees)";
      infoO.aniCol = "#323232";
      infoO.skinName = "gorilla";
      break;
    case a_octopus:
      infoO.aniName = "Octopus";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to Octopus!\nHold W to use your 'Disguise' ability!\n(Hint: wait for prey to bite you- they get stunned!)";
      infoO.aniCol = "#ff8340";
      infoO.skinName = "octopus";
      break;
    case a_dragn:
      infoO.aniName = "Dragon";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n (You're amazing!) \nFly over everything, Hold W to shoot fire!";
      infoO.aniCol = "#22FF8A";
      infoO.skinName = "dragon";
      break;
    case a_blackDragon:
      infoO.aniName = "Black Dragon";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Black dragons drink lava instead of water! Black dragons only heal on healing stones/lava!";
      infoO.aniCol = "black";
      infoO.skinName = "blackdragon";
      break;

    case a_giantSpider:
      infoO.aniName = "Giant Spider";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Place web around the game to catch prey!";
      infoO.aniCol = "black";
      infoO.skinName = "giantSpider";
      break;

    case a_cobra:
      infoO.aniName = "Cobra";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Hold W to Spit venom, and poison animals with your bite!";
      infoO.aniCol = "black";
      infoO.skinName = "cobra";
      break;

    case a_boaConstrictor:
      infoO.aniName = "Boa Constrictor";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Coil and suffocate other animals!";
      infoO.aniCol = "black";
      infoO.skinName = "boaConstrictor";
      break;

    case a_trex:
      infoO.aniName = "T-REX";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        " The Dinosaur!\n This ancient dinosaur has powerful jaws that can drag prey around!!";
      infoO.aniCol = "#862A2A";
      infoO.skinName = "trex";
      break;

    case a_giraffe:
      infoO.aniName = "Giraffe";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to Giraffe!\nGiraffe have huge legs and stomp anyone in their way!";
      infoO.aniCol = "#E9BD23";
      infoO.skinName = "giraffe";
      break;

    case a_eagle:
      infoO.aniName = "Eagle";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to Eagle!\nEagles can fly up other animals in the air! !\n";
      infoO.aniCol = "#5b400d";
      infoO.skinName = "eagle";
      break;

    case a_arcticFox:
      infoO.aniName = "Arctic Fox";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n You can kick players out of hiding holes! (Press W when in one!)\n+ Hide in red berry bushes!";
      infoO.aniCol = "#CFCFCF";
      infoO.skinName = "arctic/arcticfox";
      break;
    case a_arcticHare:
      infoO.aniName = "Arctic Hare";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n \nPress W to burrow a hole to hide in!";
      infoO.aniCol = "#D5D5D5";
      infoO.skinName = "arctic/arctichare";
      break;
    case a_yeti:
      infoO.aniName = "The Yeti!";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n So it really exists... \n Hold W to turn into snow, release W to freeeeeze!";
      infoO.aniCol = "#839eb5";
      infoO.skinName = "arctic/yeti";
      break;
    case a_chipmunk:
      infoO.aniName = "Chipmunk";
      infoO.aniDesc = "";
      infoO.upgradeText = ""; //A little "+infoO.aniName+"...";
      infoO.aniCol = "#A77C30";
      infoO.skinName = "arctic/chipmunk";
      break;

    case a_muskox:
      infoO.aniName = "Muskox";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Press W to charge with your horns! \nPlus move decently on ice!";
      infoO.aniCol = "#231f18";
      infoO.skinName = "arctic/muskox";
      break;
    case a_penguin:
      infoO.aniName = "Penguin";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Left-click to run!\n (HOLD W to slide FAST on ice)!";
      infoO.aniCol = "#FFFFFF";
      infoO.skinName = "arctic/penguin";
      break;
    case a_polarBear:
      infoO.aniName = "Polar Bear";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Polar bears can climb hills! \n+ They're amazing swimmers!";
      infoO.aniCol = "#e4e4e4";
      infoO.skinName = "arctic/polarbear";
      break;
    case a_seal:
      infoO.aniName = "Seal";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Seals can slide on ice (Hold W) + can climb hills (rocks too!)";
      infoO.aniCol = "#cfcfcf";
      infoO.skinName = "arctic/seal";
      break;
    case a_snowLeopard:
      infoO.aniName = "Snow leopard";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Press W to get a speed boost! (Every 8 seconds)!";
      infoO.aniCol = "#cfcfcf";
      infoO.skinName = "arctic/snowleopard";
      break;
    case a_walrus:
      infoO.aniName = "Walrus";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n You can slide on ice (Hold W) + can climb hills (rocks too!)";
      infoO.aniCol = "#633838";
      infoO.skinName = "arctic/walrus";
      break;
    case a_reindeer:
      infoO.aniName = "Reindeer";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Press W to dig up food! \n Your sharp hooves let you turn very well on ice!";
      infoO.aniCol = "#a68976";
      infoO.skinName = "arctic/reindeer";
      break;
    case a_wolf:
      infoO.aniName = "Wolf";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Wolf paws turn very well on ice!\n Press W to howl!";
      infoO.aniCol = "#6B6B6B";
      infoO.skinName = "arctic/wolf";
      break;
    case a_wolverine:
      infoO.aniName = "Wolverine";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Press W to Let out a Powerful GROWL! (Knocks back prey!)";
      infoO.aniCol = "#843A0F";
      infoO.skinName = "arctic/wolverine";
      break;
    case a_mammoth:
      infoO.aniName = "Mammoth";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Press W to roll snowballs with your trunk!\n The bigger the snowball gets, the longer the freeze!";
      infoO.aniCol = "#9d4717";
      infoO.skinName = "arctic/mammoth";
      break;
    case a_donkey:
      infoO.aniName = "Donkey";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Press W to Kick any animal behind you";
      infoO.aniCol = "#8c7c64";
      infoO.skinName = "donkey";
      break;
    /* NEW ANIMALS */
    case a_sabertoothTiger:
      infoO.aniName = "Sabertooth Tiger";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to Sabertooth Tiger!\nSabertooth Tigers are great swimmers, dominate the Lakes/Oceans/Mud!";
      infoO.aniCol = "#945A99";
      infoO.skinName = "sabertoothtiger";
      break;
    case a_elephant:
      infoO.aniName = "Elephant";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to " +
        infoO.aniName +
        "!\n Use your long trunk to attack and eat food!";
      infoO.aniCol = "#945A99";
      infoO.skinName = "elephant";
      break;

    case a_blueWhale:
      infoO.aniName = "Blue Whale";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to Blue Whale!\n Smash with your powerful tail!";
      infoO.aniCol = "#945A99";
      infoO.skinName = "bluewhale";
      break;

    // case a_duck:
    //   infoO.aniName = "Duck";
    //   infoO.aniDesc = "";
    //   infoO.upgradeText = "UPGRADED to a DUCK!";
    //   infoO.aniCol = "#FF9000";
    //   infoO.skinName = "duck";
    //   break;
    // case a_duckling:
    //   infoO.aniName = "Duckling";
    //   infoO.aniDesc = "";
    //   infoO.upgradeText = "UPGRADED to a DUCK!";
    //   infoO.aniCol = "#FF9000";
    //   infoO.skinName = "duckling";
    //   break;

    case a_hedgehog:
      infoO.aniName = "Hedgehog";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to Hedgehog!\n (Hold W to become spiky, and dangerous to touch!)";
      infoO.aniCol = "#5b400d";
      infoO.skinName = "hedgehog";
      break;

    case a_kingCrab:
      infoO.aniName = "King Crab";
      infoO.aniDesc = "";
      infoO.upgradeText = "UPGRADED to a KING CRAB!";
      infoO.aniCol = "#971f0e";
      infoO.skinName = "kingcrab";
      break;
    case a_lemming:
      infoO.aniName = "Lemming";
      infoO.aniDesc = "";
      infoO.upgradeText = ""; //A little "+infoO.aniName+"...";
      infoO.aniCol = "#A77C30";
      infoO.skinName = "arctic/lemming";
      break;

    case a_frog:
      infoO.aniName = "Frog";
      infoO.aniDesc = "";
      infoO.upgradeText = "UPGRADED to Frog!!";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "frog/frog";

      break;

    case a_ostrich:
      infoO.aniName = "Ostrich";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to Ostrich! Lay eggs to hatch babies! \nCommand babies by placing your crosshair (right-click/W)-\n They can attack prey!";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "ostrich/ostrich";

      break;
    case a_pelican:
      infoO.aniName = "Pelican";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to Pelican! \nPick up water (and prey!) in your mouth,\nfly, and drop water on prey! (press W again)";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "pelican/pelican";

      break;
    case a_falcon:
      infoO.aniName = "Falcon";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to Falcon! \nFly, and do a powerful dive attack! Aim it well.";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "falcon/falcon";

      break;

    case a_snowyOwl:
      infoO.aniName = "Snowy Owl";
      infoO.aniDesc = "";
      infoO.upgradeText =
        "UPGRADED to Snowy Owl!\n Aim the crosshair, \n right click/W when it's on top of prey, to attack!";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "snowyowl/snowyowl";

      break;

    case a_ostrichBaby:
      infoO.aniName = "Baby Ostrich";
      infoO.aniDesc = "";
      infoO.upgradeText = "UPGRADED to Baby Ostrich!!";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "ostrich/ostrich-baby";

      break;
    case a_phoenix:
      infoO.aniName = "Phoenix";
      infoO.upgradeText =
        "UPGRADED to Phoenix!\nCreate powerful fire tornados to burn your enemies alive!";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "phoenix/phoenix";
      break;

    case a_seaMonster:
      infoO.aniName = "Sea Monster";
      infoO.upgradeText = "UPGRADED to Sea Monster!";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "seamonster";
      break;
    case a_landMonster:
      infoO.aniName = "Land Monster";
      infoO.upgradeText = "UPGRADED to Land Monster!";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "landmonster";
      break;
    case a_iceMonster:
      infoO.aniName = "Ice Monster";
      infoO.upgradeText = "UPGRADED to Ice Monster!";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "icemonster";
      break;
    case a_dinoMonster:
      infoO.aniName = "Dino Monster";
      infoO.upgradeText = "UPGRADED to Dino Monster!";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "dinomonster";
      break;
    case a_pigeon:
      infoO.aniName = "Pigeon";
      infoO.upgradeText =
        "UPGRADED to Pigeon!\nHold right click (or W) to fly!\n";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "pigeon/pigeon";
      break;
    case a_toucan:
      infoO.aniName = "Toucan";
      infoO.upgradeText =
        "UPGRADED to Toucan!\nHold right click (or W) to fly!(HINT: Start flying from a fruit tree or bush to throw fruit upon landing!)";
      infoO.aniCol = "#FF9000";
      infoO.skinName = "toucan/toucan";

      break;

    default:
      infoO.aniName = "(Animal)";
      infoO.aniDesc = "";
      infoO.aniCol = "#000000";
      infoO.upgradeText = "UPGRADED!";
  }

  return infoO;
};

// load animal skin into a var that can be used later
Animal.prototype.loadAnimalSkinImg = function () {
  //get skin name
  var skinName = this.getSkinName();

  //grab/load skin
  this.loadedSkinImg = null;
  if (skinName && !options_noImages) {
    this.loadedSkinImg = getLoadedImg("./skins/" + skinName + ".png?");
  }
};
//override GameObj method (in prototype!)
Animal.prototype.customDraw = function (batchDrawOutline) {
  var infoO = this.animalInfo(); //infoForAnimalType(this.animalType);
  var aniCol = infoO.aniCol;
  this.skinImgName = infoO.skinName;
  var tailLen = this.rad * 0.1;
  this.skinNotLoadedColor = aniCol;

  switch (this.animalType) {
    case a_pufferFish:
    case a_muskox:
    case a_swordfish:
    case a_turtle:
    case a_croc:
      tailLen = this.rad * 0.16;
      break;
  }

  this.loadAnimalSkinImg();

  ctx.save();
  ctx.rotate(this.angle);

  var rShift = 0;
  var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
  var period = 2.5;
  var rshiftAm = 0.7;
  rShift = rshiftAm * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

  //honeybee sting effect
  if (this.flag_eff_wobbling) {
    var wobble = getAnimFrame(tSinceSpawn, 1.25, 0.3, 2);
    this.rad += wobble;
  }

  //apply opacity from underwater effect
  var idealOp =
    this.flag_underWater ||
      (this.flag_usingAbility &&
        (this.animalType == a_mole ||
          this.animalType == a_octopus ||
          this.animalType == a_yeti))
      ? 0.0
      : 1.0;

  // specialy invisiblity for tiger
  if (this.flag_stealth) {
    if (this.animalType == a_seaHorse) idealOp = 0.0;
    // seahorse completely hides
    else idealOp = 0.2;
  }

  if (this.flag_flying && this.id != myPlayerID && !this.flag_isGrabbed) {
    idealOp = 0.6;
  }

  this.underwaterA += (idealOp - this.underwaterA) * 0.1;
  ctx.globalAlpha *= this.underwaterA;

  //flash when invincible
  if (this.flag_eff_invincible) {
    var period = 1.0; //periodic func with time
    var p_min = 0.3,
      p_max = 1.0;
    var amp = 0.5 * (p_max - p_min);
    ctx.globalAlpha *=
      p_min +
      amp +
      amp *
      Math.sin(
        ((2.0 * Math.PI) / period) * ((timestamp - this.spawnTime) / 1000.0)
      );
  }

  //animal under-skin outline (without stroke- optimized)
  this.outlineW = 2.0 + rShift;

  if (
    !(
      this.dead ||
      this.flag_underWater ||
      (this.animalType == a_mole && this.flag_usingAbility)
    )
  )
    if (gameMode == gameMode_teamMode && this.teamID != 0) {
      var teamColor = _gameMode.teamColors[this.teamID];
      /*
    if (this.teamID == 1) teamColor = "#ff0000";
    else if (this.teamID == 2) teamColor = "#00ff00";
    else if (this.teamID == 3) teamColor = "#0000ff";
    */
      ctx.save();
      ctx.globalAlpha = idealOp;
      drawCircle(0, 0, this.rad + 2, teamColor);
      ctx.restore();
    }
  var outlineCol = this.getOutlineColor();
  if (
    !(
      this.flag_flying ||
      (options_lowGraphics &&
        !(outlineCol == col_edibleOutline || outlineCol == col_dangerOutline))
    )
  ) {
    //dont draw plain outlines!

    drawCircle(0, 0, this.rad, outlineCol);
    //if(outlineCol==col_dangerOutline)
  } else this.outlineW = 0;

  //draw tail
  if (
    this.animalType != a_rabbit &&
    this.animalType != a_mouse &&
    this.animalType != a_crab
  ) {
    var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
    var period = 5.0;
    var shiftAm = 4.0;
    var tailAShift =
      shiftAm * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

    var oWidSc = this.outlineW * 2.5; //scale with rad
    var tailW = 25.0; //angle width
    //tailLen = this.rad * 0.08; //angle width
    var pF = Math.PI / 180.0;

    //tail background (stroke)
    if (this.flag_tailBitten) {
      ctx.fillStyle = col_dangerOutline;
    } else {
      var _thisAniType = this.animalType;

      if (tailBiteAniTypes[_thisAniType - 1] > 0 && this.id != myPlayerID) {
        ctx.fillStyle = col_edibleOutline; //edible
      } else {
        ctx.fillStyle = outlineCol;
      }
    }

    if (
      !(options_lowGraphics && ctx.fillStyle != col_outline_land) &&
      !this.flag_flying
    ) {
      //no plain tails
      ctx.beginPath();
      ctx.moveTo(
        (this.rad - this.outlineW + 1) *
        Math.cos((270 + tailW / 2.0 + oWidSc) * pF),
        (this.rad - this.outlineW + 1) * Math.sin((270 + tailW / 2.0) * pF)
      ); //bottom of tail
      ctx.lineTo(
        (this.rad - this.outlineW + 1) *
        Math.cos((270 - tailW / 2.0 - oWidSc) * pF),
        (this.rad - this.outlineW + 1) * Math.sin((270 - tailW / 2.0) * pF)
      ); //bottom of tail
      ctx.lineTo(
        (this.rad + tailLen + this.outlineW) *
        Math.cos((270 + tailAShift) * pF),
        (this.rad + tailLen + this.outlineW) * Math.sin((270 + tailAShift) * pF)
      ); //point
      ctx.lineTo(
        (this.rad - this.outlineW + 1) *
        Math.cos((270 + tailW / 2.0 + oWidSc) * pF),
        (this.rad - this.outlineW + 1) * Math.sin((270 + tailW / 2.0) * pF)
      ); //connect to start
      ctx.fill();
    }

    //tail inner drawing
    if (!options_lowGraphics) {
      if (!this.loadedSkinImg || this.flag_tailBitten) {
        ctx.fillStyle = this.flag_tailBitten ? col_dangerOutline : aniCol; //tail color
        ctx.beginPath();
        ctx.moveTo(
          (this.rad - this.outlineW) * Math.cos((270 + tailW / 2.0) * pF),
          (this.rad - this.outlineW) * Math.sin((270 + tailW / 2.0) * pF)
        ); //bottom of tail
        ctx.lineTo(
          (this.rad - this.outlineW) * Math.cos((270 - tailW / 2.0) * pF),
          (this.rad - this.outlineW) * Math.sin((270 - tailW / 2.0) * pF)
        ); //bottom of tail
        ctx.lineTo(
          (this.rad + tailLen) * Math.cos((270 + tailAShift) * pF),
          (this.rad + tailLen) * Math.sin((270 + tailAShift) * pF)
        ); //point
        ctx.lineTo(
          (this.rad - this.outlineW) * Math.cos((270 + tailW / 2.0) * pF),
          (this.rad - this.outlineW) * Math.sin((270 + tailW / 2.0) * pF)
        ); //connect to start
        ctx.fill();
      }
    }
  }

  this.drawUnderSkinImgOutline();
  this.drawUnderSkinImg();
  this.drawSkinImg();
  this.drawOnTopOfSkinImg();

  ctx.restore(); //done rotate/ opacity

  this.drawTopEffects();

  //low water drop
  if (this.flag_lowWat) {
    var period = 1.2; //periodic func with time
    var p_min = 0.2,
      p_max = 0.8; //set these!
    var amp = 0.5 * (p_max - p_min);
    var flashA =
      p_min +
      amp +
      amp * Math.sin(((2.0 * Math.PI) / period) * (timestamp / 1000.0));

    ctx.save();
    ctx.globalAlpha = flashA;
    ctx.fillStyle =
      this.animalType == a_blackDragon || this.animalType == a_phoenix
        ? col_lava
        : col_wat1;

    ctx.beginPath();
    //sweat bottom
    ctx.arc(0, this.rad + 5, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  //player name text
  this.drawNickName(idealOp);

  this.drawCustomUIForAni();
  //ctx.restore();
};

Animal.prototype.drawCustomUIForAni = function () {
  if (gameMode == gameMode_teamMode && _gameMode) _gameMode.drawPlayerUI(this);
};

Animal.prototype.hasMultipleSpecies = function () {
  return false;
};

//first draw
Animal.prototype.drawNickName = function (idealOp) {
  var nameOpIdeal = idealOp;
  this.nickNameA += (nameOpIdeal - this.nickNameA) * 0.1;

  if (this.nickName && this.nickTXT && !options_noNames) {
    ctx.save();
    //player name text- without caching
    //ctx.lineWidth = 1;
    /*ictx.textAlign = "center";
                ctx.textBaseline = "middle"; //vertical center
                if (!options_lowGraphics) {
                    ctx.shadowOffsetX = 1;
                    ctx.shadowOffsetY = 1;
                    ctx.shadowColor = "black"
                }
                ctx.fillStyle = "white"
        */

    if (this.dead) ctx.globalAlpha *= 1 - this.moveUpdF;
    else ctx.globalAlpha = 1;
    ctx.globalAlpha *= this.nickNameA; //name alpha

    //draw cached name
    this.nickTXT.x = 0;
    this.nickTXT.y = this.rad + 9;
    this.nickTXT.draw();

    ctx.restore();
  }
};

//first draw
Animal.prototype.drawUnderSkinImgOutline = function () {
  //underwater bubbles/ effects

  if (
    this.flag_underWater ||
    (this.flag_usingAbility && this.animalType == a_mole)
  ) {
    ctx.save();
    ctx.globalAlpha = 1.0 - this.underwaterA; //bubbles appear as animal fades

    this.drawWhenUnderwater();
    ctx.restore();
  }

  if (this.flag_eff_stunk) {
    ctx.save();
    var period = 1.0; //periodic func with time
    var p_min = 0.3,
      p_max = 1.0;
    var amp = 0.5 * (p_max - p_min);
    var a =
      p_min +
      amp +
      amp *
      Math.sin(
        ((2.0 * Math.PI) / period) * ((timestamp - this.spawnTime) / 1000.0)
      );

    ctx.globalAlpha *= a;
    var effectRad = 2.6;
    drawCircle(0, 0, this.rad + effectRad * a, "brown");

    ctx.restore();
  }

  //ice sliding effect
  if (this.flag_iceSliding) {
    //var fac0to1 = (timestamp - this.spawnTime) % 1000.0/1000.0;
    var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;

    var period = 0.75;
    var shiftAm = 1.0;
    var moveA = shiftAm * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

    /*var waveMoveTms=1.0*1000; //ms to one full movement
        var fac0to1 = (timestamp - this.spawnTime) % waveMoveTms /waveMoveTms;
        var waveX= x + dist * (fac0to1);*/

    var theA = ctx.globalAlpha;
    ctx.globalAlpha *= 0.8 - 0.2 * moveA;
    drawCircle(0, this.rad * 0.3, this.rad * (0.9 + 0.15 * moveA), "#7BB7BB");
    drawCircle(0, -this.rad * 0.3, this.rad * (1.05 + 0.1 * moveA), "#7BB7BB");
    //console.log("drawing ice slide");
    ctx.globalAlpha = theA;
  }

  if (
    this.flag_usingAbility &&
    (this.animalType == a_deer ||
      /*this.animalType == a_zebra || */ this.animalType == a_reindeer)
  ) {
    //console.log("dig");
    //digging ability (bg circle)
    var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;

    var period = 1.5;
    var shiftAm = 1.0;
    var moveA = shiftAm * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

    var theA = ctx.globalAlpha;
    ctx.globalAlpha *= 0.8; //- 0.2 * moveA;
    drawCircle(0, this.rad * 0.3, this.rad * (0.9 + 0.12 * moveA), "#7F582B");
    drawCircle(0, -this.rad * 0.3, this.rad * (1.05 + 0.09 * moveA), "#7F582B");
    ctx.globalAlpha = theA;
  }
  //frozen effect (extra white outline!)
  var idealOp = this.flag_eff_frozen || this.flag_cold ? 1.0 : 0.0;
  this.frozenEffA += (idealOp - this.frozenEffA) * 0.1;

  if (this.frozenEffA > 0.01) {
    var theA = ctx.globalAlpha;
    ctx.globalAlpha *= this.frozenEffA;
    var effectRad = 1.6;
    drawCircle(0, 0, this.rad + effectRad * this.frozenEffA, "white");

    ctx.globalAlpha = theA; //reset Alpha
  }

  //healing purple outline 'glow'
  var idealOp = this.flag_eff_healing ? 1.0 : 0.0;
  this.effA_healing += (idealOp - this.effA_healing) * 0.1;
  if (this.effA_healing > 0.01) {
    ctx.save();
    ctx.globalAlpha *= this.effA_healing;
    var effectRad = 2.6;
    drawCircle(0, 0, this.rad + effectRad * this.effA_healing, "purple");

    ctx.restore();
  }

  var idealOp = this.flag_eff_hot ? 1.0 : 0.0;
  this.effA_hot += (idealOp - this.effA_hot) * 0.1;
  if (this.effA_hot > 0.01) {
    ctx.save();
    //effect also flashes
    var period = 1.2; //periodic func with time
    var p_min = 0.3,
      p_max = 1.0;
    var amp = 0.5 * (p_max - p_min);
    ctx.globalAlpha *=
      p_min +
      amp +
      amp *
      Math.sin(
        ((2.0 * Math.PI) / period) * ((timestamp - this.spawnTime) / 1000.0)
      );

    var effectRad = 2.6;
    drawCircle(
      0,
      0,
      this.rad + effectRad * this.effA_hot,
      "rgba(249, 212, 77, 0.5)"
    );

    ctx.restore();
  }
  //POISON outline 'glow'
  var idealOp = this.flag_eff_poison ? 1.0 : 0.0;
  this.effA_poison += (idealOp - this.effA_poison) * 0.1;
  if (this.effA_poison > 0.01) {
    ctx.save();

    //effect also flashes
    var period = 1.2; //periodic func with time
    var p_min = 0.3,
      p_max = 1.0;
    var amp = 0.5 * (p_max - p_min);
    ctx.globalAlpha *=
      p_min +
      amp +
      amp *
      Math.sin(
        ((2.0 * Math.PI) / period) * ((timestamp - this.spawnTime) / 1000.0)
      );

    ctx.globalAlpha *= this.effA_poison;
    var effectRad = 2.6;
    drawCircle(0, 0, this.rad + effectRad * this.effA_poison, "#7FF600");

    ctx.restore();
  }

  //BLEEDING outline 'glow'

  var idealOp = this.flag_eff_bleeding || this.flag_eff_wobbling ? 1.0 : 0.0;
  this.effA_bleeding += (idealOp - this.effA_bleeding) * 0.1;
  if (this.effA_bleeding > 0.01) {
    ctx.save();

    //effect also flashes
    var period = 1.2; //periodic func with time
    var p_min = 0.3,
      p_max = 1.0;
    var amp = 0.5 * (p_max - p_min);
    ctx.globalAlpha *=
      p_min +
      amp +
      amp *
      Math.sin(
        ((2.0 * Math.PI) / period) * ((timestamp - this.spawnTime) / 1000.0)
      );

    ctx.globalAlpha *= this.effA_bleeding;
    var effectRad = 2.6;
    var color = this.flag_eff_wobbling ? "brown" : "red";
    drawCircle(0, 0, this.rad + effectRad * this.effA_bleeding, color);

    ctx.restore();
  }

  var idealOp = this.flag_eff_slimed ? 1.0 : 0.0;
  this.effA_slimed += (idealOp - this.effA_slimed) * 0.1;
  if (this.effA_slimed > 0.01) {
    ctx.save();

    //effect also flashes
    var period = 1.2; //periodic func with time
    var p_min = 0.3,
      p_max = 1.0;
    var amp = 0.5 * (p_max - p_min);
    ctx.globalAlpha *=
      p_min +
      amp +
      amp *
      Math.sin(
        ((2.0 * Math.PI) / period) * ((timestamp - this.spawnTime) / 1000.0)
      );

    ctx.globalAlpha *= this.effA_slimed;
    var effectRad = 2.6;
    drawCircle(0, 0, this.rad + effectRad * this.effA_slimed, "grey");

    ctx.restore();
  }
};

Animal.prototype.drawUnderSkinImg = function () { };

//draws when underwater! (eg. draw shark fin)
Animal.prototype.drawWhenUnderwater = function () {
  var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
  var period = 1.5;
  var shiftAm = 1.0;
  var moveA = shiftAm * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

  //if(this.animalType!=a_shark){
  //var oldA=ctx.globalAlpha;
  //ctx.globalAlpha *= 0.5;

  if (this.animalType == a_croc) ctx.globalAlpha *= 0.3;
  var diveColor = this.flag_underWater ? "#4E71C3" : "#7E6A35";

  if (this.animalType == a_phoenix) diveColor = "#f9d43b";

  ctx.fillStyle = diveColor;
  var bubRad = this.flag_underWater ? this.rad * 0.15 : this.rad * 0.1;
  ctx.beginPath(); //top left, right
  ctx.arc(
    this.rad * -0.35,
    this.rad * -0.33,
    Math.max(0, bubRad + moveA),
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.beginPath();
  ctx.arc(
    this.rad * 0.35,
    this.rad * -0.32,
    Math.max(0, bubRad - moveA),
    0,
    Math.PI * 2
  );
  ctx.fill();

  ctx.beginPath(); //bottom 2
  ctx.arc(
    this.rad * 0.35,
    this.rad * 0.36,
    Math.max(0, bubRad + moveA),
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.beginPath();
  ctx.arc(
    this.rad * -0.35,
    this.rad * 0.35,
    Math.max(0, bubRad - moveA),
    0,
    Math.PI * 2
  );
  ctx.fill();
  //}

  //shark fin

  if (this.animalType == a_shark) {
    ctx.globalAlpha = 1.0 - this.underwaterA;
    ctx.fillStyle = "#73799b";

    ctx.beginPath();
    //var px = this.rad * -0.008; //middle of horn circle
    var rad = this.rad;
    var py = rad * 0.25; //0.68; //692;
    ctx.moveTo(rad * -0.07, py); //bottom L
    //if()
    ctx.lineTo(0, py - rad * 0.5); //peak of horn (up)
    //ctx.lineTo(px - rad * 0.5, py - 12); //curve point in horn
    ctx.lineTo(rad * 0.35, py); //bottom right
    ctx.closePath();
    ctx.fill();
  } else if (this.animalType == a_killerWhale) {
    //blowhole
    drawCircle(0, this.rad * 0.2, this.rad * 0.12, "#4D4D4D");
  } else if (this.animalType == a_blueWhale) {
    //blowhole
    drawCircle(0, this.rad * 0.45, this.rad * 0.08, "#202A65");
  } else if (this.animalType == a_kingCrab) {
    var frame = getAnimFrame(tSinceSpawn, 1, 1, 1);

    ctx.save();

    ctx.rotate(toRadians(40));
    ctx.scale(1, 2); //B32E10
    ctx.globalAlpha = 0.08;
    drawCircle(
      this.rad * 1,
      this.rad * 0.2,
      this.rad * 0.1 + this.rad * 0.1 * frame,
      "#B32E10"
    );
    ctx.globalAlpha = 0.2;
    drawCircle(this.rad * 1, this.rad * 0.2, this.rad * 0.15, "#B32E10");

    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 1;
    ctx.rotate(toRadians(-40));
    ctx.scale(1, 2);
    ctx.globalAlpha = 0.08;
    drawCircle(
      this.rad * -1,
      this.rad * 0.2,
      this.rad * 0.1 + this.rad * 0.1 * -frame,
      "#B32E10"
    );
    ctx.globalAlpha = 0.2;
    drawCircle(this.rad * -1, this.rad * 0.2, this.rad * 0.15, "#B32E10");
    ctx.restore();
  } else if (this.animalType == a_kraken) {
    ctx.globalAlpha = 1.0 - this.underwaterA;
    drawCircle(this.rad * 0.4, this.rad * 0.75, this.rad * 0.12, "#598b30");
    drawCircle(this.rad * 0.65, this.rad * 0.55, this.rad * 0.1, "#64a034");
    drawCircle(this.rad * -0.4, this.rad * 0.75, this.rad * 0.12, "#64a034");
    drawCircle(this.rad * -0.65, this.rad * 0.55, this.rad * 0.1, "#598b30");
  } else if (this.animalType == a_trex) {
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.scale(1, 2);
    drawCircle(0, this.rad * 0.24, this.rad * 0.08, "#202A65");
    drawCircle(0, this.rad * -0.02, this.rad * 0.06, "#202A65");
    drawCircle(0, this.rad * -0.28, this.rad * 0.05, "#202A65");
    drawCircle(0, this.rad * -0.54, this.rad * 0.04, "#202A65");
    ctx.restore();
  }
};

Animal.prototype.skinRad = 0;
Animal.prototype.skinScale = 0;

//just draw the circle, aside from all kinds of specific effects
Animal.prototype.basicDrawSkinImg = function () {
  var iScale = 500 / 340.0; //scale up ps image to fit (to remove blank space)
  var rad = this.rad - this.outlineW;
  this.skinRad = rad;
  this.skinScale = iScale;
  if (this.loadedSkinImg) {
    if (this.animalType == a_trex || this._animalType == a_trex) {
      overSizeOffset = rad / 2;
      ctx.drawImage(
        this.loadedSkinImg,
        -rad - overSizeOffset,
        -rad - overSizeOffset,
        2 * rad * iScale,
        2 * rad * (iScale * 1.2)
      );
    } else {
      ctx.drawImage(
        this.loadedSkinImg,
        -rad * iScale,
        -rad * iScale,
        2 * rad * iScale,
        2 * rad * iScale
      );
    }
  }
  //not loaded yet- draw plain color circle
  else {
    //drawCircle(0,0,this.rad, col);
    ctx.fillStyle = this.skinNotLoadedColor;
    //var oldA=ctx.alpha;
    //ctx.alpha*=0.5;

    ctx.beginPath();
    ctx.arc(0, 0, Math.max(0, this.rad - this.outlineW), 0, Math.PI * 2);
    ctx.fill();

    //ctx.alpha=oldA; //draw faded color
  }
};

//draw image for the animal skin (along with extra images on it, eg wings)
Animal.prototype.drawSkinImg = function () {
  var rad = this.rad - this.outlineW;

  this.basicDrawSkinImg(); //just draw the image

  // custom animations or skin overlays
  this.drawSkinCustomization();
};

Animal.prototype.drawSkinCustomization = function () { };

Animal.prototype.drawOnTopOfSkinImg = function () {
  //image-free drawing
  if (!this.loadedSkinImg) {
    //animal eyes

    ctx.save();
    var eyeS = Math.max(1.0, this.rad / 25.0); //make eyes bigger for bigger animals
    ctx.scale(eyeS, eyeS);
    this.drawEyeAtPos(6.0, this.rad * 0.32);
    this.drawEyeAtPos(-6.0, this.rad * 0.32);
    ctx.restore();
  }

  //skin enchancements
  if (this.animalType == a_rhino) {
    ctx.fillStyle = "#E5CF79";

    ctx.beginPath();
    //var px = this.rad * -0.008; //middle of horn circle
    var rad = this.rad - this.outlineW;
    var py = rad * 1.0; //0.68; //692;
    ctx.moveTo(rad * -0.16, py); //bottom L
    //if()

    ctx.lineTo(0, rad * (this.flag_usingAbility ? 1.41 : 0.7)); //peak of horn (up)
    //ctx.lineTo(px - rad * 0.5, py - 12); //curve point in horn
    ctx.lineTo(rad * 0.153, py); //bottom right
    ctx.closePath();
    ctx.fill();
  }

  //yeti transform
  if (this.flag_usingAbility && this.animalType == a_yeti) {
    ctx.save();
    ctx.globalAlpha = 1.0 - this.underwaterA;

    var theImg = getLoadedImg("img/snowball.png");
    if (theImg) {
      var rad = this.rad;
      ctx.rotate(this.rPer * Math.PI * 2.0);
      ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);
      //console.log("drawing banana");
    } else this.drawOutlinedCircle("", "white"); //disguise as snowball

    ctx.restore();
  }
};

//top layer, NOT ROTATED
Animal.prototype.drawTopEffects = function () {
  //stun effect
  var idealOp = this.flag_eff_stunned ? 1.0 : 0.0;
  this.stunA += (idealOp - this.stunA) * 0.1;
  if (this.stunA > 0.01) {
    ctx.save();
    var spinPer = 2.5; //spin around every X s
    var spinRot = (timestamp % (spinPer * 1000.0)) / (spinPer * 1000.0); //gets number from 0-1
    ctx.rotate(spinRot * (2 * Math.PI));

    ctx.globalAlpha *= this.stunA; //bubbles appear as animal fades

    var bubRad = this.rad * 0.2;

    var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
    var period = 1.0;
    var shiftAm = 0.5 + bubRad * 0.07;
    var moveA = shiftAm * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

    ctx.fillStyle = "#F3D444";
    ctx.beginPath(); //top left, right
    ctx.arc(
      this.rad * -0.22,
      this.rad * -0.22,
      Math.max(0, bubRad + moveA),
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.beginPath();
    ctx.arc(
      this.rad * 0.22,
      this.rad * -0.22,
      Math.max(0, bubRad - moveA),
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.beginPath(); //bottom 2
    ctx.arc(
      this.rad * 0.22,
      this.rad * 0.22,
      Math.max(0, bubRad + moveA),
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.beginPath();
    ctx.arc(
      this.rad * -0.22,
      this.rad * 0.22,
      Math.max(0, bubRad - moveA),
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
  }

  //on fire glow

  var idealOp = this.flag_eff_onFire ? 1.0 : 0.0;
  this.onFireEffA += (idealOp - this.onFireEffA) * 0.1;
  if (this.onFireEffA > 0.01) {
    //glow stronger/weaker like a fire
    var period = 1.0; //periodic func with time
    var p_min = 0.15,
      p_max = 0.4; //set these!
    var amp = 0.5 * (p_max - p_min);
    var flashA =
      p_min +
      amp +
      amp * Math.sin(((2.0 * Math.PI) / period) * (timestamp / 1000.0));

    ctx.save();
    ctx.globalAlpha *= flashA * this.onFireEffA;
    drawCircle(0, 0, Math.max(0, this.rad), "orange");
    ctx.restore();

    if (!options_lowGraphics) {
      //glow stronger/weaker like a fire
      var period = 1.0; //periodic func with time
      var p_min = 0.5,
        p_max = 1.0; //set these!
      var amp = 0.5 * (p_max - p_min);
      var moveA =
        p_min +
        amp +
        amp * Math.sin(((2.0 * Math.PI) / period) * (timestamp / 1000.0));

      var imNum = Math.trunc(timestamp / 100) % 5;
      var imNum2 = Math.trunc(timestamp / 150) % 5;
      //var theImg = getLoadedImg(imNum == 1 ? "img/fire.png" : "img/fire2.png");
      var theImg = getLoadedImg("img/fire/" + imNum + ".png");
      var theImg2 = getLoadedImg("img/fire/" + imNum2 + ".png");

      //var imNum = Math.trunc(timestamp / 300) % 2;

      //var theImg = getLoadedImg(imNum == 1 ? "img/fire.png" : "img/fire2.png");
      //var theImg2 = getLoadedImg(imNum == 0 ? "img/fire.png" : "img/fire2.png");
      if (theImg || theImg2) {
        var imX = 0 - this.rad * 0.3,
          imY = this.rad * 0.2 - this.rad * 0.3;
        var imW = (this.rad * 1.0 * (2.0 + moveA * 2.0)) / 3.0,
          imH = this.rad * 1.0 * moveA;
        var imAnchorX = 0.5,
          imAnchorY = 0.95; //top-left= 0,0, bottom-right=1,1 (canvas coords)

        ctx.save();
        if (theImg) {
          ctx.globalAlpha *= this.onFireEffA * moveA;
          ctx.drawImage(
            theImg,
            imX + imW * -imAnchorX,
            imY + imH * -imAnchorY,
            imW,
            imH
          );
        }
        if (theImg2) {
          ctx.globalAlpha *= this.onFireEffA * moveA;
          ctx.drawImage(
            theImg2,
            imX + this.rad * 0.5 + imW * -imAnchorX,
            imY + this.rad * 0.5 + imH * -imAnchorY,
            imW,
            imH
          );
        }
        ctx.restore();
      }
    } else {
      var period = 1.0; //periodic func with time
      var p_min = 0.5,
        p_max = 1.0; //set these!
      var amp = 0.5 * (p_max - p_min);
      var moveA =
        p_min +
        amp +
        amp * Math.sin(((2.0 * Math.PI) / period) * (timestamp / 1000.0));

      var theImg = getLoadedImg("img/fire/0.png");
      if (theImg) {
        var imX = 0 - this.rad * 0.3,
          imY = this.rad * 0.2 - this.rad * 0.3;
        var imW = (this.rad * 1.0 * (2.0 + moveA * 2.0)) / 3.0,
          imH = this.rad * 1.0 * moveA;
        var imAnchorX = 0.5,
          imAnchorY = 0.95; //top-left= 0,0, bottom-right=1,1 (canvas coords)

        ctx.save();

        ctx.globalAlpha *= this.onFireEffA * moveA;
        ctx.drawImage(
          theImg,
          imX + imW * -imAnchorX,
          imY + imH * -imAnchorY,
          imW,
          imH
        );

        ctx.globalAlpha *= this.onFireEffA * moveA;
        ctx.drawImage(
          theImg,
          imX + this.rad * 0.5 + imW * -imAnchorX,
          imY + this.rad * 0.5 + imH * -imAnchorY,
          imW,
          imH
        );

        ctx.restore();
      }
    }
  }

  /// alkdjflkdjfsd

  //frozen effect 2 (circles)
  if (this.frozenEffA > 0.01 && this.flag_eff_frozen) {
    ctx.save();
    var spinPer = 7.0; //spin around every X s
    var spinRot = (timestamp % (spinPer * 1000.0)) / (spinPer * 1000.0); //gets number from 0-1
    ctx.rotate(spinRot * (2 * Math.PI));

    ctx.globalAlpha *= this.frozenEffA; //bubbles appear as animal fades

    var bubRad = this.rad * 0.2;
    var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
    var period = 1.0;
    var shiftAm = 0.5 + bubRad * 0.07;
    var moveA = shiftAm * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

    ctx.fillStyle = "white";
    var bubSpread = this.rad * 0.27; //spread in a square
    ctx.beginPath(); //top left, right
    ctx.arc(
      -bubSpread,
      -bubSpread,
      Math.max(0, bubRad + moveA),
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.beginPath();
    ctx.arc(bubSpread, -bubSpread, Math.max(0, bubRad - moveA), 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath(); //bottom 2
    ctx.arc(bubSpread, bubSpread, Math.max(0, bubRad + moveA), 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-bubSpread, bubSpread, Math.max(0, bubRad - moveA), 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  //draw skin

  //frozen white glow
  if (this.frozenEffA > 0.01) {
    ctx.save();
    var effectN = 0.3;
    ctx.globalAlpha *= effectN * this.frozenEffA;

    drawCircle(0, 0, Math.max(0, this.rad - this.outlineW), "white");
    ctx.restore();
  }

  //healing effect purple 'glow'
  if (this.effA_healing > 0.01) {
    ctx.save();
    var effectN = 0.3;
    ctx.globalAlpha *= effectN * this.effA_healing;

    drawCircle(0, 0, Math.max(0, this.rad - this.outlineW), "#ef24ed");
    ctx.restore();
  }

  //healing effect purple 'glow'
  if (this.effA_hot > 0.01) {
    ctx.save();
    var effectN = 0.3;
    //effect also flashes
    var period = 1.2; //periodic func with time
    var p_min = 0.3,
      p_max = 1.0;
    var amp = 0.5 * (p_max - p_min);
    ctx.globalAlpha *=
      p_min +
      amp +
      amp *
      Math.sin(
        ((2.0 * Math.PI) / period) * ((timestamp - this.spawnTime) / 1000.0)
      );

    drawCircle(
      0,
      0,
      Math.max(0, this.rad - this.outlineW),
      "rgba(249, 212, 77, 0.3)"
    );
    ctx.restore();
  }
  //POISON green 'glow'
  if (this.effA_poison > 0.01) {
    ctx.save();
    var effectN = 0.3;
    ctx.globalAlpha *= effectN * this.effA_poison;

    //effect also flashes
    var period = 1.2; //periodic func with time
    var p_min = 0.3,
      p_max = 1.0;
    var amp = 0.5 * (p_max - p_min);
    ctx.globalAlpha *=
      p_min +
      amp +
      amp *
      Math.sin(
        ((2.0 * Math.PI) / period) * ((timestamp - this.spawnTime) / 1000.0)
      );

    drawCircle(0, 0, Math.max(0, this.rad - this.outlineW), "#9FDA00");
    ctx.restore();
  }

  var idealOp = this.flag_eff_bleeding ? 0.8 : 0.0;
  this.effA_bleeding += (idealOp - this.effA_bleeding) * 0.1;
  if (this.effA_bleeding > 0.01) {
    ctx.save();

    //effect also flashes
    var period = 1.2; //periodic func with time
    var p_min = 0.3,
      p_max = 1.0;
    var amp = 0.3 * (p_max - p_min);
    ctx.globalAlpha *=
      p_min +
      amp +
      amp *
      Math.sin(
        ((2.0 * Math.PI) / period) * ((timestamp - this.spawnTime) / 1000.0)
      );

    ctx.globalAlpha *= this.effA_bleeding;
    var effectRad = -2.6;
    drawCircle(0, 0, this.rad + effectRad * this.effA_bleeding, "red");

    ctx.restore();
  }

  var idealOp = this.flag_eff_slimed ? 0.8 : 0.0;
  this.effA_slimed += (idealOp - this.effA_slimed) * 0.1;
  if (this.effA_slimed > 0.01) {
    ctx.save();

    //effect also flashes
    var period = 1.2; //periodic func with time
    var p_min = 0.3,
      p_max = 1.0;
    var amp = 0.3 * (p_max - p_min);
    ctx.globalAlpha *=
      p_min +
      amp +
      amp *
      Math.sin(
        ((2.0 * Math.PI) / period) * ((timestamp - this.spawnTime) / 1000.0)
      );

    ctx.globalAlpha *= this.effA_slimed;
    var effectRad = -2.6;
    drawCircle(0, 0, this.rad + effectRad * this.effA_slimed, "grey");

    ctx.restore();
  }

  var idealOp = this.flag_eff_stunk ? 0.8 : 0.0;
  this.effA_stunk += (idealOp - this.effA_stunk) * 0.1;
  if (this.effA_stunk > 0.01) {
    ctx.save();

    //effect also flashes
    var period = 1.2; //periodic func with time
    var p_min = 0.3,
      p_max = 1.0;
    var amp = 0.3 * (p_max - p_min);
    ctx.globalAlpha *=
      p_min +
      amp +
      amp *
      Math.sin(
        ((2.0 * Math.PI) / period) * ((timestamp - this.spawnTime) / 1000.0)
      );

    ctx.globalAlpha *= this.effA_stunk;
    var effectRad = -2.6;
    drawCircle(0, 0, this.rad + effectRad * this.effA_stunk, "brown");

    ctx.restore();
  }

  //ice sliding effect
  if (this.animalType == a_giantSpider && this.flag_usingAbility) {
    //var fac0to1 = (timestamp - this.spawnTime) % 1000.0/1000.0;
    var period = 0.75;
    var shiftAm = 1.0;
    var moveA = shiftAm * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

    /*var waveMoveTms=1.0*1000; //ms to one full movement
        var fac0to1 = (timestamp - this.spawnTime) % waveMoveTms /waveMoveTms;
        var waveX= x + dist * (fac0to1);*/

    var theA = ctx.globalAlpha;
    ctx.globalAlpha *= 0.8 - 0.2 * moveA;
    drawCircle(
      this.rad * 0.15,
      -this.rad * 1.27,
      this.rad * (0.1 + 0.05 * moveA),
      "#efefef"
    );
    drawCircle(
      -this.rad * 0.15,
      -this.rad * 1.27,
      this.rad * (0.1 - 0.05 * moveA),
      "#efefef"
    );
    //drawCircle(0, -this.rad * 0.3, this.rad * (1.05 + 0.1 * moveA), "#7BB7BB");
    ctx.globalAlpha = theA;
  }

  //web stuck
  var idealOp = this.flag_webStuck ? 1.0 : 0.0;
  this.effA_webStuck += (idealOp - this.effA_webStuck) * 0.02;

  if (this.effA_webStuck > 0.01) {
    ctx.save();
    var effectN = 0.9;
    ctx.globalAlpha *= effectN * this.effA_webStuck;

    var theImg = getLoadedImg("img/spiderWeb_stuck.png");
    if (theImg) {
      var rad = this.rad * 1.3;
      //ctx.rotate(-this.angle); //undo rotation
      ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);
      //console.log("drawing banana");
    }
    ctx.restore();
  }

  //constrict
  var idealOp = this.flag_constricted ? 1.0 : 0.0;
  this.effA_constricted += (idealOp - this.effA_constricted) * 0.04;

  if (this.effA_constricted > 0.01) {
    ctx.save();
    var effectN = 0.9;
    ctx.globalAlpha *= effectN * this.effA_constricted;

    var skinFolder = "img";

    var theImg = getLoadedImg(skinFolder + "/constrict.png");
    if (theImg) {
      var rad = this.rad * 1.3;
      ctx.rotate(-this.angle); //undo rotation
      ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);
      //console.log("drawing banana");
    }
    ctx.restore();
  }
};

//returns the name of the main skin img to draw
Animal.prototype.getSkinName = function () {
  var skinName = this.skinImgName;
  switch (this.animalType) {
    // add a 2 for using ability
    case a_pufferFish:
    case a_muskox:
    case a_swordfish:
    case a_turtle:
    case a_crab:
    case a_snail:
    case a_cobra:
    case a_boaConstrictor:
    case a_hedgehog:
      var skinFolder = "";

      if (this.flag_usingAbility) skinName = skinFolder + skinName + "2";
      break;
    /*
          case a_pelican:
            skinName = skinName + (this.specType == 0 ? "" : this.specType);
            break;
          case a_eagle:
            skinName = skinName + (this.specType == 0 ? "" : this.specType);
            break;

          case a_frog:
            if (this.flag_usingAbility && !this.flag_underWater)
              skinName = skinName + "2";
            break;

          case a_ostrich:
            if (this.specType == 1)
              skinName = "baby_ostrich";
            break; */
    case a_tiger:
      this.z = this.z * 2; // above hill but under the trees
      if (this.flag_usingAbility && this.specType == 4)
        skinName = skinName + "2";
      break;
  }

  if (this.flag_flying && !this.flag_isGrabbed) {
    if (this.animalType == a_duck || this.animalType == a_blackDragon)
      skinName = "flying_" + skinName;
  }

  return skinName;
};

Animal.prototype.setObjTypes = function (oType, secondaryType) {
  this.oType = oType;
  this.animalType = secondaryType; //secondaryType can be different for eg.
};

//override this to read in custom spawn data
Animal.prototype.readCustomData_onNewlyVisible = function (msg) {
  Animal.superClass.prototype.readCustomData_onNewlyVisible.call(this, msg);

  //read custom data here!
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  //var animtype = msg.readUInt8();
  var nickName = msg.readString();

  // read which speices is this animal
  this.animalSpecies = msg.readUInt8();

  const nameColor = msg.readUInt8();

  switch (nameColor) {
    case 1:
      this.nameColor = "#FFFFFF";
      break;
    case 2:
      this.nameColor = "gradient";
      break;
  }

  //if (gameMode == gameMode_teamMode) this.teamID = msg.readUInt8();
  //this.animalType = animtype; //animal type
  this.setNick(nickName ? nickName : "mope.io");
  //console.log("Animal custom data read, id "+this.id+", animalType "+animtype);
};

Animal.prototype.readCustomData_onUpdate = function (msg) {
  Animal.superClass.prototype.readCustomData_onUpdate.call(this, msg); //call superclass version of this method

  //console.log("Animal custom data update read, id "+this.id);

  //if (this.oType == o_animal) {

  this.specType = msg.readUInt8();
  this.specType2 = msg.readUInt8();

  var lookAng = msg.readUInt16();
  // console.log("angle2: " + lookAng);
  var goalAngle = toRadians(lookAng + 90); //90 offset due to client drawing setup  heree
  this.angleDelta = distBetweenAngles(this.angle, goalAngle);
  this.oAngle = this.angle;
  if (this.firstPosUpd) {
    //on freshly spawned animals ,instantly set angle
    this.oAngle = this.angle = goalAngle;
    this.angleDelta = 0;
  }
  //console.log(this.specType, this.specType2, lookAng)
  this.curBiome = msg.readUInt8();
  var flagR = msg.readBitGroup();
  this.flag_lowWat = flagR.getBool();
  this.flag_inHomeBiome = flagR.getBool();
  this.flag_underWater = flagR.getBool();
  this.flag_eff_invincible = flagR.getBool();
  this.flag_usingAbility = flagR.getBool();
  this.flag_tailBitten = flagR.getBool();
  this.flag_eff_stunned = flagR.getBool();
  this.flag_iceSliding = flagR.getBool();
  this.flag_eff_frozen = flagR.getBool();
  this.flag_eff_onFire = flagR.getBool();
  this.flag_eff_healing = flagR.getBool();
  this.flag_eff_poison = flagR.getBool();
  this.flag_constricted = flagR.getBool();
  this.flag_webStuck = flagR.getBool();
  this.flag_dirtStuck = !0;
  this.flag_stealth = flagR.getBool();
  this.flag_eff_bleeding = flagR.getBool();
  this.flag_flying = flagR.getBool();
  this.flag_isGrabbed = flagR.getBool();
  this.flag_eff_aniInClaws = flagR.getBool();
  this.flag_eff_stunk = flagR.getBool();
  this.flag_cold = flagR.getBool();
  this.flag_inWater = flagR.getBool();
  this.flag_inLava = flagR.getBool();
  this.flag_canClimbHill = flagR.getBool();
  this.flag_isDevMode = flagR.getBool();
  this.flag_eff_slimed = flagR.getBool();
  this.flag_eff_wobbling = flagR.getBool();
  this.flag_eff_hot = flagR.getBool()
  this.flag_eff_sweatPoisoned = flagR.getBool();
  this.flag_eff_shivering = flagR.getBool();
  this.flag_inHidingHole = flagR.getBool();
  this.flag_eff_grabbedByFlytrap = flagR.getBool();
  this.flag_eff_aloeveraHealing = flagR.getBool();
  this.flag_eff_tossedInAir = flagR.getBool();
  this.flag_eff_isOnSpiderWeb = flagR.getBool();
  this.flag_fliesLikeDragon = flagR.getBool();
  this.flag_eff_isInMud = flagR.getBool();
  this.flag_eff_statue = flagR.getBool();
  this.flag_eff_isOnTree = flagR.getBool();
  this.flag_eff_isUnderTree = flagR.getBool();
  this.flag_speared = msg.readUInt8() == 1;
  this.flag_eff_dirty = msg.readUInt8() == 1;
  this.flag_can1v1 = msg.readUInt8() == 1;
  this.flag_isInArena = msg.readUInt8() == 1;
  this.wins1v1 = msg.readUInt8();
  this.playerNum = msg.readUInt8();
  this.flag_isDevMode && (this.devmode_Num = msg.readUInt8());
  this.flag_eff_statue && (this.eff_statueType = msg.readUInt8());
  this.flag_constricted && (this.eff_constrictedSpecies = msg.readUInt8());
  this.flag_webStuck && (this.eff_webStuckType = msg.readUInt8());
  this.flag_eff_dirty && (this.eff_dirtType = msg.readUInt8());
};
Animal.prototype.winsAddedInNick = false;
function Animal(oType, secondaryType) {
  Animal.superClass.call(this, o_animal); //call superclass init method (if needed, or write a new one below)

  this.animalType = secondaryType; //works for manually created objs
  //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@Animal constructor run, id "+this.id);
}

window.Animal = Animal; //make class global!

//add this class as a thisClass for the right oType!
GameObjType.setCustomClassForGameObjType(Animal, o_animal);

///////
// file: js_src/gameobj/SpiderWeb.js
///////

var superClass = GameObj;
SpiderWeb.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
SpiderWeb.prototype.constructor = SpiderWeb;
SpiderWeb.superClass = superClass; //'class' var

SpiderWeb.prototype.updateZ = function () {
  this.z = 1002;
};

//custom data for this class (must be matched by server-side write of this data!)
SpiderWeb.prototype.readCustomData_onUpdate = function (msg) {
  this.webTransparency = this.specType = msg.readUInt8();
};

//override draw (things like other effects are drawn seperately)
SpiderWeb.prototype.customDraw = function (batchDrawOutline) {
  ctx.save();

  ctx.globalAlpha *= (this.specType / 100.0) * 0.9; //web opacity param

  var theImg = getLoadedImg("img/spiderWeb.png");
  if (theImg) {
    var rad = this.rad;
    ctx.rotate(this.rPer * Math.PI * 2.0);
    ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);
  }
  ctx.restore();
};

//custom data for this class (must be matched by server-side write of this data!)
SpiderWeb.prototype.readCustomData_onNewlyVisible = function (msg) {
  this.webTransparency = this.specType = msg.readUInt8();
};

function SpiderWeb() {
  SpiderWeb.superClass.call(this, o_spiderWeb);

  this.webTransparency = 0;

  //set vars for this class
  this.doesDrawEffectScale = true;
  this.drawEffectScale_Slow = true;
}
window.SpiderWeb = SpiderWeb;
//add this file as a class! (make sure to call require!)
GameObjType.setCustomClassForGameObjType(SpiderWeb, o_spiderWeb);

///////
// file: js_src/gameobj/animal/Octopus.js
///////

var superClass = Animal;
Octopus.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
Octopus.prototype.constructor = Octopus;
Octopus.superClass = superClass; //'class' var

//example of custom Z
/*Octopus.prototype.updateZ = function() {
    this.z = 1002;
}*/

//custom data for this class (must be matched by server-side write of this data!)
Octopus.prototype.readCustomData_onNewlyVisible = function (msg) {
  Octopus.superClass.prototype.readCustomData_onNewlyVisible.call(this, msg); //call super
  //
};

//custom data for this class (must be matched by server-side write of this data!)
Octopus.prototype.readCustomData_onUpdate = function (msg) {
  Octopus.superClass.prototype.readCustomData_onUpdate.call(this, msg); //call super

  if (this.flag_usingAbility) {
    var isAnim = msg.readUInt8() > 0;
    var objOrAniT = msg.readUInt16();
    //console.log(objOrAniT);
    //check if it changed
    if (
      this.octoIsAnimal != isAnim ||
      this.octoDisguiseObjT != objOrAniT ||
      this.octoDrawObj == null
    ) {
      //needs to update inner obj that draws the disguise animal/food item
      var theObjT = isAnim ? o_animal : objOrAniT;
      var theAniT = isAnim ? objOrAniT : null;
      //console.log("octo disguised as obj T "+theObjT+" aniT "+theAniT+" isAni? "+isAnim+" tPassed "+objOrAniT);

      //makes sure the correct subclass is used as well:)
      var octoObj = GameObjType.createGameObjOfOType(theObjT, theAniT);
      if (isAnim)
        //animals need aniType set explicitely
        octoObj.animalType = theAniT;
      //this obj will stay at x/y 0,0
      octoObj.oRad = this.oRad;
      octoObj.nRad = this.nRad;
      octoObj.curBiome = this.curBiome; // biome_ocean;

      this.octoDrawObj = octoObj;
    }
    this.octoIsAnimal = isAnim;
    this.octoDisguiseObjT = objOrAniT;
  }
};

//Octopus drawing (split into methods since animals are more complex)

//lowest, under the green/red outline (draw first)
Octopus.prototype.drawUnderSkinImgOutline = function () {
  Octopus.superClass.prototype.drawUnderSkinImgOutline.call(this);
};
//drawn right before skin image
Octopus.prototype.drawUnderSkinImg = function () {
  Octopus.superClass.prototype.drawUnderSkinImg.call(this);
  //eg. draw frog legs image that will be UNDER the skin
};
Octopus.prototype.drawOnTopOfSkinImg = function () {
  Octopus.superClass.prototype.drawOnTopOfSkinImg.call(this); //call super to draw eg. glow effects
  //eg. draw yeti snowball, octopus

  //octopus effect
  if (this.flag_usingAbility) {
    ctx.save();
    ctx.globalAlpha = 1.0 - this.underwaterA;

    //for certain obj types, set a fixed rad size
    if (this.octoDisguiseObjT == o_bigMushroom) {
      //this.octoDrawObj.type=a_shrimp;
      this.octoDrawObj.nRad = 25.0;
    } else if (this.octoDisguiseObjT == o_plankton) {
      //this.octoDrawObj.type=a_shrimp;
      this.octoDrawObj.nRad = 17.0;
    } else if (this.octoDisguiseObjT == o_healingStone) {
      //this.octoDrawObj.type=a_shrimp;
      this.octoDrawObj.nRad = 15.0;
    } else this.octoDrawObj.nRad = this.rad;

    if (this.octoDisguiseObjT == o_hill) {
      console.log("Octo is hill now!");
    }

    this.octoDrawObj.draw();

    ctx.restore();
  }
};
Octopus.prototype.drawWhenUnderwater = function () {
  Octopus.superClass.prototype.drawWhenUnderwater.call(this);
  //draw shark fin, etc

  //drawCircle(0, this.rad * 0.2, this.rad * 0.12, "blue");
};

//custom class variables
Octopus.prototype.octoDisguiseObjT = 0;
Octopus.prototype.octoIsAnimal = false;
//custom data for this class (must be matched by server-side write of this data!)
Octopus.prototype.drawHealthBar = function () {
  if (this.flag_usingAbility) {
    if (this.octoIsAnimal) {
      Octopus.superClass.prototype.drawNickName.call(this, 1);
      this.octoDrawObj.curBiome = this.curBiome; // biome_ocean;
      this.hpPer_n = 2;
      this.hpPer = 25;
      this.hpBarA = 1;
    } else return;
  }

  ctx.save();
  //ease vars
  var hpBarA_n = timestamp < this.hpBarTimeoutT ? 1.0 : 0.0;
  this.hpBarA += (hpBarA_n - this.hpBarA) * 0.04;

  if (this.hpBarA > 0.001) {
    this.hpPer += (this.hpPer_n - this.hpPer) * 0.1;

    //draw bar
    var eyeS = Math.max(1.0, this.rad / 25.0);
    var barW = 20.0 * eyeS,
      barH = 5 * eyeS;
    var bx = 0,
      by = -this.rad - 10 * eyeS;
    ctx.globalAlpha *= this.hpBarA; //bar bg
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(bx - barW / 2, by - barH / 2, barW, barH);

    //ctx.globalAlpha = this.hpBarA * f;
    ctx.fillStyle = "#16D729"; //bar fill
    var width = barW * (this.hpPer / 100.0);
    if (this.flag_usingAbility && this.octoIsAnimal)
      width = barW * (25 / 100.0);

    ctx.fillRect(bx - barW / 2, by - barH / 2, width, barH);
  }
  ctx.restore(); //restore from fade
};

//set custom skin name
Octopus.prototype.getSkinName = function () {
  return "octopus"; // without .png (/skins/ * .png)
};

function Octopus() {
  Octopus.superClass.call(this, o_animal);
}
window.Octopus = Octopus;
//add this file as a class! (make sure to call require!)
GameObjType.setCustomClassForGameObjType(Octopus, o_animal, a_octopus);

///////
// file: js_src/gameobj/animal/Eagle.js
///////

var superClass = Animal;
Eagle.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
Eagle.prototype.constructor = Eagle;
Eagle.superClass = superClass; //'class' var

Eagle.prototype.animalInfo = function () {
  var infoO = {};

  var extras = "";
  switch (this.animalSpecies) {
    case 0:
      infoO.aniName = "Bald Eagle";
      break;
    case 1:
      infoO.aniName = "Golden Eagle";
      extras = "(Can even pick predators!)";
      break;
  }
  infoO.aniCol = "#5b400d";
  infoO.upgradeText =
    "UPGRADED to " +
    infoO.aniName +
    "!\nEagles can fly up other animals in the air! !\n" +
    extras;

  infoO.skinName =
    "eagle/" +
    this.animalSpecies +
    "/eagle" +
    (this.specType == 0 ? "" : this.specType);
  return infoO;
};

Eagle.prototype.drawSkinCustomization = function () {
  if (!this.flag_usingAbility) return;

  var skins = "skins";

  var iScale = 500 / 340.0;
  {
    if (this.flag_flying && !this.flag_isGrabbed) {
      ctx.save();

      var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
      var frame = !options_lowGraphics
        ? getAnimFrame(tSinceSpawn, 0.9, 0.3, 2)
        : this.birdNoAnimationFlyWingAngle;
      var theImg = getLoadedImg(
        skins + "/eagle/" + this.animalSpecies + "/eagle_wing1.png"
      );
      if (theImg) {
        ctx.save();
        //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

        //console.log("getAnimFrame:" + frame);
        var extraRotate = -(-0.2 + frame) * toRadians(90.0); //spin animation

        //clip to sliwly show the claw
        var rad = this.rad * 0.8;
        ctx.rotate(toRadians(45) + extraRotate);
        var imX = 0,
          imY = this.rad;
        var imW = rad * 2.0 * 0.62,
          imH = rad * 2.5; // * fac0to1;
        var imAnchorX = 0.2,
          imAnchorY = 1.7; //top-left= 0,0, bottom-right=1,1 (canvas coords)

        ctx.drawImage(
          theImg,
          imX + imW * -imAnchorX,
          imY + imH * -imAnchorY,
          imW,
          imH
        );

        ctx.restore();
      }

      var theImg = getLoadedImg(
        skins + "/eagle/" + this.animalSpecies + "/eagle_wing2.png"
      );
      if (theImg) {
        ctx.save();
        //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

        //console.log("getAnimFrame:" + frame);
        var extraRotate = -(-0.2 + frame) * toRadians(-90.0); //spin animation

        //clip to sliwly show the claw
        var rad = this.rad * 0.8;
        ctx.rotate(toRadians(-45) + extraRotate);
        var imX = 0,
          imY = this.rad;
        var imW = rad * 2.0 * 0.62,
          imH = rad * 2.5; // * fac0to1;
        var imAnchorX = 0.8,
          imAnchorY = 1.7; //top-left= 0,0, bottom-right=1,1 (canvas coords)

        ctx.drawImage(
          theImg,
          imX + imW * -imAnchorX,
          imY + imH * -imAnchorY,
          imW,
          imH
        );

        ctx.restore();
      }

      ctx.restore();
    } else if (this.specType == 1) {
      // attack animation
      ctx.save();

      var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
      var frame = !options_lowGraphics
        ? getAnimFrame(tSinceSpawn, 0.7, 0.3, 2)
        : 0;
      var theImg = getLoadedImg(
        skins + "/eagle/" + this.animalSpecies + "/eagle_wing1.png"
      );
      if (theImg) {
        ctx.save();
        //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

        //console.log("getAnimFrame:" + frame);
        var extraRotate = -(-0.2 + frame) * toRadians(45.0); //spin animation

        //clip to sliwly show the claw
        var rad = this.rad * 0.8;
        ctx.rotate(toRadians(15) + extraRotate);
        var imX = 0,
          imY = this.rad;
        var imW = rad * 2.0 * 0.8,
          imH = rad * 2.2; // * fac0to1;
        var imAnchorX = 0,
          imAnchorY = 1.5; //top-left= 0,0, bottom-right=1,1 (canvas coords)

        ctx.drawImage(
          theImg,
          imX + imW * -imAnchorX,
          imY + imH * -imAnchorY,
          imW,
          imH
        );

        ctx.restore();
      }

      var theImg = getLoadedImg(
        skins + "/eagle/" + this.animalSpecies + "/eagle_wing2.png"
      );
      if (theImg) {
        ctx.save();
        //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

        //console.log("getAnimFrame:" + frame);
        var extraRotate = -(-0.2 + frame) * toRadians(-45.0); //spin animation

        //clip to sliwly show the claw
        var rad = this.rad * 0.8;
        ctx.rotate(toRadians(-15) + extraRotate);
        var imX = 0,
          imY = this.rad;
        var imW = rad * 2.0 * 0.8,
          imH = rad * 2.2; // * fac0to1;
        var imAnchorX = 1,
          imAnchorY = 1.5; //top-left= 0,0, bottom-right=1,1 (canvas coords)

        ctx.drawImage(
          theImg,
          imX + imW * -imAnchorX,
          imY + imH * -imAnchorY,
          imW,
          imH
        );

        ctx.restore();
      }

      ctx.restore();
    }

    //console.log(this.specType)
    if (this.specType != 0 && this.specType != undefined) {
      var head = "eagle_head" + (this.specType == 1 ? "2" : "");

      var theHead = getLoadedImg(
        skins + "/eagle/" + this.animalSpecies + "/" + head + ".png"
      );
      if (theHead) {
        ctx.save();
        var rad = this.rad;
        ctx.drawImage(
          theHead,
          -rad * iScale,
          (-rad + rad * 0.1) * iScale,
          2 * rad * iScale,
          2 * rad * iScale
        );
        ctx.restore();
      }
    }
  }
};

function Eagle() {
  Eagle.superClass.call(this, o_animal);
}
window.Eagle = Eagle;
//add this file as a class! (make sure to call require!)
GameObjType.setCustomClassForGameObjType(Eagle, o_animal, a_eagle);

///////
// file: js_src/gameobj/animal/Ostrich.js
///////

var superClass = Animal;
Ostrich.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
Ostrich.prototype.constructor = Ostrich;
Ostrich.superClass = superClass; //'class' var

//example of custom Z
/*Ostrich.prototype.updateZ = function() {
    this.z = 1002;
}*/

//set custom skin name
Ostrich.prototype.getSkinName = function () {
  return "ostrich/ostrich";
};

function Ostrich() {
  Ostrich.superClass.call(this, o_animal);
}
window.Ostrich = Ostrich;
//add this file as a class! (make sure to call require!)
GameObjType.setCustomClassForGameObjType(Ostrich, o_animal, a_ostrich);

///////
// file: js_src/gameobj/animal/OstrichBaby.js
///////

var superClass = Animal;
OstrichBaby.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
OstrichBaby.prototype.constructor = OstrichBaby;
OstrichBaby.superClass = superClass; //'class' var

//example of custom Z
/*OstrichBaby.prototype.updateZ = function() {
    this.z = 1002;
}*/

//set custom skin name
OstrichBaby.prototype.getSkinName = function () {
  return "ostrich/ostrich-baby";
};

OstrichBaby.prototype.isEdibleOutlined = function () {
  if (this.mommyID == myPlayerID) return false;

  var myPlayer = gameObjsByID[myPlayerID];
  if (myPlayer) {
    var attackerType = myPlayer.animalType;
    if (
      attackerType == a_hippo ||
      attackerType == a_boaConstrictor ||
      attackerType == a_killerWhale
    )
      return false;
  }

  return OstrichBaby.superClass.prototype.isEdibleOutlined.call(this);
};

OstrichBaby.prototype.readCustomData_onNewlyVisible = function (msg) {
  OstrichBaby.superClass.prototype.readCustomData_onNewlyVisible.call(
    this,
    msg
  ); //call super
  this.mommyID = msg.readUInt32();
};

function OstrichBaby() {
  OstrichBaby.superClass.call(this, o_animal);
}

window.OstrichBaby = OstrichBaby;
//add this file as a class! (make sure to call require!)
GameObjType.setCustomClassForGameObjType(OstrichBaby, o_animal, a_ostrichBaby);

///////
// file: js_src/gameobj/animal/Falcon.js
///////

var Falcon = Falcon;
var superClass = Animal;
Falcon.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
Falcon.prototype.constructor = Falcon;
Falcon.superClass = superClass; //'class' var

//example of custom Z
/*Falcon.prototype.updateZ = function() {
    this.z = 1002;
}*/

//set custom skin name
Falcon.prototype.getSkinName = function () {
  return (
    "falcon/falcon" +
    (this.specType == 0 || this.specType == undefined ? "" : this.specType)
  );
};

Falcon.prototype.drawSkinCustomization = function () {
  if (!this.flag_usingAbility) return;

  var skins = "skins";

  var iScale = 500 / 340.0;
  if (this.flag_flying && !this.flag_isGrabbed && this.specType == 1) {
    ctx.save();

    var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
    var frame = !options_lowGraphics
      ? getAnimFrame(tSinceSpawn, 0.7, 0.4, 2)
      : this.birdNoAnimationFlyWingAngle;
    var theImg = getLoadedImg(skins + "/falcon/falcon_wing1.png");
    if (theImg) {
      ctx.save();
      //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

      //console.log("getAnimFrame:" + frame);
      var extraRotate = -(-0.2 + frame) * toRadians(80.0); //spin animation

      //clip to sliwly show the claw
      var rad = this.rad * 0.8;
      ctx.rotate(toRadians(25) + extraRotate);
      var imX = 0,
        imY = this.rad;
      var imW = rad * 2.0 * 0.65,
        imH = rad * 2.5; // * fac0to1;
      var imAnchorX = 0,
        imAnchorY = 1.5; //top-left= 0,0, bottom-right=1,1 (canvas coords)

      ctx.drawImage(
        theImg,
        imX + imW * -imAnchorX,
        imY + imH * -imAnchorY,
        imW,
        imH
      );

      ctx.restore();
    }

    var theImg = getLoadedImg(skins + "/falcon/falcon_wing2.png");
    if (theImg) {
      ctx.save();
      //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

      //console.log("getAnimFrame:" + frame);
      var extraRotate = -(-0.2 + frame) * toRadians(-80.0); //spin animation

      //clip to sliwly show the claw
      var rad = this.rad * 0.8;
      ctx.rotate(toRadians(-25) + extraRotate);
      var imX = 0,
        imY = this.rad;
      var imW = rad * 2.0 * 0.65,
        imH = rad * 2.5; // * fac0to1;
      var imAnchorX = 1,
        imAnchorY = 1.5; //top-left= 0,0, bottom-right=1,1 (canvas coords)

      ctx.drawImage(
        theImg,
        imX + imW * -imAnchorX,
        imY + imH * -imAnchorY,
        imW,
        imH
      );

      ctx.restore();
    }

    ctx.restore();
  } else if (this.flag_flying && this.specType == 2) {
    // dive animation
    ctx.save();

    var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
    var frame = !options_lowGraphics
      ? getAnimFrame(tSinceSpawn, 0.7, 0.3, 2)
      : 0;
    var theImg = getLoadedImg(skins + "/falcon/falcon_wing1.png");
    if (theImg) {
      ctx.save();
      //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

      //console.log("getAnimFrame:" + frame);
      var extraRotate = -(-0.2 + 0) * toRadians(25.0); //spin animation

      //clip to sliwly show the claw
      var rad = this.rad * 0.8;
      ctx.rotate(extraRotate);
      var imX = 0,
        imY = this.rad;
      var imW = rad * 2.0 * 0.7,
        imH = rad * 2.2; // * fac0to1;
      var imAnchorX = 0,
        imAnchorY = 1.5; //top-left= 0,0, bottom-right=1,1 (canvas coords)

      ctx.drawImage(
        theImg,
        imX + imW * -imAnchorX,
        imY + imH * -imAnchorY,
        imW,
        imH
      );

      ctx.restore();
    }

    var theImg = getLoadedImg(skins + "/falcon/falcon_wing2.png");
    if (theImg) {
      ctx.save();
      //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

      //console.log("getAnimFrame:" + frame);
      var extraRotate = -(-0.2 + 0) * toRadians(-25.0); //spin animation

      //clip to sliwly show the claw
      var rad = this.rad * 0.8;
      ctx.rotate(extraRotate);
      var imX = 0,
        imY = this.rad;
      var imW = rad * 2.0 * 0.7,
        imH = rad * 2.2; // * fac0to1;
      var imAnchorX = 1,
        imAnchorY = 1.5; //top-left= 0,0, bottom-right=1,1 (canvas coords)

      ctx.drawImage(
        theImg,
        imX + imW * -imAnchorX,
        imY + imH * -imAnchorY,
        imW,
        imH
      );

      ctx.restore();
    }

    ctx.restore();
  } else if (this.flag_flying && this.specType == 3) {
    // attack animation
    ctx.save();

    //falcon_attack
    var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
    var frame = !options_lowGraphics
      ? getAnimFrame(tSinceSpawn, 0.5, 0.4, 2)
      : 0;
    var theImg = getLoadedImg(skins + "/falcon/falcon_wing1.png");
    if (theImg) {
      ctx.save();
      //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

      //console.log("getAnimFrame:" + frame);
      var extraRotate = -(-0.2 + frame) * toRadians(45.0); //spin animation

      //clip to sliwly show the claw
      var rad = this.rad * 0.8;
      ctx.rotate(toRadians(15) + extraRotate);
      var imX = 0,
        imY = this.rad;
      var imW = rad * 2.0 * 1,
        imH = rad * 2.2; // * fac0to1;
      var imAnchorX = 0,
        imAnchorY = 1.5; //top-left= 0,0, bottom-right=1,1 (canvas coords)

      ctx.drawImage(
        theImg,
        imX + imW * -imAnchorX,
        imY + imH * -imAnchorY,
        imW,
        imH
      );

      ctx.restore();
    }

    var theImg = getLoadedImg(skins + "/falcon/falcon_wing2.png");
    if (theImg) {
      ctx.save();
      //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

      //console.log("getAnimFrame:" + frame);
      var extraRotate = -(-0.2 + frame) * toRadians(-45.0); //spin animation

      //clip to sliwly show the claw
      var rad = this.rad * 0.8;
      ctx.rotate(toRadians(-15) + extraRotate);
      var imX = 0,
        imY = this.rad;
      var imW = rad * 2.0 * 1,
        imH = rad * 2.2; // * fac0to1;
      var imAnchorX = 1,
        imAnchorY = 1.5; //top-left= 0,0, bottom-right=1,1 (canvas coords)

      ctx.drawImage(
        theImg,
        imX + imW * -imAnchorX,
        imY + imH * -imAnchorY,
        imW,
        imH
      );

      ctx.restore();
    }

    ctx.restore();
  }

  if (this.specType != 0 && this.specType != undefined) {
    var theHead = getLoadedImg(skins + "/falcon/falcon_head.png");
    if (theHead) {
      ctx.save();
      var rad = this.rad * (this.specType == 3 ? 1.2 : 1);
      var yDist = rad * 0.2;
      if (this.specType == 3) yDist = rad * -0.15;
      ctx.drawImage(
        theHead,
        -rad * iScale,
        (-rad + yDist) * iScale,
        2 * rad * iScale,
        2 * rad * iScale
      );
      ctx.restore();
    }
  }
};

function Falcon() {
  Falcon.superClass.call(this, o_animal);
}
window.Falcon = Falcon;
//add this file as a class! (make sure to call require!)
GameObjType.setCustomClassForGameObjType(Falcon, o_animal, a_falcon);

///////
// file: js_src/gameobj/animal/SnowyOwl.js
///////

var superClass = Animal;
SnowyOwl.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
SnowyOwl.prototype.constructor = SnowyOwl;
SnowyOwl.superClass = superClass; //'class' var

//example of custom Z
/*SnowyOwl.prototype.updateZ = function() {
    this.z = 1002;
}*/

//set custom skin name
SnowyOwl.prototype.getSkinName = function () {
  return "snowyowl/snowyowl" + (this.specType == 0 ? "" : this.specType);
};

SnowyOwl.prototype.drawSkinCustomization = function () {
  if (!this.flag_usingAbility) return;

  var skins = "skins";

  var iScale = 500 / 340.0;
  if (this.flag_flying && !this.flag_isGrabbed && this.specType == 1) {
    ctx.save();

    var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
    var frame = !options_lowGraphics
      ? getAnimFrame(tSinceSpawn, 0.7, 0.4, 2)
      : this.birdNoAnimationFlyWingAngle;
    var theImg = getLoadedImg(skins + "/snowyowl/snowyowl_wing1.png");
    if (theImg) {
      ctx.save();
      //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

      //console.log("getAnimFrame:" + frame);
      var extraRotate = -(-0.2 + frame) * toRadians(80.0); //spin animation

      //clip to sliwly show the claw
      var rad = this.rad * 0.8;
      ctx.rotate(toRadians(25) + extraRotate);
      var imX = 0,
        imY = this.rad;
      var imW = rad * 2.0 * 0.65,
        imH = rad * 2.5; // * fac0to1;
      var imAnchorX = 0,
        imAnchorY = 1.5; //top-left= 0,0, bottom-right=1,1 (canvas coords)

      ctx.drawImage(
        theImg,
        imX + imW * -imAnchorX,
        imY + imH * -imAnchorY,
        imW,
        imH
      );

      ctx.restore();
    }

    var theImg = getLoadedImg(skins + "/snowyowl/snowyowl_wing2.png");
    if (theImg) {
      ctx.save();
      //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

      //console.log("getAnimFrame:" + frame);
      var extraRotate = -(-0.2 + frame) * toRadians(-80.0); //spin animation

      //clip to sliwly show the claw
      var rad = this.rad * 0.8;
      ctx.rotate(toRadians(-25) + extraRotate);
      var imX = 0,
        imY = this.rad;
      var imW = rad * 2.0 * 0.65,
        imH = rad * 2.5; // * fac0to1;
      var imAnchorX = 1,
        imAnchorY = 1.5; //top-left= 0,0, bottom-right=1,1 (canvas coords)

      ctx.drawImage(
        theImg,
        imX + imW * -imAnchorX,
        imY + imH * -imAnchorY,
        imW,
        imH
      );

      ctx.restore();
    }

    ctx.restore();
  } else if (this.flag_flying && this.specType == 2) {
    // dive animation
    //console.log("snowyowl dive...");
    ctx.save();

    var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
    var frame = !options_lowGraphics
      ? getAnimFrame(tSinceSpawn, 0.7, 0.3, 2)
      : 0;
    var theImg = getLoadedImg(skins + "/snowyowl/snowyowl_wing1.png");
    if (theImg) {
      ctx.save();
      //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

      //console.log("getAnimFrame:" + frame);
      var extraRotate = -(-0.2 + frame) * toRadians(45.0); //spin animation

      //clip to sliwly show the claw
      var rad = this.rad * 0.8;
      ctx.rotate(toRadians(15) + extraRotate);
      var imX = 0,
        imY = this.rad;
      var imW = rad * 2.0 * 0.7,
        imH = rad * 2.2; // * fac0to1;
      var imAnchorX = 0,
        imAnchorY = 1.5; //top-left= 0,0, bottom-right=1,1 (canvas coords)

      ctx.drawImage(
        theImg,
        imX + imW * -imAnchorX,
        imY + imH * -imAnchorY,
        imW,
        imH
      );

      ctx.restore();
    }

    var theImg = getLoadedImg(skins + "/snowyowl/snowyowl_wing2.png");
    if (theImg) {
      ctx.save();
      //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

      //console.log("getAnimFrame:" + frame);
      var extraRotate = -(-0.2 + frame) * toRadians(-45.0); //spin animation

      //clip to sliwly show the claw
      var rad = this.rad * 0.8;
      ctx.rotate(toRadians(-15) + extraRotate);
      var imX = 0,
        imY = this.rad;
      var imW = rad * 2.0 * 0.7,
        imH = rad * 2.2; // * fac0to1;
      var imAnchorX = 1,
        imAnchorY = 1.5; //top-left= 0,0, bottom-right=1,1 (canvas coords)

      ctx.drawImage(
        theImg,
        imX + imW * -imAnchorX,
        imY + imH * -imAnchorY,
        imW,
        imH
      );

      ctx.restore();
    }

    ctx.restore();
  } else if (this.flag_flying && this.specType == 3) {
    // attack animation
    ctx.save();

    //console.log("snowyowl attacking...");
    var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
    var frame = !options_lowGraphics
      ? getAnimFrame(tSinceSpawn, 0.5, 0.5, 2)
      : 0;
    var theImg = getLoadedImg(skins + "/snowyowl/snowyowl_wing1.png");
    if (theImg) {
      ctx.save();
      //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

      //console.log("getAnimFrame:" + frame);
      var extraRotate = -(-0.2 + frame) * toRadians(45.0); //spin animation

      //clip to sliwly show the claw
      var rad = this.rad * 0.8;
      ctx.rotate(toRadians(25) + extraRotate);
      var imX = 0,
        imY = this.rad;
      var imW = rad * 2.0 * 0.7,
        imH = rad * 2.2; // * fac0to1;
      var imAnchorX = 0,
        imAnchorY = 1.5; //top-left= 0,0, bottom-right=1,1 (canvas coords)

      ctx.drawImage(
        theImg,
        imX + imW * -imAnchorX,
        imY + imH * -imAnchorY,
        imW,
        imH
      );

      ctx.restore();
    }

    var theImg = getLoadedImg(skins + "/snowyowl/snowyowl_wing2.png");
    if (theImg) {
      ctx.save();
      //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

      //console.log("getAnimFrame:" + frame);
      var extraRotate = -(-0.2 + frame) * toRadians(-45.0); //spin animation

      //clip to sliwly show the claw
      var rad = this.rad * 0.8;
      ctx.rotate(toRadians(-25) + extraRotate);
      var imX = 0,
        imY = this.rad;
      var imW = rad * 2.0 * 0.7,
        imH = rad * 2.2; // * fac0to1;
      var imAnchorX = 1,
        imAnchorY = 1.5; //top-left= 0,0, bottom-right=1,1 (canvas coords)

      ctx.drawImage(
        theImg,
        imX + imW * -imAnchorX,
        imY + imH * -imAnchorY,
        imW,
        imH
      );

      ctx.restore();
    }

    ctx.restore();
  }

  if (this.specType != 0 && this.specType != undefined) {
    var theHead = getLoadedImg(skins + "/snowyowl/snowyowl_head.png");
    if (theHead) {
      ctx.save();
      var rad = this.rad * 0.8;
      ctx.drawImage(
        theHead,
        -rad * iScale,
        (-rad + rad * 0.1) * iScale,
        2 * rad * iScale,
        2 * rad * iScale
      );
      ctx.restore();
    }
  }
};

function SnowyOwl() {
  SnowyOwl.superClass.call(this, o_animal);
}
window.SnowyOwl = SnowyOwl;
//add this file as a class! (make sure to call require!)
GameObjType.setCustomClassForGameObjType(SnowyOwl, o_animal, a_snowyOwl);

///////
// file: js_src/gameobj/animal/Pelican.js
///////

var Pelican = Pelican;
var superClass = Animal;
Pelican.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
Pelican.prototype.constructor = Pelican;
Pelican.superClass = superClass; //'class' var

//example of custom Z
/*Pelican.prototype.updateZ = function() {
    this.z = 1002;
}*/

//set custom skin name
Pelican.prototype.getSkinName = function () {
  return "pelican/pelican" + (this.specType == 0 ? "" : this.specType);
};

Pelican.prototype.drawSkinCustomization = function () {
  if (!this.flag_usingAbility) return;

  var iScale = 500 / 340.0; //scale up ps image to fit (to remove blank space)
  var rad = this.rad - this.outlineW;

  var skins = "skins";

  if (this.flag_flying) {
    var wingType = "";

    wingType = "pelican";

    ctx.save();

    var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
    var frame = !options_lowGraphics
      ? getAnimFrame(tSinceSpawn, 0.9, 0.3, 2)
      : this.birdNoAnimationFlyWingAngle;
    var theImg = getLoadedImg(skins + "/pelican/pelican_wing1.png");
    if (theImg) {
      ctx.save();
      //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

      //console.log("getAnimFrame:" + frame);
      var extraRotate = -(-0.2 + frame) * toRadians(90.0); //spin animation

      //clip to sliwly show the claw
      var rad = this.rad * 0.8;
      ctx.rotate(toRadians(45) + extraRotate);
      var imX = 0,
        imY = this.rad;
      var imW = rad * 2.0 * 0.6,
        imH = rad * 2.3; // * fac0to1;
      var imAnchorX = 0,
        imAnchorY = 1.7; //top-left= 0,0, bottom-right=1,1 (canvas coords)

      ctx.drawImage(
        theImg,
        imX + imW * -imAnchorX,
        imY + imH * -imAnchorY,
        imW,
        imH
      );

      ctx.restore();
    }

    var theImg = getLoadedImg(skins + "/pelican/pelican_wing2.png");
    if (theImg) {
      ctx.save();
      //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

      //console.log("getAnimFrame:" + frame);
      var extraRotate = -(-0.2 + frame) * toRadians(-90.0); //spin animation

      //clip to sliwly show the claw
      var rad = this.rad * 0.8;
      ctx.rotate(toRadians(-45) + extraRotate);
      var imX = 0,
        imY = this.rad;
      var imW = rad * 2.0 * 0.6,
        imH = rad * 2.3; // * fac0to1;
      var imAnchorX = 1,
        imAnchorY = 1.7; //top-left= 0,0, bottom-right=1,1 (canvas coords)

      ctx.drawImage(
        theImg,
        imX + imW * -imAnchorX,
        imY + imH * -imAnchorY,
        imW,
        imH
      );

      ctx.restore();
    }
    ctx.restore();
  } else if (this.specType == 1) {
    var wingType = "";

    wingType = "pelican";

    ctx.save();

    var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
    var frame = !options_lowGraphics
      ? getAnimFrame(tSinceSpawn, 0.9, 0.3, 2)
      : 0;
    var theImg = getLoadedImg(skins + "/pelican/pelican_wing11.png");
    if (theImg) {
      ctx.save();
      //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

      //console.log("getAnimFrame:" + frame);
      var extraRotate = -(-0.2 + frame) * toRadians(45.0); //spin animation

      //clip to sliwly show the claw
      var rad = this.rad * 0.8;
      ctx.rotate(toRadians(45) + extraRotate);
      var imX = 0,
        imY = this.rad;
      var imW = rad * 2.0 * 0.7,
        imH = rad * 2.2; // * fac0to1;
      var imAnchorX = 0,
        imAnchorY = 1.7; //top-left= 0,0, bottom-right=1,1 (canvas coords)

      ctx.drawImage(
        theImg,
        imX + imW * -imAnchorX,
        imY + imH * -imAnchorY,
        imW,
        imH
      );

      ctx.restore();
    }

    var theImg = getLoadedImg(skins + "/pelican/pelican_wing21.png");
    if (theImg) {
      ctx.save();
      //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

      //console.log("getAnimFrame:" + frame);
      var extraRotate = -(-0.2 + frame) * toRadians(-45.0); //spin animation

      //clip to sliwly show the claw
      var rad = this.rad * 0.8;
      ctx.rotate(toRadians(-45) + extraRotate);
      var imX = 0,
        imY = this.rad;
      var imW = rad * 2.0 * 0.7,
        imH = rad * 2.2; // * fac0to1;
      var imAnchorX = 1,
        imAnchorY = 1.7; //top-left= 0,0, bottom-right=1,1 (canvas coords)

      ctx.drawImage(
        theImg,
        imX + imW * -imAnchorX,
        imY + imH * -imAnchorY,
        imW,
        imH
      );

      ctx.restore();
    }

    ctx.restore();
  }

  if (this.specType != 0 && !this.flag_isGrabbed) {
    if (this.specType == 2) {
      var waterbag = skins + "/pelican/ability_pelican.png";
      var bag = getLoadedImg(waterbag);
      if (bag) {
        ctx.save();
        ctx.rotate(toRadians(180));
        var rad = this.rad * 0.3;
        var ydist = this.rad * 1;
        ctx.drawImage(
          bag,
          -rad * iScale,
          -rad - ydist * iScale,
          2 * rad * iScale,
          2 * rad * iScale
        );
        ctx.restore();
      }
    }

    var pelican_head = "pelican_head" + (this.specType == 3 ? "2" : "");

    var theHead = getLoadedImg(skins + "/pelican/" + pelican_head + ".png");
    if (theHead) {
      ctx.save();
      var rad = this.rad * 1;
      var ydist = -this.rad * 0.3;
      ctx.drawImage(
        theHead,
        -rad * iScale,
        -rad + ydist * iScale,
        2 * rad * iScale,
        2 * rad * iScale
      );
      ctx.restore();
    }
  }
};
function Pelican() {
  Pelican.superClass.call(this, o_animal);
}
window.Pelican = Pelican;
//add this file as a class! (make sure to call require!)
GameObjType.setCustomClassForGameObjType(Pelican, o_animal, a_pelican);

///////
// file: js_src/gameobj/animal/Frog.js
///////

var superClass = Animal;
Frog.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
Frog.prototype.constructor = Frog;
Frog.superClass = superClass; //'class' var

//example of custom Z
Frog.prototype.updateZ = function () {
  this.z = 1003 + this.rad;
};

//set custom skin name
Frog.prototype.getSkinName = function () {
  var suffix = "";
  if (this.flag_usingAbility && !this.flag_underWater) suffix = "2";
  return "frog/frog" + suffix;
};

Frog.prototype.drawUnderSkinImg = function () {
  if (this.flag_usingAbility && !this.flag_underWater) {
    var rad = this.rad - this.outlineW;
    var iScale = 500 / 340.0;
    var froglegs = getLoadedImg("./skins/frog/frogLegs.png");
    if (froglegs)
      ctx.drawImage(
        froglegs,
        -rad * iScale,
        (-rad - rad) * iScale,
        2 * rad * iScale,
        2 * rad * iScale
      );
  }
};

Frog.prototype.drawWhenUnderwater = function () {
  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.scale(1, 1.5);
  drawCircle(0, 0, this.rad * 0.5, "#598b30");
  drawCircle(0, this.rad * -0.6, this.rad * 0.3, "#64a034");
  ctx.restore();
};
function Frog() {
  Frog.superClass.call(this, o_animal);
}
window.Frog = Frog;
//add this file as a class! (make sure to call require!)
GameObjType.setCustomClassForGameObjType(Frog, o_animal, a_frog);

///////
// file: js_src/gameobj/animal/Duck.js
///////

var thisClass = Duck;
var superClass = Animal;
thisClass.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
thisClass.prototype.constructor = thisClass;
thisClass.superClass = superClass; //'class' var

//example of custom Z
/*thisClass.prototype.updateZ = function() {
    this.z = 1002;
}*/

//set custom skin name
thisClass.prototype.isAttacking = false;
thisClass.prototype.getSkinName = function () {
  //return "duck/duck_" + this.specType;

  var skin =
    "duck/" + this.animalSpecies + "/duck" + (this.isAttacking ? "1" : "");
  return skin;
};

thisClass.prototype.drawSkinCustomization = function () {
  var iScale = 500 / 340.0;
  if (this.isAttacking && this.animalSpecies == 2) {
    var wingType = "";

    wingType = "duck";

    ctx.save();

    var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
    var frame = getAnimFrame(tSinceSpawn, 0.5, 0.3, 2);
    var theImg = getLoadedImg("skins/duck/2/duck_wing1.png");
    if (theImg) {
      ctx.save();
      //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

      //console.log("getAnimFrame:" + frame);
      var extraRotate = -(-0.2 + frame) * toRadians(15.0); //spin animation

      //clip to sliwly show the claw
      var rad = this.rad * 0.8;
      ctx.rotate(toRadians(15) + extraRotate);
      var imX = 0,
        imY = this.rad;
      var imW = rad * 2.0 * 0.7,
        imH = rad * 2.2; // * fac0to1;
      var imAnchorX = 0,
        imAnchorY = 1.5; //top-left= 0,0, bottom-right=1,1 (canvas coords)

      ctx.drawImage(
        theImg,
        imX + imW * -imAnchorX,
        imY + imH * -imAnchorY,
        imW,
        imH
      );

      ctx.restore();
    }

    var theImg = getLoadedImg("skins/duck/2/duck_wing2.png");
    if (theImg) {
      ctx.save();
      //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

      //console.log("getAnimFrame:" + frame);
      var extraRotate = -(-0.2 + frame) * toRadians(-15.0); //spin animation

      //clip to sliwly show the claw
      var rad = this.rad * 0.8;
      ctx.rotate(toRadians(-15) + extraRotate);
      var imX = 0,
        imY = this.rad;
      var imW = rad * 2.0 * 0.7,
        imH = rad * 2.2; // * fac0to1;
      var imAnchorX = 1,
        imAnchorY = 1.5; //top-left= 0,0, bottom-right=1,1 (canvas coords)

      ctx.drawImage(
        theImg,
        imX + imW * -imAnchorX,
        imY + imH * -imAnchorY,
        imW,
        imH
      );

      ctx.restore();
    }

    var theHead = getLoadedImg("skins/duck/2/head_duck.png");
    if (theHead) {
      ctx.save();
      var rad = this.rad * 1;
      var ydist = -this.rad * 0.1;
      ctx.drawImage(
        theHead,
        -rad * iScale,
        -rad + ydist * iScale,
        2 * rad * iScale,
        2 * rad * iScale
      );
      ctx.restore();
    }

    ctx.restore();
  }
};
Duck.prototype.readCustomData_onNewlyVisible = function (msg) {
  Duck.superClass.prototype.readCustomData_onNewlyVisible.call(this, msg); //call superclass version of this method
  this.isAttacking = msg.readUInt8();
};

Duck.prototype.readCustomData_onUpdate = function (msg) {
  Duck.superClass.prototype.readCustomData_onUpdate.call(this, msg); //call superclass version of this method
  this.isAttacking = msg.readUInt8();
};
function Duck() {
  superClass.call(this, o_animal);
}
window.Duck = Duck;
//add this file as a class! (make sure to call require!)
GameObjType.setCustomClassForGameObjType(Duck, o_animal, a_duck);

///////
// file: js_src/gameobj/animal/Duckling.js
///////

var superClass = Animal;
Duckling.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
Duckling.prototype.constructor = Duckling;
Duckling.superClass = superClass; //'class' var

//example of custom Z
/*Duckling.prototype.updateZ = function() {
    this.z = 1002;
}*/

//set custom skin name
Duckling.prototype.getSkinName = function () {
  return "duck/duckling";
};
function Duckling() {
  Duckling.superClass.call(this, o_animal);
}
window.Duckling = Duckling;
//add this file as a class! (make sure to call require!)
GameObjType.setCustomClassForGameObjType(Duckling, o_animal, a_duckling);

///////
// file: js_src/gameobj/animal/BlackDragon.js
///////

var superClass = Animal;
BlackDragon.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
BlackDragon.prototype.constructor = BlackDragon;
BlackDragon.superClass = superClass; //'class' var

//example of custom Z
BlackDragon.prototype.updateZ = function () {
  this.z = 1003 + this.rad;
};

//set custom skin name
BlackDragon.prototype.getSkinName = function () {
  return "blackdragon";
};

BlackDragon.prototype.readCustomData_onNewlyVisible = function (msg) {
  BlackDragon.superClass.prototype.readCustomData_onNewlyVisible.call(
    this,
    msg
  ); //call superclass version of this method
  this.lava = msg.readUInt8();
};

BlackDragon.prototype.readCustomData_onUpdate = function (msg) {
  BlackDragon.superClass.prototype.readCustomData_onUpdate.call(this, msg); //call superclass version of this method
  this.lava = msg.readUInt8();
};

BlackDragon.prototype.drawSkinCustomization = function () {
  var iScale = 500 / 340.0; //scale up ps image to fit (to remove blank space)
  //customizations!

  var theImg = getLoadedImg("skins/bd-nostrils.png");
  if (theImg) {
    var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
    var frame = getAnimFrame(tSinceSpawn, 5, 1, 1);
    ctx.save();
    ctx.globalAlpha = Math.max(0, frame);
    var rad = this.rad - this.outlineW;
    ctx.drawImage(
      theImg,
      -rad * iScale,
      -rad * iScale,
      2 * rad * iScale,
      2 * rad * iScale
    );

    ctx.restore();
  }

  var lava = this.lava; //waterBarPerc_n;
  var minLowLava = 50;
  //console.log("lava: " + lava)
  if (lava < minLowLava) {
    var lp = lava / minLowLava;
    var theImg = getLoadedImg("skins/bd-lowlava-wings.png");
    if (theImg) {
      ctx.save();
      ctx.globalAlpha = 1 - lp;
      var rad = this.rad - this.outlineW;
      ctx.drawImage(
        theImg,
        -rad * iScale,
        -rad * iScale,
        2 * rad * iScale,
        2 * rad * iScale
      );
      ctx.restore();
    }
  }

  if (!this.flag_usingAbility) return;

  if (this.flag_flying && !this.flag_isGrabbed) {
    ctx.save();
    var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
    var frame = getAnimFrame(tSinceSpawn, 2.1, 0.4, 1.5);
    var frameW = getAnimFrame(tSinceSpawn, 2.1, -8, 1.5);
    var frameY = getAnimFrame(tSinceSpawn, 2.1, 0.4, 1.5);
    var frameY2 = getAnimFrame(tSinceSpawn, 2.1, 0.3, 1.5);
    var theImg = getLoadedImg("img/blackdragon_wing1.png");
    var rad = this.rad * 0.6;
    if (theImg) {
      ctx.save();
      //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

      var extraRotate = -(-0.3 + frame) * toRadians(90.0); //spin animation

      //clip to sliwly show the claw

      ctx.rotate(extraRotate);
      var imX = 0,
        imY = this.rad;
      var imW = rad * 2.0 * 0.8,
        imH = rad * 2.0 + 5 * frameW; // * fac0to1;
      var imAnchorX = -0.65; //+   frameY/3
      imAnchorY = 1.75 - (frameY + frameY / 4 - frameY2); //top-left= 0,0, bottom-right=1,1 (canvas coords)

      ctx.drawImage(
        theImg,
        imX + imW * -imAnchorX,
        imY + imH * -imAnchorY,
        imW,
        imH
      );

      ctx.restore();
    }

    var theImg = getLoadedImg("img/blackdragon_wing2.png");
    if (theImg) {
      ctx.save();
      //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

      //console.log("getAnimFrame:" + frame);
      var extraRotate = -(-0.3 + frame) * toRadians(-90.0); //spin animation

      //clip to sliwly show the claw

      ctx.rotate(extraRotate);
      var imX = 0,
        imY = this.rad;
      var imW = rad * 2.0 * 0.8,
        imH = rad * 2.0 + 5 * frameW;
      var imAnchorX = 1.65; //-   frameY/2
      imAnchorY = 1.75 - (frameY + frameY / 4) + frameY2; //top-left= 0,0, bottom-right=1,1 (canvas coords)

      ctx.drawImage(
        theImg,
        imX + imW * -imAnchorX,
        imY + imH * -imAnchorY,
        imW,
        imH
      );

      ctx.restore();
    }

    ctx.restore();
  }
};

function BlackDragon() {
  this.lava = 0;
  BlackDragon.superClass.call(this, o_animal);
}
window.BlackDragon = BlackDragon;
//add this file as a class! (make sure to call require!)
GameObjType.setCustomClassForGameObjType(BlackDragon, o_animal, a_blackDragon);

///////
// file: js_src/gameobj/animal/Honeybee.js
///////

var Honeybee = Honeybee;
var superClass = Animal;
Honeybee.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
Honeybee.prototype.constructor = Honeybee;
Honeybee.superClass = superClass; //'class' var

//example of custom Z
/*Pelican.prototype.updateZ = function() {
    this.z = 1002;
}*/

//set custom skin name
Honeybee.prototype.getSkinName = function () {
  return (
    "/honeybee/honeybee" +
    (this.specType == 0 || this.specType == undefined ? "" : this.specType)
  );
};

Honeybee.prototype.drawSkinCustomization = function () {
  ctx.save();

  var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
  var frame = !options_lowGraphics ? getAnimFrame(tSinceSpawn, 0.2, 0.3, 2) : 0;
  var frame2 = !options_lowGraphics
    ? getAnimFrame(tSinceSpawn, 0.2, 0.3, 2)
    : 0;

  var rad = this.rad * 0.6;
  var rotAng = 30;
  var rotFrame = 2;
  var fixedAng = 20;

  var theImg = getLoadedImg("skins/honeybee/honeybee_wing2.png");
  if (theImg) {
    ctx.save();
    //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

    //console.log("getAnimFrame:" + frame);
    var extraRotate = -(-rotFrame + frame2) * toRadians(-(rotAng - 5)); //spin animation

    //clip to sliwly show the claw
    ctx.globalAlpha = 0.6;
    ctx.rotate(toRadians(-fixedAng + 10) + extraRotate);
    var imX = 0,
      imY = this.rad;
    var imW = rad * 2.0 * 0.7,
      imH = rad * 2.3; // * fac0to1;
    var imAnchorX = 0.5,
      imAnchorY = 1.6; //top-left= 0,0, bottom-right=1,1 (canvas coords)

    ctx.drawImage(
      theImg,
      imX + imW * -imAnchorX,
      imY + imH * -imAnchorY,
      imW,
      imH
    );

    ctx.restore();
  }

  var theImg = getLoadedImg("skins/honeybee/honeybee_wing1.png");
  if (theImg) {
    ctx.save();
    //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

    //console.log("getAnimFrame:" + frame);
    var extraRotate = -(-rotFrame + frame2) * toRadians(rotAng - 5); //spin animation

    //clip to sliwly show the claw
    ctx.globalAlpha = 0.6;
    ctx.rotate(toRadians(fixedAng - 10) + extraRotate);
    var imX = 0,
      imY = this.rad;
    var imW = rad * 2.3 * 0.7,
      imH = rad * 2.3; // * fac0to1;
    var imAnchorX = 0.5,
      imAnchorY = 1.6; //top-left= 0,0, bottom-right=1,1 (canvas coords)

    ctx.drawImage(
      theImg,
      imX + imW * -imAnchorX,
      imY + imH * -imAnchorY,
      imW,
      imH
    );

    ctx.restore();
  }
  var theImg = getLoadedImg("skins/honeybee/honeybee_wing1.png");
  if (theImg) {
    ctx.save();
    //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

    //console.log("getAnimFrame:" + frame);
    var extraRotate = -(-rotFrame + frame) * toRadians(rotAng); //spin animation

    //clip to sliwly show the claw
    ctx.globalAlpha = 0.5;
    ctx.rotate(toRadians(fixedAng) + extraRotate);
    var imX = 0,
      imY = this.rad;
    var imW = rad * 2.0 * 0.7,
      imH = rad * 2.3; // * fac0to1;
    var imAnchorX = 0.5,
      imAnchorY = 1.7; //top-left= 0,0, bottom-right=1,1 (canvas coords)

    ctx.drawImage(
      theImg,
      imX + imW * -imAnchorX,
      imY + imH * -imAnchorY,
      imW,
      imH
    );

    ctx.restore();
  }

  var theImg = getLoadedImg("skins/honeybee/honeybee_wing2.png");
  if (theImg) {
    ctx.save();
    //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

    //console.log("getAnimFrame:" + frame);
    var extraRotate = -(-rotFrame + frame) * toRadians(-rotAng); //spin animation

    //clip to sliwly show the claw
    ctx.globalAlpha = 0.5;
    ctx.rotate(toRadians(-fixedAng) + extraRotate);
    var imX = 0,
      imY = this.rad;
    var imW = rad * 2.0 * 0.7,
      imH = rad * 2.3; // * fac0to1;
    var imAnchorX = 0.5,
      imAnchorY = 1.7; //top-left= 0,0, bottom-right=1,1 (canvas coords)

    ctx.drawImage(
      theImg,
      imX + imW * -imAnchorX,
      imY + imH * -imAnchorY,
      imW,
      imH
    );

    ctx.restore();
  }

  ctx.restore();
};
function Honeybee() {
  Honeybee.superClass.call(this, o_animal);
}
window.Honeybee = Honeybee;
//add this file as a class! (make sure to call require!)
GameObjType.setCustomClassForGameObjType(Honeybee, o_animal, a_honeyBee);

///////
// file: js_src/gameobj/animal/Phoenix.js
///////

var Phoenix = Phoenix;
var superClass = Animal;
Phoenix.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
Phoenix.prototype.constructor = Phoenix;
Phoenix.superClass = superClass; //'class' var

Phoenix.prototype.updateZ = function () {
  this.z = 1007;
};

//set custom skin name
Phoenix.prototype.getSkinName = function () {
  return (
    "/phoenix/phoenix" +
    (this.specType == 0 || this.specType == undefined ? "" : this.specType)
  );
};

//draw image for the animal skin (along with extra images on it, eg wings)
Phoenix.prototype.drawSkinImg = function () {
  if (!options_lowGraphics) {
    var iScale = 500 / 340.0; //scale up ps image to fit (to remove blank space)
    var rad = this.rad - this.outlineW;

    var phoenix_body = getLoadedImg("./skins/phoenix/phoenix_body.png");
    var phoenix_head = getLoadedImg("./skins/phoenix/phoenix_head.png");

    var tail_num = Math.trunc(timestamp / 166) % 6;

    var tailmid = getLoadedImg(
      "./skins/phoenix/tail_mid/tail_mid_" + tail_num + ".png"
    );
    if (tailmid)
      ctx.drawImage(
        tailmid,
        -rad * iScale,
        -rad * iScale,
        2 * rad * iScale,
        2 * rad * iScale
      );

    var tail_num = Math.trunc(timestamp / 166) % 6;
    var tail_num2 = Math.trunc(timestamp / 250) % 6;

    var tail = getLoadedImg("./skins/phoenix/tail/tail_" + tail_num + ".png");
    var tail_flipped = getLoadedImg(
      "./skins/phoenix/tail_flipped/tail_" + tail_num2 + ".png"
    );

    if (tail)
      ctx.drawImage(
        tail,
        -rad * iScale,
        -rad * iScale,
        2 * rad * iScale,
        2 * rad * iScale
      );
    if (tail_flipped)
      ctx.drawImage(
        tail_flipped,
        -rad * iScale,
        -rad * iScale,
        2 * rad * iScale,
        2 * rad * iScale
      );

    if (phoenix_body)
      ctx.drawImage(
        phoenix_body,
        -rad * iScale,
        -rad * iScale,
        2 * rad * iScale,
        2 * rad * iScale
      );

    var flame_orange = Math.trunc(timestamp / 125) % 8;
    var flame_yellow = Math.trunc(timestamp / 150) % 8;
    var wing_flame_orange = getLoadedImg(
      "./skins/phoenix/wing_flame_orange/wing_flame_orange_" +
      flame_orange +
      ".png"
    );
    var wing_flame_yellow = getLoadedImg(
      "./skins/phoenix/wing_flame_yellow/wing_flame_yellow_" +
      flame_yellow +
      ".png"
    );

    if (wing_flame_orange)
      ctx.drawImage(
        wing_flame_orange,
        -rad * iScale,
        -rad * iScale,
        2 * rad * iScale,
        2 * rad * iScale
      );
    if (wing_flame_yellow)
      ctx.drawImage(
        wing_flame_yellow,
        -rad * iScale,
        -rad * iScale,
        2 * rad * iScale,
        2 * rad * iScale
      );

    var wing_flame_orange1 = getLoadedImg(
      "./skins/phoenix/wing_flame_orange_flipped/wing_flame_orange_" +
      flame_orange +
      ".png"
    );
    var wing_flame_yellow1 = getLoadedImg(
      "./skins/phoenix/wing_flame_yellow_flipped/wing_flame_yellow_" +
      flame_yellow +
      ".png"
    );

    if (wing_flame_orange1)
      ctx.drawImage(
        wing_flame_orange1,
        -rad * iScale,
        -rad * iScale,
        2 * rad * iScale,
        2 * rad * iScale
      );
    if (wing_flame_yellow1)
      ctx.drawImage(
        wing_flame_yellow1,
        -rad * iScale,
        -rad * iScale,
        2 * rad * iScale,
        2 * rad * iScale
      );

    if (phoenix_head)
      ctx.drawImage(
        phoenix_head,
        -rad * iScale,
        -rad * iScale,
        2 * rad * iScale,
        2 * rad * iScale
      );
  } else {
    Phoenix.superClass.prototype.drawSkinImg.call(this);
  }
  /*
    this.basicDrawSkinImg(); //just draw the image

    // custom animations or skin overlays
    this.drawSkinCustomization();
    */
};

Phoenix.prototype.drawWhenUnderwater = function () {
  var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
  var period = 1.5;
  var shiftAm = 1.0;
  var moveA = shiftAm * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

  var diveColor = "#f9d43b";
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = diveColor;
  var bubRad = this.flag_underWater ? this.rad * 0.15 : this.rad * 0.1;
  ctx.beginPath(); //top left, right
  ctx.arc(
    this.rad * -0.35,
    this.rad * -0.33,
    Math.max(0, bubRad + moveA),
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.beginPath();
  ctx.arc(
    this.rad * 0.35,
    this.rad * -0.32,
    Math.max(0, bubRad - moveA),
    0,
    Math.PI * 2
  );
  ctx.fill();

  ctx.beginPath(); //bottom 2
  ctx.arc(
    this.rad * 0.35,
    this.rad * 0.36,
    Math.max(0, bubRad + moveA),
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.beginPath();
  ctx.arc(
    this.rad * -0.35,
    this.rad * 0.35,
    Math.max(0, bubRad - moveA),
    0,
    Math.PI * 2
  );
  ctx.fill();
};
function Phoenix() {
  Phoenix.superClass.call(this, o_animal);
}
window.Phoenix = Phoenix;
//add this file as a class! (make sure to call require!)
GameObjType.setCustomClassForGameObjType(Phoenix, o_animal, a_phoenix);
// monster update

///////
// file: js_src/gameobj/animal/SeaMonster.js
///////

var SeaMonster = SeaMonster;
var superClass = Animal;
SeaMonster.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
SeaMonster.prototype.constructor = SeaMonster;
SeaMonster.superClass = superClass; //'class' var

//set custom skin name
SeaMonster.prototype.getSkinName = function () {
  return "seaMonster";
};

SeaMonster.prototype.drawWhenUnderwater = function () {
  var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
  var period = 1.5;
  var shiftAm = 1.0;
  var moveA = shiftAm * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

  var diveColor = "white";
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = diveColor;
  var bubRad = this.flag_underWater ? this.rad * 0.15 : this.rad * 0.1;
  ctx.beginPath(); //top left, right
  ctx.arc(
    this.rad * -0.35,
    this.rad * -0.33,
    Math.max(0, bubRad + moveA),
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.beginPath();
  ctx.arc(
    this.rad * 0.35,
    this.rad * -0.32,
    Math.max(0, bubRad - moveA),
    0,
    Math.PI * 2
  );
  ctx.fill();

  ctx.beginPath(); //bottom 2
  ctx.arc(
    this.rad * 0.35,
    this.rad * 0.36,
    Math.max(0, bubRad + moveA),
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.beginPath();
  ctx.arc(
    this.rad * -0.35,
    this.rad * 0.35,
    Math.max(0, bubRad - moveA),
    0,
    Math.PI * 2
  );
  ctx.fill();

  var diveImg = getLoadedImg("img/seamonster-dive.png");
  if (diveImg) {
    var iScale = 500 / 340.0;

    ctx.save();
    ctx.globalAlpha = 0.4;
    var rad = this.rad;
    ctx.drawImage(
      diveImg,
      -rad * iScale,
      (-rad + rad * 0.4) * iScale,
      2 * rad * iScale,
      2 * rad * iScale
    );

    ctx.restore();
  }
};
function SeaMonster() {
  SeaMonster.superClass.call(this, o_animal);
}
window.SeaMonster = SeaMonster;
//add this file as a class! (make sure to call require!)
GameObjType.setCustomClassForGameObjType(SeaMonster, o_animal, a_seaMonster);

///////
// file: js_src/gameobj/animal/LandMonster.js
///////

var LandMonster = LandMonster;
var superClass = Animal;
LandMonster.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
LandMonster.prototype.constructor = LandMonster;
LandMonster.superClass = superClass; //'class' var

//set custom skin name
LandMonster.prototype.getSkinName = function () {
  return "landmonster";
};

LandMonster.prototype.drawWhenUnderwater = function () {
  var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
  var period = 1.5;
  var shiftAm = 1.0;
  var moveA = shiftAm * Math.sin(((2.0 * Math.PI) / period) * tSinceSpawn);

  var diveColor = "#f9d43b";
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = diveColor;
  var bubRad = this.flag_underWater ? this.rad * 0.15 : this.rad * 0.1;
  ctx.beginPath(); //top left, right
  ctx.arc(
    this.rad * -0.35,
    this.rad * -0.33,
    Math.max(0, bubRad + moveA),
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.beginPath();
  ctx.arc(
    this.rad * 0.35,
    this.rad * -0.32,
    Math.max(0, bubRad - moveA),
    0,
    Math.PI * 2
  );
  ctx.fill();

  ctx.beginPath(); //bottom 2
  ctx.arc(
    this.rad * 0.35,
    this.rad * 0.36,
    Math.max(0, bubRad + moveA),
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.beginPath();
  ctx.arc(
    this.rad * -0.35,
    this.rad * 0.35,
    Math.max(0, bubRad - moveA),
    0,
    Math.PI * 2
  );
  ctx.fill();
};
function LandMonster() {
  LandMonster.superClass.call(this, o_animal);
}
window.LandMonster = LandMonster;
//add this file as a class! (make sure to call require!)
GameObjType.setCustomClassForGameObjType(LandMonster, o_animal, a_landMonster);

///////
// file: js_src/gameobj/SinkHole.js
///////

var superClass = GameObj;
SinkHole.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
SinkHole.prototype.constructor = SinkHole;
SinkHole.superClass = superClass; //'class' var

SinkHole.prototype.updateZ = function () {
  this.z = -101;
};

//override draw (things like other effects are drawn seperately)
SinkHole.prototype.customDraw = function (batchDrawOutline) {
  ctx.save();
  console.log("specType: " + this.specType);
  if (this.specType == 0) {
    this.drawOutlinedCircle("", "#9F8641");
    //drawCircle(0, 0, this.rad, "#9F8641");

    ctx.globalAlpha = 0.6;
    drawCircle(0 + this.rPer, 1, Math.max(0, this.rad * 0.9), "#5C4E28");
    ctx.globalAlpha = 0.7;
    drawCircle(0 - this.rPer, 1, Math.max(0, this.rad * 0.8), "#40371D");
    ctx.globalAlpha = 0.9;
    drawCircle(0 - this.rPer, 1, Math.max(0, this.rad * 0.8), "#40371D");
    ctx.globalAlpha = 0.5;
    drawCircle(0 - this.rPer * 3, 1, Math.max(0, this.rad * 0.5), "black");
  } else {
    /*
        var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
        var period = 1.2;
        var xShift = 2.5 * Math.cos((2.0 * Math.PI) / period * (tSinceSpawn));
        var yShift = 2.5 * Math.sin((2.0 * Math.PI) / period * (tSinceSpawn));


        this.drawOutlinedCircle("", "#2CAAC4");

        drawCircle(0 + xShift / 4.5 + this.rPer, 1 + yShift / 1.5, Math.max(0, this.rad - 14), "#29A0BA");
        drawCircle(0 + xShift / 1.5 - this.rPer * 2, yShift, Math.max(0, this.rad - 18.5 + yShift / 5), "#2B8CAA");
        drawCircle(0 + xShift / 1.5 - this.rPer * 2, yShift, Math.max(0, this.rad - 24.5 + yShift / 11), "#28829E");
        */
    this.drawOutlinedCircle("", "#9F8641");
    //drawCircle(0, 0, this.rad, "#9F8641");

    drawCircle(
      0 - this.rPer,
      0 - this.rPer,
      Math.max(0, this.rad - 7),
      "#7E6A35"
    );

    drawCircle(0 + this.rPer, 1, Math.max(0, this.rad - 14), "#5C4E28");

    drawCircle(
      0 - this.rPer * 2 - 3,
      1,
      Math.max(0, this.rad - 18.5),
      "#40371D"
    );
  }
  ctx.restore();
};

function SinkHole() {
  SinkHole.superClass.call(this, o_spiderWeb);

  this.webTransparency = 0;

  //set vars for this class
  this.doesDrawEffectScale = true;
  this.drawEffectScale_Slow = true;
}
window.SinkHole = SinkHole;
//add this file as a class! (make sure to call require!)
GameObjType.setCustomClassForGameObjType(SinkHole, o_sinkHole);
// birds update 2

///////
// file: js_src/gameobj/animal/Pigeon.js
///////

var Pigeon = Pigeon;
var superClass = Animal;
Pigeon.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
Pigeon.prototype.constructor = Pigeon;
Pigeon.superClass = superClass; //'class' var

////example of custom Z
//Pigeon.prototype.updateZ = function () {
//    this.z = 1000 + this.rad;
//    //if (this.flag_flying || this.flag_climbingHill)
//    //    this.z = 1000 + this.rad;
//}

Pigeon.prototype.animalInfo = function () {
  var infoO = {};

  switch (this.animalSpecies) {
    case 0:
      infoO.aniName = "Pigeon";
      break;
    case 1:
      infoO.aniName = "Rare White Dove";
      infoO.upgradeText += "\n(Doves fly faster!)";
      break;
  }
  infoO.aniCol = "#FF9000";
  infoO.skinName = "pigeon/" + this.animalSpecies + "/pigeon";
  infoO.upgradeText =
    "UPGRADED to " + infoO.aniName + "!\nHold W to fly around. ";
  return infoO;
};

//set custom skin name
Pigeon.prototype.getSkinName = function () {
  var skin = "pigeon/" + this.animalSpecies + "/pigeon";
  //if (!options_lowGraphics)
  skin += this.specType == 0 ? "" : this.specType;

  return skin;
};

Pigeon.prototype.drawSkinCustomization = function () {
  if (!this.flag_usingAbility) return;

  var skins = "skins";

  //if (!options_lowGraphics)
  {
    var iScale = 500 / 340.0;

    if (this.flag_flying && !this.flag_isGrabbed) {
      ctx.save();

      var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
      var frame = !options_lowGraphics
        ? getAnimFrame(tSinceSpawn, 0.5, 0.3, 2)
        : this.birdNoAnimationFlyWingAngle;
      var theImg = getLoadedImg(
        skins + "/pigeon/" + this.animalSpecies + "/pigeon_wing1.png?a=1"
      );
      if (theImg) {
        ctx.save();
        //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

        //console.log("getAnimFrame:" + frame);
        var extraRotate = -(-0.2 + frame) * toRadians(90.0); //spin animation

        //clip to sliwly show the claw
        var rad = this.rad * 0.8;
        ctx.rotate(toRadians(45) + extraRotate);
        var imX = 0,
          imY = this.rad;
        var imW = rad * 2.0 * 0.62,
          imH = rad * 2.5; // * fac0to1;
        var imAnchorX = 0.2,
          imAnchorY = 1.7; //top-left= 0,0, bottom-right=1,1 (canvas coords)

        ctx.drawImage(
          theImg,
          imX + imW * -imAnchorX,
          imY + imH * -imAnchorY,
          imW,
          imH
        );

        ctx.restore();
      }

      var theImg = getLoadedImg(
        skins + "/pigeon/" + this.animalSpecies + "/pigeon_wing2.png?a=1"
      );
      if (theImg) {
        ctx.save();
        //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

        //console.log("getAnimFrame:" + frame);
        var extraRotate = -(-0.2 + frame) * toRadians(-90.0); //spin animation

        //clip to sliwly show the claw
        var rad = this.rad * 0.8;
        ctx.rotate(toRadians(-45) + extraRotate);
        var imX = 0,
          imY = this.rad;
        var imW = rad * 2.0 * 0.62,
          imH = rad * 2.5; // * fac0to1;
        var imAnchorX = 0.8,
          imAnchorY = 1.7; //top-left= 0,0, bottom-right=1,1 (canvas coords)

        ctx.drawImage(
          theImg,
          imX + imW * -imAnchorX,
          imY + imH * -imAnchorY,
          imW,
          imH
        );

        ctx.restore();
      }

      ctx.restore();
    }

    //console.log(this.specType)
    if (this.specType != 0 && this.specType != undefined) {
      var theHead = getLoadedImg(
        skins + "/pigeon/" + this.animalSpecies + "/pigeon_head.png"
      );
      if (theHead) {
        ctx.save();
        var rad = this.rad;
        ctx.drawImage(
          theHead,
          -rad * iScale,
          (-rad + rad * 0.1) * iScale,
          2 * rad * iScale,
          2 * rad * iScale
        );
        ctx.restore();
      }
    }
  }
};

function Pigeon() {
  Pigeon.superClass.call(this, o_animal);
}
window.Pigeon = Pigeon;
//add this file as a class! (make sure to call require!)
GameObjType.setCustomClassForGameObjType(Pigeon, o_animal, a_pigeon);

///////
// file: js_src/gameobj/animal/Toucan.js
///////

var Toucan = Toucan;
var superClass = Animal;
Toucan.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
Toucan.prototype.constructor = Toucan;
Toucan.superClass = superClass; //'class' var

Toucan.prototype.animalInfo = function () {
  var infoO = {};
  /*
    switch (this.animalSpecies) {
        case 0:
            infoO.aniName = "Toco Toucan";
            break;
        case 1:
            infoO.aniName = "Choco Toucan";
            break;
        case 2:
            infoO.aniName = "Keel-Billed Toucan";
            break;
        case 3:
            infoO.aniName = "Fiery-Billed Toucan";
            break;
    }
    */

  if (this.animalSpecies == 4) infoO.aniName = "rare Lava Toucan";
  else infoO.aniName = "Toucan";

  infoO.upgradeText =
    "UPGRADED to " +
    infoO.aniName +
    "!\nHold right click (or W) to fly!\n(HINT: Start flying from a fruit tree or bush to throw fruit upon landing!)";
  infoO.aniCol = "#FF9000";
  infoO.skinName = "toucan/" + this.animalSpecies + "/toucan";
  return infoO;
};

////example of custom Z
//Toucan.prototype.updateZ = function () {
//    this.z = 1000 + this.rad;
//    //if (this.flag_flying || this.flag_climbingHill)
//    //    this.z = 10001 + this.rad;
//}

//set custom skin name
Toucan.prototype.getSkinName = function () {
  var skin =
    "toucan/" +
    this.animalSpecies +
    "/toucan" +
    (this.specType == 0 ? "" : this.specType);

  return skin;
};

Toucan.prototype.drawSkinCustomization = function () {
  if (!this.flag_usingAbility) return;

  var iScale = 500 / 340.0;
  {
    if (this.flag_flying && !this.flag_isGrabbed) {
      ctx.save();

      var wings = this.animalSpecies == 5 ? "skins/toucan/5/" : "skins/toucan/";

      var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
      var frame = !options_lowGraphics
        ? getAnimFrame(tSinceSpawn, 0.5, 0.3, 2)
        : this.birdNoAnimationFlyWingAngle;
      var theImg = getLoadedImg(wings + "toucan_wing1.png?a=1");
      if (theImg) {
        ctx.save();
        //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

        //console.log("getAnimFrame:" + frame);
        var extraRotate = -(-0.2 + frame) * toRadians(90.0); //spin animation

        //clip to sliwly show the claw
        var rad = this.rad * 0.8;
        ctx.rotate(toRadians(45) + extraRotate);
        var imX = 0,
          imY = this.rad;
        var imW = rad * 2.0 * 0.62,
          imH = rad * 2.5; // * fac0to1;
        var imAnchorX = 0.2,
          imAnchorY = 1.7; //top-left= 0,0, bottom-right=1,1 (canvas coords)

        ctx.drawImage(
          theImg,
          imX + imW * -imAnchorX,
          imY + imH * -imAnchorY,
          imW,
          imH
        );

        ctx.restore();
      }

      var theImg = getLoadedImg(wings + "toucan_wing2.png?a=1");
      if (theImg) {
        ctx.save();
        //var fac0to1 = Math.min(1.0, (timestamp - this.spawnTime) / 300.0);

        //console.log("getAnimFrame:" + frame);
        var extraRotate = -(-0.2 + frame) * toRadians(-90.0); //spin animation

        //clip to sliwly show the claw
        var rad = this.rad * 0.8;
        ctx.rotate(toRadians(-45) + extraRotate);
        var imX = 0,
          imY = this.rad;
        var imW = rad * 2.0 * 0.62,
          imH = rad * 2.5; // * fac0to1;
        var imAnchorX = 0.8,
          imAnchorY = 1.7; //top-left= 0,0, bottom-right=1,1 (canvas coords)

        ctx.drawImage(
          theImg,
          imX + imW * -imAnchorX,
          imY + imH * -imAnchorY,
          imW,
          imH
        );

        ctx.restore();
      }

      ctx.restore();
    }

    //console.log(this.specType)
    if (this.specType != 0 && this.specType != undefined) {
      var head = "skins/toucan/" + this.animalSpecies + "/";

      if (this.hasZombieOverlay)
        head = "skins/zombie/toucan/" + this.animalSpecies + "/";
      var theHead = getLoadedImg(head + "toucan_head.png?a=1");
      if (theHead) {
        ctx.save();
        var rad = this.rad;
        ctx.drawImage(
          theHead,
          -rad * iScale,
          (-rad + rad * 0.1) * iScale,
          2 * rad * iScale,
          2 * rad * iScale
        );
        ctx.restore();
      }
    }
  }
};

function Toucan() {
  Toucan.superClass.call(this, o_animal);
}
window.Toucan = Toucan;
//add this file as a class! (make sure to call require!)
GameObjType.setCustomClassForGameObjType(Toucan, o_animal, a_toucan);

///////
// file: js_src/gameobj/animal/Tiger.js
///////

var Tiger = Tiger;
var superClass = Animal;
Tiger.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
Tiger.prototype.constructor = Tiger;
Tiger.superClass = superClass; //'class' var

Tiger.prototype.animalInfo = function () {
  var infoO = {};
  switch (this.animalSpecies) {
    case 0:
      infoO.aniName = "Tiger";
      break;
    case 1:
      infoO.aniName = "rare White Tiger";
      break;
  }
  infoO.aniName = "Tiger";
  infoO.aniDesc = "";
  infoO.upgradeText =
    "UPGRADED to " +
    infoO.aniName +
    "!\n Tigers can launch an ambush attack (HOLD W to grow a bush)!";
  infoO.aniCol = "#FF9000";
  infoO.skinName = "tiger/" + this.animalSpecies + "/tiger";
  return infoO;
};

//set custom skin name
Tiger.prototype.getSkinName = function () {
  return (
    "tiger/" +
    this.animalSpecies +
    "/tiger" +
    (this.specType == 0 ? "" : this.specType)
  );
};

function Tiger() {
  Tiger.superClass.call(this, o_animal);
}
window.Tiger = Tiger;
//add this file as a class! (make sure to call require!)
GameObjType.setCustomClassForGameObjType(Tiger, o_animal, a_tiger);

///////
// file: js_src/gameobj/animal/BoaConstrictor.js
///////

var superClass = Animal;
BoaConstrictor.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
BoaConstrictor.prototype.constructor = BoaConstrictor;
BoaConstrictor.superClass = superClass; //'class' var

//example of custom Z
/*BoaConstrictor.prototype.updateZ = function() {
    this.z = 1002;
}*/

//set custom skin name
BoaConstrictor.prototype.getSkinName = function () {
  return "boaConstrictor" + (this.flag_usingAbility ? "2" : "");
};

BoaConstrictor.prototype.drawUnderSkinImg = function () {
  if (this.flag_usingAbility) return;

  var rad = this.rad - this.outlineW;
  var iScale = 500 / 340.0;
  var tongue = getLoadedImg("skins/boa/tongue.png");

  var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
  var frame = options_lowGraphics ? 0 : getAnimFrame(tSinceSpawn, 0.5, 5, 0.5);
  var yOffset = options_lowGraphics ? 0 : 5;
  if (tongue) {
    ctx.drawImage(
      tongue,
      -rad * iScale,
      -(rad + yOffset + frame) * iScale,
      2 * rad * iScale,
      2 * rad * iScale
    );
  }
};

function BoaConstrictor() {
  BoaConstrictor.superClass.call(this, o_animal);
}
window.BoaConstrictor = BoaConstrictor;
//add this file as a class! (make sure to call require!)
GameObjType.setCustomClassForGameObjType(
  BoaConstrictor,
  o_animal,
  a_boaConstrictor
);

///////
// file: js_src/gameobj/animal/Cobra.js
///////

var superClass = Animal;
Cobra.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
Cobra.prototype.constructor = Cobra;
Cobra.superClass = superClass; //'class' var

//example of custom Z
/*Cobra.prototype.updateZ = function() {
    this.z = 1002;
}*/

//set custom skin name
Cobra.prototype.getSkinName = function () {
  return "cobra" + (this.flag_usingAbility ? "2" : "");
};

Cobra.prototype.drawUnderSkinImg = function () {
  if (this.flag_usingAbility) return;
  var rad = this.rad - this.outlineW;
  var iScale = 500 / 340.0;
  var tongue = getLoadedImg("skins/boa/tongue.png");

  var tSinceSpawn = (timestamp - this.spawnTime) / 1000.0;
  var frame = options_lowGraphics ? 0 : getAnimFrame(tSinceSpawn, 0.5, 5, 0.5);
  var yOffset = options_lowGraphics ? 0 : 5;
  if (tongue) {
    ctx.drawImage(
      tongue,
      -rad * iScale,
      -(rad + yOffset + frame) * iScale,
      2 * rad * iScale,
      2 * rad * iScale
    );
  }
};

function Cobra() {
  Cobra.superClass.call(this, o_animal);
}
window.Cobra = Cobra;
//add this file as a class! (make sure to call require!)
GameObjType.setCustomClassForGameObjType(Cobra, o_animal, a_cobra);
// custom objects

///////
// file: js_src/gameobj/Fire.js
///////

var Fire = Fire;
var superClass = GameObj;
Fire.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
Fire.prototype.constructor = Fire;
Fire.superClass = superClass; //'class' var

Fire.prototype.updateZ = function () {
  this.z = 1005;
};
//override draw (things like other effects are drawn seperately)
Fire.prototype.customDraw = function (batchDrawOutline) {
  if (!options_lowGraphics) {
    var period = 1.0; //periodic func with time
    var p_min = 0.15,
      p_max = 0.8; //set these!
    var amp = 0.5 * (p_max - p_min);
    var flashA =
      p_min +
      amp +
      amp * Math.sin(((2.0 * Math.PI) / period) * (timestamp / 1000.0));

    ctx.save();
    ctx.globalAlpha *= flashA;
    // drawCircle(0, 0, Math.max(0, this.rad), "#F6EA65");
    ctx.restore();

    //glow stronger/weaker like a fire
    var period = 1.0; //periodic func with time
    var p_min = 0.85,
      p_max = 1.0; //set these!
    var amp = 0.5 * (p_max - p_min);
    var moveA =
      p_min +
      amp +
      amp * Math.sin(((2.0 * Math.PI) / period) * (timestamp / 1000.0));

    var imNum = Math.trunc(timestamp / 120) % 5;

    var theImg = getLoadedImg("img/fire/" + imNum + ".png");
    if (theImg) {
      var imX = 0,
        imY = this.rad * 0.4;
      var imW = (this.rad * 2.0 * (2.0 + moveA * 2.0)) / 3.0,
        imH = this.rad * 2 * moveA;
      var imAnchorX = 0.5,
        imAnchorY = 0.95; //top-left= 0,0, bottom-right=1,1 (canvas coords)

      ctx.save();

      ctx.globalAlpha *= this.onFireEffA * moveA;
      ctx.rotate(this.angle);
      ctx.drawImage(
        theImg,
        imX + imW * -imAnchorX,
        imY + imH * -imAnchorY,
        imW,
        imH
      );

      ctx.restore();
    }
  } else {
    // low graphics
    var period = 1.0; //periodic func with time
    var p_min = 0.85,
      p_max = 1.0; //set these!
    var amp = 0.5 * (p_max - p_min);
    var moveA =
      p_min +
      amp +
      amp * Math.sin(((2.0 * Math.PI) / period) * (timestamp / 1000.0));

    var imNum = Math.trunc(timestamp / 120) % 5;

    var theImg = getLoadedImg("img/fire/0.png");
    if (theImg) {
      var imX = 0,
        imY = this.rad * 0.4;
      var imW = (this.rad * 2.0 * (2.0 + moveA * 2.0)) / 3.0,
        imH = this.rad * 2 * moveA;
      var imAnchorX = 0.5,
        imAnchorY = 0.95; //top-left= 0,0, bottom-right=1,1 (canvas coords)

      ctx.save();

      //ctx.globalAlpha *= this.onFireEffA * moveA;
      ctx.rotate(this.angle);
      ctx.drawImage(
        theImg,
        imX + imW * -imAnchorX,
        imY + imH * -imAnchorY,
        imW,
        imH
      );

      ctx.restore();
    }
  }
};

function Fire() {
  Fire.superClass.call(this, o_fire);

  this.webTransparency = 0;

  //set vars for this class
  this.doesDrawEffectScale = true;
  this.drawEffectScale_Slow = true;
}
window.Fire = Fire;
//add this file as a class! (make sure to call require!)
GameObjType.setCustomClassForGameObjType(Fire, o_fire);

///////
// file: js_src/gameobj/FireBall.js
///////

var superClass = GameObj;
FireBall.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
FireBall.prototype.constructor = FireBall;
FireBall.superClass = superClass; //'class' var

FireBall.prototype.updateZ = function () {
  this.z = 1005;
};
//override draw (things like other effects are drawn seperately)
FireBall.prototype.customDraw = function (batchDrawOutline) {
  //DEBUG

  if (!options_lowGraphics) {
    //on fire glow

    //glow stronger/weaker like a fire
    var period = 1.0; //periodic func with time
    var p_min = 0.15,
      p_max = 0.8; //set these!
    var amp = 0.5 * (p_max - p_min);
    var flashA =
      p_min +
      amp +
      amp * Math.sin(((2.0 * Math.PI) / period) * (timestamp / 1000.0));

    ctx.save();
    {
      ctx.globalAlpha *= flashA;
      // drawCircle(0, 0, Math.max(0, this.rad), "#F6EA65");
    }
    ctx.restore();
    //glow stronger/weaker like a fire
    var period = 1.0; //periodic func with time
    var p_min = 0.85,
      p_max = 1.0; //set these!
    var amp = 0.5 * (p_max - p_min);
    var moveA =
      p_min +
      amp +
      amp * Math.sin(((2.0 * Math.PI) / period) * (timestamp / 1000.0));

    var imNum = Math.trunc(timestamp / 120) % 5;
    //console.log("fire: " + imNum);
    //var theImg = getLoadedImg(imNum == 1 ? "img/fire.png" : "img/fire2.png");
    var theImg = getLoadedImg("img/fireball/" + imNum + ".png");
    if (theImg) {
      var imX = 0,
        imY = this.rad * 0.4;
      var imW = (this.rad * 2.0 * (2.0 + moveA * 2.0)) / 3.0,
        imH = this.rad * 3.5 * moveA;
      var imAnchorX = 0.5,
        imAnchorY = 0.95; //top-left= 0,0, bottom-right=1,1 (canvas coords)

      ctx.save();
      {
        ctx.globalAlpha *= this.onFireEffA * moveA;
        ctx.rotate(this.angle);
        ctx.drawImage(
          theImg,
          imX + imW * -imAnchorX,
          imY + imH * -imAnchorY,
          imW,
          imH
        );
      }
      ctx.restore();
    } else {
      //console.log("not found: " + imNum)
    }
  } else {
    console.log("its low graphic!");
    var theImg = getLoadedImg("img/fireball/0.png");
    if (theImg) {
      var period = 1.0; //periodic func with time
      var p_min = 0.85,
        p_max = 1.0; //set these!
      var amp = 0.5 * (p_max - p_min);
      var moveA =
        p_min +
        amp +
        amp * Math.sin(((2.0 * Math.PI) / period) * (timestamp / 1000.0));

      var imX = 0,
        imY = this.rad * 0.4;
      var imW = (this.rad * 2.0 * (2.0 + moveA * 2.0)) / 3.0,
        imH = this.rad * 3.5 * moveA;
      var imAnchorX = 0.5,
        imAnchorY = 0.95; //top-left= 0,0, bottom-right=1,1 (canvas coords)

      ctx.save();
      {
        ctx.rotate(this.angle);
        ctx.drawImage(
          theImg,
          imX + imW * -imAnchorX,
          imY + imH * -imAnchorY,
          imW,
          imH
        );
      }
      ctx.restore();
    }
  }
};

function FireBall() {
  FireBall.superClass.call(this, o_fireBall);
}

window.FireBall = FireBall;
//add this file as a class! (make sure to call require!)
GameObjType.setCustomClassForGameObjType(FireBall, o_fireBall);

//battle royal update

///////
// file: js_src/gameobj/AnimalCarcass.js
///////

var superClass = GameObj;
AnimalCarcass.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
AnimalCarcass.prototype.constructor = AnimalCarcass;
AnimalCarcass.superClass = superClass; //'class' var
AnimalCarcass.prototype.nickName = "mope.io";
AnimalCarcass.prototype.fadeAway = false;
AnimalCarcass.prototype.webTransparency = 100;
AnimalCarcass.prototype.carcassType = 0;
// if an object has to be manually drawn by the interface then set this to true
//AnimalCarcass.prototype.customInterfaceDraw = false;
// do not animate radius on spawning
AnimalCarcass.prototype.updateZ = function () {
  this.z = -153 + this.rad;
};

AnimalCarcass.prototype.getNameSize = function () {
  return 6.0; //Math.max(~~(.3 * this.size), 24)
};

AnimalCarcass.prototype.setNick = function (a) {
  //if (this.nickName = a) {
  this.nickName = a;
  if (null == this.nickTXT) {
    this.nickTXT = new CachedText(this.getNameSize(), "#FFFFFF"); //"#043400");
    this.nickTXT.strokeW = 1.5;

    this.nickTXT.renderScale = 5.0; //render larger to undo 'zoom of 3x'
    this.nickTXT.setText(this.nickName);
  } else {
    this.nickTXT.setFontSize(this.getNameSize());
    this.nickTXT.setText(this.nickName);
  }
  //}
};

AnimalCarcass.prototype.customDraw = function (batchDrawOutline) {
  ctx.save();

  var nameIdealOp = 0.3;
  if (this.fadeAway) {
    var opacity = this.webTransparency / 100;
    ctx.globalAlpha = opacity;
    nameIdealOp = Math.min(nameIdealOp, opacity);
  } else ctx.globalAlpha = 0.8;

  var theImg = getLoadedImg("img/carcass/" + this.carcassType + ".png");
  if (theImg) {
    var rad = this.rad;
    ctx.rotate(this.angle);

    //ctx.shadowOffsetX = 2;
    //ctx.shadowOffsetY = 2;
    //ctx.shadowColor = "black";
    //ctx.shadowBlur = 10;
    ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);
  }

  ctx.restore();
  this.drawNickName(nameIdealOp);
};

AnimalCarcass.prototype.drawNickName = function (idealOp) {
  if (this.nickName && this.nickTXT && !options_noNames) {
    ctx.save();
    ctx.globalAlpha = idealOp; //name alpha
    //draw cached name
    this.nickTXT.x = 0;
    this.nickTXT.y = this.rad;
    this.nickTXT.draw();

    ctx.restore();
  }
};

AnimalCarcass.prototype.readCustomData_onNewlyVisible = function (msg) {
  var nickName = msg.readString();
  this.carcassType = msg.readUInt8();
  this.fadeAway = msg.readUInt8() == 1;
  if (this.fadeAway) this.webTransparency = msg.readUInt16();
  this.setNick(nickName ? nickName : "mope.io");
};
//custom data for this class (must be matched by server-side write of this data!)
AnimalCarcass.prototype.readCustomData_onUpdate = function (msg) {
  if (this.fadeAway) this.webTransparency = msg.readUInt16();
};

function AnimalCarcass() {
  AnimalCarcass.superClass.call(this, o_animalCarcass);

  this.shrinkedRad = 0;
  //this.n_shrinkedRad=0; //smooth animation- set this var

  //console.log("class was spawned!");
}
window.AnimalCarcass = AnimalCarcass;
//add this file as a class! (make sure to call require!)
GameObjType.setCustomClassForGameObjType(AnimalCarcass, o_animalCarcass);

///////
// file: js_src/gameobj/Chilli.js
///////

var superClass = GameObj;
Chilli.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
Chilli.prototype.constructor = Chilli;
Chilli.superClass = superClass;
Chilli.prototype.chilliType = 0;
Chilli.prototype.updateZ = function () {
  this.z = -153;
};

Chilli.prototype.customDraw = function (batchDrawOutline) {
  ctx.save();
  var theImg = getLoadedImg(
    "img/chilli/" +
    this.chilliType +
    "/chilli" +
    (this.isEdibleOutlined() ? "_e" : "") +
    ".png"
  );
  if (theImg) {
    var rad = this.rad;
    ctx.rotate(this.angle);
    ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);
  }
  ctx.restore();
};

Chilli.prototype.readCustomData_onNewlyVisible = function (msg) {
  this.chilliType = msg.readUInt8();
};

function Chilli() {
  Chilli.superClass.call(this, o_chilli);
  this.doesDrawEffectScale = true;
}
window.Chilli = Chilli;
//add this file as a class! (make sure to call require!)
GameObjType.setCustomClassForGameObjType(Chilli, o_chilli);

///////
// file: js_src/gameobj/animal/BigCat.js
///////

var BigCat = BigCat;
var superClass = Animal;
BigCat.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
BigCat.prototype.constructor = BigCat;
BigCat.superClass = superClass; //'class' var
//var hasSkinDrawn = false;
//BigCat.prototype.bodySpots = [];
//set custom skin name

BigCat.prototype.objSkinSpotsCanvas = null;
BigCat.prototype.getSkinName = function () {
  return this.animalInfo().skinName;
};

BigCat.prototype.animalInfo = function () {
  var infoO = {};

  var skin = "";
  switch (this.animalSpecies) {
    case 0:
      infoO.aniName = "Cheetah";
      infoO.upgradeText =
        "UPGRADED to Cheetah!\n Press W to get a speed boost!";
      skin = "cheetah";
      break;
    case 1:
      infoO.aniName = "Jaguar";
      infoO.upgradeText =
        "UPGRADED to JAGUAR!\n Press W to get a speed boost!\n(Jaguars can climb hills!)";
      skin = "jaguar";
      break;
    case 2:
      infoO.aniName = "Leopard";
      infoO.upgradeText =
        "UPGRADED to LEOPARD!\n Press W to get a speed boost!\n(Leopards can dive longer)";
      skin = "leopard";
      break;
    case 3:
      infoO.aniName = "Black Panther";
      infoO.upgradeText =
        "UPGRADED to BigCat!\n Press W to get a speed boost!\n(Black Panthers are fast on mud)";
      skin = "blackpanther";
      break;
  }

  infoO.aniCol = "#CAC05B";
  infoO.skinName = "bigcat/" + skin;
  return infoO;
};

function BigCat() {
  BigCat.superClass.call(this, o_animal);
}

window.BigCat = BigCat;
//add this file as a class! (make sure to call require!)
GameObjType.setCustomClassForGameObjType(BigCat, o_animal, a_bigCat);

//interface controls

///////
// file: js_src/interface/InterfaceButton.js
///////

//button that appears in animal choice interface
function InterfaceButton(x, y, w, h, txt, fontSize) {
  //button gets resized on draw (due to varying screen size)
  var pr = interfS;
  this.x = x;
  this.y = y;
  this.w = w; //width of pressable region
  this.h = h;
  this.label = txt;
  this.font = Number(fontSize) ? Number(fontSize) : 30;
  this.isVisible = true;
  this.hoverColor = "#16932A";
  this.defaultColor = "#0aa633";
  this.alpha = 1;
  this.txtAlpha = 1;
  this.ctx = ctx;
  //this.text = infoForAnimalType(aniT).aniName;//isOcean ? "Ocean Animal" : "Land Animal";
  this.buttonTXT = new CachedText(12.0, "white");
  this.buttonTXT.renderScale = 1.5;

  this.isHighLighted = false; //highlight if mouse goes on it
  this.showLabeleOnHover = false;
  this.textShadow = false;
  this.buttonScaleF = 1.0; //scale primary button
  //this.touchMarginEx=20.0;
  this.strokeWidth = 4 * pr;

  //used to check clicks
  this.testPosHitsButton = function (posX, posY) {
    posX = posX;
    posY = posY;
    var min_x = this.x; // - this.w / 2;
    var max_x = this.x + this.w; // / 2;
    var min_y = this.y; // - this.h / 2;
    var max_y = this.y + this.h; // / 2;

    if (posX < min_x || posX > max_x)
      //outside x bounds
      return false;
    if (posY < min_y || posY > max_y) {
      //outside y bounds
      return false;
    } else return true;

    //if (posX > min_x || posX < max_x)
    //    return true;

    //if (posY > min_y || posY < max_y) {
    //    return true;
    //} else
    //    return false;
  };
  (this.setPosAndSize = function (newX, newY, newW, newH, anchorX, anchorY) {
    this.w = newW;
    this.h = newH;
    //set middle x/y based on anchorX/anchorY -(0,0) is top-left corner
    this.x = newX + newW * (0.5 - anchorX);
    this.y = newY + newH * (0.5 - anchorY);
  }),
    (this.draw = function () {
      //draw button bg square
      if (!this.isVisible) return;
      this.update();
      this.ctx.save();
      this.ctx.translate(this.x, this.y);
      this.ctx.scale(this.buttonScaleF, this.buttonScaleF);
      var origA = this.alpha;

      //console.log("drawing button at "+this.x,this.y);

      //bg square
      //  ctx.globalAlpha = origA * 0.75;
      this.ctx.fillStyle = this.defaultColor;
      this.ctx.strokeStyle = "#116c17";
      this.ctx.lineWidth = this.strokeWidth;
      this.roundRect(0, 0, this.w, this.h, 5, true, true);
      //  ctx.fillRect(0 - this.w / 2, 0 - this.h / 2, this.w, this.h);
      //draw highlight
      if (this.isHighLighted) {
        this.ctx.fillStyle = this.hoverColor;
        //    ctx.globalAlpha = origA * 0.2;
        //  ctx.fillRect(0 - this.w / 2, 0 - this.h / 2, this.w, this.h);
        this.roundRect(0, 0, this.w, this.h, 5, true, false);
      }

      if (!this.showLabeleOnHover) {
        this.ctx.globalAlpha = this.txtAlpha;
        this.drawText(this.w / 2, this.h / 2);
      } else if (this.isHighLighted && this.showLabeleOnHover) {
        this.drawTextOnHowever();
      }
      //ctx.font = 23 * interfS + "px Arial";
      //ctx.fillText(this.text, 0, -this.h *0.5 * 0.75);
      //}
      this.ctx.restore();
      this.onAfterDraw();
      // add to mopeButtonList
    });

  this.drawTextOnHowever = function () {
    this.drawText(this.w / 2, this.h / 2);
  };

  this.drawText = function (x, y) {
    this.buttonTXT.setText(this.label);
    this.buttonTXT.strokeW = this.isHighLighted && !this.textShadow ? 0 : 1;
    this.buttonTXT.setFontSize(this.font);
    this.buttonTXT.x = x;
    this.buttonTXT.y = y; //-this.h;// / 2);// * 0.75;
    this.buttonTXT.draw();
  };

  /**
   * Draws a rounded rectangle using the current state of the canvas.
   * If you omit the last three params, it will draw a rectangle
   * outline with a 5 pixel border radius
   * @param {Number} x The top left x coordinate
   * @param {Number} y The top left y coordinate
   * @param {Number} width The width of the rectangle
   * @param {Number} height The height of the rectangle
   * @param {Number} [radius = 5] The corner radius; It can also be an object
   *                 to specify different radii for corners
   * @param {Number} [radius.tl = 0] Top left
   * @param {Number} [radius.tr = 0] Top right
   * @param {Number} [radius.br = 0] Bottom right
   * @param {Number} [radius.bl = 0] Bottom left
   * @param {Boolean} [fill = false] Whether to fill the rectangle.
   * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
   */
  this.roundRect = function (x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == "undefined") {
      stroke = true;
    }
    if (typeof radius === "undefined") {
      radius = 5;
    }
    if (typeof radius === "number") {
      radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
      var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
      for (var side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side];
      }
    }
    this.ctx.globalAlpha = this.alpha;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius.tl, y);
    this.ctx.lineTo(x + width - radius.tr, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    this.ctx.lineTo(x + width, y + height - radius.br);
    this.ctx.quadraticCurveTo(
      x + width,
      y + height,
      x + width - radius.br,
      y + height
    );
    this.ctx.lineTo(x + radius.bl, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    this.ctx.lineTo(x, y + radius.tl);
    this.ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    this.ctx.closePath();
    if (fill) this.ctx.fill();
    if (stroke) this.ctx.stroke();
  };

  /* OVERRIDABLE METHODS*/
  this.onClick = function () {
    // override this method to perform custom action
  };

  this.onMouseMove = function () {
    // override this method to perform custom action
  };

  this.update = function () {
    // override this method to dynamically update button x/y;
  };

  this.onInterfaceReset = function () {
    // call this method when interface is reset
    log(this.label + ".onInterfaceReset");
  };

  /**
   * Override this method to do custom drawing immediately after draw is finished.
   */
  this.onAfterDraw = function () { };
}
window.InterfaceButton = InterfaceButton;

///////
// file: js_src/interface/GameMode.js
///////

GameMode.prototype = {
  mode: 0,
  state: 0,
  myPlayer: null,
};
GameMode.prototype.chatAllowed = true;
GameMode.prototype.isHalloween = false;
GameMode.prototype.stamp = 0;

GameMode.prototype.interface = function () { };
GameMode.prototype.drawMap = function () { };
GameMode.prototype.interfaceReset = function () { };
GameMode.prototype.main = function (msg) {
  // read all messages related to this new game mode
};

GameMode.prototype.onInit = function (msg) { };
GameMode.prototype.drawCustomObjs = function (customInterfaceObjList) { };

GameMode.prototype.worldUpdate = function (msg) { };

GameMode.prototype.setPlayer = function () {
  this.myPlayer = gameObjsByID[myPlayerID];
};

function GameMode() { }

window.GameMode = GameMode;

///////
// file: js_src/interface/GameMode_FreeForAll.js
///////

var superClass = GameMode;
FreeForAll.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
FreeForAll.prototype.constructor = FreeForAll;
FreeForAll.superClass = superClass;
FreeForAll.prototype.safeArea = null;

function FreeForAll(_mode) {
  this.mode = _mode;
  this.stamp = +new Date();
  this.chatAllowed = true;

  this.createInterfaceButtons();
}

FreeForAll.prototype.wastedPopups = [];
FreeForAll.prototype.playerDisplayNum = 0;
FreeForAll.prototype.setServerPlayerCount = function () {
  if (this.playerDisplayNum == 0)
    playersOnlTXT.setText(numberWithCommas(nPlayers) + " mopers");
  else playersOnlTXT.setText(numberWithCommas(nPlayersViewing) + " on server");

  this.playerDisplayNum = this.playerDisplayNum == 0 ? 1 : 0;
};
FreeForAll.prototype.interface = function () {
  // call anything that needs to be displayed on screen
  // eg. player count, messages as well as end screen.

  if (this.state == -1 || this.mode != gameMode) return;

  if (serverCon_aliveInAGame) {
    //console.log("interface drawn:");
    //DRAW: xp plus popups
    for (var k = this.wastedPopups.length - 1; k >= 0; k--) {
      //iterate backwards to allow removing
      var anItem = this.wastedPopups[k];
      anItem.draw();
      if (anItem.timedOut) this.wastedPopups.splice(k, 1); //remove timed out item
    }
  }

  if (this.endScreenCanvas != null) {
    this.endScreenCanvas.width &&
      ctx.drawImage(
        this.endScreenCanvas,
        canvasW / 2 - this.endScreenCanvas.width / 2,
        15 * pixelRat,
        this.endScreenCanvas.width,
        this.endScreenCanvas.height
      );
    if (!serverCon_aliveInAGame || isGhost) setSiteMenuVisible(true);
  }

  this.drawInterfaceButtons();
};

FreeForAll.prototype.interfaceReset = function () {
  //console.log("reseting interface");
  this.endScreenCanvas = null;
  this.dangerCircleMiniMapCanvas = null;
  this.wastedPopups = [];
  this.lastWastedPopupT = 0;
  this.playercount = 0;
  this.safeArea = null;

  if (this.interfaceButtons) {
    for (var i = 0; i < this.interfaceButtons.length; i++) {
      var aBut = this.interfaceButtons[i];
      aBut.onInterfaceReset();
    }
  }
  this.interfaceButtons = [];
};

FreeForAll.prototype.onInit = function () { };

FreeForAll.prototype.playercount = 0;

FreeForAll.prototype.setPlayerCount = function (count) {
  this.playercount = count;
};

FreeForAll.prototype.showPlayerCount = function () {
  ctx.save();
  var bx = canvasW / 2; // * interfS;
  var barH = 50 * interfS;
  var barW = 300 * interfS;
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = "black"; //bar bg
  var by = 30 * interfS;

  ctx.fillRect(bx - barW / 2, by, barW, barH); //bg
  ctx.globalAlpha = 1;
  ctx.fillStyle = "white";
  ctx.font = 30.0 * interfS + "px Arial";
  ctx.lineWidth = 1;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle"; //vertical center
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  ctx.shadowColor = "black";
  by += 25 * interfS;

  var msg = " player";
  if (this.playercount > 1) msg += "s";

  if (this.state == battleRoyal_inProgress) msg += " alive!";
  else if (
    this.state == battleRoyal_waitingForPlayers ||
    this.state == battleRoyal_ready
  )
    msg += " joined";

  ctx.fillText(this.playercount + msg, bx, by);
  ctx.restore();
};

FreeForAll.prototype.lbCanvas = null;

FreeForAll.prototype.leaderboard = function (lbData) {
  if (this.lbCanvas == null) this.lbCanvas = document.createElement("canvas");
  //log(lbData);
  if (lbData) {
    var ctx_ = this.lbCanvas.getContext("2d");
    var boardLength = 55;
    var nameH = 22;
    boardLength = boardLength + nameH * lbData.length;
    this.lbCanvas.width = 270;
    this.lbCanvas.height = boardLength;

    ctx_.globalAlpha = 0.2;
    ctx_.fillStyle = "#000000";
    ctx_.fillRect(0, 0, this.lbCanvas.width, this.lbCanvas.height);

    ctx_.globalAlpha = 1;
    ctx_.fillStyle = "#FFFFFF";
    var str = curServer.name; //"Top Players";
    ctx_.font = "24px Arial";
    if (!options_lowGraphics) {
      ctx_.shadowOffsetX = 1;
      ctx_.shadowOffsetY = 1;
    }
    ctx_.shadowColor = "black";
    ctx_.fillText(
      str,
      this.lbCanvas.width / 2 - ctx_.measureText(str).width / 2,
      40
    );
    var rank;

    ctx_.textAlign = "left";
    //ctx_.textBaseline = "middle"; //vertical center

    for (ctx_.font = "17px Arial", rank = 0; rank < lbData.length; ++rank) {
      str = options_noNames ? "" : lbData[rank].name || "mope.io";
      str += " (" + formatNumK(lbData[rank].xp) + ")";
      // log(str);
      ctx_.fillStyle = "#FFFFFF";
      ctx_.fillText(str, 15, 65 + nameH * rank);
    }
  }
};
FreeForAll.prototype.drawLeaderboard = function () {
  if (serverCon_aliveInAGame) {
    if (lbCanvas) {
      lbCanvas.width &&
        ctx.drawImage(
          lbCanvas,
          10 * pixelRat,
          28 * pixelRat,
          lbCanvas.width * interfS,
          lbCanvas.height * interfS
        );
    }
  }
};
FreeForAll.prototype.btnPlayAgain = null;

FreeForAll.prototype.showStats = true;
FreeForAll.prototype.interfaceButtons = [];
FreeForAll.prototype.createInterfaceButtons = function () {
  //log("calling : createInterfaceButtons ");
  this.interfaceButtons = [];
  /*
    this.btnPlayAgain = new InterfaceButton(0, 0, 80, 80, "Play Again!", 20);
    this.btnPlayAgain.showLabeleOnHover = true;
    this.btnPlayAgain.textShadow = true;
    this.btnPlayAgain.drawTextOnHowever = function () {
        this.drawText(this.w / 2, -this.h / 3);
    }

    this.btnPlayAgain.onClick = function () {
        joinGame(false);
    }
    this.btnPlayAgain.onMouseMove = function () {
    }
    this.btnPlayAgain.update = function () {
        this.x = (canvasW / 2) + 5;
        this.y = canvasH * 0.90;//(canvasH / 2) - 250;
    }


    this.btnPlayAgain.onInterfaceReset = function () {
        this.isVisible = false;
    }

    this.btnPlayAgain.onAfterDraw = function () {
        var theImg = getLoadedImg("img/icons/replay.png");
        if (theImg) {
            ctx.save();

            var iw = (this.w * 0.80);
            var pad = (this.w - iw) / 2;
            ctx.drawImage(theImg, this.x + pad, this.y + pad, iw, iw);
            ctx.restore();
        }
    }
    this.btnPlayAgain.isVisible = false;
    this.interfaceButtons.push(this.btnPlayAgain); // only add this button if drawn;
    */
};

FreeForAll.prototype.drawInterfaceButtons = function () {
  //this.btnPlayAgain.isVisible = isGhost;
  if (this.interfaceButtons) {
    for (var i = 0; i < this.interfaceButtons.length; i++) {
      var aBut = this.interfaceButtons[i];
      if (aBut.isVisible) {
        aBut.draw();
      }
    }
  }
};

FreeForAll.prototype.onResize = function () {
  this.drawInterfaceButtons();
};

FreeForAll.prototype.readPlayerStats = function (msg) {
  var stats = [];
  //stats.totalPlayers = msg.readUInt16();
  stats.rank = msg.readUInt16();
  stats.timeAlive = msg.readUInt16(); // in seconds
  stats.totalKills = msg.readUInt16();
  stats.topRank = msg.readUInt16();
  stats.maxXP = msg.readUInt32();
  stats.killedBy = msg.readString();
  return stats;
  //playerData[0].wins = topPlayerWins;
};

FreeForAll.prototype.playerInfo = function (msg) {
  if (isGhost && !serverCon_spectatingInAGame) {
    var stats = this.readPlayerStats(msg);
    this.buildEndScreenHTML(stats);
    //this.buildEndScreen(null, stats);
  } else if (!isGhost) {
    this.endScreenCanvas = null;
  }
};

FreeForAll.prototype.worldUpdate = function (msg) { };

FreeForAll.prototype.drawMap = function () { };
FreeForAll.prototype.pieChartCanvas = null;
FreeForAll.prototype.teamColors = {
  0: "white",
  1: "#B6CF40",
};

FreeForAll.prototype.endScreenDisplayed = false;
FreeForAll.prototype.buildEndScreenHTML = function (data) {
  if (this.endScreenDisplayed) return;
  this.endScreenDisplayed = true;
  //refreshBannerAds();

  var html = "";
  html += "<div class='msg'>YOU WERE #" + data.rank + "</div>";
  html += "<div class='row'>";
  html += "<div class='label'>Killed by:</div>";
  html += "<div class='value2'>" + data.killedBy + "</div>";
  html += "</div>";
  html += "<div class='row'>";
  html += "<div class='col1'>";
  html += "<div class='label'>Time alive:</div>";
  html += "<div class='value'>" + secToTime(data.timeAlive) + "</div>";
  html += "</div>";
  html += "<div class='col2'>";
  html += "<div class='label'>Total kills:</div>";
  html += "<div class='value'>" + data.totalKills + "</div>";
  html += "</div>";
  html += "</div>";
  html += "<div class='row'>";
  html += "<div class='col1'>";
  html += "<div class='label'>Top rank:</div>";
  html += "<div class='value'>" + data.topRank + "</div>";
  html += "</div>";
  html += "<div class='col2'>";
  html += "<div class='label'>Max xp:</div>";
  html += "<div class='value'>" + formatNumK(data.maxXP) + "</div>";
  html += "</div>";
  html += "</div>";
  html += "<div style='clear:both;'></div>";
  html += "<div class='btnDiv'>";
  //html += "<button id='btnContinue' class='btn'>Continue</button>";
  html +=
    "<button id='btnMopeOptions' class='btn'>      CONTINUE      </button>";
  html += "</div>";
  html += "<div style='clear:both;'></div>";
  var endScreen = document.getElementById("endScreen");
  if (endScreen) {
    endScreen.innerHTML = html;
    endScreen.style.display = "block";
    var mopeMenu = document.getElementById("mopeMenu");
    /*var btnContinue = document.getElementById("btnContinue");
    var btnMopeOptions = document.getElementById("btnMopeOptions");
    btnContinue.onclick = onClickContinue;*/
    btnMopeOptions.onclick = onClickShowMenu;

    //document.getElementById("mopeMenu").style.display = "none";
    document.getElementById("moneyRectangle").style.marginTop = "55px";
  }
  if (!serverCon_aliveInAGame || isGhost) {
    document.getElementById("startMenuWrapper").style.display = "block";
    /*document.getElementById("updatesDiv").style.display = "none";
    document.getElementById("mopeMenu").style.display = "none";
    document.getElementById("appsDiv").style.display = "none";
    if(document.getElementById("moneyRectangle")!=null)
    document.getElementById("moneyRectangle").style.marginTop = "55px";*/
  }
};

FreeForAll.prototype.endScreenCanvas = null;
FreeForAll.prototype.buildEndScreen = function (playerData, stats) {
  if (this.endScreenCanvas == null)
    this.endScreenCanvas = document.createElement("canvas");

  if (this.endScreenCanvas == null) return;

  var ctx_ = this.endScreenCanvas.getContext("2d");
  var boardLength = 55;
  var nameH = 40;
  var pad = 5;

  var borad_height = 240;
  var borad_width = 420;

  boardLength = borad_height + pad * 2;
  this.endScreenCanvas.width = borad_width + pad * 2;
  this.endScreenCanvas.height = boardLength;
  ctx_.globalAlpha = 0.2;
  ctx_.fillStyle = "#000000";
  ctx_.fillRect(0, 0, this.endScreenCanvas.width, this.endScreenCanvas.height);
  ctx_.fillStyle = "#000000";
  ctx_.fillRect(
    pad,
    pad,
    this.endScreenCanvas.width - pad * 2,
    this.endScreenCanvas.height - pad * 2
  );
  var y = pad;
  ctx_.globalAlpha = 1;
  ctx_.fillStyle = "#FFFFFF";
  ctx_.font = "30px Arial";

  y += 55;

  var str = "Final Stats"; //"Top Players";
  ctx_.font = "30px Arial";
  ctx_.fillText(
    str,
    this.endScreenCanvas.width / 2 - ctx_.measureText(str).width / 2,
    y
  );

  ctx_.font = "20px Arial";
  y += 45;
  str = "You were #" + stats.rank; // + " out of " + stats.totalPlayers + " players";
  ctx_.fillText(
    str,
    this.endScreenCanvas.width / 2 - ctx_.measureText(str).width / 2,
    y
  );

  y += 40;
  var result = secToTime(stats.timeAlive);

  var x = pad + 15;

  drawLabelValueOn(ctx_, "Killed by", stats.killedBy, x, y);
  y += 40;
  drawLabelValueOn(ctx_, "Time Alive", secToTime(stats.timeAlive), x, y);
  x += 210;
  drawLabelValueOn(ctx_, "Total Kills", stats.totalKills, x, y);
  y += 40;
  x = pad + 15;
  drawLabelValueOn(ctx_, "Top rank", stats.topRank, x, y);
  x += 210;
  drawLabelValueOn(ctx_, "Max XP", formatNumK(stats.maxXP), x, y);

  y += 50;
  /*
    this.btnPlayAgain.update = function () {
        this.x = canvasW / 2 - this.w / 2;
        this.y = canvasH * 0.4 + boardLength;
    }
*/
};

FreeForAll.prototype.lastWastedPopupT = 0;
FreeForAll.prototype.onPlayerWasted = function (wastedName) {
  if ((timestamp - this.lastWastedPopupT) / 1000.0 > 0.7) {
    //over 0.5s since last popup
    this.lastWastedPopupT = timestamp;
    var newPop = new TextPopup(wastedName + " wasted!", 40, "red", 1500);
    this.wastedPopups.push(newPop);
  }
};

window.FreeForAll = FreeForAll;

////////// util function

///////
// file: js_src/interface/GameMode_TeamMode.js
///////

var superClass = GameMode;
TeamMode.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
TeamMode.prototype.constructor = TeamMode;
TeamMode.superClass = superClass;
TeamMode.prototype.safeArea = null;
TeamMode.prototype.teamColors = {
  0: "#cccccc",
  1: "#ffff00",
  2: "#01effc",
  3: "#bb00ff",
};
function TeamMode() {
  this.mode = gameMode_teamMode;
  this.createInterfaceButtons();
}

TeamMode.prototype.wastedPopups = [];
TeamMode.prototype.playerDisplayNum = 0;
TeamMode.prototype.setServerPlayerCount = function () {
  if (this.playerDisplayNum == 0)
    playersOnlTXT.setText(numberWithCommas(nPlayers) + " mopers");
  else playersOnlTXT.setText(numberWithCommas(nPlayersViewing) + " on server");

  this.playerDisplayNum = this.playerDisplayNum == 0 ? 1 : 0;
};

TeamMode.prototype.main = function (msg) {
  var teamMode_msgType = msg.readUInt8();
  // console.log("teamMode_msgType :" + teamMode_msgType);
  switch (teamMode_msgType) {
    case 54: // Msg_1v1Mode_YouWon
      {
        var youWon = msg.readString();
        this.buildYouWon(youWon, 15);
      }
      break;
    // case 55: // Msg_1v1Mode_topperInfo
    //   {
    //     this.top1v1_isHistoric = msg.readUInt8() == 1;
    //     this.top1v1_wins = msg.readUInt16();
    //     this.top1v1_name = msg.readString();
    //     this.buildTopperInfo();
    //   }
    //   break;
  }
};
TeamMode.prototype.canvasYouWon = null;
TeamMode.prototype.canvasYouWonEndT = 0;

TeamMode.prototype.topperInfoX = 10 * pixelRat;
TeamMode.prototype.topperInfoY = 15 * pixelRat;
TeamMode.prototype.top1v1_wins = "";
TeamMode.prototype.top1v1_name = "";

TeamMode.prototype.topperInfoTxt = null;
TeamMode.prototype.buildTopperInfo = function () {
  var name = "" + this.top1v1_name;
  if (name.lenght == 0) name = "mope.io";

  var txt =
    (this.top1v1_isHistoric ? " ALL TIME " : "") +
    "1v1 Pro: " +
    name +
    " (wins: " +
    this.top1v1_wins +
    ")";
  if (null == this.topperInfoTxt) {
    this.topperInfoTxt = new CachedText(20, "#FFFFFF"); //"#043400");
    this.topperInfoTxt.strokeW = 2;
    this.topperInfoTxt.multiLine = true;
    this.topperInfoTxt.renderScale = 2.0; //render larger to undo 'zoom of 3x'
    this.topperInfoTxt.setText(txt);
    this.topperInfoTxt.setPos = function (nw, nx) {
      this.x += nw / 2;
    };
  } else {
    this.topperInfoTxt.setFontSize(20);
    this.topperInfoTxt.setText(txt);
    this.topperInfoTxt.setPos = function (nw, nx) {
      this.x += nw / 2;
    };
  }
};
TeamMode.prototype.buildYouWon = function (msg, dur) {
  this.canvasYouWonEndT = +new Date() + dur * 1000;
  if (this.canvasYouWon == null)
    this.canvasYouWon = document.createElement("canvas");

  if (this.canvasYouWon == null) return;

  var ctx_ = this.canvasYouWon.getContext("2d");
  var boardLength = 55;
  var nameH = 40;
  var pad = 5;

  var borad_height = 130;
  var borad_width = 420;

  boardLength = borad_height + pad * 2;
  this.canvasYouWon.width = borad_width + pad * 2;
  this.canvasYouWon.height = boardLength;

  ctx_.globalAlpha = 0.2;
  ctx_.fillStyle = "#000000";
  ctx_.fillRect(0, 0, this.canvasYouWon.width, this.canvasYouWon.height);
  ctx_.fillStyle = "#000000";
  ctx_.fillRect(
    pad,
    pad,
    this.canvasYouWon.width - pad * 2,
    this.canvasYouWon.height - pad * 2
  );
  var y = pad;
  ctx_.globalAlpha = 1;
  ctx_.fillStyle = "#FFFFFF";
  ctx_.font = "30px Arial";

  y += 55;

  var str = "YOU WON"; //"Top Players";
  ctx_.font = "30px Arial";
  ctx_.fillText(
    str,
    this.canvasYouWon.width / 2 - ctx_.measureText(str).width / 2,
    y
  );
  y += 45;
  ctx_.font = "20px Arial";
  ctx_.fillText(
    msg,
    this.canvasYouWon.width / 2 - ctx_.measureText(msg).width / 2,
    y
  );
};

TeamMode.prototype.interface = function () {
  // call anything that needs to be displayed on screen
  // eg. player count, messages as well as end screen.

  if (this.state == -1 || this.mode != gameMode) return;

  if (serverCon_aliveInAGame) {
    //DRAW: xp plus popups
    for (var k = this.wastedPopups.length - 1; k >= 0; k--) {
      //iterate backwards to allow removing
      var anItem = this.wastedPopups[k];
      anItem.draw();
      if (anItem.timedOut) this.wastedPopups.splice(k, 1); //remove timed out item
    }
  }
  /*
  //this.endScreenCanvas = null;
  var stats = [];
  //stats.totalPlayers = msg.readUInt16();
  stats.rank = 1;
  stats.timeAlive = 1;
  stats.totalKills = 1;
  stats.topRank = 1;
  stats.maxXP = 1;
  stats.killedBy = 1;
  this.buildEndScreen(null, stats);
  */

  if (this.endScreenCanvas != null) {
    this.endScreenCanvas.width &&
      ctx.drawImage(
        this.endScreenCanvas,
        canvasW / 2 - this.endScreenCanvas.width / 2,
        15 * pixelRat,
        this.endScreenCanvas.width,
        this.endScreenCanvas.height
      );
    if (!serverCon_aliveInAGame || isGhost) setSiteMenuVisible(true);
  }

  // if (this.inviteScreenCanvas != null) {
  //   this.inviteScreenCanvas.width &&
  //     ctx.drawImage(
  //       this.inviteScreenCanvas,
  //       canvasW / 2 - this.inviteScreenCanvas.width / 2,
  //       this.screenPos,
  //       this.inviteScreenCanvas.width,
  //       this.inviteScreenCanvas.height
  //     );
  // }

  if (this.canvasYouWonEndT > +new Date()) {
    if (this.canvasYouWon != null) {
      this.canvasYouWon.width &&
        ctx.drawImage(
          this.canvasYouWon,
          canvasW / 2 - this.canvasYouWon.width / 2,
          canvasH * 0.2,
          this.canvasYouWon.width,
          this.canvasYouWon.height
        );
    }
  }
  if (serverCon_aliveInAGame) {
    // if (this.topperInfoTxt != null) {
    //   this.topperInfoTxt.x = this.topperInfoX;
    //   this.topperInfoTxt.y = this.topperInfoY;
    //   this.topperInfoTxt.draw();
    // }

    if (this.pieChartCanvas != null) {
      this.pieChartCanvas.width &&
        ctx.drawImage(
          this.pieChartCanvas,
          20 * pixelRat,
          20 * pixelRat,
          this.pieChartCanvas.width,
          this.pieChartCanvas.height
        );
    }

    if (isInBonusRound) {
      this.setBonusRoundTimer(
        "Bonus Round\n" + Math.round(bonusRoundDur) + "s"
      );
      if (this.bonusRoundTimer != null) {
        this.bonusRoundTimer.x = canvasW / 2;
        this.bonusRoundTimer.y = canvasH * 0.1;
        this.bonusRoundTimer.draw();
      }
    }
  }
  this.drawInterfaceButtons();
};

TeamMode.prototype.drawMap = function () {
  this.buildPieChart();

  this.drawTeamPlayers();
  this.drawStonesOnMiniMap();

  this.buildInviteScreen();
};

TeamMode.prototype.interfaceReset = function () {
  //console.log("reseting interface");
  this.endScreenCanvas = null;
  this.dangerCircleMiniMapCanvas = null;
  this.wastedPopups = [];
  this.lastWastedPopupT = 0;
  this.playercount = 0;
  this.safeArea = null;

  if (this.interfaceButtons) {
    for (var i = 0; i < this.interfaceButtons.length; i++) {
      var aBut = this.interfaceButtons[i];
      aBut.onInterfaceReset();
    }
  }
  this.interfaceButtons = [];
};

TeamMode.prototype.onInit = function () { };

TeamMode.prototype.playercount = 0;

TeamMode.prototype.setPlayerCount = function (count) {
  this.playercount = count;
};

TeamMode.prototype.showPlayerCount = function () {
  ctx.save();
  var bx = canvasW / 2; // * interfS;
  var barH = 50 * interfS;
  var barW = 300 * interfS;
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = "black"; //bar bg
  var by = 30 * interfS;

  ctx.fillRect(bx - barW / 2, by, barW, barH); //bg
  ctx.globalAlpha = 1;
  ctx.fillStyle = "white";
  ctx.font = 30.0 * interfS + "px Arial";
  ctx.lineWidth = 1;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle"; //vertical center
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  ctx.shadowColor = "black";
  by += 25 * interfS;

  var msg = " player";
  if (this.playercount > 1) msg += "s";

  if (this.state == battleRoyal_inProgress) msg += " alive!";
  else if (
    this.state == battleRoyal_waitingForPlayers ||
    this.state == battleRoyal_ready
  )
    msg += " joined";

  ctx.fillText(this.playercount + msg, bx, by);
  ctx.restore();
};

TeamMode.prototype.lbCanvas = null;

TeamMode.prototype.leaderboard = function (lbData) { };
TeamMode.prototype.drawLeaderboard = function () {
  if (this.stonesCanvas) {
    //log("drawing leaderboard");
    ctx.drawImage(
      this.stonesCanvas,
      10 * pixelRat,
      200 * pixelRat,
      this.stonesCanvas.width * interfS,
      this.stonesCanvas.height * interfS
    );
  }
};
TeamMode.prototype.btnPlayAgain = null;

TeamMode.prototype.showStats = true;
TeamMode.prototype.interfaceButtons = [];
TeamMode.prototype.createInterfaceButtons = function () {
  //log("calling : createInterfaceButtons ");
  this.interfaceButtons = [];
  /*
  this.btnPlayAgain = new InterfaceButton(0, 0, 80, 80, "Play Again!", 20);
  this.btnPlayAgain.showLabeleOnHover = true;
  this.btnPlayAgain.textShadow = true;
  this.btnPlayAgain.drawTextOnHowever = function() {
    this.drawText(this.w / 2, -this.h / 3);
  };

  this.btnPlayAgain.onClick = function() {
    joinGame(false);
  };
  this.btnPlayAgain.onMouseMove = function() {};
  this.btnPlayAgain.update = function() {
    this.x = canvasW / 2 + 5;
    this.y = canvasH * 0.9; //(canvasH / 2) - 250;
  };

  this.btnPlayAgain.onInterfaceReset = function() {
    this.isVisible = false;
  };

  this.btnPlayAgain.onAfterDraw = function() {
    var theImg = getLoadedImg("img/icons/replay.png");
    if (theImg) {
      ctx.save();

      var iw = this.w * 0.8;
      var pad = (this.w - iw) / 2;
      ctx.drawImage(theImg, this.x + pad, this.y + pad, iw, iw);
      ctx.restore();
    }
  };
  this.btnPlayAgain.isVisible = false;
  this.interfaceButtons.push(this.btnPlayAgain); // only add this button if drawn;
  */

  // this.btn1v1 = new InterfaceButton(0, 0, 60, 60, "Invite for 1v1", 30);
  // this.btn1v1.showLabeleOnHover = true;
  // this.btn1v1.textShadow = true;
  // this.btn1v1.drawTextOnHowever = function() {
  //   this.drawText(this.w / 2, this.h + this.h / 2);
  // };

  // this.btn1v1.onClick = function() {
  //   if (!this.clicked && !isGhost) {
  //     this.clicked = true;
  //     this.isHighLighted = false;
  //     var mes = new MsgWriter(2);
  //     mes.writeUInt8(52); // Msg_1v1Mode_invitePlayer;
  //     mes.writeUInt8(0); //1=down, 0=up
  //     wsSendMsg(mes);
  //   }
  // };
  // this.btn1v1.onMouseMove = function() {};
  // this.btn1v1.update = function() {
  //   this.x = canvasW / 2 - this.w / 2;
  //   this.y = 5 + this.h / 2; //(canvasH / 2) - 250;
  // };

  // this.btn1v1.onInterfaceReset = function() {
  //   this.isVisible = true;
  // };

  // this.btn1v1.onAfterDraw = function() {
  //   var theImg = getLoadedImg("img/icons/1v1.png");
  //   if (theImg) {
  //     ctx.save();

  //     var iw = this.w * 0.8;
  //     var pad = (this.w - iw) / 2;
  //     ctx.drawImage(theImg, this.x + pad, this.y + pad, iw, iw);
  //     ctx.restore();
  //   }
  // };
  // this.btn1v1.isVisible = show1v1Button;
  // this.interfaceButtons.push(this.btn1v1);
};

TeamMode.prototype.drawInterfaceButtons = function () {
  // this.btnPlayAgain.isVisible = isGhost;
  /*
  this.removeExpiredRequestButtons();
  this.btn1v1.isVisible = !isGhost && show1v1Button;
  if (this.btn1v1.isVisible) {
    this.btn1v1.clicked = false;
  }
  */
  if (this.interfaceButtons) {
    for (var i = 0; i < this.interfaceButtons.length; i++) {
      var aBut = this.interfaceButtons[i];
      if (aBut.isVisible) {
        aBut.draw();
      }
    }
  }
};

TeamMode.prototype.removeExpiredRequestButtons = function () {
  for (d = 0; d < this.interfaceButtons.length; d++) {
    var aBut = this.interfaceButtons[d];

    if (aBut.reqID !== undefined) {
      var activeRequest = true;
      var found = false;
      for (r = 0; r < player1v1Requests.length; r++) {
        var req = player1v1Requests[r];
        if (req.id == aBut.reqID) {
          found = true;
          break;
        }
      }

      if (!found) activeRequest = false;

      if (!activeRequest || isInArena) {
        log("removing button");
        var tmp = this.interfaceButtons.indexOf(aBut);
        if (-1 != tmp) {
          this.interfaceButtons.splice(tmp, 1);
        }
      }
    }
  }
};

TeamMode.prototype.onResize = function () {
  this.drawInterfaceButtons();
};

TeamMode.prototype.readPlayerStats = function (msg) {
  var stats = [];
  //stats.totalPlayers = msg.readUInt16();
  stats.rank = msg.readUInt16();
  stats.timeAlive = msg.readUInt16(); // in seconds
  stats.totalKills = msg.readUInt16();
  stats.topRank = msg.readUInt16();
  stats.maxXP = msg.readUInt32();
  stats.killedBy = msg.readString();
  return stats;
};

TeamMode.prototype.playerInfo = function (msg) {
  if (isGhost && !serverCon_spectatingInAGame) {
    var stats = this.readPlayerStats(msg);
    //    this.buildEndScreen(null, stats);
    this.buildEndScreenHTML(stats);
  } else if (!isGhost) {
    this.endScreenCanvas = null;
  }
};
TeamMode.prototype.worldUpdate = function (msg) {
  // read teams info
  this.team1 = msg.readUInt16();
  this.team2 = msg.readUInt16();
  this.team3 = msg.readUInt16();

  this.teamPlayerCount = msg.readUInt16();

  this.teamPlayers = [];
  for (i = 0; i < this.teamPlayerCount; i++) {
    var x = msg.readUInt16() / 4.0;
    var y = msg.readUInt16() / 4.0;
    var r = msg.readUInt16() / 10.0;
    this.teamPlayers.push({ x: x, y: y, rad: r });
  }

  this.totalStones = msg.readUInt8();
  this.teamStones = [];
  for (i = 0; i < this.totalStones; i++) {
    var _teamID = msg.readUInt8();
    var x = msg.readUInt16() / 4.0;
    var y = msg.readUInt16() / 4.0;
    var r = msg.readUInt16() / 10.0;
    this.teamStones.push({ teamID: _teamID, x: x, y: y, rad: r });
  }

  //this.teamTotal = this.team1 + this.team2 + this.team3;
};
thisClass.prototype.bonusRoundTimer = null;
TeamMode.prototype.pieChartCanvas = null;

TeamMode.prototype.setBonusRoundTimer = function (a) {
  var txt = "" + a;
  if (null == this.bonusRoundTimer) {
    this.bonusRoundTimer = new CachedText(40, "#FFFFFF"); //"#043400");
    this.bonusRoundTimer.strokeW = 2;
    this.bonusRoundTimer.multiLine = true;
    this.bonusRoundTimer.renderScale = 5.0; //render larger to undo 'zoom of 3x'
    this.bonusRoundTimer.setText(txt);
  } else {
    this.bonusRoundTimer.setFontSize(40);
    this.bonusRoundTimer.setText(txt);
  }
};

TeamMode.prototype.buildPieChart = function () {
  if (this.pieChartCanvas == null)
    this.pieChartCanvas = document.createElement("canvas");

  if (this.pieChartCanvas == null) return;

  var ctx_ = this.pieChartCanvas.getContext("2d");

  var data = {
    1: this.team1,
    2: this.team2,
    3: this.team3,
  };

  var myPiechart = new Piechart({
    pad: 30,
    canvas: this.pieChartCanvas,
    data: data,
    colors: this.teamColors,
  });

  var boardLength = 55;
  var nameH = 40;
  var pad = 5;

  var borad_height = 200;
  var borad_width = 200;

  boardLength = borad_height + pad * 2;
  this.pieChartCanvas.width = borad_width + pad * 2;
  this.pieChartCanvas.height = boardLength;
  myPiechart.draw();

  ctx_.globalAlpha = 0.2;

  var y = pad;
  ctx_.globalAlpha = 0.5;
  ctx_.fillStyle = "white";
  ctx_.font = "20px Arial";
  var y = 200;
  str = curServer.name; // + " out of " + stats.totalPlayers + " players";
  ctx_.fillText(
    str,
    this.pieChartCanvas.width / 2 - ctx_.measureText(str).width / 2 - 15,
    y
  );
};
TeamMode.prototype.inviteScreenCanvas = null;

TeamMode.prototype.endScreenCanvas = null;
TeamMode.prototype.endScreenDisplayed = false;
TeamMode.prototype.buildEndScreenHTML = function (data) {
  if (this.endScreenDisplayed) return;
  this.endScreenDisplayed = true;
  //refreshBannerAds();

  var html = "";
  html += "<div class='msg'>YOU WERE #" + data.rank + "</div>";
  html += "<div class='row'>";
  html += "<div class='label'>Killed by:</div>";
  html += "<div class='value2'>" + data.killedBy + "</div>";
  html += "</div>";
  html += "<div class='row'>";
  html += "<div class='col1'>";
  html += "<div class='label'>Time alive:</div>";
  html += "<div class='value'>" + secToTime(data.timeAlive) + "</div>";
  html += "</div>";
  html += "<div class='col2'>";
  html += "<div class='label'>Total kills:</div>";
  html += "<div class='value'>" + data.totalKills + "</div>";
  html += "</div>";
  html += "</div>";
  html += "<div class='row'>";
  html += "<div class='col1'>";
  html += "<div class='label'>Top rank:</div>";
  html += "<div class='value'>" + data.topRank + "</div>";
  html += "</div>";
  html += "<div class='col2'>";
  html += "<div class='label'>Max xp:</div>";
  html += "<div class='value'>" + formatNumK(data.maxXP) + "</div>";
  html += "</div>";
  html += "</div>";
  html += "<div style='clear:both;'></div>";
  html += "<div class='btnDiv'>";
  //html += "<button id='btnContinue' class='btn'>Play Again</button>";
  html += "<button id='btnContinue' class='btn'>CONTINUE</button>";
  html += "</div>";
  html += "<div style='clear:both;'></div>";
  var endScreen = document.getElementById("endScreen");
  if (endScreen) {
    endScreen.innerHTML = html;
    endScreen.style.display = "block";
    //var btnContinue = document.getElementById("btnContinue");
    var btnContinue = document.getElementById("btnContinue");
    //btnContinue.onclick = onClickContinue;
    btnContinue.onclick = onClickShowMenu;
  }

  if (!serverCon_aliveInAGame) {
    setSiteMenuVisible(true);
    //document.getElementById("startMenuWrapper").style.display = "block";
  }
};

TeamMode.prototype.buildEndScreen = function (playerData, stats) {
  if (this.endScreenCanvas == null)
    this.endScreenCanvas = document.createElement("canvas");

  if (this.endScreenCanvas == null) return;

  var ctx_ = this.endScreenCanvas.getContext("2d");
  var boardLength = 55;
  var nameH = 40;
  var pad = 5;

  var borad_height = 240;
  var borad_width = 420;

  boardLength = borad_height + pad * 2;
  this.endScreenCanvas.width = borad_width + pad * 2;
  this.endScreenCanvas.height = boardLength;
  ctx_.globalAlpha = 0.2;
  ctx_.fillStyle = "#000000";
  ctx_.fillRect(0, 0, this.endScreenCanvas.width, this.endScreenCanvas.height);
  ctx_.fillStyle = "#000000";
  ctx_.fillRect(
    pad,
    pad,
    this.endScreenCanvas.width - pad * 2,
    this.endScreenCanvas.height - pad * 2
  );
  var y = pad;
  ctx_.globalAlpha = 1;
  ctx_.fillStyle = "#FFFFFF";
  ctx_.font = "30px Arial";

  y += 55;

  var str = "YOU DIED!"; //"Top Players";
  ctx_.font = "30px Arial";
  ctx_.fillText(
    str,
    this.endScreenCanvas.width / 2 - ctx_.measureText(str).width / 2,
    y
  );

  ctx_.font = "20px Arial";
  y += 45;
  str = "You were #" + stats.rank; // + " out of " + stats.totalPlayers + " players";
  ctx_.fillText(
    str,
    this.endScreenCanvas.width / 2 - ctx_.measureText(str).width / 2,
    y
  );

  y += 40;
  var result = secToTime(stats.timeAlive);

  var x = pad + 15;

  drawLabelValueOn(ctx_, "Killed by", stats.killedBy, x, y);
  y += 40;
  drawLabelValueOn(ctx_, "Time Alive", result, x, y);
  x += 210;
  drawLabelValueOn(ctx_, "Total Kills", stats.totalKills, x, y);
  y += 40;
  x = pad + 15;
  drawLabelValueOn(ctx_, "Top rank", stats.topRank, x, y);
  x += 210;
  drawLabelValueOn(ctx_, "Max XP", formatNumK(stats.maxXP), x, y);

  y += 50;
  /*
  this.btnPlayAgain.update = function() {
    this.x = canvasW / 2 - this.w / 2;
    this.y = canvasH * 0.4 + boardLength;
  };
  */
};
TeamMode.prototype.buildInviteScreen = function () {
  // player1v1Requests = [];
  // for (i = 0; i < 1; i++) {
  //   var id = i;
  //   var fromPlayer = "test " + (i + 1);
  //   var reqDur = 10000;
  //   player1v1Requests.push({
  //     id: id,
  //     requestee: fromPlayer,
  //     aniType: 1,
  //     wins: 1,
  //     teamID: 1,
  //     rank: 1,
  //     dur: reqDur
  //   });
  // }

  if (player1v1Requests.length == 0) {
    this.inviteScreenCanvas = null;
    return;
  }

  if (this.inviteScreenCanvas == null)
    this.inviteScreenCanvas = document.createElement("canvas");

  if (this.inviteScreenCanvas == null) return;

  var ctx_ = this.inviteScreenCanvas.getContext("2d");
  var boardLength = 55;
  var nameH = 40;
  var pad = 5;

  var borad_height = 200 + player1v1Requests.length * 80;
  var borad_width = 420;

  boardLength = borad_height + pad * 2;
  this.inviteScreenCanvas.width = borad_width + pad * 2;
  this.inviteScreenCanvas.height = boardLength;
  var screenPos = 300;
  this.screenPos = screenPos;
  ctx_.globalAlpha = 0.2;
  ctx_.fillStyle = "#000000";
  ctx_.fillRect(
    0,
    0,
    this.inviteScreenCanvas.width,
    this.inviteScreenCanvas.height
  );
  ctx_.fillStyle = "#000000";
  ctx_.fillRect(
    pad,
    pad,
    this.inviteScreenCanvas.width - pad * 2,
    this.inviteScreenCanvas.height - pad * 2
  );
  var y = pad;
  ctx_.globalAlpha = 1;
  ctx_.fillStyle = "#FFFFFF";
  ctx_.font = "30px Arial";

  y += 55;

  var str = "1v1 REQUEST"; //"Top Players";
  ctx_.font = "30px Arial";
  ctx_.fillText(
    str,
    this.inviteScreenCanvas.width / 2 - ctx_.measureText(str).width / 2,
    y
  );

  //screenPos -= boardLength / 2;
  // screenPos += 40;
  screenPos = 100;
  var btnY = 0;
  for (r = 0; r < player1v1Requests.length; r++) {
    var req = player1v1Requests[r];
    ctx_.save();
    ctx_.fillStyle = "red";
    ctx_.globalAlpha = 0.5;
    ctx_.fillRect(this.inviteScreenCanvas.width - 60, 10, 50, 50);
    ctx_.restore();
    ctx_.save();
    str = "" + req.dur;
    ctx_.font = "30px Arial";
    ctx_.fillText(
      str,
      this.inviteScreenCanvas.width - 35 - ctx_.measureText(str).width / 2,
      45
    );
    ctx_.restore();
    ctx_.font = "20px Arial";

    str = req.requestee + " invites you for 1v1 ";
    ctx_.fillText(
      str,
      this.inviteScreenCanvas.width / 2 - ctx_.measureText(str).width / 2,
      screenPos
    );

    var x = pad + 15;
    y = screenPos + 40;
    drawLabelValueOn(ctx_, "Animal", "", x, y);

    var aniInfo = infoForAnimalType(req.aniType);
    var theImg = getLoadedImg("./skins/" + aniInfo.skinName + ".png");

    if (theImg) {
      ctx_.save();
      ctx_.drawImage(theImg, x + 130, y - 30, 50, 50);
      ctx_.restore();
    }

    x += 210;
    drawLabelValueOn(ctx_, "1v1 Wins", req.wins, x, y);
    y += 40;
    x = pad + 15;
    drawLabelValueOn(ctx_, "Team", "", x, y);

    ctx_.save();
    var cx = x + 155;
    var cy = y - 10 / 2;
    ctx_.fillStyle = this.teamColors[req.teamID];
    ctx_.beginPath();
    ctx_.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx_.fill();

    ctx_.restore();

    x += 210;
    drawLabelValueOn(ctx_, "Rank", req.rank, x, y);
    screenPos += 100;
    var btnAccept = this.create1v1RequestButton(req, "Accept");
    //420 / 2;
    btnAccept.yPos = screenPos;
    btnAccept.update = function () {
      this.x = canvasW / 2 - 140;
      this.y = _gameMode.screenPos + this.yPos + 10;
    };

    var btnReject = this.create1v1RequestButton(req, "Reject");
    btnReject.yPos = screenPos;
    btnReject.update = function () {
      this.x = canvasW / 2 - 40;
      this.y = _gameMode.screenPos + this.yPos + 10;
    };

    var btnIgnore = this.create1v1RequestButton(req, "Ignore");
    btnIgnore.yPos = screenPos;
    btnIgnore.update = function () {
      this.x = canvasW / 2 + 60;
      this.y = _gameMode.screenPos + this.yPos + 10;
    };

    screenPos += 80;
  }
};

TeamMode.prototype.create1v1RequestButton = function (req, label) {
  var hasFound = false;
  for (i = 0; i < this.interfaceButtons.length; i++) {
    btn = this.interfaceButtons[i];
    if (btn.reqID == req.id && btn.label == label) {
      hasFound = true;
      return btn;
    }
  }

  if (hasFound) return;

  var btn = new InterfaceButton(0, 0, 80, 40, label, 20);
  btn.reqID = req.id;
  btn.reqAction = btn.onClick = function () {
    this.isHighLighted = false;
    var actionType = 0;
    switch (this.label) {
      case "Accept":
        actionType = 1;
        break;
      case "Reject":
        actionType = 0;
        break;
      case "Ignore":
        actionType = 2;
        break;
    }
    var mes = new MsgWriter(3);
    mes.writeUInt8(53); // Msg_1v1Mode_RequestAction;
    mes.writeUInt8(actionType); //1=accept, 0=reject,2=ignore
    mes.writeUInt8(this.reqID);
    wsSendMsg(mes);
  };
  btn.onInterfaceReset = function () {
    this.isVisible = true;
  };

  btn.isVisible = true;
  this.interfaceButtons.push(btn);

  return btn;
};

TeamMode.prototype.lastWastedPopupT = 0;
TeamMode.prototype.onPlayerWasted = function (wastedName) {
  if ((timestamp - this.lastWastedPopupT) / 1000.0 > 0.7) {
    //over 0.5s since last popup
    this.lastWastedPopupT = timestamp;
    var newPop = new TextPopup(wastedName + " wasted!", 40, "red", 1500);
    this.wastedPopups.push(newPop);
  }
};

var Piechart = function (options) {
  this.options = options;
  this.radius = options.radius;
  this.pad = options.pad;
  this.canvas = options.canvas;
  this._ctx = this.canvas.getContext("2d");
  this.colors = options.colors;
  this.radius = Math.min(this.canvas.width / 2, this.canvas.height / 2);
  this.draw = function () {
    var total_value = 0;
    var color_index = 0;

    this._ctx.save();
    this._ctx.globalAlpha = 0.3;
    this.drawCircle(
      this.canvas.width / 2 - this.pad / 2,
      this.canvas.height / 2 - this.pad / 2,
      this.radius - this.pad,
      "white"
    );
    this._ctx.restore();

    for (var categ in this.options.data) {
      var val = this.options.data[categ];
      total_value += val;
    }
    var start_angle = 0;

    for (categ in this.options.data) {
      this._ctx.save();
      this._ctx.lineWidth = 4;
      this._ctx.strokeStyle = "white";
      this._ctx.globalAlpha = 0.3;
      var rf = 0;
      if (teamID == categ) {
        this._ctx.globalAlpha = 0.6;
        rf = 8;
      }
      val = this.options.data[categ];
      var slice_angle = (2 * Math.PI * val) / total_value;

      this.drawPieSlice(
        this.canvas.width / 2 - this.pad / 2,
        this.canvas.height / 2 - this.pad / 2,
        this.radius - this.pad,
        start_angle,
        start_angle + slice_angle,
        this.colors[categ],
        rf
      );
      this._ctx.restore();

      start_angle += slice_angle;
      color_index++;
    }
  };

  this.drawPieSlice = function (
    centerX,
    centerY,
    radius,
    startAngle,
    endAngle,
    color,
    rf
  ) {
    this._ctx.fillStyle = color;
    this._ctx.beginPath();
    this._ctx.moveTo(centerX, centerY);
    this._ctx.arc(centerX, centerY, radius + rf, startAngle, endAngle);
    this._ctx.closePath();
    this._ctx.fill();
    if (rf > 0) this._ctx.stroke();
  };

  this.drawCircle = function (centerX, centerY, radius, color) {
    this._ctx.fillStyle = color;
    this._ctx.beginPath();
    this._ctx.moveTo(centerX, centerY);
    this._ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    this._ctx.closePath();
    this._ctx.fill();
  };
};
TeamMode.prototype.drawStonesOnMiniMap = function () {
  if (this.teamStones) {
    for (t = 0; t < this.teamStones.length; t++) {
      var stone = this.teamStones[t];
      var _teamColor = this.teamColors[stone.teamID];
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.lineWidth = 1;
      ctx.strokeStyle = "white";
      ctx.fillStyle = _teamColor;

      var x =
        canvasW -
        (10 * pixelRat + miniMapCanvas.width * interfS) +
        (stone.x * (miniMapCanvas.width * interfS)) / gameW;
      var y =
        10 * pixelRat + (stone.y * (miniMapCanvas.height * interfS)) / gameH;
      //ctx.arc(x, y, plR * radF, 0, 2 * Math.PI);

      // ctx.rect(x, y, 5, 5);
      drawPlayerOnMiniMap(stone, _teamColor, 1.25);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    // draw stones on left corner:
  }
  this.drawStoneCounts();
};
TeamMode.prototype.stonesCanvas = null;
TeamMode.prototype.drawStoneCounts = function () {
  var y = 10;
  var stone1 = 0;
  var stone2 = 0;
  var stone3 = 0;
  if (this.teamStones)
    for (t = 0; t < this.teamStones.length; t++) {
      var stone = this.teamStones[t];
      switch (stone.teamID) {
        case 1:
          stone1++;
          break;
        case 2:
          stone2++;
          break;
        case 3:
          stone3++;
          break;
      }
    }

  if (this.stonesCanvas == null)
    this.stonesCanvas = document.createElement("canvas");

  if (this.stonesCanvas) {
    var ctx_ = this.stonesCanvas.getContext("2d");
    this.stonesCanvas.width = 300;
    this.stonesCanvas.height = 300;
    ctx_.font = "30px Arial";
    this.drawStoneCount(ctx_, 1, stone1, y);
    this.drawStoneCount(ctx_, 2, stone2, y + 50);
    this.drawStoneCount(ctx_, 3, stone3, y + 100);
  }
};

TeamMode.prototype.playerUI = [];
TeamMode.prototype.drawPlayerUI = function (ani) { };
TeamMode.prototype.drawStoneCount = function (ctx_, team, count, y) {
  ctx_.save();
  ctx_.globalAlpha = 0.5;
  var theImg = getLoadedImg("img/teamStone/stone" + team + ".png");
  if (theImg) {
    var rad = this.rad;
    ctx_.drawImage(theImg, 10, y, 40, 40);
    y += 50;
    ctx_.fillStyle = "black";
    ctx_.fillText(count + "", 60, y - 18);
  }
  ctx_.restore();
  // ctx_.save();
  // var x = 0;
  // var y = 0;
  // ctx_.beginPath();
  // ctx_.rotate(toRadians(50));
  // ctx_.moveTo(x, y);
  // ctx_.lineTo(x, y+50);
  // ctx_.lineTo(x + 50, y+ 50);
  // ctx_.closePath();
  // ctx_.fill();
  // ctx_.stroke();
  // ctx_.restore();
};

TeamMode.prototype.drawTeamPlayers = function () {
  if (this.teamPlayers) {
    var teamColor = this.teamColors[teamID];
    for (t = 0; t < this.teamPlayers.length; t++) {
      drawPlayerOnMiniMap(this.teamPlayers[t], teamColor, 1.0);
    }
  }
};

window.TeamMode = TeamMode;

///////
// file: js_src/gameobj/TeamStone.js
///////

var superClass = GameObj;
TeamStone.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
TeamStone.prototype.constructor = TeamStone;
TeamStone.superClass = superClass; //'class' var

TeamStone.prototype.updateZ = function () {
  this.z = 1002;
};

//override draw (things like other effects are drawn seperately)
TeamStone.prototype.customDraw = function (batchDrawOutline) {
  ctx.save();

  ctx.globalAlpha = 1;

  var theImg = getLoadedImg("img/teamStone/stone" + this.teamID + ".png");
  if (theImg) {
    var rad = this.rad;
    ctx.rotate(this.rPer * Math.PI * 2.0);
    ctx.drawImage(theImg, -rad, -rad, 2 * rad, 2 * rad);
  }
  ctx.restore();
};
//custom data for this class (must be matched by server-side write of this data!)
TeamStone.prototype.readCustomData_onUpdate = function (msg) {
  this.teamID = msg.readUInt8();
};

//custom data for this class (must be matched by server-side write of this data!)
TeamStone.prototype.readCustomData_onNewlyVisible = function (msg) {
  this.teamID = msg.readUInt8();
};

function TeamStone() {
  TeamStone.superClass.call(this, o_teamStone);

  this.teamID = 0;

  //set vars for this class
  this.doesDrawEffectScale = true;
  this.drawEffectScale_Slow = true;
}
window.TeamStone = TeamStone;
//add this file as a class! (make sure to call require!)
GameObjType.setCustomClassForGameObjType(TeamStone, o_teamStone);

///////
// file: js_src/gameobj/ability/AbilityObj1v1Arena.js
///////

var thisClass = AbilityObj1v1Arena;
var superClass = AbilityObj;
thisClass.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
thisClass.prototype.constructor = thisClass;
thisClass.superClass = superClass; //'class' var
thisClass.prototype.arenaState = 0;
thisClass.prototype.fightNumber = 0;
thisClass.prototype.timer = 0;
thisClass.prototype.timerTxt = null;
thisClass.prototype.p1Name = null;
thisClass.prototype.p2Name = null;
thisClass.prototype.p1Bites = 0;
thisClass.prototype.p2Bites = 0;
thisClass.prototype.arenaRad = 0;
thisClass.prototype.isCountdownTimer = true;
thisClass.prototype.p1ID = 0;
thisClass.prototype.p2ID = 0;
AbilityObj1v1Arena.prototype.setTimer = function (a) {
  var txt =
    (this.isCountdownTimer ? "" : "FIGHT #" + this.fightNumber + "\nTIME\n") +
    "" +
    a;
  var fontSize = 16;
  if (this.isCountdownTimer) fontSize = Number(a) ? 30 : 16;
  if (null == this.timerTxt) {
    this.timerTxt = new CachedText(fontSize, "#FFFFFF"); //"#043400");
    this.timerTxt.strokeW = 2;
    this.timerTxt.multiLine = true;
    this.timerTxt.renderScale = 5.0; //render larger to undo 'zoom of 3x'
    this.timerTxt.setText(txt);
  } else {
    this.timerTxt.setFontSize(fontSize);
    this.timerTxt.setText(txt);
  }
};

AbilityObj1v1Arena.prototype.setP1 = function (a) {
  var txt = "" + a;

  if (null == this.p1Name) {
    this.p1Name = new CachedText(12, "#FFFFFF"); //"#043400");
    this.p1Name.strokeW = 2;
    this.p1Name.multiLine = true;
    this.p1Name.renderScale = 2.0; //render larger to undo 'zoom of 3x'
    this.p1Name.setText(txt);
  } else {
    this.p1Name.setFontSize(12);
    this.p1Name.setText(txt);
  }
};

AbilityObj1v1Arena.prototype.setP2 = function (a) {
  var txt = "" + a;
  if (null == this.p2Name) {
    this.p2Name = new CachedText(12, "#FFFFFF"); //"#043400");
    this.p2Name.strokeW = 2;
    this.p2Name.multiLine = true;
    this.p2Name.renderScale = 2.0; //render larger to undo 'zoom of 3x'
    this.p2Name.setText(txt);
  } else {
    this.p2Name.setFontSize(12);
    this.p2Name.setText(txt);
  }
};
var ar1 = 2;
var ar2 = 2;
AbilityObj1v1Arena.prototype.updateZ = function () {
  this.z = 100002; // above everything
};
var rotateImg = 45;
//subclassable part of draw()
AbilityObj1v1Arena.prototype.customDraw = function (batchDrawOutline) {
  this.arenaRadUpdate();

  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.arc(0, 0, this.rad + 2, 0, 2 * Math.PI, false);
  ctx.arc(0, 0, this.rad, 0, 2 * Math.PI, true);
  ctx.fillStyle = "#32ff00";
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.095;

  ctx.beginPath();
  ctx.arc(0, 0, this.rad, 0, 2 * Math.PI, false);
  ctx.arc(0, 0, this.arenaRad, 0, 2 * Math.PI, true);
  ctx.fillStyle = "red";
  ctx.closePath();
  ctx.fill();
  // ctx.globalAlpha = 0.15;
  // ctx.strokeStyle = "red";
  // ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.arc(0, 0, this.arenaRad, 0, 2 * Math.PI, false);
  ctx.arc(0, 0, this.arenaRad - 2, 0, 2 * Math.PI, true);
  ctx.fillStyle = "#32ff00";
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  if (this.timerTxt != null)
    if (this.arenaState == 0) {
      this.timerTxt.x = 0;
      this.timerTxt.y = 0;
      this.timerTxt.draw();
    } else if (this.arenaState == 1) {
      this.timerTxt.x = 0;
      this.timerTxt.y = -this.rad * 0.8;
      this.timerTxt.draw();
    } else if (this.arenaState == 2) {
      this.timerTxt.x = 0;
      this.timerTxt.y = 0;
      this.timerTxt.draw();
    }

  if (this.p1Name != null) {
    this.p1Name.x = -this.rad / 2;
    this.p1Name.y = -this.rad * 0.7;
    this.p1Name.draw();

    // var aniInfo = infoForAnimalType(this.p1Animal);
    // var aniSkin = "./skins/" + aniInfo.skinName + ".png";
    // var theImg = getLoadedImg(aniSkin);
    // if (theImg) {
    //   log(aniSkin);
    //   ctx.save();
    //   ctx.rotate(rotateImg);
    //   ctx.drawImage(theImg, -this.rad, -this.rad*0.8, 50, 50);
    //   ctx.restore();
    // }
  }

  if (this.p2Name != null) {
    this.p2Name.x = this.rad / 2;
    this.p2Name.y = -this.rad * 0.7;
    this.p2Name.draw();
  }

  if (
    myPlayerID != 0 &&
    (this.p1ID == myPlayerID || this.p2ID == myPlayerID) &&
    this.arenaState == 0
  ) {
    /*if (!this.hasAdLoaded) {
      this.hasAdLoaded = true;
      document.getElementById("startMenuWrapper").style.display = "block";
      document.getElementById("updates").style.display = "none";
      document.getElementById("startMenu").style.display = "none";
      document.getElementById("rightSide").style.display = "none";
      refreshBannerAds();

      setTimeout(function() {
        document.getElementById("startMenuWrapper").style.display = "none";
        document.getElementById("startMenu").style.display = "block";
        document.getElementById("rightSide").style.display = "block";
      }, 23000);
    }*/
  }
  // else {
  //   if (
  //     myPlayerID != 0 &&
  //     (this.p1ID == myPlayerID || this.p2ID == myPlayerID) &&
  //     this.arenaState == 1
  //   ) {
  //     if (this.hasAdLoaded) {
  //       this.hasAdLoaded = false;
  //       document.getElementById("startMenuWrapper").style.display = "none";
  //     }
  //   }
  // }
};
AbilityObj1v1Arena.prototype.hasAdLoaded = false;

//override this to read in custom spawn data
AbilityObj1v1Arena.prototype.readCustomData_onNewlyVisible = function (msg) {
  AbilityObj1v1Arena.superClass.prototype.readCustomData_onNewlyVisible.call(
    this,
    msg
  );
  this.p1ID = msg.readUInt32();
  this.p2ID = msg.readUInt32();
  this.p1 = msg.readString();
  this.p2 = msg.readString();
  this.p1Wins = msg.readUInt8();
  this.p2Wins = msg.readUInt8();
  //this.p1Animal = msg.readUInt8();
  //this.p2Animal = msg.readUInt8();

  this.setNames();

  this.arenaState = msg.readUInt8();
  // if (this.arenaState == 0) {
  //   this.timer = msg.readUInt16() / 100.0;

  //   if (this.timer < 11) this.updateTimer();
  // }
  var rad = msg.readUInt16() / 100.0;
  this.oArenaRad = this.arenaRad;
  this.nArenaRad = rad;
};

AbilityObj1v1Arena.prototype.arenaRadUpdate = function () {
  var a = (timestamp - this.updateTime) / 1000 / lerpI;
  a = 0 > a ? 0 : 1.0 < a ? 1.0 : a; //clamp from 0-1

  //if(this.oType==o_abilityGObj)
  //console.log("(dead? "+this.dead+") a= "+a+"x="+this.x+" nx "+this.nx+" ox "+this.ox);

  this.arenaRad += (this.nArenaRad - this.arenaRad) * 0.1; //a * (this.nRad - this.oRad) + this.oRad;;
};

AbilityObj1v1Arena.prototype.readCustomData_onUpdate = function (msg) {
  AbilityObj1v1Arena.superClass.prototype.readCustomData_onUpdate.call(
    this,
    msg
  ); //call superclass version of this method

  this.arenaState = msg.readUInt8();
  this.fightNumber = msg.readUInt16();
  var rad = msg.readUInt16() / 100.0;
  this.oArenaRad = this.arenaRad;
  this.nArenaRad = rad;
  this.p1Bites = msg.readUInt16();
  this.p2Bites = msg.readUInt16();

  if (this.arenaState == 0) {
    this.timer = msg.readUInt16() / 100.0;
    this.isCountdownTimer = true;
    if (this.timer < 23) this.updateTimer();
  } else if (this.arenaState == 1) {
    this.timer = msg.readUInt16() / 100.0;
    this.isCountdownTimer = false;
    this.updateTimer();
  } else if (this.arenaState == 2) {
    this.winner = msg.readUInt8();
    this.winBonus = msg.readUInt32();
    this.winnerMsg = msg.readString();

    this.displayEndScreen();
  }
  this.setNames();
};
AbilityObj1v1Arena.prototype.endScreenState = -1;
AbilityObj1v1Arena.prototype.endScreenChangeT = 0;

AbilityObj1v1Arena.prototype.displayEndScreen = function () {
  if (timestamp >= this.endScreenChangeT) {
    this.endScreenState++;
    this.endScreenChangeT = timestamp + 3000;
  }

  if (this.timerTxt != null) {
    if (this.endScreenState == 0) {
      this.timerTxt.setFontSize(40);
      this.timerTxt.setText("\nKO!");
    } else if (this.endScreenState == 1) {
      this.timerTxt.setFontSize(20);
      this.timerTxt.setText(this.winnerName + "\nWON!");
    } else if (this.endScreenState == 2) {
      this.timerTxt.setFontSize(20);
      this.timerTxt.setText(
        this.winnerMsg + "\nWIN BONUS: " + formatNumK(this.winBonus)
      );
    }
  }
};
AbilityObj1v1Arena.prototype.challenger = null;
AbilityObj1v1Arena.prototype.opponent = null;

AbilityObj1v1Arena.prototype.setNames = function () {
  var name1 = "" + this.p1;
  if (name1.length == 0) name1 = "mope.io";
  var name2 = "" + this.p2;
  if (name2.length == 0) name2 = "mope.io";

  var wins1 = "\n(wins: " + this.p1Wins + ")";
  var wins2 = "\n(wins: " + this.p2Wins + ")";
  var bites1 = "\nbites: " + this.p1Bites;
  var bites2 = "\nbites: " + this.p2Bites;

  if (this.arenaState < 2) {
    this.challenger = name1 + wins1;
    this.opponent = name2 + wins2;
    this.setP1(name1 + wins1 + bites1);
    this.setP2(name2 + wins2 + bites2);
  } else if (this.arenaState == 2) {
    if (this.winner == 1) {
      this.winnerName = name1;
      this.setP1(name1 + wins1 + bites1);
      this.p2Name = null;
    } else if (this.winner == 2) {
      this.winnerName = name2;
      this.setP2(name2 + wins2 + bites2);
      this.p1Name = null;
    }
  }
};

AbilityObj1v1Arena.prototype.updateTimer = function () {
  this.timer = Math.round(this.timer);

  var txt = this.timer;
  if (this.isCountdownTimer)
    switch (this.timer) {
      case 23:
        txt = "";
        break;
      case 22:
      case 21:
        txt = "WELCOME TO 1V1 ARENA";
        break;
      case 20:
      case 19:
        txt = "FIGHT #" + this.fightNumber;
        break;
      case 18:
      case 17:
        txt = "CHALLENGER";
        break;
      case 16:
      case 15:
        txt = this.challenger;
        break;
      case 14:
      case 13:
        txt = "OPPONENT";
        break;
      case 12:
      case 11:
        txt = this.opponent;
        break;
      case 2:
        txt = "ROUND 1";
        break;
      case 1:
        txt = "GET SET";
        break;
      case 0:
        txt = "FIGHT";
        break;
    }
  this.setTimer(txt);
};

function AbilityObj1v1Arena() {
  AbilityObj1v1Arena.superClass.call(this); //call superclass init method (if needed, or write a new one below)
  this.hasAdLoaded = false;
}

window.AbilityObj1v1Arena = AbilityObj1v1Arena; //make class global!

//add this class as a thisClass for the right oType!
GameObjType.setCustomClassForGameObjType(
  AbilityObj1v1Arena,
  o_abilityGObj,
  ability_1v1Arena
);

///////
// file: js_src/gameobj/ability/AbilityObjGoalScored.js
///////

var thisClass = AbilityObjGoalScored;
var superClass = AbilityObj;
thisClass.prototype = Object.create(superClass.prototype); //properly inherit prototype of superclass
thisClass.prototype.constructor = thisClass;
thisClass.superClass = superClass; //'class' var
thisClass.prototype.alltimeGoals = 0;
thisClass.prototype.xpGained = 0;
thisClass.prototype.goalScorer = "";
thisClass.prototype.timerTxt = null;
thisClass.prototype.timer = 0;
AbilityObjGoalScored.prototype.updateZ = function () {
  this.z = 100002; // above everything
};
AbilityObjGoalScored.prototype.customDraw = function (batchDrawOutline) {
  this.updateTimer();

  // drawCircle(0, 0, this.rad, "#ff9000");

  if (this.timer > 3) {
    ctx.save();
    var oldA = ctx.globalAlpha;
    ctx.globalAlpha = 0.25 * oldA;
    ctx.beginPath();
    ctx.arc(0, 0, this.rad, 0, 2 * Math.PI, false);
    ctx.arc(0, 0, this.rad - 20, 0, 2 * Math.PI, true);
    ctx.fillStyle = "#ff9000";
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  if (this.timerTxt != null) {
    this.timerTxt.x = 0;
    this.timerTxt.y = -this.rad;
    this.timerTxt.draw();
  }
};
//override this to read in custom spawn data
AbilityObjGoalScored.prototype.readCustomData_onNewlyVisible = function (msg) {
  AbilityObjGoalScored.superClass.prototype.readCustomData_onNewlyVisible.call(
    this,
    msg
  );
  this.alltimeGoals = msg.readUInt16();
  this.goalScorer = msg.readString();
  this.timer = msg.readUInt16() / 100.0;
};

AbilityObjGoalScored.prototype.readCustomData_onUpdate = function (msg) {
  AbilityObjGoalScored.superClass.prototype.readCustomData_onUpdate.call(
    this,
    msg
  ); //call superclass version of this method

  this.timer = msg.readUInt16() / 100.0;
};

AbilityObjGoalScored.prototype.setTimer = function (a) {
  var txt = a;
  var fontSize = 16;
  if (null == this.timerTxt) {
    this.timerTxt = new CachedText(fontSize, "#ffd800");
    this.timerTxt.strokeW = 2;
    this.timerTxt.multiLine = true;
    this.timerTxt.renderScale = 3.0; //render larger to undo 'zoom of 3x'
    this.timerTxt.setText(txt);
  } else {
    this.timerTxt.setFontSize(fontSize);
    this.timerTxt.setText(txt);
  }
};

AbilityObjGoalScored.prototype.updateTimer = function () {
  this.timer = Math.round(this.timer);

  var txt = this.timer;

  switch (this.timer) {
    case 10:
    case 9:
    case 8:
      txt = "GOAAAAAL!!!";
      break;

    case 7:
    case 6:
    case 5:
      txt = this.goalScorer;
      break;
    case 4:
    case 3:
    case 2:
    case 1:
      txt = "GOAL #" + this.alltimeGoals;
      break;
    default:
      txt = "";
      break;
  }
  this.setTimer(txt);
};

function AbilityObjGoalScored() {
  AbilityObjGoalScored.superClass.call(this); //call superclass init method (if needed, or write a new one below)
  this.hasAdLoaded = false;
}

window.AbilityObjGoalScored = AbilityObjGoalScored; //make class global!

//add this class as a thisClass for the right oType!
GameObjType.setCustomClassForGameObjType(
  AbilityObjGoalScored,
  o_abilityGObj,
  ability_goalScored
);

//define basic classes
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

//GAME OBJECTS DEFs
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

function aniChoiceButtonClicked(aBut) {
  //console.log("choice: animal " + aBut.aniT + " selected: ");

  //play sound (if not muted)
  var sound_click = getLazyLoadAudio("audio/click.mp3");
  if (sound_click) {
    try {
      sound_click.play();
    } catch (err) { }
  }

  //tell server about chosen animal
  newMsg = new MsgWriter(2);
  newMsg.writeUInt8(24); //msgType MsgGameSelectAnimal
  newMsg.writeUInt8(aniChoice_choiceButtons.indexOf(aBut)); //msgType generatekey
  wsSendMsg(newMsg);

  //join game (if needed)
  if (aniChoice_joinGameAfter) {
    //console.log("chosen spawn animal, joining game...");
    //clear edible types (before spawn)
    clearedTypesSinceSpawnRequest = false;

    //joinGame(false);
  }

  //close choice interface
  aniChoice_isOpen = false;
  aniChoice_joinGameAfter = false;
}

function MsgReader(_0x13d193) {
  this.data = _0x13d193;
  this.offset = 0;
  this.readUInt8 = function () {
    var _0x13d193 = this.data.getUint8(this.offset);
    this.offset += 0x1;
    return _0x13d193;
  };
  this.readUInt16 = function () {
    try {
      var _0x13d193 = this.data.getUint16(this.offset, !0x1);
      this.offset += 0x2;
      return _0x13d193;
    } catch (_0x371765) {
      return 0;
    }
  };
  this.readInt16 = function () {
    try {
      var _0x13d193 = this.data.getInt16(this.offset, !0x1);
      this.offset += 0x2;
      return _0x13d193;
    } catch (_0x2c2f3b) {
      return 0;
    }
  };
  this.readUInt32 = function () {
    var _0x13d193 = this.data.getUint32(this.offset, !0x1);
    this.offset += 0x4;
    return _0x13d193;
  };
  this.readString = function () {
    for (var _0x13d193 = this.readUInt16(), _0x6e303b = '', _0x2b5892, _0xe7b985 = 0; _0xe7b985 < _0x13d193; _0xe7b985++) _0x2b5892 = this.readUInt8(), _0xe7b985 != _0x13d193 - 0x1 && (_0x6e303b += String.fromCharCode(_0x2b5892));
    return decode_utf8(_0x6e303b);
  };
  this.readMsgReaderBitsGroup = function () { };
  this.readBitGroup = function () {
    return new ByteReader(this);
  };
}

function ByteReader(input) {
  this.bytesArray = new Uint8Array(20);
  this.bytesLen = 0;
  this.readBitIndex = 1;
  this.readByteIndex = 0;

  this.getBool = function () {
    var bitValue = 0 < get_bit(this.bytesArray[this.readByteIndex], this.readBitIndex);
    this.readBitIndex += 1;
    if (this.readBitIndex > 7) {
      this.readBitIndex = 1;
      this.readByteIndex += 1;
    }
    return bitValue;
  };

  this.getInt0to3 = function () {
    return this.getIntWithXBits(2);
  };

  this.getIntWithXBits = function (numBits) {
    let result = 0;
    for (let i = 0; i < numBits; i++) {
      let bitValue = this.getBool();
      result = set_bit(result, i, bitValue);
    }
    return result;
  };

  this.byteToStr = function (byte) {
    let str = '';
    for (let i = 0; i < 8; i++) {
      str += 0 < get_bit(byte, i) ? '1' : '0';
    }
    return str;
  };

  let continueReading = true;
  do {
    let byte = input.readUInt8();
    this.bytesArray[this.bytesLen++] = byte;
    continueReading = 0 < get_bit(byte, 0);
  } while (continueReading);
}

function MsgWriter(a) {
  this.len = 0;
  this.dataView = new DataView(new ArrayBuffer(a));
  this.writeUInt8 = function (a) {
    this.dataView.setUint8(this.len, a);
    this.len += 1
  };
  this.writeUInt16 = function (a) {
    this.dataView.setUint16(this.len, a, !1);
    this.len += 2
  };
  this.writeInt16 = function (a) {
    this.dataView.setInt16(this.len, a, !1);
    this.len += 2
  };
  this.writeUInt32 = function (a) {
    this.dataView.setUint32(this.len, a, !1);
    this.len += 4
  };
  this.writeString = function (a) {
    a = encode_utf8(a);
    len = a.length;
    this.writeUInt16(a.length);
    for (var c = 0; c < len; c++) this.writeUInt8(a.charCodeAt(c))
  }
}

//
function MsgReaderBitsGroup(msg) {
  this.bytesArray = new Uint8Array(20); //up to 20 bytes (increase later if needed)
  this.bytesLen = 0;

  this.rBitIndex = 1; //which bit/byte is currently being read
  this.rByteIndex = 0;

  //get the next bit from bytes array
  this.getBool = function () {
    var currentByte = this.bytesArray[this.rByteIndex];
    //console.log("Reading bit "+this.rBitIndex+", byte "+this.rByteIndex);
    console.log(
      "readBool = bit_get(" + currentByte + ", " + this.rBitIndex + ") > 0;"
    );
    var readBool = bit_get(currentByte, this.rBitIndex) > 0;

    this.rBitIndex += 1;
    if (this.rBitIndex > 7) {
      //go to next byte
      this.rBitIndex = 1; //not 0, as 0 is used for length flag
      this.rByteIndex += 1;
    }
    //console.log(this)
    return readBool;
  };
  //reads 2 bits, returns a number 0-3
  this.getInt0to3 = function () {
    return this.getIntWithXBits(2);
  };
  this.getIntWithXBits = function (nBits) {
    var result = 0;
    for (var i = 0; i < nBits; i++) {
      var aBitVal = this.getBool();
      result = bit_set(result, i, aBitVal);
    }
    return result;
  };

  this.byteToStr = function (theByte) {
    var byteStr = "";
    for (var h = 0; h < 8; h++) byteStr += bit_get(theByte, h) > 0 ? "1" : "0";
    return byteStr;
  };

  //assumes next thing in message is bitsGroup, reads correct number of bytes in

  var hasNextByte = true;
  do {
    var readByte = msg.readUInt8();
    //console.log("Read byte " + this.byteToStr(readByte));
    this.bytesArray[this.bytesLen++] = readByte;
    hasNextByte = bit_get(readByte, 0) > 0;
  } while (hasNextByte);
}

//websocket
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

//start loading music/sounds (based on options)
getLazyLoadAudio("audio/click.mp3"); //load click sound!

onResize(); //set vars of canvas size
gameReset();

function handleWsMessage(msgArrBuf) {
  var msg = new MsgReader(msgArrBuf);

  //console.log("msg of size in bytes:  " + msgArrBuf.byteLength);
  //bytesLastSec += msgArrBuf.byteLength;
  var msgType = msg.readUInt8();
  //console.log("msg type is " + msgType);

  switch (msgType) {
    case 11: {
      let kickMsg = msg.readString();
      console.log(kickMsg);
      break;
    }
    case 1:
      {
        // first connect

        gameMode = msg.readUInt8(); // first set game mode!
        gameState = msg.readUInt8(); // first set game state!

        // set game mode interface hooks only on first connect!
        //if (typeof window.gameMode_setInterfaceFuncs === 'function')
        //    window.gameMode_setInterfaceFuncs();

        setGameMode();

        nPlayers = msg.readUInt16();
        playersOnlTXT.setText(numberWithCommas(nPlayers) + " Players");

        serverVer = msg.readUInt16();
        if (serverVer > gamever) {
          //refresh to get latest client
          setTimeout(function () {
            //disable warning
            if (!isMobileApp) window.onbeforeunload = null;
            console.log("Old client (ver " + gamever + "/" + serverVer + ")");
            alert(
              "mope.io has been updated! You need to refresh to get the latest version of the game! (If this keeps appearing, hold SHIFT when pressing refresh!)"
            );
            window.location.reload(true); //true causes HARD refresh
          }, 1500);
          return;
        }
        if (serverVer < gamever) {
          console.log("Old server version detected!");
        }

        onConnectedToGameServer();
      }
      break;
    case 3: //MsgNewGameRoom
      {
        console.log("Joined new game room!");
        var spectating = msg.readUInt8() == 1;
        serverCon_aliveInAGame = !spectating; //spectating isont alive
        serverCon_spectatingInAGame = spectating;

        gameW = msg.readUInt16();
        gameH = msg.readUInt16();
        gameMode = msg.readUInt8();

        camx = camx_o = camx_n = msg.readUInt16() / 4.0;
        camy = camy_o = camy_n = msg.readUInt16() / 4.0;
        camzoom_n = msg.readUInt32() / 1000.0;

        camzoom = camzoom_n * 1.2;

        //read minimap
        //if (!spectating) {
        generateMinimap(msg);

        //reset game nodes (messages will soon come in with new ones)
        gameReset();

        onConnectedAndJoinedGameServer();
      }
      break;
    case 6:
      {
        //MsgPlayerAliveInGame

        console.log("You spawned ingame!");
        //var spawnedYet = msg.readUInt8();

        //instantSetCamNextUpd=true;

        serverCon_aliveInAGame = true;

        //player spawned as an animal, play sound effect
        /*if(!spectating){
             setSiteMenuVisible(false);
           }*/

        //change music (only play once)
        changeMusicTo(gameMusicURL);

        if (!isMobileApp)
          window.onbeforeunload = function (e) {
            return "You're alive in a game, close mope.io?";
          };
      }
      break;
    case 2:
      {
        // game join response
        var joinResponse = msg.readUInt8();
        var spectating = msg.readUInt8();
        console.log("MsgRequestJoinAGame: server response " + joinResponse);

        //joinResponse == 100: choose ocean vs land! (seperate message coming next!)
        /*if (joinResponse == 100) {
               }*/
        if (
          joinResponse == 2 &&
          joinRequest_before_BR_started &&
          serverCon_aliveInAGame
        ) {
          joinResponse = 1;
        }
        if (joinResponse == 1) {
          //successful game join! hide interface!
          console.log("Successfuly joined gameroom!");

          if (!spectating)
            //if joined as non-spectator, hide menu now
            setSiteMenuVisible(false);

          //update vars for showing video ads
          gamesPlayedThisSession += 1;
          gamesPlayedSinceLastAd += 1;
          if (window.localStorage) {
            //save
            try {
              window.localStorage.setItem(
                "gamesSinceAd",
                gamesPlayedSinceLastAd
              );
            } catch (err) { } //no localStorage
          }

          var serverRespDisplay = document.getElementById("serverResponse");

          serverRespDisplay.style.display = "none";
          serverRespDisplay.style.opacity = 0.0;
          serverRespDisplay.textContent = "";
        } else {
          /*var numPlayers = msg.readUInt1t16();
                   var maxPlayers = msg.readUInt16();*/
          /* joinResponse 0|1|2
                   0= full
                   1 = success
                   2 = battle in progress
                   */
          var serverRespDisplay = document.getElementById("serverResponse");

          if (joinResponse == 0) {
            //joined party!
            serverRespDisplay.style.display = "block";
            serverRespDisplay.style.opacity = 1.0;
            serverRespDisplay.textContent = "Error: Server is full!";

            // log(xpLab.textContent);
          } else if (joinResponse == 2) {
            setSiteMenuVisible(true);
            //joined party!
            serverRespDisplay.style.display = "block";
            serverRespDisplay.style.opacity = 1.0;
            serverRespDisplay.textContent = "Game already in progress!";
            // log(xpLab.textContent);
          }
          /*
          document.getElementById("onconnectDiv").style.visibility = "visible";
          var serverRn = curServer;

          setTimeout(function() {
            //restart if no server change
            if (!serverCon_aliveInAGame && curServer == serverRn) {
              connectFailsCount = 100; //force server change
              gameServerConnect(curServer);
            }
          }, 10000);
          */
        }
      }
      break;
    case 24: //animal choice MsgGameSelectAnimal
      {
        console.log("Animal choice appeared!");
        var msgKind = msg.readUInt8();
        if (msgKind == 5) {
          //hide interface, timed out
          aniChoice_isOpen = false;
        }

        if (msgKind == 0 || msgKind == 1) {
          //show interface
          var joinGameAfterChoice = msgKind == 1; //1=choosing spawn (client will try to join game after sending this)
          var timeoutS = msg.readUInt8();
          var numAnis = msg.readUInt8();

          aniChoice_isOpen = true;
          aniChoice_A = 0.0;
          aniChoice_choiceButtons = [];
          aniChoice_joinGameAfter = joinGameAfterChoice;
          aniChoice_startT = +new Date();
          aniChoice_timeOutT = aniChoice_startT + 1000 * timeoutS;

          //read ani types info

          for (var i = 0; i < numAnis; i++) {
            var anAniT = msg.readUInt8();
            var biomeNum = msg.readUInt8();
            var species = msg.readUInt8();
            // var _teamID = msg.readUInt8();
            //create buttons for each ani (they are positioned later, due to possible screen re-size)
            var aButton = new AniChoiceButton(
              0,
              0,
              100,
              100,
              anAniT,
              biomeNum,
              species
            );
            aButton.teamID = teamID;
            aniChoice_choiceButtons.push(aButton);
          }
        }

        //hide screen text
        screenTextEndT = +new Date();
      }
      break;
    case 8: //leaderboard update
      //var numRoomPlayers = msg.readUInt8();
      var ownRank = msg.readUInt16();
      var numLBPlayers = msg.readUInt8();
      //console.log("Leaderboard update: myrank "+ownRank+" roomPlayers "+numRoomPlayers);

      lbData = [];
      for (i = 0; i < numLBPlayers; ++i) {
        var o = {
          rank: msg.readUInt16(),
          name: msg.readString(),
          score: msg.readUInt32(),
        };
        lbData.push(o);
      }
      updateLeaderBoard(lbData, 0, ownRank);

      break;
    case 10:
      {
        // server stats update
        nPlayers = msg.readUInt16();
        nPlayersViewing = msg.readUInt16();
        nPlayersAlive = msg.readUInt16();

        if (_gameMode != null) _gameMode.setServerPlayerCount();
        else {
          if (showPlaersOnServer)
            playersOnlTXT.setText(
              numberWithCommas(nPlayersViewing) + " on server"
            );
          else playersOnlTXT.setText(numberWithCommas(nPlayers) + " mopers");
          showPlaersOnServer = !showPlaersOnServer;
        }
        // pshowPlaersOnServerlayersOnlTXT.setText(numberWithCommas(nPlayers) + " players");
        //log("viewing players: " + nPlayersViewing);
        //log("alive players: " + nPlayersAlive);
        //document.getElementByById('pOnline').innerHTML = pStr + " players online";
      }
      break;

    case 18: //your animal upgraded
      {
        var aniT = msg.readUInt8();
        var aniTSpecies = msg.readUInt8();
        var upgradeType = msg.readUInt8();
        var wasDowngrade = upgradeType == 0;

        myPlayerID = msg.readUInt32(); //player's animal object ID updates
        xpNextAni = msg.readUInt32();

        console.log("xpnext: " + xpNextAni);

        var newAniT = GameObjType.createGameObjOfOType(o_animal, aniT);
        newAniT.animalType = aniT; //aniT isnt set automatically for all classes
        newAniT.animalSpecies = aniTSpecies;
        var aniInfoO = newAniT.animalInfo(); // infoForAnimalType(aniT);
        if (upgradeType != 2) {
          console.log(wasDowngrade);
          screenText = wasDowngrade
            ? "You downgraded to " +
            aniInfoO.aniName +
            "! \nDont lose too much xp!"
            : aniInfoO.upgradeText;
          screenTextCol = "white";
          screenTextEndT = +new Date() + 9000;
        }
        //clear out OLD types
        if (!clearedTypesSinceSpawnRequest) {
          clearedTypesSinceSpawnRequest = true;
          dangerAniTypes = Array.apply(null, new Array(50)).map(
            Number.prototype.valueOf,
            0
          );
          edibAniTypes = Array.apply(null, new Array(50)).map(
            Number.prototype.valueOf,
            0
          );
          tailBiteAniTypes = Array.apply(null, new Array(50)).map(
            Number.prototype.valueOf,
            0
          );
          edibleObjTypes = Array.apply(null, new Array(50)).map(
            Number.prototype.valueOf,
            0
          );
        }

        //read dangerous types
        dangerAniTypes = Array.apply(null, new Array(50)).map(
          Number.prototype.valueOf,
          0
        ); //reset
        var cnt = msg.readUInt8();
        for (var J = 0; J < cnt; J++) {
          dangerAniTypes[msg.readUInt8() - 1] = 1; //mark as true (dangerous)
        }
        var old_edibAniTypes = edibAniTypes;
        edibAniTypes = Array.apply(null, new Array(50)).map(
          Number.prototype.valueOf,
          0
        ); //reset
        var cnt = msg.readUInt8();
        for (var J = 0; J < cnt; J++) {
          var aType = msg.readUInt8();
          //console.log("animal type now edible: "+aType);
          edibAniTypes[aType - 1] = 1; //mark as true (dangerous)
        }
        tailBiteAniTypes = Array.apply(null, new Array(50)).map(
          Number.prototype.valueOf,
          0
        ); //reset
        var cnt = msg.readUInt8();
        for (var J = 0; J < cnt; J++) {
          tailBiteAniTypes[msg.readUInt8() - 1] = 1; //mark as true (dangerous)
        }
        var old_edibleObjTypes = edibleObjTypes;
        edibleObjTypes = Array.apply(null, new Array(50)).map(
          Number.prototype.valueOf,
          0
        ); //reset
        var cnt = msg.readUInt8();
        for (var J = 0; J < cnt; J++) {
          edibleObjTypes[msg.readUInt8() - 1] = 1; //mark a/mark aass true (dangerous)
        }

        //generate instructions
        //screenIns_objsEdible = []; //list of GameObjs that are newly edible

        /// if not battle royal then show
        screenIns_drawNewPlayerIns = aniT == a_mouse || aniT == a_shrimp; //draw basic instutions (eat green outlined, avoid red)

        screenIns_EndT = +new Date() + 9000;
        screenIns_A = 0.0;

        if (_gameMode != null) _gameMode.setPlayer();
      }
      break;
    case 31: // battle royal msg
      {
        //MsgYouDied  (you died)
        //battleRoyal_serverMessages(msg);
        if (_gameMode != null) _gameMode.main(msg);
      }
      break;
    case 49: // Msg_onGhostDeath
      {
        //UNUSED NOW
      }
      break;
    case 14:
      {
        //MsgYouDied  (you died)

        log("@@@@@@@@@@@@@ Player died");
        var deathR = msg.readUInt8();
        var respawnXp = msg.readUInt32();

        if (_gameMode != null) _gameMode.interfaceReset();

        endScreenCanvas = null;
        serverCon_aliveInAGame = false;
        serverCon_spectatingInAGame = true;

        isInArena = false;
        //var respawnXp = msg.readUInt32();
        aniChoice_isOpen = false;
        resetAfk();

        /*
                var stats = readPlayerStats(msg);

                buildEndScreen(stats); */
        /*var wasKillerPl=msg.readUInt8()>0;
                if(wasKillerPl){

                }*/

        // serverCon_aliveInAGame = false;
        //serverCon_spectatingInAGame = true;
        if (deathR == 1) {
          screenText =
            "Oh no, You were eaten! \n Watch out for red-circled players!";
          screenTextCol = "#F1C34C";
          screenTextEndT = +new Date() + 3500;
        } else if (deathR == 2) {
          //tailbite
          screenText = "Oh no, You died from a tail-bite!\n Watch your tail!";
          screenTextCol = "#F1C34C";
          screenTextEndT = +new Date() + 3500;
        } else if (deathR == 4) {
          //thirst
          screenText = "You died of thirst :( Don't let your water run out!";
          screenTextCol = "#F1C34C";
          screenTextEndT = +new Date() + 3500;
        } else if (deathR == 13) {
          //fire
          screenText = "You died from burning! (Get to water when on fire!)";
          screenTextCol = "#F1C34C";
          screenTextEndT = +new Date() + 3500;
        } else if (deathR == 24) {
          // dmgType_battleRoyal_won
          screenText = "You have WON Battle Royal!";
          respawnXp = 0;
          screenTextFontSize = 50;
          screenTextCol = "limegreen";
          screenTextEndT = +new Date() + 15000;
        } else {
          //default
          screenText = "You died! Watch your health!";
          screenTextCol = "#F1C34C";
          screenTextEndT = +new Date() + 3500;
        }
        //console.log("died msg");

        //clear choice interface
        aniChoice_isOpen = false;

        resetAfk(); //dont dc on game end, assume game end is activity

        //refresh banner ad on death
        refreshBannerAds();

        window.setTimeout(function () {
          //show game menu

          if (!serverCon_aliveInAGame) {
            //if didn't press enter to respawn yet

            showMobileAd();

            //show game menu
            //if (gameMode != gameMode_battleRoyal) /// if battle royal then dont show the start button
            //    document.getElementById('startMenuWrapper').style.display = "block";
            setSiteMenuVisible(true);

            //$("#startMenuWrapper").fadeIn(1000);
            //document.getElementById("nickInput").focus();

            //change music back to menu
            //changeMusicTo(menuMusicURL);

            //show text + hide fb if needed
            respawnMsgText =
              respawnXp > 0
                ? "You'll spawn with +" + formatNumK(respawnXp) + " XP!"
                : "";
            respawnMsgA = 0.0;
            var xpLab = document.getElementById("spawnXpLabel");
            xpLab.style.opacity = 0;
            if (respawnMsgText) {
              setTimeout(function () {
                if (!serverCon_aliveInAGame) {
                  //if didnt restart yet
                  xpLab.style.display = "block";
                  xpLab.style.opacity = 1.0;
                  //document.getElementById("spawnXpLabel").style.marginTop = "10px";
                }
              }, 1000);
            }
            document.getElementById("spawnXpLabel").textContent =
              respawnMsgText;
            //document.getElementById('twitBut').style.display = (respawnMsgText) ? "none" : "block";

            //disable warning
            if (!isMobileApp) window.onbeforeunload = null;
          }
        }, 2000);
      }
      break;
    case 4:
      {
        // world update

        worldUpdate(msg);
      }
      break;

    case 19:
      {
        // chat
        var id = msg.readUInt32();
        var chatAnim = gameObjsByID[id];
        if (chatAnim) {
          var chatText = msg.readString();
          //console.log("got chat");
          chatAnim.gotChat(chatText);
        }
      }
      break;

    case 23: //MsgPersonalGameEvent
      {
        var evType = msg.readUInt8();
        //ignore if dead (dont overwrite message!)
        if (!serverCon_aliveInAGame) return;
        screenTextFontSize = 25;
        screenTextEndT = timestamp + 3500.0;
        screenTextCol = "white"; //default color for event

        switch (evType) {
          case 255:
            {
              //custom msg
              screenText = msg.readString();
            }
            break;
          case 33: {
            //  window.location.reload(true);
            break;
          }
          case 2:
            {
              //your player got bitten
              screenText = "Ouch! Your tail got bitten!";
            }
            break;
          case 12:
            {
              screenText = "You've been stung by a jellyfish!";
            }
            break;
          case 3:
            {
              screenText = "ZAP! You've been shocked by a STINGRAY!";
            }
            break;
          case 8:
            {
              screenText = "You've been inked!";
            }
            break;
          case 5:
            {
              screenText = "Oh no! Escape the kraken's pull!";
            }
            break;
          case 6:
            {
              screenText = "Ouch! Pufferfish are pointy!";
            }
            break;
          case 7:
            {
              screenText = "That's an octopus in disguise!";
            }
            break;
          case 9:
            {
              screenText = "Brrr! You've been frozen!";
            }
            break;
          case 10:
            {
              screenText = "Ahh! The wolf's howl scared you!";
            }
            break;
          case 11:
            {
              screenText = "Ouch! A VERY LOUD sound hit you!";
            }
            break;
          case 13:
            {
              screenText = "Ah! You're on fire!";
            }
            break;
          case 14:
            {
              screenText = "BAM! You got kicked by a donkey!";
            }
            break;
          case 16:
            {
              screenText = "Ouch! You're getting dragged by a croc!";
            }
            break;
          case 17:
            {
              screenText = "A fox DUG you out of the hole!";
            }
            break;
          case 18:
            {
              screenText = "A wave has swept you away!";
            }
            break;
        }
      }
      break;
    case 25: //MsgPlayerAbility
      {
        // ability started recharging
        var isDive = msg.readUInt8() > 0;
        var rechargeT = msg.readUInt8() / 10.0;

        //save info to global vars
        if (isDive) {
          abil_dive_rechargeTotalT = 1000.0 * rechargeT;
          abil_dive_rechargeEndT = +new Date() + 1000 * rechargeT;
          abil_dive_recharging = true;
        } else {
          abil_rechargeTotalT = 1000.0 * rechargeT;
          abil_rechargeEndT = +new Date() + 1000 * rechargeT;
          abil_recharging = true;
        }
      }

      break;
    case 50: {
      log("disconnected from AFK!");
      dcedFromAfk = true;
      break;
    }
    case 51: // team mode messages
      {
        if (_gameMode != null) _gameMode.main(msg);
      }
      break;

    case 55: // Msg_1v1Mode_topperInfo
      {
        //top1v1_isSoccer = msg.readUInt8() == 1;
        top1v1_isHistoric = msg.readUInt8() == 1;
        top1v1_wins = msg.readUInt16();
        top1v1_name = msg.readString();

        if (top1v1_isHistoric) top1v1_since = msg.readString();

        buildTopperInfo();
      }
      break;
    case 58: // Msg_customScreenTextFont
      {
        var fontS = msg.readUInt8();
        var msg = msg.readString();

        screenTextEndT = timestamp + 3500.0;
        screenTextCol = "white"; //default color for event
        screenText = msg;
        screenTextFontSize = fontS;
      }
      break;
    case 59: // Msg_goalScored
      {
        // var holeX = msg.readUInt16() / 4.0;
        var goalNum = msg.readUInt16();
        var xpGain = msg.readUInt32();
        var scorer = msg.readString();

        screenTextEndT = timestamp + 3500.0;
        screenTextCol = "white"; //default color for event
        screenText =
          "GOAAAL!\n#" + goalNum + "\n\nBONUS XP: " + formatNumK(xpGain);
        screenTextFontSize = 50;
      }
      break;
    case 60: // Msg_goalScoredByOther
      {
        var scoredGoal = msg.readString();
        screenTextEndT = timestamp + 3500.0;
        screenTextCol = "white"; //default color for event
        screenText = scoredGoal + "\nSCORED A GOAL!";
        screenTextFontSize = 40;
      }
      break;
    case 56: // spectate mode
      {
        //a change in 'spectate mode'- due to pressing the SPECTATE button
        var isSpectateEnabled = msg.readUInt8() == 1;
        console.log(isSpectateEnabled);
        if (isSpectateEnabled) {
          console.log("spectate mode enabled!");
          setSiteMenuVisible(false);
          isSpectateMode = true;

          screenTextEndT = timestamp + 3500.0;
          screenTextCol = "white"; //default color for event
          screenText = "SPECTATE MODE";
          screenTextFontSize = 50;

          //create
          console.log(homeButton, _gameMode);
          if (_gameMode != null) {
            if (homeButton == null) {
              homeButton = new InterfaceButton(0, 0, 120, 50, "BACK", 30);
              homeButton.update = function () {
                this.x = canvasW / 2 - this.w / 2;
                this.y = canvasH * 0.1; //(canvasH / 2) - 250;
              };
              homeButton.visible = true;
              homeButton.onClick = function () {
                //send message to toggle on/off spectate mode
                var mes = new MsgWriter(1);
                mes.writeUInt8(56); // spectateMode
                wsSendMsg(mes);

                setSiteMenuVisible(true);
                //findAndConnectToNearestServer();
              };

              _gameMode.interfaceButtons.push(homeButton);
            }
            var xpLab = document.getElementById("spawnXpLabel");
            xpLab.style.display = "none";
          }
        } else {
          console.log("spectate mode turned off");
          isSpectateMode = false;
          setSiteMenuVisible(true);

          //remove existing home button
          if (homeButton != null) {
            var homeBtn = _gameMode.interfaceButtons.indexOf(homeButton);
            if (homeBtn != -1) {
              _gameMode.interfaceButtons.splice(homeBtn, 1);
            }
            //homeButton.visible = false;
            homeButton = null;
          }
        }
      }
      break;
  }
}

function wsSendMsg(a) {
  ws.send(a.dataView.buffer);
}

function wsIsOpen() {
  return null != ws && ws.readyState == ws.OPEN;
}

function worldUpdate(msg) {
  timestamp = +new Date();
  // console.log("UPD: " + (timestamp - lastUpdT) + " ms ");
  lastUpdT = timestamp;

  worldUpd_readPlayerInfoMessage(msg);

  //console.log("new update--------");

  //FULL info for NEWLY visible objects
  var cnt = msg.readUInt16();

  //  console.log("0: " + cnt)
  //console.log(cnt + " new objects");
  for (var J = 0; J < cnt; J++) {
    //create GameObj with correct subclass for newlyVisible
    var theObj = GameObjType.newlyVis_createGameObjFromMsg(msg);
    var id = theObj.id;
    //read basic data, then
    // theObj.worldUpd_readMsgNewlyVisible(msg);

    //add new gameObj to client

    //bug FIX: may re-see dying object that's not yet removed from list (remove it)
    var delO = gameObjsByID[id]; //delete possible dying object from game
    delete gameObjsByID[id];
    var tmp = gameObjs.indexOf(delO); //remove from game arrays
    if (-1 != tmp) {
      gameObjs.splice(tmp, 1);
    }

    //add to game
    gameObjsByID[id] = theObj;
    gameObjs.push(theObj);

    //theObj.worldUpd_readNewlyVisibleObjMessage(msg);
  }

  // UPDATE info for visible objs(that need upd)
  cnt = msg.readUInt16();
  //console.log("1: " + cnt)
  //console.log(cnt + " visible objects");
  for (var K = 0; K < cnt; K++) {
    var id = msg.readUInt32();
    var theObj = gameObjsByID[id];
    if (theObj) {
      //console.log("Updating obj "+theObj);
      theObj.worldUpd_readMsgUpdate(msg);
    } else {
      console.log("Error: Updated GameObj id " + id + " doesn't exist!");
    }
  }

  //removed Objects
  cnt = msg.readUInt16();
  // console.log("2: " + cnt)
  //console.log(cnt + " dead objects");

  for (var L = 0; L < cnt; L++) {
    //  var deadidPlusFlag = msg.readUInt32();
    var deadid = msg.readUInt32(); //bit_get(deadidPlusFlag, 32)
    var theObj = gameObjsByID[deadid];

    if (theObj) {
      theObj.worldUpd_readMsgRemovedObj(msg);
    } else {
      console.log("Error: Removed GameObj id " + id + " doesn't exist!");
    }
  }

  // read safe area info here
  if (_gameMode != null) _gameMode.worldUpdate(msg);
} //end world update

//read player info (eg. like camera, interface #s)
function worldUpd_readPlayerInfoMessage(msg) {
  camx_o = camx;
  camy_o = camy;
  camx_n = msg.readUInt16() / 4.0;
  camy_n = msg.readUInt16() / 4.0;
  camzoom_n = msg.readUInt32() / 1000.0;
  isDevMode = msg.readUInt8() == 1; //water/air/lava bar %
  //  if (gameMode == "none BOYEEEEE") teamID = msg.readUInt8();

  if (instantSetCamNextUpd) {
    instantSetCamNextUpd = false;
    camx = camx_n;
    camy = camy_n;
    camzoom = camzoom_n;
  }
  /*
  var flags = msg.readUInt8();

  var specator = bit_get(flags, 0);
  var abil_possible = bit_get(flags, 1); //animal ability possible

  var abil_dive_possible = bit_get(flags, 2); //dive possible (in water)
  abil_dive_isMain = bit_get(flags, 3);
  isAirBar = bit_get(flags, 7);

  if (!specator) {
    //animal ability
    var abil_usable = (abil_recharging = abil_active = false);
    var abil_type = ability_none;
    if (abil_possible) {
      //animal ability vars
      abil_usable = bit_get(flags, 4);
      abil_recharging = bit_get(flags, 5);
      abil_active = bit_get(flags, 6);

      abil_type = msg.readUInt8();
    }

    //dive ability
    var abil_dive_usable = (abil_dive_recharging = abil_dive_active = false);
    if (abil_dive_possible) {
      var diveFlags = msg.readUInt8();
      abil_dive_usable = bit_get(diveFlags, 0);
      abil_dive_recharging = bit_get(diveFlags, 1);
      abil_dive_active = bit_get(diveFlags, 2);
    }

    if (abil_dive_isMain) {
      //dive is main ability!
      button_w_mini.abil_usable = abil_usable;
      button_w_mini.abil_recharging = abil_recharging;
      button_w_mini.abil_possible = abil_possible;
      button_w_mini.abil_active = abil_active;
      button_w_mini.abil_Type = abil_type;

      button_w.abil_usable = abil_dive_usable;
      button_w.abil_recharging = abil_dive_recharging;
      button_w.abil_possible = abil_dive_possible;
      button_w.abil_active = abil_dive_active;
      button_w.abil_Type = ability_dive;
      //set correct recharging vars for both buttons
      if (abil_dive_recharging) {
        button_w.abil_rechargeTotalT = abil_dive_rechargeTotalT;
        button_w.abil_rechargeEndT = abil_dive_rechargeEndT;
      }
      if (abil_recharging) {
        button_w_mini.abil_rechargeTotalT = abil_rechargeTotalT;
        button_w_mini.abil_rechargeEndT = abil_rechargeEndT;
      }
    } else {
      //regular ability main
      button_w.abil_usable = abil_usable;
      button_w.abil_recharging = abil_recharging;
      button_w.abil_possible = abil_possible;
      button_w.abil_active = abil_active;
      button_w.abil_Type = abil_type;

      button_w_mini.abil_usable = abil_dive_usable;
      button_w_mini.abil_recharging = abil_dive_recharging;
      button_w_mini.abil_possible = abil_dive_possible;
      button_w_mini.abil_active = abil_dive_active;
      button_w_mini.abil_Type = ability_dive;

      //set correct recharging vars for both buttons
      if (abil_recharging) {
        button_w.abil_rechargeTotalT = abil_rechargeTotalT;
        button_w.abil_rechargeEndT = abil_rechargeEndT;
      }
      if (abil_dive_recharging) {
        button_w_mini.abil_rechargeTotalT = abil_dive_rechargeTotalT;
        button_w_mini.abil_rechargeEndT = abil_dive_rechargeEndT;
      }
    }




      // && gameMode == gameMode_teamMode)
      var aniFlags = msg.readBitGroup();
      can1v1 = aniFlags.getBool();

      isAbility1v1Active = aniFlags.getBool();
      if (can1v1) {
        show1v1Button = aniFlags.getBool();
        isInArena = aniFlags.getBool();

        //show1v1Button = msg.readUInt8() == 1;
      }

      if (can1v1)
        if (isInArena) {
          aniChoice_isOpen = false;
          player1v1Requests = [];
        } else {
          player1v1ArenaWins = msg.readUInt8();
          var count1v1 = msg.readUInt8();
          player1v1Requests = [];
          if (count1v1 > 0) {
            for (i = 0; i < count1v1; i++) {
              var id = msg.readUInt8();
              var fromPlayer = msg.readString();
              var aniType = msg.readUInt8();
              var totalWins = msg.readUInt8();
              var _teamID = msg.readUInt8();
              var rank = msg.readUInt8();
              var kills = msg.readUInt8();
              var reqDur = msg.readUInt16() / 100;
              var new1v1Req = {
                id: id,
                requestee: fromPlayer,
                aniType: aniType,
                wins: totalWins,
                teamID: _teamID,
                rank: rank,
                kills: kills,
                dur: reqDur
              };
              player1v1Requests.push(new1v1Req);
            }
          }
        }
*/

  isAliveInGame = msg.readUInt8() == 1;
  if (isAliveInGame) {
    waterBarPerc_n = msg.readUInt8(); //water/air/lava bar %
    animalBarType = msg.readUInt8(); // new bar type

    var newXP = msg.readUInt32();
    interface_onXPAmountUpdate(newXP, xp); //for XP popup
    xp = newXP;

    xpPer_n = msg.readUInt8();
  }

  //}
}

function readPlayerStats(msg) {
  var stats = [];
  //stats.totalPlayers = msg.readUInt16();
  stats.rank = msg.readUInt16();
  stats.topRank = msg.readUInt16();
  stats.timeAlive = msg.readUInt16(); // in seconds
  stats.totalKills = msg.readUInt16();
  //stats.totalWins = msg.readUInt16();
  stats.maxXP = msg.readUInt32();
  /*
    stats.nextRespawnStartXP = msg.readUInt32();
    stats.nextRespawnBoostTimeoutT = msg.readUInt32();
    stats.lastDieAnimalType = msg.readUInt16();
    */
  return stats;
  //playerData[0].wins = topPlayerWins;
}

var endScreenCanvas = null;
var endScreenY = 0;
function buildEndScreen(stats) {
  endScreenY = canvasH * 0.6;
  if (endScreenCanvas == null)
    endScreenCanvas = document.createElement("canvas");

  var ctx_ = endScreenCanvas.getContext("2d");
  var boardLength = 55;
  var nameH = 40;
  var pad = 5;

  var borad_height = 200;
  var borad_width = 420;

  boardLength = borad_height + pad * 2;
  endScreenCanvas.width = borad_width + pad * 2;
  endScreenCanvas.height = boardLength;
  ctx_.globalAlpha = 0.2;
  ctx_.fillStyle = "#000000";
  ctx_.fillRect(0, 0, endScreenCanvas.width, endScreenCanvas.height);
  ctx_.fillStyle = "#000000";
  ctx_.fillRect(
    pad,
    pad,
    endScreenCanvas.width - pad * 2,
    endScreenCanvas.height - pad * 2
  );
  var y = 55 + pad;

  ctx_.globalAlpha = 1;
  ctx_.fillStyle = "#FFFFFF";
  ctx_.font = "30px Arial";

  var str = "YOU DIED!"; //"Top Players";
  ctx_.font = "30px Arial";
  ctx_.fillText(
    str,
    endScreenCanvas.width / 2 - ctx_.measureText(str).width / 2,
    y
  );

  ctx_.font = "20px Arial";
  y += 45;
  str = "You were #" + stats.rank; // + " out of " + stats.totalPlayers + " players";
  ctx_.fillText(
    str,
    endScreenCanvas.width / 2 - ctx_.measureText(str).width / 2,
    y
  );

  y += 40;
  var result = secToTime(stats.timeAlive);

  var x = pad + 15;
  drawLabelValueOn(ctx_, "Time Alive", result, x, y);
  x += 210;
  drawLabelValueOn(ctx_, "Total Kills", stats.totalKills, x, y);
  y += 40;
  x = pad + 15;
  drawLabelValueOn(ctx_, "Top rank", stats.topRank, x, y);
  x += 210;
  drawLabelValueOn(ctx_, "Max XP", formatNumK(stats.maxXP), x, y);
}

//curRelX, curRelY are the current obj's translated pos (if drawing within GameObj, otherwise, 0,0 for global)
function fillGrid(x1, y1, x2, y2, curRelX, curRelY) {
  if (options_lowGraphics) return;
  //console.log(ctx.shadowBlur);

  ctx.save();

  //culling: only draw part of grid that's visible on-screen!
  //calc edge x/ys of screen, limit grid to be within screen
  var oldFillW = x2 - x1;
  var oldFillH = y2 - y1; //for grid to move around
  var testBuffer = 0;
  var scrHalfW = canvasW / 2 / camzoom; //(canvasW/pixelRat)/2; //in game coords
  var scrHalfH = canvasH / 2 / camzoom;
  x1 = Math.max(x1, camx - scrHalfW - curRelX + testBuffer); //convert to local obj coords
  y1 = Math.max(y1, camy - scrHalfH - curRelY + testBuffer);
  x2 = Math.min(x2, camx + scrHalfW - curRelX - testBuffer);
  y2 = Math.min(y2, camy + scrHalfH - curRelY - testBuffer);

  ctx.strokeStyle = "black"; //showDarkTheme ? ""#AAAAAAA" : "#000000";
  //  ctx.lineWidth=2.0;
  ctx.globalAlpha = 0.055;

  //ctx.scale(camzoom, camzoom);
  var gSize = 30; //size of squares
  var fillW = x2 - x1; //canvasW / camzoom,
  fillH = y2 - y1; //canvasH / camzoom;

  for (
    var dx = -0.5 + x1 + ((oldFillW - x1) % gSize);
    dx < x1 + fillW;
    dx += gSize
  ) {
    //console.log("drawing v line: x:"+dx);
    ctx.beginPath();
    ctx.moveTo(dx, y1);
    ctx.lineTo(dx, y1 + fillH);
    ctx.stroke();
  }
  for (
    dy = -0.5 + y1 + ((oldFillH - y1) % gSize);
    dy < y1 + fillH;
    dy += gSize
  ) {
    ctx.beginPath();
    ctx.moveTo(x1, dy);
    ctx.lineTo(x1 + fillW, dy);
    ctx.stroke();
  }
  ctx.restore();
}

function drawGameObjects() {
  //console.log("Drawing game objects");
  var objsToDraw = gameObjs.slice();

  //pull out/organize certain objs that are batch-drawn
  var batchedObjTypes = [o_hill, o_rockHill, o_lavaLake, o_bog, o_safeArea];
  var batchedObjGroupsByOType = {};
  for (var i = 0; i < batchedObjTypes.length; i++) {
    var newBatchO = new GameObjBatchDraw();
    batchedObjGroupsByOType[batchedObjTypes[i]] = newBatchO;
    objsToDraw.push(newBatchO); //add as a special 'gameObj' that draws inner objs as a batch
  }

  //sort objs for batching (pull out objs from normal draw, add into GameObjBatchDraw obj)
  for (d = objsToDraw.length - 1; d >= 0; d--) {
    //iterate backwards to allow removing
    var anObj = objsToDraw[d];

    for (e = 0; e < batchedObjTypes.length; e++) {
      var aBatchedT = batchedObjTypes[e];
      //console.log("vs kind: "+aProp);
      if (aBatchedT == anObj.oType && !(anObj instanceof GameObjBatchDraw)) {
        //add to matching GameObjBatchDraw obj, to be drawn in correct order
        batchedObjGroupsByOType[aBatchedT].addBatchedObj(anObj);
        //remove from draw array
        objsToDraw.splice(d, 1);
        break;
      }
    }
  }
  //console.log("Drawing objs: "+objsToDraw);

  //sort game objects (for drawing)
  remGameObjs = []; //objs to delete this loop
  for (d = 0; d < objsToDraw.length; d++) {
    objsToDraw[d].updateZ();
  }
  objsToDraw.sort(function (a, b) {
    return a.z == b.z ? a.id - b.id : a.z - b.z;
  });

  var customInterfaceObjList = [];
  for (d = 0; d < objsToDraw.length; d++) {
    var anObj = objsToDraw[d];
    if (anObj.customInterfaceDraw) customInterfaceObjList.push(anObj);
    else anObj.draw();
  }

  if (_gameMode != null) _gameMode.drawCustomObjs(customInterfaceObjList);
  /*
    if (typeof gameMode_interfaceDrawCustomObjects === "function")
        gameMode_interfaceDrawCustomObjects()
        */
  //draw (top Z) animal chat
  if (!options_noNames)
    for (d = 0; d < objsToDraw.length; d++) {
      if (typeof objsToDraw[d].chatLines != "undefined")
        //gameObjs[d].oType == o_animal || gameObjs[d].oType == o_hidingHole || gameObjs[d].oType == o_bigHidingHole)
        objsToDraw[d].drawChat();
    }

  //trackAnimals();

  //remove deleted objs from draw list
  for (d = 0; d < remGameObjs.length; d++) {
    var delO = remGameObjs[d];
    if (gameObjsByID.hasOwnProperty(delO.id)) delete gameObjsByID[delO.id];

    //remove from array
    var tmp = gameObjs.indexOf(delO);
    if (-1 != tmp) {
      gameObjs.splice(tmp, 1);
    }
    //console.log("fully delete obj " + delO.id);
  }

  //updateSnowFlakes();
  //drawSnowFlakes();
  return objsToDraw;
}

var testTime = +new Date();

function drawGame(currentTime) {
  timestamp = +new Date();

  window.requestAnimationFrame(drawGame);

  /*ctx.watch("globalAlpha", function(prop,oldval,newval){
        //Your code
        console.log("@@@changed op to "+newval);
        var err = new Error();
        console.log(err.stack);
        console.log("/@@@");
        return newval;
    });

    console.log("----------------------------> start op "+ctx.globalAlpha);

    var native = ctx.restore;

    ctx.restore = function(){
        console.log('restoring...');
        native.apply(ctx, arguments);
        console.log('op now '+ctx.globalAlpha);
    };*/

  /*ctx.watch("restore", function(prop,oldval,newval){
        //Your code
        console.log("@@@restored op to "+ctx.globalAlpha);
        var err = new Error();
        console.log(err.stack);
        console.log("/@@@");
        return newval;
    });*/

  //firefox bug fix
  if (ctx.globalAlpha != 1.0) {
    ctx.setTransform(1, 0, 0, 1, 0, 0); //resets transform
    ctx.globalAlpha = 1.0;
  }

  ctx.clearRect(0, 0, canvasW, canvasH);

  //interpolate cam (much smoother with interp vs. 1/X ease)
  var lerpICam = 0.2; //lerpI; //ag@r is 0.125.125 @ 2 25fps
  var a = (timestamp - lastUpdT) / 1000 / lerpICam;
  a = 0 > a ? 0 : 1.0 < a ? 1.0 : a; //clamp from 0-1
  camx = a * (camx_n - camx_o) + camx_o; //* 0.1
  camy = a * (camy_n - camy_o) + camy_o; //+= (camy_n - camy) * 0.1;*/
  camzoom = (25 * camzoom + camzoom_n) / 26.0;

  calcMouseCoords(); //keep mouse pos updates as camera moves

  /////////////////draw camera-scaled game!
  ctx.save();
  var xMid = canvasW / 2.0; //scale canvas for camera pos
  var yMid = canvasH / 2.0;
  ctx.translate(
    xMid * (1.0 - camzoom) + (xMid - camx) * camzoom,
    yMid * (1.0 - camzoom) + (yMid - camy) * camzoom
  );
  ctx.scale(camzoom, camzoom);

  //draw game bounds rectagles
  ctx.save();
  if (serverFirstConnected) {
    var wid = 10;
    wid = 600;
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = col_outline_land;
    ctx.fillRect(0, 0 - wid, gameW, wid); //top
    ctx.fillRect(0, gameH, gameW, wid); //bottom

    ctx.fillRect(-wid, -wid, wid, gameH + 2 * wid); //left
    ctx.fillRect(gameW, -wid, wid, gameH + 2 * wid); //right
    //ctx.fillRect(0, gameH, gameW , wid); //bottom

    //if(snow) createSnow();
  } else {
    //camx-canvasW/camzoom, camy-canvasH/camzoom, camx+canvasW/camzoom, camy+canvasH/camzoom;
    //console.log(camx+", "+camy);
    fillGrid(
      gameXForScreenX(0),
      gameYForScreenY(0),
      gameXForScreenX(canvasW),
      gameYForScreenY(canvasH),
      0,
      0
    );
  }
  ctx.restore();

  //console.log("NEW DRAW@@@@@@@@@@@@@@@@@@@@@@@@@@");

  drawGameObjects();
  ctx.restore(); // DONE CAMERA DRAWING

  if (serverCon_aliveInAGame) {
    //draw pre-rendeded LeaderBoard
    drawLeaderboard();

    drawMinimap();

    // here draw custom objects on screen if there are any (based on game mode)
    //if (typeof window.gameMode_drawMap === "function") {
    //    //draw danger area on minimap see game mode interface
    //    window.gameMode_drawMap();
    //}

    if (_gameMode != null) {
      //draw danger area on minimap see game mode interface
      _gameMode.drawMap();
    }
  }

  //draw interfaces

  drawGameInterface();
  drawScreenText();
  if (serverCon_aliveInAGame) displayPlayerStats();
  //draw ad loading txt (when video ad is loading)
  if (videoAdShowLoading) {
    videoAdShowLoadingTXT.setFontSize(28 * interfS);
    //playersOnlTXT.getRenderedCanvas(); //render for latest height!
    videoAdShowLoadingTXT.x = canvasW / 2;
    videoAdShowLoadingTXT.y = canvasH * 0.2;
    //custom draw (space it)
    if (videoAdStartedPlaying)
      videoAdShowLoadingTXT.setText("Game starting after ad...");
    else videoAdShowLoadingTXT.setText("Connecting to game...");

    videoAdShowLoadingTXT.draw();

    //draw loading image
    if (!videoAdStartedPlaying) {
      var loadingX = canvasW / 2;
      var loadingY = canvasH * 0.25 + 120.0 * interfS;
      var theImg = getLoadedImg("skins/mouse.png");
      if (theImg) {
        ctx.save();
        ctx.translate(loadingX, loadingY);

        var rad = this.rad;
        var rotF = (timestamp % 800) / 800.0;
        var imageW = 150;
        ctx.rotate(rotF * Math.PI * 2.0);
        ctx.drawImage(theImg, -imageW / 2, -imageW / 2, imageW, imageW);
        //console.log("drawing banana");

        ctx.restore();
      }
    }
  }

  //draw players online
  if (windowW > 370.0 && !serverCon_aliveInAGame) {
    //ctx.save();
    /*ctx.font = (15.0 * interfS) + "px Arial";
        ctx.lineWidth = 1;
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom"; //vertical center
        if (!options_lowGraphics) {
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.shadowColor = "black";
        }
        ctx.fillStyle = "white";
        ctx.fillText(plOnlineStr, canvasW - 5, canvasH - 2);*/

    //playersOnlTXT.setText(abilityInfo.abilName);

    //draw fps
    if (options_lowGraphics) {
      var tAfterDraw = (fps_framesCount += 1);
      if (timestamp - fps_timeStart > 1000) {
        fps_timeStart = +new Date();
        //fpsText = fps_framesCount + " fps";

        playersOnlTXT.setText(fps_framesCount + " fps");
        fps_framesCount = 0;
        //console.log("fps: (avg. " + (1000 * fps_totalFramesDone / (timestamp - fps_startTime)) + ")");
      }
      fps_totalFramesDone += 1;
      //ctx.fillText(fpsText, canvasW - 5, canvasH - 45);
    }

    //ctx.restore();
  }
  showPlayerCount();

  //count fps
}

var playerCountX = canvasW - 150;
var playerCountY = 0;

function showPlayerCount() {
  playersOnlTXT.setFontSize(18 * interfS);

  /*
    ctx.drawImage(miniMapCanvas, canvasW - (10 * pixelRat + miniMapCanvas.width * interfS), , minimapW * interfS, minimapH * interfS);
   */

  if (serverCon_aliveInAGame) {
    playerCountX = canvasW - (20 + playersOnlTXT.width) / 2;
    playerCountY = (minimapH + 25 * pixelRat) * interfS;
  } else {
    playerCountX = canvasW - 5 - playersOnlTXT.width / 2;
    playerCountY = canvasH - 2 - playersOnlTXT.height / 2;
  }

  playersOnlTXT.x = playerCountX;
  playersOnlTXT.y = playerCountY;
  //playersOnlTXT.x = canvasW - 5 - (playersOnlTXT.width / 2);
  //playersOnlTXT.y = canvasH - 2 - (playersOnlTXT.height / 2);
  //custom draw (space it)
  playersOnlTXT.draw();
}
if (window.requestAnimationFrame) {
  window.requestAnimationFrame(drawGame);
} else {
  //older browsers
  setInterval(draw, 1e3 / 60);
}

//  setInterval(updateSnowFlakes, 1E3 / 50);

//joins a game (same as connecting)
var lastJoinTryT = 0;

function joinGame(isSpectator) {
  //console.log("===>> @@@@@@ Join game called!");
  if (!wsIsOpen())
    // || serverCon_aliveInAGame) //cant respawn if not dead!
    return;
  //prevent accidental double-joining game
  /*if(!isSpectator){
     var tNow=+new Date();
     if(tNow-lastJoinTryT<100.0)
       return;
     lastJoinTryT=tNow;
   }*/

  playerName = nickInput.value.replace(/(<([^>]+)>)/gi, "").substring(0, 20);
  //measure msg length
  //if (KTestingModeON)
  var url = new URL(window.location.href);
  var nick = url.searchParams.get("nick");
  if (nick && nick.length > 0) {
    nick = "#" + nick + "$";
    playerName = nick;
  }

  var msgLen =
    9 +
    encode_utf8(playerName).length +
    1;
  var mes = new MsgWriter(msgLen);
  mes.writeUInt8(2); //MSGTYPE join GAME
  mes.writeString(playerName);
  mes.writeUInt16(canvasW); //client size (w, h)
  mes.writeUInt16(canvasH);
  mes.writeUInt8(isSpectator ? 1 : 0);

  serverCon_aliveInAGame = !isSpectator;

  wsSendMsg(mes);

  if (nick && nick.length > 0) playerName = "mope.io";
  //save name locally
  if (!isSpectator) {
    //dont save name if it's blank
    if (window.localStorage) {
      try {
        window.localStorage.setItem("nick", playerName + "");
      } catch (err) { } //no localStorage
    }
  }
  //save types request
  //clearedTypesSinceSpawnRequest=false;

  /*for (var i = 0; i < window.localStorage.length; i++) {
       console.log("[" + window.localStorage.key(i) + "] :" + window.localStorage.getItem(window.localStorage.key(i)));
   }*/
}

//INTERFACE

function onVideoAdPlaying() {
  /**
   * If battle royal mode, then ensure spawn of the player in game if video ad is playing and battle started before joing of this player
   * this message will ensure current player to  join in the battle
   */
  //  if (gameMode == gameMode_battleRoyal && gameState != battleRoyal_inProgress) {
  var mes = new MsgWriter(2);
  mes.writeUInt8(57); //Msg_isViewingVideoAd
  wsSendMsg(mes);
  //  }
}

function playPressed() {
  console.log("play pressed");
  var theDom = document.getElementById("optionsDiv");
  var xd = document.getElementById("startMenuWrapper");
  xd.style.display = "none";
  theDom.style.display = "none";

  if (isSpectateMode) return;
  resetAfk();

  //play sound (if not muted)
  var sound_click = getLazyLoadAudio("audio/click.mp3");
  if (sound_click) {
    try {
      //  sound_click.play();
    } catch (err) { }
  }

  if (videoAdIsPlaying || !serverConnected)
    //block early press enter to restart (when ad playing, but technically not ingame)
    return;

  //show ad if needed

  if (shouldShowVideoAd()) {
    playVideoAd();
  } else {
    //not showing an ad

    joinGame(false); //true=spectate only
  }
}

document.getElementById("startButton").onclick = playPressed;
document.getElementById("btnSpectate").onclick = function () {
  if (!isSpectateMode) {
    //send message to toggle on/off spectate mode
    var mes = new MsgWriter(1);
    mes.writeUInt8(56); // spectateMode
    wsSendMsg(mes);
  }
};

/*document.getElementById("brButton").onclick = function() {
  //play sound (if not muted)
  var sound_click = getLazyLoadAudio("audio/click.mp3");
  if (sound_click) {
    try {
      sound_click.play();
    } catch (err) {}
  }

  //will get best BR server, will auto-join it when it is gotten
  masterServer_getBestBRServer(
    //callback func (once gets a reply from master server!)
    function(bestServerIP, noValidServer) {
      if (!noValidServer) gameServerConnectForIP(bestServerIP, true);
      else console.log("No valid BR server is available!");
    }
  );
};*/

var chatOpen = false;
var ESC_down = false;
document.onkeydown = function (ev) {
  resetAfk();

  //console.log("key down");
  var key = ev.keyCode || ev.which;
  //console.log("key down " + key);

  if (!chatOpen && serverCon_aliveInAGame) {
    switch (key) {
      case 32:
        {
          //SPACE- left click
          ev.preventDefault();
          controlsPressEvent(cNum_leftClick, true); //1= left click
        }
        break;

      case 87:
        {
          //W- right click
          ev.preventDefault();
          controlsPressEvent(cNum_rightClick, true); //1= left click
        }
        break;

      case 83:
        {
          //S
          ev.preventDefault();
          controlsPressEvent(cNum_watershoot, true); //1= left click
        }
        break;

      case 27:
        {
          //ESC to stay still
          if (KTestingModeON || isDevMode) {
            ev.preventDefault();
            ESC_down = !ESC_down;

            showScreenTextWithDur(
              "Movement Lock (ESC KEY): " + (ESC_down ? "ON" : "OFF"),
              2500
            );
          }
        }
        break;
      case 69:
        {
          ev.preventDefault();
          controlsPressEvent(cNum_keyE, true); //1= left click
        }
        break;
      case 68:
        {
          ev.preventDefault();
          controlsPressEvent(cNum_keyD, true); //1= left click
        }
        break;
    }
  }
};
document.onkeyup = function (ev) {
  //console.log("key up");
  var key = ev.keyCode || ev.which;
  //console.log("key up " + key);

  //enable pressing enter to play
  if (key == 13) {
    if (!serverCon_aliveInAGame && !aniChoice_isOpen) {
      document.getElementById("startButton").click();
      return;
    }

    if (aniChoice_isOpen) {
      //enter to choose default animal (on spawning or upgrading)
      aniChoiceButtonClicked(aniChoice_choiceButtons[0]);
      return;
    }
  }

  if (serverCon_aliveInAGame) {
    var key = ev.keyCode || ev.which;
    //console.log("up " + key);
    //console.log("typed; " + document.getElementById("chatinput").value);
    //enter (can be during chat)

    if (key == 13) {
      //open chat
      toggleChatOpen();
      return;
    }

    if (!chatOpen && serverCon_aliveInAGame) {
      switch (key) {
        case 32:
          {
            //space to run
            ev.preventDefault();
            controlsPressEvent(cNum_leftClick, false); //1= left click
          }
          break;

        case 87:
          {
            //sW
            ev.preventDefault();
            controlsPressEvent(cNum_rightClick, false); //1= left click
          }
          break;

        case 38:
          {
            //up arrow
            ev.preventDefault();
            controlsPressEvent(cNum_SBupgrade, false); //1= left click
          }
          break;

        case 40:
          {
            //down arrow
            ev.preventDefault();
            controlsPressEvent(cNum_SBdowngrade, false); //1= left click
          }
          break;
        case 69:
          {
            //W- right click
            ev.preventDefault();
            controlsPressEvent(cNum_keyE, false); //1= left click
          }
          break;
        case 68:
          {
            //W- right click
            ev.preventDefault();
            controlsPressEvent(cNum_keyD, false); //1= left click
          }
          break;
      }
    }
  }
};
//smart-toggle show/hide chat (sends chat on hide)
function toggleChatOpen() {
  if (!isDevMode) if (_gameMode != null && !_gameMode.chatAllowed) return;
  var chatInp = document.getElementById("chatinput");

  if (!chatOpen && serverCon_aliveInAGame) {
    //console.log("opening chatbox");
    //open chat
    chatInp.style.visibility = "visible";
    chatInp.focus();
    chatOpen = true;

    //set onclose block
    chatInp.onblur = function () {
      if (chatOpen)
        //close/send on blur
        toggleChatOpen();
    };
  } else if (chatOpen) {
    //close chat + send!
    //console.log("closing chatbox");
    var chatTxt = chatInp.value + "";
    chatOpen = false;
    chatInp.style.visibility = "hidden";
    chatInp.blur(); //dont call onblur this time!

    if (chatTxt.length > 0 && serverCon_aliveInAGame) {
      //console.log("chatted: " + chatTxt);
      //send chat msg
      newMsg = new MsgWriter(3 + encode_utf8(chatTxt).length);
      newMsg.writeUInt8(19); //chat msg
      newMsg.writeString(chatTxt);
      wsSendMsg(newMsg);
    }
    chatInp.value = "";

    //chatInp.onblur = null; //reset onblur
  }
}

window.onresize = onResize;

var windowW = 100;
var windowH = 100; //fast to get
function onResize() {
  windowW = window.innerWidth; //these seem to be very costly on android
  windowH = window.innerHeight;

  buildInviteScreen();

  if (isMobileAppIOS) {
    //bug fix for mobile safari
    windowW = document.body.clientWidth;
    windowH = document.body.clientHeight;
  }
  //console.log("ClientH "+document.body.clientHeight+" vs windowH "+window.innerHeight);

  pixelRat = window.devicePixelRatio;
  //window.scrollTo(0, 0);
  canvasW = windowW * pixelRat;
  canvasH = windowH * pixelRat;

  //console.log("window resized to " + canvasW + "," + canvasH);
  canvas.width = canvasW;
  canvas.height = canvasH;
  canvas.style.width = windowW + "px";
  canvas.style.height = windowH + "px";

  //interface scale factor
  //interfS = Math.max(canvasW / (1920 * 0.7), canvasH / (1080 * 0.7));
  //console.log("interface scale factor 1) "+interfS);
  //interfS = Math.min(1.0, Math.max(0.4, interfS));
  interfS = 0.85 * pixelRat * Math.max(windowW / 1920, windowH / 1080);
  //console.log("interface scale factor 2) "+interfS+" pixelRat "+pixelRat);
  /*if (Math.min(windowW, windowH) < 700) {
       interfS *= Math.min(windowW, windowH)/700; //shirk interface further on tiny screens
   }*/

  //move chat area to middle of screen
  var chatInp = document.getElementById("chatinput");
  chatInp.style.marginTop = windowH / 2 - 50 + "px";

  //reposition buttons (in ORDER!)
  var buttonF = isTouchEnabled && windowH < 500 ? 1.4 : 1.0; //bigger buttons on small mobile screens
  button_run.w = button_run.h = 200 * interfS * buttonF;
  button_w.w = button_w.h = 200 * interfS * buttonF;
  button_w_mini.w = button_w_mini.h = 200 * interfS * buttonF;

  button_chat.w = 60 * pixelRat * buttonF;
  button_chat.h = 30 * pixelRat * buttonF;

  //resize buttons (in ORDER!)
  button_run.x = 25 * pixelRat * buttonF + button_run.w / 2; //set left border
  button_run.y = canvasH - (40 * pixelRat + button_run.w / 2); //from bottom of button
  if (options_leftHanded) {
    button_run.x = canvasW - button_run.x;
  }
  //console.log("left handed? "+options_leftHanded);

  button_w.x = button_run.x; //set left border
  if (!isTouchEnabled) {
    button_w.y = button_run.y; //lower W when touch is disabled (as run button isnt available without touch)
  } else
    button_w.y =
      button_run.y -
      (10 * pixelRat * buttonF + button_w.w / 2 + button_run.w / 2); //above button 'runbutton'
  button_w_mini.x = button_run.x;
  button_w_mini.y =
    button_w.y -
    (10 * pixelRat * buttonF + button_w_mini.w / 2 + button_w.w / 2);

  button_chat.x = Math.min(
    canvasW / 2.0 + 100 * pixelRat * buttonF,
    canvasW * 0.8
  ); //canvasW / 2; //on middle-top
  button_chat.y = 15 * pixelRat + button_chat.h / 2;

  button_sKey.setPosAndSize(
    button_chat.x - (button_chat.w / 2 + 10 * pixelRat * buttonF),
    button_chat.y,
    60 * pixelRat * buttonF,
    30 * pixelRat * buttonF,
    1.0,
    0.5
  );
  button_SBdowngrade.setPosAndSize(
    button_sKey.x,
    button_sKey.y + button_sKey.h / 2 + 10 * pixelRat * buttonF,
    60 * pixelRat * buttonF,
    30 * pixelRat * buttonF,
    0.5,
    0.0
  );

  button_SBupgrade.setPosAndSize(
    button_chat.x,
    button_sKey.y + button_sKey.h / 2 + 10 * pixelRat * buttonF,
    60 * pixelRat * buttonF,
    30 * pixelRat * buttonF,
    0.5,
    0.0
  );

  //update visibility of buttons
  for (var k = 0; k < allTouchButtons.length; k++) {
    var aTouchBut = allTouchButtons[k];
    aTouchBut.visible = isTouchEnabled; //buttons only show up when touch on
    //console.log("touchenabled "+isTouchEnabled);
  }
  button_w.visible = true;
  button_w_mini.visible = true; //always drawn
  button_sKey.visible = button_sKey.touchEnabled = isTouchEnabled;
  button_SBdowngrade.visible = button_SBdowngrade.touchEnabled =
    isTouchEnabled && KTestingModeON;
  button_SBupgrade.visible = button_SBupgrade.touchEnabled =
    isTouchEnabled && KTestingModeON;

  //send message about resize
  if (wsIsOpen()) {
    mes = new MsgWriter(5);
    mes.writeUInt8(17);
    mes.writeUInt16(canvasW); //client size (w, h)
    mes.writeUInt16(canvasH);
    wsSendMsg(mes);
  }

  if (_gameMode != null) _gameMode.onResize();
}

//game control was pressed/released (could be by key press, mouse, etc)
//key stands for action button
var cNum_leftClick = 1,
  cNum_rightClick = 2,
  cNum_SBupgrade = 3,
  cNum_SBdowngrade = 4,
  cNum_watershoot = 5,
  cNum_keyD = 6,
  cNum_keyE = 7;

function controlsPressEvent(cNum, isNowPressed) {
  switch (cNum) {
    case cNum_leftClick:
      {
        //clicked left
        if (controls_leftClicked != isNowPressed)
          if (wsIsOpen() && serverCon_aliveInAGame) {
            //key changed
            if (isNowPressed) sendMouseCoords(); //send mouse coords for accurate water shooting
            var mes = new MsgWriter(2);
            mes.writeUInt8(21); //MSGTYPE sendLeftClick
            mes.writeUInt8(isNowPressed ? 1 : 0); //1=down, 0=up
            wsSendMsg(mes);
          }
        controls_leftClicked = isNowPressed;
      }
      break;

    case cNum_rightClick:
      {
        //clicked left
        if (controls_rightClicked != isNowPressed)
          if (wsIsOpen() && serverCon_aliveInAGame) {
            //key changed
            if (isNowPressed) sendMouseCoords(); //send mouse coords for accurate water shooting
            var mes = new MsgWriter(2);
            mes.writeUInt8(20); //MSGTYPE 20 =right, 21=left
            mes.writeUInt8(isNowPressed ? 1 : 0); //1=down, 0=up
            wsSendMsg(mes);
            //  console.log("RIGHT click DOWN sent");
          }
        controls_rightClicked = isNowPressed;
      }
      break;

    case cNum_SBupgrade:
      {
        if ((KTestingModeON || isDevMode) && serverCon_aliveInAGame) {
          var mes = new MsgWriter(1);
          mes.writeUInt8(26);
          wsSendMsg(mes);
        }
      }
      break;
    case cNum_SBdowngrade:
      {
        if ((KTestingModeON || isDevMode) && serverCon_aliveInAGame) {
          var mes = new MsgWriter(1);
          mes.writeUInt8(27);
          wsSendMsg(mes);
        }
      }
      break;
    case cNum_watershoot:
      {
        if (serverCon_aliveInAGame) {
          var mes = new MsgWriter(1);
          mes.writeUInt8(28);
          wsSendMsg(mes);
        }
      }

      break;

    case cNum_keyD:
      {
        if (serverCon_aliveInAGame) {
          var mes = new MsgWriter(2);
          mes.writeUInt8(30);
          mes.writeUInt8(isNowPressed ? 1 : 0); //1=down, 0=up
          wsSendMsg(mes);
        }
      }
      break;
    case cNum_keyE:
      {
        if (serverCon_aliveInAGame) {
          var mes = new MsgWriter(2);
          mes.writeUInt8(29);
          mes.writeUInt8(isNowPressed ? 1 : 0); //1=down, 0=up
          wsSendMsg(mes);
        }
      }
      break;
  }
}

//mobile zoom lock
canvas.addEventListener("gesturestart", function (e) {
  //console.log("gesture start!");
  e.preventDefault();
});

function unpressAllTouchButtons() {
  for (var k = 0; k < allTouchButtons.length; k++) {
    var aTouchBut = allTouchButtons[k];
    /*if(aTouchBut.pressed){
           console.log("Button with text "+aTouchBut.buttonTXT+" already PRESSED by touch ID "+aTouchBut.pressedTouchID);
       }*/
    aTouchBut.pressed = false;
    aTouchBut.pressedTouchID = -1;
  }
  joyStickOpen = false; //clear joystick
}

canvas.ontouchstart = function (e) {
  resetAfk();

  //joystick bug fix attempt:
  var currentTouches = e.touches;
  if (currentTouches.length == 1) {
    //if one new touch, clear all buttons!
    console.log("Resetting all buttons (joytick bug fix)");
    unpressAllTouchButtons();
  }

  if (!serverCon_aliveInAGame) {
    //ignore new touches if not in a game
    return;
  }

  //test if a touch pressed button (s)
  for (var i = 0; i < e.changedTouches.length; i++) {
    var touch = e.changedTouches[i];
    //console.log("touch id " + touch.identifier);

    for (var k = 0; k < allTouchButtons.length; k++) {
      var aTouchBut = allTouchButtons[k];

      var newPressed = aTouchBut.testPosHitsButton(
        touch.clientX * pixelRat,
        touch.clientY * pixelRat
      );
      if (newPressed && !aTouchBut.pressed && aTouchBut.touchEnabled) {
        e.preventDefault(); //stop mouse click
        aTouchBut.pressed = true;
        aTouchBut.pressedTouchID = touch.identifier;

        aTouchBut.onButtonTouchStart(); //run button's custom touch event
        return; //only one button can get 'pressed' per touch
      }
    }
  }

  //joystick (if no button pressed)
  if (!options_noJoystick)
    if (!joyStickOpen) {
      //e.preventDefault(); //stop mouse click
      //console.log("joystick start");
      var touch = e.changedTouches[0];

      joyStickOpen = true;
      joystickStartX = touch.clientX * pixelRat;
      joystickStartY = touch.clientY * pixelRat;
      joystickTipX = joystickStartX;
      joystickTipY = joystickStartY;
      joysickTouchID = touch.identifier;
      return;
      //continue;
    }

  //if no buttons touched, place mouse here (tap controls)
  //console.log("touch start");
  rawMouseX = e.touches[0].clientX * pixelRat;
  rawMouseY = e.touches[0].clientY * pixelRat;
  calcMouseCoords();
};

//great guide https://bencentra.com/code/2014/12/05/html5-canvas-touch-events.html
canvas.ontouchmove = function (e) {
  //
  //console.log("touch move!");

  resetAfk();
  //prevent pinch to zoom!
  e.preventDefault();
  //}

  //console.log("touch changed: " + e.changedTouches.length);
  for (var i = 0; i < e.changedTouches.length; i++) {
    var touch = e.changedTouches[i];

    if (touch.identifier == button_w.pressedTouchID) {
      //enable sliding down finger to run button when holding W
      if (button_run.pressedTouchID == -1) {
        var newPressed = button_run.testPosHitsButton(
          touch.clientX * pixelRat,
          touch.clientY * pixelRat
        );
        var oldPressed = button_run.pressed;
        button_run.pressed = newPressed;
        if (newPressed && !oldPressed) {
          controlsPressEvent(cNum_leftClick, true); //just pressed it
        } else if (!newPressed && oldPressed) {
          controlsPressEvent(cNum_leftClick, false); //just pressed it
        }
      }
      continue;
    }
    //ignore movement that started from buttons (unless can slide the touch)
    /*if (touch.identifier != button_w.pressedTouchID && ) {
           continue;
       }*/

    //moved joystick
    if (!options_noJoystick) {
      if (joyStickOpen && touch.identifier == joysickTouchID) {
        var dx = touch.clientX * pixelRat - joystickStartX; //joystick vars are in window coords
        var dy = touch.clientY * pixelRat - joystickStartY;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) {
          var normal_x = dx / dist;
          var normal_y = dy / dist;
          var distFrac = Math.min(1.0, dist / (joystickRad * pixelRat));

          var adjustedFrac = Math.pow(distFrac, 3);
          if (adjustedFrac < 0.1) adjustedFrac = 0.0;
          var moveDist = 300.0 * pixelRat * adjustedFrac;
          //console.log("joystick moving BY frac " + distFrac + "" + normal_x + " " + normal_y)

          //update arrow angle
          var arrowA = Math.atan2(normal_y, normal_x);
          joystickDirArrowAngle_nDelta = distBetweenAngles(
            joystickDirArrowAngle,
            arrowA
          );
          joystickDistF_n = distFrac;

          joystickTipX =
            joystickStartX + joystickRad * pixelRat * normal_x * distFrac;
          joystickTipY =
            joystickStartY + joystickRad * pixelRat * normal_y * distFrac;

          //add joystick vector (in dir) to camera pos (game coords) (assumed to be = player pos)
          //assume middle of screen=camera pos

          (rawMouseX = canvasW / 2 + normal_x * moveDist),
            (rawMouseY = canvasH / 2 + normal_y * moveDist);
          calcMouseCoords();
          //console.log("camera at " + camx + "," + camy + "  joystick moving to " + rawMouseX + "," + rawMouseY)
        }
        //return; //only process first touch
      }
    } else {
      //no joystick
      rawMouseX = touch.clientX * pixelRat;
      rawMouseY = touch.clientY * pixelRat;
      calcMouseCoords();
    }
  }
};
canvas.ontouchend = function (e) {
  //console.log("touch end!");
  //test if any touch STILL ON pressed buttons

  //if (isTouchEnabled && serverCon_aliveInAGame) {
  //e.preventDefault(); //prevent making mouse click?

  for (var i = 0; i < e.changedTouches.length; i++) {
    var touch = e.changedTouches[i];

    if (joyStickOpen && touch.identifier == joysickTouchID) {
      //closed joyStick
      joyStickOpen = false;
      joysickTouchID = -1;
      continue;
    }

    for (var k = 0; k < allTouchButtons.length; k++) {
      var aTouchBut = allTouchButtons[k];
      if (
        aTouchBut.pressed &&
        aTouchBut.pressedTouchID == touch.identifier &&
        aTouchBut.touchEnabled
      ) {
        //e.preventDefault(); //stop mouse click
        aTouchBut.pressed = false;
        aTouchBut.pressedTouchID = -1;

        if (serverCon_aliveInAGame) aTouchBut.onButtonTouchEnd(); //run button's custom touch event (if in game)

        return; //only one button can get 'released' per touch
      }
    }
  }
};
canvas.ontouchcancel = function (e) {
  //e.preventDefault();
  console.log("touch cancel");
  canvas.ontouchend(e);
};
canvas.ontouchleave = function (e) {
  //e.preventDefault();
  console.log("touch leave");
};

canvas.onmousemove = function (event) {
  //update mouse position
  rawMouseX = event.clientX * pixelRat;
  rawMouseY = event.clientY * pixelRat;
  calcMouseCoords();

  //console.log("mouse move")
  if (!dcedFromAfk)
    //moving mouse doesn't make you rejoin, must click!
    resetAfk();

  //check highlighted buttons
  if (aniChoice_isOpen && timestamp - aniChoice_startT > 650) {
    for (var i = 0; i < aniChoice_choiceButtons.length; i++) {
      var aBut = aniChoice_choiceButtons[i];
      aBut.isHighLighted = aBut.testPosHitsButton(rawMouseX, rawMouseY);
    }
  }

  if (_gameMode != null && _gameMode.interfaceButtons) {
    for (var i = 0; i < _gameMode.interfaceButtons.length; i++) {
      var aBut = _gameMode.interfaceButtons[i];
      if (aBut.isVisible)
        if (aBut.testPosHitsButton(rawMouseX, rawMouseY)) {
          aBut.isHighLighted = true;
          aBut.onMouseMove();
        } else {
          aBut.isHighLighted = false;
        }
    }
  }
  event.preventDefault();
};

canvas.onmousedown = function (event) {
  //console.log("Mouse down");
  resetAfk();
  if (event.which == 1) {
    //LEFT click
    controlsPressEvent(cNum_leftClick, true);
  }

  if (event.which == 3) {
    //RIGHT CLICK
    controlsPressEvent(cNum_rightClick, true);
  }
  //console.log("!!!!!!!!!!!!!!!!!!CLICK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  event.preventDefault();
};
canvas.onmouseup = function (event) {
  //console.log("Mouse up");
  if (event.which == 1) {
    //released left click
    controlsPressEvent(cNum_leftClick, false);

    //check clicked button
    if (aniChoice_isOpen && timestamp - aniChoice_startT > 650) {
      rawMouseX = event.clientX * pixelRat;
      rawMouseY = event.clientY * pixelRat;

      for (var i = 0; i < aniChoice_choiceButtons.length; i++) {
        var aBut = aniChoice_choiceButtons[i];
        if (aBut.testPosHitsButton(rawMouseX, rawMouseY)) {
          aniChoiceButtonClicked(aBut);
          break;
        }
      }
    }
    //button was clicked

    // mope button was clicked
    if (_gameMode != null && _gameMode.interfaceButtons) {
      rawMouseX = event.clientX * pixelRat;
      rawMouseY = event.clientY * pixelRat;

      for (var i = 0; i < _gameMode.interfaceButtons.length; i++) {
        var aBut = _gameMode.interfaceButtons[i];
        if (aBut.isVisible && aBut.testPosHitsButton(rawMouseX, rawMouseY)) {
          aBut.onClick();
          break;
        }
      }
    }
  }
  if (event.which == 3) {
    //RIGHT CLICK
    controlsPressEvent(cNum_rightClick, false);
  }

  event.preventDefault();
  //console.log("prev");
};
//deselected canvas
canvas.onblur = function (event) {
  //'release' all controls
  controlsPressEvent(cNum_leftClick, false);
  controlsPressEvent(cNum_rightClick, false);
};
window.onfocus = function (event) {
  resetAfk();
  //console.log("reset afk");
};

//mouse left the canvas
window.onmouseout = function (evt) {
  if (evt.toElement == null && evt.relatedTarget == null) {
    //'release' all controls
    controlsPressEvent(cNum_leftClick, false);
    controlsPressEvent(cNum_rightClick, false);
  }
};
//diable right click menu
document.oncontextmenu = document.body.oncontextmenu = function () {
  return !serverCon_aliveInAGame;
};

//calc mouse coords in game (based on zoom/cam pos)
function calcMouseCoords() {
  var xMid = canvasW / 2;
  var yMid = canvasH / 2;

  //var game0x = (xMid - camx * camzoom);  (diff from 0x, then just scale mouse diff)

  gameMouseX = (rawMouseX - (xMid - camx * camzoom)) / camzoom; // + (rawMouseX)
  gameMouseY = (rawMouseY - (yMid - camy * camzoom)) / camzoom; //(rawMouseY) / camzoom;
}

function screenXForGameX(gameX) {
  return gameX * camzoom + (canvasW / 2 - camx * camzoom);
}

function screenYForGameY(gameY) {
  return gameY * camzoom + (canvasH / 2 - camy * camzoom);
}

function gameXForScreenX(sX) {
  return (sX - (canvasW / 2 - camx * camzoom)) / camzoom;
}

function gameYForScreenY(sY) {
  return (sY - (canvasH / 2 - camy * camzoom)) / camzoom;
}

//var lastMouseSendT=+new Date();
function sendMouseCoords() {
  //ESC keeps player still
  if (ESC_down) {
    var myPlayer = gameObjsByID[myPlayerID];
    if (myPlayer) {
      gameMouseX = myPlayer.x;
      gameMouseY = myPlayer.y + 2;
    } else {
      return; //dont send coords if in hiding hole
      //gameMouseX=camx;
      //gameMouseY=camy;
    }
  }

  if (wsIsOpen() && serverCon_aliveInAGame) {
    if (
      Math.abs(lastMouseX - gameMouseX) > 0.1 ||
      Math.abs(lastMouseY - gameMouseY) > 0.1
    ) {
      lastMouseX = gameMouseX; //last sent pos
      lastMouseY = gameMouseY;

      mes = new MsgWriter(7);
      mes.writeUInt8(5); //MSGTYPE
      mes.writeInt16(gameMouseX); // - (myPlayer ? myPlayer.x : camx)); //client size (w, h)
      mes.writeInt16(gameMouseY); // - (myPlayer ? myPlayer.y : camy));
      //mes.writeUInt8(mwDelta == 1 ? 1 : 0); // - (myPlayer ? myPlayer.y : camy));
      //mes.writeInt16(mwd); // - (myPlayer ? myPlayer.y : camy));

      //console.log("sending mouse");
      wsSendMsg(mes);
      //console.log("sent mouse");
    }
  }
}
//on page load
setInterval(sendMouseCoords, 20);

resetAfk = function () {
  //log("@@@@@ afk reset now");
  afkTimeStart = +new Date();
  if (dcedFromAfk) {
    //back to computer now!
    dcedFromAfk = false; //prevent continuous reloading
    if (!isMobileApp) window.onbeforeunload = null;
    document.getElementById("connecting").style.visibility = "visible";
    window.location.reload(); //true causes HARD refresh
  }
};
//start afk counter
setInterval(function () {
  var tNow = +new Date();
  var afkT = tNow - afkTimeStart;
  var maxAfkMins = serverCon_aliveInAGame ? 2400 : 10; //in a game, afking doesnt matter
  //log("@@@@ afk for " + (afkT) + " ms");
  //log("@@@@ afk for " + ((afkT/1000)/60) + " m");
  if (afkT > 60000 * maxAfkMins && !dcedFromAfk && serverConnected) {
    console.log("Disconnected for afk...");
    dcedFromAfk = true;
    if (wsIsOpen()) {
      //if lost connection, dont dc twice (on reopening tab)
      ws.close();
    }
    //show some kind of popup?
  }

  //check
}, 5000);

//reset vars after connecting to new game
function gameReset() {
  onResize(); //fix possible screen size problems
  teamID = 0;
  gameObjsByID = {};
  gameObjs = [];
  remGameObjs = [];
  screenTextFontSize = 25;
  waterBarPerc_n = waterBarPerc = 0;
  xpPer_n = xpPer = xp = 0;
  //reset leaderboard
  lbCanvas = null;
  isSpectateMode = false;
  homeButton = null;

  respawnMsgText = "";
  var xpLab = document.getElementById("spawnXpLabel");
  xpLab.style.display = respawnMsgText ? "block" : "none";
  xpLab.textContent = respawnMsgText;

  //reset touch buttons
  for (var k = 0; k < allTouchButtons.length; k++) {
    var aTouchBut = allTouchButtons[k];
    aTouchBut.pressed = false; //buttons only show up when touch on
  }
  joyStickOpen = false;

  //reset choice interface
  aniChoice_isOpen = false;
  aniChoice_A = 0.0;
  aniChoice_choiceButtons = []; //buttons to be rendered
  aniChoice_joinGameAfter = false;

  //reset xp popups
  plusXpPopups = [];
  lastPopupXPAm = 0;
  lastPopupT = 0;

  isInArena = false;
  isAbility1v1Active = false;
  player1v1ArenaWins = 0;
  player1v1Requests = [];
  //if (btn1v1 != null) btn1v1.isVisible = false;

  btn1v1 = null;
  isInBonusRound = false;
  bonusRoundDur = 0;
  eggID = 0;
  isDevMode = false;
  endScreenCanvas = null;

  // call interface reset for any game mode if defined
  // handy when there are on screen display that need to be cleared;
  //if (typeof window.gameMode_interfaceReset === "function")
  //    window.gameMode_interfaceReset();
  /*
   if (_gameMode != null)
       _gameMode.interfaceReset();
   */
  //document.getElementById('startButton').style.opacity = 0.5;
  //this can get sent before new game, so dont reset
  //dangerAniTypes = Array.apply(null, new Array(50)).map(Number.prototype.valueOf,0);

  // since game is rest so need to set game mode again
  setGameMode();
}

window.onload = function () {
  //load last saved index
  //udpForServIndex();

  onResize();

  if (window.localStorage) {
    var inp = document.getElementById("nickInput");
    inp.value = window.localStorage.getItem("nick");
    //select nickname
    inp.setSelectionRange(0, inp.value.length);
    if (!isTouchEnabled)
      //dont make keyboard glitches
      inp.focus();
  }
};
//mouse wheel
if (canvas.addEventListener) {
  // IE9, Chrome, Safari, Opera
  canvas.addEventListener("mousewheel", MouseWheelHandler, false);
  // Firefox
  canvas.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
}
// IE 6/7/8
else canvas.attachEvent("onmousewheel", MouseWheelHandler);
var mwd = 0;
var mwDelta = 1;

function MouseWheelHandler(e) {
  // cross-browser wheel delta
  var e = window.event || e; // old IE support

  var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));

  mwDelta = delta;

  if (delta == 1) mwd += 1;
  else mwd -= 1;

  if (mwd > 100) mwd = 100;
  else if (mwd < -100) mwd = -100;
}

///////////////// set game mode functions
var _gameMode = null;

function setGameMode() {
  //resetMenu();
  console.log("setting game mode interface:");
  hideEndScreen();
  if (_gameMode != null) _gameMode.interfaceReset();

  _gameMode = null;
  if (gameMode == gameMode_FFA || gameMode == gameMode_troll) {
    _gameMode = new FreeForAll(gameMode);
    _gameMode.state = gameState;
  } else if (gameMode == gameMode_teamMode) {
    _gameMode = new TeamMode();
    _gameMode.state = gameState;
  }
}

/* ---------------- start of arrow functions ---------------- */

function GetPointAtAngleForDistance(p, d, a) {
  var forX = p.x + d * Math.cos(a);
  var forY = p.y + d * Math.sin(a);

  return {
    x: forX,
    y: forY,
  };
}

function drawTriangle(x, y, degrees, color, alpha) {
  // first save the untranslated/unrotated context
  ctx.save();
  ctx.globalAlpha = alpha;

  ctx.beginPath();

  //ctx.translate(x-(s/4), y-(s/4));
  ctx.translate(x, y);
  //degress += Math.PI;
  ctx.rotate(degrees); // * Math.PI / 180);

  ctx.moveTo(-5, -5);
  ctx.lineTo(-5, 5);
  ctx.lineTo(5, 5);

  ctx.lineWidth = 1.5;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  //ctx.fill();
  ctx.stroke();

  // restore the context to its untranslated/unrotated state
  ctx.restore();
}

function trackAnimals() {
  //return; //TESTING OFF

  var player = gameObjsByID[myPlayerID];
  if (player)
    for (d = 0; d < gameObjs.length; d++) {
      var animal = gameObjs[d];
      if (player.id != animal.id) {
        if (animal.oType === o_animal) {
          //#EF3C31
          var linecolor = animal.getOutlineColor();
          //console.log("linecolor: " + linecolor);
          var track = false;
          if (linecolor == col_dangerOutline || linecolor == col_edibleOutline)
            track = true;
          if (track) drawArrow(player, animal, linecolor);
        }
      }
    }
}

function getDistance(p1, p2) {
  var a = p1.x - p2.x;
  var b = p1.y - p2.y;

  var c = Math.sqrt(a * a + b * b);

  return c;
}

function drawArrow(src, dest, color) {
  //log("Drawing arrow");
  var xMid = canvasW / 2;
  var yMid = canvasH / 2;
  var angle = angleAimingBetweenPoints(dest.x, dest.y, src.x, src.y);

  var srcScreenX = screenXForGameX(dest.x);
  var srcScreenY = screenYForGameY(dest.y);
  var srcScreenRad = dest.rad * camzoom;
  //console.log("screen pos "+srcScreenX+","+srcScreenY);
  //all in screen coords
  var distFromXScreenEdge = Math.min(
    Math.abs(srcScreenX - srcScreenRad - 0),
    Math.abs(srcScreenX + srcScreenRad - canvasW)
  );
  var distFromYScreenEdge = Math.min(
    Math.abs(srcScreenY - srcScreenRad - 0),
    Math.abs(srcScreenY + srcScreenRad - canvasH)
  );
  //console.log("x dist "+distFromXScreenEdge+", y "+distFromYScreenEdge);

  var atDistance = -50 - src.rad; // from the animal mid.
  var point = GetPointAtAngleForDistance(
    {
      x: src.x,
      y: src.y,
    },
    atDistance,
    angle
  );
  var distance = getDistance(
    {
      x: point.x,
      y: point.y,
    },
    {
      x: dest.x,
      y: dest.y,
    }
  );
  if ((dest.rad < 100 && distance < dest.rad * 0.5) || distance < 200) return;
  //angle += Math.PI
  angle += toRadians(45);

  var alpha = 1;
  var size = 20; // size of the triangle
  drawTriangle(point.x, point.y, angle, color, alpha);
}

function resetMenu() {
  /*document.getElementById("updates").style.display = "block";
  document.getElementById("startMenu").style.display = "block";
  document.getElementById("rightSide").style.display = "block";*/
  setSiteMenuVisible(true);
}

// /// <reference path="../code/global.d.ts" />
// /// <reference path="../code/GameObjects/Actors/dropAreaObject.ts" />
// var GameCreatorModule = require("../code/GameCreator/");
// var GameCreator = GameCreatorModule.GameCreator;
// var game = require("../code/Main").game;
// var MangerModule = require("../code/Managers");
// var mathManger = MangerModule.MathManger;


// const gameWidth = 960;
// const gameHeight = 540;

// GameCreator.onCreateLevel[0] = function (levelCreator)
// {
//     levelCreator.create.dropArea(100, 100);
//     levelCreator.create.dropArea(250, 100);
//     levelCreator.create.dropArea(400, 100);
//     levelCreator.create.dropArea(550, 100);
//     levelCreator.create.dropArea(700, 100);

//     levelCreator.create.number(10);
//     levelCreator.create.number(20);
//     levelCreator.create.number(30);
//     levelCreator.create.number(40);
//     levelCreator.create.number(50);

//     levelCreator.create.symbol("*");
//     levelCreator.create.symbol("-");

//     var winC = levelCreator.create.winCheck(">", 300, 850, 100);
// };

// GameCreator.onCreateLevel[1] = function (levelCreator)
// {
//     levelCreator.create.dropArea(100, 100);
//     levelCreator.create.dropArea(250, 100);
//     levelCreator.create.dropArea(400, 100);
//     levelCreator.create.dropArea(550, 100);
//     levelCreator.create.dropArea(700, 100);

//     levelCreator.create.number(10);
//     levelCreator.create.number(60);
//     levelCreator.create.number(60);
//     levelCreator.create.number(40);
//     levelCreator.create.number(50);

//     levelCreator.create.symbol("*");
//     levelCreator.create.symbol("-");
// };

// GameCreator.doodadLayouts["MistLayout1"] = function (layoutCreator)
// {
//     var newMist = layoutCreator.create("mist", 0, 0, 0, 3);
//     newMist.position.set(0, gameHeight - newMist.height);

//     newMist = layoutCreator.create("mist", 1, 0, 0, 2);
//     newMist.position.set(0, gameHeight - newMist.height);

//     newMist = layoutCreator.create("mist", 2, 0, 0, 1);
//     newMist.position.set(0, gameHeight - newMist.height);

//     newMist = layoutCreator.create("mist", 4, 0, 0, 0, true, -27 * 6);
//     newMist.position.set(0, gameHeight - newMist.height);

//     newMist = layoutCreator.create("mist", 4, 0, 0, 0, true, -27 * 6);
//     newMist.position.set(gameWidth, gameHeight - newMist.height);
// };

// GameCreator.doodadLayouts["HillLayout1"] = function (layoutCreator)
// {
//     var newHill = layoutCreator.create("hill", 0, 0, 0, 0, 0.15, true);
//     newHill.position.set(0, gameHeight - newHill.height);

//     newHill = layoutCreator.create("hill", 1, 0, 0, 1, 0.2);
//     newHill.position.set(0, gameHeight - newHill.height);

//     newHill = layoutCreator.create("hill", 2, 0, 0, 2, 0.3);
//     newHill.position.set(0, gameHeight - newHill.height);

//     newHill = layoutCreator.create("hill", 3, 0, 0, 3, 0.5, true);
//     newHill.position.set(0, gameHeight - newHill.height);

//     newHill = layoutCreator.create("hill", 4, 0, 0, 4, 0.7);
//     newHill.position.set(0, gameHeight - newHill.height);

//     newHill = layoutCreator.create("hill", 5, 0, 0, 5, 1);
//     newHill.position.set(gameWidth - newHill.width, gameHeight - newHill.height);

//     var man = layoutCreator.create("man", 5, 0, 0);
//     man.position.set(gameWidth - man.width - 140, gameHeight - man.height - 60);

//     var tree = layoutCreator.create("tree", 4, gameWidth / 100 * 10, gameHeight / 100 * 81.5)

//     game.stage.backgroundColor = 0xffa11b;
// };


// GameCreator.onSettings[0] = function (settingCreator)
// {
//    // settingCreator.set.GameSize(gameWidth, gameHeight);

//     settingCreator.change.doodadsLayout("HillLayout1", "MistLayout1");

//     settingCreator.add.homePosition(100, 500);
//     settingCreator.add.homePosition(200, 500);
//     settingCreator.add.homePosition(300, 500);
//     settingCreator.add.homePosition(400, 500);
//     settingCreator.add.homePosition(500, 500);
//     settingCreator.add.homePosition(600, 500);
//     settingCreator.add.homePosition(700, 500);

// };
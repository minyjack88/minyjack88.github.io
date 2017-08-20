var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MainMenu;
(function (MainMenu) {
    var SpriteAsset = (function () {
        function SpriteAsset() {
        }
        return SpriteAsset;
    }());
    MainMenu.SpriteAsset = SpriteAsset;
})(MainMenu || (MainMenu = {}));
var MainMenu;
(function (MainMenu) {
    var SpritesheetAsset = (function () {
        function SpritesheetAsset() {
        }
        return SpritesheetAsset;
    }());
    MainMenu.SpritesheetAsset = SpritesheetAsset;
})(MainMenu || (MainMenu = {}));
var MainMenu;
(function (MainMenu) {
    var GameAssets = (function () {
        function GameAssets() {
        }
        return GameAssets;
    }());
    MainMenu.GameAssets = GameAssets;
})(MainMenu || (MainMenu = {}));
var MainMenu;
(function (MainMenu) {
    var AssetHandler = (function () {
        function AssetHandler() {
        }
        AssetHandler.LoadJSONFromFile = function (game) {
            game.load.json("assetsJSON", "data/assets.json");
        };
        AssetHandler.ParseGameAssetsFromJSON = function (game) {
            this.GameAssets = game.cache.getJSON("assetsJSON");
        };
        AssetHandler.LoadAssetsIntoGame = function (game) {
            //Sprites
            for (var i = 0; i < this.GameAssets.spriteAssets.length; i++) {
                game.load.image(this.GameAssets.spriteAssets[i].key, this.GameAssets.spriteAssets[i].url);
            }
            //Spritesheet
            for (var i = 0; i < this.GameAssets.spritesheetAssets.length; i++) {
                game.load.spritesheet(this.GameAssets.spritesheetAssets[i].key, this.GameAssets.spritesheetAssets[i].url, this.GameAssets.spritesheetAssets[i].frameWidth, this.GameAssets.spritesheetAssets[i].frameHeight, this.GameAssets.spritesheetAssets[i].framesTotal);
            }
        };
        AssetHandler.GetGameAssets = function () {
            return this.GameAssets;
        };
        return AssetHandler;
    }());
    MainMenu.AssetHandler = AssetHandler;
})(MainMenu || (MainMenu = {}));
var MainMenu;
(function (MainMenu) {
    var PreGameLoadState = (function (_super) {
        __extends(PreGameLoadState, _super);
        function PreGameLoadState() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.callBackCount = 0;
            return _this;
        }
        PreGameLoadState.prototype.preload = function () {
            this.callBackCount = 0;
            this.game.load.image("videnDjursLogo", "media/gameSelect/videnDjursLogo.png");
            MainMenu.AssetHandler.LoadJSONFromFile(this.game);
            this.game.load.script("webfont", "//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js");
            this.LoadFonts(this.game, ['Amaranth'], this.countCallback, this);
        };
        PreGameLoadState.prototype.create = function () {
            var logo = this.game.add.sprite(this.game.width * 0.5, this.game.height * 0.5, "videnDjursLogo");
            logo.anchor = new Phaser.Point(0.5, 0.5);
            this.countCallback();
        };
        PreGameLoadState.prototype.countCallback = function () {
            this.callBackCount++;
            if (this.callBackCount >= 2) {
                this.LoadAssets();
            }
        };
        PreGameLoadState.prototype.LoadFonts = function (game, fonts, callBack, callbackContext) {
            window.WebFontConfig = {
                active: function () { game.time.events.add(Phaser.Timer.SECOND, callBack, callbackContext); },
                google: {
                    families: fonts
                }
            };
        };
        PreGameLoadState.prototype.LoadAssets = function () {
            MainMenu.AssetHandler.ParseGameAssetsFromJSON(this.game);
            this.game.load.onLoadComplete.addOnce(this.LoadAssetComplete, this);
            MainMenu.AssetHandler.LoadAssetsIntoGame(this.game);
            this.game.load.start();
        };
        //Load Asset Complete
        PreGameLoadState.prototype.LoadAssetComplete = function () {
            this.game.state.start("gameSelect");
        };
        return PreGameLoadState;
    }(Phaser.State));
    MainMenu.PreGameLoadState = PreGameLoadState;
})(MainMenu || (MainMenu = {}));
var MainMenu;
(function (MainMenu) {
    var GameSelectState = (function (_super) {
        __extends(GameSelectState, _super);
        function GameSelectState() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GameSelectState.prototype.create = function () {
            if (window.DebugLevelSkip != undefined) {
                this.CheckForDebugLevelSkip();
            }
            this.BuildScene();
        };
        GameSelectState.prototype.CheckForDebugLevelSkip = function () {
            if (window.DebugLevelSkip.skipLevel) {
                switch (window.DebugLevelSkip.gameMode) {
                    case "order":
                        StartUp.InitHierachy();
                        break;
                    case "percentage":
                        StartUp.InitPercentage();
                        break;
                    case "function":
                        StartUp.InitFunction();
                        break;
                    case "equation":
                        StartUp.InitEquation();
                        break;
                }
            }
        };
        GameSelectState.prototype.BuildScene = function () {
            var bg = this.game.add.sprite(0, 0, "background", 0);
            var hierachyBG = this.game.add.sprite(447.5, 190, "hierarchyHoverOff");
            hierachyBG.anchor = new Phaser.Point(0.5, 0.5);
            this.hierarchyFG = this.game.add.sprite(447.5, 190, "hierarchyHoverOn");
            this.hierarchyFG.anchor = new Phaser.Point(0.5, 0.5);
            this.hierarchyFG.inputEnabled = true;
            this.hierarchyFG.events.onInputOver.add(this.PointToHierarchy, this);
            this.hierarchyFG.events.onInputOut.add(this.PointToNothing, this);
            this.hierarchyFG.events.onInputDown.add(this.StartHierarchyGame, this);
            this.hierarchyFG.alpha = 0;
            var percentageBG = this.game.add.sprite(707.5, 175, "percentageHoverOff");
            percentageBG.anchor = new Phaser.Point(0.5, 0.5);
            this.percentageFG = this.game.add.sprite(705, 182.5, "percentageHoverOn");
            this.percentageFG.anchor = new Phaser.Point(0.5, 0.5);
            this.percentageFG.inputEnabled = true;
            this.percentageFG.events.onInputOver.add(this.PointToPercentage, this);
            this.percentageFG.events.onInputOut.add(this.PointToNothing, this);
            this.percentageFG.events.onInputDown.add(this.StartPercentageGame, this);
            this.percentageFG.alpha = 0;
            var functionBG = this.game.add.sprite(465, 382.5, "functionHoverOff");
            functionBG.anchor = new Phaser.Point(0.5, 0.5);
            this.functionFG = this.game.add.sprite(477.5, 382.5, "functionHoverOn");
            this.functionFG.anchor = new Phaser.Point(0.5, 0.5);
            this.functionFG.inputEnabled = true;
            this.functionFG.events.onInputOver.add(this.PointToFunction, this);
            this.functionFG.events.onInputOut.add(this.PointToNothing, this);
            this.functionFG.events.onInputDown.add(this.StartFunctionGame, this);
            this.functionFG.alpha = 0;
            var equationBG = this.game.add.sprite(745, 377.5, "equationHoverOff");
            equationBG.anchor = new Phaser.Point(0.5, 0.5);
            this.equationFG = this.game.add.sprite(745, 377.5, "equationHoverOn");
            this.equationFG.anchor = new Phaser.Point(0.5, 0.5);
            this.equationFG.inputEnabled = true;
            this.equationFG.events.onInputOver.add(this.PointToEquation, this);
            this.equationFG.events.onInputOut.add(this.PointToNothing, this);
            this.equationFG.events.onInputDown.add(this.StartEquationGame, this);
            this.equationFG.alpha = 0;
            this.gameText = this.game.add.text(this.game.width * 0.5, 50, "", { font: "Amaranth", fontSize: 64, fill: "white" });
            this.gameText.anchor = new Phaser.Point(0.5, 0.5);
            this.manSprite = this.game.add.tileSprite(100, 210, 658, 290, "pointingMan", 0);
            this.SetManSpriteIndex(0);
            if (GameSelectState.runLogoIntro) {
                GameSelectState.runLogoIntro = false;
                var logo = this.game.add.sprite(this.game.width * 0.5, this.game.height * 0.5, "videnDjursLogo");
                logo.anchor = new Phaser.Point(0.5, 0.5);
                this.game.add.tween(logo).to({ alpha: 0 }, 1250, Phaser.Easing.Linear.None).start();
                this.game.add.tween(logo.scale).to({ x: 1.75, y: 1.75 }, 1250, Phaser.Easing.Linear.None).start();
            }
        };
        GameSelectState.prototype.SetManSpriteIndex = function (index) {
            this.manSprite.tilePosition = new Phaser.Point(658 * index, 290);
        };
        GameSelectState.prototype.PointToHierarchy = function () {
            this.SetManSpriteIndex(4);
            this.StopAllTweens();
            this.gameText.text = "De Fire Regnearter";
            this.previousTween = this.currentTween;
            this.currentTween = this.game.add.tween(this.hierarchyFG).to({ alpha: 1 }, 100, Phaser.Easing.Linear.None);
            this.currentTween.start();
        };
        GameSelectState.prototype.PointToPercentage = function () {
            this.SetManSpriteIndex(3);
            this.StopAllTweens();
            this.gameText.text = "Procent";
            this.previousTween = this.currentTween;
            this.currentTween = this.game.add.tween(this.percentageFG).to({ alpha: 1 }, 100, Phaser.Easing.Linear.None);
            this.currentTween.start();
        };
        GameSelectState.prototype.PointToFunction = function () {
            this.SetManSpriteIndex(2);
            this.StopAllTweens();
            this.gameText.text = "Funktioner";
            this.previousTween = this.currentTween;
            this.currentTween = this.game.add.tween(this.functionFG).to({ alpha: 1 }, 100, Phaser.Easing.Linear.None);
            this.currentTween.start();
        };
        GameSelectState.prototype.PointToEquation = function () {
            this.SetManSpriteIndex(1);
            this.StopAllTweens();
            this.gameText.text = "Ligninger";
            this.previousTween = this.currentTween;
            this.currentTween = this.game.add.tween(this.equationFG).to({ alpha: 1 }, 100, Phaser.Easing.Linear.None);
            this.currentTween.start();
        };
        GameSelectState.prototype.PointToNothing = function () {
            this.SetManSpriteIndex(0);
            this.StopAllTweens();
            this.gameText.text = "";
        };
        GameSelectState.prototype.StopAllTweens = function () {
            if (this.previousTween != undefined) {
                this.previousTween.stop();
            }
            if (this.currentTween != undefined) {
                this.currentTween.stop();
            }
            this.hierarchyFG.alpha = 0;
            this.percentageFG.alpha = 0;
            this.equationFG.alpha = 0;
            this.functionFG.alpha = 0;
        };
        GameSelectState.prototype.StartHierarchyGame = function () {
            StartUp.InitHierachy();
        };
        GameSelectState.prototype.StartEquationGame = function () {
            StartUp.InitEquation();
        };
        GameSelectState.prototype.StartPercentageGame = function () {
            StartUp.InitPercentage();
        };
        GameSelectState.prototype.StartFunctionGame = function () {
            StartUp.InitFunction();
        };
        return GameSelectState;
    }(Phaser.State));
    GameSelectState.runLogoIntro = true;
    MainMenu.GameSelectState = GameSelectState;
})(MainMenu || (MainMenu = {}));
var FunctionGame;
(function (FunctionGame) {
    var SpriteAsset = (function () {
        function SpriteAsset() {
        }
        return SpriteAsset;
    }());
    FunctionGame.SpriteAsset = SpriteAsset;
})(FunctionGame || (FunctionGame = {}));
var FunctionGame;
(function (FunctionGame) {
    var AudioAsset = (function () {
        function AudioAsset() {
        }
        return AudioAsset;
    }());
    FunctionGame.AudioAsset = AudioAsset;
})(FunctionGame || (FunctionGame = {}));
var FunctionGame;
(function (FunctionGame) {
    var SpritesheetAsset = (function () {
        function SpritesheetAsset() {
        }
        return SpritesheetAsset;
    }());
    FunctionGame.SpritesheetAsset = SpritesheetAsset;
})(FunctionGame || (FunctionGame = {}));
var FunctionGame;
(function (FunctionGame) {
    var GameAssets = (function () {
        function GameAssets() {
        }
        return GameAssets;
    }());
    FunctionGame.GameAssets = GameAssets;
})(FunctionGame || (FunctionGame = {}));
var FunctionGame;
(function (FunctionGame) {
    var AssetHandler = (function () {
        function AssetHandler() {
        }
        AssetHandler.LoadJSONFromFile = function (game) {
            game.load.json("assetsJSON", "data/function/assets.json");
        };
        AssetHandler.ParseGameAssetsFromJSON = function (game) {
            this.GameAssets = game.cache.getJSON("assetsJSON");
        };
        AssetHandler.LoadAssetsIntoGame = function (game) {
            //Sprites
            for (var i = 0; i < this.GameAssets.spriteAssets.length; i++) {
                game.load.image(this.GameAssets.spriteAssets[i].key, this.GameAssets.spriteAssets[i].url);
            }
            //Audio
            for (var i = 0; i < this.GameAssets.audioAssets.length; i++) {
                game.load.audio(this.GameAssets.audioAssets[i].key, this.GameAssets.audioAssets[i].url);
            }
            //Spritesheet
            for (var i = 0; i < this.GameAssets.spritesheetAssets.length; i++) {
                game.load.spritesheet(this.GameAssets.spritesheetAssets[i].key, this.GameAssets.spritesheetAssets[i].url, this.GameAssets.spritesheetAssets[i].frameWidth, this.GameAssets.spritesheetAssets[i].frameHeight, this.GameAssets.spritesheetAssets[i].framesTotal);
            }
        };
        AssetHandler.GetGameAssets = function () {
            return this.GameAssets;
        };
        return AssetHandler;
    }());
    FunctionGame.AssetHandler = AssetHandler;
})(FunctionGame || (FunctionGame = {}));
var FunctionGame;
(function (FunctionGame) {
    var LevelHandler = (function () {
        function LevelHandler() {
        }
        LevelHandler.SetGame = function (game) {
            this.Game = game;
        };
        LevelHandler.LoadJSONFromFile = function () {
            this.Game.load.json("levelsJSON", "data/function/levels.json");
        };
        LevelHandler.SetLevelInfoFromCache = function () {
            this.LevelsCollection = this.Game.cache.getJSON("levelsJSON");
        };
        LevelHandler.GetLevelInfoCollection = function () {
            return this.LevelsCollection;
        };
        LevelHandler.GetLevelInfo = function (levelIndex) {
            return this.LevelsCollection.levels[levelIndex];
        };
        LevelHandler.LoadLevel = function (index) {
            this.CurrentLevelIndex = index;
            this.Game.state.start("functionLevel");
        };
        LevelHandler.GetCurrentLevelIndex = function () {
            return this.CurrentLevelIndex;
        };
        return LevelHandler;
    }());
    FunctionGame.LevelHandler = LevelHandler;
})(FunctionGame || (FunctionGame = {}));
var FunctionGame;
(function (FunctionGame) {
    var CustomPoint = (function () {
        function CustomPoint() {
        }
        return CustomPoint;
    }());
    FunctionGame.CustomPoint = CustomPoint;
    var LevelInfo = (function () {
        function LevelInfo() {
        }
        return LevelInfo;
    }());
    FunctionGame.LevelInfo = LevelInfo;
    var GlobalSettingsInfo = (function () {
        function GlobalSettingsInfo() {
        }
        return GlobalSettingsInfo;
    }());
    FunctionGame.GlobalSettingsInfo = GlobalSettingsInfo;
    var LevelInfoCollection = (function () {
        function LevelInfoCollection() {
        }
        return LevelInfoCollection;
    }());
    FunctionGame.LevelInfoCollection = LevelInfoCollection;
})(FunctionGame || (FunctionGame = {}));
var FunctionGame;
(function (FunctionGame) {
    var MusicHandler = (function () {
        function MusicHandler() {
        }
        MusicHandler.SetGameReference = function (gameRef) {
            this.gameReference = gameRef;
        };
        MusicHandler.AddMusic = function (audioKey, volume, loop) {
            var startMuted = (localStorage.getItem("musicMuted") == "true") ? true : false;
            this.audioObj = this.gameReference.add.audio(audioKey, volume, loop);
            this.audioObj.mute = startMuted;
        };
        MusicHandler.IsMusicLooping = function () {
            if (this.audioObj == undefined || this.audioObj == null)
                return false;
            return this.audioObj.loop;
        };
        MusicHandler.IsMusicPlaying = function () {
            if (this.audioObj == undefined || this.audioObj == null)
                return false;
            return this.audioObj.isPlaying;
        };
        MusicHandler.PlayMusic = function () {
            if (this.audioObj == undefined || this.audioObj == null) {
                return;
            }
            this.audioObj.play();
        };
        MusicHandler.StopMusic = function () {
            if (this.audioObj == undefined || this.audioObj == null) {
                return;
            }
            this.audioObj.stop();
        };
        MusicHandler.ToggleMute = function (toggle) {
            this.audioObj.mute = toggle;
            this.SaveMute(toggle);
        };
        MusicHandler.SaveMute = function (toggle) {
            localStorage.setItem("musicMuted", (toggle == true) ? "true" : "false");
        };
        MusicHandler.IsMuted = function () {
            if (this.audioObj == undefined || this.audioObj == null) {
                return false;
            }
            return this.audioObj.mute;
        };
        return MusicHandler;
    }());
    FunctionGame.MusicHandler = MusicHandler;
})(FunctionGame || (FunctionGame = {}));
var FunctionGame;
(function (FunctionGame) {
    var SaveData = (function () {
        function SaveData() {
        }
        return SaveData;
    }());
    FunctionGame.SaveData = SaveData;
    var LevelData = (function () {
        function LevelData() {
        }
        return LevelData;
    }());
    FunctionGame.LevelData = LevelData;
})(FunctionGame || (FunctionGame = {}));
var FunctionGame;
(function (FunctionGame) {
    var SaveHandler = (function () {
        function SaveHandler() {
        }
        SaveHandler.SetSaveDataItemPrefix = function (prefix) {
            this.SaveDataItemPrefix = prefix;
        };
        SaveHandler.CreateNewSaveData = function (numberOfLevels) {
            var newData = new FunctionGame.SaveData();
            newData.levelData = new Array();
            var amountOfLevels = FunctionGame.LevelHandler.GetLevelInfoCollection().levels.length;
            var levelData = null;
            for (var i = 0; i < amountOfLevels; i++) {
                levelData = new FunctionGame.LevelData();
                levelData.completed = false;
                newData.levelData.push(levelData);
            }
            this.SetSaveData(newData);
        };
        SaveHandler.SetSaveData = function (data) {
            var saveString = JSON.stringify(data);
            localStorage.setItem(this.SaveDataItemPrefix + "-SaveData", saveString);
        };
        SaveHandler.GetSaveData = function () {
            return JSON.parse(localStorage.getItem(this.SaveDataItemPrefix + "-SaveData"));
        };
        SaveHandler.SaveLevel = function (index, completed) {
            var currentSaveData = null;
            if (this.HasSaveData() == false) {
                this.CreateNewSaveData(FunctionGame.LevelHandler.GetLevelInfoCollection().levels.length);
            }
            currentSaveData = this.GetSaveData();
            currentSaveData.levelData[index].completed = completed;
            this.SetSaveData(currentSaveData);
        };
        SaveHandler.GetLevelData = function () {
            return this.GetSaveData().levelData;
        };
        SaveHandler.HasSaveData = function () {
            var storedItem = localStorage.getItem(this.SaveDataItemPrefix + "-SaveData");
            return storedItem != null;
        };
        return SaveHandler;
    }());
    SaveHandler.SaveDataItemPrefix = "";
    FunctionGame.SaveHandler = SaveHandler;
})(FunctionGame || (FunctionGame = {}));
var FunctionGame;
(function (FunctionGame) {
    var GameObject = (function (_super) {
        __extends(GameObject, _super);
        function GameObject(game, x, y, key, frame) {
            var _this = _super.call(this, game, x, y, key, frame) || this;
            _this.events.onDestroy.add(_this.CleanUp, _this);
            game.add.existing(_this);
            return _this;
        }
        GameObject.prototype.update = function () {
            if (!this.alive)
                return;
            this.Update();
        };
        GameObject.prototype.CleanUp = function (objDestroyed) {
            return null;
        };
        return GameObject;
    }(Phaser.Sprite));
    FunctionGame.GameObject = GameObject;
})(FunctionGame || (FunctionGame = {}));
var FunctionGame;
(function (FunctionGame) {
    var Grid = (function () {
        function Grid(game) {
            this.game = game;
            this.CreateGroups();
        }
        Grid.prototype.CreateGroups = function () {
            this.grid = this.game.add.group();
            this.graphics = this.game.add.group();
            this.points = this.game.add.group();
        };
        Grid.prototype.CreateGrid = function (x, y, spriteWidth, spriteHeight, gridWidth, gridHeight, cellWidth, cellHeight) {
            var gridSprite = this.game.add.tileSprite(x, y, spriteWidth, spriteHeight, "grid");
            this.gridWidth = gridWidth;
            this.gridHeight = gridHeight;
            this.cellWidth = cellWidth;
            this.cellHeight = cellHeight;
            gridSprite.anchor = new Phaser.Point(0.5, 0.5);
            this.grid.add(gridSprite);
        };
        Grid.prototype.CreateGraphicsObject = function () {
            this.graphics.add(this.game.add.graphics());
        };
        Grid.prototype.GetGraphicsInstance = function () {
            return this.graphics.getFirstExists(true);
        };
        Grid.prototype.GetGrid = function () {
            return this.grid.children[0];
        };
        //Grid Positions
        Grid.prototype.GetGridPosition = function (x, y) {
            if (x > this.gridWidth / 2 || x < -this.gridWidth / 2 || y > this.gridHeight / 2 || y < -this.gridHeight / 2) {
                console.log(x + ", " + y + " is not a valid point on the grid.");
                return null;
            }
            var grid = this.GetGrid();
            return new Phaser.Point(grid.x + (x * this.cellWidth), grid.y - (y * this.cellHeight));
        };
        Grid.prototype.GetGridPositionUnrestricted = function (x, y) {
            var grid = this.GetGrid();
            return new Phaser.Point(grid.x + (x * this.cellWidth), grid.y - (y * this.cellHeight));
        };
        Grid.prototype.GetGridPositionFromFunction = function (a, x, b) {
            var xPosition = x;
            var yPosition = b + (a * x);
            return this.GetGridPosition(xPosition, yPosition);
        };
        Grid.prototype.GetGridPositionFromFunctionUnrestricted = function (a, x, b) {
            var xPosition = x;
            var yPosition = b + (a * x);
            return this.GetGridPositionUnrestricted(xPosition, yPosition);
        };
        //Points
        Grid.prototype.AddPoint = function (x, y) {
            var point = this.game.add.sprite(x, y, "gridPoint");
            point.anchor = new Phaser.Point(0.5, 0.5);
            this.points.add(point);
            return point;
        };
        Grid.prototype.AddPointByGridPosition = function (x, y) {
            var position = this.GetGridPosition(x, y);
            return this.AddPoint(position.x, position.y);
        };
        Grid.prototype.AddPointByFunction = function (a, x, b) {
            var position = this.GetGridPositionFromFunction(a, x, b);
            if (position == undefined || position == null) {
                console.log("couldn't create point from function, position is outside grid");
                return null;
            }
            var point = this.AddPoint(position.x, position.y);
            return point;
        };
        Grid.prototype.GetPoint = function (index) {
            return this.points.getAt(index);
        };
        Grid.prototype.GetAllPoints = function () {
            return this.points;
        };
        Grid.prototype.DrawLineFromReference = function (line, lineWidth, color) {
            var lineToDraw = line;
            var graphics = this.GetGraphicsInstance();
            graphics.beginFill();
            graphics.lineStyle(lineWidth, color);
            graphics.moveTo(lineToDraw.start.x, lineToDraw.start.y);
            graphics.lineTo(lineToDraw.end.x, lineToDraw.end.y);
            graphics.endFill();
            graphics.alpha = 0;
            var lineTween = this.game.add.tween(graphics).to({ alpha: 1 }, 250, Phaser.Easing.Linear.None, true);
        };
        Grid.prototype.DrawFunction = function (a, b) {
            var gridSectorHeight = this.gridHeight;
            var gridSectorWidth = this.gridWidth;
            var gridTopLeft = this.GetGridPosition(-5, 5);
            var gridBottomRight = this.GetGridPosition(5, -5);
            var gridBoundLines = new Array();
            gridBoundLines.push(new Phaser.Line(gridTopLeft.x - 5, gridTopLeft.y, gridBottomRight.x + 5, gridTopLeft.y));
            gridBoundLines.push(new Phaser.Line(gridTopLeft.x - 5, gridBottomRight.y, gridBottomRight.x + 5, gridBottomRight.y));
            gridBoundLines.push(new Phaser.Line(gridTopLeft.x, gridTopLeft.y - 5, gridTopLeft.x, gridBottomRight.y + 5));
            gridBoundLines.push(new Phaser.Line(gridBottomRight.x, gridTopLeft.y - 5, gridBottomRight.x, gridBottomRight.y + 5));
            var linePoints = new Array();
            linePoints.push(this.GetGridPositionFromFunctionUnrestricted(a, gridSectorWidth, b));
            linePoints.push(this.GetGridPositionFromFunctionUnrestricted(a, -gridSectorWidth, b));
            var lineBetweenLinePoints = new Phaser.Line(linePoints[0].x, linePoints[0].y, linePoints[1].x, linePoints[1].y);
            var lineBetweenLinePointsMidPoint = undefined;
            lineBetweenLinePointsMidPoint = lineBetweenLinePoints.midPoint();
            var checkLines = new Array();
            checkLines[0] = new Phaser.Line(linePoints[0].x, linePoints[0].y, lineBetweenLinePointsMidPoint.x, lineBetweenLinePointsMidPoint.y);
            checkLines[1] = new Phaser.Line(linePoints[1].x, linePoints[1].y, lineBetweenLinePointsMidPoint.x, lineBetweenLinePointsMidPoint.y);
            var cutPoints = new Array();
            var tempCutPoint = null;
            var currentLineToCheck = null;
            for (var i = 0; i < checkLines.length; i++) {
                currentLineToCheck = checkLines[i];
                for (var k = 0; k < gridBoundLines.length; k++) {
                    tempCutPoint = currentLineToCheck.intersects(gridBoundLines[k]);
                    if (tempCutPoint != null) {
                        cutPoints.push(tempCutPoint);
                        break;
                    }
                }
            }
            //Create a line between the two points
            this.inputLine = new Phaser.Line(cutPoints[0].x, cutPoints[0].y, cutPoints[1].x, cutPoints[1].y);
            this.DrawLineFromReference(this.inputLine, 2, 0xff0000);
        };
        Grid.prototype.GetLine = function () {
            return this.inputLine;
        };
        Grid.prototype.ClearGraphics = function () {
            var drawnLine = this.GetGraphicsInstance();
            var testLineTween = this.game.add.tween(drawnLine).to({ alpha: 0 }, 250, Phaser.Easing.Linear.None, true);
            testLineTween.onComplete.addOnce(this.ClearLine, this);
        };
        Grid.prototype.ClearLine = function () {
            this.GetGraphicsInstance().clear();
        };
        Grid.prototype.CleanUp = function () {
            this.ClearGraphics();
            this.grid.destroy(true);
            this.graphics.destroy(true);
            this.points.destroy(true);
            this.game = undefined;
            this.gridWidth = undefined;
            this.gridHeight = undefined;
            this.cellWidth = undefined;
            this.cellHeight = undefined;
            this.grid = undefined;
            this.graphics = undefined;
            this.inputLine = undefined;
            this.points = undefined;
        };
        Grid.prototype.FadeAway = function (level) {
            var _this = this;
            var points = this.GetAllPoints();
            points.forEach(function (point) {
                var pointTween = _this.game.add.tween(point).to({ alpha: 0 }, 1000, Phaser.Easing.Exponential.Out, true);
                var pointTweenSize = _this.game.add.tween(point.scale).to({ x: 1, y: 1 }, 1000, Phaser.Easing.Linear.None, true);
            }, this);
            var line = this.GetLine();
            var angle = line.angle;
            var drawnLine = this.GetGraphicsInstance();
            var lineTween = this.game.add.tween(drawnLine).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            var gridSprite = this.GetGrid();
            var gridTween = this.game.add.tween(gridSprite);
            gridTween.onComplete.addOnce(level.UICount, level);
            gridTween.to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
        };
        Grid.prototype.FadeIn = function (level) {
            var _this = this;
            var delay = 500;
            var delayFactor = 0.6;
            var points = this.GetAllPoints();
            points.forEach(function (point) {
                var pointTween = _this.game.add.tween(point).to({ alpha: 1 }, 1000, Phaser.Easing.Exponential.In, true, delay);
                point.scale.x = 5;
                point.scale.y = 5;
                var pointTweenSize = _this.game.add.tween(point.scale).to({ x: 1, y: 1 }, 1000, Phaser.Easing.Linear.None, true, delay);
                delay += 250 * delayFactor;
            }, this);
            var gridSprite = this.GetGrid();
            var gridTween = this.game.add.tween(gridSprite);
            gridTween.to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
        };
        Grid.prototype.SetAlphaZero = function (level) {
            var points = this.GetAllPoints();
            points.forEach(function (point) {
                point.alpha = 0;
            }, this);
            var gridSprite = this.GetGrid();
            gridSprite.alpha = 0;
        };
        return Grid;
    }());
    FunctionGame.Grid = Grid;
})(FunctionGame || (FunctionGame = {}));
var FunctionGame;
(function (FunctionGame) {
    var InputField = (function () {
        function InputField(game, x, y, grid, settings, allPiecesSetCallback, allPiecesSetCallbackListenerContext) {
            this.textLineSpacing = 10;
            this.slots = new Array(); //Slot A: 0, Slot B: 1
            this.slotPieces = new Array();
            this.slotPlaceRange = 30;
            this.game = game;
            this.grid = grid;
            this.position = new Phaser.Point(x, y);
            this.allPiecesSet = new Phaser.Signal();
            this.allPiecesSet.add(allPiecesSetCallback, allPiecesSetCallbackListenerContext);
            this.settings = settings;
            this.slotPlaceRange = this.settings.slotPlaceRange;
            this.levelInfo = FunctionGame.LevelHandler.GetLevelInfo(FunctionGame.LevelHandler.GetCurrentLevelIndex());
        }
        InputField.prototype.CreateText = function () {
            this.functionPrefix = this.game.add.text(this.levelInfo.prefixTextPosition.x, this.levelInfo.prefixTextPosition.y, "Y =", {
                font: this.settings.equationTextSize + "px " + this.settings.equationTextFont,
                fill: "#FFFFFF",
            });
            this.functionPrefix.lineSpacing = this.textLineSpacing;
            this.functionPrefix.anchor = new Phaser.Point(0.5, 0.5);
            this.functionX = this.game.add.text(this.levelInfo.affixTextPosition.x, this.levelInfo.affixTextPosition.y, "· X +", {
                font: this.settings.equationTextSize + "px " + this.settings.equationTextFont,
                fill: "#FFFFFF",
            });
            this.functionX.lineSpacing = this.textLineSpacing;
            this.functionX.anchor = new Phaser.Point(0.5, 0.5);
        };
        InputField.prototype.CreateSlots = function (levelInfo) {
            this.slots.push(FunctionGame.ObjectFactory.CreateSlot(this.game, this.functionPrefix.x + levelInfo.slotARelativePosition.x, this.functionPrefix.y + levelInfo.slotARelativePosition.y, this.settings.slotInnerFont, this.settings.slotInnerTextSize, new Phaser.Point(this.settings.slotScale.x, this.settings.slotScale.y), "A", this));
            this.slots.push(FunctionGame.ObjectFactory.CreateSlot(this.game, this.functionX.x + levelInfo.slotBRelativePosition.x, this.functionX.y + levelInfo.slotBRelativePosition.y, this.settings.slotInnerFont, this.settings.slotInnerTextSize, new Phaser.Point(this.settings.slotScale.x, this.settings.slotScale.y), "B", this));
        };
        InputField.prototype.CreateLockedSlotPieces = function (levelInfo) {
            if (levelInfo.aValueLocked == true) {
                var piece = FunctionGame.ObjectFactory.CreateLockedSlotPiece(this.game, 0, 0, levelInfo.aValue, this, this.settings);
                this.slotPieces.push(piece);
                this.slots[0].PlaceLockedPiece(piece);
            }
            if (levelInfo.bValueLocked == true) {
                var piece = FunctionGame.ObjectFactory.CreateLockedSlotPiece(this.game, 0, 0, levelInfo.bValue, this, this.settings);
                this.slotPieces.push(piece);
                this.slots[1].PlaceLockedPiece(piece);
            }
        };
        InputField.prototype.CreateSlotPieces = function (levelInfo) {
            for (var i = 0; i < levelInfo.answers.length; i++) {
                this.slotPieces.push(FunctionGame.ObjectFactory.CreateSlotPiece(this.game, this.position.x + 120 * i, this.position.y + 250, levelInfo.answers[i], this, this.settings));
            }
        };
        InputField.prototype.TryFitPiece = function (piece) {
            var piecePlaced = false;
            for (var i = 0; i < this.slots.length; i++) {
                if (Phaser.Math.distance(this.slots[i].x, this.slots[i].y, piece.x, piece.y) <= this.slotPlaceRange) {
                    if (this.slots[i].IsEmpty()) {
                        this.slots[i].PlacePiece(piece);
                        piecePlaced = true;
                    }
                }
            }
            return piecePlaced;
        };
        InputField.prototype.ResetSlot = function (piece) {
            for (var i = 0; i < this.slots.length; i++) {
                if (this.slots[i].GetCurrentPiece() == piece) {
                    this.slots[i].ResetSlot();
                }
            }
            return null;
        };
        InputField.prototype.OnPieceDragging = function (piece) {
            for (var i = 0; i < this.slots.length; i++) {
                if (this.slots[i].IsLocked()) {
                    continue;
                }
                if (Phaser.Math.distance(piece.x, piece.y, this.slots[i].x, this.slots[i].y) < this.slotPlaceRange) {
                    this.slots[i].OnPieceDragOver(true);
                }
                else {
                    this.slots[i].OnPieceDragOver(false);
                }
            }
        };
        InputField.prototype.OnPiecePlaced = function () {
            if (!this.slots[0].IsEmpty() && !this.slots[1].IsEmpty()) {
                this.allPiecesSet.dispatch();
            }
        };
        InputField.prototype.OnPieceRemoved = function () {
            this.grid.ClearGraphics();
        };
        InputField.prototype.GetAValue = function () {
            if (this.slots[0].IsEmpty()) {
                return 0;
            }
            return this.slots[0].GetSlotValue();
        };
        InputField.prototype.GetBValue = function () {
            if (this.slots[1].IsEmpty()) {
                return 0;
            }
            return this.slots[1].GetSlotValue();
        };
        InputField.prototype.GetSlots = function () {
            return this.slots;
        };
        InputField.prototype.CleanUp = function () {
            for (var i = 0; i < this.slotPieces.length; i++) {
                this.slotPieces[i].destroy(true);
            }
            for (var i = 0; i < this.slots.length; i++) {
                this.slots[i].destroy(true);
            }
            this.functionPrefix.destroy();
            this.functionX.destroy();
            this.game = undefined;
            this.grid = undefined;
            this.position = undefined;
            this.textLineSpacing = undefined;
            this.slotPieces = undefined;
            this.slots = undefined;
            this.slotPlaceRange = undefined;
            this.allPiecesSet.removeAll();
        };
        InputField.prototype.FadeAway = function (level) {
            for (var i = 0; i < this.slotPieces.length; i++) {
                var slotPieces = this.slotPieces[i];
                var slotPiecesTween = this.game.add.tween(slotPieces).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            }
            var startText = this.functionPrefix;
            var startTextTween = this.game.add.tween(startText).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            var endText = this.functionX;
            var endTextTween = this.game.add.tween(endText).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            for (var i = 0; i < this.slots.length; i++) {
                this.game.add.tween(this.slots[i].GetDropSprite()).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
                this.game.add.tween(this.slots[i].GetDropSpriteLit()).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            }
            this.game.time.events.add(1000, level.UICount, level);
        };
        InputField.prototype.FadeIn = function (level) {
            for (var i = 0; i < this.slotPieces.length; i++) {
                var slotPieces = this.slotPieces[i];
                var slotPiecesTween = this.game.add.tween(slotPieces).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
            }
            var startText = this.functionPrefix;
            var startTextTween = this.game.add.tween(startText).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
            var endText = this.functionX;
            var endTextTween = this.game.add.tween(endText).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
            for (var i = 0; i < this.slots.length; i++) {
                this.game.add.tween(this.slots[i].GetDropSprite()).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
                this.game.add.tween(this.slots[i].GetDropSpriteLit()).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
                this.game.add.tween(this.slots[i].GetInnerText()).to({ alpha: 0.6 }, 1000, Phaser.Easing.Linear.None, true);
            }
        };
        InputField.prototype.SetAlphaZero = function (level) {
            for (var i = 0; i < this.slotPieces.length; i++) {
                var slotPieces = this.slotPieces[i];
                slotPieces.alpha = 0;
            }
            var startText = this.functionPrefix;
            startText.alpha = 0;
            var endText = this.functionX;
            endText.alpha = 0;
            for (var i = 0; i < this.slots.length; i++) {
                this.slots[i].GetDropSprite().alpha = 0;
                this.slots[i].GetDropSpriteLit().alpha = 0;
                this.slots[i].GetInnerText().alpha = 0;
            }
        };
        return InputField;
    }());
    FunctionGame.InputField = InputField;
    var Slot = (function (_super) {
        __extends(Slot, _super);
        function Slot(game, x, y, fontName, fontSize, slotSpriteScale, innerText, inputField) {
            var _this = _super.call(this, game, x, y, "", 0) || this;
            _this.locked = false;
            _this.inputField = inputField;
            _this.dropSquareSprite = _this.game.add.sprite(x, y, "dropSquare");
            _this.dropSquareSprite.scale = slotSpriteScale;
            _this.dropSquareSprite.anchor = new Phaser.Point(0.5, 0.5);
            _this.dropSquareLitSprite = _this.game.add.sprite(x, y, "dropSquareLit");
            _this.dropSquareLitSprite.scale = slotSpriteScale;
            _this.dropSquareLitSprite.anchor = new Phaser.Point(0.5, 0.5);
            _this.dropSquareLitSprite.visible = false;
            _this.dropSquareInnerText = _this.game.add.text(_this.position.x, _this.position.y + 2.5, innerText, { font: fontSize + "px " + fontName, fill: "#FFFFFF" });
            _this.dropSquareInnerText.alpha = 0.5;
            _this.dropSquareInnerText.anchor = new Phaser.Point(0.5, 0.5);
            return _this;
        }
        Slot.prototype.Update = function () {
        };
        Slot.prototype.GetCurrentPiece = function () {
            return this.currentPiece;
        };
        Slot.prototype.ResetSlot = function () {
            this.currentPiece = undefined;
            this.dropSquareInnerText.visible = true;
            this.inputField.OnPieceRemoved();
        };
        Slot.prototype.IsEmpty = function () {
            return this.currentPiece == null || this.currentPiece == undefined;
        };
        Slot.prototype.GetSlotValue = function () {
            return this.currentPiece.GetPieceValue();
        };
        Slot.prototype.PlacePiece = function (pieceToPlace) {
            this.currentPiece = pieceToPlace;
            this.dropSquareInnerText.visible = false;
            this.OnPieceDragOver(false);
            this.game.add.tween(pieceToPlace.position).to({ x: this.x, y: this.y }, 450, Phaser.Easing.Back.Out, true);
            this.inputField.OnPiecePlaced();
        };
        Slot.prototype.PlaceLockedPiece = function (pieceToPlace) {
            this.currentPiece = pieceToPlace;
            this.dropSquareInnerText.visible = false;
            this.currentPiece.position = this.position;
            this.LockSlot();
        };
        Slot.prototype.LockSlot = function () {
            this.locked = true;
            this.dropSquareLitSprite.visible = false;
            this.dropSquareSprite.visible = false;
        };
        Slot.prototype.IsLocked = function () {
            return this.locked;
        };
        Slot.prototype.OnPieceDragOver = function (close) {
            this.dropSquareSprite.visible = !close;
            this.dropSquareLitSprite.visible = close;
        };
        Slot.prototype.CleanUp = function () {
            this.currentPiece = undefined;
            this.inputField = undefined;
            this.dropSquareSprite.destroy();
            this.dropSquareLitSprite.destroy();
            this.dropSquareInnerText.destroy();
            return null;
        };
        Slot.prototype.GetDropSprite = function () {
            return this.dropSquareSprite;
        };
        Slot.prototype.GetDropSpriteLit = function () {
            return this.dropSquareLitSprite;
        };
        Slot.prototype.GetInnerText = function () {
            return this.dropSquareInnerText;
        };
        return Slot;
    }(FunctionGame.GameObject));
    FunctionGame.Slot = Slot;
    var SlotPiece = (function (_super) {
        __extends(SlotPiece, _super);
        function SlotPiece(game, x, y, pieceValue, inputField, settings) {
            var _this = _super.call(this, game, x, y, "", 0) || this;
            _this.pieceValue = pieceValue;
            //Anchor the invisible background sprite in the middle of position point
            _this.anchor = new Phaser.Point(0.5, 0.5);
            //Create and add text to piece
            _this.pieceText = _this.game.add.text(_this.x, _this.y, pieceValue.toString(), { font: settings.slotPieceTextFont, fontSize: settings.slotPieceTextSize, fill: "#FFFFFF" });
            _this.addChild(_this.pieceText);
            //Anchor and position text in middle
            _this.pieceText.anchor = new Phaser.Point(0.5, 0.5);
            _this.pieceText.position = new Phaser.Point(0, 0);
            _this.startPosition = new Phaser.Point(_this.position.x, _this.position.y);
            //Enable drag
            _this.inputEnabled = true;
            _this.input.enableDrag(true);
            _this.inputField = inputField;
            _this.input.dragDistanceThreshold = 5;
            _this.events.onInputUp.add(_this.OnPieceClick, _this);
            _this.events.onDragStart.add(_this.OnDragStart, _this);
            _this.events.onDragUpdate.add(_this.OnDragUpdate, _this);
            _this.events.onDragStop.add(_this.OnDragEnd, _this);
            return _this;
        }
        SlotPiece.prototype.OnPieceClick = function () {
            if (!this.input.isDragged) {
                var slots = this.inputField.GetSlots();
                if (slots == undefined || slots == null)
                    return null;
                for (var i = 0; i < slots.length; i++) {
                    if (!slots[i].IsEmpty() && slots[i].GetCurrentPiece() == this) {
                        this.inputField.ResetSlot(this);
                        this.ReturnToStartPosition();
                        return null;
                    }
                }
                for (var i = 0; i < slots.length; i++) {
                    if (slots[i].IsEmpty()) {
                        slots[i].PlacePiece(this);
                        return null;
                    }
                }
            }
            return null;
        };
        SlotPiece.prototype.OnDragStart = function () {
            this.inputField.ResetSlot(this);
            return null;
        };
        SlotPiece.prototype.OnDragUpdate = function () {
            this.inputField.OnPieceDragging(this);
            return null;
        };
        SlotPiece.prototype.OnDragEnd = function () {
            if (this.inputField.TryFitPiece(this) == false) {
                this.ReturnToStartPosition();
            }
            return null;
        };
        SlotPiece.prototype.ReturnToStartPosition = function () {
            this.game.add.tween(this.position).to({ x: this.startPosition.x, y: this.startPosition.y }, 450, Phaser.Easing.Back.Out, true);
        };
        SlotPiece.prototype.GetPieceValue = function () {
            return this.pieceValue;
        };
        SlotPiece.prototype.Update = function () {
        };
        SlotPiece.prototype.CleanUp = function () {
            this.pieceText.destroy();
            this.pieceValue = undefined;
            this.pieceText = undefined;
            this.inputField = undefined;
            return null;
        };
        SlotPiece.prototype.GetQuickTapSlot = function () {
            return null;
        };
        return SlotPiece;
    }(FunctionGame.GameObject));
    FunctionGame.SlotPiece = SlotPiece;
    var LockedSlotPiece = (function (_super) {
        __extends(LockedSlotPiece, _super);
        function LockedSlotPiece(game, x, y, pieceValue, inputField, settings) {
            var _this = _super.call(this, game, x, y, pieceValue, inputField, settings) || this;
            _this.inputEnabled = false;
            _this.input.enableDrag(false);
            _this.events.onDragStart.removeAll(_this);
            _this.events.onDragUpdate.removeAll(_this);
            _this.events.onDragStop.removeAll(_this);
            return _this;
        }
        LockedSlotPiece.prototype.OnDragStart = function () {
            return null;
        };
        LockedSlotPiece.prototype.OnDragUpdate = function () {
            return null;
        };
        LockedSlotPiece.prototype.OnDragEnd = function () {
            return null;
        };
        return LockedSlotPiece;
    }(SlotPiece));
    FunctionGame.LockedSlotPiece = LockedSlotPiece;
})(FunctionGame || (FunctionGame = {}));
var FunctionGame;
(function (FunctionGame) {
    var BaseButton = (function (_super) {
        __extends(BaseButton, _super);
        function BaseButton(game, x, y, key) {
            var _this = _super.call(this, game, x, y, key, 0) || this;
            _this.interactable = true;
            _this.interactableResetTime = 150;
            _this.hoverOverTint = 0xd3d3d3;
            _this.hoverOutTint = 0xFFFFFF;
            _this.anchor = new Phaser.Point(0.5, 0.5);
            _this.inputEnabled = true;
            _this.events.onInputOver.add(_this.InputOver, _this);
            _this.events.onInputOut.add(_this.InputOut, _this);
            _this.events.onInputDown.add(_this.InputDown, _this);
            return _this;
        }
        BaseButton.prototype.InputOver = function () {
            this.tint = this.hoverOverTint;
        };
        BaseButton.prototype.InputOut = function () {
            this.tint = this.hoverOutTint;
        };
        BaseButton.prototype.InputDown = function () {
            if (this.interactable == true && this.visible == true) {
                this.SetUnInteractable();
                this.game.time.events.add(150, this.SetInteractable, this);
                this.OnButtonPress();
            }
        };
        BaseButton.prototype.Fade = function (fadeIn, instantTransition) {
            if (this.previousTween != null || this.previousTween != undefined) {
                this.previousTween.stop();
            }
            if (!instantTransition) {
                var startAlpha = (fadeIn == true) ? 0 : 1;
                var targetAlpha = (fadeIn == true) ? 1 : 0;
                this.alpha = startAlpha;
                this.currentTween = this.game.add.tween(this).to({ alpha: targetAlpha }, 350, Phaser.Easing.Linear.None);
                this.previousTween = this.currentTween;
                if (fadeIn) {
                    this.SetVisible();
                }
                else {
                    this.currentTween.onComplete.addOnce(this.SetInvisible, this);
                }
                this.currentTween.start();
            }
            else {
                if (fadeIn) {
                    this.SetVisible();
                    this.alpha = 1;
                }
                else {
                    this.SetInvisible();
                    this.alpha = 0;
                }
            }
        };
        BaseButton.prototype.SetVisible = function () {
            this.visible = true;
        };
        BaseButton.prototype.SetInvisible = function () {
            this.visible = false;
        };
        BaseButton.prototype.SetUnInteractable = function () {
            this.interactable = false;
        };
        BaseButton.prototype.SetInteractable = function () {
            this.interactable = true;
        };
        BaseButton.prototype.Update = function () {
        };
        return BaseButton;
    }(FunctionGame.GameObject));
    FunctionGame.BaseButton = BaseButton;
})(FunctionGame || (FunctionGame = {}));
var FunctionGame;
(function (FunctionGame) {
    var BackButton = (function (_super) {
        __extends(BackButton, _super);
        function BackButton(game, x, y, key) {
            return _super.call(this, game, x, y, key) || this;
        }
        BackButton.prototype.OnButtonPress = function () {
            this.game.time.events.removeAll();
            this.game.state.start("functionLevelSelect");
        };
        BackButton.prototype.Update = function () {
        };
        return BackButton;
    }(FunctionGame.BaseButton));
    FunctionGame.BackButton = BackButton;
})(FunctionGame || (FunctionGame = {}));
var FunctionGame;
(function (FunctionGame) {
    var BackButtonGameSelect = (function (_super) {
        __extends(BackButtonGameSelect, _super);
        function BackButtonGameSelect(game, x, y, key) {
            return _super.call(this, game, x, y, key) || this;
        }
        BackButtonGameSelect.prototype.OnButtonPress = function () {
            FunctionGame.LevelSelect.LevelSelectState.RunLoadingScreen = true;
            StartUp.InitMainMenu();
        };
        BackButtonGameSelect.prototype.Update = function () {
        };
        return BackButtonGameSelect;
    }(FunctionGame.BaseButton));
    FunctionGame.BackButtonGameSelect = BackButtonGameSelect;
})(FunctionGame || (FunctionGame = {}));
var FunctionGame;
(function (FunctionGame) {
    var ArrowButton = (function (_super) {
        __extends(ArrowButton, _super);
        function ArrowButton(game, x, y, pressCallback, context) {
            var _this = _super.call(this, game, x, y, "buttonArrowTest") || this;
            _this.onPress = new Phaser.Signal();
            _this.onPress.add(pressCallback, context);
            return _this;
        }
        ArrowButton.prototype.OnButtonPress = function () {
            this.onPress.dispatch();
        };
        return ArrowButton;
    }(FunctionGame.BaseButton));
    FunctionGame.ArrowButton = ArrowButton;
})(FunctionGame || (FunctionGame = {}));
var FunctionGame;
(function (FunctionGame) {
    var MuteButton = (function (_super) {
        __extends(MuteButton, _super);
        function MuteButton(game, x, y) {
            var _this = _super.call(this, game, x, y, "", 0) || this;
            _this.onSprite = _this.game.add.sprite(x, y, "speakerOn");
            _this.onSprite.anchor = new Phaser.Point(0.5, 0.5);
            _this.onSprite.inputEnabled = true;
            _this.onSprite.events.onInputOver.add(_this.InputOver, _this);
            _this.onSprite.events.onInputOut.add(_this.InputOut, _this);
            _this.onSprite.events.onInputDown.add(_this.InputDown, _this);
            _this.offSprite = _this.game.add.sprite(x, y, "speakerOff");
            _this.offSprite.anchor = new Phaser.Point(0.5, 0.5);
            _this.offSprite.inputEnabled = true;
            _this.offSprite.events.onInputOver.add(_this.InputOver, _this);
            _this.offSprite.events.onInputOut.add(_this.InputOut, _this);
            _this.offSprite.events.onInputDown.add(_this.InputDown, _this);
            _this.onSprite.visible = !FunctionGame.MusicHandler.IsMuted();
            _this.offSprite.visible = FunctionGame.MusicHandler.IsMuted();
            return _this;
        }
        MuteButton.prototype.InputOver = function () {
            this.tint = 0xd3d3d3;
        };
        MuteButton.prototype.InputOut = function () {
            this.tint = 0xFFFFFF;
        };
        MuteButton.prototype.InputDown = function () {
            FunctionGame.MusicHandler.ToggleMute(!FunctionGame.MusicHandler.IsMuted());
            this.UpdateButtonSprite();
        };
        MuteButton.prototype.UpdateButtonSprite = function () {
            this.onSprite.visible = !FunctionGame.MusicHandler.IsMuted();
            this.offSprite.visible = FunctionGame.MusicHandler.IsMuted();
        };
        MuteButton.prototype.Update = function () {
        };
        return MuteButton;
    }(FunctionGame.GameObject));
    FunctionGame.MuteButton = MuteButton;
})(FunctionGame || (FunctionGame = {}));
var FunctionGame;
(function (FunctionGame) {
    var ObjectFactory = (function () {
        function ObjectFactory() {
        }
        ObjectFactory.CreateGrid = function (game, x, y, spriteWidth, spriteHeight, gridWidth, gridHeight, cellWidth, cellHeight, customPoints) {
            var tempGrid = new FunctionGame.Grid(game);
            tempGrid.CreateGrid(x, y, spriteWidth, spriteHeight, gridWidth, gridHeight, cellWidth, cellHeight);
            tempGrid.CreateGraphicsObject();
            for (var i = 0; i < customPoints.length; i++) {
                tempGrid.AddPointByGridPosition(customPoints[i].x, customPoints[i].y);
            }
            return tempGrid;
        };
        ObjectFactory.CreateInputField = function (game, x, y, grid, allPiecesSetCallback, allPiecesSetCallbackListenerContext, levelInfo, settings) {
            var tempInputField = new FunctionGame.InputField(game, x, y, grid, settings, allPiecesSetCallback, allPiecesSetCallbackListenerContext);
            tempInputField.CreateText();
            tempInputField.CreateSlots(levelInfo);
            tempInputField.CreateLockedSlotPieces(levelInfo);
            tempInputField.CreateSlotPieces(levelInfo);
            return tempInputField;
        };
        ObjectFactory.CreateSlot = function (game, x, y, fontName, fontSize, slotSpriteScale, innerText, inputField) {
            var tempSlot = new FunctionGame.Slot(game, x, y, fontName, fontSize, slotSpriteScale, innerText, inputField);
            return tempSlot;
        };
        ObjectFactory.CreateSlotPiece = function (game, x, y, pieceValue, inputField, settings) {
            var tempPiece = new FunctionGame.SlotPiece(game, x, y, pieceValue, inputField, settings);
            return tempPiece;
        };
        ObjectFactory.CreateLockedSlotPiece = function (game, x, y, pieceValue, inputField, settings) {
            var tempLockedPiece = new FunctionGame.LockedSlotPiece(game, x, y, pieceValue, inputField, settings);
            return tempLockedPiece;
        };
        ObjectFactory.CreateBackButton = function (game, x, y) {
            var tempBackButton = new FunctionGame.BackButton(game, x, y, "backButton");
            return tempBackButton;
        };
        ObjectFactory.CreateBackButtonGameSelect = function (game, x, y) {
            var tempBackButton = new FunctionGame.BackButtonGameSelect(game, x, y, "backButton");
            return tempBackButton;
        };
        ObjectFactory.CreateMuteButton = function (game, x, y) {
            var tempBackButton = new FunctionGame.MuteButton(game, x, y);
            return tempBackButton;
        };
        ObjectFactory.CreateArrowButton = function (game, x, y, pressCallback, context) {
            var tempArrowButton = new FunctionGame.ArrowButton(game, x, y, pressCallback, context);
            return tempArrowButton;
        };
        return ObjectFactory;
    }());
    FunctionGame.ObjectFactory = ObjectFactory;
})(FunctionGame || (FunctionGame = {}));
var FunctionGame;
(function (FunctionGame) {
    var Level = (function (_super) {
        __extends(Level, _super);
        function Level() {
            var _this = _super.call(this) || this;
            //Animation variables
            _this.backgroundFromButtom = [];
            _this.backgroundFromTop = [];
            _this.backgroundFromRight = [];
            _this.backgroundFromLeft = [];
            _this.uiCounter = 0;
            _this.animationCounter = 0;
            return _this;
        }
        Level.prototype.preload = function () {
            this.LoadLevelIndex();
            this.LoadLevelInfo();
        };
        Level.prototype.create = function () {
            this.BuildLevel();
            if (!FunctionGame.MusicHandler.IsMusicPlaying()) {
                this.PrepareBackgroundMusic();
            }
            FunctionGame.ObjectFactory.CreateMuteButton(this.game, this.game.width - 50, this.game.height - 50);
            if (!FunctionGame.MusicHandler.IsMusicPlaying()) {
                this.StartBackgroundMusic();
            }
        };
        Level.prototype.LoadLevelIndex = function () {
            this.levelIndex = FunctionGame.LevelHandler.GetCurrentLevelIndex();
        };
        Level.prototype.LoadLevelInfo = function () {
            this.levelInfo = FunctionGame.LevelHandler.GetLevelInfo(this.levelIndex);
        };
        Level.prototype.PrepareBackgroundMusic = function () {
            var audioToPlay = (FunctionGame.LevelHandler.GetLevelInfoCollection().globalSettings.audio == "default") ? "mana" : FunctionGame.LevelHandler.GetLevelInfoCollection().globalSettings.audio;
            if (audioToPlay == "none")
                return;
            FunctionGame.MusicHandler.AddMusic(audioToPlay, 0.25, true);
        };
        Level.prototype.StartBackgroundMusic = function () {
            FunctionGame.MusicHandler.PlayMusic();
        };
        Level.prototype.BuildLevel = function () {
            this.BuildBackground();
            this.grid = FunctionGame.ObjectFactory.CreateGrid(this.game, this.game.width * 0.5 + 200, this.game.height * 0.5, 400, 400, 10, 10, 35, 35, this.levelInfo.points);
            this.inputField = FunctionGame.ObjectFactory.CreateInputField(this.game, 75, 100, this.grid, this.EvaluateLevel, this, this.levelInfo, FunctionGame.LevelHandler.GetLevelInfoCollection().globalSettings);
            FunctionGame.ObjectFactory.CreateBackButton(this.game, 50, this.game.height - 50);
            var lvlsInARow = FunctionGame.LevelTracker.GetLevelsCompletedInARow();
            this.inputField.SetAlphaZero(this);
            this.grid.SetAlphaZero(this);
            if (lvlsInARow === 0) {
                this.BuildLevelAnimation(this.backgroundFromButtom, undefined, this.backgroundFromLeft, this.backgroundFromRight);
            }
            else {
                this.inputField.FadeIn(this);
                this.grid.FadeIn(this);
            }
        };
        Level.prototype.BuildBackground = function () {
            this.background = this.game.add.group();
            this.ropeAndMan = this.game.add.group();
            this.mountainBackground = this.game.add.group();
            var bg1 = this.game.add.sprite(this.game.width * 0.5, this.game.height * 0.5, "bg1");
            bg1.scale = new Phaser.Point(0.5, 0.5);
            bg1.anchor = new Phaser.Point(0.5, 0.5);
            bg1.tint = 0xdddddd;
            var bg2 = this.game.add.sprite(this.game.width * 0.5, this.game.height * 0.5, "bg2");
            bg2.scale = new Phaser.Point(0.5, 0.5);
            bg2.anchor = new Phaser.Point(0.5, 0.5);
            bg2.tint = 0xdddddd;
            var bg3 = this.game.add.sprite(this.game.width * 0.5, this.game.height * 0.5, "bg3");
            bg3.scale = new Phaser.Point(0.5, 0.5);
            bg3.anchor = new Phaser.Point(0.5, 0.5);
            bg3.tint = 0xdddddd;
            var bg4 = this.game.add.sprite(this.game.width * 0.5, this.game.height * 0.5, "bg4");
            bg4.scale = new Phaser.Point(0.5, 0.5);
            bg4.anchor = new Phaser.Point(0.5, 0.5);
            bg4.tint = 0xdddddd;
            var bg5 = this.game.add.sprite(this.game.width * 0.5, this.game.height * 0.5, "bg5");
            bg5.scale = new Phaser.Point(0.5, 0.5);
            bg5.anchor = new Phaser.Point(0.5, 0.5);
            var bg6 = this.game.add.sprite(220, this.game.height * 0.5, "bg6");
            bg6.scale = new Phaser.Point(0.5, 0.5);
            bg6.anchor = new Phaser.Point(0.5, 0.5);
            var bg7 = this.game.add.sprite(this.game.width - 15, this.game.height * 0.5, "bg7");
            bg7.scale = new Phaser.Point(0.5, 0.5);
            bg7.anchor = new Phaser.Point(0.5, 0.5);
            bg7.angle = -8;
            var mist = this.game.add.sprite(this.game.width * 0.5, this.game.height - 171, "Mist");
            mist.scale = new Phaser.Point(0.5, 0.5);
            mist.anchor = new Phaser.Point(0.5, 0.5);
            mist.alpha = 0.6;
            this.BirdParticle();
            this.background.add(bg1);
            this.background.add(bg2);
            this.background.add(bg3);
            this.background.add(bg4);
            this.background.add(mist);
            this.background.add(bg5);
            this.background.add(this.birdParticle);
            this.mountainBackground.add(bg6);
            this.mountainBackground.add(bg7);
            this.backgroundFromButtom = [bg5, bg4, bg3, bg2];
            this.backgroundFromRight = [bg7];
            this.backgroundFromLeft = [bg6];
        };
        Level.prototype.BuildLevelAnimation = function (fromButtom, fromTop, fromLeft, fromRight) {
            var delay = 500;
            var delayFactor = 0.5;
            var sideDelay = 1000;
            if (fromButtom) {
                fromButtom.forEach(function (sprite) {
                    var oldPos = sprite.position.y;
                    sprite.position.set(sprite.position.x, sprite.position.y + sprite.height);
                    var spriteTween = sprite.game.add.tween(sprite).
                        to({ y: oldPos }, 1000, Phaser.Easing.Circular.Out, true, delay);
                    delay += 400 * delayFactor;
                });
            }
            if (fromTop) {
                fromTop.forEach(function (sprite) {
                });
            }
            if (fromLeft) {
                fromLeft.forEach(function (sprite) {
                    var oldPos = sprite.position.x;
                    sprite.position.set(sprite.position.x - sprite.width, sprite.position.y);
                    var spriteTween = sprite.game.add.tween(sprite).
                        to({ x: oldPos }, 750, Phaser.Easing.Circular.Out, true, sideDelay);
                });
            }
            if (fromRight) {
                fromRight.forEach(function (sprite) {
                    var oldPos = sprite.position.x;
                    sprite.position.set(sprite.position.x + sprite.width, sprite.position.y);
                    var spriteTween = sprite.game.add.tween(sprite).
                        to({ x: oldPos }, 750, Phaser.Easing.Circular.Out, true, sideDelay);
                });
            }
            this.game.time.events.add(1000, this.BuildAnimationDelayedUI.bind(this, this));
        };
        Level.prototype.BuildAnimationDelayedUI = function (level) {
            this.inputField.FadeIn(this);
            this.grid.FadeIn(this);
        };
        Level.prototype.BirdParticle = function () {
            this.birdParticle = this.game.add.emitter(this.game.width, 0, 6);
            this.birdParticle.minParticleSpeed.setTo(-200, 100);
            this.birdParticle.maxParticleSpeed.setTo(-300, 150);
            this.birdParticle.minParticleScale = 0.1;
            this.birdParticle.maxParticleScale = 0.2;
            this.birdParticle.width = 200;
            //this.birdParticle.particleDrag.set(50, 50);
            this.birdParticle.maxRotation = -10;
            this.birdParticle.minRotation = 10;
            //this.birdParticle.angularDrag = 20;
            this.birdParticle.gravity.setTo(-100);
            this.birdParticle.makeParticles(["bird1", "bird2", "bird3"]);
            this.birdParticle.flow(4000, 4000, 1, -1, false);
        };
        Level.prototype.EvaluateLevel = function () {
            var aValue = this.inputField.GetAValue();
            var bValue = this.inputField.GetBValue();
            this.grid.DrawFunction(aValue, bValue);
            if (aValue == this.levelInfo.aValue && bValue == this.levelInfo.bValue) {
                this.time.events.add(1500, this.OnLevelWon, this);
            }
            return null;
        };
        Level.prototype.OnLevelWon = function () {
            FunctionGame.SaveHandler.SaveLevel(FunctionGame.LevelHandler.GetCurrentLevelIndex(), true);
            FunctionGame.LevelTracker.IncrementCompletedLevels();
            this.HideUI();
        };
        Level.prototype.HideUI = function () {
            this.inputField.FadeAway(this);
            this.grid.FadeAway(this);
        };
        Level.prototype.UICount = function () {
            this.uiCounter++;
            if (this.uiCounter < 2)
                return;
            this.uiCounter = 0;
            this.WinAnimation();
        };
        Level.prototype.WinAnimation = function () {
            var scale = 750;
            var inputLine = this.grid.GetLine();
            var linePointsScaled = new Array();
            linePointsScaled.push((inputLine.midPoint().subtract(inputLine.start.x, inputLine.start.y)).normalize().multiply(scale, scale)); //start point normalized direction outward
            linePointsScaled.push((inputLine.midPoint().subtract(inputLine.end.x, inputLine.end.y)).normalize().multiply(scale, scale)); //end point normalized direction outward
            var testLine = new Phaser.Line(inputLine.midPoint().x + linePointsScaled[0].x, inputLine.midPoint().y + linePointsScaled[0].y, inputLine.midPoint().x + linePointsScaled[1].x, inputLine.midPoint().y + linePointsScaled[1].y);
            var highestPoint = null;
            var lowestPoint = null;
            var manRotationMod = 0;
            var ropeManOffset = this.GetRopeManOffset(this.inputField.GetAValue());
            if (testLine.start.y > testLine.end.y) {
                highestPoint = new Phaser.Point(testLine.end.x, testLine.end.y);
                lowestPoint = new Phaser.Point(testLine.start.x, testLine.start.y);
                manRotationMod = 1;
            }
            else {
                highestPoint = new Phaser.Point(testLine.start.x, testLine.start.y);
                lowestPoint = new Phaser.Point(testLine.end.x, testLine.end.y);
                ropeManOffset.x *= -1;
                manRotationMod = -1;
            }
            var rope = this.game.add.tileSprite(testLine.midPoint().x, testLine.midPoint().y, 89, 16, "rope");
            rope.anchor = new Phaser.Point(0.5, 0.5);
            rope.position = highestPoint;
            rope.angle = Phaser.Math.radToDeg(testLine.angle);
            var man = this.game.add.sprite(highestPoint.x + ropeManOffset.x, highestPoint.y + ropeManOffset.y, "swingMan");
            man.anchor = new Phaser.Point(0.5, 0.5);
            man.angle = Phaser.Math.radToDeg(testLine.angle);
            man.scale.x *= manRotationMod;
            man.pivot = new Phaser.Point(0.285, 0.715);
            var manRotationValue = 10;
            man.angle += manRotationValue;
            var manRotationValueTweenTarget = man.angle - (manRotationValue * 2);
            var manAnimation = man.animations.add("swingManAnim", undefined, 6, true);
            var manRotationTween = this.game.add.tween(man).to({ angle: manRotationValueTweenTarget }, 1000, Phaser.Easing.Linear.None);
            this.ropeAndMan.add(rope);
            this.ropeAndMan.add(man);
            this.ropeTween = this.game.add.tween(rope).to({ width: 2670 }, 1500, Phaser.Easing.Back.Out);
            this.manTween = this.game.add.tween(man.position).to({ x: lowestPoint.x + ropeManOffset.x, y: lowestPoint.y + ropeManOffset.y }, 3000, Phaser.Easing.Linear.None);
            var ropeFadeTween = this.game.add.tween(rope).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None);
            ropeFadeTween.onComplete.addOnce(this.LevelLoader);
            this.ropeTween.chain(this.manTween);
            this.manTween.chain(ropeFadeTween);
            this.ropeTween.start();
            manRotationTween.loop(true);
            manRotationTween.yoyo(true, 0);
            manRotationTween.start();
            manAnimation.play();
        };
        Level.prototype.GetRopeManOffset = function (aValue) {
            var index = 6;
            switch (aValue) {
                case 0:
                    index = 0;
                    break;
                case 0.5:
                    index = 1;
                    break;
                case 1:
                    index = 2;
                    break;
                case 1.5:
                    index = 3;
                    break;
                case 2:
                    index = 4;
                    break;
                case 2.5:
                    index = 5;
                    break;
                default:
                    index = 6;
                    break;
            }
            return new Phaser.Point(FunctionGame.LevelHandler.GetLevelInfoCollection().globalSettings.ropeManOffset[index].x, FunctionGame.LevelHandler.GetLevelInfoCollection().globalSettings.ropeManOffset[index].y);
        };
        Level.prototype.LevelLoader = function () {
            if (FunctionGame.LevelTracker.FiveLevelsCompleted() == true || (FunctionGame.LevelTracker.GetCurrentLevelIndex() + 1) % 5 == 0) {
                StartUp.mainGame.state.start("functionLevelSelect");
                return;
            }
            var currentLvlIndex = FunctionGame.LevelHandler.GetCurrentLevelIndex();
            if ((currentLvlIndex + 1) < FunctionGame.LevelHandler.GetLevelInfoCollection().levels.length) {
                var nextLvl = FunctionGame.LevelHandler.GetCurrentLevelIndex() + 1;
                FunctionGame.LevelTracker.SetCurrentLevelIndex(nextLvl);
                FunctionGame.LevelHandler.LoadLevel(nextLvl);
            }
            else {
                console.log("Max level reached!");
            }
        };
        Level.prototype.shutdown = function () {
            this.inputField.CleanUp();
            this.grid.CleanUp();
            this.background.destroy(true);
            this.mountainBackground.destroy(true);
            this.ropeAndMan.destroy(true);
            this.inputField = undefined;
            this.grid = undefined;
            this.levelIndex = undefined;
            this.levelInfo = undefined;
        };
        return Level;
    }(Phaser.State));
    FunctionGame.Level = Level;
})(FunctionGame || (FunctionGame = {}));
var FunctionGame;
(function (FunctionGame) {
    var PreGameLoadState = (function (_super) {
        __extends(PreGameLoadState, _super);
        function PreGameLoadState() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PreGameLoadState.prototype.preload = function () {
            FunctionGame.LevelHandler.SetGame(this.game);
            FunctionGame.SaveHandler.SetSaveDataItemPrefix("Function");
            FunctionGame.MusicHandler.SetGameReference(this.game);
            FunctionGame.LevelHandler.LoadJSONFromFile();
            FunctionGame.AssetHandler.LoadJSONFromFile(this.game);
        };
        PreGameLoadState.prototype.create = function () {
            this.LoadAssets();
            LoadingScreen.CreateRandomLoadingScreen(this.game);
        };
        PreGameLoadState.prototype.LoadAssets = function () {
            FunctionGame.LevelHandler.SetLevelInfoFromCache();
            FunctionGame.AssetHandler.ParseGameAssetsFromJSON(this.game);
            this.game.load.onLoadComplete.addOnce(this.LoadAssetComplete, this);
            FunctionGame.AssetHandler.LoadAssetsIntoGame(this.game);
            this.game.load.start();
        };
        //Load Asset Complete
        PreGameLoadState.prototype.LoadAssetComplete = function () {
            if (!FunctionGame.SaveHandler.HasSaveData()) {
                FunctionGame.SaveHandler.CreateNewSaveData(FunctionGame.LevelHandler.GetLevelInfoCollection().levels.length);
            }
            if (window.DebugLevelSkip != undefined) {
                if (window.DebugLevelSkip.skipLevel == true) {
                    FunctionGame.LevelHandler.LoadLevel(window.DebugLevelSkip.levelIndex);
                    return;
                }
            }
            this.game.state.start("functionLevelSelect");
        };
        return PreGameLoadState;
    }(Phaser.State));
    FunctionGame.PreGameLoadState = PreGameLoadState;
})(FunctionGame || (FunctionGame = {}));
var FunctionGame;
(function (FunctionGame) {
    var LevelSelect;
    (function (LevelSelect) {
        var LevelSelectButton = (function (_super) {
            __extends(LevelSelectButton, _super);
            function LevelSelectButton(game, x, y, width, height, key, lvlIndex, tileIndex) {
                var _this = _super.call(this, game, x, y, width, height, key) || this;
                _this.index = lvlIndex;
                _this.inputEnabled = true;
                _this.events.onInputDown.add(_this.OnButtonPress, _this);
                _this.events.onInputOver.add(_this.OnButtonHover, _this);
                _this.events.onInputOut.add(_this.OnButtonHoverEnd, _this);
                _this.tilePosition = new Phaser.Point(-width * tileIndex, 0);
                _this.btnText = _this.game.add.text(_this.width * 0.5, _this.height * 0.5, (_this.index + 1).toString(), {
                    font: "32px Amaranth",
                    fill: "#FFFFFF",
                    wordWrap: true,
                    wordWrapWidth: _this.width,
                    align: "center",
                });
                _this.btnText.anchor.set(0.5);
                _this.addChild(_this.btnText);
                return _this;
            }
            LevelSelectButton.prototype.OnButtonPress = function () {
                FunctionGame.LevelTracker.SetCurrentLevelIndex(this.index);
                //Do something level related here
                FunctionGame.LevelHandler.LoadLevel(this.index);
                return null;
            };
            LevelSelectButton.prototype.OnButtonHover = function () {
                this.tint = 0xD1D1D1;
                return null;
            };
            LevelSelectButton.prototype.OnButtonHoverEnd = function () {
                this.tint = 0xFFFFFF;
                return null;
            };
            return LevelSelectButton;
        }(Phaser.TileSprite));
        LevelSelect.LevelSelectButton = LevelSelectButton;
    })(LevelSelect = FunctionGame.LevelSelect || (FunctionGame.LevelSelect = {}));
})(FunctionGame || (FunctionGame = {}));
///<reference path="../../../../tsDefinitions/phaser.d.ts" /> 
var FunctionGame;
(function (FunctionGame) {
    var LevelSelect;
    (function (LevelSelect) {
        var LevelSelectState = (function (_super) {
            __extends(LevelSelectState, _super);
            function LevelSelectState() {
                var _this = _super.call(this) || this;
                _this.tweenDuration = 500;
                _this.currentSnippet = 0;
                return _this;
            }
            LevelSelectState.prototype.create = function () {
                if (FunctionGame.MusicHandler.IsMusicPlaying()) {
                    FunctionGame.MusicHandler.StopMusic();
                }
                this.levelSelectBackground = this.game.add.sprite(0, 0, "levelSelectBackground");
                this.amountOfLevels = FunctionGame.LevelHandler.GetLevelInfoCollection().levels.length;
                this.currentBars = new Array();
                this.bars = this.CreateButtonBars(5, 80, 80, 0);
                this.CreateArrowButtons();
                this.maxLevelPage = Math.floor(this.bars.length / 2) + ((this.bars.length % 2 > 0) ? 1 : 0);
                if ((LevelTracker.GetCurrentLevelIndex() + 1) % 10 == 0 && !LevelTracker.FiveLevelsCompleted()) {
                    if (LevelTracker.GetCurrentLevelIndex() >= FunctionGame.LevelHandler.GetLevelInfoCollection().levels.length - 1) {
                        this.SetLevelPage(LevelTracker.GetCurrentLevelPage(), true, true);
                    }
                    else {
                        this.SetLevelPage((LevelTracker.GetCurrentLevelPage() + 1), true, true);
                    }
                    LevelTracker.ResetLevelsCompleted();
                }
                else if (LevelTracker.FiveLevelsCompleted() == true) {
                    this.SetLevelPage(LevelTracker.GetCurrentLevelPage(), true, true);
                    LevelTracker.ResetLevelsCompleted();
                }
                else {
                    this.SetLevelPage(LevelTracker.GetCurrentLevelPage(), true, true);
                }
                this.UpdateArrowButtons(false);
                FunctionGame.ObjectFactory.CreateBackButtonGameSelect(this.game, 50, this.game.height - 50);
            };
            LevelSelectState.prototype.CreateButtonBars = function (buttonsPerBar, buttonWidth, buttonHeight, buttonRightMargin) {
                this.fullBarWidth = buttonsPerBar * (buttonWidth + buttonRightMargin) - buttonRightMargin;
                //Figure out how many bars we need
                var amountOfBarsNeeded = Math.floor(this.amountOfLevels / 5) + ((this.amountOfLevels % 5 > 0) ? 1 : 0);
                //Create the bars array
                var tempBars = new Array();
                //Populate the empty bars array
                for (var i = 0; i < amountOfBarsNeeded; i++) {
                    tempBars[i] = this.game.add.group();
                }
                //Populate the groups in the bar array with button children
                var btnIndex = 0;
                var lvlSelectButton = null;
                for (var i = 0; i < amountOfBarsNeeded; i++) {
                    for (var k = 0; k < 5; k++) {
                        if (btnIndex < this.amountOfLevels) {
                            lvlSelectButton = null;
                            if (FunctionGame.SaveHandler.GetLevelData()[btnIndex].completed) {
                                lvlSelectButton = new LevelSelect.LevelSelectButton(this.game, 0, 0, buttonWidth, buttonHeight, this.GetButtonSnippetKey(false), btnIndex, k);
                            }
                            else {
                                lvlSelectButton = new LevelSelect.LevelSelectButton(this.game, 0, 0, buttonWidth, buttonHeight, this.GetButtonSnippetKey(true), btnIndex, k);
                            }
                            tempBars[i].add(lvlSelectButton);
                            btnIndex++;
                        }
                    }
                    tempBars[i].align(5, 1, buttonWidth + buttonRightMargin, buttonHeight);
                    this.AdvanceSnippet();
                }
                //Move the groups of bounds
                for (var i = 0; i < tempBars.length; i++) {
                    tempBars[i].position = new Phaser.Point(this.game.width, this.game.height * 0.5);
                }
                return tempBars;
            };
            LevelSelectState.prototype.CreateArrowButtons = function () {
                var arrowButtonScreenMargin = 20;
                var arrowButtonWidth = 80;
                var arrowButtonHeight = 80;
                this.arrowButtonLeft = FunctionGame.ObjectFactory.CreateArrowButton(this.game, arrowButtonWidth + arrowButtonScreenMargin, this.game.height * 0.5, this.DecrementPage, this);
                this.arrowButtonLeft.anchor = new Phaser.Point(0.5, 0.5);
                this.arrowButtonLeft.angle = 180;
                this.arrowButtonRight = FunctionGame.ObjectFactory.CreateArrowButton(this.game, this.game.width - arrowButtonWidth - arrowButtonScreenMargin, this.game.height * 0.5, this.IncrementPage, this);
                this.arrowButtonRight.anchor = new Phaser.Point(0.5, 0.5);
            };
            LevelSelectState.prototype.UpdateArrowButtons = function (changingPage) {
                if (this.levelPage <= 0) {
                    this.arrowButtonLeft.Fade(false, !changingPage);
                }
                else {
                    if (this.arrowButtonLeft.visible == false) {
                        this.arrowButtonLeft.Fade(true, !changingPage);
                    }
                }
                if (this.IsAtTheEndOfLevelPage()) {
                    this.arrowButtonRight.Fade(false, !changingPage);
                }
                else {
                    if (this.arrowButtonRight.visible == false) {
                        this.arrowButtonRight.Fade(true, !changingPage);
                    }
                }
            };
            LevelSelectState.prototype.GetButtonSnippetKey = function (grey) {
                if (!grey) {
                    return "snippet" + this.currentSnippet;
                }
                return "snippetGrey" + this.currentSnippet;
            };
            LevelSelectState.prototype.AdvanceSnippet = function () {
                this.currentSnippet++;
                if (this.currentSnippet >= 4) {
                    this.currentSnippet = 0;
                }
            };
            LevelSelectState.prototype.IncrementPage = function () {
                if (this.HasMoreThanOneLevelPage() && this.IsNotAtTheEndOfLevelPage()) {
                    this.SetLevelPage((this.levelPage + 1), true);
                }
            };
            LevelSelectState.prototype.DecrementPage = function () {
                if (this.levelPage > 0) {
                    this.SetLevelPage((this.levelPage - 1), false);
                }
            };
            LevelSelectState.prototype.SetLevelPage = function (index, incrementing, firstTime) {
                this.levelPage = index;
                LevelTracker.SetCurrentLevelPage(this.levelPage);
                if (firstTime == undefined) {
                    this.UpdateArrowButtons(true);
                    this.ExitTweenBars(incrementing);
                }
                this.EntryTweenBars(incrementing);
            };
            LevelSelectState.prototype.EntryTweenBars = function (incrementing) {
                //Reset current bars array
                this.currentBars = [];
                //If we're not at the start page, we need to add 1 to levelpage to get the correct set of pages.
                var topPageIndex = (this.levelPage > 0) ? 2 * this.levelPage : this.levelPage;
                var durationOfTween = this.tweenDuration;
                //Set top tween position
                var tweenPointTop = this.GetUpperGroupPosition(80, 80);
                //Position the bar depending on whether the page is incrementing or decrementing
                this.bars[topPageIndex].position = new Phaser.Point((incrementing == true) ? this.game.width : -this.fullBarWidth, tweenPointTop.y);
                //Add a tween from the current position to the tween top point position
                this.game.add.tween(this.bars[topPageIndex].position).to(tweenPointTop, durationOfTween, Phaser.Easing.Back.In).start();
                //Add the bar to the array of currently displayed bars
                this.currentBars.push(this.bars[topPageIndex]);
                //Is there another bar after the top bar?
                if (topPageIndex + 1 < this.bars.length) {
                    //Increment because we need the second row of bars
                    topPageIndex += 1;
                    //Set bottom tween position
                    var tweenPointBottom = this.GetLowerGroupPosition(80, 80);
                    //Position the bar depending on whether the page is incrementing or decrementing
                    this.bars[topPageIndex].position = new Phaser.Point((incrementing == true) ? this.game.width : -this.fullBarWidth, tweenPointBottom.y);
                    //Add a tween from the current position to the tween bottom point position
                    this.game.add.tween(this.bars[topPageIndex].position).to(tweenPointBottom, durationOfTween, Phaser.Easing.Back.In).start();
                    //Add the bar to the array of currently displayed bars
                    this.currentBars.push(this.bars[topPageIndex]);
                }
            };
            LevelSelectState.prototype.ExitTweenBars = function (incrementing) {
                //Set exit top point
                var tweenExitTop = this.GetUpperGroupPosition(80, 80);
                //Modify the x coordinate of exit top point depending on whether the page is incrementing or decrementing
                tweenExitTop.x = (incrementing == true) ? -this.fullBarWidth : this.game.width;
                //Add a tween from the current position (middle of screen) to the exit top point
                this.game.add.tween(this.currentBars[0].position).to(tweenExitTop, 450, Phaser.Easing.Back.In).start();
                //Is there another bar after the top bar?
                if (this.currentBars[1] != undefined) {
                    //Set exit bottom point
                    var tweenExitBottom = this.GetLowerGroupPosition(80, 80);
                    //Modify the x coordinate of exit bottom point depending on whether the page is incrementing or decrementing
                    tweenExitBottom.x = (incrementing == true) ? -this.fullBarWidth : this.game.width;
                    //Add a tween from the current position (middle of screen) to the exit bottom point
                    this.game.add.tween(this.currentBars[1].position).to(tweenExitBottom, 500, Phaser.Easing.Back.In).start();
                }
            };
            LevelSelectState.prototype.GetUpperGroupPosition = function (buttonWidth, buttonHeight) {
                return new Phaser.Point((this.game.width * 0.5) - (this.fullBarWidth * 0.5), 150);
            };
            LevelSelectState.prototype.GetLowerGroupPosition = function (buttonWidth, buttonHeight) {
                return new Phaser.Point((this.game.width * 0.5) - (this.fullBarWidth * 0.5), this.game.height - 150 - buttonHeight);
            };
            LevelSelectState.prototype.MaxPagesIsUnevenNumber = function () {
                return (this.maxLevelPage % 2 > 0) ? true : false;
            };
            LevelSelectState.prototype.IsAtTheEndOfLevelPage = function () {
                return (this.levelPage == this.maxLevelPage - 1);
            };
            LevelSelectState.prototype.HasMoreThanOneLevelPage = function () {
                return this.maxLevelPage != 1;
            };
            LevelSelectState.prototype.IsNotAtTheEndOfLevelPage = function () {
                return this.levelPage < this.maxLevelPage - 1;
            };
            LevelSelectState.prototype.shutdown = function () {
                this.currentSnippet = 0;
            };
            return LevelSelectState;
        }(Phaser.State));
        LevelSelect.LevelSelectState = LevelSelectState;
    })(LevelSelect = FunctionGame.LevelSelect || (FunctionGame.LevelSelect = {}));
    var LevelTracker = (function () {
        function LevelTracker() {
        }
        LevelTracker.IncrementCompletedLevels = function () {
            this.levelsCompletedInARow++;
        };
        LevelTracker.GetLevelsCompletedInARow = function () {
            return this.levelsCompletedInARow;
        };
        LevelTracker.FiveLevelsCompleted = function () {
            return this.levelsCompletedInARow >= 5;
        };
        LevelTracker.ResetLevelsCompleted = function () {
            this.levelsCompletedInARow = 0;
        };
        LevelTracker.SetCurrentLevelPage = function (index) {
            this.lastLevelPage = index;
        };
        LevelTracker.GetCurrentLevelPage = function () {
            return this.lastLevelPage;
        };
        LevelTracker.SetCurrentLevelIndex = function (index) {
            this.lastLevelIndex = index;
        };
        LevelTracker.GetCurrentLevelIndex = function () {
            return this.lastLevelIndex;
        };
        return LevelTracker;
    }());
    LevelTracker.levelsCompletedInARow = 0;
    LevelTracker.lastLevelPage = 0;
    LevelTracker.lastLevelIndex = 0;
    FunctionGame.LevelTracker = LevelTracker;
})(FunctionGame || (FunctionGame = {}));
var PercentageGame;
(function (PercentageGame) {
    var GameObject = (function (_super) {
        __extends(GameObject, _super);
        function GameObject(game, x, y, key, frame) {
            var _this = _super.call(this, game, x, y, key, frame) || this;
            _this.events.onDestroy.add(_this.CleanUp, _this);
            game.add.existing(_this);
            return _this;
        }
        GameObject.prototype.update = function () {
            if (!this.alive)
                return;
            this.Update();
        };
        GameObject.prototype.CleanUp = function (objDestroyed) {
            return null;
        };
        return GameObject;
    }(Phaser.Sprite));
    PercentageGame.GameObject = GameObject;
})(PercentageGame || (PercentageGame = {}));
var PercentageGame;
(function (PercentageGame) {
    var BlobObject = (function (_super) {
        __extends(BlobObject, _super);
        function BlobObject(game, x, y, key, frame, killCollider) {
            return _super.call(this, game, x, y, key, frame) || this;
        }
        BlobObject.prototype.SetCircle = function (radius) {
            this.circleBody = this.body.setCircle(radius, 0, 5);
        };
        BlobObject.prototype.GetPhaserCircle = function () {
            return new Phaser.Circle(this.x, this.y, this.circleBody.radius * 2);
        };
        BlobObject.prototype.GetP2Circle = function () {
            return this.circleBody;
        };
        BlobObject.prototype.ApplyPhysicsSettings = function () {
            this.SetCircle(16);
            this.GetBody().onBeginContact.add(this.OnBeginContact, this);
        };
        BlobObject.prototype.SetPhysicsMaterial = function () {
            this.physicsMaterial = this.game.physics.p2.createMaterial("blobMaterial", this.body);
        };
        BlobObject.prototype.GetPhysicsMaterial = function () {
            return this.physicsMaterial;
        };
        BlobObject.prototype.SetKillCollider = function (killCollider) {
            this.killCollider = killCollider;
        };
        BlobObject.prototype.OnBeginContact = function (otherBody, myBody, myShape, otherShape, equation) {
            if (otherShape == this.killCollider.GetShape()) {
                this.kill();
            }
        };
        BlobObject.prototype.Update = function () {
        };
        BlobObject.prototype.CleanUp = function () {
            this.game.physics.p2.removeBody(this.body);
            this.circleBody = undefined;
            this.physicsMaterial = undefined;
            return null;
        };
        BlobObject.prototype.GetBody = function () {
            return this.body;
        };
        return BlobObject;
    }(PercentageGame.GameObject));
    PercentageGame.BlobObject = BlobObject;
    var SmallerBlob = (function (_super) {
        __extends(SmallerBlob, _super);
        function SmallerBlob(game, x, y, key, frame, killCollider) {
            return _super.call(this, game, x, y, key, frame, killCollider) || this;
        }
        SmallerBlob.prototype.ApplyPhysicsSettings = function () {
            this.SetCircle(8);
        };
        SmallerBlob.prototype.PreUpdate = function () {
        };
        SmallerBlob.prototype.Update = function () {
        };
        SmallerBlob.prototype.PostUpdate = function () {
        };
        return SmallerBlob;
    }(BlobObject));
    PercentageGame.SmallerBlob = SmallerBlob;
})(PercentageGame || (PercentageGame = {}));
var PercentageGame;
(function (PercentageGame) {
    var BlobSpawner = (function (_super) {
        __extends(BlobSpawner, _super);
        function BlobSpawner(game, x, y, key, frame, blobType, objectToSpawnKey, blobGroup, killCollider, prewarmedAmount, optionalObjects) {
            var _this = _super.call(this, game, x, y, key, frame) || this;
            //Set defined or predefined pool amount
            var poolStartAmount = 25;
            _this.maxSpawnAmount = poolStartAmount;
            //Spawngroup related
            _this.objectToSpawnKey = objectToSpawnKey;
            _this.spawnGroup = blobGroup;
            //Warmup a bunch of objects to spawn
            _this.spawnGroup.classType = blobType;
            if (optionalObjects !== null || optionalObjects !== undefined) {
                for (var i = 0; i < poolStartAmount; i++) {
                    var rndNumber = game.rnd.between(0, 1000);
                    if (rndNumber >= 501) {
                        _this.spawnGroup.createMultiple(1, objectToSpawnKey);
                    }
                    else if (rndNumber <= 500 && rndNumber >= 2) {
                        _this.spawnGroup.createMultiple(1, optionalObjects[0]);
                    }
                    else if (rndNumber <= 1) {
                        _this.spawnGroup.createMultiple(1, optionalObjects[1]);
                    }
                }
            }
            else {
                _this.spawnGroup.createMultiple(poolStartAmount, objectToSpawnKey);
            }
            var tempBodyArray = new Array();
            _this.spawnGroup.forEach(function (blob) {
                game.physics.p2.enable(blob);
                blob.ApplyPhysicsSettings();
                blob.SetPhysicsMaterial();
                blob.SetKillCollider(killCollider);
                blob.z = 10;
                tempBodyArray.push(blob.body);
            }, _this);
            _this.spawnGroupBodies = tempBodyArray;
            _this.killCollider = killCollider;
            return _this;
        }
        BlobSpawner.prototype.SpawnOne = function () {
            var firstObject = this.spawnGroup.getFirstDead();
            firstObject.reset(this.x + (this.width / 2), this.y + (this.height / 2));
            return firstObject;
        };
        BlobSpawner.prototype.SpawnMultiple = function (amount) {
            for (var i = 0; i < amount; i++) {
                this.SpawnOne();
            }
        };
        BlobSpawner.prototype.RemoveAll = function () {
            this.spawnGroup.forEach(function (obj) {
                obj.kill();
            }, this);
        };
        BlobSpawner.prototype.Remove = function (objToKill) {
            this.spawnGroup.forEach(function (obj) {
                if (objToKill == obj && obj.alive) {
                    obj.kill();
                }
                else {
                    console.log("found object but object is already dead");
                }
            }, this);
        };
        BlobSpawner.prototype.GetAliveBlobs = function () {
            var blobArray = new Array();
            for (var i = 0; i < this.spawnGroup.length; i++) {
                if (this.spawnGroup.children[i].alive == true) {
                    blobArray.push(this.spawnGroup.children[i]);
                }
            }
            return blobArray;
        };
        BlobSpawner.prototype.GetAllBlobs = function () {
            var blobArray = new Array();
            this.spawnGroup.forEach(function (blob) {
                blobArray.push(blob);
            }, this);
            return blobArray;
        };
        BlobSpawner.prototype.GetMaxSpawnAmount = function () {
            return this.maxSpawnAmount;
        };
        BlobSpawner.prototype.CanSpawn = function () {
            return this.GetAliveBlobs().length < this.GetMaxSpawnAmount();
        };
        BlobSpawner.prototype.Update = function () {
        };
        BlobSpawner.prototype.CleanUp = function (objDestroyed) {
            this.RemoveAll();
            this.spawnGroup.removeAll(true);
            this.spawnGroupBodies = [];
            return null;
        };
        return BlobSpawner;
    }(PercentageGame.GameObject));
    PercentageGame.BlobSpawner = BlobSpawner;
})(PercentageGame || (PercentageGame = {}));
var PercentageGame;
(function (PercentageGame) {
    var BlobSpawnerClick = (function (_super) {
        __extends(BlobSpawnerClick, _super);
        function BlobSpawnerClick(game, x, y, key, frame, blobType, objectToSpawnKey, clickRectangle, blobGroup, killCollider, prewarmedAmount, optionalObjects) {
            var _this = _super.call(this, game, x, y, key, frame, blobType, objectToSpawnKey, blobGroup, killCollider, prewarmedAmount, optionalObjects) || this;
            _this.canSpawn = true;
            _this.clickRectangle = clickRectangle;
            _this.EnableSpawning();
            _this.alpha = 0;
            return _this;
        }
        BlobSpawnerClick.prototype.CheckClickIsInsideArea = function () {
            if (this.clickRectangle.contains(this.game.input.mousePointer.x, this.game.input.mousePointer.y)) {
                if (this.canSpawn == false)
                    return;
                this.SpawnOne();
                this.canSpawn = false;
                this.game.time.events.add(500, this.ResetCanSpawn, this);
            }
            else {
                //Returns an array of P2.Body with a parent property which contains a proper P2.Body.Sprite reference
                var bodiesHit = this.game.physics.p2.hitTest(new Phaser.Point(this.game.input.mousePointer.x, this.game.input.mousePointer.y), this.GetAliveBlobs());
                if (bodiesHit.length > 0) {
                    bodiesHit[0].parent.sprite.kill();
                }
            }
        };
        BlobSpawnerClick.prototype.ResetCanSpawn = function () {
            this.canSpawn = true;
        };
        BlobSpawnerClick.prototype.SpawnOne = function () {
            var firstObject = this.spawnGroup.getFirstDead();
            if (firstObject == null || firstObject == undefined)
                return;
            firstObject.reset(this.game.input.mousePointer.x, this.game.input.mousePointer.y);
            var randomAngle = this.game.rnd.between(0, 1);
            randomAngle = (randomAngle < 0.25) ? 0.30 : randomAngle;
            firstObject.body.angularVelocity = randomAngle * this.game.rnd.pick([-1, 1]);
            return firstObject;
        };
        BlobSpawnerClick.prototype.CleanUp = function (objDestroyed) {
            this.DisableSpawning();
            this.RemoveAll();
            this.spawnGroup.removeAll(true);
            this.spawnGroupBodies = [];
            return null;
        };
        BlobSpawnerClick.prototype.DisableSpawning = function () {
            this.game.input.activePointer.leftButton.onDown.remove(this.CheckClickIsInsideArea, this);
        };
        BlobSpawnerClick.prototype.EnableSpawning = function () {
            this.game.input.activePointer.leftButton.onDown.add(this.CheckClickIsInsideArea, this);
        };
        return BlobSpawnerClick;
    }(PercentageGame.BlobSpawner));
    PercentageGame.BlobSpawnerClick = BlobSpawnerClick;
})(PercentageGame || (PercentageGame = {}));
var PercentageGame;
(function (PercentageGame) {
    var Basket = (function (_super) {
        __extends(Basket, _super);
        function Basket(game, x, y, key, frame, level, mathMan) {
            var _this = _super.call(this, game, x, y, key, frame) || this;
            _this.blobs = new Array();
            _this.heldBlobs = new Array();
            _this.minDistanceToAlphaChange = 250;
            _this.distanceToMouse = 0;
            _this.percentageFromMinDistance = 0;
            _this.interpolationValues = [0, 0, 0.05, 0.1, 1];
            _this.lerpValue = 0;
            _this.show = true;
            _this.blobEnterBasket = new Phaser.Signal();
            _this.blobExitBasket = new Phaser.Signal();
            _this.lastBasket = false;
            _this.solved = false;
            _this.level = level;
            _this.mathMan = mathMan;
            _this.blobEnterBasket.add(_this.OnBlobEnterBasket, _this);
            _this.blobExitBasket.add(_this.OnBlobExitBasket, _this);
            return _this;
        }
        Basket.prototype.Update = function () {
            this.basketFront.angle = this.body.angle;
            //Mouse alpha change
            this.distanceToMouse = this.basketFront.position.distance(this.game.input.mousePointer.position);
            this.percentageFromMinDistance = Phaser.Math.clamp(this.distanceToMouse / this.minDistanceToAlphaChange, 0, 1);
            this.lerpValue = Phaser.Math.linearInterpolation(this.interpolationValues, this.percentageFromMinDistance);
            this.basketFront.alpha = this.lerpValue;
        };
        Basket.prototype.OnBeginContact = function (otherBody, myBody, myShape, otherShape, equation) {
            if (myShape == this.triggerShape) {
                if (otherBody.sprite instanceof PercentageGame.BlobObject) {
                    this.heldBlobs.push(otherBody.sprite);
                    this.blobEnterBasket.dispatch();
                }
            }
        };
        Basket.prototype.OnEndContact = function (otherBody, myBody, myShape, otherShape, equation) {
            if (myShape == this.triggerShape) {
                if (otherBody.sprite instanceof PercentageGame.BlobObject) {
                    var arrayIndex = this.heldBlobs.indexOf(otherBody.sprite);
                    if (arrayIndex >= 0) {
                        this.heldBlobs.splice(arrayIndex, 1);
                    }
                    else {
                        console.log("One blob was not in array..");
                    }
                    this.blobExitBasket.dispatch();
                }
            }
        };
        Basket.prototype.OnBlobEnterBasket = function () {
            this.UpdateBasketFruitCountText();
        };
        Basket.prototype.OnBlobExitBasket = function () {
            this.UpdateBasketFruitCountText();
        };
        Basket.prototype.UpdateBasketFruitCountText = function () {
            this.basketFruitCountText.scale = new Phaser.Point(0, 0);
            this.basketFruitCountText.text = this.GetTotalBlobsHeld().toString();
            if (this.previousBasketFruitTween != null || this.previousBasketFruitTween != null) {
                if (this.previousBasketFruitTween.isRunning) {
                    this.previousBasketFruitTween.stop();
                }
            }
            this.currentBasketFruitTween = this.game.add.tween(this.basketFruitCountText.scale).to({ x: 1, y: 1 }, 500, Phaser.Easing.Back.Out);
            this.previousBasketFruitTween = this.currentBasketFruitTween;
            this.currentBasketFruitTween.start();
        };
        Basket.prototype.BasketCorrectlyFilled = function () {
            return (this.heldBlobs.length == this.goalValue);
        };
        Basket.prototype.GetTotalBlobsHeld = function () {
            return this.heldBlobs.length;
        };
        Basket.prototype.SetGoalValue = function (value) {
            this.goalValue = value;
        };
        Basket.prototype.SetBasketFrontTexts = function (texts) {
            this.BasketFrontTexts = texts;
        };
        Basket.prototype.SetCurrentBasketFrontText = function (startIndex) {
            this.currentBasketFrontTextIndex = startIndex;
            this.currentBasketFrontText = this.BasketFrontTexts[startIndex];
            this.percentageText.text = this.currentBasketFrontText;
        };
        Basket.prototype.SetTriggerShape = function (shape) {
            this.triggerShape = shape;
        };
        Basket.prototype.SetTriggerEvents = function () {
            this.body.onBeginContact.add(this.OnBeginContact, this);
            this.body.onEndContact.add(this.OnEndContact, this);
        };
        Basket.prototype.SetBasketFront = function (basketFrontSpriteKey, color) {
            this.basketFront = this.game.add.sprite(this.x, this.y, basketFrontSpriteKey);
            this.basketFront.anchor = new Phaser.Point(0.5, 0.5);
            this.basketFront.pivot = new Phaser.Point(0, 0);
            this.percentageText = this.game.add.text(this.x, this.y + 100, this.currentBasketFrontText, { font: "Amaranth", fill: color });
            this.percentageText.fontSize = PercentageGame.LevelHandler.GetGlobalSettings().basketFontSize;
            this.percentageText.anchor = new Phaser.Point(0.5, 0.5);
            this.percentageText.angle = this.basketFront.angle;
            return this.basketFront;
        };
        Basket.prototype.SetBasketFruitCountText = function () {
            this.basketFruitCountText = new Phaser.Text(this.game, this.x, this.y, "0", { font: "Amaranth", fontSize: 64, fill: "white", fontStyle: "bold" });
            this.basketFruitCountText.anchor = new Phaser.Point(0.5, 0.5);
            return this.basketFruitCountText;
        };
        Basket.prototype.GetBasketFront = function () {
            return this.basketFront;
        };
        //Solve Animation:
        Basket.prototype.ChainBasket = function (basketToProg) {
            this.chainedBasket = basketToProg;
        };
        Basket.prototype.SetWinProg = function (winMethod) {
            this.winProg = winMethod;
        };
        Basket.prototype.SolveBasket = function () {
            if (this.solved) {
                if (!this.lastBasket)
                    this.SolveNextBasket();
                return;
            }
            if (this.currentBasketFrontTextIndex == this.BasketFrontTexts.length - 2 && !this.BasketCorrectlyFilled()) {
                this.PlayBasketWrongAnimation();
            }
            else {
                this.IncrementLabelText();
                this.PlayLabelAnimation();
            }
        };
        Basket.prototype.SolveNextBasket = function () {
            this.chainedBasket.SolveBasket();
        };
        Basket.prototype.PlayLabelAnimation = function () {
            this.percentageText.scale = new Phaser.Point(0, 0);
            this.game.add.tween(this.percentageText.scale).to({ x: 1, y: 1 }, PercentageGame.LevelHandler.GetGlobalSettings().basketTextTweenTimeInMilliseconds, Phaser.Easing.Linear.None, true)
                .onComplete.addOnce(this.LabelAnimationTweenEnded, this);
        };
        Basket.prototype.LabelAnimationTweenEnded = function () {
            if (this.currentBasketFrontTextIndex == this.BasketFrontTexts.length - 2 && !this.BasketCorrectlyFilled()) {
                //Play 'wrong' animation
                this.PlayBasketWrongAnimation();
            }
            else if (this.currentBasketFrontTextIndex == this.BasketFrontTexts.length - 1) {
                //Play 'right' animation
                this.PlayBasketRightAnimation();
                this.solved = true;
            }
            else {
                this.game.time.events.add(PercentageGame.LevelHandler.GetGlobalSettings().nextBasketSolveWaitTimeInMilliseconds, this.SolveBasket, this);
            }
        };
        Basket.prototype.PlayBasketWrongAnimation = function () {
            this.mathMan.PlayWrongAnimation(this.BasketWrongAnimationEnded, this);
        };
        Basket.prototype.BasketWrongAnimationEnded = function () {
            //Is this the last basket?
            if (this.lastBasket) {
                this.level.CheckForWinCondition();
            }
            else {
                this.SolveNextBasket();
            }
            this.mathMan.PlayIdleAnimation(undefined, undefined);
        };
        Basket.prototype.PlayBasketRightAnimation = function () {
            this.mathMan.PlayRightAnimation(this.BasketRightAnimationEnded, this);
        };
        Basket.prototype.BasketRightAnimationEnded = function () {
            //Is this the last basket?
            if (this.lastBasket) {
                //Lock basket
                this.level.CheckForWinCondition();
            }
            else {
                //Lock basket
                this.SolveNextBasket();
            }
        };
        Basket.prototype.MarkLastBasket = function () {
            this.lastBasket = true;
        };
        Basket.prototype.IncrementLabelText = function () {
            this.SetCurrentBasketFrontText(this.currentBasketFrontTextIndex + 1);
        };
        Basket.prototype.setTextPosition = function (x, y) {
            this.percentageText.position.set(x, y);
        };
        return Basket;
    }(PercentageGame.GameObject));
    PercentageGame.Basket = Basket;
})(PercentageGame || (PercentageGame = {}));
var PercentageGame;
(function (PercentageGame) {
    var Branch = (function (_super) {
        __extends(Branch, _super);
        function Branch(game, x, y, key, frame) {
            return _super.call(this, game, x, y, key, frame) || this;
        }
        Branch.prototype.Update = function () {
        };
        Branch.prototype.SetPhysicsMaterial = function () {
            this.physicsMaterial = this.game.physics.p2.createMaterial("branchMaterial", this.body);
        };
        Branch.prototype.GetPhysicsMaterial = function () {
            return this.physicsMaterial;
        };
        return Branch;
    }(PercentageGame.GameObject));
    PercentageGame.Branch = Branch;
})(PercentageGame || (PercentageGame = {}));
var PercentageGame;
(function (PercentageGame) {
    var Mathman = (function (_super) {
        __extends(Mathman, _super);
        function Mathman(game, x, y, key, frame) {
            var _this = _super.call(this, game, x, y, key, frame) || this;
            _this.idleAnimation = _this.animations.add("mathManIdleAnimation", [0, 1, 2, 3, 4, 5, 6, 7, 8], 6, true);
            _this.rightAnimation = _this.animations.add("mathManRightAnimation", [9, 10, 11, 12, 12, 12, 11, 10, 9], 6);
            _this.wrongAnimation = _this.animations.add("mathManWrongAnimation", [13, 14, 15, 16, 16, 16, 15, 14, 13], 6);
            return _this;
        }
        Mathman.prototype.Update = function () {
        };
        Mathman.prototype.PlayRightAnimation = function (onAnimationEnd, callerContext) {
            this.rightAnimation.onComplete.dispose();
            this.rightAnimation.onComplete.addOnce(onAnimationEnd, callerContext);
            this.rightAnimation.play();
        };
        Mathman.prototype.PlayWrongAnimation = function (onAnimationEnd, callerContext) {
            this.wrongAnimation.onComplete.dispose();
            this.wrongAnimation.onComplete.addOnce(onAnimationEnd, callerContext);
            this.wrongAnimation.play();
        };
        Mathman.prototype.PlayIdleAnimation = function (onAnimationEnd, callerContext) {
            this.idleAnimation.onComplete.dispose();
            if (onAnimationEnd) {
                this.idleAnimation.onComplete.addOnce(onAnimationEnd, callerContext);
            }
            this.idleAnimation.play();
        };
        return Mathman;
    }(PercentageGame.GameObject));
    PercentageGame.Mathman = Mathman;
})(PercentageGame || (PercentageGame = {}));
var PercentageGame;
(function (PercentageGame) {
    var ObjectFactory = (function () {
        function ObjectFactory() {
        }
        ObjectFactory.CreateClickSpawner = function (game, x, y, spawnerKey, spawnObjectKey, clickArea, blobGroup, killCollider, blobAmount, blobType, optionalSpawnObjectKeys) {
            if (blobType == undefined || blobType == null) {
                blobType = PercentageGame.BlobObject;
            }
            if (optionalSpawnObjectKeys == undefined || optionalSpawnObjectKeys == null) {
                optionalSpawnObjectKeys = [spawnObjectKey];
            }
            var newSpawner = new PercentageGame.BlobSpawnerClick(game, x, y, spawnerKey, 0, blobType, spawnObjectKey, clickArea, blobGroup, killCollider, blobAmount, optionalSpawnObjectKeys);
            return newSpawner;
        };
        ObjectFactory.CreateBasket = function (basketInfo, level, game, basketFrontGroup, mathMan) {
            //Cache info
            var basketPosition = undefined;
            var basketUsesNormalizedPositions = basketInfo.normalizedPositions;
            var basketSpriteKey = (basketInfo.spriteKey == "default" || basketInfo.spriteKey == undefined || basketInfo.spriteKey == null) ? "basket" : basketInfo.spriteKey;
            var basketFrontSpriteKey = (basketInfo.spriteFrontKey == "default" || basketInfo.spriteFrontKey == undefined || basketInfo.spriteFrontKey == null) ? "basketFront" : basketInfo.spriteFrontKey;
            var basketColliderKey = (basketInfo.colliderKey == "default" || basketInfo.colliderKey == undefined || basketInfo.colliderKey == null) ? "basketPolygon" : basketInfo.colliderKey;
            var basketColliderID = (basketInfo.colliderID == "default" || basketInfo.colliderID == undefined || basketInfo.colliderID == null) ? "basketPolygonData" : basketInfo.colliderID;
            var basketColliderFrontID = (basketInfo.colliderFrontID == "default" || basketInfo.colliderFrontID == undefined || basketInfo.colliderFrontID == null) ? "basketFrontPolygonData" : basketInfo.colliderFrontID;
            var basketGoalValue = basketInfo.goalValue;
            var basketTexts = basketInfo.labelTexts;
            basketPosition = new Phaser.Point(basketInfo.positionX, basketInfo.positionY);
            //Create Instance
            var basket = new PercentageGame.Basket(level.game, basketPosition.x, basketPosition.y, basketSpriteKey, 0, level, mathMan);
            basket.anchor = new Phaser.Point(0.5, 0.5);
            //Set Immediate Values
            basket.SetGoalValue(basketGoalValue);
            //Set physics
            game.physics.p2.enableBody(basket, false);
            //Set Collision Shape
            basket.body.clearShapes();
            basket.body.loadPolygon(basketColliderKey, basketColliderID);
            basket.body.static = true;
            //Set Sensor Shape
            var basketInnerCollider = basket.body.addCircle(basket.getBounds().x);
            game.debug.geom(basketInnerCollider, "red", true);
            basketInnerCollider.sensor = true;
            basket.SetTriggerShape(basketInnerCollider);
            basket.SetTriggerEvents();
            basketFrontGroup.add(basket.SetBasketFront(basketFrontSpriteKey, "#FFFFFF"));
            //All the texts the basket has to iterate through
            basket.SetBasketFrontTexts(basketTexts);
            //Set the current text to beb the first in the text array
            basket.SetCurrentBasketFrontText(0);
            basketFrontGroup.add(basket.SetBasketFruitCountText());
            return basket;
        };
        ObjectFactory.CreateBranch = function (branchInfo, level, game) {
            var branchPosition = undefined;
            var branchUsesNormalizedPosition = branchInfo.normalizedPositions;
            var branchSpriteKey = (branchInfo.spriteKey == "default" || branchInfo.spriteKey == undefined || branchInfo.spriteKey == null) ? "branch" : branchInfo.spriteKey;
            var branchColliderKey = (branchInfo.colliderKey == "default" || branchInfo.colliderKey == undefined || branchInfo.colliderKey == null) ? "branchPolygon" : branchInfo.colliderKey;
            var basketColliderID = (branchInfo.colliderID == "default" || branchInfo.colliderID == undefined || branchInfo.colliderID == null) ? "branchPolygonData" : branchInfo.colliderID;
            var branchRestitution = branchInfo.restitution;
            var branchAngle = branchInfo.angle;
            if (branchUsesNormalizedPosition == true) {
                branchPosition = new Phaser.Point(window.innerWidth * branchInfo.positionX, window.innerHeight * branchInfo.positionY);
            }
            else {
                branchPosition = new Phaser.Point(branchInfo.positionX, branchInfo.positionY);
            }
            var branch = new PercentageGame.Branch(game, branchPosition.x, branchPosition.y, branchSpriteKey, 0);
            branch.anchor = new Phaser.Point(0.5, 0.5);
            //Set physics
            game.physics.p2.enableBody(branch, true);
            //Set Collision Shape
            branch.body.clearShapes();
            branch.body.loadPolygon(branchColliderKey, basketColliderID);
            branch.body.static = true;
            branch.body.angle = branchAngle;
            //USE CONTACT MATERIALS TO SET EXTRA RESTITUIONS BETWEEN TWO OBJECTS
            branch.SetPhysicsMaterial();
            var blobs = level.GetSpawner().GetAllBlobs();
            var contactMaterial;
            for (var i = 0; i < blobs.length; i++) {
                contactMaterial = game.physics.p2.createContactMaterial(branch.GetPhysicsMaterial(), blobs[i].GetPhysicsMaterial());
                contactMaterial.restitution = 0; //branchInfo.restitution;
                contactMaterial.friction = 1;
            }
            return branch;
        };
        ObjectFactory.CreateKillCollider = function (game, x, y, width, height) {
            var tempKillCollider = new PercentageGame.KillCollider(game, x, y, width, height);
            tempKillCollider.SetShape();
            game.add.existing(tempKillCollider);
            return tempKillCollider;
        };
        ObjectFactory.CreateBackButton = function (game, x, y) {
            var tempBackButton = new PercentageGame.BackButton(game, x, y, "backButton");
            return tempBackButton;
        };
        ObjectFactory.CreateBackButtonGameSelect = function (game, x, y) {
            var tempBackButton = new PercentageGame.BackButtonGameSelect(game, x, y, "backButton");
            return tempBackButton;
        };
        ObjectFactory.CreateMuteButton = function (game, x, y) {
            var tempMuteButton = new PercentageGame.MuteButton(game, x, y);
            return tempMuteButton;
        };
        ObjectFactory.CreateEvaluateButton = function (game, x, y, level) {
            var tempEvalButton = new PercentageGame.EvaluateButton(game, x, y, "evaluationButton", level);
            return tempEvalButton;
        };
        ObjectFactory.CreateMathMan = function (game, x, y, level) {
            var tempMathMan = new PercentageGame.Mathman(game, x, y, "mathMan", 0);
            return tempMathMan;
        };
        ObjectFactory.CreateArrowButton = function (game, x, y, pressCallback, context) {
            var tempArrowButton = new PercentageGame.ArrowButton(game, x, y, pressCallback, context);
            return tempArrowButton;
        };
        return ObjectFactory;
    }());
    PercentageGame.ObjectFactory = ObjectFactory;
})(PercentageGame || (PercentageGame = {}));
var PercentageGame;
(function (PercentageGame) {
    var MusicHandler = (function () {
        function MusicHandler() {
        }
        MusicHandler.SetGameReference = function (gameRef) {
            this.gameReference = gameRef;
        };
        MusicHandler.AddMusic = function (audioKey, volume, loop) {
            var startMuted = (localStorage.getItem("musicMuted") == "true") ? true : false;
            this.audioObj = this.gameReference.add.audio(audioKey, volume, loop);
            this.audioObj.mute = startMuted;
        };
        MusicHandler.IsMusicLooping = function () {
            if (this.audioObj == undefined || this.audioObj == null)
                return false;
            return this.audioObj.loop;
        };
        MusicHandler.IsMusicPlaying = function () {
            if (this.audioObj == undefined || this.audioObj == null)
                return false;
            return this.audioObj.isPlaying;
        };
        MusicHandler.PlayMusic = function () {
            if (this.audioObj == undefined || this.audioObj == null) {
                return;
            }
            this.audioObj.play();
        };
        MusicHandler.StopMusic = function () {
            if (this.audioObj == undefined || this.audioObj == null) {
                return;
            }
            this.audioObj.stop();
        };
        MusicHandler.ToggleMute = function (toggle) {
            this.audioObj.mute = toggle;
            this.SaveMute(toggle);
        };
        MusicHandler.SaveMute = function (toggle) {
            localStorage.setItem("musicMuted", (toggle == true) ? "true" : "false");
        };
        MusicHandler.IsMuted = function () {
            if (this.audioObj == undefined || this.audioObj == null) {
                return false;
            }
            return this.audioObj.mute;
        };
        return MusicHandler;
    }());
    PercentageGame.MusicHandler = MusicHandler;
})(PercentageGame || (PercentageGame = {}));
var PercentageGame;
(function (PercentageGame) {
    var KillCollider = (function (_super) {
        __extends(KillCollider, _super);
        function KillCollider(game, x, y, width, height) {
            var _this = _super.call(this, game, x, y, "Empty") || this;
            _this.rectWidth = width;
            _this.rectHeight = height;
            return _this;
        }
        KillCollider.prototype.SetShape = function () {
            this.anchor = new Phaser.Point(0.5, 0.5);
            this.game.physics.p2.enable(this);
            this.body.clearShapes();
            this.rectangle = this.body.addRectangle(this.rectWidth, this.rectHeight);
            this.body.static = true;
        };
        KillCollider.prototype.GetShape = function () {
            return this.rectangle;
        };
        return KillCollider;
    }(Phaser.Sprite));
    PercentageGame.KillCollider = KillCollider;
})(PercentageGame || (PercentageGame = {}));
var PercentageGame;
(function (PercentageGame) {
    var BaseButton = (function (_super) {
        __extends(BaseButton, _super);
        function BaseButton(game, x, y, key) {
            var _this = _super.call(this, game, x, y, key, 0) || this;
            _this.interactable = true;
            _this.interactableResetTime = 150;
            _this.hoverOverTint = 0xd3d3d3;
            _this.hoverOutTint = 0xFFFFFF;
            _this.anchor = new Phaser.Point(0.5, 0.5);
            _this.inputEnabled = true;
            _this.events.onInputOver.add(_this.InputOver, _this);
            _this.events.onInputOut.add(_this.InputOut, _this);
            _this.events.onInputDown.add(_this.InputDown, _this);
            return _this;
        }
        BaseButton.prototype.InputOver = function () {
            this.tint = this.hoverOverTint;
        };
        BaseButton.prototype.InputOut = function () {
            this.tint = this.hoverOutTint;
        };
        BaseButton.prototype.InputDown = function () {
            if (this.interactable == true && this.visible == true) {
                this.SetUnInteractable();
                this.game.time.events.add(150, this.SetInteractable, this);
                this.OnButtonPress();
            }
        };
        BaseButton.prototype.Fade = function (fadeIn, instantTransition) {
            if (this.previousTween != null || this.previousTween != undefined) {
                this.previousTween.stop();
            }
            if (!instantTransition) {
                var startAlpha = (fadeIn == true) ? 0 : 1;
                var targetAlpha = (fadeIn == true) ? 1 : 0;
                this.alpha = startAlpha;
                this.currentTween = this.game.add.tween(this).to({ alpha: targetAlpha }, 350, Phaser.Easing.Linear.None);
                this.previousTween = this.currentTween;
                if (fadeIn) {
                    this.SetVisible();
                }
                else {
                    this.currentTween.onComplete.addOnce(this.SetInvisible, this);
                }
                this.currentTween.start();
            }
            else {
                if (fadeIn) {
                    this.SetVisible();
                    this.alpha = 1;
                }
                else {
                    this.SetInvisible();
                    this.alpha = 0;
                }
            }
        };
        BaseButton.prototype.SetVisible = function () {
            this.visible = true;
        };
        BaseButton.prototype.SetInvisible = function () {
            this.visible = false;
        };
        BaseButton.prototype.SetUnInteractable = function () {
            this.interactable = false;
        };
        BaseButton.prototype.SetInteractable = function () {
            this.interactable = true;
        };
        BaseButton.prototype.Update = function () {
        };
        return BaseButton;
    }(PercentageGame.GameObject));
    PercentageGame.BaseButton = BaseButton;
})(PercentageGame || (PercentageGame = {}));
var PercentageGame;
(function (PercentageGame) {
    var BackButton = (function (_super) {
        __extends(BackButton, _super);
        function BackButton(game, x, y, key) {
            return _super.call(this, game, x, y, key) || this;
        }
        BackButton.prototype.OnButtonPress = function () {
            PercentageGame.LevelTracker.ResetLevelsCompleted();
            this.game.state.start("percentageLevelSelect");
        };
        BackButton.prototype.Update = function () {
        };
        return BackButton;
    }(PercentageGame.BaseButton));
    PercentageGame.BackButton = BackButton;
})(PercentageGame || (PercentageGame = {}));
var PercentageGame;
(function (PercentageGame) {
    var BackButtonGameSelect = (function (_super) {
        __extends(BackButtonGameSelect, _super);
        function BackButtonGameSelect(game, x, y, key) {
            return _super.call(this, game, x, y, key) || this;
        }
        BackButtonGameSelect.prototype.OnButtonPress = function () {
            PercentageGame.LevelSelect.LevelSelectState.RunLoadingScreen = true;
            StartUp.InitMainMenu();
        };
        BackButtonGameSelect.prototype.Update = function () {
        };
        return BackButtonGameSelect;
    }(PercentageGame.BaseButton));
    PercentageGame.BackButtonGameSelect = BackButtonGameSelect;
})(PercentageGame || (PercentageGame = {}));
var PercentageGame;
(function (PercentageGame) {
    var MuteButton = (function (_super) {
        __extends(MuteButton, _super);
        function MuteButton(game, x, y) {
            var _this = _super.call(this, game, x, y, "", 0) || this;
            _this.onSprite = _this.game.add.sprite(x, y, "speakerOn");
            _this.onSprite.anchor = new Phaser.Point(0.5, 0.5);
            _this.onSprite.inputEnabled = true;
            _this.onSprite.events.onInputOver.add(_this.InputOver, _this);
            _this.onSprite.events.onInputOut.add(_this.InputOut, _this);
            _this.onSprite.events.onInputDown.add(_this.InputDown, _this);
            _this.offSprite = _this.game.add.sprite(x, y, "speakerOff");
            _this.offSprite.anchor = new Phaser.Point(0.5, 0.5);
            _this.offSprite.inputEnabled = true;
            _this.offSprite.events.onInputOver.add(_this.InputOver, _this);
            _this.offSprite.events.onInputOut.add(_this.InputOut, _this);
            _this.offSprite.events.onInputDown.add(_this.InputDown, _this);
            _this.onSprite.visible = !PercentageGame.MusicHandler.IsMuted();
            _this.offSprite.visible = PercentageGame.MusicHandler.IsMuted();
            return _this;
        }
        MuteButton.prototype.InputOver = function () {
            this.tint = 0xd3d3d3;
        };
        MuteButton.prototype.InputOut = function () {
            this.tint = 0xFFFFFF;
        };
        MuteButton.prototype.InputDown = function () {
            PercentageGame.MusicHandler.ToggleMute(!PercentageGame.MusicHandler.IsMuted());
            this.UpdateButtonSprite();
        };
        MuteButton.prototype.UpdateButtonSprite = function () {
            this.onSprite.visible = !PercentageGame.MusicHandler.IsMuted();
            this.offSprite.visible = PercentageGame.MusicHandler.IsMuted();
        };
        MuteButton.prototype.Update = function () {
        };
        return MuteButton;
    }(PercentageGame.GameObject));
    PercentageGame.MuteButton = MuteButton;
})(PercentageGame || (PercentageGame = {}));
var PercentageGame;
(function (PercentageGame) {
    var EvaluateButton = (function (_super) {
        __extends(EvaluateButton, _super);
        function EvaluateButton(game, x, y, key, level) {
            var _this = _super.call(this, game, x, y, key, 0) || this;
            _this.level = level;
            _this.inputEnabled = true;
            _this.anchor = new Phaser.Point(0.5, 0.5);
            _this.events.onInputOver.add(_this.InputOver, _this);
            _this.events.onInputOut.add(_this.InputOut, _this);
            _this.events.onInputDown.add(_this.InputDown, _this);
            return _this;
        }
        EvaluateButton.prototype.InputOver = function () {
            this.tint = 0xd3d3d3;
        };
        EvaluateButton.prototype.InputOut = function () {
            this.tint = 0xFFFFFF;
        };
        EvaluateButton.prototype.InputDown = function () {
            this.level.TrySolveBaskets();
        };
        EvaluateButton.prototype.Update = function () {
        };
        return EvaluateButton;
    }(PercentageGame.GameObject));
    PercentageGame.EvaluateButton = EvaluateButton;
})(PercentageGame || (PercentageGame = {}));
var PercentageGame;
(function (PercentageGame) {
    var ArrowButton = (function (_super) {
        __extends(ArrowButton, _super);
        function ArrowButton(game, x, y, pressCallback, context) {
            var _this = _super.call(this, game, x, y, "buttonArrowTest") || this;
            _this.onPress = new Phaser.Signal();
            _this.onPress.add(pressCallback, context);
            return _this;
        }
        ArrowButton.prototype.OnButtonPress = function () {
            this.onPress.dispatch();
        };
        return ArrowButton;
    }(PercentageGame.BaseButton));
    PercentageGame.ArrowButton = ArrowButton;
})(PercentageGame || (PercentageGame = {}));
var PercentageGame;
(function (PercentageGame) {
    var SaveData = (function () {
        function SaveData() {
        }
        return SaveData;
    }());
    PercentageGame.SaveData = SaveData;
    var LevelData = (function () {
        function LevelData() {
        }
        return LevelData;
    }());
    PercentageGame.LevelData = LevelData;
})(PercentageGame || (PercentageGame = {}));
var PercentageGame;
(function (PercentageGame) {
    var SaveHandler = (function () {
        function SaveHandler() {
        }
        SaveHandler.SetSaveDataItemPrefix = function (prefix) {
            this.SaveDataItemPrefix = prefix;
        };
        SaveHandler.CreateNewSaveData = function (numberOfLevels) {
            var newData = new PercentageGame.SaveData();
            newData.levelData = new Array();
            var amountOfLevels = PercentageGame.LevelHandler.GetLevelInfoCollection().Levels.length;
            var levelData = null;
            for (var i = 0; i < amountOfLevels; i++) {
                levelData = new PercentageGame.LevelData();
                levelData.completed = false;
                newData.levelData.push(levelData);
            }
            this.SetSaveData(newData);
        };
        SaveHandler.SetSaveData = function (data) {
            var saveString = JSON.stringify(data);
            localStorage.setItem(this.SaveDataItemPrefix + "-SaveData", saveString);
        };
        SaveHandler.GetSaveData = function () {
            return JSON.parse(localStorage.getItem(this.SaveDataItemPrefix + "-SaveData"));
        };
        SaveHandler.SaveLevel = function (index, completed) {
            var currentSaveData = null;
            if (this.HasSaveData() == false) {
                this.CreateNewSaveData(PercentageGame.LevelHandler.GetLevelInfoCollection().Levels.length);
            }
            currentSaveData = this.GetSaveData();
            currentSaveData.levelData[index].completed = completed;
            this.SetSaveData(currentSaveData);
        };
        SaveHandler.GetLevelData = function () {
            return this.GetSaveData().levelData;
        };
        SaveHandler.HasSaveData = function () {
            var storedItem = localStorage.getItem(this.SaveDataItemPrefix + "-SaveData");
            return storedItem != null;
        };
        return SaveHandler;
    }());
    SaveHandler.SaveDataItemPrefix = "";
    PercentageGame.SaveHandler = SaveHandler;
})(PercentageGame || (PercentageGame = {}));
var PercentageGame;
(function (PercentageGame) {
    var LevelHandler = (function () {
        function LevelHandler() {
        }
        LevelHandler.SetGame = function (game) {
            this.Game = game;
        };
        LevelHandler.LoadJSONFromFile = function () {
            this.Game.load.json("levelsJSON", "data/percentage/levelObjectives.json");
        };
        LevelHandler.SetLevelInfoFromCache = function () {
            this.World0 = this.Game.cache.getJSON("levelsJSON");
        };
        //TODO: EXTEND WITH MULTIPLE LEVEL OBJECTIVE FILES
        LevelHandler.GetLevelInfoCollection = function () {
            return this.World0;
        };
        LevelHandler.GetGlobalSettings = function () {
            return this.World0.GlobalSettings;
        };
        LevelHandler.GetLevelInfo = function (levelIndex) {
            return this.World0.Levels[levelIndex];
        };
        LevelHandler.LoadLevel = function (index) {
            this.CurrentLevelIndex = index;
            this.Game.state.start("percentageLevel");
        };
        LevelHandler.GetCurrentLevelIndex = function () {
            return this.CurrentLevelIndex;
        };
        return LevelHandler;
    }());
    PercentageGame.LevelHandler = LevelHandler;
})(PercentageGame || (PercentageGame = {}));
var PercentageGame;
(function (PercentageGame) {
    var LevelInfoCollection = (function () {
        function LevelInfoCollection() {
        }
        return LevelInfoCollection;
    }());
    PercentageGame.LevelInfoCollection = LevelInfoCollection;
    var GlobalSettingsInfo = (function () {
        function GlobalSettingsInfo() {
        }
        return GlobalSettingsInfo;
    }());
    PercentageGame.GlobalSettingsInfo = GlobalSettingsInfo;
    var LevelInfo = (function () {
        function LevelInfo() {
        }
        return LevelInfo;
    }());
    PercentageGame.LevelInfo = LevelInfo;
    var SettingsInfo = (function () {
        function SettingsInfo() {
        }
        return SettingsInfo;
    }());
    PercentageGame.SettingsInfo = SettingsInfo;
    var BranchInfo = (function () {
        function BranchInfo() {
        }
        return BranchInfo;
    }());
    PercentageGame.BranchInfo = BranchInfo;
    var BasketInfo = (function () {
        function BasketInfo() {
        }
        return BasketInfo;
    }());
    PercentageGame.BasketInfo = BasketInfo;
})(PercentageGame || (PercentageGame = {}));
var PercentageGame;
(function (PercentageGame) {
    var BaseLevel = (function (_super) {
        __extends(BaseLevel, _super);
        function BaseLevel() {
            var _this = _super.call(this) || this;
            _this.animatedBackgroundObjects = [];
            _this.backgroundFromButtom = [];
            _this.backgroundFromTop = [];
            _this.backgroundFromRight = [];
            _this.backgroundFromLeft = [];
            _this.backgroundFromBottomNoDelay = [];
            _this.canSolveBaskets = true;
            return _this;
        }
        BaseLevel.prototype.preload = function () {
            this.UpdateLevelIndex();
            this.GetLevelInfo();
            this.clickArea = new Phaser.Rectangle(0, 0, this.levelInfo.Settings.clickAreaWidth, this.levelInfo.Settings.clickAreaHeight);
            this.AddGroups();
            this.PreloadOverride();
            this.canSolveBaskets = true;
        };
        BaseLevel.prototype.create = function () {
            this.game.tweens.frameBased = false;
            this.game.physics.startSystem(Phaser.Physics.P2JS);
            this.PrepareBackgroundMusic();
            this.BuildLevel();
            this.ApplyPhysicsSettings();
            if (!PercentageGame.MusicHandler.IsMusicPlaying()) {
                this.StartBackgroundMusic();
            }
            this.CreateOverride();
        };
        BaseLevel.prototype.update = function () {
            var _this = this;
            if (this.animatedBackgroundObjects[0] !== undefined && this.animatedBackgroundObjects[0] !== null) {
                var index_1 = 0;
                var objectInFront_1 = 0;
                this.animatedBackgroundObjects.forEach(function (element) {
                    if (index_1 >= _this.animatedBackgroundObjects.length) {
                        index_1 = 0;
                    }
                    element.position.set(element.position.x - 0.5, _this.game.height - element.height + (Math.sin(_this.game.time.now / 2200) * 15));
                    if (element.position.x + element.width <= 0) {
                        if (index_1 === 1) {
                            element.position.set(_this.animatedBackgroundObjects[0].position.x + _this.animatedBackgroundObjects[0].width, element.position.y);
                            objectInFront_1 = 0;
                        }
                        else if (index_1 === 0) {
                            element.position.set(_this.animatedBackgroundObjects[1].position.x + _this.animatedBackgroundObjects[1].width, element.position.y);
                            objectInFront_1 = 1;
                        }
                    }
                    if (_this.animatedBackgroundObjects[index_1].position.x < 0) {
                        PercentageGame.LevelTracker.SetBackgroundMistLastXPosition(_this.animatedBackgroundObjects[index_1].position);
                    }
                    index_1++;
                });
            }
            this.basketFronts.position.set(this.baskets.position.x, this.baskets.position.y);
            this.baskets.forEach(function (basket) {
                basket.setTextPosition(this.baskets.position.x + basket.x, this.baskets.position.y + basket.y + 100);
            }, this);
            this.UpdateOverride();
            this.UpdateUI();
        };
        BaseLevel.prototype.UpdateUI = function () {
            if (this.clickArea.contains(this.game.input.mousePointer.x, this.game.input.mousePointer.y)) {
                if (this.GetSpawner().CanSpawn()) {
                    this.cannotSpawnIcon.visible = false;
                    this.canSpawnIcon.visible = true;
                }
                else {
                    this.cannotSpawnIcon.visible = true;
                    this.canSpawnIcon.visible = false;
                }
            }
            else {
                this.cannotSpawnIcon.visible = false;
                this.canSpawnIcon.visible = false;
            }
            this.canSpawnIcon.position = this.game.input.mousePointer.position;
            this.cannotSpawnIcon.position = this.game.input.mousePointer.position;
            this.UpdateUIOverride();
        };
        BaseLevel.prototype.UpdateLevelIndex = function () {
            this.levelIndex = PercentageGame.LevelHandler.GetCurrentLevelIndex();
        };
        BaseLevel.prototype.GetLevelInfo = function () {
            this.levelInfo = PercentageGame.LevelHandler.GetLevelInfo(this.levelIndex);
        };
        BaseLevel.prototype.AddGroups = function () {
            this.background = this.game.add.group();
            this.clickSpawner = this.game.add.group();
            this.baskets = this.game.add.group();
            this.blobs = this.game.add.group();
            this.basketFronts = this.game.add.group();
            this.branches = this.game.add.group();
            this.levelGUI = this.game.add.group();
        };
        BaseLevel.prototype.PrepareBackgroundMusic = function () {
            var audioToPlay = (this.levelInfo.Settings.audio == "default") ? "mana" : this.levelInfo.Settings.audio;
            if (audioToPlay == "none")
                return;
            PercentageGame.MusicHandler.AddMusic(audioToPlay, 0.25, true);
        };
        BaseLevel.prototype.StartBackgroundMusic = function () {
            PercentageGame.MusicHandler.PlayMusic();
        };
        BaseLevel.prototype.BuildLevel = function () {
            //Do something with misc info
            var backgrounds = this.BuildBackground();
            //Add Kill Colliders
            this.killCollider = PercentageGame.ObjectFactory.CreateKillCollider(this.game, 480, 545, window.innerWidth, 30);
            //Add Click Spawner
            var spawner = PercentageGame.ObjectFactory.CreateClickSpawner(this.game, -200, -200, "spawner", "blob", this.clickArea, this.blobs, this.killCollider, this.levelInfo.Settings.fruitAmount, PercentageGame.BlobObject, ["fruit2", "fruit4"]);
            this.clickSpawner.add(spawner);
            var tempBranch;
            var tempBasket;
            //Create Baskets
            for (var i = 0; i < this.levelInfo.Baskets.length; i++) {
                tempBasket = PercentageGame.ObjectFactory.CreateBasket(this.levelInfo.Baskets[i], this, this.game, this.basketFronts, this.mathMan);
                this.baskets.add(tempBasket);
            }
            this.baskets.getTop().MarkLastBasket();
            //Create Branches
            for (var i = 0; i < this.levelInfo.Branches.length; i++) {
                tempBranch = PercentageGame.ObjectFactory.CreateBranch(this.levelInfo.Branches[i], this, this.game);
                this.branches.add(tempBranch);
            }
            this.canSpawnIcon = this.game.add.sprite(0, 0, "blob");
            this.canSpawnIcon.anchor = new Phaser.Point(0.5, 0.5);
            this.canSpawnIcon.alpha = 0.5;
            this.cannotSpawnIcon = this.game.add.sprite(0, 0, "cannotSpawn");
            this.cannotSpawnIcon.anchor = new Phaser.Point(0.5, 0.5);
            this.cannotSpawnIcon.alpha = 0.5;
            this.levelGUI.add(this.canSpawnIcon);
            this.levelGUI.add(this.cannotSpawnIcon);
            var backButton = PercentageGame.ObjectFactory.CreateBackButton(this.game, 50, this.game.height - 50);
            this.levelGUI.add(backButton);
            var muteButton = PercentageGame.ObjectFactory.CreateMuteButton(this.game, this.game.width - 50, this.game.height - 50);
            this.levelGUI.add(muteButton);
            var evaluateButton = PercentageGame.ObjectFactory.CreateEvaluateButton(this.game, this.game.width - 100, this.game.height * 0.5, this);
            var lvlsInARow = PercentageGame.LevelTracker.GetLevelsCompletedInARow();
            // Slide the baskets into the playing field.
            this.baskets.position.set(1000, 0);
            var delay = 0;
            // wait for lvl build animation.
            if (lvlsInARow === 0)
                delay = 3000;
            else
                delay = 0;
            var basketsTween = this.baskets.game.add.tween(this.baskets).
                to({ x: 0 }, 1500, Phaser.Easing.Exponential.Out, true, delay);
            //Run the world build animation if player came from menu.
            if (lvlsInARow === 0) {
                this.buildWorldLevel(undefined, this.backgroundFromButtom, this.backgroundFromRight, this.backgroundFromLeft, this.backgroundFromTop, this.backgroundFromBottomNoDelay);
            }
            this.mathMan.PlayIdleAnimation(undefined, undefined);
        };
        BaseLevel.prototype.BuildBackground = function () {
            //let spriteKey =  "backgroundFront"; //(this.levelInfo.Settings.backgroundSpriteKey == "default") ? "background" : this.levelInfo.Settings.backgroundSpriteKey;  
            this.setUpLeafParticle();
            var backgroundFront = this.game.add.sprite(0, 0, "backgroundFront");
            backgroundFront.z = 0;
            var backgroundTree = this.game.add.sprite(30, 111, "backgroundTree");
            backgroundTree.z = 1;
            var backgroundTreeFront = this.game.add.sprite(0, 0, "backgroundTreeFront");
            backgroundTree.z = 2;
            var background1 = this.game.add.sprite(0, 0, "background1");
            background1.z = 3;
            this.animatedBackgroundObjects = [];
            var FronMistLocation = PercentageGame.LevelTracker.GetBackgroundMistLastXPosition();
            var backMist1 = this.game.add.sprite(FronMistLocation.x, FronMistLocation.y, "blueMist");
            this.animatedBackgroundObjects.push(backMist1);
            var backMist2 = this.game.add.sprite(backMist1.position.x + backMist1.width - 0.2, FronMistLocation.y, "blueMist");
            this.animatedBackgroundObjects.push(backMist2);
            var background2 = this.game.add.sprite(0, 0, "background2");
            background2.z = 4;
            var background3 = this.game.add.sprite(0, 0, "background3");
            background3.z = 5;
            this.mathMan = PercentageGame.ObjectFactory.CreateMathMan(this.game, 200, 175, this);
            this.mathMan.z = 6;
            this.background.add(background3);
            this.background.add(background2);
            this.background.add(background1);
            this.background.add(backMist1);
            this.background.add(backMist2);
            this.background.add(backgroundTree);
            this.background.add(this.leafParticle);
            this.background.add(backgroundFront);
            this.background.add(backgroundTreeFront);
            this.background.add(this.mathMan);
            this.backgroundFromButtom = [background1, background2];
            this.backgroundFromTop = [backgroundTreeFront];
            this.backgroundFromRight = [];
            this.backgroundFromLeft = [];
            this.backgroundFromBottomNoDelay = [backgroundTree, this.mathMan, backgroundFront];
        };
        BaseLevel.prototype.setUpLeafParticle = function () {
            this.leafParticle = this.game.add.emitter(500, 0, 6);
            this.leafParticle.minParticleSpeed.setTo(-160, 265);
            this.leafParticle.maxParticleSpeed.setTo(-100, 280);
            this.leafParticle.minParticleScale = 0.4;
            this.leafParticle.maxParticleScale = 0.6;
            this.leafParticle.width = 1200;
            this.leafParticle.particleDrag.set(45, 185);
            this.leafParticle.maxRotation = -220;
            this.leafParticle.minRotation = 150;
            this.leafParticle.angularDrag = 65;
            this.leafParticle.makeParticles(["leaf2", "leaf1"]);
            this.leafParticle.flow(4000, 2300, 1, -1, false);
        };
        BaseLevel.prototype.GetSpawner = function () {
            return this.clickSpawner.children[0];
        };
        BaseLevel.prototype.GetAliveBlobs = function () {
            return this.clickSpawner.children[0].GetAliveBlobs();
        };
        BaseLevel.prototype.GetBaskets = function () {
            return this.baskets.children;
        };
        BaseLevel.prototype.GetBasketSprites = function () {
            return (this.baskets.children);
        };
        BaseLevel.prototype.DisableSpawning = function () {
            this.canSolveBaskets = false;
            this.GetSpawner().DisableSpawning();
        };
        BaseLevel.prototype.EnableSpawning = function () {
            this.canSolveBaskets = true;
            this.GetSpawner().EnableSpawning();
        };
        BaseLevel.prototype.CanSolveBaskets = function () {
            return this.canSolveBaskets;
        };
        BaseLevel.prototype.TrySolveBaskets = function () {
            if (!this.CanSolveBaskets())
                return;
            this.DisableSpawning();
            var baskets = this.GetBaskets();
            for (var i = 0; i < baskets.length; i++) {
                if (baskets.length > 1 && i + 1 < baskets.length) {
                    baskets[i].ChainBasket(baskets[i + 1]);
                }
            }
            baskets[0].SolveBasket();
        };
        BaseLevel.prototype.CheckForWinCondition = function () {
            var baskets = this.GetBaskets();
            var filledBaskets = new Array();
            for (var i = 0; i < baskets.length; i++) {
                if (baskets[i].BasketCorrectlyFilled()) {
                    filledBaskets.push(baskets[i]);
                }
            }
            if (filledBaskets.length == baskets.length) {
                this.slideBasketsAnimation(this.OnWin);
            }
            else {
                this.EnableSpawning();
            }
        };
        BaseLevel.prototype.OnWin = function () {
            PercentageGame.SaveHandler.SaveLevel(PercentageGame.LevelHandler.GetCurrentLevelIndex(), true);
            PercentageGame.LevelTracker.IncrementCompletedLevels();
            if (PercentageGame.LevelTracker.FiveLevelsCompleted() == true || (PercentageGame.LevelTracker.GetCurrentLevelIndex() + 1) % 5 == 0) {
                PercentageGame.LevelTracker.ResetLevelsCompleted();
                StartUp.mainGame.state.start("percentageLevelSelect");
                return;
            }
            var currentLvlIndex = PercentageGame.LevelHandler.GetCurrentLevelIndex();
            if ((currentLvlIndex + 1) < PercentageGame.LevelHandler.GetLevelInfoCollection().Levels.length) {
                var nextLvl = PercentageGame.LevelHandler.GetCurrentLevelIndex() + 1;
                PercentageGame.LevelTracker.SetCurrentLevelIndex(nextLvl);
                PercentageGame.LevelHandler.LoadLevel(nextLvl);
            }
            else {
                //console.log("Max level reached!");
            }
        };
        BaseLevel.prototype.buildWorldLevel = function (spritesToFadeIn, fromBottom, fromRight, fromLeft, fromAbove, fromBottomNoDelay) {
            var _this = this;
            var delayMod = 400;
            var reductionMod = 20;
            var reductionFactor = 0;
            var delay = 0;
            if (fromBottom) {
                fromBottom.forEach(function (sprite) {
                    var oldPos = sprite.position.y;
                    sprite.position.set(sprite.position.x, _this.game.height);
                    var spriteTween = sprite.game.add.tween(sprite).
                        to({ y: oldPos }, 1000, Phaser.Easing.Circular.Out, true, delay);
                    delay += delayMod - reductionFactor;
                    reductionFactor += reductionMod;
                });
            }
            delay += 1000;
            if (fromBottomNoDelay) {
                fromBottomNoDelay.forEach(function (sprite) {
                    var oldPos = sprite.position.y;
                    sprite.position.set(sprite.position.x, _this.game.height + 1000);
                    var spriteTween = sprite.game.add.tween(sprite).
                        to({ y: oldPos }, 1000, Phaser.Easing.Circular.Out, true, delay);
                });
            }
            delay += delayMod - reductionFactor;
            reductionFactor += reductionMod;
            if (fromAbove) {
                fromAbove.forEach(function (sprite) {
                    var oldPos = sprite.position.y;
                    sprite.position.set(sprite.position.x, -_this.game.height);
                    var spriteTween = sprite.game.add.tween(sprite).
                        to({ y: oldPos }, 1000, Phaser.Easing.Exponential.Out, true, delay);
                    delay += delayMod - reductionFactor;
                    reductionFactor += reductionMod;
                });
            }
            delay += delayMod - reductionFactor;
            reductionFactor += reductionMod;
            if (fromRight) {
                fromRight.forEach(function (sprite) {
                    var oldPos = sprite.position.x;
                    sprite.position.set(_this.game.width, sprite.position.y);
                    var spriteTween = sprite.game.add.tween(sprite).
                        to({ x: oldPos }, 1000, Phaser.Easing.Circular.Out, true, delay);
                    delay += delayMod - reductionFactor;
                    reductionFactor += reductionMod;
                });
            }
            delay += delayMod - reductionFactor;
            reductionFactor += reductionMod;
            if (fromLeft) {
                fromLeft.forEach(function (sprite) {
                    var oldPos = sprite.position.x;
                    sprite.position.set(-_this.game.width - sprite.width, sprite.position.y);
                    var spriteTween = sprite.game.add.tween(sprite).
                        to({ x: oldPos }, 1000, Phaser.Easing.Circular.Out, true, delay);
                    delay += delayMod - reductionFactor;
                    reductionFactor += reductionMod;
                });
            }
            delay += delayMod - reductionFactor;
            reductionFactor += reductionMod;
        };
        BaseLevel.prototype.slideBasketsAnimation = function (functionToRunOnComplete) {
            if (functionToRunOnComplete) {
                var blobsTween = this.blobs.game.add.tween(this.blobs).
                    to({ x: -1000 }, 1500, Phaser.Easing.Exponential.In, true, 1000);
                var basketsTween = this.baskets.game.add.tween(this.baskets).
                    to({ x: -1000 }, 1500, Phaser.Easing.Exponential.In, true, 1000).onComplete.addOnce(functionToRunOnComplete);
            }
            else {
                var blobsTween = this.blobs.game.add.tween(this.blobs).
                    to({ x: -1000 }, 1500, Phaser.Easing.Exponential.In, true, 1000);
                var basketsTween = this.baskets.game.add.tween(this.baskets).
                    to({ x: -1000 }, 1500, Phaser.Easing.Exponential.In, true, 1000);
            }
        };
        BaseLevel.prototype.shutdown = function () {
            this.background.removeAll(true);
            this.levelGUI.removeAll(true);
            this.clickSpawner.removeAll(true);
            this.blobs.removeAll(true);
            this.baskets.removeAll(true);
            this.basketFronts.removeAll(true);
            this.branches.removeAll(true);
            this.game.world.remove(this.background, true);
            this.game.world.remove(this.clickSpawner, true);
            this.game.world.remove(this.baskets, true);
            this.game.world.remove(this.blobs, true);
            this.game.world.remove(this.basketFronts, true);
            this.game.world.remove(this.branches, true);
            this.game.world.remove(this.levelGUI, true);
            this.game.world.removeAll(true);
            this.clickArea = null;
            this.levelInfo = null;
            this.physics.p2.reset();
        };
        return BaseLevel;
    }(Phaser.State));
    PercentageGame.BaseLevel = BaseLevel;
})(PercentageGame || (PercentageGame = {}));
var PercentageGame;
(function (PercentageGame) {
    var GameAssets = (function () {
        function GameAssets() {
        }
        return GameAssets;
    }());
    PercentageGame.GameAssets = GameAssets;
    var SpriteAsset = (function () {
        function SpriteAsset() {
        }
        return SpriteAsset;
    }());
    PercentageGame.SpriteAsset = SpriteAsset;
    var ColliderAsset = (function () {
        function ColliderAsset() {
        }
        return ColliderAsset;
    }());
    PercentageGame.ColliderAsset = ColliderAsset;
    var AudioAsset = (function () {
        function AudioAsset() {
        }
        return AudioAsset;
    }());
    PercentageGame.AudioAsset = AudioAsset;
    var SpriteSheetAsset = (function () {
        function SpriteSheetAsset() {
        }
        return SpriteSheetAsset;
    }());
    PercentageGame.SpriteSheetAsset = SpriteSheetAsset;
})(PercentageGame || (PercentageGame = {}));
var PercentageGame;
(function (PercentageGame) {
    var AssetHandler = (function () {
        function AssetHandler() {
        }
        AssetHandler.LoadJSONFromFile = function (game) {
            game.load.json("assetsJSON", "data/percentage/assets.json");
        };
        AssetHandler.ParseGameAssetsFromJSON = function (game) {
            this.GameAssets = game.cache.getJSON("assetsJSON");
        };
        AssetHandler.LoadAssetsIntoGame = function (game) {
            //Sprites
            for (var i = 0; i < this.GameAssets.spriteAssets.length; i++) {
                game.load.image(this.GameAssets.spriteAssets[i].key, this.GameAssets.spriteAssets[i].url);
            }
            //Colliders
            for (var i = 0; i < this.GameAssets.colliderAssets.length; i++) {
                game.load.physics(this.GameAssets.colliderAssets[i].key, this.GameAssets.colliderAssets[i].url);
            }
            //Audio
            for (var i = 0; i < this.GameAssets.audioAssets.length; i++) {
                game.load.audio(this.GameAssets.audioAssets[i].key, this.GameAssets.audioAssets[i].url);
            }
            //Spritesheets
            for (var i = 0; i < this.GameAssets.spritesheetAssets.length; i++) {
                if (this.GameAssets.spritesheetAssets[i].loadAllFrames) {
                    game.load.spritesheet(this.GameAssets.spritesheetAssets[i].key, this.GameAssets.spritesheetAssets[i].url, this.GameAssets.spritesheetAssets[i].frameWidth, this.GameAssets.spritesheetAssets[i].frameHeight, this.GameAssets.spritesheetAssets[i].framesTotal);
                }
                else {
                    game.load.spritesheet(this.GameAssets.spritesheetAssets[i].key, this.GameAssets.spritesheetAssets[i].url, this.GameAssets.spritesheetAssets[i].frameWidth, this.GameAssets.spritesheetAssets[i].frameHeight);
                }
            }
        };
        AssetHandler.GetGameAssets = function () {
            return this.GameAssets;
        };
        return AssetHandler;
    }());
    PercentageGame.AssetHandler = AssetHandler;
})(PercentageGame || (PercentageGame = {}));
var PercentageGame;
(function (PercentageGame) {
    var PreGameLoadState = (function (_super) {
        __extends(PreGameLoadState, _super);
        function PreGameLoadState() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PreGameLoadState.prototype.preload = function () {
            PercentageGame.LevelHandler.SetGame(this.game);
            PercentageGame.MusicHandler.SetGameReference(this.game);
            PercentageGame.SaveHandler.SetSaveDataItemPrefix("Percentage");
            PercentageGame.LevelHandler.LoadJSONFromFile();
            PercentageGame.AssetHandler.LoadJSONFromFile(this.game);
        };
        PreGameLoadState.prototype.create = function () {
            this.LoadAssets();
            LoadingScreen.CreateRandomLoadingScreen(this.game);
        };
        PreGameLoadState.prototype.LoadAssets = function () {
            PercentageGame.LevelHandler.SetLevelInfoFromCache();
            PercentageGame.AssetHandler.ParseGameAssetsFromJSON(this.game);
            this.game.load.onLoadComplete.addOnce(this.LoadAssetComplete, this);
            PercentageGame.AssetHandler.LoadAssetsIntoGame(this.game);
            this.game.load.start();
        };
        //Load Asset Complete
        PreGameLoadState.prototype.LoadAssetComplete = function () {
            if (!PercentageGame.SaveHandler.HasSaveData()) {
                PercentageGame.SaveHandler.CreateNewSaveData(PercentageGame.LevelHandler.GetLevelInfoCollection().Levels.length);
            }
            if (window.DebugLevelSkip != undefined) {
                if (window.DebugLevelSkip.skipLevel) {
                    PercentageGame.LevelHandler.LoadLevel(window.DebugLevelSkip.levelIndex);
                    return;
                }
            }
            this.game.state.start("percentageLevelSelect");
        };
        return PreGameLoadState;
    }(Phaser.State));
    PercentageGame.PreGameLoadState = PreGameLoadState;
})(PercentageGame || (PercentageGame = {}));
var PercentageGame;
(function (PercentageGame) {
    var Level = (function (_super) {
        __extends(Level, _super);
        function Level() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Level.prototype.CreateClickArea = function () {
            return new Phaser.Rectangle(0, 0, screen.width, screen.height * 0.25);
        };
        Level.prototype.PreloadOverride = function () {
        };
        Level.prototype.CreateOverride = function () {
        };
        Level.prototype.ApplyPhysicsSettings = function () {
            this.game.physics.p2.gravity.y = 200;
        };
        Level.prototype.UpdateOverride = function () {
        };
        Level.prototype.UpdateUIOverride = function () {
        };
        return Level;
    }(PercentageGame.BaseLevel));
    PercentageGame.Level = Level;
})(PercentageGame || (PercentageGame = {}));
var PercentageGame;
(function (PercentageGame) {
    var LevelSelect;
    (function (LevelSelect) {
        var LevelSelectButton = (function (_super) {
            __extends(LevelSelectButton, _super);
            function LevelSelectButton(game, x, y, width, height, key, lvlIndex, tileIndex) {
                var _this = _super.call(this, game, x, y, width, height, key) || this;
                _this.index = lvlIndex;
                _this.inputEnabled = true;
                _this.events.onInputDown.add(_this.OnButtonPress, _this);
                _this.events.onInputOver.add(_this.OnButtonHover, _this);
                _this.events.onInputOut.add(_this.OnButtonHoverEnd, _this);
                _this.tilePosition = new Phaser.Point(-width * tileIndex, 0);
                _this.btnText = _this.game.add.text(_this.width * 0.5, _this.height * 0.5, (_this.index + 1).toString(), {
                    font: "32px Amaranth",
                    fill: "#FFFFFF",
                    wordWrap: true,
                    wordWrapWidth: _this.width,
                    align: "center",
                });
                _this.btnText.anchor.set(0.5);
                _this.addChild(_this.btnText);
                return _this;
            }
            LevelSelectButton.prototype.OnButtonPress = function () {
                PercentageGame.LevelTracker.SetCurrentLevelIndex(this.index);
                //Do something level related here
                PercentageGame.LevelHandler.LoadLevel(this.index);
                return null;
            };
            LevelSelectButton.prototype.OnButtonHover = function () {
                this.tint = 0xD1D1D1;
                return null;
            };
            LevelSelectButton.prototype.OnButtonHoverEnd = function () {
                this.tint = 0xFFFFFF;
                return null;
            };
            return LevelSelectButton;
        }(Phaser.TileSprite));
        LevelSelect.LevelSelectButton = LevelSelectButton;
    })(LevelSelect = PercentageGame.LevelSelect || (PercentageGame.LevelSelect = {}));
})(PercentageGame || (PercentageGame = {}));
///<reference path="../../../../tsDefinitions/phaser.d.ts" /> 
var PercentageGame;
(function (PercentageGame) {
    var LevelSelect;
    (function (LevelSelect) {
        var LevelSelectState = (function (_super) {
            __extends(LevelSelectState, _super);
            function LevelSelectState() {
                var _this = _super.call(this) || this;
                _this.tweenDuration = 500;
                _this.currentSnippet = 0;
                return _this;
            }
            LevelSelectState.prototype.preload = function () {
            };
            LevelSelectState.prototype.create = function () {
                if (PercentageGame.MusicHandler.IsMusicPlaying()) {
                    PercentageGame.MusicHandler.StopMusic();
                }
                this.levelSelectBackground = this.game.add.sprite(0, 0, "levelSelectBackground");
                this.amountOfLevels = PercentageGame.LevelHandler.GetLevelInfoCollection().Levels.length;
                this.currentBars = new Array();
                this.bars = this.CreateButtonBars(5, 80, 80, 0);
                this.CreateArrowButtons();
                this.maxLevelPage = Math.floor(this.bars.length / 2) + ((this.bars.length % 2 > 0) ? 1 : 0);
                if ((LevelTracker.GetCurrentLevelIndex() + 1) % 10 == 0 && !LevelTracker.FiveLevelsCompleted()) {
                    if (LevelTracker.GetCurrentLevelIndex() >= PercentageGame.LevelHandler.GetLevelInfoCollection().Levels.length - 1) {
                        this.SetLevelPage(LevelTracker.GetCurrentLevelPage(), true, true);
                    }
                    else {
                        this.SetLevelPage((LevelTracker.GetCurrentLevelPage() + 1), true, true);
                    }
                    LevelTracker.ResetLevelsCompleted();
                }
                else if (LevelTracker.FiveLevelsCompleted() == true) {
                    this.SetLevelPage(LevelTracker.GetCurrentLevelPage(), true, true);
                    LevelTracker.ResetLevelsCompleted();
                }
                else {
                    this.SetLevelPage(LevelTracker.GetCurrentLevelPage(), true, true);
                }
                this.UpdateArrowButtons(false);
                PercentageGame.ObjectFactory.CreateBackButtonGameSelect(this.game, 50, this.game.height - 50);
            };
            LevelSelectState.prototype.CreateButtonBars = function (buttonsPerBar, buttonWidth, buttonHeight, buttonRightMargin) {
                this.fullBarWidth = buttonsPerBar * (buttonWidth + buttonRightMargin) - buttonRightMargin;
                //Figure out how many bars we need
                var amountOfBarsNeeded = Math.floor(this.amountOfLevels / 5) + ((this.amountOfLevels % 5 > 0) ? 1 : 0);
                //Create the bars array
                var tempBars = new Array();
                //Populate the empty bars array
                for (var i = 0; i < amountOfBarsNeeded; i++) {
                    tempBars[i] = this.game.add.group();
                }
                //Populate the groups in the bar array with button children
                var btnIndex = 0;
                var lvlSelectButton = null;
                for (var i = 0; i < amountOfBarsNeeded; i++) {
                    for (var k = 0; k < 5; k++) {
                        if (btnIndex < this.amountOfLevels) {
                            lvlSelectButton = null;
                            if (PercentageGame.SaveHandler.GetLevelData()[btnIndex].completed) {
                                lvlSelectButton = new LevelSelect.LevelSelectButton(this.game, 0, 0, buttonWidth, buttonHeight, this.GetButtonSnippetKey(false), btnIndex, k);
                            }
                            else {
                                lvlSelectButton = new LevelSelect.LevelSelectButton(this.game, 0, 0, buttonWidth, buttonHeight, this.GetButtonSnippetKey(true), btnIndex, k);
                            }
                            tempBars[i].add(lvlSelectButton);
                            btnIndex++;
                        }
                    }
                    tempBars[i].align(5, 1, buttonWidth + buttonRightMargin, buttonHeight);
                    this.AdvanceSnippet();
                }
                //Move the groups of bounds
                for (var i = 0; i < tempBars.length; i++) {
                    tempBars[i].position = new Phaser.Point(this.game.width, this.game.height * 0.5);
                }
                return tempBars;
            };
            LevelSelectState.prototype.GetButtonSnippetKey = function (grey) {
                if (!grey) {
                    return "snippet" + this.currentSnippet;
                }
                return "snippetGrey" + this.currentSnippet;
            };
            LevelSelectState.prototype.AdvanceSnippet = function () {
                this.currentSnippet++;
                if (this.currentSnippet >= 4) {
                    this.currentSnippet = 0;
                }
            };
            LevelSelectState.prototype.ResetSnippets = function () {
                this.currentSnippet = 0;
            };
            LevelSelectState.prototype.CreateArrowButtons = function () {
                var arrowButtonScreenMargin = 20;
                var arrowButtonWidth = 80;
                var arrowButtonHeight = 80;
                this.arrowButtonLeft = PercentageGame.ObjectFactory.CreateArrowButton(this.game, arrowButtonWidth + arrowButtonScreenMargin, this.game.height * 0.5, this.DecrementPage, this);
                this.arrowButtonLeft.anchor = new Phaser.Point(0.5, 0.5);
                this.arrowButtonLeft.angle = 180;
                this.arrowButtonRight = PercentageGame.ObjectFactory.CreateArrowButton(this.game, this.game.width - arrowButtonWidth - arrowButtonScreenMargin, this.game.height * 0.5, this.IncrementPage, this);
                this.arrowButtonRight.anchor = new Phaser.Point(0.5, 0.5);
            };
            LevelSelectState.prototype.UpdateArrowButtons = function (changingPage) {
                if (this.levelPage <= 0) {
                    this.arrowButtonLeft.Fade(false, !changingPage);
                }
                else {
                    if (this.arrowButtonLeft.visible == false) {
                        this.arrowButtonLeft.Fade(true, !changingPage);
                    }
                }
                if (this.IsAtTheEndOfLevelPage()) {
                    this.arrowButtonRight.Fade(false, !changingPage);
                }
                else {
                    if (this.arrowButtonRight.visible == false) {
                        this.arrowButtonRight.Fade(true, !changingPage);
                    }
                }
            };
            LevelSelectState.prototype.IncrementPage = function () {
                if (this.HasMoreThanOneLevelPage() && this.IsNotAtTheEndOfLevelPage()) {
                    this.SetLevelPage((this.levelPage + 1), true);
                }
            };
            LevelSelectState.prototype.DecrementPage = function () {
                if (this.levelPage > 0) {
                    this.SetLevelPage((this.levelPage - 1), false);
                }
            };
            LevelSelectState.prototype.SetLevelPage = function (index, incrementing, firstTime) {
                this.levelPage = index;
                LevelTracker.SetCurrentLevelPage(this.levelPage);
                if (firstTime == undefined) {
                    this.UpdateArrowButtons(true);
                    this.ExitTweenBars(incrementing);
                }
                this.EntryTweenBars(incrementing);
            };
            LevelSelectState.prototype.EntryTweenBars = function (incrementing) {
                //Reset current bars array
                this.currentBars = [];
                //If we're not at the start page, we need to add 1 to levelpage to get the correct set of pages.
                var topPageIndex = (this.levelPage > 0) ? 2 * this.levelPage : this.levelPage;
                var durationOfTween = this.tweenDuration;
                //Set top tween position
                var tweenPointTop = this.GetUpperGroupPosition(80, 80);
                //Position the bar depending on whether the page is incrementing or decrementing
                this.bars[topPageIndex].position = new Phaser.Point((incrementing == true) ? this.game.width : -this.fullBarWidth, tweenPointTop.y);
                //Add a tween from the current position to the tween top point position
                this.game.add.tween(this.bars[topPageIndex].position).to(tweenPointTop, durationOfTween, Phaser.Easing.Back.In).start();
                //Add the bar to the array of currently displayed bars
                this.currentBars.push(this.bars[topPageIndex]);
                //Is there another bar after the top bar?
                if (topPageIndex + 1 < this.bars.length) {
                    //Increment because we need the second row of bars
                    topPageIndex += 1;
                    //Set bottom tween position
                    var tweenPointBottom = this.GetLowerGroupPosition(80, 80);
                    //Position the bar depending on whether the page is incrementing or decrementing
                    this.bars[topPageIndex].position = new Phaser.Point((incrementing == true) ? this.game.width : -this.fullBarWidth, tweenPointBottom.y);
                    //Add a tween from the current position to the tween bottom point position
                    this.game.add.tween(this.bars[topPageIndex].position).to(tweenPointBottom, durationOfTween, Phaser.Easing.Back.In).start();
                    //Add the bar to the array of currently displayed bars
                    this.currentBars.push(this.bars[topPageIndex]);
                }
            };
            LevelSelectState.prototype.ExitTweenBars = function (incrementing) {
                //Set exit top point
                var tweenExitTop = this.GetUpperGroupPosition(80, 80);
                //Modify the x coordinate of exit top point depending on whether the page is incrementing or decrementing
                tweenExitTop.x = (incrementing == true) ? -this.fullBarWidth : this.game.width;
                //Add a tween from the current position (middle of screen) to the exit top point
                this.game.add.tween(this.currentBars[0].position).to(tweenExitTop, 450, Phaser.Easing.Back.In).start();
                //Is there another bar after the top bar?
                if (this.currentBars[1] != undefined) {
                    //Set exit bottom point
                    var tweenExitBottom = this.GetLowerGroupPosition(80, 80);
                    //Modify the x coordinate of exit bottom point depending on whether the page is incrementing or decrementing
                    tweenExitBottom.x = (incrementing == true) ? -this.fullBarWidth : this.game.width;
                    //Add a tween from the current position (middle of screen) to the exit bottom point
                    this.game.add.tween(this.currentBars[1].position).to(tweenExitBottom, 500, Phaser.Easing.Back.In).start();
                }
            };
            LevelSelectState.prototype.GetUpperGroupPosition = function (buttonWidth, buttonHeight) {
                return new Phaser.Point((this.game.width * 0.5) - (this.fullBarWidth * 0.5), 150);
            };
            LevelSelectState.prototype.GetLowerGroupPosition = function (buttonWidth, buttonHeight) {
                return new Phaser.Point((this.game.width * 0.5) - (this.fullBarWidth * 0.5), this.game.height - 150 - buttonHeight);
            };
            LevelSelectState.prototype.MaxPagesIsUnevenNumber = function () {
                return (this.maxLevelPage % 2 > 0) ? true : false;
            };
            LevelSelectState.prototype.IsAtTheEndOfLevelPage = function () {
                return (this.levelPage == this.maxLevelPage - 1);
            };
            LevelSelectState.prototype.HasMoreThanOneLevelPage = function () {
                return this.maxLevelPage != 1;
            };
            LevelSelectState.prototype.IsNotAtTheEndOfLevelPage = function () {
                return this.levelPage < this.maxLevelPage - 1;
            };
            LevelSelectState.prototype.shutdown = function () {
                this.currentSnippet = 0;
            };
            return LevelSelectState;
        }(Phaser.State));
        LevelSelect.LevelSelectState = LevelSelectState;
    })(LevelSelect = PercentageGame.LevelSelect || (PercentageGame.LevelSelect = {}));
    var LevelTracker = (function () {
        function LevelTracker() {
        }
        LevelTracker.IncrementCompletedLevels = function () {
            this.levelsCompletedInARow++;
        };
        LevelTracker.FiveLevelsCompleted = function () {
            return this.levelsCompletedInARow >= 5;
        };
        LevelTracker.ResetLevelsCompleted = function () {
            this.levelsCompletedInARow = 0;
        };
        LevelTracker.SetCurrentLevelPage = function (index) {
            this.lastLevelPage = index;
        };
        LevelTracker.GetCurrentLevelPage = function () {
            return this.lastLevelPage;
        };
        LevelTracker.SetCurrentLevelIndex = function (index) {
            this.lastLevelIndex = index;
        };
        LevelTracker.GetCurrentLevelIndex = function () {
            return this.lastLevelIndex;
        };
        LevelTracker.GetLevelsCompletedInARow = function () {
            return this.levelsCompletedInARow;
        };
        LevelTracker.SetBackgroundMistLastXPosition = function (position) {
            this.backgroundMistLastPosition = position;
        };
        LevelTracker.GetBackgroundMistLastXPosition = function () {
            if (this.backgroundMistLastPosition !== undefined)
                return this.backgroundMistLastPosition;
            else
                return new Phaser.Point(0, 0);
        };
        return LevelTracker;
    }());
    LevelTracker.levelsCompletedInARow = 0;
    LevelTracker.lastLevelPage = 0;
    LevelTracker.lastLevelIndex = 0;
    PercentageGame.LevelTracker = LevelTracker;
})(PercentageGame || (PercentageGame = {}));
var LoadingScreen = (function () {
    function LoadingScreen() {
    }
    LoadingScreen.CreateRandomLoadingScreen = function (game) {
        var randomScreenIndex = game.rnd.integerInRange(0, 1);
        var spriteToUse = null;
        var animationToPlay = null;
        game.add.sprite(0, 0, "levelSelectBackground");
        if (randomScreenIndex == 0) {
            spriteToUse = game.add.sprite(0, 0, "loadingScreen1");
            animationToPlay = spriteToUse.animations.add("loadingScreen1", undefined, 10, true);
        }
        else if (randomScreenIndex == 1) {
            spriteToUse = game.add.sprite(0, 0, "loadingScreen2");
            animationToPlay = spriteToUse.animations.add("loadingScreen2", undefined, 10, true);
        }
        spriteToUse.anchor = new Phaser.Point(0.5, 0.5);
        spriteToUse.position = new Phaser.Point(game.width * 0.5, game.height * 0.5);
        animationToPlay.play();
    };
    return LoadingScreen;
}());
var ClickHandler = (function () {
    function ClickHandler() {
    }
    ClickHandler.SetGame = function (game) {
        this.game = game;
    };
    ClickHandler.Init = function () {
        this.game.input.addMoveCallback(this.OnMouseMove, this);
        this.CreateCursor();
    };
    ClickHandler.CreateCursor = function () {
        this.cursor = this.game.add.sprite(this.game.width * 0.5, this.game.height * 0.5, "cursorNormal");
        this.game.world.bringToTop(this.cursor);
    };
    ClickHandler.CursorClick = function () {
    };
    ClickHandler.OnHover = function () {
    };
    ClickHandler.CursorRegular = function () {
    };
    ClickHandler.OnMouseMove = function (pointer, x, y, wasFromClick) {
        this.cursor.position.x = x;
        this.cursor.position.y = y;
    };
    ClickHandler.SetCurser = function (key) {
        this.cursor.key = key;
        this.cursor.loadTexture(this.cursor.key);
    };
    return ClickHandler;
}());
var StartUp = (function () {
    function StartUp() {
    }
    StartUp.Init = function () {
        StartUp.mainGame = new Phaser.Game(960, 540, Phaser.AUTO, "gameDiv");
        StartUp.mainGame.state.add("pregameLoad", new MainMenu.PreGameLoadState());
        StartUp.mainGame.state.add("gameSelect", new MainMenu.GameSelectState());
        StartUp.mainGame.state.add("functionPreGameLoad", new FunctionGame.PreGameLoadState());
        StartUp.mainGame.state.add("functionLevelSelect", new FunctionGame.LevelSelect.LevelSelectState());
        StartUp.mainGame.state.add("functionLevel", new FunctionGame.Level());
        StartUp.mainGame.state.add("percentagePreGameLoad", new PercentageGame.PreGameLoadState());
        StartUp.mainGame.state.add("percentageLevelSelect", new PercentageGame.LevelSelect.LevelSelectState());
        StartUp.mainGame.state.add("percentageLevel", new PercentageGame.Level());
        StartUp.mainGame.state.start("pregameLoad");
    };
    StartUp.InitMainMenu = function () {
        StartUp.mainGame.state.start("gameSelect");
    };
    StartUp.InitFunction = function () {
        StartUp.mainGame.state.start("functionPreGameLoad");
    };
    StartUp.InitPercentage = function () {
        StartUp.mainGame.state.start("percentagePreGameLoad");
    };
    StartUp.InitHierachy = function () {
        startGameOrderOrEquation(StartUp.mainGame, "order");
    };
    StartUp.InitEquation = function () {
        startGameOrderOrEquation(StartUp.mainGame, "equation");
    };
    return StartUp;
}());

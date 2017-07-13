var MathUtil = (function () {
    function MathUtil() {
    }
    MathUtil.IntGuarantee = function (numberToInt) {
        if (numberToInt % 1 != 0) {
            return MathUtil.MakeInt(numberToInt);
        }
        else {
            return numberToInt;
        }
    };
    MathUtil.MakeInt = function (numberToMakeInt) {
        return (Math.floor(numberToMakeInt));
    };
    return MathUtil;
}());
var List = (function () {
    function List() {
    }
    List.prototype.Add = function (newItem) {
        this.internalArray[this.internalArray.length] = newItem;
    };
    List.prototype.Remove = function (itemToRemove) {
        for (var i = 0; i < this.internalArray.length; i++) {
            if (this.internalArray[i] == itemToRemove) {
                this.internalArray[i] = null;
            }
        }
        this.ReformArray();
    };
    List.prototype.RemoveAtIndex = function (index) {
        index = MathUtil.IntGuarantee(index);
        if (this.internalArray.length >= index) {
            this.internalArray[index] = null;
        }
        this.ReformArray();
    };
    List.prototype.GetAtIndex = function (index) {
        index = MathUtil.IntGuarantee(index);
        return this.internalArray[index];
    };
    List.prototype.ReformArray = function () {
        var tempArray = new Array();
        var spotIndex = 0;
        //Want to make a new array with items assigned "back-to-back" with no holes but in order similar to the previous array
        for (var i = 0; i < this.internalArray.length; i++) {
            if (this.internalArray[i] != null) {
                tempArray[spotIndex] = this.internalArray[i];
                spotIndex++;
            }
        }
        this.internalArray = tempArray;
    };
    return List;
}());
var NormalizedPosition = (function () {
    function NormalizedPosition() {
    }
    NormalizedPosition.NormalToWorldPos = function (x, y, game) {
        var xCalc = x * game.scale.width;
        var yCalc = y * game.scale.height;
        return new Phaser.Point(xCalc, yCalc);
    };
    return NormalizedPosition;
}());
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
}(GameObject));
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
var BlobSpawner = (function (_super) {
    __extends(BlobSpawner, _super);
    function BlobSpawner(game, x, y, key, frame, blobType, objectToSpawnKey, blobGroup, killCollider, prewarmedAmount, optionalObjects) {
        var _this = _super.call(this, game, x, y, key, frame) || this;
        //Set defined or predefined pool amount
        var poolStartAmount = (prewarmedAmount == undefined) ? 15 : prewarmedAmount;
        _this.maxSpawnAmount = poolStartAmount;
        //Spawngroup related
        _this.objectToSpawnKey = objectToSpawnKey;
        _this.spawnGroup = blobGroup;
        //Warmup a bunch of objects to spawn
        _this.spawnGroup.classType = blobType;
        if (optionalObjects !== null || optionalObjects !== undefined) {
            for (var i = 0; i < poolStartAmount; i++) {
                var rndNumber = game.rnd.between(0, 1000);
                if (rndNumber >= 200) {
                    _this.spawnGroup.createMultiple(1, objectToSpawnKey);
                }
                else if (rndNumber <= 199 && rndNumber >= 100) {
                    _this.spawnGroup.createMultiple(1, optionalObjects[0]);
                }
                else if (rndNumber <= 99 && rndNumber >= 10) {
                    _this.spawnGroup.createMultiple(1, optionalObjects[1]);
                }
                else if (rndNumber <= 9) {
                    console.log("A wild Math Damon has appeared!");
                    _this.spawnGroup.createMultiple(1, optionalObjects[2]);
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
}(GameObject));
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
}(BlobSpawner));
var Basket = (function (_super) {
    __extends(Basket, _super);
    function Basket(game, x, y, key, frame, level) {
        var _this = _super.call(this, game, x, y, key, frame) || this;
        _this.blobs = new Array();
        _this.heldBlobs = new Array();
        _this.minDistanceToAlphaChange = 250;
        _this.distanceToMouse = 0;
        _this.percentageFromMinDistance = 0;
        _this.interpolationValues = [0, 0, 0.05, 0.1, 1];
        _this.lerpValue = 0;
        _this.show = true;
        _this.level = level;
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
            if (otherBody.sprite instanceof BlobObject) {
                this.heldBlobs.push(otherBody.sprite);
            }
        }
    };
    Basket.prototype.OnEndContact = function (otherBody, myBody, myShape, otherShape, equation) {
        if (myShape == this.triggerShape) {
            if (otherBody.sprite instanceof BlobObject) {
                var arrayIndex = this.heldBlobs.indexOf(otherBody.sprite);
                if (arrayIndex >= 0) {
                    this.heldBlobs.splice(arrayIndex, 1);
                }
                else {
                    console.log("One blob was not in array..");
                }
            }
        }
    };
    Basket.prototype.BasketCorrectlyFilled = function () {
        return (this.heldBlobs.length == this.goalValue);
    };
    Basket.prototype.ReportTotalBlobsHeld = function () {
        console.log(this.GetTotalBlobsHeld());
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
        this.percentageText = this.game.add.text(this.x, this.y + 100, this.currentBasketFrontText, { fill: color });
        this.percentageText.fontSize = LevelHandler.GetGlobalSettings().basketFontSize;
        this.percentageText.anchor = new Phaser.Point(0.5, 0.5);
        this.percentageText.angle = this.basketFront.angle;
        return this.basketFront;
    };
    Basket.prototype.GetBasketFront = function () {
        return this.basketFront;
    };
    //Solve Animation:
    Basket.prototype.SetBasketProg = function (basketToProg) {
        this.basketProg = basketToProg;
    };
    Basket.prototype.SetWinProg = function (winMethod) {
        this.winProg = winMethod;
    };
    Basket.prototype.SolveBasket = function () {
        this.IncrementLabelText();
        this.PlayLabelAnimation();
    };
    Basket.prototype.SolveNextBasket = function () {
        this.basketProg.SolveBasket();
    };
    Basket.prototype.PlayLabelAnimation = function () {
        this.percentageText.scale = new Phaser.Point(0, 0);
        this.game.add.tween(this.percentageText.scale).to({ x: 1, y: 1 }, LevelHandler.GetGlobalSettings().basketTextTweenTimeInMilliseconds, Phaser.Easing.Linear.None, true)
            .onComplete.addOnce(this.LabelAnimationTweenEnded, this);
    };
    Basket.prototype.LabelAnimationTweenEnded = function () {
        if (this.currentBasketFrontTextIndex < this.BasketFrontTexts.length - 1) {
            this.game.time.events.add(LevelHandler.GetGlobalSettings().nextBasketSolveWaitTimeInMilliseconds, this.SolveBasket, this);
        }
        else {
            if (this.winProg != undefined || this.winProg != null) {
                this.level.slideBasketsAnimation(newLevel.bind(this));
            }
            else {
                this.game.time.events.add(LevelHandler.GetGlobalSettings().nextBasketSolveWaitTimeInMilliseconds, this.SolveNextBasket, this);
            }
        }
        function newLevel(instance) {
            instance.game.time.events.add(LevelHandler.GetGlobalSettings().afterBasketSolveWaitTimeInMilliseconds, this.winProg, this);
        }
    };
    Basket.prototype.IncrementLabelText = function () {
        this.SetCurrentBasketFrontText(this.currentBasketFrontTextIndex + 1);
    };
    Basket.prototype.setTextPosition = function (x, y) {
        this.percentageText.position.set(x, y);
    };
    return Basket;
}(GameObject));
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
}(GameObject));
var Mathman = (function (_super) {
    __extends(Mathman, _super);
    function Mathman(game, x, y, key, frame) {
        return _super.call(this, game, x, y, key, frame) || this;
    }
    Mathman.prototype.Update = function () {
    };
    return Mathman;
}(GameObject));
var ObjectFactory = (function () {
    function ObjectFactory() {
    }
    ObjectFactory.CreateClickSpawner = function (game, x, y, spawnerKey, spawnObjectKey, clickArea, blobGroup, killCollider, blobAmount, blobType, optionalSpawnObjectKeys) {
        if (blobType == undefined || blobType == null) {
            blobType = BlobObject;
        }
        if (optionalSpawnObjectKeys == undefined || optionalSpawnObjectKeys == null) {
            optionalSpawnObjectKeys = [spawnObjectKey];
        }
        var newSpawner = new BlobSpawnerClick(game, x, y, spawnerKey, 0, blobType, spawnObjectKey, clickArea, blobGroup, killCollider, blobAmount, optionalSpawnObjectKeys);
        return newSpawner;
    };
    ObjectFactory.CreateBasket = function (basketInfo, level, game, basketFrontGroup) {
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
        var basket = new Basket(level.game, basketPosition.x, basketPosition.y, basketSpriteKey, 0, level);
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
        var branch = new Branch(game, branchPosition.x, branchPosition.y, branchSpriteKey, 0);
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
    ObjectFactory.CreateEvaluateButton = function (game, x, y, callBack, callBackContext, overFrame, outFrame, downFrame, upFrame) {
        return game.add.button(x, y, "playButton", callBack, callBackContext, overFrame, outFrame, downFrame, upFrame);
    };
    ObjectFactory.CreateKillCollider = function (game, x, y, width, height) {
        var tempKillCollider = new KillCollider(game, x, y, width, height);
        tempKillCollider.SetShape();
        game.add.existing(tempKillCollider);
        return tempKillCollider;
    };
    return ObjectFactory;
}());
var MusicHandler = (function () {
    function MusicHandler() {
    }
    MusicHandler.SetGameReference = function (gameRef) {
        this.gameReference = gameRef;
    };
    MusicHandler.AddMusic = function (audioKey, volume, loop) {
        this.audioObj = this.gameReference.add.audio(audioKey, volume, loop);
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
        this.audioObj.play();
    };
    MusicHandler.StopMusic = function () {
        this.audioObj.stop();
    };
    return MusicHandler;
}());
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
var LevelHandler = (function () {
    function LevelHandler() {
    }
    LevelHandler.SetGame = function (game) {
        this.Game = game;
    };
    LevelHandler.LoadJSONFromFile = function () {
        this.Game.load.json("levelsJSON", "data/levelObjectives.json");
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
        this.Game.state.start("level");
    };
    LevelHandler.GetCurrentLevelIndex = function () {
        return this.CurrentLevelIndex;
    };
    return LevelHandler;
}());
var LevelInfoCollection = (function () {
    function LevelInfoCollection() {
    }
    return LevelInfoCollection;
}());
var GlobalSettingsInfo = (function () {
    function GlobalSettingsInfo() {
    }
    return GlobalSettingsInfo;
}());
var LevelInfo = (function () {
    function LevelInfo() {
    }
    return LevelInfo;
}());
var SettingsInfo = (function () {
    function SettingsInfo() {
    }
    return SettingsInfo;
}());
var BranchInfo = (function () {
    function BranchInfo() {
    }
    return BranchInfo;
}());
var BasketInfo = (function () {
    function BasketInfo() {
    }
    return BasketInfo;
}());
var BaseLevel = (function (_super) {
    __extends(BaseLevel, _super);
    function BaseLevel() {
        var _this = _super.call(this) || this;
        _this.animatedBackgroundObjects = [];
        _this.backgroundFromButtom = [];
        _this.backgroundFromTop = [];
        _this.levelWon = false;
        _this.test = 0;
        return _this;
    }
    BaseLevel.prototype.preload = function () {
        this.UpdateLevelIndex();
        this.GetLevelInfo();
        this.clickArea = new Phaser.Rectangle(0, 0, this.levelInfo.Settings.clickAreaWidth, this.levelInfo.Settings.clickAreaHeight);
        this.AddGroups();
        this.PreloadOverride();
    };
    BaseLevel.prototype.create = function () {
        this.game.tweens.frameBased = false;
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.BuildLevel();
        this.ApplyPhysicsSettings();
        if (!MusicHandler.IsMusicPlaying()) {
            this.StartBackgroundMusic();
        }
        this.CreateOverride();
        this.levelWon = false;
    };
    BaseLevel.prototype.update = function () {
        var _this = this;
        if (!this.levelWon) {
            this.CheckForWinCondition();
        }
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
                    LevelTracker.SetBackgroundMistLastXPosition(_this.animatedBackgroundObjects[index_1].position);
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
        this.SpawnAmountText.text = " X " + (this.GetSpawner().GetMaxSpawnAmount() - this.GetSpawner().GetAliveBlobs().length).toString();
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
        this.levelIndex = LevelHandler.GetCurrentLevelIndex();
    };
    BaseLevel.prototype.GetLevelInfo = function () {
        this.levelInfo = LevelHandler.GetLevelInfo(this.levelIndex);
    };
    BaseLevel.prototype.AddGroups = function () {
        this.background = this.game.add.group();
        this.particles = this.game.add.group();
        this.clickSpawner = this.game.add.group();
        this.baskets = this.game.add.group();
        this.blobs = this.game.add.group();
        this.basketFronts = this.game.add.group();
        this.branches = this.game.add.group();
        this.levelGUI = this.game.add.group();
    };
    BaseLevel.prototype.StartBackgroundMusic = function () {
        var audioToPlay = (this.levelInfo.Settings.audio == "default") ? "mana" : this.levelInfo.Settings.audio;
        if (audioToPlay == "none")
            return;
        MusicHandler.AddMusic(audioToPlay, 0.25, true);
        //MusicHandler.PlayMusic();
    };
    BaseLevel.prototype.BuildLevel = function () {
        //Do something with misc info
        var backgrounds = this.BuildBackground();
        //Add Kill Colliders
        this.killCollider = ObjectFactory.CreateKillCollider(this.game, 480, 545, window.innerWidth, 30);
        //Add Click Spawner
        var spawner = ObjectFactory.CreateClickSpawner(this.game, -200, -200, "spawner", "blob", this.clickArea, this.blobs, this.killCollider, this.levelInfo.Settings.fruitAmount, BlobObject, ["fruit2", "fruit3", "fruit4"]);
        this.clickSpawner.add(spawner);
        var tempBranch;
        var tempBasket;
        //Create Baskets
        for (var i = 0; i < this.levelInfo.Baskets.length; i++) {
            tempBasket = ObjectFactory.CreateBasket(this.levelInfo.Baskets[i], this, this.game, this.basketFronts);
            this.baskets.add(tempBasket);
        }
        //Create Branches
        for (var i = 0; i < this.levelInfo.Branches.length; i++) {
            tempBranch = ObjectFactory.CreateBranch(this.levelInfo.Branches[i], this, this.game);
            this.branches.add(tempBranch);
        }
        //Create UI
        this.spawnAmountLeftIcon = this.game.add.sprite(55, 40, "blob");
        this.spawnAmountLeftIcon.alpha = 0.75;
        this.levelGUI.add(this.spawnAmountLeftIcon);
        this.SpawnAmountText = this.game.add.text(90, 52.5, "", { fill: "white" });
        this.levelGUI.add(this.SpawnAmountText);
        this.canSpawnIcon = this.game.add.sprite(0, 0, "blob");
        this.canSpawnIcon.anchor = new Phaser.Point(0.5, 0.5);
        this.canSpawnIcon.alpha = 0.5;
        this.cannotSpawnIcon = this.game.add.sprite(0, 0, "cannotSpawn");
        this.cannotSpawnIcon.anchor = new Phaser.Point(0.5, 0.5);
        this.cannotSpawnIcon.alpha = 0.5;
        this.levelGUI.add(this.canSpawnIcon);
        this.levelGUI.add(this.cannotSpawnIcon);
        // Slide the baskets into the playing field.
        this.baskets.position.set(1000, 0);
        var basketsTween = this.baskets.game.add.tween(this.baskets).
            to({ x: 0 }, 3500, Phaser.Easing.Exponential.Out, true);
        var lvlsInARow = LevelTracker.GetLevelsCompletedInARow();
        //Run the world build animation if player came from menu.
        if (lvlsInARow === 0) {
            this.buildWorldLevel(undefined, this.backgroundFromButtom, undefined, undefined, this.backgroundFromTop);
        }
    };
    BaseLevel.prototype.BuildBackground = function () {
        //let spriteKey =  "backgroundFront"; //(this.levelInfo.Settings.backgroundSpriteKey == "default") ? "background" : this.levelInfo.Settings.backgroundSpriteKey;  
        this.leafParticle = this.game.add.emitter(500, 0, 6);
        this.leafParticle.minParticleSpeed.setTo(-160, 265);
        this.leafParticle.maxParticleSpeed.setTo(-100, 280);
        this.leafParticle.minParticleScale = 0.2;
        this.leafParticle.maxParticleScale = 0.3;
        this.leafParticle.width = 1200;
        this.leafParticle.particleDrag.set(45, 185);
        this.leafParticle.maxRotation = -220;
        this.leafParticle.minRotation = 150;
        this.leafParticle.angularDrag = 65;
        this.leafParticle.makeParticles(["leaf2", "leaf1"]);
        this.leafParticle.flow(4000, 1300, 1, -1, true);
        var backgroundFront = this.game.add.sprite(0, 0, "backgroundFront");
        backgroundFront.z = 0;
        var backgroundTree = this.game.add.sprite(30, 111, "backgroundTree");
        backgroundTree.z = 1;
        var backgroundTreeFront = this.game.add.sprite(0, 0, "backgroundTreeFront");
        backgroundTree.z = 2;
        var background1 = this.game.add.sprite(0, 0, "background1");
        background1.z = 3;
        this.animatedBackgroundObjects = [];
        var FronMistLocation = LevelTracker.GetBackgroundMistLastXPosition();
        var backMist1 = this.game.add.sprite(FronMistLocation.x, FronMistLocation.y, "blueMist");
        this.animatedBackgroundObjects.push(backMist1);
        var backMist2 = this.game.add.sprite(backMist1.position.x + backMist1.width - 0.2, FronMistLocation.y, "blueMist");
        this.animatedBackgroundObjects.push(backMist2);
        var background2 = this.game.add.sprite(0, 0, "background2");
        background2.z = 4;
        var background3 = this.game.add.sprite(0, 0, "background3");
        background3.z = 5;
        var mathman = this.game.add.sprite(200, 205, "mathman");
        mathman.z = 6;
        this.background.add(background3);
        this.background.add(background2);
        this.background.add(background1);
        this.background.add(backMist1);
        this.background.add(backMist2);
        this.background.add(backgroundTree);
        this.background.add(backgroundFront);
        this.background.add(this.leafParticle);
        this.background.add(backgroundTreeFront);
        this.background.add(mathman);
        this.backgroundFromButtom = [backgroundFront, background1, background2];
        this.backgroundFromTop = [backgroundTree, backgroundTreeFront, mathman];
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
    BaseLevel.prototype.CheckForWinCondition = function () {
        //   let statusMessage : string = "Some baskets are not full";
        var filledBaskets = new Array();
        this.baskets.forEach(function (basket) {
            if (basket.BasketCorrectlyFilled()) {
                filledBaskets.push(basket);
            }
        }, this);
        if (filledBaskets.length == this.baskets.length) {
            //stop checking for victory conditions
            this.levelWon = true;
            this.DisableSpawning();
            this.time.events.add(LevelHandler.GetGlobalSettings().beforeBasketSolveWaitTimeInMilliseconds, this.SolveBaskets, this);
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
    BaseLevel.prototype.DisableSpawning = function () {
        this.GetSpawner().DisableSpawning();
    };
    BaseLevel.prototype.SolveBaskets = function () {
        var baskets = this.GetBaskets();
        //setup baskets for animation
        for (var i = 0; i < baskets.length; i++) {
            //There is another basket after this one
            if (i + 1 < baskets.length) {
                console.log("chained baskets");
                baskets[i].SetBasketProg(baskets[i + 1]);
            }
            else {
                console.log("set win prog");
                baskets[i].SetWinProg(this.OnWin);
            }
        }
        baskets[0].SolveBasket();
    };
    BaseLevel.prototype.OnWin = function () {
        LevelTracker.IncrementCompletedLevels();
        if (LevelTracker.FiveLevelsCompleted() == true || (LevelTracker.GetCurrentLevelIndex() + 1) % 5 == 0) {
            MusicHandler.StopMusic();
            this.game.state.start("levelSelect");
            return;
        }
        var currentLvlIndex = LevelHandler.GetCurrentLevelIndex();
        if ((currentLvlIndex + 1) < LevelHandler.GetLevelInfoCollection().Levels.length) {
            var nextLvl = LevelHandler.GetCurrentLevelIndex() + 1;
            LevelTracker.SetCurrentLevelIndex(nextLvl);
            LevelHandler.LoadLevel(nextLvl);
        }
        else {
            console.log("Max level reached!");
        }
    };
    BaseLevel.prototype.buildWorldLevel = function (spritesToFadeIn, spritesToBuildFromBottom, spritesToBuildFromRight, spritesToBuildFromLeft, spritesToBuildFromAbove) {
        var _this = this;
        var delayMod = 400;
        var reductionMod = 20;
        var reductionFactor = 0;
        var delay = 0;
        if (spritesToBuildFromBottom) {
            spritesToBuildFromBottom.forEach(function (sprite) {
                var oldPos = sprite.position.y;
                sprite.position.set(sprite.position.x, _this.game.height);
                var spriteTween = sprite.game.add.tween(sprite).
                    to({ y: oldPos }, 300, Phaser.Easing.Circular.Out, true, delay);
                delay += delayMod - reductionFactor;
                reductionFactor += reductionMod;
            });
        }
        delay += delayMod - reductionFactor;
        reductionFactor += reductionMod;
        if (spritesToBuildFromRight) {
            spritesToBuildFromRight.forEach(function (sprite) {
                var oldPos = sprite.position.x;
                sprite.position.set(_this.game.width, sprite.position.y);
                var spriteTween = sprite.game.add.tween(sprite).
                    to({ x: oldPos }, 300, Phaser.Easing.Circular.Out, true, delay);
                delay += delayMod - reductionFactor;
                reductionFactor += reductionMod;
            });
        }
        delay += delayMod - reductionFactor;
        reductionFactor += reductionMod;
        if (spritesToBuildFromLeft) {
            spritesToBuildFromLeft.forEach(function (sprite) {
                var oldPos = sprite.position.x;
                sprite.position.set(-_this.game.width - sprite.width, sprite.position.y);
                var spriteTween = sprite.game.add.tween(sprite).
                    to({ x: oldPos }, 300, Phaser.Easing.Circular.Out, true, delay);
                delay += delayMod - reductionFactor;
                reductionFactor += reductionMod;
            });
        }
        delay += delayMod - reductionFactor;
        reductionFactor += reductionMod;
        if (spritesToBuildFromAbove) {
            spritesToBuildFromAbove.forEach(function (sprite) {
                var oldPos = sprite.position.y;
                sprite.position.set(sprite.position.x, -_this.game.height);
                var spriteTween = sprite.game.add.tween(sprite).
                    to({ y: oldPos }, 2500, Phaser.Easing.Exponential.Out, true);
                /*
                delay += delayMod - reductionFactor;
                reductionFactor += reductionMod;
                */
            });
        }
    };
    BaseLevel.prototype.slideBasketsAnimation = function (functionToRunOnComplete) {
        if (functionToRunOnComplete) {
            var blobsTween = this.blobs.game.add.tween(this.blobs).
                to({ x: -1000 }, 1000, Phaser.Easing.Circular.Out, true, 1000);
            var basketsTween = this.baskets.game.add.tween(this.baskets).
                to({ x: -1000 }, 1000, Phaser.Easing.Circular.Out, true, 1000).onComplete.addOnce(functionToRunOnComplete);
        }
        else {
            var blobsTween = this.blobs.game.add.tween(this.blobs).
                to({ x: -1000 }, 1000, Phaser.Easing.Circular.Out, true, 1000);
            var basketsTween = this.baskets.game.add.tween(this.baskets).
                to({ x: -1000 }, 1000, Phaser.Easing.Circular.Out, true, 1000);
        }
    };
    return BaseLevel;
}(Phaser.State));
var GameAssets = (function () {
    function GameAssets() {
    }
    return GameAssets;
}());
var SpriteAsset = (function () {
    function SpriteAsset() {
    }
    return SpriteAsset;
}());
var ColliderAsset = (function () {
    function ColliderAsset() {
    }
    return ColliderAsset;
}());
var AudioAsset = (function () {
    function AudioAsset() {
    }
    return AudioAsset;
}());
var SpriteSheetAsset = (function () {
    function SpriteSheetAsset() {
    }
    return SpriteSheetAsset;
}());
var AssetHandler = (function () {
    function AssetHandler() {
    }
    AssetHandler.LoadJSONFromFile = function (game) {
        game.load.json("assetsJSON", "data/assets.json");
    };
    AssetHandler.SetGameAssetsFromCache = function (game) {
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
        for (var i = 0; i < this.GameAssets.spriteSheetAssets.length; i++) {
            if (this.GameAssets.spriteSheetAssets[i].loadAllFrames) {
                game.load.spritesheet(this.GameAssets.spriteSheetAssets[i].key, this.GameAssets.spriteSheetAssets[i].url, this.GameAssets.spriteSheetAssets[i].frameWidth, this.GameAssets.spriteSheetAssets[i].frameHeight, this.GameAssets.spriteSheetAssets[i].framesTotal);
            }
            else {
                game.load.spritesheet(this.GameAssets.spriteSheetAssets[i].key, this.GameAssets.spriteSheetAssets[i].url, this.GameAssets.spriteSheetAssets[i].frameWidth, this.GameAssets.spriteSheetAssets[i].frameHeight);
            }
        }
    };
    AssetHandler.GetGameAssets = function () {
        return this.GameAssets;
    };
    return AssetHandler;
}());
var PreGameLoadState = (function (_super) {
    __extends(PreGameLoadState, _super);
    function PreGameLoadState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PreGameLoadState.prototype.create = function () {
        //   this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        LevelHandler.SetGame(this.game);
        this.StartJSONLoad();
    };
    //Load JSON
    PreGameLoadState.prototype.StartJSONLoad = function () {
        this.game.load.onLoadComplete.addOnce(this.LoadJSONComplete, this);
        LevelHandler.LoadJSONFromFile();
        AssetHandler.LoadJSONFromFile(this.game);
        this.game.load.start();
    };
    //JSON Load Complete
    PreGameLoadState.prototype.LoadJSONComplete = function () {
        LevelHandler.SetLevelInfoFromCache();
        AssetHandler.SetGameAssetsFromCache(this.game);
        this.StartAssetLoad();
    };
    //Load Asset
    PreGameLoadState.prototype.StartAssetLoad = function () {
        this.game.load.onLoadComplete.addOnce(this.LoadAssetComplete, this);
        AssetHandler.LoadAssetsIntoGame(this.game);
        this.game.load.start();
    };
    //Load Asset Complete
    PreGameLoadState.prototype.LoadAssetComplete = function () {
        this.game.state.start("levelSelect");
    };
    return PreGameLoadState;
}(Phaser.State));
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
}(BaseLevel));
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
            _this.btnText = _this.game.add.text(_this.width * 0.5, _this.height * 0.5, (_this.index + 1).toString(), { font: "32px Arial",
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
            LevelTracker.SetCurrentLevelIndex(this.index);
            //Do something level related here
            LevelHandler.LoadLevel(this.index);
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
})(LevelSelect || (LevelSelect = {}));
///<reference path="../../../tsDefinitions/phaser.d.ts" /> 
var LevelSelect;
(function (LevelSelect) {
    var LevelSelectState = (function (_super) {
        __extends(LevelSelectState, _super);
        function LevelSelectState() {
            var _this = _super.call(this) || this;
            _this.tweenDuration = 500;
            return _this;
        }
        LevelSelectState.prototype.preload = function () {
        };
        LevelSelectState.prototype.create = function () {
            this.amountOfLevels = LevelHandler.GetLevelInfoCollection().Levels.length;
            this.currentBars = new Array();
            this.bars = this.CreateButtonBars(5, 80, 80, 0);
            this.CreateArrowButtons();
            this.maxLevelPage = Math.floor(this.bars.length / 2) + ((this.bars.length % 2 > 0) ? 1 : 0);
            if ((LevelTracker.GetCurrentLevelIndex() + 1) % 10 == 0) {
                if (LevelTracker.GetCurrentLevelIndex() >= LevelHandler.GetLevelInfoCollection().Levels.length - 1) {
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
                this.SetLevelPage(0, true, true);
            }
            this.UpdateArrowButtons();
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
            for (var i = 0; i < amountOfBarsNeeded; i++) {
                for (var k = 0; k < 5; k++) {
                    if (btnIndex < this.amountOfLevels) {
                        tempBars[i].add(new LevelSelect.LevelSelectButton(this.game, 0, 0, buttonWidth, buttonHeight, "buttonBackground", btnIndex, k));
                        btnIndex++;
                    }
                }
                tempBars[i].align(5, 1, buttonWidth + buttonRightMargin, buttonHeight);
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
            this.arrowButtonLeft = this.game.add.button(arrowButtonWidth + arrowButtonScreenMargin, this.game.height * 0.5, "buttonArrowTest", this.DecrementPage, this);
            this.arrowButtonLeft.anchor = new Phaser.Point(0.5, 0.5);
            this.arrowButtonLeft.angle = 180;
            this.arrowButtonRight = this.game.add.button(this.game.width - arrowButtonWidth - arrowButtonScreenMargin, this.game.height * 0.5, "buttonArrowTest", this.IncrementPage, this);
            this.arrowButtonRight.anchor = new Phaser.Point(0.5, 0.5);
        };
        LevelSelectState.prototype.UpdateArrowButtons = function () {
            if (this.levelPage <= 0) {
                this.arrowButtonLeft.visible = false;
            }
            else {
                if (this.arrowButtonLeft.visible == false) {
                    this.arrowButtonLeft.visible = true;
                }
            }
            if (this.IsAtTheEndOfLevelPage()) {
                this.arrowButtonRight.visible = false;
            }
            else {
                if (this.arrowButtonRight.visible == false) {
                    this.arrowButtonRight.visible = true;
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
            this.UpdateArrowButtons();
            if (firstTime == undefined) {
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
                //We don't need a second row of bars at the end page if there is not enough bars for a second row
                if (this.maxLevelPage > 1 && this.IsAtTheEndOfLevelPage() && this.MaxPagesIsUnevenNumber()) {
                    return;
                }
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
        return LevelSelectState;
    }(Phaser.State));
    LevelSelect.LevelSelectState = LevelSelectState;
})(LevelSelect || (LevelSelect = {}));
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
    LevelTracker.levelsCompletedInARow = 0;
    LevelTracker.lastLevelPage = 0;
    LevelTracker.lastLevelIndex = 0;
    return LevelTracker;
}());
var StartUp = (function () {
    function StartUp() {
    }
    StartUp.Init = function () {
        StartUp.mainGame = new Phaser.Game(960, 540, Phaser.AUTO, "gameDiv");
        //  StartUp.mainGame = new Phaser.Game(window.innerWidth * window.devicePixelRatio,
        //                                    window.innerHeight * window.devicePixelRatio, Phaser.AUTO, "gameDiv");
        MusicHandler.SetGameReference(StartUp.mainGame);
        StartUp.mainState = new PreGameLoadState();
        StartUp.mainGame.state.add("pregameLoad", StartUp.mainState);
        StartUp.mainGame.state.add("levelSelect", new LevelSelect.LevelSelectState());
        StartUp.mainGame.state.add("level", new Level());
        StartUp.mainGame.state.start("pregameLoad");
    };
    return StartUp;
}());
//# sourceMappingURL=game.js.map
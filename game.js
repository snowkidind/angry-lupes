var canvas = document.getElementById("game");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.addEventListener("mousedown", onClickStart, false);
canvas.addEventListener("mouseup", onClickEnd, false);
canvas.addEventListener("touchstart", onTouchStart, false);
canvas.addEventListener("touchend", onTouchEnd, false);
document.ontouchmove = function(e){ e.preventDefault();}

var ready = false;
var reset = false;
var ctx = canvas.getContext;

var impulseText = "No es safu?";

console.log(canvas.width,canvas.height );

var world = boxbox.createWorld(canvas);

var width = world.worldPositionAt(canvas.width,canvas.height).x;
var height = world.worldPositionAt(canvas.width,canvas.height).y;


//image is 200px
var worldImgSizeX = world.worldPositionAt(150,150).x;
var worldImgSizeY = world.worldPositionAt(150,150).y;
var clickRange = 100;

setTimeout(function(){
    ready = true;
    createElements();
    }, 3000);


var lupe;
var ground;
var wall;
var leftWall;
var blockA;
var blockB;
var blockC;
var wojack;

// has to hit the number of objects on board
var hits = [];
var radius = 2;

// how many tries the player has left
var trys;

var score = 0;
var displayScore = 0;

var aspectRatio =  width *.8;

splash = world.createEntity({
    name: "splash",

    width:  aspectRatio,
    height: aspectRatio * .275,
    color: "rgba(0,100,0,.5)",
    shape: "square",
    type: "static",
    density: 1,
    image: "textures/LupesBirds.png",
    imageStretchToFit: true

});

function createElements(){

    if (typeof (splash) !== undefined){
       splash.destroy();
    }

    ground = world.createEntity({
        name: "ground",
        shape: "square",
        type: "static",
        color: random_rgb(),
        width: width,
        height: height / 10 *2,
        x: width / 2,
        y: height / 10 * 8
    });

    newLupe();

    wall = world.createEntity({
        name: "rightWall",
        shape: "square",
        type: "static",
        color: "rgb(0,100,0)",
        width: width / 10 * .01,
        height: height,
        x: width / 10 * 10.1
        //
    });

    leftWall = world.createEntity({
        name: "rightWall",
        shape: "square",
        type: "static",
        color: "rgb(0,100,0)",
        width: width / 10 * .01,
        height: height,
        x: -1
        //
    });

    var block = {
        name: "block",
        shape: "square",
        color: "brown",
        width: .5,
        height: 4
    };

    if (blockA) blockA.destroy();

    blockA = world.createEntity(block, {
        x: width / 10 * 6.5,
        y: height / 10 * 3,
        width: width / 10 * .25,
        height:  width / 10 * 2,
        restitution:.01,
        onImpact: function(entity, force) {
            if (entity.name() === "player") {

                if(hits.indexOf("blockA") === -1){
                    hits.push('blockA');
                    levelComplete();
                }

                this.color("black");
            }
        }
    });

    if (blockB) blockB.destroy();
    blockB = world.createEntity(block, {
        x: width / 10 * 7.5,
        y: height / 10 * 3,
        width: width / 10 * .25,
        height:  width / 10 * 2,
        restitution:.01,
        onImpact: function(entity, force) {
            if (entity.name() === "player") {


                if(hits.indexOf("blockB") === -1){
                    hits.push('blockB');
                    levelComplete();
                }
                this.color("black");
            }
        }
    });

    if (blockC) blockC.destroy();
    blockC = world.createEntity(block, {
        x: width / 10 * 7,
        y: 1,
        width: width / 10 * 2.5,
        height: 1,
        restitution:.01,
        onImpact: function(entity, force) {
            if (entity.name() === "player") {


                if(hits.indexOf("blockC") === -1){
                    hits.push('blockC');
                    levelComplete();
                }
                this.color("black");
            }
        }
    });

    if (wojack) wojack.destroy();

    wojack = world.createEntity( {
        name: "block",
        image: "textures/wojack200.png",
        x: wjAlt(),
        y: 1,
        restitution:.01,
        shape: "circle",
        radius:radius,
        imageStretchToFit: true,

        onImpact: function(entity, force) {

            if (entity.name() === "player") {

                this.image('textures/wj.png');
                if(hits.indexOf("wojack") === -1){
                    console.log("Force: " + force.toFixed(0));
                    hits.push('wojack');
                    if (force.toFixed(0) > 50){
                        hits.push('bonus');
                    }
                    if (force.toFixed(0) > 100){
                        hits.push('bonus');
                    }
                    if (force.toFixed(0) > 200){
                        hits.push('bonus');
                    }
                    if (force.toFixed(0) > 500){
                        hits.push('bonus');
                    }
                    if (force.toFixed(0) > 750){
                        hits.push('bonus');
                        hits.push('bonus');
                        hits.push('bonus');
                    }

                }
                levelComplete();
            }
            else if (entity.name() === "block"){

                // if (force.toFixed(0) > 250){
                //     this.image('textures/wj.png');
                //
                //     if(hits.indexOf("wojack") === -1){
                //         hits.push('wojack');
                //         levelComplete();
                //     }
                // }
            }
        }
    });
}



function newLupe(){

    var balls = [
        'textures/bogandoff.png',
        'textures/elon.png',
        'textures/cz.png',
        'textures/avocado.png',
        'textures/barack.png',
        'textures/vb.png',
        'textures/satoshi.png',
        'textures/bernie.png',
        'textures/chickn.png'];

    var random = Math.floor(Math.random() * balls.length);

    if (lupe) lupe.destroy();

    lupe = world.createEntity({
        name: "player",
        x: width / 10 * 2,
        color: "rgba(0,100,0,.5)",
        shape: "circle",
        radius: radius,
        density: 1,
        image: balls[random],
        restitution:.25,
        friction: 10,
        imageStretchToFit: true

    });
}


var tokens = [];

function token(){

    setTimeout(function(){

        var random = Math.floor(Math.random() * width);

        var thisToken = world.createEntity({
            image: "textures/lupeToken200.png",
            name: 'thisToken',
            shape: "circle",
            imageStretchToFit: true,
            radius: 1,
            x: random,
            y: 0,
            width: width / 10 * .25,
            height:  width / 10 * 2,
            restitution:.5,
            density: 2

        });
        tokens.push(thisToken);

        setTimeout(function(){
            tokens.forEach(function(token){
                token.destroy();
            })
        }, 2500)
    }, 200);

}


// weak attempt at shuffling it up...
var wjAlternate = 0;
function wjAlt(){
    if(wjAlternate === 0){
        wjAlternate = 1;
        return width / 10 * 9;
    }
    else {
        wjAlternate = 0;
        return width / 10 * 7
    }
}



function levelComplete(){

    var thisScore = 0;
    var A, B, C, D = false;
    var E = 0;

    hits.forEach(function(hit){

        if (hit === "blockA"){
            A = true;
        }
        if (hit === "blockB"){
            B = true;
        }
        if (hit === "blockC"){
            C = true;
        }
        if (hit === "wojack"){
            D = true;
        }
        if (hit === "bonus"){
            E += 1;
        }
    });

    if (A) thisScore += 1;
    if (B) thisScore += 1;
    if (C) thisScore += 1;
    if (D) thisScore += 4;
    if (E > 0) thisScore *= E;




    if (D){

        if (!reset){
            reset = true;

            console.log("Bonus Earned: " + E + "x");

            if (E === 0) impulseText = "es safu now!"; // fsr this no worky
            else impulseText = "Bonus: " + E + "x";

            // world.gravity({x:1, y:10});

            // some sort of fireworks / lupe coins
            for (var i = 0; i < thisScore; i ++){
                // store token objects in mem
                //
                token();

            }

            setTimeout(function(){
                // world.gravity({x:0, y:10});
                impulseText = "no es safu?";
                newGame();

            }, 3000);

            hits = [];
            console.log("Win!!");
            score += thisScore;
        }
        //else if ()

    }
    else {
        impulseText = "es more Safu..";
    }

    displayScore = score + thisScore;
}



var lupeSelect = {active:false};

function onTouchStart(e) {

    stopped = false;
    var touches = e.changedTouches;
    for(var i=0; i < e.changedTouches.length; i++) {
        var touchId = e.changedTouches[i].identifier;
        var x       = e.changedTouches[i].pageX;
        var y       = e.changedTouches[i].pageY;

        if (test(lupe, {x:x, y:y}) === 1){
            console.log("Lupe selected");
            lupeSelect = {x:x, y:y, active:true};
        }
        else {

            lupeSelect = {active:false};

            // Next...
            if (e.pageX > canvas.width / 10 * 8 &&
                e.pageY > canvas.height / 10 * 7 &&
                e.pageY < canvas.height / 10 * 8){
                newHead();
            }
            // Reset...
            else if (e.pageX > canvas.width / 10 * 8 &&
                e.pageY > canvas.height / 10 * 8 &&
                e.pageY < canvas.height / 10 * 9){
                score = 0;
                newGame();
            }
        }
    }
}

function onTouchEnd(e) {

    var touches = e.changedTouches;
    for(var i=0; i < e.changedTouches.length; i++) {
        var touchId = e.changedTouches[i].identifier;
        var x       = e.changedTouches[i].pageX;
        var y       = e.changedTouches[i].pageY;

        if (lupeSelect.active){

            var distanceX = Math.abs(x - lupeSelect.x);
            var distanceY = Math.abs(y - lupeSelect.y);

            var deltaX = x - lupeSelect.x;
            var deltaY = y - lupeSelect.y;
            var rad = Math.atan2(deltaY,deltaX);
            var angle = rad * (180 / Math.PI);

            if (distanceX > distanceY){
                lupe.applyImpulse(Math.abs(distanceX) * 2.5, angle - 90);
                //impulseText = Math.abs(distanceX) * 2.5;
            }
            else {
                lupe.applyImpulse(Math.abs(distanceY) * 2.5, angle - 90);
                //impulseText = Math.abs(distanceY) * 2.5;
            }

            lupeSelect = { active:false };
        }
    }
}

function onClickStart(e) {

    stopped = false;
    if (test(lupe, {x:e.pageX, y:e.pageY}) === 1){
        console.log("Lupe clicked");
        lupeSelect = {x:e.pageX, y:e.pageY, active:true};
    }
    else {
        lupeSelect = {active:false};

        // Next...
        if (e.pageX > canvas.width / 10 * 8 &&
            e.pageY > canvas.height / 10 * 7 &&
            e.pageY < canvas.height / 10 * 8){
            newHead();
        }
        // Reset...
        else if (e.pageX > canvas.width / 10 * 8 &&
            e.pageY > canvas.height / 10 * 8 &&
            e.pageY < canvas.height / 10 * 9){
            score = 0;
            displayScore = 0;
            newGame();
        }
    }
}


function onClickEnd(e){

    var x = e.pageX;
    var y = e.pageY;

    if (lupeSelect.active){

        var distanceX = Math.abs(x - lupeSelect.x);
        var distanceY = Math.abs(y - lupeSelect.y);

        var deltaX = x - lupeSelect.x;
        var deltaY = y - lupeSelect.y;
        var rad = Math.atan2(deltaY,deltaX);
        var angle = rad * (180 / Math.PI);

        if (distanceX > distanceY){
            lupe.applyImpulse(Math.abs(distanceX) * 2.5, angle - 90);
            //impulseText = Math.abs(distanceX) * 2.5;
        }
        else {
            lupe.applyImpulse(Math.abs(distanceY) * 2.5, angle - 90);
            //impulseText = Math.abs(distanceY) * 2.5;
        }

        lupeSelect = { active:false };
    }

}

function test(sprite, e){


    var spritePos = world.canvasPositionAt(lupe.position().x, lupe.position().y);
    var touch = e;
    var spriteSize = clickRange;

    var rangeX = 0;
    var rangeY = 0;

    if (touch.x >= spritePos.x - spriteSize/2 && touch.x <= spritePos.x + spriteSize/2){
        rangeX = 1;
    }
    if (touch.y >= spritePos.y - spriteSize/2 && touch.y <= spritePos.y + spriteSize/2){
        rangeY = 1;
    }
    if (rangeX === 1 && rangeY === 1){
        return 1;
    }
    else return 0;
}

function destroyElements(){
    lupe.destroy();
    wall.destroy();
    leftWall.destroy();
    blockA.destroy();
    blockB.destroy();
    blockC.destroy();
    wojack.destroy();

}

function newHead(){
    // remove old lupe
    lupe.destroy();
    // make new lupe
    newLupe();
}

function newGame(){
    destroyElements();
    reset = false;
    createElements();
}

var chummy;
var lastPos;
var range = .02;

var stopped = false;

world.onRender(function(ctx){

    if (ready) {
        var lp = lupe.position();

        if (typeof(lastPos) !== 'undefined') {

            var diffX = Math.abs(lp.x - lastPos.x);
            var diffY = Math.abs(lp.y - lastPos.y);

            // if lupe moves inside of stop range
            if (diffX < range && diffY < range) {

                if (!stopped) {
                    // turn over
                    console.log("stopped");
                    stopped = true; // is reset on click or touch

                    // lupe.setVelocity("lupe",0,0);
                    // lupe.setForce("lupe",0,0);
                    // lupe.stopRotation();
                    // console.log(lp.x, lp.y);

                    // lupe.position({x:lp.x, y:lp.y});
                }
            }
            // if lupe was stopped and started moving again
            else if (stopped === true && diffX > range && diffY > range) {
                console.log("started");
                stopped = false;

                // lupe.clearVelocity("lupe");
                //lupe.clearForce("lupe");
            }
        }

        lastPos = lupe.position();

        var zero = 0.00000001;
        if (lp.x > width || lp.x < 0) {
            // console.log("Out Of X Bounds...");
            newGame()

        }
        else if (lp.y > height || lp.y < 0) {
            // out of y bounds is legal
            // console.log("Out Of Y Bounds...");
        }
        // else if (1){
        //
        //     console.log(lp.y);
        //     var diff = Math.abs(lp.y);
        //     var cam = world.camera();
        //     world.camera({x:cam.x, y:lp.y - width / 2});
        // }
        // else if (lp.y.toFixed(5) > 0.0.toFixed(5)){
        //     world.camera({x:0, y:0});
        // }

        if (lupeSelect.active) {
            if (!chummy) {
                chummy = world.createEntity({
                    name: "player",
                    x: width / 10,
                    y: height / 10 * 8,
                    type: "static",
                    color: "rgb(0,100,0)",
                    shape: "square",
                    width: worldImgSizeX / 2,
                    height: worldImgSizeY / 2,
                    image: "textures/chummy.png",

                    // imageStretchToFit: true,
                    density: 1
                });
            }
        }
        else {
            if (typeof(chummy) === "object") {
                chummy.destroy();
                chummy = '';
            }
        }

        ctx.font = "30px Verdana";
        var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop("0", "magenta");
        gradient.addColorStop("0.5", "blue");
        gradient.addColorStop("1.0", "red");


        ctx.fillStyle = gradient;
        ctx.fillText(impulseText, canvas.width / 10 * 2, canvas.height / 10 * 8);


        ctx.fillStyle = gradient;
        ctx.fillText("Next...", canvas.width / 10 * 8, canvas.height / 10 * 7.7);

        ctx.fillStyle = gradient;
        ctx.fillText("Reset...", canvas.width / 10 * 8, canvas.height / 10 * 8.6);

        ctx.fillStyle = gradient;
        ctx.fillText("Score:" + displayScore, canvas.width / 10 * 8, canvas.height / 10);
    }
    else {

        ctx.font = "30px Verdana";
        var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop("0", "magenta");
        gradient.addColorStop("0.5", "blue");
        gradient.addColorStop("1.0", "red");


        ctx.fillStyle = gradient;
        ctx.textAlign = 'center';
        ctx.fillText("get all the things.", canvas.width * .5, canvas.height / 10 * 6);
        ctx.fillText("make worl es safu.", canvas.width * .5, canvas.height / 10 * 7);
        ctx.fillText("collect lupe!", canvas.width * .5, canvas.height / 10 * 8);


    }
});

function random_rgb() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgb(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ')';
}

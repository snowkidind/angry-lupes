var canvas = document.getElementById("game");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.addEventListener("mousedown", onClickStart, false);
canvas.addEventListener("mouseup", onClickEnd, false);
canvas.addEventListener("touchstart", onTouchStart, false);
canvas.addEventListener("touchend", onTouchEnd, false);

var ctx = canvas.getContext;

console.log(canvas.width,canvas.height );

var world = boxbox.createWorld(canvas);

var width = world.worldPositionAt(canvas.width,canvas.height).x;
var height = world.worldPositionAt(canvas.width,canvas.height).y;

//image is 200px
var worldImgSize = world.worldPositionAt(100,0).x;
var clickRange = 100;

createElements();

var lupe;
var ground;
var wall;
var blockA;
var blockB;
var blockC;

function createElements(){

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

    lupe = world.createEntity({
        name: "player",
        x: width / 10 * 2,
        color: "rgb(0,100,0)",
        shape: "square",
        width: worldImgSize,
        height: worldImgSize,
        image: "bogandoff.png",
        imageOffsetY: world.worldPositionAt(-75,0).x,
        // imageStretchToFit: true,
        density: 1
    });

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

    var block = {
        name: "block",
        shape: "square",
        color: "brown",
        width: .5,
        height: 4,
        onImpact: function(entity, force) {
            if (entity.name() === "player") {
                this.color("black");
                impulseText = "es more Safu.."
            }
        }
    };

    blockA = world.createEntity(block, {
        x: width / 10 * 6.5,
        y: height / 10 * 3,
        width: width / 10 * .25,
        height:  width / 10 * 2
    });

    blockB = world.createEntity(block, {
        x: width / 10 * 7.5,
        y: height / 10 * 3,
        width: width / 10 * .25,
        height:  width / 10 * 2
    });

    blockC = world.createEntity(block, {
        x: width / 10 * 7,
        y: 1,
        width: width / 10 * 2.5,
        height: 1
    });
}

world.onRender(function(ctx){
    // ctx.beginPath();
    // ctx.rect(0, 0, canvas.width, canvas.height);
    // ctx.fillStyle = "red";
    // ctx.fill();
});

var impulseText = "No es safu?";
var lupeSelect = {active:false};

function onTouchStart(e) {

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
            console.log("nope")
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

            var distanceX = x - lupeSelect.x;
            var distanceY = y - lupeSelect.y;

            var deltaX = x - lupeSelect.x;
            var deltaY = y - lupeSelect.y;
            var rad = Math.atan2(deltaY,deltaX);
            var angle = rad * (180 / Math.PI);

            if (distanceX > distanceY){
                lupe.applyImpulse(Math.abs(distanceX) * 2.5, angle - 90);
                impulseText = Math.abs(distanceX) * 2.5;
            }
            else {
                lupe.applyImpulse(Math.abs(distanceY) * 2.5, angle - 90);
                impulseText = Math.abs(distanceY) * 2.5;
            }

            lupeSelect = { active:false };
        }
    }
}

function onClickStart(e) {
    if (test(lupe, {x:e.pageX, y:e.pageY}) === 1){
        console.log("Lupe clicked");
        lupeSelect = {x:e.pageX, y:e.pageY, active:true};
    }
    else {
        lupeSelect = {active:false};
        console.log("nope")
    }
}


function onClickEnd(e){

    var x = e.pageX;
    var y = e.pageY;

    if (lupeSelect.active){

        var distanceX = x - lupeSelect.x;
        var distanceY = y - lupeSelect.y;

        var deltaX = x - lupeSelect.x;
        var deltaY = y - lupeSelect.y;
        var rad = Math.atan2(deltaY,deltaX);
        var angle = rad * (180 / Math.PI);

        if (distanceX > distanceY){
            lupe.applyImpulse(Math.abs(distanceX) * 2.5, angle - 90);
            impulseText = Math.abs(distanceX) * 2.5;
        }
        else {
            lupe.applyImpulse(Math.abs(distanceY) * 2.5, angle - 90);
            impulseText = Math.abs(distanceY) * 2.5;
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
    blockA.destroy();
    blockB.destroy();
    blockC.destroy();

}

var chummy;

world.onRender(function(ctx){
  // console.log(lupe.position().x, lupe.position().y);

    if (lupe.position().x > width || lupe.position().x < 0){
      // console.log("Out Of X Bounds...");
      destroyElements();
      createElements();
      impulseText = "No es Safu?"

    }
    else if (lupe.position().y > height || lupe.position().y < 0){
      // out of y bounds is legal
      // console.log("Out Of Y Bounds...");
    }

    if (lupeSelect.active){
      if (!chummy){
          chummy = world.createEntity({
              name: "player",
              x: width / 10,
              y: height /10 * 8,
              type: "static",
              color: "rgb(0,100,0)",
              shape: "square",
              width: worldImgSize,
              height: worldImgSize,
              image: "chummy.png",

              // imageStretchToFit: true,
              density: 1
          });
      }
    }
    else {
        if (typeof(chummy) === "object"){
          chummy.destroy();
          chummy = '';
        }
    }

    ctx.font="30px Verdana";
    var gradient=ctx.createLinearGradient(0,0, 25,0);
    gradient.addColorStop("0","magenta");
    gradient.addColorStop("0.5","blue");
    gradient.addColorStop("1.0","red");

    // Fill with gradient
    ctx.fillStyle=gradient;
    ctx.fillText(impulseText, canvas.width / 10 * 2, canvas.height / 10 * 8);

});

function random_rgb() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgb(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ')';
}

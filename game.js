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

// console.log(world.worldPositionAt(0,0));
// console.log(world.worldPositionAt(canvas.width,canvas.height));

var width = world.worldPositionAt(canvas.width,canvas.height).x;
var height = world.worldPositionAt(canvas.width,canvas.height).y;


var lupe = world.createEntity({
  name: "player",
  shape: "circle",
  radius: 1,
  image: "lupe.png",
  imageStretchToFit: true,
  density: 4,
  x: width / 10 * 2,
  onKeyDown: function(e) {
    this.applyImpulse(200, 60);
  }
});

world.createEntity({
  name: "ground",
  shape: "square",
  type: "static",
  color: "rgb(0,100,0)",
  width: width,
  height: .5,
  x: width / 2,
  y: height / 10 * 9
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
    }
  }
};

world.createEntity(block, {
    x: width / 10 * 6.5,
    height:  height / 10 * 3
});

world.createEntity(block, {
    x: width / 10 * 7.5,
    height:  height / 10 * 3
});

world.createEntity(block, {
  x: width / 10 * 7,
  y: 1,
  width: height / 10 * 3,
  height: .5
});

world.onRender(function(ctx){
    // ctx.beginPath();
    // ctx.rect(0, 0, canvas.width, canvas.height);
    // ctx.fillStyle = "red";
    // ctx.fill();
});

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


            var deltaX = lupeSelect.x - x;
            var deltaY = lupeSelect.y - y;
            var rad = Math.atan2(deltaY,deltaX);
            var angle = rad * (180 / Math.PI);


            console.log(distanceX, angle);

            lupe.applyImpulse(distanceX, angle);

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

        var deltaX = x - lupeSelect.x;
        var deltaY = y - lupeSelect.y;
        var rad = Math.atan2(deltaY,deltaX);
        var angle = rad * (180 / Math.PI);


        console.log(Math.abs(distanceX), angle);

        lupe.applyImpulse(Math.abs(distanceX) * 2, angle - 90);

        lupeSelect = { active:false };
    }

}

function test(sprite, e){

    var spritePos = world.canvasPositionAt(lupe.position().x, lupe.position().y);
    var touch = e;
    var spriteSize = 85;

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
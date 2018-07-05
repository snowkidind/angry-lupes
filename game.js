var canvas = document.getElementById("game");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.addEventListener("click", onClickCanvas, false);
canvas.addEventListener("touchend", onClickCanvas, false);

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

function onTouchCanvas(e) {

}

function onClickCanvas(e) {

    if (test(lupe, e) === 1){
        console.log("Lupe clicked");
        lupe.applyImpulse(200, 60);
    }
    else {
        console.log("nope")
    }
}

function test(sprite, e){

    var spritePos = world.canvasPositionAt(lupe.position().x, lupe.position().y);
    var touch = {x:e.pageX, y:e.pageY};
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
let flyswatter,boom,booms;
let flying=true;
let flySprite,flyswatterSprite,dir;
let distance,back;
let score=0;
let speedx,speedy,speed1=10;

//Open and connect socket
let socket = io();

//Listen for confirmation of connection
socket.on('connect', function() {
  console.log("Connected");
  
});

socket.on('data', function(obj) {
  console.log(obj);
  flyFlying(obj.x,obj.y)

});



function preload(){
  flyswatter=loadImage('1.png')
  fly= loadAnimation('fly1.png','fly2.png')
  boom=loadImage('3.png')
  back=loadImage('2.jpg')
  mySound = loadSound('annoy.mp3');
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  flySprite=createSprite(width/2,height/2,10,10)
  flyswatterSprite=createSprite(mouseX,mouseY,10,10)
  flySprite.addAnimation('fly',fly)
  flySprite.scale=0.02
  flySprite.depth=0
  flyswatterSprite.addImage('flyswatter',flyswatter)
  flyswatterSprite.scale=0.4
  flyswatterSprite.depth=1
  booms=createSprite(flyswatterSprite.position.x,flyswatterSprite.position.y,10,10)
  booms.addImage(boom)
  booms.scale=0.07
  booms.depth=0
  booms.visible=false
  frameRate(60)
  mySound.setLoop(false);
  mySound.setVolume(0.2)
  //mySound.delayTime(3)
  mySound.playMode('restart')
  mySound.play()
  

}

function draw() {
  background(back);


  flyswatterSprite.position.x=mouseX-10
  flyswatterSprite.position.y=mouseY-10
  drawSprites()
  //flyFlying(flyswatterSprite.position.x,flyswatterSprite.position.y)
  let mousePos = { x: flyswatterSprite.position.x, y: flyswatterSprite.position.y };
  //Send mouse position object to the server
  socket.emit('data', mousePos);
  if (flying==false){
    speed1=10
    flySprite.setVelocity(0,2+speed1)

    
  if (flySprite.position.y> height){
    flySprite.position.y=random(height-100)
    count=0
    flyPosX = flySprite.position.x;
    flyPosY = flySprite.position.y;
    lastFlyX = 0;
    lastFlyY = 0;
    flySprite.rotation=0
    speed1=0
    flying=true
    flySprite.animation.play()
    flySprite.setVelocity(0,0)
    booms.visible=false
    mySound.play()
  }
  }
  textSize(20)
  text("score:"+score,width-100,100)
  
}

function flyFlying(ax,bx){
let count = 0;
let flyPosX = ax;
let flyPosY = bx;
let lastFlyX = 0;
let lastFlyY = 0;
let offset = 5;

  if (flying==true){
    flySprite.limitSpeed(3+score)
    distance = dist(flySprite.position.x, flySprite.position.y, lastFlyX, lastFlyY);
  
    if ( distance > 0 && flying==true) {
      flySprite.attractionPoint(random(0.5), ax,  bx);

      if (flySprite.velocity.x>0){
        dir=-1
      }else{
        dir=1
        
        }
      flySprite.mirrorX(dir)
          
    }
          
  
  }
  distance = flying && dist(flySprite.position.x, flySprite.position.y, mouseX, mouseY);
}
  




function mouseClicked(){
  if (flying==true){
    if ( dist(flySprite.position.x+2, flySprite.position.y-5, flyswatterSprite.position.x, flyswatterSprite.position.y-85 )<=20 &&  flySprite.collide(flyswatterSprite,kill)==true){
      kill(flySprite)
      flySprite.animation.stop()
      booms.visible=true
      booms.position.x=flySprite.position.x
      booms.position.y=flySprite.position.y
    }

  }
}

function kill(flySprite){
  mySound.setLoop(false)
  flying=false
  score+=0.5
  flySprite.rotation=180
  
}




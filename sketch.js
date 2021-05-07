//declaration of global variables
var ironman, ironmancollided;
var bg, backgroundImg;
var stoneImg, bricksGroup;
var diaImg, diaGroup;
var obsImg,obstacleGroup;
var score=0;
var gamestate="PLAY";

function preload() {
  //preloading all given images
  backgroundImg = loadImage("images/bg.jpg");
  ironman= loadImage("images/iron.png");
  stoneImg= loadImage("images/stone.png");
  diaImg = loadImage("images/diamond.png");
  obsImg=loadImage("images/spikes.png");
  restartImg=loadImage("images/restart.png")
}

function setup() {
  //setting up the canvas
  createCanvas(1000, 600);
  
  //assigning attributes to the background
  bg = createSprite(580,300);
  bg.addImage(backgroundImg);
  bg.scale=2;

  //declaring ironmans attributes
  iron = createSprite(200,450,20,50);
  iron.addImage(ironman);
  iron.scale =0.3;
  iron.setCollider("rectangle",0,0,200,500);

  //creating the ground sprite
  ground = createSprite(200,530,2000,10); 
  ground.visible = false; 

  //declaring all the groups
  bricksGroup= new Group();
  diaGroup= new Group();
  obstacleGroup = new Group();

  restart=createSprite(500,300);
  restart.addImage(restartImg);
  restart.visible=false;
}

function draw() {

  if(gamestate==="PLAY"){

  //giving motion to the background
  bg.velocityY=4;

  //assigning the borders
  if (bg.y > 600){
    bg.y=bg.width/4;
  }
  
  if(iron.x<50){
    iron.x=50;
  }

  if (iron.x > 900){
    iron.x = 900;
  }
  
  //using keys to move ironman
  if(keyDown("up") ) {
    iron.y -= 20;
  }
  if(keyDown("down") ) {
    iron.y +=20;
  }
  if(keyDown("left") ) {
    iron.x -= 20;
  }
  if(keyDown("right") ) {
    iron.x += 20;
  }

  //calling the function to generate the bricks
  generateBricks();

  //making ironman stand (collide) on the bricks
  for(var i = 0 ; i< (bricksGroup).length ;i++){
    var temp = (bricksGroup).get(i) ;
    
    if (temp.isTouching(iron)) {
       iron.collide(temp);
       //temp.velocityY=-5;
      }
    }

  //calling the function to generate the spikes
  generateObstacles();

  //reducing the score and destroying the spike when ironman touches it
  for(var i = 0 ; i< (obstacleGroup).length ;i++){
    var temp = (obstacleGroup).get(i) ;
    
    if (temp.isTouching(iron)) {
      score= score -5 ;
      temp.destroy();
      temp=null;
      }        
    }

  //calling the function to generate diamonds
  generateDia();

  //increasing the score and destroying the diamond when ironman touches it
  for(var i = 0 ; i< (diaGroup).length ;i++){
    var temp = (diaGroup).get(i) ;
    
    if (temp.isTouching(iron)) {
      score= score + 1;
      temp.destroy();
      temp=null;
      }        
    }
  //making iron man stand (collide) on the ground
  iron.collide(ground);

  //displaying the score
drawSprites();
textSize(20);
fill("white")
text("Diamonds Collected: "+ score, 500,50);

  if(score<=-10||iron.y>=610){
    gamestate="END";
  }
  }
   

if(gamestate==="END"){
  iron.velocityY=0;
  //iron.velocityX=0;
  bg.velocityY=0;
  obstacleGroup.setVelocityYEach(0);
  bricksGroup.setVelocityYEach(0);
  diaGroup.setVelocityYEach(0);
  obstacleGroup.setLifetimeEach(-1);
  bricksGroup.setLifetimeEach(-1);
  diaGroup.setLifetimeEach(-1);
  text("YOU LOSE!", 500,250);
  
  restart.visible=true;
  if(mousePressedOver(restart)){
    restartGame();
  }
}

}


//defining the function to generate bricks  
function generateBricks() {
    if (frameCount % 70 === 0) {
      var brick = createSprite(600,0,40,10);
      brick.x = random(100,900);
      //brick.y= random(100,300)
      brick.addImage(stoneImg);
      brick.scale = 0.5;
      brick.velocityY = 5;
      brick.lifetime =250;
      bricksGroup.add(brick);
    }
  }

  //defining the function to generate diamonds
  function generateDia() {
    if (frameCount % 50 === 0) {
      var dia = createSprite(600,0,40,10);
      dia.addImage(diaImg);
      dia.x = Math.round(random(20,1000));
      dia.scale = 0.5;
      dia.velocityY = 3;
      dia.lifetime = 1200;
      diaGroup.add(dia);
    }
  }

  //defining the function to generate the spikes
  function generateObstacles() {
    if(frameCount % 50 === 0) {
      var obstacle = createSprite(600,0,40,10);
      obstacle.velocityY = 8;
      obstacle.scale=0.8;
      obstacle.addImage(obsImg);
      obstacle.x = Math.round(random(20,1000));
      obstacle.lifetime = 310;
      obstacleGroup.add(obstacle);
    }
  }

  function restartGame() {
    gameState ="PLAY";
  obstacleGroup.destroyEach();
  bricksGroup.destroyEach();
  diaGroup.destroyEach();
  score=0;
  restart.visible=false;
  ironman.y=50;
  }
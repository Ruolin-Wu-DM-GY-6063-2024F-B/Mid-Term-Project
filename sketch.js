let img;
let bk_img;
let cloud_frt;
let brick_img;
let front_layer1;
let front_layer2;

let x;
let y;
let speed;
let time;
let charaX;
let charaY;

let bk_X;
let frontLayer1_X;
let frontLayer2_X;
let cloud_X;

let bkSpeed;
let frontLayer1Speed;
let frontLayer2Speed;
let cloudSpeed;

let bk_imgWidth;
let cloud_frtWidth;
let frontlayer1_Width;

let blood;
let bricks;
let brickWidth;
let brickHeight;

let popupWidth;
let popupHeight;
let popupX;
let popupY;

let buttonWidth;
let buttonHeight;
let buttonX;
let buttonY;

function preload() {
  img = loadImage('./Mid Term Assets/Chara1.png');
  bk_img = loadImage('./Mid Term Assets/back1.png');
  cloud_frt = loadImage('./Mid Term Assets/cloud_front.png');
  brick_img = loadImage('./Mid Term Assets/brick.png');
  front_layer1 = loadImage('./Mid Term Assets/front_layer1.png');
  front_layer2 = loadImage('./Mid Term Assets/front_layer2.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  bk_img.resize(0, height);
  bk_imgWidth = bk_img.width;

  cloud_frt.resize(0, height / 2);
  cloud_frtWidth = cloud_frt.width;

  front_layer1.resize(0, height / 1.5);
  front_layer2.resize(0, height / 1.5);
  frontlayer1_Width = front_layer1.width;

  brick_img.resize(brick_img.width * 0.5, brick_img.height * 0.5);
  brickWidth = brick_img.width;
  brickHeight = brick_img.height;

  popupWidth = width / 4;
  popupHeight = height / 3;
  popupX = (width - popupWidth) / 2;
  popupY = (height - popupHeight) / 2;

  buttonWidth = popupWidth * 0.6;
  buttonHeight = 40;
  buttonX = width / 2 - buttonWidth / 2;
  buttonY = popupY + (popupHeight / 3) * 2;

  resetGame();
}

function resetGame() {
  x = -100;
  y = height/2;
  speed = 8;
  time = 0;

  bk_X = -100;
  frontLayer1_X = -100;
  frontLayer2_X = -100;
  cloud_X = -100;

  bkSpeed = speed * 0.3;
  frontLayer1Speed = speed * 0.5;
  frontLayer2Speed = speed * 0.7;
  cloudSpeed = speed * 2;

  blood = 3;

  bricks = [];
  for (let i = 0; i < 10; i++) {
    let randomX = random(0, width * 2);
    let randomY = random(0, height - brickHeight);
    bricks.push({ x: randomX, y: randomY });
  }

  displayBlood();
}

function draw() {
  background(255);

  if (blood <= 0) {
    displayPopup('Game Over');
    return;
  }

  if (x >= width) {
    displayPopup('You Win!');
    return;
  }

  drawSeamlessLayer(bk_img, bk_X, bk_imgWidth, height);

  let frontLayer_Y = height/3;
  drawSeamlessLayer(front_layer1, frontLayer1_X, frontlayer1_Width, front_layer1.height, frontLayer_Y);
  drawSeamlessLayer(front_layer2, frontLayer2_X, frontlayer1_Width, front_layer2.height, frontLayer_Y);

  for (let i = 0; i < bricks.length; i++) {
    let brick = bricks[i];
    image(brick_img, brick.x - x, brick.y);
  }

  chara_key_move();

  chara_wave(x, y, time);
  time += 0.05;

  let cloudPosY = height/2;
  drawSeamlessLayer(cloud_frt, cloud_X, cloud_frtWidth, cloud_frt.height, cloudPosY);

  checkCollision();

  displayBlood();
}

function drawSeamlessLayer(img, imgx, imgWidth, imgHeight, imgy = 0) {
  let x1 = imgx % imgWidth;
  if (x1 > 0) {
    x1 -= imgWidth;
  }
  image(img, x1, imgy, imgWidth, imgHeight);
  image(img, x1 + imgWidth, imgy, imgWidth, imgHeight);
  image(img, x1 + imgWidth * 2, imgy, imgWidth, imgHeight);
}

function chara_key_move() {
  if (keyIsDown(LEFT_ARROW)) {
    x -= speed;
    bk_X += bkSpeed;
    frontLayer1_X += frontLayer1Speed;
    frontLayer2_X += frontLayer2Speed;
    cloud_X += cloudSpeed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    x += speed;
    bk_X -= bkSpeed;
    frontLayer1_X -= frontLayer1Speed;
    frontLayer2_X -= frontLayer2Speed;
    cloud_X -= cloudSpeed;
  }
  if (keyIsDown(UP_ARROW)) {
    y -= speed;
  }
  if (keyIsDown(DOWN_ARROW)) {
    y += speed;
  }
}

function chara_wave(x, y, time) {
  push();
  charaX = x + 10 * sin(time);
  charaY = y + 10 * sin(time * 1.5);
  image(img, charaX, charaY);

  pop();
}

function checkCollision() {
  charaX = x + 10 * sin(time);
  charaY = y + 10 * sin(time * 1.5);
  let charaWidth = img.width;
  let charaHeight = img.height;

  for (let i = 0; i < bricks.length; i++) {
    let brick = bricks[i];
    let brickX = brick.x - x;
    let brickY = brick.y;

    if (charaX < brickX + brickWidth && charaX + charaWidth > brickX && charaY < brickY + brickHeight && charaY + charaHeight > brickY) {
      blood -= 1;
      bricks.splice(i, 1);
      i--;
      break;
    }
  }
}

function displayBlood() {
  fill(0);
  textSize(60);
  let bloodText = '🩷'.repeat(blood);
  text(bloodText, 60, 80);
}

function mousePressed() {
  if ( mouseX > buttonX && mouseX < buttonX + buttonWidth && mouseY > buttonY && mouseY < buttonY + buttonHeight) {
    resetGame();
  }
}

function displayPopup(message) {
  fill(255);
  rect(popupX, popupY, popupWidth, popupHeight, 30);

  fill(0);
  textSize(32);
  textAlign(CENTER, CENTER);
  text(message, width / 2, popupY + popupHeight / 3);

  if (mouseX > buttonX && mouseX < buttonX + buttonWidth && mouseY > buttonY && mouseY < buttonY + buttonHeight) {
    fill(255, 166, 195);
  } else {
    fill(230);
  }
  rect(buttonX, buttonY, buttonWidth, buttonHeight, 30);

  fill(0);
  textSize(24);
  text('Start Over', width / 2, buttonY + buttonHeight / 2);
}

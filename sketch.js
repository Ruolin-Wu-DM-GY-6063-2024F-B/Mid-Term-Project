let img;
let bk_img;
let cloud_frt;
let brick_img;
let x = -100;
let y = 300;
let speed = 10;
let time = 0;
let cloudOffsetX = 0;
let bkOffsetX = 0;
let bk_imgWidth;
let cloud_frtWidth;
let blood = 3;
let brickX = 500;
let brickY = 300;
let brickWidth;
let brickHeight;
let collisionDetected = false;

function preload() {
  img = loadImage('./Mid Term Assets/Chara1.png'); 
  bk_img = loadImage('./Mid Term Assets/back1.png');
  // layer1_img = loadImage('')
  // layer2_img = loadImage('')
  cloud_frt = loadImage('./Mid Term Assets/cloud_front.png');
  brick_img = loadImage('./Mid Term Assets/brick.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  bk_img.resize(0, windowHeight);
  bk_imgWidth = bk_img.width;

  cloud_frt.resize(0, windowHeight / 2);
  cloud_frtWidth = cloud_frt.width;

  brick_img.resize(brick_img.width / 2, brick_img.height / 2); 
  brickWidth = brick_img.width;
  brickHeight = brick_img.height;
}

function draw() {
  background(255);

  load_pixel(bk_img, bk_img.height, 10, bkOffsetX, 0);
  load_pixel(bk_img, bk_img.height, 10, bkOffsetX + bk_imgWidth, 0);

  let cloudPosY = windowHeight - windowHeight / 2;
  load_pixel(cloud_frt, cloud_frt.height, 5, cloudOffsetX, cloudPosY);
  load_pixel(cloud_frt, cloud_frt.height, 5, cloudOffsetX + cloud_frtWidth, cloudPosY);

  image(brick_img, brickX, brickY);

  chara_key_move();
  chara_wave(x, y, time);
  time += 0.05;

  checkCollision();

  displayBlood();
}

function load_pixel(imgset, pixel_height, pixel_size, posX, posY) {
  imgset.loadPixels();

  let rectDim = pixel_size;
  noStroke();

  for (let y = 0; y < imgset.height; y += rectDim) {
    for (let x = 0; x < imgset.width; x += rectDim) {
      let pixIdx = (y * imgset.width + x) * 4;
      let redVal = imgset.pixels[pixIdx + 0];
      let greenVal = imgset.pixels[pixIdx + 1];
      let blueVal = imgset.pixels[pixIdx + 2];
      let alphaVal = imgset.pixels[pixIdx + 3]; 
      
      if (alphaVal > 0) {
        fill(redVal, greenVal, blueVal, alphaVal);
        rect(posX + x, posY + y, rectDim, rectDim); 
      }
    }
  }
}

function chara_key_move() {
  if ((keyIsDown(LEFT_ARROW) || keyIsDown(65)) && x - speed > 0) { 
    x -= speed;
    bkOffsetX += speed * 4;
    cloudOffsetX += speed * 2;
  }
  if ((keyIsDown(RIGHT_ARROW) || keyIsDown(68)) && x + speed < width) {
    x += speed;
    bkOffsetX -= speed * 4;
    cloudOffsetX -= speed * 2;
  }
  if ((keyIsDown(UP_ARROW) || keyIsDown(87)) && y - speed > 0) {
    y -= speed;
  }
  if ((keyIsDown(DOWN_ARROW) || keyIsDown(83)) && y + speed < height) {
    y += speed;
  }

  bkOffsetX = bkOffsetX % -bk_imgWidth;
  cloudOffsetX = cloudOffsetX % -cloud_frtWidth;
}

function chara_wave(x, y, time) {
  push();
  translate(x, y); 

  let offsetX = 10 * sin(time);
  let offsetY = 10 * sin(time * 1.5);
  image(img, offsetX, offsetY);

  pop();
}

function checkCollision() {
  let charaX = x + 10 * sin(time);
  let charaY = y + 10 * sin(time * 1.5);

  let charaWidth = img.width;
  let charaHeight = img.height;

  if (
    charaX < brickX + brickWidth &&
    charaX + charaWidth > brickX &&
    charaY < brickY + brickHeight &&
    charaY + charaHeight > brickY
  ) {
    if (!collisionDetected) {
      blood -= 1;
      collisionDetected = true;
    }
  } else {
    collisionDetected = false; 
  }

  if (blood < 0) {
    blood = 0;
  }
}

function displayBlood() {
  fill(0);
  textSize(24);
  text('Blood: ' + blood, 20, 30);
}

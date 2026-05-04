let capture;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // 啟動視訊擷取
  capture = createCapture(VIDEO);
  // 隱藏預設產生的 HTML video 元件，我們只在 canvas 裡畫它
  capture.hide();
}

function draw() {
  background('#e7c6ff');

  // 計算顯示影像的寬高 (全螢幕的 50%)
  let displayWidth = width * 0.5;
  let displayHeight = height * 0.5;

  // 計算置中座標
  let x = (width - displayWidth) / 2;
  let y = (height - displayHeight) / 2;

  push();
  // 為了達到左右顛倒效果：先移到影像顯示區域的右側，再進行水平縮放翻轉
  translate(x + displayWidth, y);
  scale(-1, 1);
  image(capture, 0, 0, displayWidth, displayHeight);
  pop();
}

function windowResized() {
  // 視窗大小改變時，自動調整畫布
  resizeCanvas(windowWidth, windowHeight);
}

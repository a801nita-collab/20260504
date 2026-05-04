let capture;
let faceMesh;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };

function preload() {
  // 載入 ml5.js 的 faceMesh 模型
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // 啟動視訊擷取
  capture = createCapture(VIDEO);
  capture.size(640, 480);
  // 隱藏預設產生的 HTML video 元件，我們只在 canvas 裡畫它
  capture.hide();

  // 開始偵測臉部
  faceMesh.detectStart(capture, gotFaces);
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

  // 繪製臉部線條
  if (faces.length > 0) {
    let face = faces[0];
    let points = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
    
    noFill();
    stroke('red');
    strokeWeight(15);
    strokeJoin(ROUND);
    
    beginShape();
    for (let i = 0; i < points.length; i++) {
      let index = points[i];
      let keypoint = face.keypoints[index];
      
      // 將座標從原始影片大小映射到顯示大小 (50% 畫面)
      let sx = keypoint.x * (displayWidth / capture.width);
      let sy = keypoint.y * (displayHeight / capture.height);
      
      vertex(sx, sy);
    }
    endShape();
  }
  pop();
}

// 取得偵測結果的回呼函式
function gotFaces(results) {
  faces = results;
}

function windowResized() {
  // 視窗大小改變時，自動調整畫布
  resizeCanvas(windowWidth, windowHeight);
}

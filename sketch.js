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
    let ratioX = displayWidth / capture.width;
    let ratioY = displayHeight / capture.height;

    // 第一組：線條 (1)
    let points = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
    
    noFill();
    stroke('red');
    strokeWeight(1);
    strokeJoin(ROUND);
    
    beginShape();
    for (let i = 0; i < points.length; i++) {
      let index = points[i];
      let keypoint = face.keypoints[index];
      
      // 將座標從原始影片大小映射到顯示大小
      let sx = keypoint.x * ratioX;
      let sy = keypoint.y * ratioY;
      
      vertex(sx, sy);
    }
    endShape();

    // 繪製第二組臉部線條 (粗細為 1)
    let points2 = [76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184];
    strokeWeight(1);
    beginShape();
    for (let i = 0; i < points2.length; i++) {
      let index = points2[i];
      let keypoint = face.keypoints[index];
      
      let sx = keypoint.x * ratioX;
      let sy = keypoint.y * ratioY;
      
      vertex(sx, sy);
    }
    endShape();

    // 繪製左眼外圈 (包含編號 247)
    let leftEyeOuter = [130, 247, 30, 29, 27, 28, 56, 190, 243, 112, 26, 22, 23, 24, 110, 25];
    strokeWeight(1);
    beginShape(CLOSE); // 使用 CLOSE 讓線條首尾相連成圈
    for (let i = 0; i < leftEyeOuter.length; i++) {
      let index = leftEyeOuter[i];
      let keypoint = face.keypoints[index];
      
      let sx = keypoint.x * ratioX;
      let sy = keypoint.y * ratioY;
      
      vertex(sx, sy);
    }
    endShape();

    // 繪製左眼內圈 (包含編號 246)
    let leftEyeInner = [33, 246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163, 7];
    beginShape(CLOSE);
    for (let i = 0; i < leftEyeInner.length; i++) {
      let index = leftEyeInner[i];
      let keypoint = face.keypoints[index];
      
      let sx = keypoint.x * ratioX;
      let sy = keypoint.y * ratioY;
      
      vertex(sx, sy);
    }
    endShape();

    // 繪製右眼外圈 (包含對應左眼 247 的編號 467)
    let rightEyeOuter = [359, 467, 260, 259, 257, 258, 286, 414, 463, 341, 256, 252, 253, 254, 339, 255];
    beginShape(CLOSE);
    for (let i = 0; i < rightEyeOuter.length; i++) {
      let index = rightEyeOuter[i];
      let keypoint = face.keypoints[index];
      
      let sx = keypoint.x * ratioX;
      let sy = keypoint.y * ratioY;
      
      vertex(sx, sy);
    }
    endShape();

    // 繪製右眼內圈 (包含對應左眼 246 的編號 466)
    let rightEyeInner = [263, 466, 388, 387, 386, 385, 384, 398, 362, 382, 381, 380, 374, 373, 390, 249];
    beginShape(CLOSE);
    for (let i = 0; i < rightEyeInner.length; i++) {
      let index = rightEyeInner[i];
      let keypoint = face.keypoints[index];
      
      let sx = keypoint.x * ratioX;
      let sy = keypoint.y * ratioY;
      
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

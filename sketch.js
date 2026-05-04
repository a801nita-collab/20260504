let capture;
let faceMesh;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };
let stars = [];

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

  // 初始化星星位置（使用 0~1 的比例，確保縮放視窗時星星位置依然正確）
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: random(0, 1),
      y: random(0, 1),
      size: random(1, 3.5),
      brightness: random(100, 255)
    });
  }

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
  
  // 1. 先繪製黑色背景（只在 50% 影像區域內）
  fill(0);
  noStroke();
  rect(0, 0, displayWidth, displayHeight);

  // 1.5 繪製星星（在外層黑色的背景上）
  noStroke();
  for (let star of stars) {
    fill(255, star.brightness);
    circle(star.x * displayWidth, star.y * displayHeight, star.size);
  }

  // 繪製臉部線條
  if (faces.length > 0) {
    let face = faces[0];
    let ratioX = displayWidth / capture.width;
    let ratioY = displayHeight / capture.height;

    // 取得臉部最外層輪廓點位編號
    let faceSilhouette = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 377, 152, 148, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];

    // 2. 建立裁剪區域 (Clipping Mask)，讓影像只顯示在臉部輪廓內
    push();
    beginClip();
    beginShape();
    for (let i = 0; i < faceSilhouette.length; i++) {
      let keypoint = face.keypoints[faceSilhouette[i]];
      vertex(keypoint.x * ratioX, keypoint.y * ratioY);
    }
    endShape(CLOSE);
    endClip();

    // 繪製擷取的影像（只會出現在輪廓內，輪廓外會露出下層的黑色）
    image(capture, 0, 0, displayWidth, displayHeight);
    pop();

    // 3. 繪製原本要求的紅色線條
    noFill();
    stroke('red');
    strokeWeight(1);
    strokeJoin(ROUND);

    // 第一組：線條 (1)
    let points = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
    
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

    // 繪製臉部最外層輪廓的線條
    // 加入霓虹燈發光效果
    push();
    drawingContext.shadowBlur = 20; // 發光的範圍深度
    drawingContext.shadowColor = 'red'; // 發光的顏色
    strokeWeight(2); // 稍微加粗線條讓中心看起來像燈管
    beginShape(CLOSE);
    for (let i = 0; i < faceSilhouette.length; i++) {
      let index = faceSilhouette[i];
      let keypoint = face.keypoints[index];
      vertex(keypoint.x * ratioX, keypoint.y * ratioY);
    }
    endShape();
    pop(); // 恢復狀態，避免發光效果影響到其他繪圖
  }
  pop();

  // 在畫布正上方顯示學號與姓名
  push();
  fill(0); // 設定文字顏色為黑色
  noStroke();
  textSize(32);
  textAlign(CENTER, TOP);
  text('414730589 黃讌婷', width / 2, 20);
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

let capture;
let poseNet;
let pose;
let skeleton;
let postureValue = 0;
let canvas = document.getElementById('canvas');

function setup() {
  createCanvas(680, 400);
  capture = createCapture(VIDEO);
  capture.size(width, height);
  poseNet = ml5.poseNet(capture, modelReady);
  poseNet.on('pose', gotPoses);
  // hiding here will hide our HTML element, which will result in only one screen capturing and not a mirrored capturing
  capture.hide();
}

function gotPoses(poses) {
  // Handle poses
  console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
    // let leftAnkle = poses[0].pose.leftAnkle;
    let leftEar = poses[0].pose.leftEar
    // let leftElbow = poses[0].pose.leftElbow;
    let leftEye = poses[0].pose.leftEye;
    // let leftHip = poses[0].pose.leftHip;
    // let leftKnee = poses[0].pose.leftKnee;
    let leftShoulder = poses[0].pose.leftShoulder;
    // let leftWrist = poses[0].pose.leftWrist;
    let nose = poses[0].pose.nose;
    // let rightAnkle = poses[0].pose.rightAnkle;
    let rightEar = poses[0].pose.rightEar;
    // let rightElbow = poses[0].pose.rightElbow;
    let rightEye = poses[0].pose.rightEye;
    // let rightHip = poses[0].pose.rightHip;
    // let rightKnee = poses[0].pose.rightKnee;
    let rightShoulder = poses[0].pose.rightShoulder;
    // let rightWrist = poses[0].pose.rightWrist;
    
    let shouldersInLine = false;
    let eyesInLine = false;
    let earsInLine = false;
    let noseInLine = false;
  
   
    const inLine = [shouldersInLine, eyesInLine, earsInLine, noseInLine];

    // console.log(Math.abs(leftShoulder.position.y - rightShoulder.position.y));
    // Check posture based on the positions of body parts
    if (confidenceSet(leftShoulder, rightShoulder)) {
      // console.log("Shoulders in line");
      shouldersInLine = true;
    // if (poses[0].pose.score > 0.3) {
    //   pose = poses[0].pose;
    }
    if (confidenceSet(leftEye, rightEye)) {
      // console.log("Eyes in line");
      eyesInLine = true;
    }

    if (confidenceSet(leftEar, rightEar) && leftEye.x < leftEar.x && rightEar.x < rightEye.x
    && leftEye.y < leftEar.y && rightEye.y < rightEar.y) {
      // console.log("Ears in line");
      earsInLine = true;
    }
    if (confidenceSet2(nose, leftEar) && confidenceSet2(nose, rightEar)) {
      // console.log("Nose in place!");
      noseInLine = true;
    }
    // console.log(shouldersInLine);
    // console.log(eyesInLine);
    // console.log(earsInLine);
    // console.log(noseInLine);

    postureValue = 0;
    if (shouldersInLine) {
      postureValue += 25;
    }
    if (eyesInLine) {
      postureValue += 25;
    }
    if (earsInLine) {
      postureValue += 25;
    }
    if (noseInLine) {
      postureValue += 25;
    }

    if (postureValue === 100) {
      console.log("Correct posture!")
    }

    // inLine.forEach(val => {
    //   if (val) {
    //     postureValue += 25;
    //   }
    // });
  }
}

const confidenceSet = (left, right) => left.confidence > 0.8 && right.confidence > 0.8 && Math.abs(left.y - right.y)/100 < 0.1
const confidenceSet2 = (left, right) => left.confidence > 0.8 && right.confidence > 0.8 && Math.abs(left.y - right.y)/100 < 0.1
const doesNotExceedX = (val1, val2) => val1.x < val2.x
const doesNotExceedY = (val1, val2) => val1.y < val2.y


function draw() {
  // filter(postureValue, )
  image(capture, 0, 0);
  
  if (pose) {
    for (let i = 0; i < pose.keypoints.length; i++) {
      let curX = pose.keypoints[i].position.x;
      let curY = pose.keypoints[i].position.y;
      fill(0, 255, 0);
      ellipse(curX, curY, 16, 16);
    }
    for (let i = 0; i < skeleton.length; i++) {
      let ptOne = skeleton[i][0];
      let ptTwo = skeleton[i][1];
      strokeWeight(2);
      stroke(255);
      line(ptOne.position.x, ptOne.position.y, ptTwo.position.x, ptTwo.position.y);
    }
  }
}

function modelReady() {
  console.log('Model is ready!');
}





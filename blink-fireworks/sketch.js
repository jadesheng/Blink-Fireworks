let particles = [];
let numParticles = 40;
let color = ["#9b5de5","#f15bb5","#fee440","#00bbf9","#00f5d4"];

// The actual helpful link: https://www.npmjs.com/package/@tensorflow-models/face-landmarks-detection

// (1) [Object]
// 0: Object
// faceInViewConfidence: 1
// boundingBox: Object
// mesh: Array(468)
// scaledMesh: Array(468)
// annotations: Object
// silhouette: Array(36)
// lipsUpperOuter: Array(11)
// lipsLowerOuter: Array(10)
// lipsUpperInner: Array(11)
// lipsLowerInner: Array(11)
// rightEyeUpper0: Array(7)
// rightEyeLower0: Array(9)
// rightEyeUpper1: Array(7)
// rightEyeLower1: Array(9)
// rightEyeUpper2: Array(7)
// rightEyeLower2: Array(9)
// rightEyeLower3: Array(9)
// rightEyebrowUpper: Array(8)
// rightEyebrowLower: Array(6)
// leftEyeUpper0: Array(7)
// leftEyeLower0: Array(9)
// leftEyeUpper1: Array(7)
// leftEyeLower1: Array(9)
// leftEyeUpper2: Array(7)
// leftEyeLower2: Array(9)
// leftEyeLower3: Array(9)
// leftEyebrowUpper: Array(8)
// leftEyebrowLower: Array(6)
// midwayBetweenEyes: Array(1)
// noseTip: Array(1)
// noseBottom: Array(1)
// noseRightCorner: Array(1)
// noseLeftCorner: Array(1)
// rightCheek: Array(1)
// leftCheek: Array(1)

// let faces;
// // let detector;
let model;
let faces;

const w = 640;
const h = 480;

function setup() {
  createCanvas(w, h);

  capture = createCapture(VIDEO);
  capture.size(w, h);
  capture.hide();

  loadFaceModel();

  colorMode(HSB, 255);
}

function draw() {
  background(200);
  if (capture.loadedmetadata && model !== undefined) {
    getFaces();
  }

  push();
  translate(w, 0);
  scale(-1, 1);
  image(capture, 0, 0);
  pop();

  noStroke();
  
  //particle update
    particles.forEach(p => {
    p.update();
    drawParticle(p);
  })
  

  // where the magic happens
  if (faces !== undefined) {
    //console.log(faces);
    //noLoop();
    for (const f of faces) {
      let h = 0;
      let landmarkIndex = 0;
      textSize(5);

      // add on to the f. to loop through all the points in the
      // face silhouette
      // beginShape();
      //for(const lm of f.annotations.silhouette) {

      // store leftEyeUpper
      let lhLeft = createVector(
        f.annotations.leftEyeUpper0[0][0],
        f.annotations.leftEyeUpper0[0][1]
      );
      let lhRight = createVector(
        f.annotations.leftEyeUpper0[6][0],
        f.annotations.leftEyeUpper0[6][1]
      );
      let lvLeft = createVector(
        f.annotations.leftEyeUpper0[3][0],
        f.annotations.leftEyeUpper0[3][1]
      );
      let lvRight = createVector(
        f.annotations.leftEyeLower0[3][0],
        f.annotations.leftEyeLower0[3][1]
      );
      let rvLeft = createVector(
        f.annotations.rightEyeUpper0[3][0],
        f.annotations.rightEyeUpper0[3][1]
      );
      

      stroke("red");
      strokeWeight(5);
      let lhDist = dist(lhLeft.x, lhLeft.y, lhRight.x, lhRight.y);
      let lvDist = dist(lvLeft.x, lvLeft.y, lvRight.x, lvRight.y);
      let leftEyeRatio = lhDist / lvDist;

      console.log(leftEyeRatio);
      //return leftEyeRatio;

      if (leftEyeRatio > 2.6) {
        fill(255);
        //circle(lvLeft.x, lvLeft.y, 10);
        fireworks(lvLeft.x, lvLeft.y);
        fireworks(rvLeft.x, rvLeft.y);
      }

      // grab the x and y position of each landmark
      //curveVertex(lm[0], lm[1])

      // const hue = map(h, 0, f.scaledMesh.length, 0, 255);
      // fill(hue, 255, 255);
      // text(landmarkIndex, lm[0], lm[1])
      //ellipse(lm[0], lm[1], 2, 2);
      // h++;
      // landmarkIndex++;

      //}
      //endShape(CLOSE);
    }
  }
}

function drawSilhouette(f) {
  beginShape();
  for (const kp of f.annotations.silhouette) {
    const keyPoint = createVector(kp[0], kp[1]);
    vertex(keyPoint.x, keyPoint.y);
  }
  endShape(CLOSE);
}

function drawEyes(f) {
  textSize(4);
  noStroke();
  for (const kp of f.annotations.leftEyeLower0) {
    fill(0, 259, 259);
    // ellipse(kp[0], kp[1], 2, 2);
    text("l0", kp[0], kp[1]);
  }

  for (const kp of f.annotations.leftEyeLower1) {
    fill(37, 259, 259);
    // ellipse(kp[0], kp[1], 2, 2);
    text("l1", kp[0], kp[1]);
  }

  for (const kp of f.annotations.leftEyeLower2) {
    fill(74, 259, 259);
    // ellipse(kp[0], kp[1], 2, 2);
    text("l2", kp[0], kp[1]);
  }

  for (const kp of f.annotations.leftEyeLower3) {
    fill(111, 259, 259);
    // ellipse(kp[0], kp[1], 2, 2);
    text("l3", kp[0], kp[1]);
  }

  for (const kp of f.annotations.leftEyeUpper0) {
    fill(148, 259, 259);
    // ellipse(kp[0], kp[1], 2, 2);
    text("u0", kp[0], kp[1]);
  }

  for (const kp of f.annotations.leftEyeUpper1) {
    fill(185, 259, 259);
    // ellipse(kp[0], kp[1], 2, 2);
    text("u1", kp[0], kp[1]);
  }

  for (const kp of f.annotations.leftEyeUpper2) {
    fill(222, 259, 259);
    // ellipse(kp[0], kp[1], 2, 2);
    text("u2", kp[0], kp[1]);
  }
}

async function loadFaceModel() {
  model = await faceLandmarksDetection.load(
    faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
  );

  console.log(model);
}

async function getFaces() {
  const predictions = await model.estimateFaces({
    input: document.querySelector("video"),
    returnTensors: false,
    flipHorizontal: true,
    predictIrises: false, // set to 'false' if sketch is running too slowly
  });

  if (predictions.length === 0) {
    faces = undefined;
  } else {
    faces = predictions;
    //console.log(faces);
  }
}


function drawParticle(particle) {
  let ageSize = map(particle.age, 0, particle.maxAge, 0, 0.2);
  
  push();
  translate(particle.position.x, particle.position.y);
  rotate(particle.angle.z);
  noStroke();
  fill(particle.fill);
  circle(-5, -5, particle.size);
  pop();
  
  if (particle.age > particle.maxAge) {
  particle.size = particle.size - ageSize;
   }
  if (particle.size - ageSize <= 0) {
  particles.shift();
   }
}

function fireworks(LeftEyeX,LeftEyeY){
  
   for (let i = 0; i < numParticles; i++)
  {
    let particle = new Particle();
    // particle.acceleration = createVector(random(1, 3), random(1,3), 0);
    particle.acceleration = p5.Vector.fromAngle(radians(random(0, 360)), random(1, 10));
    particle.angularAcceleration = createVector(0, 0, radians(random(-20, 20)));  
    particle.drag = 0.01;
    shuffle(color,true);
    particle.maxAge = random(5, 20);
    particle.size = random(1,5);
    particle.fill = color[int(random(0,4))];
    particle.angularDrag = 0.01;
    particle.position = createVector(LeftEyeX, LeftEyeY, 0);
    particles.push(particle);  
    //particle.velocity = createVector(0,0,0);
  }
  
}

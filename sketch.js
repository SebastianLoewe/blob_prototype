// the following values determine the range for the offset that is added
//to the radius and hence the size of Blobby’s three blobs
let yoff1 = 0.1;
let yoff2 = 0.1;
let yoff3 = 0.1;
// the following value determines the number of spikes
//(value should be btw. 0.2 and 0.001)
var e = 0.1;
// the following values determine how far the radius expands within Blobby’s movement
// (value btw. 10 and aprox. 500) – both values need to be realtively close to each other
var dynaX = 100;
var dynaY = 100;

let i = 20;
let j = 50;
var r, x, y;
var fr = 15;
var canvas;

var r1 = 107;
var g1 = 212;
var b1 = 216;

var r2 = 77;
var g2 = 134;
var b2 = 178;

var r3 = 84;
var g3 = 205;
var b3 = 158;

var radius1 = 200;
var radius2 = 130;
var radius3 = 50;

var neutralConf, happyConf, sadConf, angryConf, fearfulConf, surprisedConf;
var label, confidence;
var happy, sad, angry, fearful, surprised;

//–––––––––––––

const MODEL_URL = 'models/';
let vid;
let results;
let landmarks;
let btn;
let div;
let loaded = false;

// –––––––––––––

function setup() {
  textAlign(RIGHT);
  div = createDiv('<br> please wait while face-api models are loading...');

  canvas = createCanvas(600, 600);
  canvas.parent('myCanvas');

  // use an async callback to load in the models and run the getExpression() function
  vid = createCapture(VIDEO, async () => {
    await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
    await faceapi.loadFaceLandmarkModel(MODEL_URL);
    await faceapi.loadFaceRecognitionModel(MODEL_URL);
    await faceapi.loadFaceExpressionModel(MODEL_URL);
    div.elt.innerHTML = '<br>model loaded!';
    loaded = true;
    getResults(); // init once
  }).parent('myCanvas');
  vid.size(640, 480);
  vid.position(600,0);
  //vid.hide();
}

// –––––––––––––

async function getResults() {
  results = await faceapi.detectSingleFace(vid.elt).withFaceExpressions();
  getResults();
}

// ––––––– DRAW FUNCTION

function draw() {
  canvas.background(220);
  canvas.clear();
  translate(width / 2, height / 2);

  detect();
  blobbydraw();
  blobbyhappy();
  blobbysad();
  blobbyangry();
  //blobbyfearful();
  blobbysurprised();

  //image(vid, 0, 0);
}

// –––––– DETECT EMOTIONS

function detect(){
  if (loaded) {

    // results
    if (results) {

      // draw bounding box
      let x = results.detection.box.x;
      let y = results.detection.box.y;
      let w = results.detection.box.width;
      let h = results.detection.box.height;
      noFill();
      stroke(255);
      strokeWeight(2);
      //rect(x, y, w, h);

      // expressions
      let expressions = [];
      for (var expr in results.expressions) {
        expressions.push([expr, results.expressions[expr]]);
      }

      // loop trough expressions except last one (because "asSortedArray")
      for (let i = 0; i < expressions.length - 1; i++) {
        label = expressions[i][0];

        if(label == "happy"){
        happy = true;
        happyConf = expressions[1][1];
        //console.log("happyConf", happyConf);
        }

        else if(label == "sad"){
        sad = true;
        sadConf = expressions[2][1];
        //console.log("sadConf", sadConf);
        }

        else if(label == "angry"){
        angry = true;
        angryConf = expressions[3][1];
        //console.log("angryConf", angryConf);
        }

        else if(label == "fearful"){
          fearful = true;
        //  let ffmapping = expressions[4][1];
        //  let ffabs = abs(ffmapping);
        //  fearfulConf = norm(ffabs, 0.000001, 0.999999));
        //  console.log("fearfulConf", fearfulConf);

          }

        else if(label == "surprised"){
        surprised = true;
        surprisedConf = expressions[6][1];
        //console.log("surprisedConf", surprisedConf);
        }
      }
    }
  }
}

// ––––––– DRAW BLOB SHAPE

function blobbydraw() {
  noStroke();
  fill(r1, g1, b1);
  push();
  beginShape();
  let xoff1 = 0; // base value for the perlin noise randomizer
  for (var a = 0; a < TWO_PI; a += e) { // e == fear score: determines the number of points
    let offset1 = map(noise(xoff1, yoff1), 0, 1, -dynaX, dynaY); //last two values determine dynamic (x/y) of the blob
    let r = radius1 + offset1;
    let x = r * cos(a);
    let y = r * sin(a);
    curveVertex(x, y);
    xoff1 += 0.1; //  another excitement score: determines the shape spikes • between 0.9 and 0.001
    //ellipse(x, y, 4, 4);
  }
  endShape();
  pop();

  translate(-i, j);
  fill(r2, g2, b2);
  push();
  beginShape();
  let xoff2 = 0;
  for (var a = 0; a < TWO_PI; a += e * 2) {
    let offset2 = map(noise(xoff2, yoff2), 0, 1, -70, 100);
    let r = radius2 + offset2;
    let x = r * cos(a);
    let y = r * sin(a);
    curveVertex(x, y);
    xoff2 += 0.1;
    //ellipse(x, y, 4, 4);
  }
  endShape();
  pop();

  fill(r3, g3, b3);
  push();
  beginShape();
  let xoff3 = 0.5;
  for (var a = 0; a < TWO_PI; a += e * 4) {
    let offset3 = map(noise(xoff3, yoff3), 0, 1, -50, 40);
    let r = radius3 + offset3;
    let x = r * cos(a);
    let y = r * sin(a);
    curveVertex(x, y);
    xoff3 += 0.1;
    //ellipse(x, y, 4, 4);
  }
  endShape();
  pop();

  yoff1 += 0.01;
  yoff2 += 0.01;
  yoff3 += 0.01;
}

// ––––––– DRAW HAPPINESS

function blobbyhappy() {

  if(happy === true){

    //console.log("happyConf_2", happyConf);
    fr = map(happyConf, 0, 1, 10, 40);

    radius1 = 200;
    radius2 = 130;
    radius3 = 50;

    let newRad1 = map(happyConf, 0, 1, 200, 300);
    radius1 = newRad1;
    let newRad2 = map(happyConf, 0, 1, 130, 230);
    radius2 = newRad2;
    let newRad3 = map(happyConf, 0, 1, 50, 150);
    radius3 = newRad3;

    r1 = 107;
    g1 = 212;
    b1 = 216;
    let newRed1 = map(happyConf, 0, 1, 0, -4);
    r1 = r1 + newRed1;
    //console.log("r1", r1);
    let newGreen1 = map(happyConf, 0, 1, 0, 32);
    g1 = g1 + newGreen1;
    //console.log("g1", g1);
    let newBlue1 = map(happyConf, 0, 1, 0, 32);
    b1 = b1 + newBlue1;
    //console.log("b1", b1);

    r2 = 77;
    g2 = 134;
    b2 = 178;
    let newRed2 = map(happyConf, 0, 1, 0, -59);
    r2 = r2 + newRed2;
    let newGreen2 = map(happyConf, 0, 1, 0, 35);
    g2 = g2 + newGreen2;
    let newBlue2 = map(happyConf, 0, 1, 0, 57);
    b2 = b2 + newBlue2;

    r3 = 84;
    g3 = 205;
    b3 = 158;
    let newRed3 = map(happyConf, 0, 1, 0, -69);
    r3 = r3 + newRed3;
    let newGreen3 = map(happyConf, 0, 1, 0, 35);
    g3 = g3 + newGreen3;
    let newBlue3 = map(happyConf, 0, 1, 0, -7);
    b3 = b3 + newBlue3;
  }

}

// ––––––– DRAW SADNESS

function blobbysad() {

  if(sad === true){
    //console.log("sadConf_2", sadConf);

    fr = map(sadConf, 0, 1, 20, 3);

    r1 = 107;
    g1 = 212;
    b1 = 216;
    let newRed1 = map(sadConf, 0, 1, 0, 71);
    r1 = r1 + newRed1;
    //console.log("r1", r1);
    let newGreen1 = map(sadConf, 0, 1, 0, -16);
    g1 = g1 + newGreen1;
    //console.log("g1", g1);
    let newBlue1 = map(sadConf, 0, 1, 0, -20);
    b1 = b1 + newBlue1;
    //console.log("b1", b1);

    r2 = 77;
    g2 = 134;
    b2 = 178;
    let newRed2 = map(sadConf, 0, 1, 0, 49);
    r2 = r2 + newRed2;
    let newGreen2 = map(sadConf, 0, 1, 0, 4);
    g2 = g2 + newGreen2;
    let newBlue2 = map(sadConf, 0, 1, 0, -35);
    b2 = b2 + newBlue2;

    r3 = 84;
    g3 = 205;
    b3 = 158;
    let newRed3 = map(sadConf, 0, 1, 0, 4);
    r3 = r3 + newRed3;
    let newGreen3 = map(sadConf, 0, 1, 0, -97);
    g3 = g3 + newGreen3;
    let newBlue3 = map(sadConf, 0, 1, 0, -58);
    b3 = b3 + newBlue3;
    }
}

// ––––––– DRAW ANGRYNESS

function blobbyangry() {

  if(angry === true){

    e = map(angryConf, 0, 1, 0.1, 0.001);
    //console.log("angryConf_2", angryConf);

  }
}

// ––––––– DRAW FEAR

function blobbyfearful() {

  if(fearful === true){
    //console.log("fearfulConf_2", fearfulConf);

    //radius1 = 200;
    //radius2 = 130;
    //radius3 = 50;

    let newRad1 = map(fearfulConf, 0, 1, 200, 100);
    radius1 = newRad1;
    let newRad2 = map(fearfulConf, 0, 1, 130, 50);
    radius2 = newRad2;
    let newRad3 = map(fearfulConf, 0, 1, 50, 20);
    radius3 = newRad3;
  }
}

// ––––––– DRAW SURPRISE

function blobbysurprised() {

  if(surprised === true){
    //console.log("surprisedConf_2", surprisedConf);

      if (surprisedConf > 0.45) {
        r1 = random(0, 255);
        g1 = random(0, 255);
        b1 = random(0, 255);
        r2 = random(0, 255);
        g2 = random(0, 255);
        b2 = random(0, 255);
        r3 = random(0, 255);
        g3 = random(0, 255);
        b3 = random(0, 255);
      }
    }
}

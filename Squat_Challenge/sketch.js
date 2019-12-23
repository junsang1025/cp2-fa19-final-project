let video;
let poseNet;
let poses = [];
let nose;
let HighBar = 300;
let LowBar = 500;
let BelowHighbar = false;
let BelowLowbar = false;
let Bottom = false;
let Score = 0;
var milliseconds = 0;
var seconds = 0;

function setup() {
  createCanvas(1024, 800);
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
    results.sort(function(a, b) {
      return b.pose.score - a.pose.score;
    });
    // print(results);
  });
  // Hide the video element, and just show the canvas
  video.hide();
  nose = loadImage("nose.png");
  textSize(16);
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function draw() {
  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  stroke(200);
  // line(30, HighBar, 610, HighBar);
  // line(30, LowBar, 610, LowBar);
  compare();
  
  milliseconds = millis();
	//seconds = milliseconds/1000;
  
  text('Counting down:', 700, 30);
	text(60-int(seconds), 950, 30); //display time down
	
	if(seconds >= 60){
		seconds = 60;
		//gameover
      background(128, 128, 128);
      textAlign(LEFT);
      text("Try to beat your score!", 30, 60);
      text("Press Cmd+R to Restart", 30, 90);
      text("Score:", 30,30);
      text( Score, 120, 30);
      noLoop();
	}//close if max time
	else{
		seconds = milliseconds/1000;
	}//close else

}//close draw

function RestartSketch() {
  loop();
  background(0, 0, 0, 0);
  seconds = 0;
}


// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        //ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
        // text(j, keypoint.position.x, keypoint.position.y);

        if (j == 0) {
          push();
          imageMode(CENTER);
          image(nose, keypoint.position.x, keypoint.position.y, 50, 50);
          pop();
          //text("NOSE", keypoint.position.x + -15, keypoint.position.y + 15);
        }
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}


var inSquat = false;
function compare() {
  if (poses.length > 0) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[0].pose;
    // for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[0];

      if (keypoint.score > 0.38) {
        print (keypoint.position.y);
        // if (j == 0) {

          // line(0, keypoint.position.y, width, keypoint.position.y);
        // }
        //print(keypoint.position.y);
        if (keypoint.position.y < 300) {
          AboveHighbar = true;

          // print("HighBar" +HighBar);
        } else {
          AboveHighbar = false;
        }

        if (keypoint.position.y > 500) {
          BelowLowbar = true;
        } else {
          BelowLowbar = false;
        }

        if (!inSquat && BelowLowbar) { 
          inSquat = true;
        } else if (inSquat && AboveHighbar) {
          inSquat = false;
          Score = Score + 1;
        }
        
        if (BelowHighbar && BelowLowbar) {
          Bottom = true;
        } else {
          Bottom = false;
        }

        if (inSquat) {
          fill(0, 0, 0);
        } else {
          fill(255, 255, 255);
        }        
    }
  }
  textSize(30);
  text("Score:", 30, 30);
  text( Score, 120, 30);
  rect(30, 40, 964, 10);
  rect(30, 300, 964, 2);
  rect(30, 500, 964, 2);
}
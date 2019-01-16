//variable that stores the coordinates to place the glasses without having to scan the face again upon choosing new glasses
var pos;
//pixel coordinates for left eye
var leftEye;
//pixel coordinates for right eye
var rightEye;
//the distance between the two eyes based on pixels
var spaceBetweenEyes;
//the total width of the two eyes
var widthOfRectangle;
//final coordinates to place glasses
var positionOfTrack;

// Default glasses image if one is not chosen by user
var stunnas = "assets/glasses2.png";

// as soon as age loads check is the user has an image is stored in localStorage meaning the user has already visited site if not it sets default
$(function pictureCheck(){
  //if user has uploaded a pic already then it is displayed and img is drawed onto the canvas
  if (localStorage.getItem("glassesScan") !== null) {
    var savedImgLocal = localStorage.getItem('glassesScan');
    //loadImage function provided by JS library that analyzes exif IMAGE data to correctly draw it onto the canvas. When uploaded images especially on mobile then it would display it sideways
    //https://github.com/blueimp/JavaScript-Load-Image#image-loading
    loadImage(
      savedImgLocal,
      function (img) {
          //draw the saved image on the canvas.
          var canvas = document.getElementById('imageGlasses'),
              context = canvas.getContext('2d');
              context.drawImage(img,canvas.width/2 - img.width/2, canvas.height/2 - img.height/2);
      },
      {maxHeight: 400,maxWidth:600,minHeight:400, orientation: true, canvas:true} // Options
  );
  }

  //if there is no saved image in local storage then it draws the default pic in canvas
  else {
    var defaultPic = 'assets/test7.jpg';
    loadImage(
      defaultPic,
      function (img) {
          //draw the saved image on the canvas.
          var canvas = document.getElementById('imageGlasses'),
              context = canvas.getContext('2d');
              context.drawImage(img,canvas.width/2 - img.width/2,canvas.height/2 - img.height/2);
      },
      {maxHeight: 400, maxWidth: 600,minHeight:400, orientation: true, canvas:true} // Options using clmtracker
  )
  }
});


//uploading pic function that stores pic into local storage.
  document.getElementById('upload').onchange = function (e) {
    var loadingImage = loadImage(
        e.target.files[0],
        function (img) {
                //if there is an image drawn on the canvas then it clears the canvas and the orevious coordinates of the positon of the eyes.
                overlayCC.clearRect(0,0, overlay.width, overlay.height);
                overlay.removeAttribute('style');
                pos = [];
                context.clearRect(0, 0, canvas.width, canvas.height);
                //after it has cleared the canvas then it draws the new image that was uploaded
                context.drawImage(img,canvas.width/2 - img.width/2,canvas.height/2 - img.height/2);
                //saving image to loacal storae
              var imgURL =   canvas.toDataURL();
              console.log("img.width "+ img.width, "canvas.width "+ canvas.width, img.left);
              localStorage.setItem("glassesScan", imgURL);
              //Scans face and then sets glasses function.
              canvasSearchMethod();
        },
        {maxHeight: 400, maxWidth:600, minHeight:400, orientation: true, canvas:true} // Options
    );
    };

//variables used in canvas to draw images
//overlay is used to dray the tracking of the image
var overlay = document.getElementById('overlay');
//this is where the glasses get drawn onto the canvas
var canvas =  document.getElementById('imageGlasses');
var context = canvas.getContext('2d');
var overlayCC = overlay.getContext('2d');;
var ctrack;
var drawRequest;
//clm trackr function to track eyes
function canvasSearchMethod(){
  overlay = document.getElementById('overlay');
  canvas = document.getElementById('imageGlasses');
  overlayCC = overlay.getContext('2d');
  ctrack = new clm.tracker({stopConvergence : true});
  ctrack.init();
  overlay.removeAttribute('style');
  return animateClean();
}

  function animateClean(){
    ctrack.start(document.getElementById('imageGlasses'));
    drawLoop();
  };
  function animate(box){
    ctrack.start(document.getElementById('imageGlasses'), box);
    drawLoop();
  }
  function drawLoop(){
    drawRequest = requestAnimFrame(drawLoop);
    overlayCC.clearRect(0,0, overlay.width, overlay.height);
    if (ctrack.getCurrentPosition()) {
       ctrack.draw(overlay);
    }
  }
// if it didnt find a face
 document.addEventListener("clmtrackrNotFound", function(event) {
    ctrack.stop();
    alert("Ooops!! Our tracker had problems with finding a face in this image please try another image.")
  }, false);
  //if found the face and eyes
  document.addEventListener("clmtrackrConverged", function(event){
    //stop draw loops
    ctrack.stop();
    cancelRequestAnimFrame(drawRequest);
    glassesPositionCanvas();
  }, false);



function glassesPositionCanvas(){
  //Checks what eye is the left one and which one is the right eye
  pos = ctrack.getCurrentPosition();
  var leftCoors = {
    //coordinates provided by clmtracker they are stored ub ab arrat,
	x: pos[19][0],
	y: pos[19][1]};

var rightCoors = {
	x: pos[15][0],
	y: pos[15][1]};
// angle of the slant between the two eyes in degrees
//The Math.atan2() function returns the angle in the plane  between the positive x-axis and the ray from (0,0) to the point (x,y), for Math.atan2(y,x).
var angleDeg = Math.atan2(rightCoors.y - leftCoors.y, rightCoors.x - leftCoors.x) * 180 / Math.PI;
  var widthOfRectangle = pos[14][0] - pos[0][0];
  var heightOfRectangle = (pos[41][1]- pos[33][1])* 2;
  console.log("This is the width "+ widthOfRectangle);
  console.log("This is the height "+ heightOfRectangle);

  //rotating glasses if face is slanted
  overlay.style.webkitTransform = "rotate(" +angleDeg+"deg)";
  overlay.style.transform = "rotate(" +angleDeg+"deg)";
  overlay.style.msTransform = "rotate(" +angleDeg+"deg)";
  //drawGlasses();
//}
  //creates the image and places it after it has calculated the width of the neccesarry glasses
//function drawGlasses(){
  overlayCC.clearRect(0,0, overlay.width, overlay.height);
  console.log('it is in the drawGlasses');
  var img = new Image();
  //console.log('var img');
  img.src = stunnas;
  //console.log('img src to glasses' + img.src);
  img.onload = function() {
//console.log(img);
  overlayCC.drawImage(img, pos[0][0],pos[20][1],widthOfRectangle, img.height * (widthOfRectangle/img.width));
  console.log('drew image');
  };
}

  document.getElementById('eugene').onclick = function(e){
    stunnas = "assets/eugene.png";
    /*if (pos){
      drawGlasses();
    }
    else{*/
      canvasSearchMethod();
    //}
  }
  document.getElementById('sailor').onclick = function(e){
    stunnas = "assets/SAILOR.png";
    /*if (pos){
      drawGlasses();
    }
    else{*/
      canvasSearchMethod();
    //}
  }
  document.getElementById('SAINTBARTS').onclick = function(e){
    stunnas= "assets/SAINTBARTS.png";
    /*if (!pos){
      drawGlasses();
    }
    else{*/
      canvasSearchMethod();
    //}
  }
  document.getElementById('sky').onclick = function(e){
    stunnas= "assets/SKY.png";
    /*if (!pos){
      drawGlasses();
    }
    else{*/
      canvasSearchMethod();
    //}
  }

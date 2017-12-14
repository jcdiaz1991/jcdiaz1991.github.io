var pos;
var leftEye;
var rightEye;
var spaceBetweenEyes;
var widthOfRectangle;
var positionOfTrack;
//check is image is stored in local localStorage if not it sets default
$(function pictureCheck(){
  if (localStorage.getItem("glassesScan") !== null) {
    var savedImgLocal = localStorage.getItem('glassesScan');
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
      {maxHeight: 400, macWidth: 600,minHeight:400, orientation: true, canvas:true} // Options
  )
  }
});

/*$(document).ready(function () {
    canvasSearchMethod();
})*/

  document.getElementById('upload').onchange = function (e) {
    var loadingImage = loadImage(
        e.target.files[0],
        function (img) {

            var canvas = document.getElementById('imageGlasses'),
                context = canvas.getContext('2d'),
                overlay = document.getElementById('overlay'),
                overlayCC = overlay.getContext('2d');
                overlayCC.clearRect(0,0, overlay.width, overlay.height);
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img,canvas.width/2 - img.width/2,canvas.height/2 - img.height/2);
              var imgURL =   canvas.toDataURL();
              console.log("img.width "+ img.width, "canvas.width "+ canvas.width, img.left);
              localStorage.setItem("glassesScan", imgURL);
              canvasSearchMethod();
        },
        {maxHeight: 400, maxWidth:600, minHeight:400, orientation: true, canvas:true} // Options
    );
    };

var overlay;
var overlayCC;
var ctrack;
var drawRequest;
function canvasSearchMethod(){
  overlay = document.getElementById('overlay');
  var canvas = document.getElementById('imageGlasses')
  overlayCC = overlay.getContext('2d');
  ctrack = new clm.tracker({stopConvergence : true});
  ctrack.init();
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
    alert("The tracking had problems with finding a face in this image. Try selecting the face in the image manually.")
  }, false);
  // if if found the face and eyes
  document.addEventListener("clmtrackrConverged", function(event){
    //stop draw loops
    ctrack.stop();
    cancelRequestAnimFrame(drawRequest);
    glassesPositionCanvas();
  }, false);



function glassesPositionCanvas(){
  //Checks what eye is the left one and which one is the right eye
  pos = ctrack.getCurrentPosition();
  var widthOfRectangle = pos[14][0] - pos[0][0];
  var heightOfRectangle = (pos[41][1]- pos[33][1])* 2;
  console.log("This is the width "+ widthOfRectangle);
  console.log("This is the height "+ heightOfRectangle);
  //creates the image and places it after it has calculated the width of the neccesarry glasses

  var ctx = document.getElementById('overlay').getContext('2d');
  ctx.clearRect(0,0, document.getElementById('overlay').width, document.getElementById('overlay').height);
  var img = new Image();
  img.src = "assets/glasses2.png";
  img.onload = function() {

  ctx.drawImage(img, pos[0][0],pos[19][1],widthOfRectangle, img.height * (widthOfRectangle/img.width));
  //attach the glasses as a div element
  // var img = document.getElementById('overlay');
  //var eyes = document.createElement('img');
  //eyes.src = "media/glasses2.png";
  //document.querySelector('#container').appendChild(eyes);
  //img.classList.add('eyes');
  //img.style.width = widthOfRectangle + 'px';
  //img.style.height = "auto";
  //img.style.left = (pos[0][0] ) + 'px';
  //img.style.top = (pos[19][0]) + 'px';
  };}

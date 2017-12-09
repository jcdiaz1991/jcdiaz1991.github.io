var pos;
var cc = document.getElementById('image').getContext('2d');
var overlay = document.getElementById('overlay');
var overlayCC = overlay.getContext('2d');
var img = new Image();
img.onload = function() {
  cc.drawImage(img,0,0,625, 500);
};
img.src = './media/franck_02159.jpg';
var ctrack = new clm.tracker({stopOnConvergence : true});
ctrack.init();
stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
document.getElementById('container').appendChild( stats.domElement );
var drawRequest;
function animateClean() {
  ctrack.start(document.getElementById('image'));
  drawLoop();
}
function animate(box) {
  ctrack.start(document.getElementById('image'), box);
  drawLoop();
}
function drawLoop() {
  drawRequest = requestAnimFrame(drawLoop);
  overlayCC.clearRect(0, 0, 720, 576);
  if (ctrack.getCurrentPosition()) {
    ctrack.draw(overlay);
  }
}
// detect if tracker fails to find a face
document.addEventListener("clmtrackrNotFound", function(event) {
  ctrack.stop();
  alert("The tracking had problems with finding a face in this image. Try selecting the face in the image manually.")
}, false);
// detect if tracker loses tracking of face
document.addEventListener("clmtrackrLost", function(event) {
  ctrack.stop();
  alert("The tracking had problems converging on a face in this image. Try selecting the face in the image manually.")
}, false);
// detect if tracker has converged
document.addEventListener("clmtrackrConverged", function(event) {
  document.getElementById('convergence').innerHTML = "CONVERGED";
  document.getElementById('convergence').style.backgroundColor = "#00FF00";
  glassesPosition();
  // stop drawloop
  cancelRequestAnimFrame(drawRequest);
}, false);
// update stats on iteration
document.addEventListener("clmtrackrIteration", function(event) {
  stats.update();
}, false);
// manual selection of faces (with jquery imgareaselect plugin)
function selectBox() {
  overlayCC.clearRect(0, 0, 720, 576);
  document.getElementById('convergence').innerHTML = "";
  ctrack.reset();
  $('#overlay').addClass('hide');
  $('#image').imgAreaSelect({
    handles : true,
    onSelectEnd : function(img, selection) {
      // create box
      var box = [selection.x1, selection.y1, selection.width, selection.height];
      // do fitting
      animate(box);
      $('#overlay').removeClass('hide');
    },
    autoHide : true
  });
}
// function to start showing images
function loadImage() {
  if (fileList.indexOf(fileIndex) < 0) {
    var reader = new FileReader();
    reader.onload = (function(theFile) {
      return function(e) {
        // check if positions already exist in storage
        // Render thumbnail.
        var canvas = document.getElementById('image')
        var cc = canvas.getContext('2d');
        var img = new Image();
        img.onload = function() {
          if (img.height > 500 || img.width > 700) {
            var rel = img.height/img.width;
            var neww = 700;
            var newh = neww*rel;
            if (newh > 500) {
              newh = 500;
              neww = newh/rel;
            }
            canvas.setAttribute('width', neww);
            canvas.setAttribute('height', newh);
            cc.drawImage(img,0,0,neww, newh);
          } else {
            canvas.setAttribute('width', img.width);
            canvas.setAttribute('height', img.height);
            cc.drawImage(img,0,0,img.width, img.height);
          }
        }
        img.src = e.target.result;
      };
    })(fileList[fileIndex]);
    reader.readAsDataURL(fileList[fileIndex]);
    overlayCC.clearRect(0, 0, 720, 576);
    document.getElementById('convergence').innerHTML = "";
    ctrack.reset();
  }
}
// set up file selector and variables to hold selections
var fileList, fileIndex;
if (window.File && window.FileReader && window.FileList) {
  function handleFileSelect(evt) {
    var files = evt.target.files;
    fileList = [];
    for (var i = 0;i < files.length;i++) {
      if (!files[i].type.match('image.*')) {
        continue;
      }
      fileList.push(files[i]);
    }
    if (files.length > 0) {
      fileIndex = 0;
    }
    loadImage();
  }
  document.getElementById('files').addEventListener('change', handleFileSelect, false);
} else {
  $('#files').addClass("hide");
  $('#loadimagetext').addClass("hide");
};

function glassesPosition(){
  //Checks what eye is the left one and which one is the right eye
  pos = ctrack.getCurrentPosition();
  var widthOfRectangle = pos[14][0] - pos[0][0];
  var heightOfRectangle = (pos[41][1]- pos[33][1])* 2;
  console.log("This is the width "+ widthOfRectangle);
  console.log("This is the height "+ heightOfRectangle);
  //creates the image and places it after it has calculated the width of the neccesarry glasses
  var ctx = document.getElementById('overlay').getContext('2d');
  var img = new Image();
  img.src = "media/glasses2.png";
  //ctx.drawImage(img,0,0);
  //ctx.drawImage(img, pos[0][0],pos[19][0],widthOfRectangle,100);
  //alert('the image is drawn');
  img.onload = function() {
    //ctx.drawImage(img,0,0);
  ctx.drawImage(img, pos[0][0],pos[33][1],widthOfRectangle, heightOfRectangle);
  alert('ESSSKETTIIIIITT')};

//  var img = document.getElementById('overlay');
  //var eyes = document.createElement('img');
  //eyes.src = "media/glasses2.png";
  //document.querySelector('#container').appendChild(eyes);
  //img.classList.add('eyes');
  //img.style.width = widthOfRectangle + 'px';
  //img.style.height = "auto";
  //img.style.left = (pos[0][0] ) + 'px';
  //img.style.top = (pos[19][0]) + 'px';
};

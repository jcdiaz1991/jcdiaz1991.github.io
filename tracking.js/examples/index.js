var leftEye;
var rightEye;
var spaceBetweenEyes;
var widthOfRectangle;
var positionOfTrack;
//check is image is stored in local localStorage if not it sets default
$(function pictureCheck(){
  eyeCheck()
  if (localStorage.getItem("glassesScan") != null) {
  $("#imageGlasses").attr('src',localStorage.getItem('glassesScan'));
  };
});

$(document).ready(function () {
  $("#upload").on("change", OnGetFile);
  $("#drop").on("drop", OnGetFile);
  document.getElementById('imageGlasses').onload = function(){
  eyeCheck();
  //glassesPosition();
  };

  function OnGetFile (e) {

    $("#filename").html("Uploading file...");
    e.stopPropagation();
    e.preventDefault();
    var file = null;
    if (e.dataTransfer) {// file drag and drop
      file = e.dataTransfer.files[0] || null;
    } else if ($("#upload")[0].files) {// file upload
      file = $("#upload")[0].files[0] || null;
    }
    if (!file) {
      return;
    };
    //displays the image and stores it in the localStorage after it has uploaded
    var reader = new FileReader();
    reader.readAsDataURL(file, "UTF-8");
    reader.onload = function (e) {
      $('.eyes').remove();
      $('.rect').remove();
      //displays the file size and pic URL results once the file has been uploaded
      $("#filename").html("Result: '"+ file.name +"' ("+ e.target.result.length +" B)");
      $("#result").val(e.target.result);
      localStorage.setItem('glassesScan', e.target.result);
      $("#imageGlasses").attr('src',e.target.result);
      //once the image has loaded remove the previous scanned coordinates for the eyes and removes the glasses
      document.getElementById('imageGlasses').onload = function(){
        //rechecks for the position of eyes once the a new picture has been reuploaded
        eyeCheck();
      }
      };
    //if image failed to upload
    reader.onerror = function (e) {
      $("#result").val(e.target.error);
    };
    }
    });


//checks for where are the eyes in picture
function eyeCheck(){
  var img = document.getElementById('imageGlasses');
  //var tracker = new tracking.ObjectTracker(['face', 'eye', 'mouth']);
  //creates the tracker
  var tracker = new tracking.ObjectTracker(['eye']);
  tracker.setStepSize(1.0);
  tracking.track('#imageGlasses', tracker);
  //for each eye it has found place a rectangle around it.
  tracker.on('track', function(event) {
    event.data.forEach(function(rect) {
      window.plot(rect.x, rect.y, rect.width, rect.height);
      positionOfTrack = $('.rect');
      console.log("This is the on foreach call of the variable " + positionOfTrack);
    });
    glassesPosition();
  });
  //this actually places the rectangle after it has found out where the eyes are at.
  window.plot = function(x, y, w, h) {

    var rect = document.createElement('div');
    //rect.src = "assets/glasses2.png";
    document.querySelector('.demo-container').appendChild(rect);
    rect.classList.add('rect');
    rect.style.width = w + 'px';
    rect.style.height = h + 'px';
    rect.style.left = (img.offsetLeft + x) + 'px';
    rect.style.top = (img.offsetTop + y) + 'px';
  };
}

function glassesPosition(){
  //Checks what eye is the left one and which one is the right eye
  console.log("This is the glassesPosition function call " + positionOfTrack);
  var leftIf = positionOfTrack[0].offsetLeft;
  var rightIf = positionOfTrack[1].offsetLeft;
  if (leftIf < rightIf) {
    leftEye = positionOfTrack[0];
    rightEye  = positionOfTrack[1];
  }
  else {
    leftEye = positionOfTrack[1];
    rightEye  = positionOfTrack[0];
    };
    //calculates the width of the eyes and space between the eyes to place the glasses
  spaceBetweenEyes = rightEye.offsetLeft - (leftEye.offsetLeft + leftEye.scrollWidth) ;
  widthOfRectangle = leftEye.scrollWidth + rightEye.scrollWidth + spaceBetweenEyes;
  //creates the image and places it after it has calculated the width of the neccesarry glasses
  var img = document.getElementById('imageGlasses');
  var eyes = document.createElement('img');
  eyes.src = "assets/glasses2.png";
  document.querySelector('.demo-container').appendChild(eyes);
  eyes.classList.add('eyes');
  eyes.style.width = (widthOfRectangle + 25) + 'px';
  eyes.style.height = "auto";
  eyes.style.left = (img.offsetLeft + leftEye.offsetLeft - 15 ) + 'px';
  eyes.style.top = (img.offsetLeft + leftEye.offsetTop) + 'px';
}

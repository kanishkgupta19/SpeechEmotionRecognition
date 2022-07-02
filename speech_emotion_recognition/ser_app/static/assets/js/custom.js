var mode="auto";
var emotion="";


// Key Press Functions

document.addEventListener('keypress', logKey);

function logKey(e) {
  // console.log(e);
  switch (e.code) {
    case 'KeyM':
      if(mode=='auto')
        mode = 'manual';
      else
        mode='auto';
      break;
  
    case 'KeyH':
      emotion='happy';
      break;
    case 'KeyS':
      emotion='sad';
      break;
    case 'KeyC':
      emotion='calm';
      break;
    case 'KeyA':
      emotion='angry';
      break;
    case 'KeyP':
    emotion='surprise';
    break;
    case 'KeyN':
      emotion='neutral';
      break;
    case 'KeyD':
      emotion='disgust';
      break;
    case 'KeyF':
      emotion='fearful';
      break;
    default:
      break;
  }
  if(mode === 'auto')
    document.getElementById('modetext').innerHTML="A";
  if(mode === 'manual')
    document.getElementById('modetext').innerHTML="M";
  console.log(mode, emotion);
}

function getManualEmotion(){
  setTimeout(function(){
    document.getElementById('submitButton').innerHTML=' Recognize Emotion';
    document.getElementById('result').innerHTML="<img class='mx-auto block' src='/static/img/"+emotion+".png' style='width:10rem'/><h3 class='mx-auto mt-5' style='color:white; text-transform:uppercase;'>"+emotion+"</h3>";
    document.getElementById('processing').style="display:none";
    document.getElementById('visualize').style='display:block';
    SendEmotionToArduino(emotion);
  }, 3000)
}

function getEmotion(){
  console.log("Recognizing Emotion....");
  document.getElementById('visualize').style='display:none;';
  document.getElementById('processing').style="display:block;";
  document.getElementById('result').innerHTML='';
  document.getElementById("arduino").innerHTML='';
  if(mode=='manual')
  {
    getManualEmotion();
    return;
  }
    var formData = new FormData($("#fileUpload")[0]);
    $.ajax({
    type: "POST",
    url: "/recognize-speech",
    data: formData,
    processData: false,               // IMPORTANT for sending formdata in JSON
    contentType: false,
    success: function (results) {
      console.log(results);
      if(results.emotion=="null"){
        setTimeout(function(){console.log("Waiting..")}, 4000);
      }
      if (results.status=="success" || (results.status=="failed" && results.emotion=="null")) {
        if(results.emotion==="null")
        {
          results.emotion=emotion;
        }
          document.getElementById('submitButton').innerHTML=' Recognize Emotion';
          document.getElementById('result').innerHTML="<img class='mx-auto block' src='/static/img/"+results.emotion+".png' style='width:10rem'/><h3 class='mx-auto mt-5' style='color:white; text-transform:uppercase;'>"+results.emotion+"</h3>";
          // document.getElementById('visualize').innerHTML='<img src="/static/img/figure.jpeg" style="width:100%;"">';
          document.getElementById('processing').style="display:none";
          document.getElementById('visualize').style='display:block';
          SendEmotionToArduino(results.emotion);
      }
    },
    error: function (data) {
      $('body').html(data.responseText);
      document.getElementById("alertmessage").innerHTML = "<div class='alert alert-danger'>Some Error Occured</div>";
    }
  });
}


function visualizeAudio(){
    var formData = new FormData($("#fileUpload")[0]);
    document.getElementById('visualize').innerHTML="Visualizing....";
    $.ajax({
    type: "POST",
    url: "/visualize-audio",
    data: formData,
    processData: false,               // IMPORTANT for sending formdata in JSON
    contentType: false,
    success: function (results) {
      if (results.status=="success") {
         document.getElementById('visualize').style="display:contents";
         getEmotion();
      }
    },
    error: function (data) {
      $('body').html(data.responseText);
      document.getElementById("alertmessage").innerHTML = "<div class='alert alert-danger'>Some Error Occured</div>";
    }
  });

 }

function changeFilename() {
  var file = $('#audio-file')[0].files[0];
  document.getElementById('fileName').innerHTML = file.name;
  console.log($('#audio-file')[0].files);
  
}

function uploadaudio(){
    var file = $('#audio-file')[0].files[0];
    if(mode==='manual')
    {
      getEmotion();
      return;
    }
    if(file==null)
    {
        alert("No File Selected");
        return;
    }

    document.getElementById('submitButton').innerHTML="Uploading....";
    var formData = new FormData($("#fileUpload")[0]);
    formData.append('audio-file', file);
    // let token = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    $.ajax({
    type: "POST",
    url: "/upload-audio",
    data: formData,
    processData: false,               // IMPORTANT for sending formdata in JSON
    contentType: false,
    success: function (results) {
      if (results) {
          console.log(results.status);
          document.getElementById('submitButton').innerHTML='Please Wait....';
          // visualizeAudio();
          getEmotion()
      }
    },
    error: function (data) {
      $('body').html(data.responseText);
      document.getElementById("alertmessage").innerHTML = "<div class='alert alert-danger'>Some Error Occured</div>";
    }
  });
}


function initRecording()
{
    document.getElementById('recording-studio').style.display="block";
    document.getElementById('init-btn').style.display="none";
	let audioIN = { audio: true };

	navigator.mediaDevices.getUserMedia(audioIN)
	.then(function (mediaStreamObj) {

		let audio = document.querySelector('audio');

		let mediaRecorder = new MediaRecorder(mediaStreamObj);

		//let btn = document.getElementsByClassName('start-btn')[0];
		
        $('#start-btn').click(function (e) { 
            mediaRecorder.start();
            document.getElementById('audio-text').innerHTML="Recording...";
            console.log("Start Recording....")
            
        });
        

        $('#stop-btn').click(function (e) { 
            mediaRecorder.stop();
            document.getElementById('audioPlay').style.display="block";
            document.getElementById('audio-text').innerHTML="Audio Recorded";
            console.log("Recording Stopped");
        });


        /*stopBtn.addEventListener("click", function (ev) {
            mediaRecorder.stop();
            stopBtn.innerHTML="Recorded";
            startBtn.className="start-btn";
        });*/
	

		mediaRecorder.ondataavailable = function (ev) {
		dataArray.push(ev.data);
		}

		let dataArray = [];

		mediaRecorder.onstop = function (ev) {
    console.log(dataArray);
		let audioData = new Blob(dataArray,{ 'type': 'audio/wav;' });
		dataArray = [];
		let audioSrc = window.URL.createObjectURL(audioData);
    if(mode==='auto')
      download('recordedaudiokkk.wav', audioSrc);


        let playAudio = document.getElementById('audioPlay');
		playAudio.src = audioSrc;
        console.log("Audio Stop")
		}
	});
}

function download(filename, audioSrc) {
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = audioSrc;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function SendEmotionToArduino(emotion){
  document.getElementById('arduino').innerHTML="Sending Message To Arduino...";
  $.ajax({
    type: "GET",
    url: "http://b9fa2f1ad3ff.ngrok.io/arduino/"+emotion,
    success: function (results) {
      if (results) {
          console.log(results.status);
          document.getElementById('arduino').innerHTML='Message Sent To Arduino';
          console.log("Emotion Send");
      }
    },
    error: function (data) {
      // $('body').html(data.responseText);
      document.getElementById("arduino").innerHTML = "<div class='alert alert-danger'>Some Error Occured</div>";
    }
  });
}

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

		let audioData = new Blob(dataArray,{ 'type': 'audio/wav;' });
			
		dataArray = [];
		let audioSrc = window.URL.createObjectURL(audioData);

        let playAudio = document.getElementById('audioPlay');
		playAudio.src = audioSrc;
        console.log("Audio Stop")
		}
	});
}


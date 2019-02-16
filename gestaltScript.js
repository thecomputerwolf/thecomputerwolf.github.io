const video = document.querySelector('.video');
const juice = document.querySelector('.orange-juice');
const scrubber = document.querySelector('.scrubber');
const btn = document.getElementById('play-pause');

$.getJSON("gatesHighlights.json", function(json) {
	let holyHighlights = json.these;

// Instantiates frames[] equal to the 400 divs according to the HTML structure
let numFrames = 800;  // THIS IS A MAGIC NUMBER!!!  BEWARE!!
let frames = [];
	
for (let i=0; i <= numFrames; i++) {
	let temp = 'f' + i;
	frames[i] = document.getElementById(temp);
}

let currentHighlight = holyHighlights[0];
let currentIndex = 0;

let s = 0;
let m = 0;
let time = 0;
let mostRecentHighlight = 0;


function togglePlayPause() {
	if (video.paused) {
		btn.className = "pause";
		video.play();
	} else {
		btn.className = "play";
		video.pause();
	}
}

btn.onclick = function() {
	togglePlayPause();
	//console.log("I am the rank of the first vid: " + holyHighlights[0].rank);
};


// On Update!!!
video.ontimeupdate = function(){

	// Expanding the highlighted frames
	let frame_duration = video.duration / numFrames;
	
	for (j = 1; j < holyHighlights.length; j++) {
    let first_frame_to_expand = Math.round(holyHighlights[j].start_time / frame_duration);
		let last_frame_to_expand = Math.round(holyHighlights[j].end_time / frame_duration);
		while (first_frame_to_expand <= last_frame_to_expand) {
			elongate_highlight_frames(first_frame_to_expand, holyHighlights[j].section_rank);
			first_frame_to_expand++;
		} 
	}
	

	let watched_frame = parseInt(Math.floor((video.currentTime / video.duration) * numFrames));
	console.log("This is the watched_fram value: " + watched_frame)
	color_in_frame(watched_frame);
	
	//Defining current video time (seconds)
	s = parseInt(video.currentTime % 60);
	m = parseInt((video.currentTime / 60) % 60);
	time = m * 60 + s;
	//document.getElementById("timeDemo").innerHTML = currentHighlight.rank;
	document.getElementById("timeDemo").innerHTML = parseInt(video.currentTime);
	//document.getElementById("highlightTitle").innerHTML = currentHighlight.title;
	document.getElementById("sectionTitle").innerHTML = currentHighlight.section_title;

	//Making the seek scrubber mark where it is and how much of the video it's gone through
	let juicePos = video.currentTime / video.duration;
	scrubber.style.marginLeft = juicePos * 100 + "%";
	//juice.style.width = juicePos * 100 + "%";
	if(video.ended) {
		btn.className = "play";
	}

};

	
	// Function to send people to their desired highlight
function goToHighlight(index) {
	video.currentTime = holyHighlights[index].start_time;
	currentHighlight = holyHighlights[index];
	currentIndex = index;
}

function nextHighlight() {
    if (currentIndex < (holyHighlights.length - 1)) {
        let index = currentIndex + 1;
        goToHighlight(index);
    }
}

function prevHighlight() {
	if (currentIndex > 0) {
        let index = currentIndex - 1;
        goToHighlight(index);
    }
}
	
// Listening for different key presses
document.onkeydown = function(event) {

	switch (event.keyCode) {
		// Left Arrow key
		case 37:
			video.currentTime -= 10;
			break;
		// Right Arrow key
		case 39:
			video.currentTime += 10;
		// 'S' key
		case 83:
			// Make the juice-bar reduce to 2/3 size
			// Specify that you are decrementing currentLevel
			break;
		// 'A' key
		case 65:
			if (currentIndex > 0) {
				goToHighlight(currentIndex - 1);
			}
			break;
		// 'D' key
    case 68:
			if (currentIndex < (holyHighlights.length - 1)) {
				goToHighlight(currentIndex + 1);
			}
	 		break;
	}

};

// Elongate the frames within the time of each highlight
	function elongate_highlight_frames(myHighFrame, rank){
		
		let scalarHeight = (((1 + holyHighlights.length - rank) / holyHighlights.length) * 40) + 10;
		let scalarMargin = (50 - scalarHeight)/2;
		
		frames[myHighFrame].style.height = scalarHeight + "px";
		frames[myHighFrame].style.marginTop = scalarMargin + "px";
		frames[myHighFrame].style.marginBottom = scalarMargin + "px";

		
		/**if (rank == 25) {
			console.log("fugedaboudih");
			frames[myHighFrame].style.height = 10 + "px";
			//frames[myHighFrame].style.margin = 0 + "px " + 0 + "px";
		} else {*/
			//frames[myHighFrame].style.height = 50 + "px";
			//frames[myHighFrame].style.margin = 0 + "px " + 0 + "px";
		//}
	}
	
// Coloring in Watched Frames
function color_in_frame(frameNum) {
	frames[frameNum].style.backgroundColor = "#FC74FD";

}
});
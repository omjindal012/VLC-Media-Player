// https://www.w3schools.com/tags/ref_av_dom.asp

let videoBtn = document.querySelector("#video-btn");
let videoInput = document.querySelector("#video-input");
let main = document.querySelector("#main");
let img = document.querySelector("#main-img");

const currentTime = document.querySelector("#currentTime");
const slider = document.querySelector("#slider");
const totalTime = document.querySelector("#totalTime");

let currentvideo = "";
let duration;
let timer;
let currentPlayTime = 0;
let isPlaying = false;

// Handle Input
let inputHandler = () => {
  videoInput.click();
};

let acceptInputHandler = (obj) => {
  if(currentvideo){
    stopHandler();
  }
  let selectedVideo;
  console.log(obj);
  if (obj.type == "drop") {
    selectedVideo = obj.dataTransfer.files[0];
  } else {
    selectedVideo = obj.target.files[0];
  }
  // src -> base 64
  const link = URL.createObjectURL(selectedVideo);
  const video = document.createElement("video");
  video.src = link;
  video.setAttribute("class", "video");
  img.style.display = "none";
  main.appendChild(video);
  video.volume = 0.3;
  currentvideo = video;
  isPlaying = true;
  setPlayPause();
  video.addEventListener("loadedmetadata", function () {
    // it gives in decimal value -> convert that into seconds
    duration = Math.round(video.duration);
    slider.setAttribute("max", duration);
    // convert seconds into hrs:mins:secs
    let time = timeFormat(duration);
    totalTime.innerText = time;
    startTimer();
  });
};

videoBtn.addEventListener("click", inputHandler);
videoInput.addEventListener("change", acceptInputHandler);

// Speed & Volume Controls
let speedUp = document.querySelector("#speedUp");
let speedDown = document.querySelector("#speedDown");
let volumeUp = document.querySelector("#volumeUp");
let volumeDown = document.querySelector("#volumeDown");
const toast = document.querySelector(".toast");

let showToast = (message) => {
  toast.textContent = message;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 1500);
};

let speedUpHandler = () => {
  const video = document.querySelector("video");
  if (video == null) return;
  if (video.playbackRate >= 3) return;
  let currentSpeed = video.playbackRate;
  let increasedSpeed = currentSpeed + 0.5;
  video.playbackRate = increasedSpeed;
  showToast(increasedSpeed + "x");
};

let speedDownHandler = () => {
  const video = document.querySelector("video");
  if (video == null) return;
  if (video.playbackRate <= 0.5) return;
  let currentSpeed = video.playbackRate;
  let decreasedSpeed = currentSpeed - 0.5;
  video.playbackRate = decreasedSpeed;
  showToast(decreasedSpeed + "x");
};

let volumeUpHandler = () => {
  const video = document.querySelector("video");
  if (video == null) return;
  if (video.volume >= 0.9) return;
  let currentVolume = video.volume;
  let increasedVolume = currentVolume + 0.1;
  video.volume = increasedVolume;
  let percentage = increasedVolume * 100;
  showToast(percentage + "%");
};

let volumeDownHandler = () => {
  const video = document.querySelector("video");
  if (video == null) return;
  if (video.volume <= 0.1) {
    video.volume = 0;
    return;
  }
  let currentVolume = video.volume;
  let decreasedVolume = currentVolume - 0.1;
  video.volume = decreasedVolume;
  let percentage = decreasedVolume * 100;
  showToast(percentage + "%");
};

speedUp.addEventListener("click", speedUpHandler);
speedDown.addEventListener("click", speedDownHandler);
volumeUp.addEventListener("click", volumeUpHandler);
volumeDown.addEventListener("click", volumeDownHandler);

// Full Screen
let fullScreen = document.querySelector("#fullScreen");
let fullScreenHandler = () => {
  main.requestFullscreen();
};
fullScreen.addEventListener("click", fullScreenHandler);

// Time Formatting :- seconds to (hr : min : sec)
function timeFormat(timeCount) {
  let time = "";
  const sec = parseInt(timeCount, 10);
  let hours = Math.floor(sec / 3600);
  let minutes = Math.floor((sec - hours * 3600) / 60);
  let seconds = sec - hours * 3600 - minutes * 60;
  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;
  time = `${hours}:${minutes}:${seconds}`;
  return time;
}

// Slider & Timer
function startTimer() {
  timer = setInterval(function () {
    currentPlayTime = Math.round(currentvideo.currentTime);
    slider.value = currentPlayTime;
    const time = timeFormat(currentPlayTime);
    currentTime.innerText = time;
    if (currentPlayTime >= duration) {
      stopHandler();
    }
  }, 1000);
}
function stopTimer() {
  clearInterval(timer);
}

// Play & Pause
const playPauseContainer = document.querySelector("#playPause");
function setPlayPause() {
  if (isPlaying === true) {
    playPauseContainer.innerHTML = `<i class="fas fa-pause state"></i>`;
    currentvideo.play();
  } else {
    playPauseContainer.innerHTML = `<i class="fas fa-play state"></i>`;
    currentvideo.pause();
  }
}

playPauseContainer.addEventListener("click", function (e) {
  if (currentvideo) {
    isPlaying = !isPlaying;
    setPlayPause();
  }
});

// Stop
const stopBtn = document.querySelector("#stopBtn");
const stopHandler = () => {
  if (currentvideo) {
    let video = currentvideo;
    video.remove();
    img.style.display = "inline";
    stopTimer();
    isPlaying = false;
    setPlayPause();
    currentPlayTime = 0;
    currentvideo = "";
    duration = "";
    currentTime.innerText = "00:00:00";
    totalTime.innerText = "--/--/--";
    slider.value = 0;
    videoInput.value = "";
  }
};
stopBtn.addEventListener("click", stopHandler);

// Control behavior of slider
slider.addEventListener("change", function (e) {
  if(currentvideo){
    let value = e.target.value;
    currentvideo.currentTime = value;
  }else{
    slider.value = 0;
  }
});

// Forward & Backward
const forwardBtn = document.querySelector("#forwardBtn");
const backwardBtn = document.querySelector("#backBtn");

function forward() {
  if (currentvideo) {
    showToast("+5 sec");
    currentPlayTime = Math.round(currentvideo.currentTime) + 5;
    if (currentPlayTime > duration) currentPlayTime = duration;
    currentvideo.currentTime = currentPlayTime;
    slider.setAttribute("value", currentPlayTime);
    let time = timeFormat(currentPlayTime);
    currentTime.innerText = time;
  }
}
function backward() {
  if (currentvideo) {
    currentPlayTime = Math.round(currentvideo.currentTime) - 5;
    if (currentPlayTime < 0) currentPlayTime = 0;
    currentvideo.currentTime = currentPlayTime;
    slider.setAttribute("value", currentPlayTime);
    showToast("-5 sec");
    let time = timeFormat(currentPlayTime);
    currentTime.innerText = time;
  }
}

forwardBtn.addEventListener("click", forward);
backwardBtn.addEventListener("click", backward);

// Enable Drag & Drop
// Prevent default behavior for dragover and dragleave events
main.addEventListener("dragenter", (e) => {
  e.preventDefault();
});

main.addEventListener("dragover", (e) => {
  e.preventDefault();
});

main.addEventListener("dragleave", (e) => {
  e.preventDefault();
});

main.addEventListener("drop", (e) => {
  e.preventDefault();
  acceptInputHandler(e);
});

const body = document.querySelector("body");
// keyboard inputs
body.addEventListener("keyup", function (e) {
  if (!video) return;
  if (e.code == "Space") {
    isPlaying = !isPlaying
    setPlayPause();
  }
  else if (e.key == "ArrowUp") {
    volumeUpHandler()
  }
  else if (e.key == "ArrowDown") {
    volumeDownHandler();
  }
  else if (e.key == "+") {
    speedUpHandler();
  }
  else if (e.key == "-") {
    speedDownHandler();
  }
  else if (e.key == "ArrowRight") {
    forward();
  }
  else if (e.key == "ArrowLeft") {
    backward();
  }
})
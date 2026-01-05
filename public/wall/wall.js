const socket = io();
const wallImg = document.getElementById("wall-img");
const wallText = document.getElementById("wall-text");
const overlay = document.getElementById("overlay");

let photos = [];
let state = {};
let index = 0;
let slideshowTimer;

// Inizializzazione socket
socket.on("init", data => {
  console.log("Init data ricevuti dal server:", data); // <-- DEBUG
  photos = data.wallPhotos;
  state = data.wallState;
  render();
});

socket.on("wall-update", data => {
  photos = data.wallPhotos;
  state = data.wallState;
  render();
});

function render() {
  overlay.innerText = state.overlay;

  clearTimeout(slideshowTimer);

  if (state.mode === "single" && state.activePhoto) {
    showPhoto(state.activePhoto);
  } else if (state.mode === "slideshow") {
    slideshow();
  } else if (state.mode === "grid") {
    if (photos.length > 0) showPhoto(photos[0]);
  }
}

function showPhoto(photo) {
  wallImg.src = photo.image; // legge direttamente da /uploads
  wallText.innerText = photo.text || "";
  wallImg.style.opacity = 1;
}

// Slideshow con dissolvenza
function slideshow() {
  if (photos.length === 0) return;

  const photo = photos[index % photos.length];
  index++;

  wallImg.style.transition = "opacity 1s";
  wallImg.style.opacity = 0;

  setTimeout(() => {
    showPhoto(photo);
  }, 500); // transizione dissolvenza

  slideshowTimer = setTimeout(slideshow, 12000); // 12 secondi per foto
}

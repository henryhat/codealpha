//MY PLAYLIST
const TRACKS = [
  {
    title: "Give me Chance",
    artist: "Bidemi Olaoba ft Mercy Chinwo",
    emoji: "🌙",
    color: "#2A1F5C",
    src: "assets/Bidemi-Olaoba-feat-Mercy-Chinwo-Give-Me-Chance-(CeeNaija.com).mp3",
    duration: "4:16",
  },
  {
    title: "My God",
    artist: "Minister BBO",
    emoji: "🎹",
    color: "#1F3A2A",
    src: "assets/BBO-My-God-(CeeNaija.com).mp3",
    duration: "5:19",
  },
  {
    title: "Most High",
    artist: "Minister BBO",
    emoji: "🎻",
    color: "#3A1F1F",
    src: "assets/BBO_-_Most_High_CeeNaija.com_.mp3",
    duration: "5:25",
  },
  {
    title: "Calling You",
    artist: "Ebuka Songs",
    emoji: "🎹",
    color: "#1A2A3A",
    src: "assets/Ebuka_Songs_-_Calling_CeeNaija.com_.mp3",
    duration: "8:20",
  },
  {
    title: "I am a Soldier",
    artist: "Ebuka Songs",
    emoji: "🎷",
    color: "#2A1A00",
    src: "assets/Ebuka_Songs_-_Calling_My_Name_Im_A_Soldier__CeeNaija.com_.mp3",
    duration: "12:27",
  },
  {
    title: "Jesus Christ Is Seen",
    artist: "Ebuka Songs",
    emoji: "🌕",
    color: "#1F1F3A",
    src: "assets/Ebuka_Songs_-_Jesus_Christ_Is_Seen_CeeNaija.com_.mp3",
    duration: "3:56",
  },
];

// ─────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────
let currentIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let simInterval = null; // simulation interval for environments without audio

// ─────────────────────────────────────────────
// ELEMENTS
// ─────────────────────────────────────────────
const audio = document.getElementById("audioEl");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");
const progressTrack = document.getElementById("progressTrack");
const progressFill = document.getElementById("progressFill");
const timeElapsed = document.getElementById("timeElapsed");
const timeDuration = document.getElementById("timeDuration");
const volumeSlider = document.getElementById("volumeSlider");
const volumePct = document.getElementById("volumePct");
const volWave1 = document.getElementById("volWave1");
const volWave2 = document.getElementById("volWave2");
const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");
const vinylWrap = document.getElementById("vinylWrap");
const vinylArt = document.getElementById("vinylArt");
const iconPlay = document.getElementById("iconPlay");
const iconPause = document.getElementById("iconPause");
const playlistList = document.getElementById("playlistList");
const playlistDrawer = document.getElementById("playlistDrawer");
const playlistToggleBtn = document.getElementById("playlistToggleBtn");
const autoplayCheck = document.getElementById("autoplayCheck");

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function fmt(s) {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function setPlayIcon(playing) {
  iconPlay.style.display = playing ? "none" : "block";
  iconPause.style.display = playing ? "block" : "none";
  playPauseBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
}

function updateVolumeUI(val) {
  const v = parseInt(val);
  volumePct.textContent = v + "%";
  const pct = v / 100;
  // update slider fill via CSS background
  volumeSlider.style.background = `linear-gradient(90deg, var(--violet) ${v}%, var(--elevated) ${v}%)`;
  // show/hide wave paths
  volWave1.style.opacity = v > 0 ? 1 : 0;
  volWave2.style.opacity = v > 50 ? 1 : 0;
  audio.volume = pct;
}

// ─────────────────────────────────────────────
// LOAD TRACK
// ─────────────────────────────────────────────
function loadTrack(idx, autoPlay = false) {
  const t = TRACKS[idx];
  currentIndex = idx;

  songTitle.textContent = t.title;
  songArtist.textContent = t.artist;
  vinylArt.textContent = t.emoji;
  vinylArt.style.background = t.color;
  document.title = `${t.title} — CodeAlpha`;

  progressFill.style.width = "0%";
  timeElapsed.textContent = "0:00";
  timeDuration.textContent = t.duration; // show static duration as fallback

  audio.src = t.src;
  audio.load();

  updatePlaylistHighlight();

  if (autoPlay) {
    playTrack();
  } else {
    pauseTrack();
  }
}

// ─────────────────────────────────────────────
// PLAY / PAUSE
// ─────────────────────────────────────────────
function playTrack() {
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        isPlaying = true;
        setPlayIcon(true);
        vinylWrap.classList.add("playing");
      })
      .catch(() => {
        // Audio blocked (e.g. CORS or autoplay policy) — run simulation
        startSimulation();
      });
  }
}

function pauseTrack() {
  audio.pause();
  stopSimulation();
  isPlaying = false;
  setPlayIcon(false);
  vinylWrap.classList.remove("playing");
}

function togglePlayPause() {
  if (isPlaying) {
    pauseTrack();
  } else {
    playTrack();
  }
}

// ─────────────────────────────────────────────
// SIMULATION MODE (when audio fails to load)
// ─────────────────────────────────────────────
let simTime = 0;
let simDuration = 180; // 3 min default

function startSimulation() {
  isPlaying = true;
  setPlayIcon(true);
  vinylWrap.classList.add("playing");
  stopSimulation();
  simTime = audio.currentTime || 0;

  // Try to parse duration from static string
  const dStr = TRACKS[currentIndex].duration;
  const parts = dStr.split(":");
  simDuration = parseInt(parts[0]) * 60 + parseInt(parts[1]);
  timeDuration.textContent = dStr;

  simInterval = setInterval(() => {
    simTime += 0.25;
    if (simTime >= simDuration) {
      simTime = 0;
      stopSimulation();
      handleTrackEnd();
      return;
    }
    const pct = (simTime / simDuration) * 100;
    progressFill.style.width = pct + "%";
    timeElapsed.textContent = fmt(simTime);
  }, 250);
}

function stopSimulation() {
  if (simInterval) {
    clearInterval(simInterval);
    simInterval = null;
  }
}

// ─────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────
function nextTrack() {
  let idx;
  if (isShuffle) {
    do {
      idx = Math.floor(Math.random() * TRACKS.length);
    } while (idx === currentIndex && TRACKS.length > 1);
  } else {
    idx = (currentIndex + 1) % TRACKS.length;
  }
  loadTrack(idx, isPlaying || autoplayCheck.checked);
}

function prevTrack() {
  // If more than 3s in, restart; else go back
  const pos = simInterval ? simTime : audio.currentTime;
  if (pos > 3) {
    audio.currentTime = 0;
    simTime = 0;
  } else {
    const idx = (currentIndex - 1 + TRACKS.length) % TRACKS.length;
    loadTrack(idx, isPlaying);
  }
}

function handleTrackEnd() {
  if (isRepeat) {
    loadTrack(currentIndex, true);
  } else if (autoplayCheck.checked) {
    nextTrack();
  } else {
    pauseTrack();
    progressFill.style.width = "0%";
    timeElapsed.textContent = "0:00";
  }
}

// ─────────────────────────────────────────────
// AUDIO EVENTS
// ─────────────────────────────────────────────
audio.addEventListener("loadedmetadata", () => {
  if (isFinite(audio.duration)) {
    timeDuration.textContent = fmt(audio.duration);
    simDuration = audio.duration;
  }
});

audio.addEventListener("timeupdate", () => {
  if (!audio.duration || !isFinite(audio.duration)) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width = pct + "%";
  timeElapsed.textContent = fmt(audio.currentTime);
  timeDuration.textContent = fmt(audio.duration);
});

audio.addEventListener("ended", handleTrackEnd);

audio.addEventListener("play", () => {
  stopSimulation();
  isPlaying = true;
  setPlayIcon(true);
  vinylWrap.classList.add("playing");
  updatePlaylistBars(true);
});

audio.addEventListener("pause", () => {
  isPlaying = false;
  setPlayIcon(false);
  vinylWrap.classList.remove("playing");
  updatePlaylistBars(false);
});

// ─────────────────────────────────────────────
// SEEK
// ─────────────────────────────────────────────
function seekTo(e) {
  const rect = progressTrack.getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

  if (audio.duration && isFinite(audio.duration)) {
    audio.currentTime = ratio * audio.duration;
  } else if (simInterval || isPlaying) {
    simTime = ratio * simDuration;
    progressFill.style.width = ratio * 100 + "%";
    timeElapsed.textContent = fmt(simTime);
  }
}

progressTrack.addEventListener("click", seekTo);
let isDragging = false;
progressTrack.addEventListener("mousedown", () => {
  isDragging = true;
});
document.addEventListener("mousemove", (e) => {
  if (isDragging) seekTo(e);
});
document.addEventListener("mouseup", () => {
  isDragging = false;
});

progressTrack.addEventListener("keydown", (e) => {
  const step = 5;
  const cur = simInterval ? simTime : audio.currentTime || 0;
  const dur = simDuration || audio.duration || 180;
  if (e.key === "ArrowRight") {
    const t = Math.min(cur + step, dur);
    if (audio.duration) audio.currentTime = t;
    else simTime = t;
  } else if (e.key === "ArrowLeft") {
    const t = Math.max(cur - step, 0);
    if (audio.duration) audio.currentTime = t;
    else simTime = t;
  }
});

// ─────────────────────────────────────────────
// VOLUME
// ─────────────────────────────────────────────
volumeSlider.addEventListener("input", () => {
  updateVolumeUI(volumeSlider.value);
});

// ─────────────────────────────────────────────
// SHUFFLE / REPEAT
// ─────────────────────────────────────────────
shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);
  shuffleBtn.title = isShuffle ? "Shuffle: ON" : "Shuffle: OFF";
});

repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle("active", isRepeat);
  repeatBtn.title = isRepeat ? "Repeat: ON" : "Repeat: OFF";
});

// ─────────────────────────────────────────────
// PLAYLIST
// ─────────────────────────────────────────────
function buildPlaylist() {
  playlistList.innerHTML = "";
  TRACKS.forEach((t, i) => {
    const li = document.createElement("li");
    li.className = "track-item" + (i === currentIndex ? " active" : "");
    li.setAttribute("role", "option");
    li.setAttribute("aria-selected", i === currentIndex);
    li.dataset.index = i;
    li.innerHTML = `
      <div class="bars${isPlaying && i === currentIndex ? "" : " paused"}">
        <div class="bar"></div><div class="bar"></div><div class="bar"></div>
      </div>
      <span class="track-num">${i + 1}</span>
      <div class="track-emoji">${t.emoji}</div>
      <div class="track-details">
        <div class="track-name">${t.title}</div>
        <div class="track-artist-sm">${t.artist}</div>
      </div>
      <span class="track-dur">${t.duration}</span>`;
    li.addEventListener("click", () => loadTrack(i, true));
    playlistList.appendChild(li);
  });
}

function updatePlaylistHighlight() {
  const items = playlistList.querySelectorAll(".track-item");
  items.forEach((el, i) => {
    el.classList.toggle("active", i === currentIndex);
    el.setAttribute("aria-selected", i === currentIndex);
    const bars = el.querySelector(".bars");
    const num = el.querySelector(".track-num");
    if (i === currentIndex) {
      bars.style.display = "flex";
      num.style.display = "none";
    } else {
      bars.style.display = "none";
      num.style.display = "block";
    }
  });
}

function updatePlaylistBars(playing) {
  const activeItem = playlistList.querySelector(".track-item.active .bars");
  if (activeItem) {
    activeItem.classList.toggle("paused", !playing);
  }
}

// Scroll active item into view when playlist opens
playlistToggleBtn.addEventListener("click", () => {
  const open = playlistDrawer.classList.toggle("open");
  playlistToggleBtn.setAttribute("aria-expanded", open);
  if (open) {
    setTimeout(() => {
      const active = playlistList.querySelector(".track-item.active");
      if (active)
        active.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }, 350);
  }
});

// ─────────────────────────────────────────────
// CONTROLS WIRING
// ─────────────────────────────────────────────
playPauseBtn.addEventListener("click", togglePlayPause);
prevBtn.addEventListener("click", prevTrack);
nextBtn.addEventListener("click", nextTrack);

// ─────────────────────────────────────────────
// KEYBOARD SHORTCUTS
// ─────────────────────────────────────────────
document.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT") return;
  if (e.code === "Space") {
    e.preventDefault();
    togglePlayPause();
  }
  if (e.code === "ArrowRight" && e.altKey) nextTrack();
  if (e.code === "ArrowLeft" && e.altKey) prevTrack();
});

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────
updateVolumeUI(80);
buildPlaylist();
loadTrack(0, false);

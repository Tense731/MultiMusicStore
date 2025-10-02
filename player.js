class MusicPlayer {
  constructor() {
    this.audio = new Audio();
    this.currentSong = null;
    this.queue = [];
    this.currentIndex = 0;
    this.isPlaying = false;
    this.isRepeat = false;
    this.isShuffle = false;
    this.volume = 0.7;

    this.audio.volume = this.volume;
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.audio.addEventListener('ended', () => this.playNext());
    this.audio.addEventListener('timeupdate', () => this.updateProgress());
    this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
  }

  loadSong(song) {
    this.currentSong = song;
    this.audio.src = song.audio_url;
    this.updatePlayerUI();
  }

  play() {
    this.audio.play();
    this.isPlaying = true;
    this.updatePlayButton();
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.updatePlayButton();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  playNext() {
    if (this.isRepeat) {
      this.audio.currentTime = 0;
      this.play();
      return;
    }

    if (this.isShuffle) {
      const randomIndex = Math.floor(Math.random() * this.queue.length);
      this.currentIndex = randomIndex;
    } else {
      this.currentIndex = (this.currentIndex + 1) % this.queue.length;
    }

    if (this.queue[this.currentIndex]) {
      this.loadSong(this.queue[this.currentIndex]);
      this.play();
    }
  }

  playPrevious() {
    if (this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
      return;
    }

    this.currentIndex = (this.currentIndex - 1 + this.queue.length) % this.queue.length;

    if (this.queue[this.currentIndex]) {
      this.loadSong(this.queue[this.currentIndex]);
      this.play();
    }
  }

  setQueue(songs, startIndex = 0) {
    this.queue = songs;
    this.currentIndex = startIndex;
    if (songs[startIndex]) {
      this.loadSong(songs[startIndex]);
    }
  }

  seek(time) {
    this.audio.currentTime = time;
  }

  setVolume(value) {
    this.volume = value;
    this.audio.volume = value;
  }

  toggleRepeat() {
    this.isRepeat = !this.isRepeat;
    this.updateRepeatButton();
  }

  toggleShuffle() {
    this.isShuffle = !this.isShuffle;
    this.updateShuffleButton();
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  updateProgress() {
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');

    if (progressBar && this.audio.duration) {
      const percentage = (this.audio.currentTime / this.audio.duration) * 100;
      progressBar.style.width = percentage + '%';
    }

    if (currentTimeEl) {
      currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
    }
  }

  updateDuration() {
    const durationEl = document.getElementById('duration');
    if (durationEl) {
      durationEl.textContent = this.formatTime(this.audio.duration);
    }
  }

  updatePlayerUI() {
    if (!this.currentSong) return;

    const titleEl = document.getElementById('player-song-title');
    const artistEl = document.getElementById('player-artist-name');
    const coverEl = document.getElementById('player-cover');

    if (titleEl) titleEl.textContent = this.currentSong.title;
    if (artistEl) artistEl.textContent = this.currentSong.artist_name || 'Unknown Artist';
    if (coverEl) coverEl.src = this.currentSong.cover_image_url || 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?w=100';
  }

  updatePlayButton() {
    const playBtn = document.getElementById('play-btn');
    if (playBtn) {
      playBtn.innerHTML = this.isPlaying ?
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>' :
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>';
    }
  }

  updateRepeatButton() {
    const repeatBtn = document.getElementById('repeat-btn');
    if (repeatBtn) {
      repeatBtn.style.opacity = this.isRepeat ? '1' : '0.6';
    }
  }

  updateShuffleButton() {
    const shuffleBtn = document.getElementById('shuffle-btn');
    if (shuffleBtn) {
      shuffleBtn.style.opacity = this.isShuffle ? '1' : '0.6';
    }
  }
}

export const player = new MusicPlayer();

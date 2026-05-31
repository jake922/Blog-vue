<script setup>
import { computed, ref } from 'vue'

const audioRef = ref(null)
const isPlaying = ref(false)
const isLoading = ref(false)

const buttonText = computed(() => {
  if (isLoading.value) return 'Loading'
  return isPlaying.value ? 'Pause Music' : 'Play Music'
})

const toggleMusic = async () => {
  const audio = audioRef.value
  if (!audio) return

  try {
    if (isPlaying.value) {
      audio.pause()
      isPlaying.value = false
      return
    }

    isLoading.value = true
    audio.volume = 0.36
    await audio.play()
    isPlaying.value = true
  } catch (error) {
    isPlaying.value = false
    console.warn('Music playback failed:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <button
    class="music-nav-button"
    type="button"
    :class="{ playing: isPlaying }"
    @click="toggleMusic"
  >
    <span class="music-dot" aria-hidden="true"></span>
    <span>{{ buttonText }}</span>
  </button>

  <audio
    ref="audioRef"
    src="/audio/noir-bgm.mp3"
    loop
    preload="auto"
  ></audio>
</template>

<style scoped>
.music-nav-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-width: 146px;
  padding: 15px 22px;
  color: #f4eee7;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(245, 239, 232, 0.26);
  transition:
    background 0.3s ease,
    border-color 0.3s ease,
    color 0.3s ease;
}

.music-nav-button:hover,
.music-nav-button.playing {
  color: #fff8ef;
  background: rgba(214, 155, 104, 0.12);
  border-color: #d69b68;
}

.music-dot {
  width: 7px;
  height: 7px;
  flex: 0 0 7px;
  border-radius: 50%;
  background: #d69b68;
  box-shadow: 0 0 14px rgba(214, 155, 104, 0.85);
}

.music-nav-button.playing .music-dot {
  animation: musicPulse 1.2s ease-in-out infinite;
}

@keyframes musicPulse {
  0%,
  100% {
    opacity: 0.55;
    transform: scale(0.86);
  }

  50% {
    opacity: 1;
    transform: scale(1.22);
  }
}
</style>

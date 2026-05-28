<script setup>
import { ref } from 'vue'

defineProps({
  tone: {
    type: String,
    default: 'home',
  },
})

const videoReady = ref(false)
const videoFailed = ref(false)

const handleVideoLoaded = () => {
  videoReady.value = true
}

const handleVideoError = () => {
  videoFailed.value = true
}
</script>

<template>
  <div class="cinematic-backdrop" :class="`cinematic-backdrop--${tone}`" aria-hidden="true">
    <div class="ambient-background">
      <span class="glow glow-one"></span>
      <span class="glow glow-two"></span>
    </div>

    <video
      v-if="!videoFailed"
      class="background-video"
      :class="{ visible: videoReady }"
      autoplay
      muted
      loop
      playsinline
      preload="metadata"
      @loadeddata="handleVideoLoaded"
      @error="handleVideoError"
    >
      <source src="/videos/hero-background.mp4" type="video/mp4" />
    </video>

    <div class="backdrop-overlay"></div>
    <div class="grain"></div>
  </div>
</template>

<style scoped>
.cinematic-backdrop {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  background: #090909;
}

.background-video,
.ambient-background,
.backdrop-overlay,
.grain {
  position: absolute;
  inset: 0;
}

.background-video {
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  opacity: 0;
  transform: scale(1.04);
  transition: opacity 1.2s ease;
}

.background-video.visible {
  opacity: 1;
}

.ambient-background {
  z-index: 0;
  background:
    radial-gradient(circle at 72% 36%, #3d2418 0%, transparent 30%),
    radial-gradient(circle at 62% 65%, #1e1511 0%, transparent 37%),
    linear-gradient(115deg, #070707 13%, #11100f 54%, #18110d 100%);
}

.glow {
  position: absolute;
  display: block;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  animation: drift 12s ease-in-out infinite alternate;
}

.glow-one {
  top: 21%;
  right: 17%;
  width: 320px;
  height: 320px;
  background: #a65d31;
}

.glow-two {
  right: 36%;
  bottom: 13%;
  width: 230px;
  height: 230px;
  background: #4b3023;
  animation-delay: -5s;
}

.backdrop-overlay {
  z-index: 2;
  background:
    linear-gradient(
      90deg,
      rgba(5, 5, 5, 0.96) 0%,
      rgba(5, 5, 5, 0.68) 44%,
      rgba(5, 5, 5, 0.35) 100%
    ),
    linear-gradient(0deg, rgba(5, 5, 5, 0.88) 0%, transparent 38%);
}

.cinematic-backdrop--inner .backdrop-overlay {
  background:
    linear-gradient(
      90deg,
      rgba(5, 5, 5, 0.94) 0%,
      rgba(5, 5, 5, 0.76) 46%,
      rgba(5, 5, 5, 0.56) 100%
    ),
    linear-gradient(0deg, rgba(5, 5, 5, 0.88) 0%, transparent 42%);
}

.grain {
  z-index: 3;
  opacity: 0.12;
  background-image: radial-gradient(
    rgba(255, 255, 255, 0.5) 0.6px,
    transparent 0.6px
  );
  background-size: 4px 4px;
}

@keyframes drift {
  to {
    transform: translate3d(20px, -14px, 0) scale(1.08);
  }
}

@media (prefers-reduced-motion: reduce) {
  .background-video {
    display: none;
  }

  .glow {
    animation: none;
  }
}
</style>

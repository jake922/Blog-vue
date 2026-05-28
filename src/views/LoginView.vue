<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { loginError } = storeToRefs(authStore)

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const isSubmitting = ref(false)
const videoReady = ref(false)
const videoFailed = ref(false)

const fillDemoAccount = () => {
  username.value = 'admin'
  password.value = 'noir2026'
  authStore.clearError()
}

const handleSubmit = async () => {
  isSubmitting.value = true
  authStore.clearError()

  const succeeded = await authStore.login({
    username: username.value.trim(),
    password: password.value,
  })

  isSubmitting.value = false

  if (succeeded) {
    const redirectPath =
      typeof route.query.redirect === 'string'
        ? route.query.redirect
        : '/admin'

    router.push(redirectPath)
  }
}

const handleVideoLoaded = () => {
  videoReady.value = true
}

const handleVideoError = () => {
  videoFailed.value = true
}
</script>

<template>
  <main class="login-page">
    <section class="visual-panel">
      <video
        v-if="!videoFailed"
        class="background-video"
        :class="{ visible: videoReady }"
        autoplay
        muted
        loop
        playsinline
        @loadeddata="handleVideoLoaded"
        @error="handleVideoError"
      >
        <source :src="'/videos/hero-background.mp4'" type="video/mp4" />
      </video>

      <div class="ambient-background">
        <span class="glow glow-one"></span>
        <span class="glow glow-two"></span>
      </div>
      <div class="visual-overlay"></div>
      <div class="grain"></div>

      <RouterLink class="brand" to="/">
        <span class="brand-mark"></span>
        <div>
          <p class="brand-name">NOIR ARCHIVE</p>
          <p class="brand-subtitle">Digital Journal</p>
        </div>
      </RouterLink>

      <div class="visual-content">
        <p class="chapter">STUDIO / ACCESS</p>

        <h1>
          Enter the<br />
          <span>writing studio.</span>
        </h1>

        <p class="visual-description">
          管理文章、整理分类，并记录属于你的数字创作档案。
        </p>
      </div>

      <p class="visual-footer">
        EDITORIAL SYSTEM · AUTHENTICATED ACCESS
      </p>
    </section>

    <section class="form-panel">
      <div class="form-wrapper">
        <RouterLink class="back-link" to="/">
          <span aria-hidden="true">←</span>
          Return Home
        </RouterLink>

        <header class="form-heading">
          <p class="section-index">ADMINISTRATION</p>
          <h2>Sign in</h2>
          <p>
            登录后台创作工作室，管理文章内容与发布状态。
          </p>
        </header>

        <form class="login-form" @submit.prevent="handleSubmit">
          <label class="field">
            <span>USERNAME</span>
            <input
              v-model="username"
              type="text"
              autocomplete="username"
              placeholder="Enter your username"
              required
              @input="authStore.clearError"
            />
          </label>

          <label class="field">
            <span>PASSWORD</span>

            <div class="password-field">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="Enter your password"
                required
                @input="authStore.clearError"
              />

              <button
                class="visibility-button"
                type="button"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
          </label>

          <p v-if="loginError" class="error-message">
            {{ loginError }}
          </p>

          <button
            class="submit-button"
            type="submit"
            :disabled="isSubmitting"
          >
            <span v-if="!isSubmitting">Enter Studio</span>
            <span v-else class="loading-content">
              <i class="loading-dot"></i>
              Authenticating
            </span>
          </button>
        </form>

        <div class="demo-account">
          <div>
            <p class="demo-title">DEMO ACCOUNT</p>
            <p class="demo-detail">admin / noir2026</p>
          </div>

          <button type="button" class="fill-button" @click="fillDemoAccount">
            Fill Account
          </button>
        </div>

        <p class="security-note">
          使用模拟 JWT Token 与 localStorage 实现课程项目登录认证演示。
        </p>
      </div>
    </section>
  </main>
</template>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

:global(html) {
  background: #090909;
}

:global(body) {
  margin: 0;
  min-width: 320px;
  font-family:
    Inter, 'Helvetica Neue', Arial, 'PingFang SC', 'Microsoft YaHei',
    sans-serif;
  color: #f3f1ed;
  background: #090909;
}

:global(button),
:global(input) {
  font: inherit;
}

.login-page {
  display: grid;
  grid-template-columns: minmax(460px, 1.08fr) minmax(430px, 0.92fr);
  min-height: 100vh;
  color: #f3f0eb;
  background: #090909;
}

.visual-panel {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  padding: clamp(34px, 4.5vw, 58px) clamp(32px, 5vw, 68px);
  overflow: hidden;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.background-video,
.ambient-background,
.visual-overlay,
.grain {
  position: absolute;
  inset: 0;
}

.background-video {
  z-index: -4;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transform: scale(1.05);
  transition: opacity 1.2s ease;
}

.background-video.visible {
  opacity: 1;
}

.ambient-background {
  z-index: -5;
  background:
    radial-gradient(circle at 62% 42%, #432619 0%, transparent 34%),
    radial-gradient(circle at 76% 74%, #211511 0%, transparent 34%),
    linear-gradient(130deg, #080808 8%, #11100e 56%, #1a110d 100%);
}

.glow {
  position: absolute;
  display: block;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.32;
  animation: drift 12s ease-in-out infinite alternate;
}

.glow-one {
  top: 26%;
  right: 17%;
  width: 320px;
  height: 320px;
  background: #ab6334;
}

.glow-two {
  right: 44%;
  bottom: 17%;
  width: 230px;
  height: 230px;
  background: #59402e;
  animation-delay: -4s;
}

.visual-overlay {
  z-index: -2;
  background:
    linear-gradient(90deg, rgba(5, 5, 5, 0.94), rgba(5, 5, 5, 0.34)),
    linear-gradient(0deg, rgba(5, 5, 5, 0.82), transparent 48%);
}

.grain {
  z-index: -1;
  pointer-events: none;
  opacity: 0.12;
  background-image: radial-gradient(
    rgba(255, 255, 255, 0.5) 0.6px,
    transparent 0.6px
  );
  background-size: 4px 4px;
}

.brand {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 14px;
  width: max-content;
  color: inherit;
  text-decoration: none;
}

.brand-mark {
  width: 10px;
  height: 10px;
  background: #d69b68;
  border-radius: 50%;
  box-shadow: 0 0 22px #d69b68;
}

.brand-name,
.brand-subtitle {
  margin: 0;
}

.brand-name {
  color: #faf8f5;
  font-size: 13px;
  letter-spacing: 0.22em;
}

.brand-subtitle {
  margin-top: 5px;
  color: #88847e;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.visual-content {
  position: relative;
  z-index: 1;
  padding: clamp(46px, 8vw, 86px) 0;
  animation: reveal 0.9s ease both;
}

.chapter {
  display: flex;
  align-items: center;
  gap: 17px;
  margin: 0 0 31px;
  color: #b99d82;
  font-size: 11px;
  letter-spacing: 0.34em;
}

.chapter::before {
  width: 42px;
  height: 1px;
  content: '';
  background: #d69b68;
}

.visual-content h1 {
  margin: 0;
  color: #f5f1eb;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(55px, 6.2vw, 86px);
  font-weight: 400;
  line-height: 1.08;
  letter-spacing: -0.06em;
}

.visual-content h1 span {
  color: #d5b28f;
}

.visual-description {
  max-width: 425px;
  margin: 35px 0 0;
  color: rgba(225, 216, 206, 0.68);
  font-size: 15px;
  line-height: 2.1;
  letter-spacing: 0.06em;
}

.visual-footer {
  position: relative;
  z-index: 1;
  margin: 0;
  color: #736b63;
  font-size: 10px;
  letter-spacing: 0.3em;
}

.form-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: clamp(38px, 5vw, 72px);
  background:
    radial-gradient(circle at 100% 0%, rgba(100, 62, 38, 0.12), transparent 28%),
    #090909;
}

.form-wrapper {
  width: min(470px, 100%);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  margin-bottom: clamp(52px, 8vw, 74px);
  color: #8d847a;
  font-size: 11px;
  letter-spacing: 0.25em;
  text-decoration: none;
  text-transform: uppercase;
  transition: color 0.25s ease;
}

.back-link span {
  color: #d69b68;
  font-size: 18px;
  transition: transform 0.25s ease;
}

.back-link:hover {
  color: #ede7e0;
}

.back-link:hover span {
  transform: translateX(-6px);
}

.form-heading {
  margin-bottom: 44px;
}

.section-index {
  margin: 0 0 22px;
  color: #bf9974;
  font-size: 11px;
  letter-spacing: 0.34em;
}

.form-heading h2 {
  margin: 0 0 19px;
  color: #f4efe9;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(48px, 5.3vw, 66px);
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.055em;
}

.form-heading > p:last-child {
  margin: 0;
  color: #8c847a;
  font-size: 14px;
  line-height: 2;
  letter-spacing: 0.04em;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.field > span {
  display: block;
  margin-bottom: 14px;
  color: #91877d;
  font-size: 10px;
  letter-spacing: 0.3em;
}

.field input {
  width: 100%;
  padding: 0 0 15px;
  color: #f0ebe5;
  font-size: 16px;
  letter-spacing: 0.04em;
  background: transparent;
  border: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  outline: none;
  transition: border-color 0.25s ease;
}

.field input::placeholder {
  color: #55514d;
}

.field input:focus {
  border-color: #d69b68;
}

.password-field {
  position: relative;
}

.password-field input {
  padding-right: 64px;
}

.visibility-button {
  position: absolute;
  right: 0;
  bottom: 15px;
  padding: 0;
  color: #ae9176;
  font-size: 11px;
  letter-spacing: 0.14em;
  cursor: pointer;
  background: transparent;
  border: 0;
  text-transform: uppercase;
}

.error-message {
  margin: -10px 0 0;
  padding: 14px 17px;
  color: #dda37b;
  font-size: 13px;
  letter-spacing: 0.04em;
  background: rgba(160, 73, 46, 0.12);
  border: 1px solid rgba(210, 126, 87, 0.3);
}

.submit-button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 58px;
  margin-top: 8px;
  color: #191310;
  font-size: 12px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  cursor: pointer;
  background: #ead7c3;
  border: 1px solid #ead7c3;
  transition:
    transform 0.25s ease,
    background 0.25s ease;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-3px);
  background: #f1e1d0;
}

.submit-button:disabled {
  cursor: wait;
  opacity: 0.82;
}

.loading-content {
  display: inline-flex;
  align-items: center;
  gap: 13px;
}

.loading-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #39261d;
  border-radius: 50%;
  animation: pulse 0.9s ease infinite alternate;
}

.demo-account {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
  margin-top: 46px;
  padding: 23px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.11);
  border-bottom: 1px solid rgba(255, 255, 255, 0.11);
}

.demo-title {
  margin: 0 0 8px;
  color: #756d65;
  font-size: 10px;
  letter-spacing: 0.3em;
}

.demo-detail {
  margin: 0;
  color: #c2ab95;
  font-size: 14px;
  letter-spacing: 0.12em;
}

.fill-button {
  padding: 12px 17px;
  color: #dfc5ac;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  cursor: pointer;
  background: transparent;
  border: 1px solid rgba(214, 155, 104, 0.38);
  transition: background 0.25s ease;
}

.fill-button:hover {
  background: rgba(214, 155, 104, 0.1);
}

.security-note {
  margin: 28px 0 0;
  color: #625d57;
  font-size: 12px;
  line-height: 1.85;
  letter-spacing: 0.04em;
}

@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(22px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes drift {
  from {
    transform: translate3d(-18px, 14px, 0) scale(0.96);
  }

  to {
    transform: translate3d(20px, -16px, 0) scale(1.08);
  }
}

@keyframes pulse {
  from {
    transform: scale(0.72);
    opacity: 0.55;
  }

  to {
    transform: scale(1.2);
    opacity: 1;
  }
}

@media (max-width: 960px) {
  .login-page {
    display: block;
  }

  .visual-panel {
    min-height: 54vh;
  }

  .form-panel {
    min-height: auto;
    padding-top: 58px;
    padding-bottom: 72px;
  }
}

@media (max-width: 560px) {
  .visual-panel {
    min-height: 50vh;
    padding: 28px 24px;
  }

  .visual-content h1 {
    font-size: 46px;
  }

  .visual-description,
  .visual-footer {
    display: none;
  }

  .form-panel {
    padding: 42px 24px 56px;
  }

  .back-link {
    margin-bottom: 42px;
  }

  .demo-account {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
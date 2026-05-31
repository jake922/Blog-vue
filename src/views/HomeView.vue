<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useBlogStore } from '../stores/blog'
import NavMusicButton from '../components/NavMusicButton.vue'


const blogStore = useBlogStore()
const { featuredPosts, posts, categoryStatistics } = storeToRefs(blogStore)

const highlights = computed(() => [
  { number: String(posts.value.length).padStart(2, '0'), label: 'Articles' },
  {
    number: String(categoryStatistics.value.length).padStart(2, '0'),
    label: 'Collections',
  },
  { number: '2026', label: 'Established' },
])

</script>

<template>
  <main class="landing-page">
    <section class="hero">

      <header class="navbar">
        <div class="brand">
          <span class="brand-mark"></span>
          <div>
            <p class="brand-name">NOIR ARCHIVE</p>
            <p class="brand-subtitle">Digital Journal</p>
          </div>
        </div>

        <nav class="nav-links" aria-label="Main navigation">
  <RouterLink to="/articles">Journal</RouterLink>
  <RouterLink to="/collections">Collections</RouterLink>
  <RouterLink to="/about">About</RouterLink>
</nav>

        <div class="header-actions">
          <NavMusicButton />

          <RouterLink class="studio-button" to="/admin">
            Admin Studio
          </RouterLink>
        </div>
      </header>

      <div class="hero-content">
        <p class="eyebrow">FRONTEND · DESIGN · ARTIFICIAL INTELLIGENCE</p>

        <h1 class="headline">
          I document ideas,<br />
          build interfaces,<br />
          <span>and write the future.</span>
        </h1>

        <p class="introduction">
          一份关于前端技术、视觉设计与人工智能创作的数字日志。
          在代码与影像之间，记录每一次灵感的发生。
        </p>

        <div class="hero-actions">
  <RouterLink class="primary-action" to="/articles">
    Explore Articles
  </RouterLink>
  <RouterLink class="secondary-action" to="/collections">
  View Collections
</RouterLink>
</div>
      </div>

      <div class="hero-footer">
        <div class="scroll-guide">
          <span class="scroll-line"></span>
          <span>SCROLL TO DISCOVER</span>
        </div>

        <div class="highlight-list">
          <div v-for="item in highlights" :key="item.label" class="highlight">
            <strong>{{ item.number }}</strong>
            <span>{{ item.label }}</span>
          </div>
        </div>
            </div>
    </section>

    <section class="featured-section" id="journal">
      <div class="section-heading">
        <div>
          <p class="section-index">01 / JOURNAL</p>
          <h2>Selected writings</h2>
        </div>

        <p class="section-description">
          关于界面设计、前端工程与人工智能创作的精选文章。
        </p>
      </div>

      <div class="article-grid">
        <article
          v-for="article in featuredPosts"
          :key="article.id"
          class="article-card"
        >
          <div class="card-top">
            <span class="article-category">{{ article.category }}</span>
            <span class="article-number">{{ article.number }}</span>
          </div>

          <div class="card-content">
            <div class="article-meta">
              <span>{{ article.date }}</span>
              <span>{{ article.readTime }}</span>
            </div>

            <h3>{{ article.title }}</h3>
            <p>{{ article.excerpt }}</p>
          </div>

          <RouterLink
  class="read-link"
  :to="`/article/${article.id}`"
>
  Read Article
  <span aria-hidden="true">→</span>
</RouterLink>
        </article>
      </div>

      <div class="section-footer">
        <RouterLink class="all-articles" to="/articles">
  View All Articles
</RouterLink>
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

:global(button) {
  font: inherit;
}

.landing-page {
  min-height: 100vh;
  background: transparent;
}

.hero {
  position: relative;
  isolation: isolate;
  min-height: 100vh;
  overflow: hidden;
  background: transparent;
}

.hero-video,
.ambient-background,
.hero-overlay,
.grain {
  position: absolute;
  inset: 0;
}

.hero-video {
  z-index: -4;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transform: scale(1.04);
  transition: opacity 1.2s ease;
}

.hero-video.visible {
  opacity: 1;
}

.ambient-background {
  z-index: -5;
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

.hero-overlay {
  z-index: -2;
  background:
    linear-gradient(90deg, rgba(5, 5, 5, 0.96) 0%, rgba(5, 5, 5, 0.68) 44%, rgba(5, 5, 5, 0.35) 100%),
    linear-gradient(0deg, rgba(5, 5, 5, 0.88) 0%, transparent 38%);
}

.grain {
  z-index: -1;
  pointer-events: none;
  opacity: 0.12;
  background-image: radial-gradient(rgba(255, 255, 255, 0.5) 0.6px, transparent 0.6px);
  background-size: 4px 4px;
}

.navbar {
  position: relative;
  z-index: 2;
  height: 92px;
  padding: 0 clamp(24px, 5vw, 72px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 36px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 180px;
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

.nav-links {
  display: flex;
  align-items: center;
  gap: clamp(26px, 4vw, 56px);
}

.nav-links a {
  position: relative;
  color: rgba(237, 233, 227, 0.68);
  font-size: 14px;
  letter-spacing: 0.09em;
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-links a::after {
  position: absolute;
  right: 0;
  bottom: -12px;
  left: 0;
  height: 1px;
  content: '';
  background: #d69b68;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.32s ease;
}

.nav-links a:hover {
  color: #f7f4ee;
}

.nav-links a:hover::after {
  transform: scaleX(1);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 0 0 auto;
}

.studio-button {
     display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 146px;
  padding: 15px 22px;
  color: #f4eee7;
  font-size: 13px;
  letter-spacing: 0.12em;
   text-decoration: none;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(245, 239, 232, 0.26);
  transition:
    background 0.3s ease,
    border-color 0.3s ease;
}

.studio-button:hover {
  background: rgba(214, 155, 104, 0.12);
  border-color: #d69b68;
}

.hero-content {
  position: relative;
  z-index: 1;
  width: min(760px, calc(100% - 48px));
  margin-left: clamp(24px, 7vw, 106px);
  padding-top: clamp(78px, 12vh, 132px);
  animation: reveal 1s ease both;
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 0 0 32px;
  color: #b4a18f;
  font-size: 11px;
  letter-spacing: 0.34em;
}

.eyebrow::before {
  width: 46px;
  height: 1px;
  content: '';
  background: #d69b68;
}

.headline {
  margin: 0;
  color: #f4f0eb;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(50px, 6.4vw, 88px);
  font-weight: 400;
  line-height: 1.08;
  letter-spacing: -0.055em;
}

.headline span {
  color: #d3b190;
}

.introduction {
  width: min(480px, 100%);
  margin: 34px 0 0;
  color: rgba(224, 218, 209, 0.67);
  font-size: 15px;
  line-height: 2;
  letter-spacing: 0.05em;
}

.hero-actions {
  display: flex;
  gap: 16px;
  margin-top: 45px;
}

.primary-action,
.secondary-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 18px 31px;
  text-decoration: none;
  font-size: 12px;
  letter-spacing: 0.17em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    background 0.3s ease;
}

.primary-action {
  color: #18120f;
  background: #e7d5c2;
  border: 1px solid #e7d5c2;
}

.secondary-action {
  color: #ece5dc;
  background: transparent;
  border: 1px solid rgba(236, 229, 220, 0.22);
}

.primary-action:hover,
.secondary-action:hover {
  transform: translateY(-3px);
}

.secondary-action:hover {
  background: rgba(255, 255, 255, 0.06);
}

.hero-footer {
  position: absolute;
  right: clamp(24px, 5vw, 72px);
  bottom: 36px;
  left: clamp(24px, 5vw, 72px);
  z-index: 2;
  display: flex;
  align-items: end;
  justify-content: space-between;
}

.scroll-guide {
  display: flex;
  align-items: center;
  gap: 15px;
  color: #847b72;
  font-size: 10px;
  letter-spacing: 0.28em;
}

.scroll-line {
  position: relative;
  width: 42px;
  height: 1px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.18);
}

.scroll-line::after {
  position: absolute;
  width: 18px;
  height: 1px;
  content: '';
  background: #d69b68;
  animation: scan 2s infinite;
}

.highlight-list {
  display: flex;
  gap: clamp(26px, 4vw, 56px);
}

.highlight {
  min-width: 74px;
}

.highlight strong {
  display: block;
  margin-bottom: 8px;
  color: #f4f0ea;
  font-family: Georgia, serif;
  font-size: 28px;
  font-weight: normal;
}

.highlight span {
  color: #898278;
  font-size: 10px;
  letter-spacing: 0.21em;
  text-transform: uppercase;
}

@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(24px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scan {
  from {
    left: -18px;
  }

  to {
    left: 44px;
  }
}

@keyframes drift {
  from {
    transform: translate3d(-24px, 14px, 0) scale(0.96);
  }

  to {
    transform: translate3d(20px, -16px, 0) scale(1.08);
  }
}

@media (max-width: 760px) {
  .navbar {
    height: 78px;
    gap: 14px;
  }

  .nav-links {
    display: none;
  }

  .brand {
    min-width: unset;
  }

  .studio-button {
    min-width: auto;
    padding: 13px 15px;
  }

  .hero-content {
    padding-top: 72px;
  }

  .eyebrow {
    line-height: 1.8;
    letter-spacing: 0.2em;
  }

  .headline {
    font-size: clamp(43px, 14vw, 57px);
  }

  .hero-actions {
    flex-direction: column;
    width: min(290px, 100%);
  }

  .hero-footer {
    position: relative;
    right: auto;
    bottom: auto;
    left: auto;
    flex-direction: column;
    align-items: flex-start;
    gap: 36px;
    margin: 72px 24px 0;
    padding-bottom: 32px;
  }

  .highlight-list {
    width: 100%;
    justify-content: space-between;
    gap: 14px;
  }
}
.featured-section {
  min-height: 100vh;
  padding: clamp(76px, 10vw, 132px) clamp(24px, 7vw, 106px);
  color: #f4f0ea;
  background: #090909;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  gap: 42px;
  margin-bottom: clamp(48px, 7vw, 78px);
}

.section-index {
  margin: 0 0 22px;
  color: #b39376;
  font-size: 11px;
  letter-spacing: 0.34em;
}

.section-heading h2 {
  margin: 0;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(46px, 5.4vw, 72px);
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.055em;
}

.section-description {
  align-self: flex-end;
  width: min(320px, 100%);
  margin: 0 0 8px;
  color: #898278;
  font-size: 14px;
  line-height: 2;
  letter-spacing: 0.06em;
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.article-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 440px;
  padding: clamp(26px, 3vw, 38px);
  overflow: hidden;
  background: #0d0d0d;
  transition: background 0.35s ease;
}

.article-card::before {
  position: absolute;
  inset: auto 0 0;
  height: 46%;
  content: '';
  background: linear-gradient(0deg, rgba(122, 77, 46, 0.14), transparent);
  opacity: 0;
  transition: opacity 0.35s ease;
}

.article-card:hover {
  background: #11100f;
}

.article-card:hover::before {
  opacity: 1;
}

.card-top,
.card-content,
.read-link {
  position: relative;
  z-index: 1;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: start;
}

.article-category {
  color: #cda988;
  font-size: 11px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}

.article-number {
  color: #4f4a45;
  font-family: Georgia, serif;
  font-size: 28px;
}

.card-content {
  margin-top: auto;
}

.article-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 23px;
  color: #706b65;
  font-size: 10px;
  letter-spacing: 0.2em;
}

.article-card h3 {
  margin: 0 0 19px;
  color: #f0ede8;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(27px, 2.5vw, 33px);
  font-weight: 400;
  line-height: 1.24;
  letter-spacing: -0.045em;
}

.article-card p {
  margin: 0;
  color: #8c857c;
  font-size: 13px;
  line-height: 1.95;
}

.read-link {
  display: flex;
  align-items: center;
  gap: 14px;
  width: max-content;
  margin-top: 34px;
  padding: 0;
  text-decoration: none;
  color: #c8b29c;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  cursor: pointer;
  background: transparent;
  border: 0;
}

.read-link span {
  font-size: 18px;
  transition: transform 0.25s ease;
}

.article-card:hover .read-link span {
  transform: translateX(7px);
}

.section-footer {
  display: flex;
  justify-content: center;
  padding-top: clamp(48px, 6vw, 72px);
}

.all-articles {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 19px 38px;
  text-decoration: none;
  color: #ede5dc;
  font-size: 11px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  cursor: pointer;
  background: transparent;
  border: 1px solid rgba(236, 229, 220, 0.23);
  transition:
    color 0.3s ease,
    border-color 0.3s ease,
    background 0.3s ease;
}

.all-articles:hover {
  color: #fff;
  background: rgba(214, 155, 104, 0.1);
  border-color: #d69b68;
}

@media (max-width: 920px) {
  .section-heading {
    flex-direction: column;
  }

  .article-grid {
    grid-template-columns: 1fr;
  }

  .article-card {
    min-height: 350px;
  }
}
</style>
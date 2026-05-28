<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useBlogStore } from '../stores/blog'

const route = useRoute()
const blogStore = useBlogStore()

const post = computed(() => blogStore.getPostById(route.params.id))

const contentBlocks = computed(() => {
  if (!post.value) {
    return []
  }

  return post.value.content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (line.startsWith('# ')) {
        return {
          type: 'title',
          text: line.replace('# ', ''),
        }
      }

      if (line.startsWith('## ')) {
        return {
          type: 'heading',
          text: line.replace('## ', ''),
        }
      }

      return {
        type: 'paragraph',
        text: line,
      }
    })
})
</script>

<template>
  <main class="detail-page">
    <header class="page-header">
      <RouterLink class="brand" to="/">
        <span class="brand-mark"></span>
        <div>
          <p class="brand-name">NOIR ARCHIVE</p>
          <p class="brand-subtitle">Digital Journal</p>
        </div>
      </RouterLink>

      <nav class="nav-links" aria-label="Main navigation">
        <RouterLink class="active" to="/articles">Journal</RouterLink>
<RouterLink to="/collections">Collections</RouterLink>
<RouterLink to="/about">About</RouterLink>
      </nav>

      <RouterLink class="studio-button" to="/admin">
  Admin Studio
</RouterLink>
    </header>

    <template v-if="post">
      <section class="article-hero">
        <RouterLink class="back-link" to="/articles">
          <span aria-hidden="true">←</span>
          Back to Journal
        </RouterLink>

        <div class="article-intro">
          <p class="article-index">{{ post.number }} / {{ post.category }}</p>

          <h1>{{ post.title }}</h1>

          <p class="excerpt">{{ post.excerpt }}</p>

          <div class="article-meta">
            <span>{{ post.date }}</span>
            <span>{{ post.readTime }}</span>
            <span>NOIR ARCHIVE</span>
          </div>
        </div>
      </section>

      <section class="article-body">
        <aside class="reading-aside">
          <p class="aside-label">ARTICLE</p>
          <p class="aside-number">{{ post.number }}</p>
          <div class="aside-line"></div>
          <p class="aside-category">{{ post.category }}</p>
        </aside>

        <article class="markdown-content">
          <template
            v-for="(block, index) in contentBlocks"
            :key="`${block.type}-${index}`"
          >
            <h2 v-if="block.type === 'heading'">
              {{ block.text }}
            </h2>

            <p v-else-if="block.type === 'paragraph'">
              {{ block.text }}
            </p>
          </template>

          <div class="article-end">
            <p>END OF ARTICLE</p>
            <RouterLink to="/articles">
              Continue Reading
              <span aria-hidden="true">→</span>
            </RouterLink>
          </div>
        </article>
      </section>
    </template>

    <section v-else class="not-found">
      <p class="section-index">404 / ARTICLE NOT FOUND</p>
      <h1>This article has disappeared.</h1>
      <p>该文章不存在或已经被移除。</p>
      <RouterLink class="return-button" to="/articles">
        Return to Journal
      </RouterLink>
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

.detail-page {
  min-height: 100vh;
  color: #f4f0ea;
  background: transparent;
}

.page-header {
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
  transition: transform 0.3s ease;
}

.nav-links a:hover,
.nav-links a.active {
  color: #f7f4ee;
}

.nav-links a:hover::after,
.nav-links a.active::after {
  transform: scaleX(1);
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

.article-hero {
  min-height: calc(100vh - 92px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(46px, 6vw, 72px) clamp(24px, 7vw, 106px)
    clamp(72px, 10vw, 124px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.11);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 15px;
  margin-bottom: clamp(56px, 8vw, 94px);
  color: #968a7d;
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
  color: #eee8e0;
}

.back-link:hover span {
  transform: translateX(-6px);
}

.article-intro {
  width: min(1060px, 100%);
  margin: 0 auto;
}

.article-index {
  margin: 0 0 30px;
  color: #c59c76;
  font-size: 11px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
}

.article-intro h1 {
  width: min(980px, 100%);
  margin: 0;
  color: #f3eee8;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(54px, 7.4vw, 108px);
  font-weight: 400;
  line-height: 1.03;
  letter-spacing: -0.065em;
}

.excerpt {
  width: min(660px, 100%);
  margin: clamp(34px, 5vw, 48px) 0 0;
  color: #958d82;
  font-size: 16px;
  line-height: 2.05;
  letter-spacing: 0.055em;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(24px, 4vw, 52px);
  margin-top: clamp(42px, 6vw, 64px);
  padding-top: 29px;
  color: #847b71;
  font-size: 11px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.article-body {
  display: grid;
  background: #090909;
  grid-template-columns: 190px minmax(0, 720px);
  justify-content: center;
  gap: clamp(48px, 8vw, 110px);
  padding: clamp(70px, 9vw, 112px) clamp(24px, 7vw, 106px)
    clamp(92px, 12vw, 150px);
}

.reading-aside {
  position: sticky;
  top: 54px;
  align-self: start;
  padding-top: 7px;
}

.aside-label {
  margin: 0 0 23px;
  color: #82786f;
  font-size: 10px;
  letter-spacing: 0.32em;
}

.aside-number {
  margin: 0 0 26px;
  color: #d5b18d;
  font-family: Georgia, serif;
  font-size: 57px;
  font-weight: 400;
}

.aside-line {
  width: 44px;
  height: 1px;
  margin-bottom: 23px;
  background: #d69b68;
}

.aside-category {
  margin: 0;
  color: #8d847a;
  font-size: 10px;
  line-height: 2;
  letter-spacing: 0.23em;
  text-transform: uppercase;
}

.markdown-content {
  color: #b2aaa0;
}

.markdown-content h2 {
  margin: 0 0 27px;
  padding-top: 16px;
  color: #eee8e2;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(31px, 3.4vw, 42px);
  font-weight: 400;
  letter-spacing: -0.045em;
}

.markdown-content h2:not(:first-child) {
  margin-top: clamp(48px, 7vw, 70px);
}

.markdown-content p {
  margin: 0 0 27px;
  color: #a39a8f;
  font-size: 16px;
  line-height: 2.15;
  letter-spacing: 0.055em;
}

.article-end {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 26px;
  margin-top: clamp(62px, 8vw, 86px);
  padding-top: 34px;
  border-top: 1px solid rgba(255, 255, 255, 0.13);
}

.article-end p {
  margin: 0;
  color: #71695f;
  font-size: 10px;
  letter-spacing: 0.32em;
}

.article-end a {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  color: #d1ae8c;
  font-size: 11px;
  letter-spacing: 0.23em;
  text-decoration: none;
  text-transform: uppercase;
}

.article-end a span {
  font-size: 20px;
  transition: transform 0.25s ease;
}

.article-end a:hover span {
  transform: translateX(7px);
}

.not-found {
  min-height: calc(100vh - 92px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}

.section-index {
  margin: 0 0 25px;
  color: #b39376;
  font-size: 11px;
  letter-spacing: 0.34em;
}

.not-found h1 {
  margin: 0 0 24px;
  color: #f4f0eb;
  font-family: Georgia, serif;
  font-size: clamp(44px, 6vw, 68px);
  font-weight: 400;
  letter-spacing: -0.055em;
}

.not-found > p:not(.section-index) {
  margin: 0 0 38px;
  color: #8f877c;
  line-height: 2;
}

.return-button {
  padding: 18px 34px;
  color: #eee6dc;
  font-size: 11px;
  letter-spacing: 0.24em;
  text-decoration: none;
  text-transform: uppercase;
  border: 1px solid rgba(214, 155, 104, 0.42);
}

@media (max-width: 880px) {
  .page-header {
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
    min-width: unset;
    padding: 13px 15px;
  }

  .article-body {
    display: block;
  }

  .reading-aside {
    position: static;
    display: flex;
    align-items: center;
    gap: 18px;
    margin-bottom: 50px;
  }

  .aside-label,
  .aside-number,
  .aside-category {
    margin: 0;
  }

  .aside-number {
    font-size: 38px;
  }

  .aside-line {
    width: 30px;
    margin: 0;
  }

  .article-end {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
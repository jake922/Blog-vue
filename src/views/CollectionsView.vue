<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useBlogStore } from '../stores/blog'

const blogStore = useBlogStore()
const { categoryStatistics, posts } = storeToRefs(blogStore)

const collectionDescriptions = {
  Frontend:
    '关于交互界面、组件系统与现代网页体验的设计实践。',
  'Artificial Intelligence':
    '记录人工智能参与创作、影像生成与数字表达的探索。',
  Engineering:
    '聚焦 Vue 工程架构、状态管理与可维护应用开发。',
  Design:
    '讨论排版、留白、光影与极简视觉语言。',
  'Motion & Interaction':
    '用动画、反馈与动态叙事构建更有生命力的界面。',
}

const featuredCollections = computed(() =>
  categoryStatistics.value.map((category, index) => ({
    ...category,
    number: String(index + 1).padStart(2, '0'),
    description:
      collectionDescriptions[category.name] ||
      '探索这一分类下关于技术、设计与创作实践的文章。',
    latestPost: posts.value.find((post) => post.category === category.name),
  })),
)
</script>

<template>
  <main class="collections-page">
    <header class="page-header">
      <RouterLink class="brand" to="/">
        <span class="brand-mark"></span>
        <div>
          <p class="brand-name">NOIR ARCHIVE</p>
          <p class="brand-subtitle">Digital Journal</p>
        </div>
      </RouterLink>

      <nav class="nav-links" aria-label="Main navigation">
        <RouterLink to="/articles">Journal</RouterLink>
        <RouterLink class="active" to="/collections">Collections</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>

      <RouterLink class="studio-button" to="/admin">
        Admin Studio
      </RouterLink>
    </header>

    <section class="hero-section">
      <p class="section-index">ARCHIVE / COLLECTIONS</p>

      <div class="hero-layout">
        <h1>
          Curated paths<br />
          <span>through ideas.</span>
        </h1>

        <p class="hero-description">
          按主题浏览技术文章、设计观察与创作实验。
          每一组分类，都是进入数字档案的另一条路径。
        </p>
      </div>
    </section>

    <section class="collections-section">
      <div class="section-heading">
        <p>
          {{ featuredCollections.length }}
          COLLECTIONS
        </p>
        <span></span>
      </div>

      <div class="collection-grid">
        <article
          v-for="collection in featuredCollections"
          :key="collection.name"
          class="collection-card"
        >
          <div class="card-header">
            <span class="collection-number">{{ collection.number }}</span>
            <span
              class="article-count"
              :class="{ empty: collection.articleCount === 0 }"
            >
              {{ collection.articleCount }}
              {{ collection.articleCount === 1 ? 'Article' : 'Articles' }}
            </span>
          </div>

          <div class="card-body">
            <p class="collection-label">COLLECTION</p>
            <h2>{{ collection.name }}</h2>
            <p class="collection-description">
              {{ collection.description }}
            </p>
          </div>

          <div class="card-footer">
            <p v-if="collection.latestPost" class="latest-post">
              Latest — {{ collection.latestPost.title }}
            </p>
            <p v-else class="latest-post muted">
              No published articles yet
            </p>

            <RouterLink
              class="explore-link"
              :to="{
                name: 'articles',
                query: { category: collection.name },
              }"
            >
              Explore
              <span aria-hidden="true">→</span>
            </RouterLink>
          </div>
        </article>
      </div>
    </section>

    <section class="cta-section">
      <div>
        <p class="section-index">DISCOVER ALL WRITINGS</p>
        <h2>
          Explore the complete<br />
          journal archive.
        </h2>
      </div>

      <RouterLink class="journal-button" to="/articles">
        View All Articles
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

.collections-page {
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

.hero-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: calc(100vh - 92px);
  padding: clamp(72px, 9vw, 118px) clamp(24px, 7vw, 106px)
    clamp(66px, 8vw, 100px);
}

.section-index {
  margin: 0 0 27px;
  color: #b39376;
  font-size: 11px;
  letter-spacing: 0.34em;
}

.hero-layout {
  display: flex;
  justify-content: space-between;
  gap: 48px;
}

.hero-layout h1 {
  margin: 0;
  color: #f4f0eb;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(54px, 6.8vw, 96px);
  font-weight: 400;
  line-height: 1.05;
  letter-spacing: -0.065em;
}

.hero-layout h1 span {
  color: #d3b190;
}

.hero-description {
  align-self: end;
  width: min(390px, 100%);
  margin: 0 0 13px;
  color: #91887e;
  font-size: 14px;
  line-height: 2.1;
  letter-spacing: 0.055em;
}

.collections-section,
.cta-section {
  background: #090909;
}

.collections-section {
  padding: 0 clamp(24px, 7vw, 106px) clamp(72px, 10vw, 112px);
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 29px;
  margin-bottom: 31px;
  color: #7e766d;
  font-size: 11px;
  letter-spacing: 0.28em;
}

.section-heading p {
  margin: 0;
  white-space: nowrap;
}

.section-heading span {
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.12);
}

.collection-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background: rgba(255, 255, 255, 0.11);
  border: 1px solid rgba(255, 255, 255, 0.11);
}

.collection-card {
  display: flex;
  flex-direction: column;
  min-height: 420px;
  padding: clamp(28px, 4vw, 43px);
  background: #0d0d0d;
  transition: background 0.3s ease;
}

.collection-card:hover {
  background:
    radial-gradient(circle at 100% 100%, rgba(121, 75, 45, 0.18), transparent 45%),
    #10100f;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
}

.collection-number {
  color: #575049;
  font-family: Georgia, serif;
  font-size: 35px;
}

.article-count {
  padding: 9px 13px;
  color: #d4ae89;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  background: rgba(214, 155, 104, 0.08);
  border: 1px solid rgba(214, 155, 104, 0.28);
}

.article-count.empty {
  color: #7d756c;
  background: transparent;
  border-color: rgba(255, 255, 255, 0.12);
}

.card-body {
  margin: auto 0 38px;
}

.collection-label {
  margin: 0 0 19px;
  color: #b18d6c;
  font-size: 10px;
  letter-spacing: 0.29em;
}

.card-body h2 {
  margin: 0 0 21px;
  color: #f0eae3;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(37px, 4vw, 48px);
  font-weight: 400;
  letter-spacing: -0.055em;
}

.collection-description {
  max-width: 460px;
  margin: 0;
  color: #898178;
  font-size: 14px;
  line-height: 2;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 25px;
  padding-top: 27px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.latest-post {
  max-width: 320px;
  margin: 0;
  color: #70685f;
  font-size: 11px;
  line-height: 1.8;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.latest-post.muted {
  color: #56514b;
}

.explore-link {
  display: inline-flex;
  align-items: center;
  gap: 13px;
  color: #c6aa8d;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-decoration: none;
  text-transform: uppercase;
}

.explore-link span {
  font-size: 19px;
  transition: transform 0.25s ease;
}

.collection-card:hover .explore-link span {
  transform: translateX(7px);
}

.cta-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 42px;
  margin: 0 clamp(24px, 7vw, 106px);
  padding: clamp(42px, 6vw, 62px);
  background:
    radial-gradient(circle at 86% 38%, rgba(139, 83, 47, 0.19), transparent 37%),
    #0f0f0e;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.cta-section .section-index {
  margin-bottom: 20px;
}

.cta-section h2 {
  margin: 0;
  color: #eee7df;
  font-family: Georgia, serif;
  font-size: clamp(36px, 4vw, 51px);
  font-weight: 400;
  line-height: 1.16;
  letter-spacing: -0.05em;
}

.journal-button {
  flex-shrink: 0;
  padding: 20px 34px;
  color: #1b1511;
  font-size: 11px;
  letter-spacing: 0.23em;
  text-decoration: none;
  text-transform: uppercase;
  background: #e5d0ba;
}

@media (max-width: 860px) {
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

  .hero-layout,
  .cta-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .collection-grid {
    grid-template-columns: 1fr;
  }

  .collection-card {
    min-height: 360px;
  }
}
</style>
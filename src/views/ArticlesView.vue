<script setup>
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink, useRoute } from 'vue-router'
import { useBlogStore } from '../stores/blog'

const route = useRoute()
const blogStore = useBlogStore()
const { posts, categories } = storeToRefs(blogStore)

const searchKeyword = ref('')
const activeCategory = ref('All')

watch(
  () => route.query.category,
  (category) => {
    if (
      typeof category === 'string' &&
      categories.value.includes(category)
    ) {
      activeCategory.value = category
    } else {
      activeCategory.value = 'All'
    }
  },
  { immediate: true },
)

const filteredPosts = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()

  return posts.value.filter((post) => {
    const matchesCategory =
      activeCategory.value === 'All' ||
      post.category === activeCategory.value

    const matchesKeyword =
      !keyword ||
      post.title.toLowerCase().includes(keyword) ||
      post.excerpt.toLowerCase().includes(keyword) ||
      post.category.toLowerCase().includes(keyword)

    return matchesCategory && matchesKeyword
  })
})

const selectCategory = (category) => {
  activeCategory.value = category
}

const clearSearch = () => {
  searchKeyword.value = ''
  activeCategory.value = 'All'
}
</script>

<template>
  <main class="articles-page">
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

    <section class="intro-section">
      <p class="section-index">JOURNAL / ALL WRITINGS</p>

      <div class="intro-layout">
        <h1>
          Stories, ideas<br />
          <span>and experiments.</span>
        </h1>

        <p class="intro-description">
          探索关于前端工程、数字设计与人工智能创作的文章。
          每一次记录，都是一次关于技术与表达的实验。
        </p>
      </div>
    </section>

    <section class="browser-section">
      <div class="filter-bar">
        <label class="search-box">
          <span>SEARCH</span>
          <input
            v-model="searchKeyword"
            type="search"
            placeholder="Search articles..."
          />
        </label>

        <div class="categories" aria-label="Article categories">
          <button
            v-for="category in categories"
            :key="category"
            class="category-button"
            :class="{ selected: activeCategory === category }"
            @click="selectCategory(category)"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <div class="result-header">
        <p>
          Showing
          <strong>{{ filteredPosts.length }}</strong>
          articles
        </p>
        <span class="line"></span>
      </div>

      <div v-if="filteredPosts.length" class="article-list">
        <article
          v-for="post in filteredPosts"
          :key="post.id"
          class="article-row"
        >
          <span class="article-number">{{ post.number }}</span>

          <div class="article-main">
            <div class="article-meta">
              <span>{{ post.category }}</span>
              <span>{{ post.date }}</span>
              <span>{{ post.readTime }}</span>
            </div>

            <h2>{{ post.title }}</h2>
            <p>{{ post.excerpt }}</p>
          </div>

          <RouterLink
  class="read-button"
  :to="`/article/${post.id}`"
>
  Read
  <span aria-hidden="true">→</span>
</RouterLink>
        </article>
      </div>

      <div v-else class="empty-state">
        <p class="empty-title">No articles found.</p>
        <p class="empty-description">
          没有找到符合条件的文章，请尝试更换关键词或分类。
        </p>
        <button class="reset-button" @click="clearSearch">
          Reset Filters
        </button>
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

.articles-page {
  min-height: 100vh;
  color: #f4f0ea;
  background: transparent;
}

.page-header {
  position: relative;
  z-index: 20;
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
  osition: relative;
  z-index: 21;
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

.intro-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: calc(100vh - 92px);
  padding: clamp(72px, 9vw, 118px) clamp(24px, 7vw, 106px)
    clamp(58px, 7vw, 92px);
}

.section-index {
  margin: 0 0 27px;
  color: #b39376;
  font-size: 11px;
  letter-spacing: 0.34em;
}

.intro-layout {
  display: flex;
  justify-content: space-between;
  gap: 48px;
}

.intro-layout h1 {
  margin: 0;
  color: #f4f0eb;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(53px, 6.5vw, 92px);
  font-weight: 400;
  line-height: 1.06;
  letter-spacing: -0.06em;
}

.intro-layout h1 span {
  color: #d3b190;
}

.intro-description {
  align-self: end;
  width: min(370px, 100%);
  margin: 0 0 12px;
  color: #8f877c;
  font-size: 14px;
  line-height: 2.1;
  letter-spacing: 0.06em;
}

.browser-section {
  padding: clamp(56px, 7vw, 88px) clamp(24px, 7vw, 106px) 88px;
  background: #090909;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 36px;
  padding: 28px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.13);
  border-bottom: 1px solid rgba(255, 255, 255, 0.13);
}

.search-box {
  width: min(330px, 100%);
}

.search-box span {
  display: block;
  margin-bottom: 14px;
  color: #8b8379;
  font-size: 10px;
  letter-spacing: 0.3em;
}

.search-box input {
  width: 100%;
  padding: 0 0 12px;
  color: #eee9e3;
  font-size: 15px;
  background: transparent;
  border: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
  outline: none;
  transition: border-color 0.25s ease;
}

.search-box input::placeholder {
  color: #5e5953;
}

.search-box input:focus {
  border-color: #d69b68;
}

.categories {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 9px;
}

.category-button {
  padding: 12px 17px;
  color: #898178;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  cursor: pointer;
  background: transparent;
  border: 1px solid transparent;
  transition: all 0.25s ease;
}

.category-button:hover,
.category-button.selected {
  color: #ede5dc;
  background: rgba(214, 155, 104, 0.08);
  border-color: rgba(214, 155, 104, 0.4);
}

.result-header {
  display: flex;
  align-items: center;
  gap: 28px;
  margin: 50px 0 30px;
  color: #787169;
  font-size: 11px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
}

.result-header p {
  margin: 0;
  white-space: nowrap;
}

.result-header strong {
  margin: 0 7px;
  color: #d4b08c;
  font-weight: normal;
}

.line {
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.article-list {
  border-top: 1px solid rgba(255, 255, 255, 0.13);
}

.article-row {
  display: grid;
  grid-template-columns: 84px 1fr 110px;
  gap: clamp(22px, 4vw, 54px);
  align-items: center;
  min-height: 218px;
  padding: 36px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.13);
  transition: padding 0.3s ease;
}

.article-row:hover {
  padding-left: 18px;
  padding-right: 18px;
}

.article-number {
  align-self: start;
  padding-top: 4px;
  color: #575049;
  font-family: Georgia, serif;
  font-size: 35px;
}

.article-meta {
  display: flex;
  gap: 23px;
  margin-bottom: 18px;
  color: #837b73;
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.article-meta span:first-child {
  color: #cda988;
}

.article-main h2 {
  margin: 0 0 13px;
  color: #f0ece7;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(29px, 3vw, 37px);
  font-weight: 400;
  letter-spacing: -0.045em;
}

.article-main p {
  max-width: 730px;
  margin: 0;
  color: #898278;
  font-size: 13px;
  line-height: 1.9;
}

.read-button {
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 14px;
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

.read-button span {
  font-size: 20px;
  transition: transform 0.25s ease;
}

.article-row:hover .read-button span {
  transform: translateX(7px);
}

.empty-state {
  padding: 92px 24px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.13);
}

.empty-title {
  margin: 0 0 18px;
  color: #f1ece7;
  font-family: Georgia, serif;
  font-size: 42px;
}

.empty-description {
  margin: 0 auto 34px;
  color: #8f877c;
  font-size: 14px;
  line-height: 2;
}

.reset-button {
  padding: 17px 31px;
  color: #eee7de;
  font-size: 11px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  cursor: pointer;
  background: transparent;
  border: 1px solid rgba(214, 155, 104, 0.4);
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

  .intro-layout,
  .filter-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .categories {
    justify-content: flex-start;
  }

  .article-row {
    grid-template-columns: 1fr;
    gap: 22px;
  }

  .article-row:hover {
    padding-left: 0;
    padding-right: 0;
  }

  .read-button {
    justify-content: start;
  }
}
</style>
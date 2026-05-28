<script setup>
import { RouterLink } from 'vue-router'

const principles = [
  {
    number: '01',
    title: 'Visual Narrative',
    description:
      '通过电影感光影、大字号排版与沉浸式页面节奏，让技术内容拥有更具表现力的阅读体验。',
  },
  {
    number: '02',
    title: 'Structured Writing',
    description:
      '使用分类、检索与 Markdown 编辑流程组织文章，让灵感能够沉淀为可维护的数字档案。',
  },
  {
    number: '03',
    title: 'Creative Engineering',
    description:
      '将 Vue 组件化开发、状态管理与交互设计结合起来，完成从视觉概念到完整应用的实现。',
  },
]

const technologies = [
  'Vue 3',
  'Vite',
  'Vue Router',
  'Pinia',
  'Markdown Editor',
  'LocalStorage',
  'Responsive Design',
  'Mock JWT Auth',
]

const capabilities = [
  {
    title: 'Frontstage',
    items: [
      '电影感博客首页',
      '文章列表与搜索筛选',
      '文章详情阅读',
      '主题分类浏览',
    ],
  },
  {
    title: 'Backstage',
    items: [
      '登录认证与路由保护',
      '文章新增、编辑与删除',
      'Markdown 实时预览',
      '分类维护与关联更新',
    ],
  },
]
</script>

<template>
  <main class="about-page">
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
        <RouterLink to="/collections">Collections</RouterLink>
        <RouterLink class="active" to="/about">About</RouterLink>
      </nav>

      <RouterLink class="studio-button" to="/admin">
        Admin Studio
      </RouterLink>
    </header>

    <section class="hero-section">
      <div class="ambient-glow"></div>

      <p class="section-index">ABOUT / NOIR ARCHIVE</p>

      <div class="hero-layout">
        <h1>
          A journal built<br />
          between <span>code</span><br />
          and imagination.
        </h1>

        <div class="hero-copy">
          <p>
            Noir Archive 是一个兼具阅读体验与内容管理能力的数字博客系统。
            它将前端工程、视觉设计与人工智能创作主题汇聚在同一个沉浸式空间中。
          </p>

          <p>
            从电影感首页到文章后台工作室，每一个页面都尝试回答同一个问题：
            技术如何成为表达的一部分？
          </p>
        </div>
      </div>
    </section>

    <section class="manifesto-section">
      <div class="manifesto-heading">
        <p class="section-index">01 / MANIFESTO</p>
        <h2>
          Designed for<br />
          thoughtful creation.
        </h2>
      </div>

      <div class="principle-grid">
        <article
          v-for="principle in principles"
          :key="principle.number"
          class="principle-card"
        >
          <span class="principle-number">{{ principle.number }}</span>
          <h3>{{ principle.title }}</h3>
          <p>{{ principle.description }}</p>
        </article>
      </div>
    </section>

    <section class="system-section">
      <div class="system-intro">
        <p class="section-index">02 / SYSTEM</p>
        <h2>
          One archive,<br />
          two experiences.
        </h2>
        <p class="system-description">
          前台专注于浏览、搜索与沉浸式阅读；后台则负责创作、管理与内容组织。
          二者共享同一套文章与分类数据，使每次修改都能实时反馈到读者界面。
        </p>
      </div>

      <div class="capability-grid">
        <article
          v-for="capability in capabilities"
          :key="capability.title"
          class="capability-card"
        >
          <p class="capability-title">{{ capability.title }}</p>

          <ul>
            <li v-for="item in capability.items" :key="item">
              <span></span>
              {{ item }}
            </li>
          </ul>
        </article>
      </div>
    </section>

    <section class="technology-section">
      <div class="technology-heading">
        <p class="section-index">03 / TECHNOLOGY</p>
        <h2>Built with modern tools.</h2>
      </div>

      <div class="technology-list">
        <span v-for="technology in technologies" :key="technology">
          {{ technology }}
        </span>
      </div>
    </section>

    <section class="closing-section">
      <div>
        <p class="section-index">EXPLORE THE ARCHIVE</p>
        <h2>
          Continue reading<br />
          the journal.
        </h2>
      </div>

      <div class="closing-actions">
        <RouterLink class="primary-action" to="/articles">
          Browse Articles
        </RouterLink>
        <RouterLink class="secondary-action" to="/collections">
          View Collections
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

.about-page {
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

.section-index {
  margin: 0 0 27px;
  color: #b39376;
  font-size: 11px;
  letter-spacing: 0.34em;
}

.hero-section {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: calc(100vh - 92px);
  overflow: hidden;
  padding: clamp(72px, 9vw, 122px) clamp(24px, 7vw, 106px)
    clamp(76px, 10vw, 128px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.ambient-glow {
  position: absolute;
  right: 9%;
  bottom: 8%;
  width: min(420px, 38vw);
  height: min(420px, 38vw);
  pointer-events: none;
  background: rgba(161, 93, 50, 0.18);
  border-radius: 50%;
  filter: blur(88px);
}

.hero-layout {
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: clamp(52px, 8vw, 112px);
}

.hero-layout h1 {
  flex-shrink: 0;
  margin: 0;
  color: #f3eee8;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(57px, 7vw, 100px);
  font-weight: 400;
  line-height: 1.05;
  letter-spacing: -0.065em;
}

.hero-layout h1 span {
  color: #d4b08d;
}

.hero-copy {
  align-self: end;
  width: min(430px, 100%);
  padding-bottom: 14px;
}

.hero-copy p {
  margin: 0;
  color: #978e83;
  font-size: 15px;
  line-height: 2.1;
  letter-spacing: 0.05em;
}

.hero-copy p + p {
  margin-top: 27px;
}

.manifesto-section,
.system-section,
.technology-section,
.closing-section {
  background: #090909;
}

.manifesto-section {
  padding: clamp(70px, 9vw, 112px) clamp(24px, 7vw, 106px);
}

.manifesto-heading {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 42px;
  margin-bottom: clamp(48px, 7vw, 74px);
}

.manifesto-heading h2,
.system-intro h2,
.technology-heading h2,
.closing-section h2 {
  margin: 0;
  color: #efe8e1;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(43px, 5vw, 67px);
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: -0.055em;
}

.principle-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.principle-card {
  min-height: 330px;
  padding: clamp(27px, 4vw, 39px);
  background: #0d0d0d;
}

.principle-number {
  color: #655d55;
  font-family: Georgia, serif;
  font-size: 34px;
}

.principle-card h3 {
  margin: clamp(62px, 7vw, 83px) 0 20px;
  color: #ebe4dc;
  font-family: Georgia, serif;
  font-size: clamp(28px, 2.8vw, 35px);
  font-weight: 400;
  letter-spacing: -0.045em;
}

.principle-card p {
  margin: 0;
  color: #888077;
  font-size: 13px;
  line-height: 2;
}

.system-section {
  display: grid;
  grid-template-columns: minmax(340px, 0.88fr) minmax(420px, 1fr);
  gap: clamp(42px, 7vw, 94px);
  padding: clamp(72px, 9vw, 110px) clamp(24px, 7vw, 106px);
  background: #0b0b0b;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.system-description {
  max-width: 470px;
  margin: 31px 0 0;
  color: #8e857b;
  font-size: 14px;
  line-height: 2.05;
}

.capability-grid {
  display: grid;
  gap: 15px;
}

.capability-card {
  padding: clamp(29px, 4vw, 39px);
  background: #0f0f0e;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.capability-title {
  margin: 0 0 31px;
  color: #d2ab87;
  font-size: 11px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.capability-card ul {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px 25px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.capability-card li {
  display: flex;
  align-items: center;
  gap: 13px;
  color: #a0988e;
  font-size: 14px;
}

.capability-card li span {
  width: 5px;
  height: 5px;
  flex-shrink: 0;
  background: #d69b68;
  border-radius: 50%;
}

.technology-section {
  padding: clamp(68px, 9vw, 104px) clamp(24px, 7vw, 106px);
}

.technology-heading {
  margin-bottom: clamp(45px, 6vw, 64px);
}

.technology-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.technology-list span {
  padding: 20px clamp(22px, 3vw, 33px);
  color: #c7ad94;
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  background: #0d0d0d;
  border: 1px solid rgba(214, 155, 104, 0.23);
}

.closing-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 48px;
  margin: 0 clamp(24px, 7vw, 106px) clamp(70px, 9vw, 112px);
  padding: clamp(42px, 6vw, 62px);
  background:
    radial-gradient(circle at 87% 36%, rgba(145, 86, 48, 0.2), transparent 37%),
    #0f0f0e;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.closing-actions {
  display: flex;
  gap: 15px;
  flex-shrink: 0;
}

.primary-action,
.secondary-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 20px 30px;
  color: #eee6dc;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-decoration: none;
  text-transform: uppercase;
}

.primary-action {
  color: #1b1511;
  background: #e5d0ba;
  border: 1px solid #e5d0ba;
}

.secondary-action {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@media (max-width: 900px) {
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
  .manifesto-heading,
  .closing-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .principle-grid,
  .system-section {
    grid-template-columns: 1fr;
  }

  .closing-actions {
    flex-wrap: wrap;
  }
}

@media (max-width: 560px) {
  .hero-layout h1 {
    font-size: 46px;
  }

  .capability-card ul {
    grid-template-columns: 1fr;
  }

  .closing-actions,
  .primary-action,
  .secondary-action {
    width: 100%;
  }
}
</style>
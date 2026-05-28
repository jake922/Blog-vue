<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'
import { useBlogStore } from '../stores/blog'

const router = useRouter()
const authStore = useAuthStore()
const blogStore = useBlogStore()

const { user } = storeToRefs(authStore)
const { posts, categories } = storeToRefs(blogStore)

const recentPosts = computed(() => posts.value.slice(0, 4))
const featuredCount = computed(
  () => posts.value.filter((post) => post.featured).length,
)
const statistics = computed(() => [
  {
    label: 'Total Articles',
    value: String(posts.value.length).padStart(2, '0'),
    note: 'Published content',
  },
  {
  label: 'Featured',
  value: String(featuredCount.value).padStart(2, '0'),
  note: 'Selected content',
},
  {
    label: 'Categories',
    value: String(categories.value.length - 1).padStart(2, '0'),
    note: 'Content collections',
  },
])

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <main class="dashboard-page">
    <aside class="sidebar">
      <RouterLink class="brand" to="/">
        <span class="brand-mark"></span>
        <div>
          <p class="brand-name">NOIR ARCHIVE</p>
          <p class="brand-subtitle">Writing Studio</p>
        </div>
      </RouterLink>

      <nav class="dashboard-nav" aria-label="Dashboard navigation">
        <a class="nav-item active" href="#">
          <span class="nav-index">01</span>
          Dashboard
        </a>

        <RouterLink class="nav-item" to="/admin/articles">
  <span class="nav-index">02</span>
  Articles
</RouterLink>

       <RouterLink class="nav-item" to="/admin/categories">
  <span class="nav-index">03</span>
  Categories
</RouterLink>

        <RouterLink class="nav-item" to="/">
          <span class="nav-index">04</span>
          View Website
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <p class="status-label">AUTHENTICATED AS</p>
        <p class="user-name">{{ user?.name || 'Noir Editor' }}</p>
        <p class="user-role">{{ user?.role || 'Administrator' }}</p>

        <button class="logout-button" type="button" @click="handleLogout">
          Log Out
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </aside>

    <section class="dashboard-content">
      <header class="topbar">
        <div>
          <p class="chapter">ADMINISTRATION / OVERVIEW</p>
          <h1>Writing Studio</h1>
        </div>

        <div class="topbar-actions">
          <RouterLink class="preview-button" to="/">
            Preview Site
          </RouterLink>
          <RouterLink class="new-button" to="/admin/articles/new">
  New Article
</RouterLink>
        </div>
      </header>

      <section class="welcome-panel">
        <div>
          <p class="welcome-label">WELCOME BACK</p>
          <h2>
            Good evening,<br />
            <span>{{ user?.name || 'Noir Editor' }}.</span>
          </h2>
        </div>

        <p class="welcome-text">
          今天的创作工作室已经准备就绪。你可以整理文章内容、
          管理精选作品，并继续扩展你的数字档案。
        </p>
      </section>

      <section class="statistics-grid" aria-label="Statistics">
        <article
          v-for="statistic in statistics"
          :key="statistic.label"
          class="statistic-card"
        >
          <p class="statistic-label">{{ statistic.label }}</p>
          <p class="statistic-value">{{ statistic.value }}</p>
          <p class="statistic-note">{{ statistic.note }}</p>
        </article>
      </section>

      <section class="content-panel">
        <div class="panel-header">
          <div>
            <p class="panel-index">RECENT CONTENT</p>
            <h2>Latest articles</h2>
          </div>

          <RouterLink class="manage-button" to="/admin/articles">
  Manage All
  <span aria-hidden="true">→</span>
</RouterLink>
        </div>

        <div class="article-table">
          <article
            v-for="post in recentPosts"
            :key="post.id"
            class="article-item"
          >
            <span class="article-number">{{ post.number }}</span>

            <div class="article-information">
              <p class="article-category">{{ post.category }}</p>
              <h3>{{ post.title }}</h3>
            </div>

            <div class="article-status">
              <span
                class="featured-status"
                :class="{ muted: !post.featured }"
              >
                {{ post.featured ? 'Featured' : 'Published' }}
              </span>
              <p>{{ post.date }}</p>
            </div>

            <RouterLink
  class="edit-button"
  :to="`/admin/articles/edit/${post.id}`"
>
  Edit
</RouterLink>
          </article>
        </div>
      </section>

      <section class="workflow-panel">
        <div class="workflow-heading">
          <p class="panel-index">EDITORIAL WORKFLOW</p>
          <h2>Next actions</h2>
        </div>

        <div class="workflow-grid">
          <article class="workflow-card">
            <span>01</span>
            <h3>Create a new story</h3>
            <p>使用 Markdown 编辑器发布新的文章内容。</p>
          </article>

          <article class="workflow-card">
            <span>02</span>
            <h3>Curate collections</h3>
            <p>选择文章分类，并调整首页精选作品。</p>
          </article>

          <article class="workflow-card">
            <span>03</span>
            <h3>Review website</h3>
            <p>返回前台页面，检查文章阅读体验。</p>
          </article>
        </div>
      </section>
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

.dashboard-page {
  display: grid;
  grid-template-columns: 288px minmax(0, 1fr);
  min-height: 100vh;
  color: #f3eee8;
  background:
    radial-gradient(circle at 88% 0%, rgba(112, 68, 41, 0.16), transparent 27%),
    #090909;
}

.sidebar {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 34px 29px 30px;
  background: #0c0c0c;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
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

.dashboard-nav {
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin-top: clamp(58px, 10vh, 92px);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 19px;
  padding: 18px 15px;
  color: #827b73;
  font-size: 13px;
  letter-spacing: 0.14em;
  text-decoration: none;
  text-transform: uppercase;
  border: 1px solid transparent;
  transition:
    color 0.25s ease,
    background 0.25s ease,
    border-color 0.25s ease;
}

.nav-index {
  color: #5e5750;
  font-size: 10px;
  letter-spacing: 0.2em;
}

.nav-item:hover,
.nav-item.active {
  color: #efe8df;
  background: rgba(214, 155, 104, 0.07);
  border-color: rgba(214, 155, 104, 0.28);
}

.nav-item.active .nav-index {
  color: #d69b68;
}

.sidebar-footer {
  margin-top: auto;
  padding-top: 28px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.status-label {
  margin: 0 0 16px;
  color: #69625b;
  font-size: 10px;
  letter-spacing: 0.27em;
}

.user-name {
  margin: 0 0 8px;
  color: #f0e9e1;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 25px;
}

.user-role {
  margin: 0 0 31px;
  color: #8d8379;
  font-size: 12px;
  letter-spacing: 0.14em;
}

.logout-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px 18px;
  color: #c9af96;
  font-size: 11px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  cursor: pointer;
  background: transparent;
  border: 1px solid rgba(214, 155, 104, 0.3);
  transition: background 0.25s ease;
}

.logout-button:hover {
  background: rgba(214, 155, 104, 0.1);
}

.dashboard-content {
  padding: clamp(30px, 4vw, 48px) clamp(30px, 5vw, 64px) 64px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 36px;
  margin-bottom: clamp(46px, 6vw, 64px);
}

.chapter {
  margin: 0 0 17px;
  color: #b79576;
  font-size: 10px;
  letter-spacing: 0.34em;
}

.topbar h1 {
  margin: 0;
  color: #f3efe9;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(43px, 5vw, 58px);
  font-weight: 400;
  letter-spacing: -0.055em;
}

.topbar-actions {
  display: flex;
  gap: 13px;
}

.preview-button,
.new-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  padding: 0 24px;
  font-size: 11px;
  letter-spacing: 0.23em;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
}

.preview-button {
  color: #ddd2c6;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.new-button {
  color: #1c1511;
  background: #e5d0ba;
  border: 1px solid #e5d0ba;
}

.welcome-panel {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 48px;
  padding: clamp(34px, 5vw, 52px);
  margin-bottom: 25px;
  overflow: hidden;
  background:
    radial-gradient(circle at 88% 34%, rgba(171, 99, 52, 0.2), transparent 32%),
    #10100f;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.welcome-label {
  margin: 0 0 22px;
  color: #ad8d71;
  font-size: 10px;
  letter-spacing: 0.32em;
}

.welcome-panel h2 {
  margin: 0;
  color: #f1ece6;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(38px, 4.2vw, 56px);
  font-weight: 400;
  line-height: 1.13;
  letter-spacing: -0.055em;
}

.welcome-panel h2 span {
  color: #d7b594;
}

.welcome-text {
  max-width: 370px;
  margin: 0;
  color: #91887e;
  font-size: 14px;
  line-height: 2;
  letter-spacing: 0.045em;
}

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 25px;
}

.statistic-card {
  padding: 29px 31px;
  background: #0e0e0e;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.statistic-label {
  margin: 0 0 28px;
  color: #837a70;
  font-size: 10px;
  letter-spacing: 0.27em;
  text-transform: uppercase;
}

.statistic-value {
  margin: 0 0 14px;
  color: #f0e9e1;
  font-family: Georgia, serif;
  font-size: 49px;
  line-height: 1;
}

.statistic-note {
  margin: 0;
  color: #726b63;
  font-size: 12px;
  letter-spacing: 0.09em;
}

.content-panel,
.workflow-panel {
  padding: clamp(29px, 4vw, 39px);
  margin-bottom: 25px;
  background: #0d0d0d;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.panel-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 28px;
  margin-bottom: 32px;
}

.panel-index {
  margin: 0 0 16px;
  color: #ac8a6d;
  font-size: 10px;
  letter-spacing: 0.3em;
}

.panel-header h2,
.workflow-heading h2 {
  margin: 0;
  color: #eee8e1;
  font-family: Georgia, serif;
  font-size: 35px;
  font-weight: 400;
  letter-spacing: -0.045em;
}

.manage-button {
  display: inline-flex;
  align-items: center;
  gap: 13px;
  padding: 0 0 8px;
  text-decoration: none;
  color: #c8ad91;
  font-size: 10px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  cursor: pointer;
  background: transparent;
  border: 0;
  border-bottom: 1px solid rgba(214, 155, 104, 0.4);
}

.manage-button span {
  font-size: 18px;
}

.article-table {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.article-item {
  display: grid;
  grid-template-columns: 55px minmax(260px, 1fr) 180px 64px;
  align-items: center;
  gap: 28px;
  padding: 25px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.article-number {
  color: #625a53;
  font-family: Georgia, serif;
  font-size: 28px;
}

.article-category {
  margin: 0 0 9px;
  color: #caa482;
  font-size: 9px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
}

.article-information h3 {
  margin: 0;
  color: #e8e1da;
  font-family: Georgia, serif;
  font-size: 22px;
  font-weight: 400;
  letter-spacing: -0.03em;
}

.article-status {
  text-align: right;
}

.article-status p {
  margin: 11px 0 0;
  color: #70685f;
  font-size: 10px;
  letter-spacing: 0.19em;
}

.featured-status {
  display: inline-flex;
  padding: 7px 11px;
  color: #d6b08d;
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  background: rgba(214, 155, 104, 0.09);
  border: 1px solid rgba(214, 155, 104, 0.28);
}

.featured-status.muted {
  color: #8b8176;
  background: transparent;
  border-color: rgba(255, 255, 255, 0.12);
}

.edit-button {
  color: #af9680;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  cursor: pointer;
  text-decoration: none;
  background: transparent;
  border: 0;
}

.edit-button:hover {
  color: #efe5da;
}

.workflow-heading {
  margin-bottom: 29px;
}

.workflow-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 13px;
}

.workflow-card {
  padding: 25px 25px 28px;
  background: #10100f;
  border: 1px solid rgba(255, 255, 255, 0.09);
}

.workflow-card span {
  color: #c29c77;
  font-family: Georgia, serif;
  font-size: 25px;
}

.workflow-card h3 {
  margin: 37px 0 13px;
  color: #ece5de;
  font-family: Georgia, serif;
  font-size: 25px;
  font-weight: 400;
  letter-spacing: -0.04em;
}

.workflow-card p {
  margin: 0;
  color: #80776e;
  font-size: 13px;
  line-height: 1.9;
}

@media (max-width: 1120px) {
  .dashboard-page {
    display: block;
  }

  .sidebar {
  position: static;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas:
    'brand footer'
    'nav nav';
  align-items: center;
  gap: 22px 24px;
  height: auto;
  padding: 22px clamp(20px, 4vw, 32px);
}

.brand {
  grid-area: brand;
}

.dashboard-nav {
  grid-area: nav;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 0;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-footer {
  grid-area: footer;
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: 0;
  padding-top: 0;
  border-top: 0;
}
  .nav-item {
    gap: 12px;
    padding: 14px 15px;
    font-size: 12px;
  }

  .status-label,
  .user-role {
    display: none;
  }

  .user-name {
    margin: 0;
    font-size: 19px;
    white-space: nowrap;
  }

  .logout-button {
    width: auto;
    gap: 18px;
    padding: 14px 16px;
  }

  .dashboard-content {
    padding: 36px clamp(24px, 5vw, 46px) 56px;
  }

  .article-item {
    grid-template-columns: 55px minmax(0, 1fr) auto;
    grid-template-areas:
      'number information information'
      'number status edit';
    gap: 15px 25px;
  }

  .article-number {
    grid-area: number;
    align-self: start;
  }

  .article-information {
    grid-area: information;
    min-width: 0;
  }

  .article-status {
    grid-area: status;
    display: flex;
    align-items: center;
    gap: 18px;
    text-align: left;
  }

  .article-status p {
    margin: 0;
  }

  .edit-button {
    grid-area: edit;
    justify-self: end;
  }
}

@media (max-width: 780px) {
  .sidebar {
    display: block;
    padding: 24px 20px;
  }

  .dashboard-nav {
    justify-content: flex-start;
    margin-top: 28px;
  }

  .sidebar-footer {
    display: block;
    margin-top: 24px;
    padding-top: 22px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .status-label,
  .user-role {
    display: block;
  }

  .status-label {
    margin-bottom: 14px;
  }

  .user-name {
    margin-bottom: 8px;
    font-size: 23px;
  }

  .user-role {
    margin-bottom: 24px;
  }

  .logout-button {
    width: 100%;
  }

  .dashboard-content {
    padding: 28px 20px 48px;
  }

  .topbar,
  .welcome-panel,
  .panel-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .topbar-actions {
    width: 100%;
    flex-direction: column;
  }

  .preview-button,
  .new-button {
    width: 100%;
  }

  .statistics-grid,
  .workflow-grid {
    grid-template-columns: 1fr;
  }

  .article-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 17px;
  }

  .article-status {
    display: block;
  }

  .article-status p {
    margin-top: 11px;
  }

  .edit-button {
    justify-self: auto;
  }
}
</style>
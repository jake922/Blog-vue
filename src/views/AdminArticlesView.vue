<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'
import { useBlogStore } from '../stores/blog'

const router = useRouter()
const authStore = useAuthStore()
const blogStore = useBlogStore()

const { user } = storeToRefs(authStore)
const { posts, categories } = storeToRefs(blogStore)

const searchKeyword = ref('')
const activeCategory = ref('All')
const pendingDeletePost = ref(null)
const notice = ref('')

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

const featuredCount = computed(
  () => posts.value.filter((post) => post.featured).length,
)

let noticeTimer

const showNotice = (message) => {
  notice.value = message
  clearTimeout(noticeTimer)

  noticeTimer = setTimeout(() => {
    notice.value = ''
  }, 2600)
}

const selectCategory = (category) => {
  activeCategory.value = category
}

const requestDelete = (post) => {
  pendingDeletePost.value = post
}

const cancelDelete = () => {
  pendingDeletePost.value = null
}

const confirmDelete = () => {
  if (!pendingDeletePost.value) {
    return
  }

  const deletedTitle = pendingDeletePost.value.title
  blogStore.deletePost(pendingDeletePost.value.id)
  pendingDeletePost.value = null
  showNotice(`已删除文章：${deletedTitle}`)
}

const restoreDemoPosts = () => {
  blogStore.resetPosts()
  searchKeyword.value = ''
  activeCategory.value = 'All'
  showNotice('已恢复默认演示文章。')
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <main class="management-page">
    <aside class="sidebar">
      <RouterLink class="brand" to="/">
        <span class="brand-mark"></span>
        <div>
          <p class="brand-name">NOIR ARCHIVE</p>
          <p class="brand-subtitle">Writing Studio</p>
        </div>
      </RouterLink>

      <nav class="dashboard-nav" aria-label="Dashboard navigation">
        <RouterLink class="nav-item" to="/admin">
          <span class="nav-index">01</span>
          Dashboard
        </RouterLink>

        <RouterLink class="nav-item active" to="/admin/articles">
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

    <section class="management-content">
      <header class="topbar">
        <div>
          <p class="chapter">ADMINISTRATION / ARTICLES</p>
          <h1>Article Library</h1>
        </div>

        <div class="topbar-actions">
          <button class="restore-button" type="button" @click="restoreDemoPosts">
            Restore Demo Data
          </button>

          <RouterLink class="new-button" to="/admin/articles/new">
  New Article
</RouterLink>
        </div>
      </header>

      <section class="summary-grid" aria-label="Article statistics">
        <article class="summary-card">
          <p>Total Articles</p>
          <strong>{{ String(posts.length).padStart(2, '0') }}</strong>
        </article>

        <article class="summary-card">
          <p>Featured</p>
          <strong>{{ String(featuredCount).padStart(2, '0') }}</strong>
        </article>

        <article class="summary-card">
          <p>Categories</p>
          <strong>{{ String(categories.length - 1).padStart(2, '0') }}</strong>
        </article>
      </section>

      <section class="library-panel">
        <div class="panel-heading">
          <div>
            <p class="panel-index">CONTENT MANAGEMENT</p>
            <h2>Published articles</h2>
          </div>

          <p class="panel-description">
            搜索、筛选并维护当前发布的文章内容。
          </p>
        </div>

        <div class="filter-bar">
          <label class="search-box">
            <span>SEARCH ARTICLES</span>
            <input
              v-model="searchKeyword"
              type="search"
              placeholder="Search title or category..."
            />
          </label>

          <div class="categories" aria-label="Management categories">
            <button
              v-for="category in categories"
              :key="category"
              class="category-button"
              :class="{ selected: activeCategory === category }"
              type="button"
              @click="selectCategory(category)"
            >
              {{ category }}
            </button>
          </div>
        </div>

        <div class="table-heading">
          <span>ARTICLE</span>
          <span>CATEGORY</span>
          <span>STATUS</span>
          <span>DATE</span>
          <span>ACTIONS</span>
        </div>

        <div v-if="filteredPosts.length" class="article-table">
          <article
            v-for="post in filteredPosts"
            :key="post.id"
            class="article-row"
          >
            <div class="article-title">
              <span class="article-number">{{ post.number }}</span>
              <div>
                <h3>{{ post.title }}</h3>
                <p>{{ post.excerpt }}</p>
              </div>
            </div>

            <p class="category">{{ post.category }}</p>

            <span class="status" :class="{ published: !post.featured }">
              {{ post.featured ? 'Featured' : 'Published' }}
            </span>

            <p class="date">{{ post.date }}</p>

            <div class="actions">
              <RouterLink
  class="edit-button"
  :to="`/admin/articles/edit/${post.id}`"
>
  Edit
</RouterLink>
              <button
                class="delete-button"
                type="button"
                @click="requestDelete(post)"
              >
                Delete
              </button>
            </div>
          </article>
        </div>

        <div v-else class="empty-state">
          <h3>No articles found.</h3>
          <p>没有找到符合当前搜索条件的文章。</p>
        </div>
      </section>
    </section>

    <transition name="notice">
      <div v-if="notice" class="notice" role="status">
        <span class="notice-mark"></span>
        {{ notice }}
      </div>
    </transition>

    <transition name="modal">
      <div
        v-if="pendingDeletePost"
        class="modal-backdrop"
        @click.self="cancelDelete"
      >
        <section class="delete-dialog" role="dialog" aria-modal="true">
          <p class="dialog-index">DELETE ARTICLE</p>
          <h2>Confirm deletion?</h2>
          <p class="dialog-description">
            你将删除文章
            <strong>“{{ pendingDeletePost.title }}”</strong>。
            删除后，前台列表和精选区域会同步更新。
          </p>

          <div class="dialog-actions">
            <button class="cancel-button" type="button" @click="cancelDelete">
              Cancel
            </button>
            <button
              class="confirm-button"
              type="button"
              @click="confirmDelete"
            >
              Delete Article
            </button>
          </div>
        </section>
      </div>
    </transition>
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

.management-page {
  display: grid;
  grid-template-columns: 288px minmax(0, 1fr);
  min-height: 100vh;
  color: #f3eee8;
  background:
    radial-gradient(circle at 90% 0%, rgba(112, 68, 41, 0.14), transparent 28%),
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
}

.management-content {
  min-width: 0;
  padding: clamp(30px, 4vw, 48px) clamp(30px, 5vw, 64px) 64px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 32px;
  margin-bottom: clamp(38px, 5vw, 54px);
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

.restore-button,
.new-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  padding: 0 22px;
  text-decoration: none;
  font-size: 11px;
  letter-spacing: 0.21em;
  text-transform: uppercase;
  cursor: pointer;
}

.restore-button {
  color: #d5c6b7;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.new-button {
  color: #1c1511;
  background: #e5d0ba;
  border: 1px solid #e5d0ba;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(180px, 1fr));
  gap: 14px;
  margin-bottom: 24px;
}

.summary-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 25px 28px;
  background: #0e0e0e;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.summary-card p {
  margin: 0;
  color: #827970;
  font-size: 10px;
  letter-spacing: 0.26em;
  text-transform: uppercase;
}

.summary-card strong {
  color: #e6d2be;
  font-family: Georgia, serif;
  font-size: 38px;
  font-weight: 400;
}

.library-panel {
  padding: clamp(28px, 4vw, 40px);
  background: #0d0d0d;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.panel-heading {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 32px;
  margin-bottom: 34px;
}

.panel-index {
  margin: 0 0 16px;
  color: #ac8a6d;
  font-size: 10px;
  letter-spacing: 0.3em;
}

.panel-heading h2 {
  margin: 0;
  color: #eee8e1;
  font-family: Georgia, serif;
  font-size: 36px;
  font-weight: 400;
  letter-spacing: -0.045em;
}

.panel-description {
  max-width: 300px;
  margin: 0;
  color: #81786e;
  font-size: 13px;
  line-height: 1.85;
  letter-spacing: 0.04em;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 34px;
  margin-bottom: 38px;
  padding: 23px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.search-box {
  width: min(290px, 100%);
}

.search-box span {
  display: block;
  margin-bottom: 13px;
  color: #756d64;
  font-size: 9px;
  letter-spacing: 0.28em;
}

.search-box input {
  width: 100%;
  padding: 0 0 12px;
  color: #ede7df;
  background: transparent;
  border: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.21);
  outline: none;
}

.search-box input::placeholder {
  color: #59544e;
}

.search-box input:focus {
  border-color: #d69b68;
}

.categories {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.category-button {
  padding: 11px 14px;
  color: #847c73;
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  cursor: pointer;
  background: transparent;
  border: 1px solid transparent;
}

.category-button:hover,
.category-button.selected {
  color: #ede5dc;
  background: rgba(214, 155, 104, 0.08);
  border-color: rgba(214, 155, 104, 0.4);
}

.table-heading {
  display: grid;
  grid-template-columns: minmax(300px, 1fr) 165px 125px 135px 130px;
  gap: 22px;
  padding: 0 0 17px;
  color: #686159;
  font-size: 9px;
  letter-spacing: 0.3em;
}

.article-table {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.article-row {
  display: grid;
  grid-template-columns: minmax(300px, 1fr) 165px 125px 135px 130px;
  align-items: center;
  gap: 22px;
  min-height: 126px;
  padding: 22px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.article-title {
  display: flex;
  align-items: start;
  gap: 22px;
}

.article-number {
  color: #5c554d;
  font-family: Georgia, serif;
  font-size: 28px;
}

.article-title h3 {
  margin: 0 0 9px;
  color: #ece5dd;
  font-family: Georgia, serif;
  font-size: 22px;
  font-weight: 400;
  letter-spacing: -0.035em;
}

.article-title p {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  color: #746d65;
  font-size: 12px;
  line-height: 1.7;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.category,
.date {
  margin: 0;
  color: #a18871;
  font-size: 10px;
  line-height: 1.9;
  letter-spacing: 0.19em;
  text-transform: uppercase;
}

.date {
  color: #797168;
}

.status {
  width: max-content;
  padding: 7px 10px;
  color: #d6b08d;
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  background: rgba(214, 155, 104, 0.09);
  border: 1px solid rgba(214, 155, 104, 0.28);
}

.status.published {
  color: #8b8176;
  background: transparent;
  border-color: rgba(255, 255, 255, 0.12);
}

.actions {
  display: flex;
  gap: 16px;
}

.edit-button,
.delete-button {
  padding: 0;
  text-decoration: none;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
  background: transparent;
  border: 0;
}

.edit-button {
  color: #c2a78d;
}

.delete-button {
  color: #94766d;
}

.delete-button:hover {
  color: #dda37b;
}

.empty-state {
  padding: 84px 24px;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.empty-state h3 {
  margin: 0 0 16px;
  color: #efe8e0;
  font-family: Georgia, serif;
  font-size: 38px;
  font-weight: 400;
}

.empty-state p {
  margin: 0;
  color: #837a70;
}

.notice {
  position: fixed;
  right: 34px;
  bottom: 30px;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 17px 23px;
  color: #ddd2c7;
  font-size: 13px;
  background: #171411;
  border: 1px solid rgba(214, 155, 104, 0.36);
}

.notice-mark {
  width: 8px;
  height: 8px;
  background: #d69b68;
  border-radius: 50%;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 30;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(4, 4, 4, 0.76);
  backdrop-filter: blur(5px);
}

.delete-dialog {
  width: min(520px, 100%);
  padding: clamp(34px, 5vw, 47px);
  background: #10100f;
  border: 1px solid rgba(214, 155, 104, 0.34);
}

.dialog-index {
  margin: 0 0 22px;
  color: #c19b77;
  font-size: 10px;
  letter-spacing: 0.31em;
}

.delete-dialog h2 {
  margin: 0 0 22px;
  color: #f0e9e1;
  font-family: Georgia, serif;
  font-size: 43px;
  font-weight: 400;
  letter-spacing: -0.045em;
}

.dialog-description {
  margin: 0 0 38px;
  color: #91887d;
  font-size: 14px;
  line-height: 2;
}

.dialog-description strong {
  color: #d6b493;
  font-weight: normal;
}

.dialog-actions {
  display: flex;
  gap: 13px;
}

.cancel-button,
.confirm-button {
  min-height: 50px;
  padding: 0 23px;
  font-size: 11px;
  letter-spacing: 0.19em;
  text-transform: uppercase;
  cursor: pointer;
}

.cancel-button {
  color: #d6ccc1;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.19);
}

.confirm-button {
  color: #241610;
  background: #d2a27f;
  border: 1px solid #d2a27f;
}

.notice-enter-active,
.notice-leave-active,
.modal-enter-active,
.modal-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.notice-enter-from,
.notice-leave-to {
  opacity: 0;
  transform: translateY(13px);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@media (max-width: 1120px) {
  .management-page {
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

  .management-content {
    padding: 36px clamp(24px, 5vw, 46px) 56px;
  }

  .table-heading {
    display: none;
  }

  .article-row {
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas:
      'title title'
      'category status'
      'date actions';
    gap: 16px 24px;
    min-height: unset;
    padding: 26px 0;
  }

  .article-title {
    grid-area: title;
    min-width: 0;
  }

  .category {
    grid-area: category;
  }

  .status {
    grid-area: status;
    justify-self: end;
  }

  .date {
    grid-area: date;
  }

  .actions {
    grid-area: actions;
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

  .management-content {
    padding: 28px 20px 48px;
  }

  .topbar,
  .panel-heading,
  .filter-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .topbar-actions {
    width: 100%;
    flex-direction: column;
  }

  .restore-button,
  .new-button {
    width: 100%;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .categories {
    justify-content: flex-start;
  }

  .article-row {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 17px;
  }

  .actions {
    justify-self: auto;
  }

  .status {
    justify-self: auto;
  }

  .dialog-actions {
    flex-direction: column;
  }

  .cancel-button,
  .confirm-button {
    width: 100%;
  }
}
</style>
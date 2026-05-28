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
const { categoryStatistics, posts } = storeToRefs(blogStore)

const newCategoryName = ref('')
const editingCategory = ref('')
const editedCategoryName = ref('')
const pendingDeleteCategory = ref('')
const notice = ref('')
const errorMessage = ref('')

const totalCategories = computed(() => categoryStatistics.value.length)
const activeCategories = computed(
  () =>
    categoryStatistics.value.filter((category) => category.articleCount > 0)
      .length,
)
const emptyCategories = computed(
  () =>
    categoryStatistics.value.filter((category) => category.articleCount === 0)
      .length,
)

let noticeTimer

const clearMessages = () => {
  notice.value = ''
  errorMessage.value = ''
}

const showNotice = (message) => {
  notice.value = message
  errorMessage.value = ''
  clearTimeout(noticeTimer)

  noticeTimer = setTimeout(() => {
    notice.value = ''
  }, 2600)
}

const handleAddCategory = () => {
  clearMessages()

  const result = blogStore.addCategory(newCategoryName.value)

  if (!result.success) {
    errorMessage.value = result.message
    return
  }

  newCategoryName.value = ''
  showNotice(result.message)
}

const startRename = (categoryName) => {
  clearMessages()
  editingCategory.value = categoryName
  editedCategoryName.value = categoryName
}

const cancelRename = () => {
  editingCategory.value = ''
  editedCategoryName.value = ''
  errorMessage.value = ''
}

const confirmRename = () => {
  const result = blogStore.renameCategory(
    editingCategory.value,
    editedCategoryName.value,
  )

  if (!result.success) {
    errorMessage.value = result.message
    return
  }

  editingCategory.value = ''
  editedCategoryName.value = ''
  showNotice(result.message)
}

const requestDelete = (categoryName) => {
  clearMessages()
  pendingDeleteCategory.value = categoryName
}

const cancelDelete = () => {
  pendingDeleteCategory.value = ''
}

const confirmDelete = () => {
  const result = blogStore.deleteCategory(pendingDeleteCategory.value)

  if (!result.success) {
    pendingDeleteCategory.value = ''
    errorMessage.value = result.message
    return
  }

  pendingDeleteCategory.value = ''
  showNotice(result.message)
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <main class="categories-page">
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

        <RouterLink class="nav-item" to="/admin/articles">
          <span class="nav-index">02</span>
          Articles
        </RouterLink>

        <RouterLink class="nav-item active" to="/admin/categories">
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

    <section class="categories-content">
      <header class="topbar">
        <div>
          <p class="chapter">ADMINISTRATION / CATEGORIES</p>
          <h1>Collections</h1>
        </div>

        <RouterLink class="article-button" to="/admin/articles">
          Manage Articles
        </RouterLink>
      </header>

      <section class="hero-panel">
        <div>
          <p class="panel-index">ORGANIZE CONTENT</p>
          <h2>
            Shape your<br />
            <span>editorial system.</span>
          </h2>
        </div>

        <p>
          创建并维护文章分类，建立清晰的内容结构。
          重命名已有分类时，关联文章将会同步更新。
        </p>
      </section>

      <section class="statistics-grid">
        <article class="statistic-card">
          <p>Total Categories</p>
          <strong>{{ String(totalCategories).padStart(2, '0') }}</strong>
        </article>

        <article class="statistic-card">
          <p>Active</p>
          <strong>{{ String(activeCategories).padStart(2, '0') }}</strong>
        </article>

        <article class="statistic-card">
          <p>Empty</p>
          <strong>{{ String(emptyCategories).padStart(2, '0') }}</strong>
        </article>
      </section>

      <section class="manager-grid">
        <section class="create-panel">
          <p class="panel-index">NEW COLLECTION</p>
          <h2>Create category</h2>
          <p class="panel-description">
            添加新的内容分类，创建后即可用于文章组织与筛选。
          </p>

          <form class="create-form" @submit.prevent="handleAddCategory">
            <label>
              <span>CATEGORY NAME</span>
              <input
                v-model="newCategoryName"
                type="text"
                placeholder="e.g. Motion Design"
                @input="clearMessages"
              />
            </label>

            <button type="submit">Add Category</button>
          </form>

          <p v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </p>
        </section>

        <section class="list-panel">
          <div class="list-heading">
            <div>
              <p class="panel-index">ALL COLLECTIONS</p>
              <h2>Category library</h2>
            </div>

            <span>{{ posts.length }} articles assigned</span>
          </div>

          <div class="category-list">
            <article
              v-for="(category, index) in categoryStatistics"
              :key="category.name"
              class="category-item"
            >
              <span class="category-number">
                {{ String(index + 1).padStart(2, '0') }}
              </span>

              <div v-if="editingCategory !== category.name" class="category-info">
                <h3>{{ category.name }}</h3>
                <p>
                  {{ category.articleCount }}
                  {{ category.articleCount === 1 ? 'article' : 'articles' }}
                </p>
              </div>

              <div v-else class="rename-field">
                <input
                  v-model="editedCategoryName"
                  type="text"
                  @keyup.enter="confirmRename"
                  @keyup.esc="cancelRename"
                />
              </div>

              <span
                class="category-status"
                :class="{ empty: category.articleCount === 0 }"
              >
                {{ category.articleCount > 0 ? 'Active' : 'Empty' }}
              </span>

              <div
                v-if="editingCategory !== category.name"
                class="category-actions"
              >
                <button type="button" @click="startRename(category.name)">
                  Rename
                </button>
                <button
                  type="button"
                  class="delete-button"
                  @click="requestDelete(category.name)"
                >
                  Delete
                </button>
              </div>

              <div v-else class="category-actions">
                <button type="button" @click="confirmRename">
                  Save
                </button>
                <button
                  type="button"
                  class="delete-button"
                  @click="cancelRename"
                >
                  Cancel
                </button>
              </div>
            </article>
          </div>
        </section>
      </section>
    </section>

    <transition name="notice">
      <div v-if="notice" class="notice" role="status">
        <span></span>
        {{ notice }}
      </div>
    </transition>

    <transition name="modal">
      <div
        v-if="pendingDeleteCategory"
        class="modal-backdrop"
        @click.self="cancelDelete"
      >
        <section class="delete-dialog" role="dialog" aria-modal="true">
          <p class="panel-index">DELETE COLLECTION</p>
          <h2>Remove category?</h2>
          <p>
            是否删除分类
            <strong>“{{ pendingDeleteCategory }}”</strong>？
            已有关联文章的分类将无法被删除。
          </p>

          <div class="dialog-actions">
            <button type="button" class="cancel-dialog" @click="cancelDelete">
              Cancel
            </button>
            <button type="button" class="confirm-dialog" @click="confirmDelete">
              Delete Category
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

.categories-page {
  display: grid;
  grid-template-columns: 288px minmax(0, 1fr);
  min-height: 100vh;
  color: #f3eee8;
  background:
    radial-gradient(circle at 91% 2%, rgba(114, 70, 43, 0.16), transparent 28%),
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
  font-family: Georgia, serif;
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

.categories-content {
  min-width: 0;
  padding: clamp(30px, 4vw, 48px) clamp(30px, 5vw, 64px) 64px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 32px;
  margin-bottom: clamp(36px, 5vw, 52px);
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
  font-family: Georgia, serif;
  font-size: clamp(44px, 5vw, 60px);
  font-weight: 400;
  letter-spacing: -0.055em;
}

.article-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  padding: 0 25px;
  color: #ded2c4;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-decoration: none;
  text-transform: uppercase;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.hero-panel {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 48px;
  padding: clamp(34px, 5vw, 52px);
  margin-bottom: 22px;
  background:
    radial-gradient(circle at 86% 36%, rgba(171, 99, 52, 0.2), transparent 32%),
    #10100f;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.panel-index {
  margin: 0 0 17px;
  color: #af8b6b;
  font-size: 10px;
  letter-spacing: 0.31em;
}

.hero-panel h2 {
  margin: 0;
  color: #f0eae3;
  font-family: Georgia, serif;
  font-size: clamp(37px, 4.2vw, 53px);
  font-weight: 400;
  line-height: 1.12;
  letter-spacing: -0.05em;
}

.hero-panel h2 span {
  color: #d7b594;
}

.hero-panel > p {
  max-width: 390px;
  margin: 0;
  color: #92887d;
  font-size: 14px;
  line-height: 2;
}

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 22px;
}

.statistic-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 26px 29px;
  background: #0e0e0e;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.statistic-card p {
  margin: 0;
  color: #817970;
  font-size: 10px;
  letter-spacing: 0.26em;
  text-transform: uppercase;
}

.statistic-card strong {
  color: #e4ceb7;
  font-family: Georgia, serif;
  font-size: 41px;
  font-weight: 400;
}

.manager-grid {
  display: grid;
  grid-template-columns: minmax(275px, 0.78fr) minmax(460px, 1.42fr);
  gap: 15px;
}

.create-panel,
.list-panel {
  padding: clamp(27px, 3vw, 37px);
  background: #0d0d0d;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.create-panel h2,
.list-heading h2 {
  margin: 0 0 17px;
  color: #ece6de;
  font-family: Georgia, serif;
  font-size: 34px;
  font-weight: 400;
  letter-spacing: -0.045em;
}

.panel-description {
  margin: 0 0 34px;
  color: #837a70;
  font-size: 13px;
  line-height: 1.9;
}

.create-form label span {
  display: block;
  margin-bottom: 14px;
  color: #786f65;
  font-size: 9px;
  letter-spacing: 0.28em;
}

.create-form input {
  width: 100%;
  padding: 0 0 15px;
  color: #e9e1d7;
  background: transparent;
  border: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.21);
  outline: none;
}

.create-form input:focus,
.rename-field input:focus {
  border-color: #d69b68;
}

.create-form button {
  width: 100%;
  min-height: 54px;
  margin-top: 31px;
  color: #211711;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  cursor: pointer;
  background: #e5cfb9;
  border: 1px solid #e5cfb9;
}

.error-message {
  margin: 23px 0 0;
  padding: 15px;
  color: #daa17b;
  font-size: 13px;
  background: rgba(150, 69, 45, 0.12);
  border: 1px solid rgba(212, 125, 83, 0.3);
}

.list-heading {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 26px;
  margin-bottom: 27px;
}

.list-heading h2 {
  margin-bottom: 0;
}

.list-heading > span {
  color: #756d65;
  font-size: 11px;
  letter-spacing: 0.17em;
  text-transform: uppercase;
}

.category-list {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.category-item {
  display: grid;
  grid-template-columns: 48px minmax(160px, 1fr) 85px 133px;
  align-items: center;
  gap: 20px;
  min-height: 98px;
  padding: 20px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.category-number {
  color: #625a53;
  font-family: Georgia, serif;
  font-size: 27px;
}

.category-info h3 {
  margin: 0 0 9px;
  color: #ece5dd;
  font-family: Georgia, serif;
  font-size: 24px;
  font-weight: 400;
}

.category-info p {
  margin: 0;
  color: #756d64;
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.rename-field input {
  width: 100%;
  padding: 0 0 10px;
  color: #eadfd4;
  background: transparent;
  border: 0;
  border-bottom: 1px solid rgba(214, 155, 104, 0.42);
  outline: none;
}

.category-status {
  width: max-content;
  padding: 7px 10px;
  color: #d6b08d;
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  background: rgba(214, 155, 104, 0.09);
  border: 1px solid rgba(214, 155, 104, 0.28);
}

.category-status.empty {
  color: #827970;
  background: transparent;
  border-color: rgba(255, 255, 255, 0.12);
}

.category-actions {
  display: flex;
  justify-content: flex-end;
  gap: 14px;
}

.category-actions button {
  padding: 0;
  color: #c0a38a;
  font-size: 10px;
  letter-spacing: 0.17em;
  text-transform: uppercase;
  cursor: pointer;
  background: transparent;
  border: 0;
}

.category-actions .delete-button {
  color: #94766d;
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

.notice span {
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

.delete-dialog h2 {
  margin: 0 0 22px;
  color: #f0e9e1;
  font-family: Georgia, serif;
  font-size: 43px;
  font-weight: 400;
  letter-spacing: -0.045em;
}

.delete-dialog > p:not(.panel-index) {
  margin: 0 0 38px;
  color: #91887d;
  font-size: 14px;
  line-height: 2;
}

.delete-dialog strong {
  color: #d6b493;
  font-weight: normal;
}

.dialog-actions {
  display: flex;
  gap: 13px;
}

.cancel-dialog,
.confirm-dialog {
  min-height: 50px;
  padding: 0 23px;
  font-size: 11px;
  letter-spacing: 0.19em;
  text-transform: uppercase;
  cursor: pointer;
}

.cancel-dialog {
  color: #d6ccc1;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.19);
}

.confirm-dialog {
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
  .categories-page {
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

  .categories-content {
    padding: 36px clamp(24px, 5vw, 46px) 56px;
  }
}

@media (max-width: 880px) {
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

  .user-name {
    margin-bottom: 8px;
  }

  .user-role {
    margin-bottom: 24px;
  }

  .logout-button {
    width: 100%;
  }

  .categories-content {
    padding: 28px 20px 48px;
  }

  .topbar,
  .hero-panel,
  .list-heading {
    flex-direction: column;
    align-items: flex-start;
  }

  .statistics-grid,
  .manager-grid {
    grid-template-columns: 1fr;
  }

  .category-item {
    grid-template-columns: 42px 1fr;
    gap: 16px;
  }

  .category-status,
  .category-actions {
    grid-column: 2;
    justify-content: flex-start;
  }

  .dialog-actions {
    flex-direction: column;
  }

  .cancel-dialog,
  .confirm-dialog {
    width: 100%;
  }
}
</style>
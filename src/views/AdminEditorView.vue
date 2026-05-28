<script setup>
import { computed, reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { useBlogStore } from '../stores/blog'

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()

const isEditing = computed(() => Boolean(route.params.id))
const editingPost = computed(() =>
  isEditing.value ? blogStore.getPostById(route.params.id) : null,
)

const createFormData = () => {
  if (editingPost.value) {
    return {
      title: editingPost.value.title,
      category: editingPost.value.category,
      date: editingPost.value.date,
      readTime: editingPost.value.readTime,
      excerpt: editingPost.value.excerpt,
      content: editingPost.value.content,
      featured: editingPost.value.featured,
    }
  }

  return {
    title: '',
    category: 'Frontend',
    date: 'MAY 25, 2026',
    readTime: '06 MIN READ',
    excerpt: '',
    content: `# New Article Title

在这里输入文章导语，描述这篇内容将要讨论的主题。

## Section Title

开始撰写正文内容。你可以使用 Markdown 标题组织文章结构。

## Conclusion

在这里总结你的思考与实践成果。`,
    featured: false,
  }
}

const form = reactive(createFormData())
const validationMessage = ref('')
const isSaving = ref(false)

const availableCategories = computed(() =>
  blogStore.categories.filter((category) => category !== 'All'),
)



const pageTitle = computed(() =>
  isEditing.value ? 'Edit Article' : 'New Article',
)

const pageDescription = computed(() =>
  isEditing.value
    ? '更新文章内容并同步发布到前台阅读页面。'
    : '使用 Markdown 编写新的文章，并发布到数字档案中。',
)

const validateForm = () => {
  if (!form.title.trim()) {
    validationMessage.value = '请输入文章标题。'
    return false
  }

  if (!form.excerpt.trim()) {
    validationMessage.value = '请输入文章摘要。'
    return false
  }

  if (!form.content.trim()) {
    validationMessage.value = '请输入文章正文内容。'
    return false
  }

  validationMessage.value = ''
  return true
}

const handleSave = async () => {
  if (!validateForm()) {
    return
  }

  isSaving.value = true

  await new Promise((resolve) => setTimeout(resolve, 420))

  const articleData = {
    title: form.title.trim(),
    category: form.category,
    date: form.date.trim(),
    readTime: form.readTime.trim(),
    excerpt: form.excerpt.trim(),
    content: form.content.trim(),
    featured: form.featured,
  }

  if (isEditing.value && editingPost.value) {
    blogStore.updatePost({
      id: editingPost.value.id,
      ...articleData,
    })
  } else {
    blogStore.createPost(articleData)
  }

  isSaving.value = false
  router.push('/admin/articles')
}

const cancelEditing = () => {
  router.push('/admin/articles')
}
</script>

<template>
  <main class="editor-page">
    <header class="editor-header">
      <RouterLink class="brand" to="/admin">
        <span class="brand-mark"></span>
        <div>
          <p class="brand-name">NOIR ARCHIVE</p>
          <p class="brand-subtitle">Writing Studio</p>
        </div>
      </RouterLink>

      <div class="header-title">
        <p>EDITORIAL / COMPOSER</p>
        <h1>{{ pageTitle }}</h1>
      </div>

      <div class="header-actions">
        <button class="cancel-button" type="button" @click="cancelEditing">
          Cancel
        </button>

        <button
          class="save-button"
          type="button"
          :disabled="isSaving"
          @click="handleSave"
        >
          {{ isSaving ? 'Saving...' : 'Publish Article' }}
        </button>
      </div>
    </header>

    <section class="editor-content">
      <div class="form-column">
        <div class="intro-heading">
          <p class="chapter">
            {{ isEditing ? 'UPDATE CONTENT' : 'CREATE CONTENT' }}
          </p>
          <h2>{{ pageTitle }}</h2>
          <p>{{ pageDescription }}</p>
        </div>

        <p v-if="validationMessage" class="validation-message">
          {{ validationMessage }}
        </p>

        <section class="metadata-panel">
          <label class="title-field">
            <span>ARTICLE TITLE</span>
            <input
              v-model="form.title"
              type="text"
              placeholder="Enter article title..."
              @input="validationMessage = ''"
            />
          </label>

          <div class="field-grid">
            <label class="field">
              <span>CATEGORY</span>
              <select v-model="form.category">
                <option
                  v-for="category in availableCategories"
                  :key="category"
                  :value="category"
                >
                  {{ category }}
                </option>
              </select>
            </label>

            <label class="field">
              <span>PUBLISH DATE</span>
              <input v-model="form.date" type="text" />
            </label>

            <label class="field">
              <span>READ TIME</span>
              <input v-model="form.readTime" type="text" />
            </label>
          </div>

          <label class="excerpt-field">
            <span>EXCERPT</span>
            <textarea
              v-model="form.excerpt"
              rows="3"
              placeholder="Write a concise introduction for this article..."
              @input="validationMessage = ''"
            ></textarea>
          </label>

          <label class="featured-field">
            <input v-model="form.featured" type="checkbox" />
            <span class="checkbox-mark"></span>
            <div>
              <strong>Feature on homepage</strong>
              <p>将此文章展示在首页精选文章区域。</p>
            </div>
          </label>
        </section>

       <section class="markdown-panel native-editor-panel">
  <div class="panel-title">
    <div>
      <p>MARKDOWN EDITOR</p>
      <h3>Article content</h3>
    </div>

    <span class="syntax-hint">
      md-editor-v3 · Live Preview
    </span>
  </div>

  <MdEditor
    v-model="form.content"
    class="noir-md-editor"
    theme="dark"
    language="en-US"
    :preview="true"
    :toolbars-exclude="['github']"
    @onChange="validationMessage = ''"
    @onSave="handleSave"
  />
</section>
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
:global(input),
:global(textarea),
:global(select) {
  font: inherit;
}

.editor-page {
  min-height: 100vh;
  color: #f2eee8;
  background:
    radial-gradient(circle at 88% 4%, rgba(121, 73, 43, 0.15), transparent 28%),
    #090909;
}

.editor-header {
  position: sticky;
  top: 0;
  z-index: 10;
  height: 92px;
  padding: 0 clamp(24px, 5vw, 56px);
  display: grid;
  grid-template-columns: 250px 1fr auto;
  align-items: center;
  gap: 34px;
  background: rgba(9, 9, 9, 0.94);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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

.header-title {
  text-align: center;
}

.header-title p {
  margin: 0 0 8px;
  color: #7f766d;
  font-size: 9px;
  letter-spacing: 0.28em;
}

.header-title h1 {
  margin: 0;
  color: #ece5dd;
  font-family: Georgia, serif;
  font-size: 27px;
  font-weight: 400;
  letter-spacing: -0.035em;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.cancel-button,
.save-button {
  min-height: 50px;
  padding: 0 22px;
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  cursor: pointer;
}

.cancel-button {
  color: #dacdbf;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.save-button {
  color: #211711;
  background: #e5cfb9;
  border: 1px solid #e5cfb9;
}

.save-button:disabled {
  cursor: wait;
  opacity: 0.7;
}

.editor-content {
  padding: clamp(28px, 4vw, 46px) clamp(24px, 5vw, 56px) 60px;
}

.form-column {
  width: min(1280px, 100%);
  margin: 0 auto;
}
.form-column,
.preview-column {
  min-width: 0;
}

.intro-heading {
  margin-bottom: 32px;
}

.chapter {
  margin: 0 0 14px;
  color: #ba9470;
  font-size: 10px;
  letter-spacing: 0.32em;
}

.intro-heading h2 {
  margin: 0 0 16px;
  color: #f2ece6;
  font-family: Georgia, serif;
  font-size: clamp(43px, 4vw, 53px);
  font-weight: 400;
  letter-spacing: -0.055em;
}

.intro-heading > p:last-child {
  margin: 0;
  color: #8b8379;
  font-size: 13px;
  line-height: 1.9;
  letter-spacing: 0.045em;
}

.validation-message {
  margin: 0 0 22px;
  padding: 15px 18px;
  color: #e0a47e;
  font-size: 13px;
  background: rgba(150, 69, 45, 0.12);
  border: 1px solid rgba(212, 125, 83, 0.3);
}

.metadata-panel,
.markdown-panel,
.preview-column {
  background: #0d0d0d;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.metadata-panel {
  padding: clamp(25px, 3vw, 34px);
  margin-bottom: 20px;
}

.title-field,
.field,
.excerpt-field {
  display: block;
}

.title-field > span,
.field > span,
.excerpt-field > span {
  display: block;
  margin-bottom: 13px;
  color: #7d756c;
  font-size: 9px;
  letter-spacing: 0.29em;
}

.title-field input {
  width: 100%;
  padding: 0 0 16px;
  color: #f1ebe4;
  font-family: Georgia, serif;
  font-size: 31px;
  background: transparent;
  border: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
  outline: none;
}

.title-field input::placeholder {
  color: #4d4945;
}

.title-field input:focus,
.field input:focus,
.field select:focus,
.excerpt-field textarea:focus {
  border-color: #d69b68;
}

.field-grid {
  display: grid;
  grid-template-columns: 1.3fr 1fr 1fr;
  gap: 18px;
  margin: 31px 0;
}

.field input,
.field select {
  width: 100%;
  padding: 0 0 13px;
  color: #ded5cb;
  font-size: 13px;
  letter-spacing: 0.08em;
  background: transparent;
  border: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
  outline: none;
}

.field select {
  cursor: pointer;
}

.field select option {
  color: #eee7df;
  background: #161412;
}

.excerpt-field textarea {
  width: 100%;
  padding: 14px 0 0;
  resize: vertical;
  color: #cfc4b8;
  font-size: 14px;
  line-height: 1.9;
  background: transparent;
  border: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
  outline: none;
}

.excerpt-field textarea::placeholder {
  color: #524d48;
}

.featured-field {
  position: relative;
  display: flex;
  align-items: center;
  gap: 17px;
  margin-top: 30px;
  cursor: pointer;
}

.featured-field input {
  position: absolute;
  opacity: 0;
}

.checkbox-mark {
  width: 23px;
  height: 23px;
  flex-shrink: 0;
  border: 1px solid rgba(214, 155, 104, 0.45);
  transition: background 0.2s ease;
}

.featured-field input:checked + .checkbox-mark {
  background: #d69b68;
  box-shadow: inset 0 0 0 6px #0d0d0d;
}

.featured-field strong {
  display: block;
  margin-bottom: 6px;
  color: #dad0c5;
  font-size: 13px;
  font-weight: normal;
  letter-spacing: 0.06em;
}

.featured-field p {
  margin: 0;
  color: #766e65;
  font-size: 12px;
}

.markdown-panel {
  padding: clamp(23px, 3vw, 30px);
}

.panel-title {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 20px;
  margin-bottom: 25px;
}

.panel-title p {
  margin: 0 0 10px;
  color: #ae8968;
  font-size: 9px;
  letter-spacing: 0.3em;
}

.panel-title h3 {
  margin: 0;
  color: #eee7df;
  font-family: Georgia, serif;
  font-size: 29px;
  font-weight: 400;
}

.syntax-hint {
  color: #625c55;
  font-size: 11px;
  letter-spacing: 0.08em;
}

.markdown-input {
  display: block;
  width: 100%;
  min-height: 440px;
  padding: 25px;
  resize: vertical;
  color: #c9beb2;
  font-family: Consolas, 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.95;
  background: #090909;
  border: 1px solid rgba(255, 255, 255, 0.11);
  outline: none;
}

.markdown-input:focus {
  border-color: rgba(214, 155, 104, 0.46);
}

.preview-column {
  position: sticky;
  top: 116px;
  align-self: start;
  max-height: calc(100vh - 146px);
  overflow-y: auto;
  padding: clamp(27px, 3vw, 38px);
}

.preview-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 39px;
}

.preview-heading p {
  margin: 0;
  color: #8a8177;
  font-size: 10px;
  letter-spacing: 0.3em;
}

.preview-heading span {
  padding: 8px 12px;
  color: #8b8177;
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.preview-heading span.featured {
  color: #d5af8b;
  background: rgba(214, 155, 104, 0.08);
  border-color: rgba(214, 155, 104, 0.31);
}

.preview-category {
  margin: 0 0 25px;
  color: #c29a75;
  font-size: 10px;
  line-height: 2;
  letter-spacing: 0.26em;
  text-transform: uppercase;
}

.preview-main-title {
  margin: 0 0 25px;
  color: #f0e9e2;
  font-family: Georgia, serif;
  font-size: clamp(38px, 3.5vw, 53px);
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: -0.055em;
}

.preview-excerpt {
  margin: 0 0 30px;
  color: #9a9186;
  font-size: 14px;
  line-height: 2;
}

.preview-meta {
  display: flex;
  gap: 27px;
  margin-bottom: 42px;
  padding: 22px 0;
  color: #736b62;
  font-size: 10px;
  letter-spacing: 0.23em;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.preview-body h3 {
  margin: 0 0 27px;
  color: #eee7df;
  font-family: Georgia, serif;
  font-size: 34px;
  font-weight: 400;
  letter-spacing: -0.045em;
}

.preview-body h4 {
  margin: 42px 0 19px;
  color: #e4dcd3;
  font-family: Georgia, serif;
  font-size: 27px;
  font-weight: 400;
  letter-spacing: -0.04em;
}

.preview-body p {
  margin: 0 0 21px;
  color: #9a9186;
  font-size: 14px;
  line-height: 2;
}

.preview-list {
  display: flex;
  gap: 13px;
  align-items: baseline;
}

.preview-list span {
  width: 5px;
  height: 5px;
  flex-shrink: 0;
  background: #d69b68;
  border-radius: 50%;
}

@media (max-width: 1100px) {
  .editor-header {
    height: auto;
    min-height: 88px;
    grid-template-columns: 1fr auto;
    padding-top: 17px;
    padding-bottom: 17px;
  }

  .header-title {
    display: none;
  }

  .editor-content {
    display: block;
  }

  .preview-column {
    position: static;
    max-height: none;
    margin-top: 24px;
  }
}

@media (max-width: 680px) {
  .editor-header {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    width: 100%;
  }

  .cancel-button,
  .save-button {
    flex: 1;
  }

  .editor-content {
    padding: 28px 20px 46px;
  }

  .field-grid {
    grid-template-columns: 1fr;
  }

  .panel-title {
    flex-direction: column;
    align-items: flex-start;
  }

  .title-field input {
    font-size: 26px;
  }
}
.native-editor-panel {
  margin-top: 20px;
}

.noir-md-editor {
  height: 680px;
  overflow: hidden;
  --md-color: #cfc4b8;
  --md-hover-color: #ead7c3;
  --md-bk-color: #090909;
  --md-bk-color-outstand: #11100f;
  --md-border-color: rgba(255, 255, 255, 0.12);
  --md-scrollbar-bg-color: #171411;
  --md-scrollbar-thumb-color: #5e4a3c;
  border: 1px solid rgba(255, 255, 255, 0.11);
}

.noir-md-editor :deep(.md-editor-toolbar-wrapper) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.11);
}

.noir-md-editor :deep(.md-editor-input-wrapper),
.noir-md-editor :deep(.md-editor-preview-wrapper) {
  background: #090909;
}

.noir-md-editor :deep(.md-editor-preview h1),
.noir-md-editor :deep(.md-editor-preview h2),
.noir-md-editor :deep(.md-editor-preview h3) {
  color: #ede6de;
  font-family: Georgia, 'Times New Roman', serif;
  font-weight: 400;
}

.noir-md-editor :deep(.md-editor-preview p),
.noir-md-editor :deep(.md-editor-preview li) {
  color: #aaa094;
  line-height: 2;
}
</style>
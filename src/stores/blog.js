import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const POSTS_STORAGE_KEY = 'noir-archive-posts'
const CATEGORIES_STORAGE_KEY = 'noir-archive-categories'

const defaultCategories = [
  'Frontend',
  'Artificial Intelligence',
  'Engineering',
  'Design',
  'Motion & Interaction',
  'Cinematic Storytelling',
]

const defaultPosts = [
  {
    id: 6,
    number: '06',
    title: 'Suspended Time as a Living Interface',
    excerpt:
      '当房间、人物与悬浮物共同停驻在一瞬间，动态背景也可以成为网页叙事的一部分。',
    category: 'Cinematic Storytelling',
    date: 'MAY 25, 2026',
    readTime: '07 MIN READ',
    featured: true,
    content: `# Suspended Time as a Living Interface

在电影感网页中，动态背景并不一定需要剧烈运动。一个仿佛被冻结的现实空间，也能为阅读体验带来强烈的情绪入口。

## Frozen Atmosphere

昏暗房间、悬浮人物、停在半空的纸张与物件，让画面呈现出时间短暂停止的错觉。微弱的窗光、尘埃与烟雾运动，则让静止画面仍然保有生命感。

## Cinematic Interface

- 使用暗色遮罩保证标题与按钮清晰可读
- 使用极慢的环绕运镜营造空间层次
- 让动态影像只服务于氛围，而不干扰内容阅读

## Conclusion

当界面、影像与文字共同构成叙事空间时，博客首页就不再只是入口，而是一段可被体验的视觉记忆。`,
  },
    {
    id: 5,
    number: '05',
    title: 'Designing with Motion, Light and Code',
    excerpt:
      '通过动态光影、交互动效与 Vue 组件化开发，构建具有电影氛围的现代网页体验。',
    category: 'Motion & Interaction',
    date: 'MAY 25, 2026',
    readTime: '06 MIN READ',
    featured: true,
    content: `# Designing with Motion, Light and Code

现代网页不仅需要传递信息，也可以通过光影、动效与排版创造独特的情绪体验。

## Dynamic Atmosphere

深色背景、暖色渐变与缓慢移动的光晕，可以营造具有电影感的视觉氛围。

## Interaction Details

- 使用过渡动画强化按钮反馈
- 使用响应式布局适配不同窗口
- 使用视频背景扩展视觉叙事

## Conclusion

当技术实现与视觉表达相互配合时，网页就不再只是信息容器，而是一种沉浸式数字作品。`,
  },
  {
    id: 1,
    number: '01',
    title: 'Designing Interfaces That Feel Alive',
    excerpt:
      '从动效节奏、视觉层级到沉浸式交互，探索如何让现代网页拥有叙事感与生命力。',
    category: 'Frontend',
    date: 'MAY 18, 2026',
    readTime: '08 MIN READ',
    featured: true,
    content: `# Designing Interfaces That Feel Alive

优秀的界面不仅能够完成信息展示，还应当通过节奏、层级和反馈，让用户感受到页面正在回应自己的行为。

## 视觉层级

通过字号、留白、颜色与对比关系，可以让重要内容第一时间被看见。首页 Hero 区域的大标题承担了品牌表达功能，而文章卡片则负责引导用户进一步阅读。

## 动效节奏

动效不应该只是装饰。按钮悬停、内容淡入、卡片移动，都应当服务于信息传达，让页面看起来更加自然。

## 结语

一个有生命力的界面，来自于代码、设计与用户体验之间的平衡。`,
  },
  {
    id: 2,
    number: '02',
    title: 'When AI Becomes a Creative Material',
    excerpt:
      'AI 不只是效率工具，也可以成为视觉创作、灵感发散与数字体验设计的新材料。',
    category: 'Artificial Intelligence',
    date: 'APR 26, 2026',
    readTime: '12 MIN READ',
    featured: true,
    content: `# When AI Becomes a Creative Material

人工智能正在改变数字内容的创作方式。从图像、视频到网页背景素材，AI 可以参与设计流程中的多个阶段。

## 从工具到材料

在传统开发中，我们使用素材完成网页设计；而现在，AI 可以帮助我们生成具有统一视觉风格的视频、图像和文本内容。

## 电影感网页体验

动态视频背景、渐变遮罩、大字号排版与滚动叙事结合后，可以形成具有电影氛围的数字阅读空间。

## 创作者的选择

技术并不会代替表达。真正决定作品质量的，仍然是创作者对于主题、风格和体验的判断。`,
  },
  {
    id: 3,
    number: '03',
    title: 'Building a Modern Vue Writing Studio',
    excerpt:
      '使用 Vue、Pinia 与模块化架构，搭建一个兼顾阅读体验和内容管理能力的博客系统。',
    category: 'Engineering',
    date: 'MAR 09, 2026',
    readTime: '06 MIN READ',
    featured: true,
    content: `# Building a Modern Vue Writing Studio

一个完整的博客系统不仅需要漂亮的前台页面，也需要可靠的文章管理能力。

## Vue 组件化结构

Vue 可以将首页、文章列表、详情页和后台管理页拆分为独立页面组件，让整个应用结构更加清晰。

## Pinia 状态管理

通过 Pinia 统一保存文章数据，首页展示、列表筛选和后台修改都能够共享同一份状态。

## 本地持久化

在没有真实后端的课程项目中，可以使用 localStorage 模拟文章数据库，实现刷新页面后数据仍然保留的效果。`,
  },
  {
    id: 4,
    number: '04',
    title: 'The Quiet Power of Minimal Design',
    excerpt:
      '减少无意义的视觉噪声，通过留白、排版和微妙光影建立更专注的阅读体验。',
    category: 'Design',
    date: 'FEB 14, 2026',
    readTime: '05 MIN READ',
    featured: false,
    content: `# The Quiet Power of Minimal Design

极简设计不是单纯地删除元素，而是让每一个保留下来的元素都有明确作用。

## 留白的意义

留白可以建立节奏，让内容拥有呼吸空间，也能进一步突出页面中真正重要的信息。

## 色彩控制

深色背景配合少量暖金色强调，可以形成稳定且具有辨识度的视觉风格。`,
  },
]

const cloneDefaultPosts = () =>
  defaultPosts.map((post) => ({
    ...post,
  }))
const cloneDefaultCategories = () => [...defaultCategories]

const loadCategories = (posts) => {
  const savedCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY)

  if (savedCategories) {
    try {
      const categories = JSON.parse(savedCategories)

      if (Array.isArray(categories) && categories.length) {
        return [...new Set([...categories, ...posts.map((post) => post.category)])]
      }
    } catch {
      // 数据异常时回退到默认分类
    }
  }

  return [
    ...new Set([
      ...cloneDefaultCategories(),
      ...posts.map((post) => post.category),
    ]),
  ]
}
export const useBlogStore = defineStore('blog', () => {
  const posts = ref(loadPosts())
  const managedCategories = ref(loadCategories(posts.value))

  const featuredPosts = computed(() =>
    posts.value.filter((post) => post.featured).slice(0, 3),
  )

  const categories = computed(() => ['All', ...managedCategories.value])

  const categoryStatistics = computed(() =>
    managedCategories.value.map((category) => ({
      name: category,
      articleCount: posts.value.filter((post) => post.category === category)
        .length,
    })),
  )

  function loadPosts() {
    const savedPosts = localStorage.getItem(POSTS_STORAGE_KEY)

    if (!savedPosts) {
      return cloneDefaultPosts()
    }

    try {
      return JSON.parse(savedPosts)
    } catch {
      return cloneDefaultPosts()
    }
  }

  function persistPosts() {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts.value))
  }
  function persistCategories() {
  localStorage.setItem(
    CATEGORIES_STORAGE_KEY,
    JSON.stringify(managedCategories.value),
  )
}

function addCategory(name) {
  const normalizedName = name.trim()

  if (!normalizedName) {
    return {
      success: false,
      message: '分类名称不能为空。',
    }
  }

  const alreadyExists = managedCategories.value.some(
    (category) => category.toLowerCase() === normalizedName.toLowerCase(),
  )

  if (alreadyExists) {
    return {
      success: false,
      message: '该分类已经存在。',
    }
  }

  managedCategories.value.push(normalizedName)
  persistCategories()

  return {
    success: true,
    message: `已创建分类：${normalizedName}`,
  }
}

function renameCategory(originalName, nextName) {
  const normalizedName = nextName.trim()

  if (!normalizedName) {
    return {
      success: false,
      message: '分类名称不能为空。',
    }
  }

  const alreadyExists = managedCategories.value.some(
    (category) =>
      category !== originalName &&
      category.toLowerCase() === normalizedName.toLowerCase(),
  )

  if (alreadyExists) {
    return {
      success: false,
      message: '该分类已经存在。',
    }
  }

  managedCategories.value = managedCategories.value.map((category) =>
    category === originalName ? normalizedName : category,
  )

  posts.value = posts.value.map((post) =>
    post.category === originalName
      ? {
          ...post,
          category: normalizedName,
        }
      : post,
  )

  persistCategories()
  persistPosts()

  return {
    success: true,
    message: `已更新分类：${normalizedName}`,
  }
}

function deleteCategory(name) {
  const hasArticles = posts.value.some((post) => post.category === name)

  if (hasArticles) {
    return {
      success: false,
      message: '该分类下仍有文章，无法删除。',
    }
  }

  managedCategories.value = managedCategories.value.filter(
    (category) => category !== name,
  )

  persistCategories()

  return {
    success: true,
    message: `已删除分类：${name}`,
  }
}

  function getPostById(id) {
    return posts.value.find((post) => post.id === Number(id))
  }

  function createPost(post) {
  const nextId =
    posts.value.length > 0
      ? Math.max(...posts.value.map((item) => item.id)) + 1
      : 1

  if (!managedCategories.value.includes(post.category)) {
    managedCategories.value.push(post.category)
    persistCategories()
  }

  posts.value.unshift({
    ...post,
    id: nextId,
    number: String(nextId).padStart(2, '0'),
  })

  persistPosts()
}

  function updatePost(updatedPost) {
    if (!managedCategories.value.includes(updatedPost.category)) {
  managedCategories.value.push(updatedPost.category)
  persistCategories()
}
    const index = posts.value.findIndex((post) => post.id === updatedPost.id)

    if (index !== -1) {
      posts.value[index] = {
        ...posts.value[index],
        ...updatedPost,
      }

      persistPosts()
    }
  }

  function deletePost(id) {
    posts.value = posts.value.filter((post) => post.id !== Number(id))
    persistPosts()
  }

  function resetPosts() {
  posts.value = cloneDefaultPosts()
  managedCategories.value = cloneDefaultCategories()
  persistPosts()
  persistCategories()
}

  return {
  posts,
  featuredPosts,
  categories,
  categoryStatistics,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  resetPosts,
  addCategory,
  renameCategory,
  deleteCategory,
}
})
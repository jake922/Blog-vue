import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
const HomeView = () => import('../views/HomeView.vue')
const ArticlesView = () => import('../views/ArticlesView.vue')
const CollectionsView = () => import('../views/CollectionsView.vue')
const AboutView = () => import('../views/AboutView.vue')
const ArticleDetailView = () => import('../views/ArticleDetailView.vue')
const LoginView = () => import('../views/LoginView.vue')

const AdminDashboardView = () => import('../views/AdminDashboardView.vue')
const AdminArticlesView = () => import('../views/AdminArticlesView.vue')
const AdminEditorView = () => import('../views/AdminEditorView.vue')
const AdminCategoriesView = () => import('../views/AdminCategoriesView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/articles',
      name: 'articles',
      component: ArticlesView,
    },
    {
      path: '/article/:id',
      name: 'article-detail',
      component: ArticleDetailView,
    },
    {
  path: '/collections',
  name: 'collections',
  component: CollectionsView,
},
{
  path: '/about',
  name: 'about',
  component: AboutView,
},
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminDashboardView,
      meta: {
        requiresAuth: true,
      },
    },
    {
  path: '/admin/articles',
  name: 'admin-articles',
  component: AdminArticlesView,
  meta: {
    requiresAuth: true,
  },
},
{
  path: '/admin/articles/new',
  name: 'admin-article-new',
  component: AdminEditorView,
  meta: {
    requiresAuth: true,
  },
},
{
  path: '/admin/articles/edit/:id',
  name: 'admin-article-edit',
  component: AdminEditorView,
  meta: {
    requiresAuth: true,
  },
},
{
  path: '/admin/categories',
  name: 'admin-categories',
  component: AdminCategoriesView,
  meta: {
    requiresAuth: true,
  },
},
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth) {
    const sessionIsValid = await authStore.validateSession()

    if (!sessionIsValid) {
      return {
        name: 'login',
        query: {
          redirect: to.fullPath,
        },
      }
    }
  }

  if (to.name === 'login' && authStore.isAuthenticated) {
    return {
      name: 'admin',
    }
  }

  return true
})

export default router
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTitle } from '@vueuse/core'
import CinematicBackdrop from './components/CinematicBackdrop.vue'

const route = useRoute()

const pageTitle = computed(() => {
  switch (route.name) {
    case 'home':
      return 'Noir Archive — Digital Journal'
    case 'articles':
      return 'Journal — Noir Archive'
    case 'article-detail':
      return 'Article — Noir Archive'
    case 'collections':
      return 'Collections — Noir Archive'
    case 'about':
      return 'About — Noir Archive'
    case 'login':
      return 'Sign In — Noir Archive'
    case 'admin':
      return 'Writing Studio — Noir Archive'
    case 'admin-articles':
      return 'Article Library — Noir Archive'
    case 'admin-article-new':
      return 'New Article — Noir Archive'
    case 'admin-article-edit':
      return 'Edit Article — Noir Archive'
    case 'admin-categories':
      return 'Collections Manager — Noir Archive'
    default:
      return 'Noir Archive'
  }
})


const cinematicRoutes = new Set([
  'home',
  'articles',
  'article-detail',
  'collections',
  'about',
])

const showCinematicBackdrop = computed(() =>
  cinematicRoutes.has(String(route.name)),
)

const cinematicTone = computed(() =>
  route.name === 'home' ? 'home' : 'inner',
)

useTitle(pageTitle)
</script>

<template>
  <div class="app-shell">
    <CinematicBackdrop
      v-if="showCinematicBackdrop"
      :tone="cinematicTone"
    />

    <div class="route-stage">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: #090909;
}

.route-stage {
  position: relative;
  z-index: 1;
  min-height: 100vh;
}
</style>
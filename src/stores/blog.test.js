import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useBlogStore } from './blog'

describe('blog store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('loads default posts and categories', () => {
    const store = useBlogStore()

   expect(store.posts).toHaveLength(6)
expect(store.categories).toEqual([
  'All',
  'Frontend',
  'Artificial Intelligence',
  'Engineering',
  'Design',
  'Motion & Interaction',
  'Cinematic Storytelling',
])
  })

  it('creates a new article and persists it locally', () => {
    const store = useBlogStore()

    store.createPost({
      title: 'Testing Vue Studio',
      category: 'Frontend',
      date: 'MAY 25, 2026',
      readTime: '05 MIN READ',
      excerpt: 'A post created during unit testing.',
      featured: true,
      content: '# Testing Vue Studio',
    })

    expect(store.posts).toHaveLength(7)
    expect(store.posts[0].title).toBe('Testing Vue Studio')
    expect(store.posts[0].id).toBe(7)
    expect(store.posts[0].number).toBe('07')

    const storedPosts = JSON.parse(localStorage.getItem('noir-archive-posts'))

    expect(storedPosts).toHaveLength(7)
    expect(storedPosts[0].title).toBe('Testing Vue Studio')
  })

  it('renames a category and synchronizes assigned articles', () => {
    const store = useBlogStore()

    const result = store.renameCategory('Frontend', 'Motion Design')

    expect(result.success).toBe(true)
    expect(store.categories).toContain('Motion Design')
    expect(store.categories).not.toContain('Frontend')
    expect(
      store.posts.filter((post) => post.category === 'Motion Design'),
    ).toHaveLength(1)
  })

  it('prevents deletion of a category that still contains articles', () => {
    const store = useBlogStore()

    const result = store.deleteCategory('Frontend')

    expect(result.success).toBe(false)
    expect(result.message).toBe('该分类下仍有文章，无法删除。')
    expect(store.categories).toContain('Frontend')
  })

  it('deletes an empty category successfully', () => {
    const store = useBlogStore()

    store.addCategory('Temporary Notes')
    const result = store.deleteCategory('Temporary Notes')

    expect(result.success).toBe(true)
    expect(store.categories).not.toContain('Temporary Notes')
  })
})
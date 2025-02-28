import router from '@/router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { getRawRoute } from '@/utils/routerHelper'
import { defineStore } from 'pinia'
import { store } from '../index'
import { findIndex } from '@/utils'
import { useUserStoreWithOut } from './user'

export interface TagsViewState {
  visitedViews: RouteLocationNormalizedLoaded[]
  cachedViews: Set<string>
  selectedTag?: RouteLocationNormalizedLoaded
}

export const useTagsViewStore = defineStore('tagsView', {
  state: (): TagsViewState => ({
    visitedViews: [],
    cachedViews: new Set(),
    selectedTag: undefined
  }),
  getters: {
    getVisitedViews(): RouteLocationNormalizedLoaded[] {
      return this.visitedViews
    },
    getCachedViews(): string[] {
      return Array.from(this.cachedViews)
    },
    getSelectedTag(): RouteLocationNormalizedLoaded | undefined {
      return this.selectedTag
    }
  },
  actions: {
    // Add cache and tag
    addView(view: RouteLocationNormalizedLoaded): void {
      this.addVisitedView(view)
      this.addCachedView()
    },
    // add tag
    addVisitedView(view: RouteLocationNormalizedLoaded) {
      if (this.visitedViews.some((v) => v.fullPath === view.fullPath)) return
      if (view.meta?.noTagsView) return
      const visitedView = Object.assign({}, view, { title: view.meta?.title || 'no-name' })

      if (visitedView.meta) {
        const titleSuffixList: string[] = []
        this.visitedViews.forEach((v) => {
          if (v.path === visitedView.path && v.meta?.title === visitedView.meta?.title) {
            titleSuffixList.push(v.meta?.titleSuffix || '1')
          }
        })
        if (titleSuffixList.length) {
          let titleSuffix = 1
          while (titleSuffixList.includes(`${titleSuffix}`)) {
            titleSuffix += 1
          }
          visitedView.meta.titleSuffix = titleSuffix === 1 ? undefined : `${titleSuffix}`
        }
      }

      this.visitedViews.push(visitedView)
    },
    // Add cache
    addCachedView() {
      const cacheMap: Set<string> = new Set()
      for (const v of this.visitedViews) {
        const item = getRawRoute(v)
        const needCache = !item.meta?.noCache
        if (!needCache) {
          continue
        }
        const name = item.name as string
        cacheMap.add(name)
      }
      if (Array.from(this.cachedViews).sort().toString() === Array.from(cacheMap).sort().toString())
        return
      this.cachedViews = cacheMap
    },
    // Delete a certain
    delView(view: RouteLocationNormalizedLoaded) {
      this.delVisitedView(view)
      this.delCachedView()
    },
    // delete tag
    delVisitedView(view: RouteLocationNormalizedLoaded) {
      for (const [i, v] of this.visitedViews.entries()) {
        if (v.fullPath === view.fullPath) {
          this.visitedViews.splice(i, 1)
          break
        }
      }
    },
    // Delete cache
    delCachedView() {
      const route = router.currentRoute.value
      const index = findIndex<string>(this.getCachedViews, (v) => v === route.name)
      if (index > -1) {
        this.cachedViews.delete(this.getCachedViews[index])
      }
    },
    // Delete all caches and tag
    delAllViews() {
      this.delAllVisitedViews()
      this.delCachedView()
    },
    // Delete all tag
    delAllVisitedViews() {
      const userStore = useUserStoreWithOut()

      // const affixTags = this.visitedViews.filter((tag) => tag.meta.affix)
      this.visitedViews = userStore.getUser
        ? this.visitedViews.filter((tag) => tag?.meta?.affix)
        : []
    },
    // Delete others
    delOthersViews(view: RouteLocationNormalizedLoaded) {
      this.delOthersVisitedViews(view)
      this.addCachedView()
    },
    // Delete others tag
    delOthersVisitedViews(view: RouteLocationNormalizedLoaded) {
      this.visitedViews = this.visitedViews.filter((v) => {
        return v?.meta?.affix || v.fullPath === view.fullPath
      })
    },
    // Delete left side
    delLeftViews(view: RouteLocationNormalizedLoaded) {
      const index = findIndex<RouteLocationNormalizedLoaded>(
        this.visitedViews,
        (v) => v.fullPath === view.fullPath
      )
      if (index > -1) {
        this.visitedViews = this.visitedViews.filter((v, i) => {
          return v?.meta?.affix || v.fullPath === view.fullPath || i > index
        })
        this.addCachedView()
      }
    },
    // Delete the right side
    delRightViews(view: RouteLocationNormalizedLoaded) {
      const index = findIndex<RouteLocationNormalizedLoaded>(
        this.visitedViews,
        (v) => v.fullPath === view.fullPath
      )
      if (index > -1) {
        this.visitedViews = this.visitedViews.filter((v, i) => {
          return v?.meta?.affix || v.fullPath === view.fullPath || i < index
        })
        this.addCachedView()
      }
    },
    updateVisitedView(view: RouteLocationNormalizedLoaded) {
      for (let v of this.visitedViews) {
        if (v.fullPath === view.fullPath) {
          v = Object.assign(v, view)
          break
        }
      }
    },
    // Set the currently selected tag
    setSelectedTag(tag: RouteLocationNormalizedLoaded) {
      this.selectedTag = tag
    },
    setTitle(title: string, path?: string) {
      for (const v of this.visitedViews) {
        if (v.path === (path ?? this.selectedTag?.path)) {
          v.meta.title = title
          break
        }
      }
    }
  },
  persist: false
})

export const useTagsViewStoreWithOut = () => {
  return useTagsViewStore(store)
}

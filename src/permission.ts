import router from './router'
import type { RouteRecordRaw } from 'vue-router'
import { isRelogin } from '@/config/axios/service'
import { getAccessToken } from '@/utils/auth'
import { useTitle } from '@/hooks/web/useTitle'
import { useNProgress } from '@/hooks/web/useNProgress'
import { usePageLoading } from '@/hooks/web/usePageLoading'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { useUserStoreWithOut } from '@/store/modules/user'
import { usePermissionStoreWithOut } from '@/store/modules/permission'

const { start, done } = useNProgress()

const { loadStart, loadDone } = usePageLoading()

const parseURL = (
  url: string | null | undefined
): { basePath: string; paramsObject: { [key: string]: string } } => {
  // If the input is `null` or `undefined`, return an empty string and an empty object.
  if (url == null) {
    return { basePath: '', paramsObject: {} }
  }

  // Find the position of the question mark (`?`). The part before it is the base path, and the part after it consists of the query parameters.
  const questionMarkIndex = url.indexOf('?')
  let basePath = url
  const paramsObject: { [key: string]: string } = {}

  // If a question mark is found，Explanation: There are query parameters available
  if (questionMarkIndex !== -1) {
    // obtain basePath
    basePath = url.substring(0, questionMarkIndex)

    // Get the query string part from the URL.
    const queryString = url.substring(questionMarkIndex + 1)

    // Use `URLSearchParams` to iterate over the parameters.
    const searchParams = new URLSearchParams(queryString)
    searchParams.forEach((value, key) => {
      // Package the parameters into the `paramsObject` object.
      paramsObject[key] = value
    })
  }

  // return basePath and paramsObject
  return { basePath, paramsObject }
}

// Route does not redirect whitelist
const whiteList = [
  '/login',
  '/social-login',
  '/auth-redirect',
  '/bind',
  '/register',
  '/oauthLogin/gitee'
]

// Before loading the route
router.beforeEach(async (to, from, next) => {
  start()
  loadStart()
  if (getAccessToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      // Get all dictionaries
      const dictStore = useDictStoreWithOut()
      const userStore = useUserStoreWithOut()
      const permissionStore = usePermissionStoreWithOut()
      if (!dictStore.getIsSetDict) {
        await dictStore.setDictMap()
      }
      if (!userStore.getIsSetUser) {
        isRelogin.show = true
        await userStore.setUserInfoAction()
        isRelogin.show = false
        // Backend filtering menu
        await permissionStore.generateRoutes()
        permissionStore.getAddRouters.forEach((route) => {
          router.addRoute(route as unknown as RouteRecordRaw) // Dynamically add accessible routing tables
        })
        const redirectPath = from.query.redirect || to.path
        // Fix the issue of not taking parameters when jumping
        const redirect = decodeURIComponent(redirectPath as string)
        const { paramsObject: query } = parseURL(redirect)
        const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect, query }
        next(nextData)
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // Otherwise, redirect all to the login page
    }
  }
})

router.afterEach((to) => {
  useTitle(to?.meta?.title as string)
  done() // end Progress
  loadDone()
})

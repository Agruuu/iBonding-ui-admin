import type { RouteRecordRaw } from 'vue-router'
import { defineComponent } from 'vue'

/**
* redirect: noredirect        When the `noredirect` option is set, the route should not be clickable in the breadcrumb navigation.
* name:'router-name'          Set the name of the route. It must be filled in; otherwise, various issues will occur when using `<keep-alive>`.
* meta : {
    hidden: true              When set to `true`, the route will not appear in the sidebar, such as pages like 404 and login (the default value is `false`).

    alwaysShow: true          When the number of routes declared in the `children` of a route is greater than 1, it will automatically become a nested mode.
                              When there is only one child route, that child route will be displayed as the root route in the sidebar.
                              If you want to display the root route regardless of the number of routes declared in the children of that route,
                              You can set `alwaysShow: true`, and in this way, it will ignore the previously defined rules.
                              Always display root route(default false)

    title: 'title'            Set the name of the route to be displayed in the sidebar and breadcrumbs

    titleSuffix: '2'          Suffixes or remarks when the `path` and `title` are repeated.

    icon: 'svg-name'          Set the icon for this route

    noCache: true             If set to `true`, it will not be cached by `<keep-alive>` (the default value is `false`).

    breadcrumb: false         If set to `false`, it will not be displayed in the breadcrumb (the default value is `true`).

    affix: true               If set to `true`, it will always be fixed in the tag item (the default value is `false`).

    noTagsView: true          If set to `true`, it will not appear in the tags (the default value is `false`).

    activeMenu: '/home'  Display highlighted routing paths

    followAuth: '/home'  Follow which route for permission filtering

    canTo: true               If set to `true`, the route navigation can still be performed even if `hidden` is set to `true` (the default value is `false`).
  }
**/
declare module 'vue-router' {
  interface RouteMeta extends Record<string | number | symbol, unknown> {
    hidden?: boolean
    alwaysShow?: boolean
    title?: string
    titleSuffix?: string
    icon?: string
    noCache?: boolean
    breadcrumb?: boolean
    affix?: boolean
    activeMenu?: string
    noTagsView?: boolean
    followAuth?: string
    canTo?: boolean
  }
}

type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>)

declare global {
  interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
    name: string
    meta: RouteMeta
    component?: Component | string
    children?: AppRouteRecordRaw[]
    props?: Recordable
    fullPath?: string
    keepAlive?: boolean
  }

  interface AppCustomRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
    icon: any
    name: string
    meta: RouteMeta
    component: string
    componentName?: string
    path: string
    redirect: string
    children?: AppCustomRouteRecordRaw[]
    keepAlive?: boolean
    visible?: boolean
    parentId?: number
    alwaysShow?: boolean
  }
}

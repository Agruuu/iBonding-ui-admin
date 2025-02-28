import { Layout } from '@/utils/routerHelper'

const { t } = useI18n()
/**
 * redirect: noredirect        When the `noredirect` is set, the route cannot be clicked in the breadcrumb navigation.
 * name:'router-name'          You must set the name for the route. Otherwise, various issues will occur when using `<keep-alive>`.
 * meta : {
 hidden: true              When set to `true`, the route will not appear in the sidebar, such as pages like 404 and login (the default value is `false`).

 alwaysShow: true          When the number of routes declared in the `children` of a route is more than one, it will automatically become a nested mode.
 When there is only one child route, that child route will be treated as the root route and displayed in the sidebar.
 If you want to display the root route regardless of the number of routes declared in the children of the route,
 You can set `alwaysShow: true`, and in this way, it will ignore the previously defined rules.
 Always display the root route (the default value is `false`).

 title: 'title'            Set the name of the route to be displayed in the sidebar and breadcrumbs

 icon: 'svg-name'          Set the icon for this route

 noCache: true             If set to `true`, it will not be cached by `<keep-alive>` (the default value is `false`).

 breadcrumb: false         If set to `false`, it will not be displayed in the `breadcrumb` (the default value is `true`).

 affix: true               If set to `true`, it will always be fixed in the tag item (the default value is `false`).

 noTagsView: true          If set to `true`, it will not appear in the tag (the default value is `false`).

 activeMenu: '/dashboard'  Display highlighted routing paths

 followAuth: '/dashboard'  Follow which route for permission filtering

 canTo: true               If set to `true`, the route can still be navigated even if `hidden` is set to `true` (the default value is `false`).
 }
 **/
const remainingRouter: AppRouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    name: 'Home',
    meta: {},
    children: [
      {
        path: 'index',
        component: () => import('@/views/Home/Index.vue'),
        name: 'Index',
        meta: {
          title: t('router.home'),
          icon: 'ep:home-filled',
          noCache: false,
          affix: true
        }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    name: 'UserInfo',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'profile',
        component: () => import('@/views/Profile/Index.vue'),
        name: 'Profile',
        meta: {
          canTo: true,
          hidden: true,
          noTagsView: false,
          icon: 'ep:user',
          title: t('common.profile')
        }
      },
      {
        path: 'notify-message',
        component: () => import('@/views/system/notify/my/index.vue'),
        name: 'MyNotifyMessage',
        meta: {
          canTo: true,
          hidden: true,
          noTagsView: false,
          icon: 'ep:message',
          title: 'My Internal Message'
        }
      }
    ]
  },
  {
    path: '/dict',
    component: Layout,
    name: 'dict',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'type/data/:dictType',
        component: () => import('@/views/system/dict/data/index.vue'),
        name: 'SystemDictData',
        meta: {
          title: 'Dictionary Data',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/system/dict'
        }
      }
    ]
  },

  {
    path: '/codegen',
    component: Layout,
    name: 'CodegenEdit',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'edit',
        component: () => import('@/views/infra/codegen/EditTable.vue'),
        name: 'InfraCodegenEditTable',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:edit',
          title: 'Modify The Generation Config',
          activeMenu: 'infra/codegen/index'
        }
      }
    ]
  },
  {
    path: '/job',
    component: Layout,
    name: 'JobL',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'job-log',
        component: () => import('@/views/infra/job/logger/index.vue'),
        name: 'InfraJobLog',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:edit',
          title: 'Scheduling Log',
          activeMenu: 'infra/job/index'
        }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/sso',
    component: () => import('@/views/Login/Login.vue'),
    name: 'SSOLogin',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/social-login',
    component: () => import('@/views/Login/SocialLogin.vue'),
    name: 'SocialLogin',
    meta: {
      hidden: true,
      title: t('router.socialLogin'),
      noTagsView: true
    }
  },
  {
    path: '/403',
    component: () => import('@/views/Error/403.vue'),
    name: 'NoAccess',
    meta: {
      hidden: true,
      title: '403',
      noTagsView: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFound',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  },
  {
    path: '/500',
    component: () => import('@/views/Error/500.vue'),
    name: 'Error',
    meta: {
      hidden: true,
      title: '500',
      noTagsView: true
    }
  },
  {
    path: '/pay',
    component: Layout,
    name: 'pay',
    meta: { hidden: true },
    children: [
      {
        path: 'cashier',
        name: 'PayCashier',
        meta: {
          title: 'Cashier',
          noCache: true,
          hidden: true
        },
        component: () => import('@/views/pay/cashier/index.vue')
      }
    ]
  },
  {
    path: '/member',
    component: Layout,
    name: 'MemberCenter',
    meta: { hidden: true },
    children: [
      {
        path: 'user/detail/:id',
        name: 'MemberUserDetail',
        meta: {
          title: 'Member Details',
          noCache: true,
          hidden: true
        },
        component: () => import('@/views/member/user/detail/index.vue')
      }
    ]
  },
  {
    path: '/ai',
    component: Layout,
    name: 'Ai',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'image/square',
        component: () => import('@/views/ai/image/square/index.vue'),
        name: 'AiImageSquare',
        meta: {
          title: 'Drawing Works',
          icon: 'ep:home-filled',
          noCache: false
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/Error/404.vue'),
    name: '',
    meta: {
      title: '404',
      hidden: true,
      breadcrumb: false
    }
  }
]

export default remainingRouter


  // {
  //   path: '/pay',
  //   component: Layout,
  //   name: 'pay',
  //   meta: { hidden: true },
  //   children: [
  //     {
  //       path: 'cashier',
  //       name: 'PayCashier',
  //       meta: {
  //         title: 'Cashier',
  //         noCache: true,
  //         hidden: true
  //       },
  //       component: () => import('@/views/pay/cashier/index.vue')
  //     }
  //   ]
  // },
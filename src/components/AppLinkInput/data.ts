// APP Link grouping
export interface AppLinkGroup {
  // Group name
  name: string
  // Link List
  links: AppLink[]
}

// APP link
export interface AppLink {
  // Link Name
  name: string
  // Link address
  path: string
  // Types of links
  type?: APP_LINK_TYPE_ENUM
}

// APP Link type（Special handling is required，For example, product details）
export const enum APP_LINK_TYPE_ENUM {
  // Group buying activity
  ACTIVITY_COMBINATION,
  // Flash sale activity
  ACTIVITY_SECKILL,
  // Points Mall Activity
  ACTIVITY_POINT,
  // Article Details
  ARTICLE_DETAIL,
  // Coupon Details
  COUPON_DETAIL,
  // Customize page details
  DIY_PAGE_DETAIL,
  // Category List
  PRODUCT_CATEGORY_LIST,
  // Product List
  PRODUCT_LIST,
  // Product Details
  PRODUCT_DETAIL_NORMAL,
  // Details of group buying products
  PRODUCT_DETAIL_COMBINATION,
  // Flash sale product details
  PRODUCT_DETAIL_SECKILL
}

// APP Link List（Do some persistence？）
export const APP_LINK_GROUP_LIST = [
  {
    name: 'Shopping Mall',
    links: [
      {
        name: 'Home Page',
        path: '/pages/index/index'
      },
      {
        name: 'Product Category',
        path: '/pages/index/category',
        type: APP_LINK_TYPE_ENUM.PRODUCT_CATEGORY_LIST
      },
      {
        name: 'Shopping Cart',
        path: '/pages/index/cart'
      },
      {
        name: 'Personal Center',
        path: '/pages/index/user'
      },
      {
        name: 'Product Search',
        path: '/pages/index/search'
      },
      {
        name: 'Customize Page',
        path: '/pages/index/page',
        type: APP_LINK_TYPE_ENUM.DIY_PAGE_DETAIL
      },
      {
        name: 'Customer Service',
        path: '/pages/chat/index'
      },
      {
        name: 'System Settings',
        path: '/pages/public/setting'
      },
      {
        name: 'Common Problem',
        path: '/pages/public/faq'
      }
    ]
  },
  {
    name: 'Product',
    links: [
      {
        name: 'Product List',
        path: '/pages/goods/list',
        type: APP_LINK_TYPE_ENUM.PRODUCT_LIST
      },
      {
        name: 'Product Details',
        path: '/pages/goods/index',
        type: APP_LINK_TYPE_ENUM.PRODUCT_DETAIL_NORMAL
      },
      {
        name: 'Details of group buying products',
        path: '/pages/goods/groupon',
        type: APP_LINK_TYPE_ENUM.PRODUCT_DETAIL_COMBINATION
      },
      {
        name: 'Flash sale product details',
        path: '/pages/goods/seckill',
        type: APP_LINK_TYPE_ENUM.PRODUCT_DETAIL_SECKILL
      }
    ]
  },
  {
    name: 'Marketing Activities',
    links: [
      {
        name: 'Group Order',
        path: '/pages/activity/groupon/order'
      },
      {
        name: 'Marketing Products',
        path: '/pages/activity/index'
      },
      {
        name: 'Groupon activity',
        path: '/pages/activity/groupon/list',
        type: APP_LINK_TYPE_ENUM.ACTIVITY_COMBINATION
      },
      {
        name: 'Seckill Activity',
        path: '/pages/activity/seckill/list',
        type: APP_LINK_TYPE_ENUM.ACTIVITY_SECKILL
      },
      {
        name: 'Points Mall Activity',
        path: '/pages/activity/point/list',
        type: APP_LINK_TYPE_ENUM.ACTIVITY_POINT
      },
      {
        name: 'Sign in Center',
        path: '/pages/app/sign'
      },
      {
        name: 'Coupon Center',
        path: '/pages/coupon/list'
      },
      {
        name: 'Coupon Details',
        path: '/pages/coupon/detail',
        type: APP_LINK_TYPE_ENUM.COUPON_DETAIL
      },
      {
        name: 'Article Details',
        path: '/pages/public/richtext',
        type: APP_LINK_TYPE_ENUM.ARTICLE_DETAIL
      }
    ]
  },
  {
    name: 'Distribution Mall',
    links: [
      {
        name: 'Distribution Center',
        path: '/pages/commission/index'
      },
      {
        name: 'Promote Products',
        path: '/pages/commission/goods'
      },
      {
        name: 'Distribution Order',
        path: '/pages/commission/order'
      },
      {
        name: 'My Team',
        path: '/pages/commission/team'
      }
    ]
  },
  {
    name: 'Payment',
    links: [
      {
        name: 'Recharge Balance',
        path: '/pages/pay/recharge'
      },
      {
        name: 'Recharge Record',
        path: '/pages/pay/recharge-log'
      }
    ]
  },
  {
    name: 'User Center',
    links: [
      {
        name: 'User Information',
        path: '/pages/user/info'
      },
      {
        name: 'User Orders',
        path: '/pages/order/list'
      },
      {
        name: 'After Sale Order',
        path: '/pages/order/aftersale/list'
      },
      {
        name: 'Goods Collection',
        path: '/pages/user/goods-collect'
      },
      {
        name: 'Goods Log',
        path: '/pages/user/goods-log'
      },
      {
        name: 'Address management',
        path: '/pages/user/address/list'
      },
      {
        name: 'User Commission',
        path: '/pages/user/wallet/commission'
      },
      {
        name: 'User Balance',
        path: '/pages/user/wallet/money'
      },
      {
        name: 'User Points',
        path: '/pages/user/wallet/score'
      }
    ]
  }
] as AppLinkGroup[]

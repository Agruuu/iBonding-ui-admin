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

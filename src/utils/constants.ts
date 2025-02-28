/**
 * Created by Agruuu
 *
 * Enumeration class
 */

// ========== COMMON modular ==========
// Global Universal State Enumeration
export const CommonStatusEnum = {
  ENABLE: 0, // open
  DISABLE: 1 // Disable
}

// Global User Type Enumeration
export const UserTypeEnum = {
  MEMBER: 1, // member
  ADMIN: 2 // administrators
}

// ========== SYSTEM modular ==========
/**
 * Menu type enumeration
 */
export const SystemMenuTypeEnum = {
  DIR: 1, // catalogue
  MENU: 2, // menu
  BUTTON: 3 // Button
}

/**
 * Enumeration of character types
 */
export const SystemRoleTypeEnum = {
  SYSTEM: 1, // Built in role
  CUSTOM: 2 // Customize roles
}

/**
 * Range enumeration of data permissions
 */
export const SystemDataScopeEnum = {
  ALL: 1, // All data permissions
  DEPT_CUSTOM: 2, // Specify department data permissions
  DEPT_ONLY: 3, // Departmental data permissions
  DEPT_AND_CHILD: 4, // Department and below data permissions
  DEPT_SELF: 5 // Only have personal data permissions
}

/**
 * List of types of users' social platforms
 */
export const SystemUserSocialTypeEnum = {
  DINGTALK: {
    title: 'DingTalk',
    type: 20,
    source: 'dingtalk',
    img: 'https://s1.ax1x.com/2022/05/22/OzMDRs.png'
  },
  WECHAT_ENTERPRISE: {
    title: 'WeCom',
    type: 30,
    source: 'wechat_enterprise',
    img: 'https://s1.ax1x.com/2022/05/22/OzMrzn.png'
  }
}

// ========== INFRA modular ==========
/**
 * Code generation template type
 */
export const InfraCodegenTemplateTypeEnum = {
  CRUD: 1, // Basics CRUD
  TREE: 2, // Tree like structure CRUD
  SUB: 3 // Master's Table CRUD
}

/**
 * Enumeration of task status
 */
export const InfraJobStatusEnum = {
  INIT: 0, // Initialization in progress
  NORMAL: 1, // Running
  STOP: 2 // Pause operation
}

/**
 * API Processing status of abnormal data
 */
export const InfraApiErrorLogProcessStatusEnum = {
  INIT: 0, // Unprocessed
  DONE: 1, // Processed
  IGNORE: 2 // Neglected
}

// ========== PAY modular ==========
/**
 * Payment channel enumeration
 */
export const PayChannelEnum = {
  WX_PUB: {
    code: 'wx_pub',
    name: 'WeChat JSAPI Payment'
  },
  WX_LITE: {
    code: 'wx_lite',
    name: 'WeChat Mini Program Payment'
  },
  WX_APP: {
    code: 'wx_app',
    name: 'WeChat APP Payment'
  },
  WX_NATIVE: {
    code: 'wx_native',
    name: 'WeChat Native Payment'
  },
  WX_WAP: {
    code: 'wx_wap',
    name: 'WeChat WAP Website Payment'
  },
  WX_BAR: {
    code: 'wx_bar',
    name: 'WeChat Barcode Payment'
  },
  ALIPAY_PC: {
    code: 'alipay_pc',
    name: 'Alipay PC Website Payment'
  },
  ALIPAY_WAP: {
    code: 'alipay_wap',
    name: 'Alipay WAP Website Payment'
  },
  ALIPAY_APP: {
    code: 'alipay_app',
    name: 'Alipay APP Payment'
  },
  ALIPAY_QR: {
    code: 'alipay_qr',
    name: 'Alipay Code Scanning Payment'
  },
  ALIPAY_BAR: {
    code: 'alipay_bar',
    name: 'Alipay Barcode Payment'
  },
  WALLET: {
    code: 'wallet',
    name: 'Wallet Payment'
  },
  MOCK: {
    code: 'mock',
    name: 'Simulated Payment'
  }
}

/**
 * Display mode of payment for each round
 */
export const PayDisplayModeEnum = {
  URL: {
    mode: 'url'
  },
  IFRAME: {
    mode: 'iframe'
  },
  FORM: {
    mode: 'form'
  },
  QR_CODE: {
    mode: 'qr_code'
  },
  APP: {
    mode: 'app'
  }
}

/**
 * Payment type enumeration
 */
export const PayType = {
  WECHAT: 'WECHAT',
  ALIPAY: 'ALIPAY',
  MOCK: 'MOCK'
}

/**
 * Payment order status enumeration
 */
export const PayOrderStatusEnum = {
  WAITING: {
    status: 0,
    name: 'Unpaid'
  },
  SUCCESS: {
    status: 10,
    name: 'Paid Already'
  },
  CLOSED: {
    status: 20,
    name: 'Unpaid'
  }
}

// ========== MALL - Product module ==========
/**
 * commodity SPU state
 */
export const ProductSpuStatusEnum = {
  RECYCLE: {
    status: -1,
    name: 'Recycle Bin'
  },
  DISABLE: {
    status: 0,
    name: 'Remove From Shelves'
  },
  ENABLE: {
    status: 1,
    name: 'Put on Shelves'
  }
}

// ========== MALL - Marketing module ==========
/**
 * Enumeration of Limited Term Types for Coupon Templates
 */
export const CouponTemplateValidityTypeEnum = {
  DATE: {
    type: 1,
    name: 'Fixed Date Available'
  },
  TERM: {
    type: 2,
    name: 'Available After Get'
  }
}

/**
 * Enumeration of ways to receive discount coupon templates
 */
export const CouponTemplateTakeTypeEnum = {
  USER: {
    type: 1,
    name: 'Directly Claim'
  },
  ADMIN: {
    type: 2,
    name: 'Designated Distribution'
  },
  REGISTER: {
    type: 3,
    name: 'Newcomer Voucher'
  }
}

/**
 * List of product scope for marketing
 */
export const PromotionProductScopeEnum = {
  ALL: {
    scope: 1,
    name: 'Universal Coupon'
  },
  SPU: {
    scope: 2,
    name: 'Commodity Coupon'
  },
  CATEGORY: {
    scope: 3,
    name: 'Category Coupon'
  }
}

/**
 * List of conditional types for marketing
 */
export const PromotionConditionTypeEnum = {
  PRICE: {
    type: 10,
    name: 'Reach N Euro'
  },
  COUNT: {
    type: 20,
    name: 'Full N Piece'
  }
}

/**
 * List of discount types
 */
export const PromotionDiscountTypeEnum = {
  PRICE: {
    type: 1,
    name: 'Full Reduction'
  },
  PERCENT: {
    type: 2,
    name: 'Discount'
  }
}

// ========== MALL - Trading module ==========
/**
 * Enumeration of Distribution Relationship Binding Modes
 */
export const BrokerageBindModeEnum = {
  ANYTIME: {
    mode: 1,
    name: 'First Binding'
  },
  REGISTER: {
    mode: 2,
    name: 'Register Binding'
  },
  OVERRIDE: {
    mode: 3,
    name: 'Cover Binding'
  }
}
/**
 * Commission sharing mode enumeration
 */
export const BrokerageEnabledConditionEnum = {
  ALL: {
    condition: 1,
    name: 'Everyone Distributes'
  },
  ADMIN: {
    condition: 2,
    name: 'Designated Distribution'
  }
}
/**
 * Commission record business type enumeration
 */
export const BrokerageRecordBizTypeEnum = {
  ORDER: {
    type: 1,
    name: 'Get Promotion Commission'
  },
  WITHDRAW: {
    type: 2,
    name: 'Withdrawal Application'
  }
}
/**
 * Commission withdrawal status enumeration
 */
export const BrokerageWithdrawStatusEnum = {
  AUDITING: {
    status: 0,
    name: 'Under Review'
  },
  AUDIT_SUCCESS: {
    status: 10,
    name: 'Approved by Review'
  },
  AUDIT_FAIL: {
    status: 20,
    name: 'Review Failed'
  },
  WITHDRAW_SUCCESS: {
    status: 11,
    name: 'Withdrawal Successful'
  },
  WITHDRAW_FAIL: {
    status: 21,
    name: 'Withdrawal Failed'
  }
}
/**
 * List of commission withdrawal types
 */
export const BrokerageWithdrawTypeEnum = {
  WALLET: {
    type: 1,
    name: 'Wallet'
  },
  BANK: {
    type: 2,
    name: 'Bank Card'
  },
  WECHAT: {
    type: 3,
    name: 'WeChat'
  },
  ALIPAY: {
    type: 4,
    name: 'Alipay'
  }
}

/**
 * List of delivery methods
 */
export const DeliveryTypeEnum = {
  EXPRESS: {
    type: 1,
    name: 'Express Delivery'
  },
  PICK_UP: {
    type: 2,
    name: 'Pick Up at Store'
  }
}
/**
 * Trading order - state
 */
export const TradeOrderStatusEnum = {
  UNPAID: {
    status: 0,
    name: 'Pending Payment'
  },
  UNDELIVERED: {
    status: 10,
    name: 'Pending Shipment'
  },
  DELIVERED: {
    status: 20,
    name: 'Already Shipped'
  },
  COMPLETED: {
    status: 30,
    name: 'Completed'
  },
  CANCELED: {
    status: 40,
    name: 'Cancelled'
  }
}

// ========== ERP - Enterprise Resource Planning ==========

export const ErpBizType = {
  PURCHASE_ORDER: 10,
  PURCHASE_IN: 11,
  PURCHASE_RETURN: 12,
  SALE_ORDER: 20,
  SALE_OUT: 21,
  SALE_RETURN: 22
}

// ========== BPM modular ==========

export const BpmModelType = {
  BPMN: 10, // BPMN Designer 
  SIMPLE: 20 // Simple Designer
}

export const BpmModelFormType = {
  NORMAL: 10, // Process Form
  CUSTOM: 20 // Business Form
}

export const BpmProcessInstanceStatus = {
  NOT_START: -1, // Not started yet
  RUNNING: 1, // Under approval
  APPROVE: 2, // Approved
  REJECT: 3, // Approval not approved
  CANCEL: 4 // Cancelled
}

export const BpmAutoApproveType = {
  NONE: 0, // Not automatically passed
  APPROVE_ALL: 1, // Only approve once，Subsequent repeated approval nodes will automatically pass
  APPROVE_SEQUENT: 2, // Only automatically approved for nodes with continuous approvals
}

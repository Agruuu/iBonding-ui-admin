/**
 * Data Dictionary Tool Class
 */
import { useDictStoreWithOut } from '@/store/modules/dict'
import { ElementPlusInfoType } from '@/types/elementPlus'

const dictStore = useDictStoreWithOut()

/**
 * Get the data dictionary array corresponding to `dictType`.
 *
 * @param dictType data type
 * @returns {*|Array} Data dictionary array
 */
export interface DictDataType {
  dictType: string
  label: string
  value: string | number | boolean
  colorType: ElementPlusInfoType | ''
  cssClass: string
}

export interface NumberDictDataType extends DictDataType {
  value: number
}

export interface StringDictDataType extends DictDataType {
  value: string
}

export const getDictOptions = (dictType: string) => {
  return dictStore.getDictByType(dictType) || []
}

export const getIntDictOptions = (dictType: string): NumberDictDataType[] => {
  // Get the general `DictDataType` list.
  const dictOptions: DictDataType[] = getDictOptions(dictType)
  // Convert to the `NumberDictDataType` type, which is of the `number` type.
  // why Special conversion is required to avoid warnings from IDEA about the `key` of the `<el-option>` when using `v-for="dict in getIntDictOptions(...)"`.
  const dictOption: NumberDictDataType[] = []
  dictOptions.forEach((dict: DictDataType) => {
    dictOption.push({
      ...dict,
      value: parseInt(dict.value + '')
    })
  })
  return dictOption
}

export const getStrDictOptions = (dictType: string) => {
  // Get the general `DictDataType` list.
  const dictOptions: DictDataType[] = getDictOptions(dictType)
  // Convert to the `StringDictDataType` type, which is of the `string` type.
  // why Special conversion is needed to prevent IDEA from issuing warnings for the `key` of the `<el-option>` when using `v-for="dict in getStrDictOptions(...)"`. 
  const dictOption: StringDictDataType[] = []
  dictOptions.forEach((dict: DictDataType) => {
    dictOption.push({
      ...dict,
      value: dict.value + ''
    })
  })
  return dictOption
}

export const getBoolDictOptions = (dictType: string) => {
  const dictOption: DictDataType[] = []
  const dictOptions: DictDataType[] = getDictOptions(dictType)
  dictOptions.forEach((dict: DictDataType) => {
    dictOption.push({
      ...dict,
      value: dict.value + '' === 'true'
    })
  })
  return dictOption
}

/**
 * Retrieve the dictionary object corresponding to the specified value of the specified dictionary type
 * @param dictType Dictionary type
 * @param value Dictionary value
 * @return DictDataType Dictionary object
 */
export const getDictObj = (dictType: string, value: any): DictDataType | undefined => {
  const dictOptions: DictDataType[] = getDictOptions(dictType)
  for (const dict of dictOptions) {
    if (dict.value === value + '') {
      return dict
    }
  }
}

/**
 * Text display for obtaining dictionary data
 *
 * @param dictType Dictionary type
 * @param value The value of dictionary data
 * @return Dictionary name
 */
export const getDictLabel = (dictType: string, value: any): string => {
  const dictOptions: DictDataType[] = getDictOptions(dictType)
  const dictLabel = ref('')
  dictOptions.forEach((dict: DictDataType) => {
    if (dict.value === value + '') {
      dictLabel.value = dict.label
    }
  })
  return dictLabel.value
}

export enum DICT_TYPE {
  USER_TYPE = 'user_type',
  COMMON_STATUS = 'common_status',
  TERMINAL = 'terminal', // terminal
  DATE_INTERVAL = 'date_interval', // Data interval

  // ========== SYSTEM modular ==========
  SYSTEM_USER_SEX = 'system_user_sex',
  SYSTEM_MENU_TYPE = 'system_menu_type',
  SYSTEM_ROLE_TYPE = 'system_role_type',
  SYSTEM_DATA_SCOPE = 'system_data_scope',
  SYSTEM_NOTICE_TYPE = 'system_notice_type',
  SYSTEM_LOGIN_TYPE = 'system_login_type',
  SYSTEM_LOGIN_RESULT = 'system_login_result',
  SYSTEM_SMS_CHANNEL_CODE = 'system_sms_channel_code',
  SYSTEM_SMS_TEMPLATE_TYPE = 'system_sms_template_type',
  SYSTEM_SMS_SEND_STATUS = 'system_sms_send_status',
  SYSTEM_SMS_RECEIVE_STATUS = 'system_sms_receive_status',
  SYSTEM_OAUTH2_GRANT_TYPE = 'system_oauth2_grant_type',
  SYSTEM_MAIL_SEND_STATUS = 'system_mail_send_status',
  SYSTEM_NOTIFY_TEMPLATE_TYPE = 'system_notify_template_type',
  SYSTEM_SOCIAL_TYPE = 'system_social_type',

  // ========== INFRA modular ==========
  INFRA_BOOLEAN_STRING = 'infra_boolean_string',
  INFRA_JOB_STATUS = 'infra_job_status',
  INFRA_JOB_LOG_STATUS = 'infra_job_log_status',
  INFRA_API_ERROR_LOG_PROCESS_STATUS = 'infra_api_error_log_process_status',
  INFRA_CONFIG_TYPE = 'infra_config_type',
  INFRA_CODEGEN_TEMPLATE_TYPE = 'infra_codegen_template_type',
  INFRA_CODEGEN_FRONT_TYPE = 'infra_codegen_front_type',
  INFRA_CODEGEN_SCENE = 'infra_codegen_scene',
  INFRA_FILE_STORAGE = 'infra_file_storage',
  INFRA_OPERATE_TYPE = 'infra_operate_type',

  // ========== BPM modular ==========
  BPM_MODEL_TYPE = 'bpm_model_type',
  BPM_MODEL_FORM_TYPE = 'bpm_model_form_type',
  BPM_TASK_CANDIDATE_STRATEGY = 'bpm_task_candidate_strategy',
  BPM_PROCESS_INSTANCE_STATUS = 'bpm_process_instance_status',
  BPM_TASK_STATUS = 'bpm_task_status',
  BPM_OA_LEAVE_TYPE = 'bpm_oa_leave_type',
  BPM_PROCESS_LISTENER_TYPE = 'bpm_process_listener_type',
  BPM_PROCESS_LISTENER_VALUE_TYPE = 'bpm_process_listener_value_type',

  // ========== PAY modular ==========
  PAY_CHANNEL_CODE = 'pay_channel_code', // Payment channel code type
  PAY_ORDER_STATUS = 'pay_order_status', // Merchant payment order status
  PAY_REFUND_STATUS = 'pay_refund_status', // Refund order status
  PAY_NOTIFY_STATUS = 'pay_notify_status', // Merchant payment callback status
  PAY_NOTIFY_TYPE = 'pay_notify_type', // Merchant payment callback status
  PAY_TRANSFER_STATUS = 'pay_transfer_status', // Transfer order status
  PAY_TRANSFER_TYPE = 'pay_transfer_type', // Transfer order status

  // ========== MP modular ==========
  MP_AUTO_REPLY_REQUEST_MATCH = 'mp_auto_reply_request_match', // Automatic reply request matching type
  MP_MESSAGE_TYPE = 'mp_message_type', // Message type

  // ========== Member Membership module ==========
  MEMBER_POINT_BIZ_TYPE = 'member_point_biz_type', // Business types of points
  MEMBER_EXPERIENCE_BIZ_TYPE = 'member_experience_biz_type', // Membership Experience Business Type

  // ========== MALL - Product module ==========
  PRODUCT_SPU_STATUS = 'product_spu_status', //Product status

  // ========== MALL - Trading module ==========
  EXPRESS_CHARGE_MODE = 'trade_delivery_express_charge_mode', //The billing method for express delivery
  TRADE_AFTER_SALE_STATUS = 'trade_after_sale_status', // After sales - state
  TRADE_AFTER_SALE_WAY = 'trade_after_sale_way', // After sales - mode
  TRADE_AFTER_SALE_TYPE = 'trade_after_sale_type', // After sales - type
  TRADE_ORDER_TYPE = 'trade_order_type', // order - type
  TRADE_ORDER_STATUS = 'trade_order_status', // order - state
  TRADE_ORDER_ITEM_AFTER_SALE_STATUS = 'trade_order_item_after_sale_status', // Order Item - After sales status
  TRADE_DELIVERY_TYPE = 'trade_delivery_type', // Delivery method
  BROKERAGE_ENABLED_CONDITION = 'brokerage_enabled_condition', // Commission sharing mode
  BROKERAGE_BIND_MODE = 'brokerage_bind_mode', // Distribution relationship binding mode
  BROKERAGE_BANK_NAME = 'brokerage_bank_name', // Commission withdrawal bank
  BROKERAGE_WITHDRAW_TYPE = 'brokerage_withdraw_type', // Commission withdrawal type
  BROKERAGE_RECORD_BIZ_TYPE = 'brokerage_record_biz_type', // Commission business type
  BROKERAGE_RECORD_STATUS = 'brokerage_record_status', // Commission status
  BROKERAGE_WITHDRAW_STATUS = 'brokerage_withdraw_status', // Commission withdrawal status

  // ========== MALL - Marketing module ==========
  PROMOTION_DISCOUNT_TYPE = 'promotion_discount_type', // Discount type
  PROMOTION_PRODUCT_SCOPE = 'promotion_product_scope', // Scope of Marketing Products
  PROMOTION_COUPON_TEMPLATE_VALIDITY_TYPE = 'promotion_coupon_template_validity_type', // Limited term types of coupon templates
  PROMOTION_COUPON_STATUS = 'promotion_coupon_status', // Status of coupons
  PROMOTION_COUPON_TAKE_TYPE = 'promotion_coupon_take_type', // How to receive coupons
  PROMOTION_CONDITION_TYPE = 'promotion_condition_type', // List of conditional types for marketing
  PROMOTION_BARGAIN_RECORD_STATUS = 'promotion_bargain_record_status', // The status of bargaining records
  PROMOTION_COMBINATION_RECORD_STATUS = 'promotion_combination_record_status', // The status of group buying records
  PROMOTION_BANNER_POSITION = 'promotion_banner_position', // banner location

  // ========== CRM - Customer management module ==========
  CRM_AUDIT_STATUS = 'crm_audit_status', // CRM Approval status
  CRM_BIZ_TYPE = 'crm_biz_type', // CRM Business type
  CRM_BUSINESS_END_STATUS_TYPE = 'crm_business_end_status_type', // CRM Business opportunity end status type
  CRM_RECEIVABLE_RETURN_TYPE = 'crm_receivable_return_type', // CRM Repayment method for repayment
  CRM_CUSTOMER_INDUSTRY = 'crm_customer_industry', // CRM Customer's industry
  CRM_CUSTOMER_LEVEL = 'crm_customer_level', // CRM Customer level
  CRM_CUSTOMER_SOURCE = 'crm_customer_source', // CRM Customer source
  CRM_PRODUCT_STATUS = 'crm_product_status', // CRM Product status
  CRM_PERMISSION_LEVEL = 'crm_permission_level', // CRM Level of data permissions
  CRM_PRODUCT_UNIT = 'crm_product_unit', // CRM Product Unit
  CRM_FOLLOW_UP_TYPE = 'crm_follow_up_type', // CRM Follow up method

  // ========== ERP - Enterprise Resource Planning Module  ==========
  ERP_AUDIT_STATUS = 'erp_audit_status', // ERP Approval status
  ERP_STOCK_RECORD_BIZ_TYPE = 'erp_stock_record_biz_type', // Business types of inventory details

  // ========== AI - Artificial Intelligence Module  ==========
  AI_PLATFORM = 'ai_platform', // AI platform
  AI_IMAGE_STATUS = 'ai_image_status', // AI Image status
  AI_MUSIC_STATUS = 'ai_music_status', // AI Music state
  AI_GENERATE_MODE = 'ai_generate_mode', // AI Generate Mode
  AI_WRITE_TYPE = 'ai_write_type', // AI Writing type
  AI_WRITE_LENGTH = 'ai_write_length', // AI Writing length
  AI_WRITE_FORMAT = 'ai_write_format', // AI Writing format
  AI_WRITE_TONE = 'ai_write_tone', // AI Writing tone
  AI_WRITE_LANGUAGE = 'ai_write_language', // AI Writing Language
}

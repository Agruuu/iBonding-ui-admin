import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { useI18n } from './useI18n'
export const useMessage = () => {
  const { t } = useI18n()
  return {
    // Message prompt
    info(content: string) {
      ElMessage.info(content)
    },
    // Error message
    error(content: string) {
      ElMessage.error(content)
    },
    // Success message
    success(content: string) {
      ElMessage.success(content)
    },
    // Warning message
    warning(content: string) {
      ElMessage.warning(content)
    },
    // Pop up prompt
    alert(content: string) {
      ElMessageBox.alert(content, t('common.confirmTitle'))
    },
    // Error message
    alertError(content: string) {
      ElMessageBox.alert(content, t('common.confirmTitle'), { type: 'error' })
    },
    // Successful prompt
    alertSuccess(content: string) {
      ElMessageBox.alert(content, t('common.confirmTitle'), { type: 'success' })
    },
    // Warning prompt
    alertWarning(content: string) {
      ElMessageBox.alert(content, t('common.confirmTitle'), { type: 'warning' })
    },
    // Notification prompt
    notify(content: string) {
      ElNotification.info(content)
    },
    // Error notification
    notifyError(content: string) {
      ElNotification.error(content)
    },
    // Successful notification
    notifySuccess(content: string) {
      ElNotification.success(content)
    },
    // Warning Notice
    notifyWarning(content: string) {
      ElNotification.warning(content)
    },
    // Confirm Form
    confirm(content: string, tip?: string) {
      return ElMessageBox.confirm(content, tip ? tip : t('common.confirmTitle'), {
        confirmButtonText: t('common.ok'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      })
    },
    // Delete Form
    delConfirm(content?: string, tip?: string) {
      return ElMessageBox.confirm(
        content ? content : t('common.delMessage'),
        tip ? tip : t('common.confirmTitle'),
        {
          confirmButtonText: t('common.ok'),
          cancelButtonText: t('common.cancel'),
          type: 'warning'
        }
      )
    },
    // Export Form
    exportConfirm(content?: string, tip?: string) {
      return ElMessageBox.confirm(
        content ? content : t('common.exportMessage'),
        tip ? tip : t('common.confirmTitle'),
        {
          confirmButtonText: t('common.ok'),
          cancelButtonText: t('common.cancel'),
          type: 'warning'
        }
      )
    },
    // Submit Content
    prompt(content: string, tip: string) {
      return ElMessageBox.prompt(content, tip, {
        confirmButtonText: t('common.ok'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      })
    }
  }
}

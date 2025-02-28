import router from '@/router'

// be used for router push
window._hmt = window._hmt || []
// HM_ID
const HM_ID = import.meta.env.VITE_APP_BAIDU_CODE
;(function () {
  // When it's worth it，Just opened
  if (!HM_ID) {
    return
  }
  const hm = document.createElement('script')
  hm.src = 'https://hm.baidu.com/hm.js?' + HM_ID
  const s = document.getElementsByTagName('script')[0]
  s.parentNode.insertBefore(hm, s)
})()

router.afterEach(function (to) {
  if (!HM_ID) {
    return
  }
  _hmt.push(['_trackPageview', to.fullPath])
})

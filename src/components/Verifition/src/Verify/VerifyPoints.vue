<template>
  <div style="position: relative">
    <div class="verify-img-out">
      <div
        :style="{
          width: setSize.imgWidth,
          height: setSize.imgHeight,
          'background-size': setSize.imgWidth + ' ' + setSize.imgHeight,
          'margin-bottom': vSpace + 'px'
        }"
        class="verify-img-panel"
      >
        <div v-show="showRefresh" class="verify-refresh" style="z-index: 3" @click="refresh">
          <i class="iconfont icon-refresh"></i>
        </div>
        <img
          ref="canvas"
          :src="'data:image/png;base64,' + pointBackImgBase"
          alt=""
          style="display: block; width: 100%; height: 100%"
          @click="bindingClick ? canvasClick($event) : undefined"
        />

        <div
          v-for="(tempPoint, index) in tempPoints"
          :key="index"
          :style="{
            'background-color': '#1abd6c',
            color: '#fff',
            'z-index': 9999,
            width: '20px',
            height: '20px',
            'text-align': 'center',
            'line-height': '20px',
            'border-radius': '50%',
            position: 'absolute',
            top: parseInt(tempPoint.y - 10) + 'px',
            left: parseInt(tempPoint.x - 10) + 'px'
          }"
          class="point-area"
        >
          {{ index + 1 }}
        </div>
      </div>
    </div>
    <!-- 'height': this.barSize.height, -->
    <div
      :style="{
        width: setSize.imgWidth,
        color: barAreaColor,
        'border-color': barAreaBorderColor,
        'line-height': barSize.height
      }"
      class="verify-bar-area"
    >
      <span class="verify-msg">{{ text }}</span>
    </div>
  </div>
</template>
<script setup type="text/babel">
/**
 * VerifyPoints
 * @description Click to select
 * */
import { resetSize } from './../utils/util'
import { aesEncrypt } from './../utils/ase'
import { getCode, reqCheck } from '@/api/login'
import { getCurrentInstance, nextTick, onMounted, reactive, ref, toRefs } from 'vue'

const props = defineProps({
  //Pop up style pop，fix fixed
  mode: {
    type: String,
    default: 'fixed'
  },
  captchaType: {
    type: String
  },
  //interval
  vSpace: {
    type: Number,
    default: 5
  },
  imgSize: {
    type: Object,
    default() {
      return {
        width: '310px',
        height: '155px'
      }
    }
  },
  barSize: {
    type: Object,
    default() {
      return {
        width: '310px',
        height: '40px'
      }
    }
  }
})

const { t } = useI18n()
const { mode, captchaType } = toRefs(props)
const { proxy } = getCurrentInstance()
let secretKey = ref(''), //Returned by the backend ase encryption key
  checkNum = ref(3), //Default number of words to click
  fontPos = reactive([]), //Selected coordinate information
  checkPosArr = reactive([]), //Coordinates clicked by the user
  num = ref(1), //Count of clicks
  pointBackImgBase = ref(''), //The background image obtained by the backend
  poinTextList = reactive([]), //The font order of clicks returned by the backend
  backToken = ref(''), //Returned by the backend token value
  setSize = reactive({
    imgHeight: 0,
    imgWidth: 0,
    barHeight: 0,
    barWidth: 0
  }),
  tempPoints = reactive([]),
  text = ref(''),
  barAreaColor = ref(undefined),
  barAreaBorderColor = ref(undefined),
  showRefresh = ref(true),
  bindingClick = ref(true)

const init = () => {
  //Load page
  fontPos.splice(0, fontPos.length)
  checkPosArr.splice(0, checkPosArr.length)
  num.value = 1
  getPictrue()
  nextTick(() => {
    let { imgHeight, imgWidth, barHeight, barWidth } = resetSize(proxy)
    setSize.imgHeight = imgHeight
    setSize.imgWidth = imgWidth
    setSize.barHeight = barHeight
    setSize.barWidth = barWidth
    proxy.$parent.$emit('ready', proxy)
  })
}
onMounted(() => {
  // No dragging allowed
  init()
  proxy.$el.onselectstart = function () {
    return false
  }
})
const canvas = ref(null)
const canvasClick = (e) => {
  checkPosArr.push(getMousePos(canvas, e))
  if (num.value == checkNum.value) {
    num.value = createPoint(getMousePos(canvas, e))
    //Convert coordinate values proportionally
    let arr = pointTransfrom(checkPosArr, setSize)
    checkPosArr.length = 0
    checkPosArr.push(...arr)
    //Wait until the coordinates are created and executed
    setTimeout(() => {
      // var flag = this.comparePos(this.fontPos, this.checkPosArr);
      //Send backend request
      var captchaVerification = secretKey.value
        ? aesEncrypt(backToken.value + '---' + JSON.stringify(checkPosArr), secretKey.value)
        : backToken.value + '---' + JSON.stringify(checkPosArr)
      let data = {
        captchaType: captchaType.value,
        pointJson: secretKey.value
          ? aesEncrypt(JSON.stringify(checkPosArr), secretKey.value)
          : JSON.stringify(checkPosArr),
        token: backToken.value
      }
      reqCheck(data).then((res) => {
        if (res.repCode == '0000') {
          barAreaColor.value = '#4cae4c'
          barAreaBorderColor.value = '#5cb85c'
          text.value = t('captcha.success')
          bindingClick.value = false
          if (mode.value == 'pop') {
            setTimeout(() => {
              proxy.$parent.clickShow = false
              refresh()
            }, 1500)
          }
          proxy.$parent.$emit('success', { captchaVerification })
        } else {
          proxy.$parent.$emit('error', proxy)
          barAreaColor.value = '#d9534f'
          barAreaBorderColor.value = '#d9534f'
          text.value = t('captcha.fail')
          setTimeout(() => {
            refresh()
          }, 700)
        }
      })
    }, 400)
  }
  if (num.value < checkNum.value) {
    num.value = createPoint(getMousePos(canvas, e))
  }
}
//Obtain coordinates
const getMousePos = function (obj, e) {
  var x = e.offsetX
  var y = e.offsetY
  return { x, y }
}
//Create coordinate points
const createPoint = function (pos) {
  tempPoints.push(Object.assign({}, pos))
  return num.value + 1
}
const refresh = async function () {
  tempPoints.splice(0, tempPoints.length)
  barAreaColor.value = '#000'
  barAreaBorderColor.value = '#ddd'
  bindingClick.value = true
  fontPos.splice(0, fontPos.length)
  checkPosArr.splice(0, checkPosArr.length)
  num.value = 1
  await getPictrue()
  showRefresh.value = true
}

// Request background image and verification image
const getPictrue = async () => {
  let data = {
    captchaType: captchaType.value
  }
  const res = await getCode(data)
  if (res.repCode == '0000') {
    pointBackImgBase.value = res.repData.originalImageBase64
    backToken.value = res.repData.token
    secretKey.value = res.repData.secretKey
    poinTextList.value = res.repData.wordList
    text.value = t('captcha.point') + '【' + poinTextList.value.join(',') + '】'
  } else {
    text.value = res.repMsg
  }
}
//Coordinate transformation function
const pointTransfrom = function (pointArr, imgSize) {
  var newPointArr = pointArr.map((p) => {
    let x = Math.round((310 * p.x) / parseInt(imgSize.imgWidth))
    let y = Math.round((155 * p.y) / parseInt(imgSize.imgHeight))
    return { x, y }
  })
  return newPointArr
}
</script>

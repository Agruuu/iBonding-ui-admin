<template>
  <div class="flex flex-row items-center gap-2">
    <el-radio-group v-model="shortcutDays" @change="handleShortcutDaysChange">
      <el-radio-button :value="1">Yesterday</el-radio-button>
      <el-radio-button :value="7">Lately 7 Day</el-radio-button>
      <el-radio-button :value="30">Lately 30 Day</el-radio-button>
    </el-radio-group>
    <el-date-picker
      v-model="times"
      value-format="YYYY-MM-DD HH:mm:ss"
      type="daterange"
      start-placeholder="Start Date"
      end-placeholder="End Date"
      :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
      :shortcuts="shortcuts"
      class="!w-240px"
      @change="emitDateRangePicker"
    />
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>
import dayjs from 'dayjs'
import * as DateUtil from '@/utils/formatTime'

/** Quick date range selection component */
defineOptions({ name: 'ShortcutDateRangePicker' })

const shortcutDays = ref(7) // Date shortcut days（Radio button group）, default7day
const times = ref<[string, string]>(['', '']) // Time range parameters
defineExpose({ times }) // Exposure time range parameter
/** Quick date selection */
const shortcuts = [
  {
    text: 'Yesterday',
    value: () => DateUtil.getDayRange(new Date(), -1)
  },
  {
    text: 'Lately 7 Day',
    value: () => DateUtil.getLast7Days()
  },
  {
    text: 'This Month',
    value: () => [dayjs().startOf('M'), dayjs().subtract(1, 'd')]
  },
  {
    text: 'Lately 30 Day',
    value: () => DateUtil.getLast30Days()
  },
  {
    text: 'Lately 1 Year',
    value: () => DateUtil.getLast1Year()
  }
]

/** Set time range */
function setTimes() {
  const beginDate = dayjs().subtract(shortcutDays.value, 'd')
  const yesterday = dayjs().subtract(1, 'd')
  times.value = DateUtil.getDateRange(beginDate, yesterday)
}

/** Select the shortcut date radio button */
const handleShortcutDaysChange = async () => {
  // Set time range
  setTimes()
  // Select events within the time range for sending
  await emitDateRangePicker()
}

/** Trigger event：Time range selection */
const emits = defineEmits<{
  (e: 'change', times: [dayjs.ConfigType, dayjs.ConfigType]): void
}>()
/** Trigger time range selection event */
const emitDateRangePicker = async () => {
  emits('change', times.value)
}

/** initialization **/
onMounted(() => {
  handleShortcutDaysChange()
})
</script>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { PropType } from 'vue'

defineOptions({ name: 'Crontab' })

interface shortcutsType {
  text: string
  value: string
}

const props = defineProps({
  modelValue: {
    type: String,
    default: '* * * * * ?'
  },
  shortcuts: { type: Array as PropType<shortcutsType[]>, default: () => [] }
})
const defaultValue = ref('')
const dialogVisible = ref(false)
const getYear = () => {
  let v: number[] = []
  let y = new Date().getFullYear()
  for (let i = 0; i < 11; i++) {
    v.push(y + i)
  }
  return v
}
const cronValue = reactive({
  second: {
    type: '0',
    range: {
      start: 1,
      end: 2
    },
    loop: {
      start: 0,
      end: 1
    },
    appoint: [] as string[]
  },
  minute: {
    type: '0',
    range: {
      start: 1,
      end: 2
    },
    loop: {
      start: 0,
      end: 1
    },
    appoint: [] as string[]
  },
  hour: {
    type: '0',
    range: {
      start: 1,
      end: 2
    },
    loop: {
      start: 0,
      end: 1
    },
    appoint: [] as string[]
  },
  day: {
    type: '0',
    range: {
      start: 1,
      end: 2
    },
    loop: {
      start: 1,
      end: 1
    },
    appoint: [] as string[]
  },
  month: {
    type: '0',
    range: {
      start: 1,
      end: 2
    },
    loop: {
      start: 1,
      end: 1
    },
    appoint: [] as string[]
  },
  week: {
    type: '5',
    range: {
      start: '2',
      end: '3'
    },
    loop: {
      start: 0,
      end: '2'
    },
    last: '2',
    appoint: [] as string[]
  },
  year: {
    type: '-1',
    range: {
      start: getYear()[0],
      end: getYear()[1]
    },
    loop: {
      start: getYear()[0],
      end: 1
    },
    appoint: [] as string[]
  }
})
const data = reactive({
  second: ['0', '5', '15', '20', '25', '30', '35', '40', '45', '50', '55', '59'],
  minute: ['0', '5', '15', '20', '25', '30', '35', '40', '45', '50', '55', '59'],
  hour: [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23'
  ],
  day: [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '30',
    '31'
  ],
  month: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  week: [
    {
      value: '1',
      label: 'Sunday'
    },
    {
      value: '2',
      label: 'Monday'
    },
    {
      value: '3',
      label: 'Tuesday'
    },
    {
      value: '4',
      label: 'Wednesday'
    },
    {
      value: '5',
      label: 'Thursday'
    },
    {
      value: '6',
      label: 'Friday'
    },
    {
      value: '7',
      label: 'Saturday'
    }
  ],
  year: getYear()
})

const value_second = computed(() => {
  let v = cronValue.second
  if (v.type == '0') {
    return '*'
  } else if (v.type == '1') {
    return v.range.start + '-' + v.range.end
  } else if (v.type == '2') {
    return v.loop.start + '/' + v.loop.end
  } else if (v.type == '3') {
    return v.appoint.length > 0 ? v.appoint.join(',') : '*'
  } else {
    return '*'
  }
})
const value_minute = computed(() => {
  let v = cronValue.minute
  if (v.type == '0') {
    return '*'
  } else if (v.type == '1') {
    return v.range.start + '-' + v.range.end
  } else if (v.type == '2') {
    return v.loop.start + '/' + v.loop.end
  } else if (v.type == '3') {
    return v.appoint.length > 0 ? v.appoint.join(',') : '*'
  } else {
    return '*'
  }
})
const value_hour = computed(() => {
  let v = cronValue.hour
  if (v.type == '0') {
    return '*'
  } else if (v.type == '1') {
    return v.range.start + '-' + v.range.end
  } else if (v.type == '2') {
    return v.loop.start + '/' + v.loop.end
  } else if (v.type == '3') {
    return v.appoint.length > 0 ? v.appoint.join(',') : '*'
  } else {
    return '*'
  }
})
const value_day = computed(() => {
  let v = cronValue.day
  if (v.type == '0') {
    return '*'
  } else if (v.type == '1') {
    return v.range.start + '-' + v.range.end
  } else if (v.type == '2') {
    return v.loop.start + '/' + v.loop.end
  } else if (v.type == '3') {
    return v.appoint.length > 0 ? v.appoint.join(',') : '*'
  } else if (v.type == '4') {
    return 'L'
  } else if (v.type == '5') {
    return '?'
  } else {
    return '*'
  }
})
const value_month = computed(() => {
  let v = cronValue.month
  if (v.type == '0') {
    return '*'
  } else if (v.type == '1') {
    return v.range.start + '-' + v.range.end
  } else if (v.type == '2') {
    return v.loop.start + '/' + v.loop.end
  } else if (v.type == '3') {
    return v.appoint.length > 0 ? v.appoint.join(',') : '*'
  } else {
    return '*'
  }
})
const value_week = computed(() => {
  let v = cronValue.week
  if (v.type == '0') {
    return '*'
  } else if (v.type == '1') {
    return v.range.start + '-' + v.range.end
  } else if (v.type == '2') {
    return v.loop.end + '#' + v.loop.start
  } else if (v.type == '3') {
    return v.appoint.length > 0 ? v.appoint.join(',') : '*'
  } else if (v.type == '4') {
    return v.last + 'L'
  } else if (v.type == '5') {
    return '?'
  } else {
    return '*'
  }
})
const value_year = computed(() => {
  let v = cronValue.year
  if (v.type == '-1') {
    return ''
  } else if (v.type == '0') {
    return '*'
  } else if (v.type == '1') {
    return v.range.start + '-' + v.range.end
  } else if (v.type == '2') {
    return v.loop.start + '/' + v.loop.end
  } else if (v.type == '3') {
    return v.appoint.length > 0 ? v.appoint.join(',') : ''
  } else {
    return ''
  }
})
watch(
  () => cronValue.week.type,
  (val) => {
    if (val != '5') {
      cronValue.day.type = '5'
    }
  }
)
watch(
  () => cronValue.day.type,
  (val) => {
    if (val != '5') {
      cronValue.week.type = '5'
    }
  }
)
watch(
  () => props.modelValue,
  () => {
    defaultValue.value = props.modelValue
  }
)
onMounted(() => {
  defaultValue.value = props.modelValue
})
const emit = defineEmits(['update:modelValue'])
const select = ref()
watch(
  () => select.value,
  () => {
    if (select.value == 'custom') {
      open()
    } else {
      defaultValue.value = select.value
      emit('update:modelValue', defaultValue.value)
    }
  }
)
const open = () => {
  set()
  dialogVisible.value = true
}
const set = () => {
  defaultValue.value = props.modelValue
  let arr = (props.modelValue || '* * * * * ?').split(' ')
  //Simple inspection
  if (arr.length < 6) {
    ElMessage.warning('cron Expression error，Converted to default expression')
    arr = '* * * * * ?'.split(' ')
  }

  //second
  if (arr[0] == '*') {
    cronValue.second.type = '0'
  } else if (arr[0].includes('-')) {
    cronValue.second.type = '1'
    cronValue.second.range.start = Number(arr[0].split('-')[0])
    cronValue.second.range.end = Number(arr[0].split('-')[1])
  } else if (arr[0].includes('/')) {
    cronValue.second.type = '2'
    cronValue.second.loop.start = Number(arr[0].split('/')[0])
    cronValue.second.loop.end = Number(arr[0].split('/')[1])
  } else {
    cronValue.second.type = '3'
    cronValue.second.appoint = arr[0].split(',')
  }
  //branch
  if (arr[1] == '*') {
    cronValue.minute.type = '0'
  } else if (arr[1].includes('-')) {
    cronValue.minute.type = '1'
    cronValue.minute.range.start = Number(arr[1].split('-')[0])
    cronValue.minute.range.end = Number(arr[1].split('-')[1])
  } else if (arr[1].includes('/')) {
    cronValue.minute.type = '2'
    cronValue.minute.loop.start = Number(arr[1].split('/')[0])
    cronValue.minute.loop.end = Number(arr[1].split('/')[1])
  } else {
    cronValue.minute.type = '3'
    cronValue.minute.appoint = arr[1].split(',')
  }
  //hour
  if (arr[2] == '*') {
    cronValue.hour.type = '0'
  } else if (arr[2].includes('-')) {
    cronValue.hour.type = '1'
    cronValue.hour.range.start = Number(arr[2].split('-')[0])
    cronValue.hour.range.end = Number(arr[2].split('-')[1])
  } else if (arr[2].includes('/')) {
    cronValue.hour.type = '2'
    cronValue.hour.loop.start = Number(arr[2].split('/')[0])
    cronValue.hour.loop.end = Number(arr[2].split('/')[1])
  } else {
    cronValue.hour.type = '3'
    cronValue.hour.appoint = arr[2].split(',')
  }
  //day
  if (arr[3] == '*') {
    cronValue.day.type = '0'
  } else if (arr[3] == 'L') {
    cronValue.day.type = '4'
  } else if (arr[3] == '?') {
    cronValue.day.type = '5'
  } else if (arr[3].includes('-')) {
    cronValue.day.type = '1'
    cronValue.day.range.start = Number(arr[3].split('-')[0])
    cronValue.day.range.end = Number(arr[3].split('-')[1])
  } else if (arr[3].includes('/')) {
    cronValue.day.type = '2'
    cronValue.day.loop.start = Number(arr[3].split('/')[0])
    cronValue.day.loop.end = Number(arr[3].split('/')[1])
  } else {
    cronValue.day.type = '3'
    cronValue.day.appoint = arr[3].split(',')
  }
  //month
  if (arr[4] == '*') {
    cronValue.month.type = '0'
  } else if (arr[4].includes('-')) {
    cronValue.month.type = '1'
    cronValue.month.range.start = Number(arr[4].split('-')[0])
    cronValue.month.range.end = Number(arr[4].split('-')[1])
  } else if (arr[4].includes('/')) {
    cronValue.month.type = '2'
    cronValue.month.loop.start = Number(arr[4].split('/')[0])
    cronValue.month.loop.end = Number(arr[4].split('/')[1])
  } else {
    cronValue.month.type = '3'
    cronValue.month.appoint = arr[4].split(',')
  }
  //week
  if (arr[5] == '*') {
    cronValue.week.type = '0'
  } else if (arr[5] == '?') {
    cronValue.week.type = '5'
  } else if (arr[5].includes('-')) {
    cronValue.week.type = '1'
    cronValue.week.range.start = arr[5].split('-')[0]
    cronValue.week.range.end = arr[5].split('-')[1]
  } else if (arr[5].includes('#')) {
    cronValue.week.type = '2'
    cronValue.week.loop.start = Number(arr[5].split('#')[1])
    cronValue.week.loop.end = arr[5].split('#')[0]
  } else if (arr[5].includes('L')) {
    cronValue.week.type = '4'
    cronValue.week.last = arr[5].split('L')[0]
  } else {
    cronValue.week.type = '3'
    cronValue.week.appoint = arr[5].split(',')
  }
  //year
  if (!arr[6]) {
    cronValue.year.type = '-1'
  } else if (arr[6] == '*') {
    cronValue.year.type = '0'
  } else if (arr[6].includes('-')) {
    cronValue.year.type = '1'
    cronValue.year.range.start = Number(arr[6].split('-')[0])
    cronValue.year.range.end = Number(arr[6].split('-')[1])
  } else if (arr[6].includes('/')) {
    cronValue.year.type = '2'
    cronValue.year.loop.start = Number(arr[6].split('/')[1])
    cronValue.year.loop.end = Number(arr[6].split('/')[0])
  } else {
    cronValue.year.type = '3'
    cronValue.year.appoint = arr[6].split(',')
  }
}
const submit = () => {
  let year = value_year.value ? ' ' + value_year.value : ''
  defaultValue.value =
    value_second.value +
    ' ' +
    value_minute.value +
    ' ' +
    value_hour.value +
    ' ' +
    value_day.value +
    ' ' +
    value_month.value +
    ' ' +
    value_week.value +
    year
  emit('update:modelValue', defaultValue.value)
  dialogVisible.value = false
}

const inputChange = () => {
  emit('update:modelValue', defaultValue.value)
}
</script>
<template>
  <el-input v-model="defaultValue" class="input-with-select" v-bind="$attrs" @input="inputChange">
    <template #append>
      <el-select v-model="select" placeholder="Generator" style="width: 115px">
        <el-option label="Per Minute" value="0 * * * * ?" />
        <el-option label="Every Hour" value="0 0 * * * ?" />
        <el-option label="Every Day at Midnight" value="0 0 0 * * ?" />
        <el-option label="On the 1st of each month at midnight" value="0 0 0 1 * ?" />
        <el-option label="Last day of each month at midnight" value="0 0 0 L * ?" />
        <el-option label="Every Sunday at Midnight" value="0 0 0 ? * 1" />
        <el-option
          v-for="(item, index) in shortcuts"
          :key="index"
          :label="item.text"
          :value="item.value"
        />
        <el-option label="Custom" value="custom" />
      </el-select>
    </template>
  </el-input>

  <el-dialog
    v-model="dialogVisible"
    :width="580"
    append-to-body
    destroy-on-close
    title="cron Rule Generator"
  >
    <div class="sc-cron">
      <el-tabs>
        <el-tab-pane>
          <template #label>
            <div class="sc-cron-num">
              <h2>Second</h2>
              <h4>{{ value_second }}</h4>
            </div>
          </template>
          <el-form>
            <el-form-item label="Type">
              <el-radio-group v-model="cronValue.second.type">
                <el-radio-button value="0">Any Value</el-radio-button>
                <el-radio-button value="1">Range</el-radio-button>
                <el-radio-button value="2">Interval</el-radio-button>
                <el-radio-button value="3">Designate</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="cronValue.second.type == '1'" label="Range">
              <el-input-number
                v-model="cronValue.second.range.start"
                :max="59"
                :min="0"
                controls-position="right"
              />
              <span style="padding: 0 15px">-</span>
              <el-input-number
                v-model="cronValue.second.range.end"
                :max="59"
                :min="0"
                controls-position="right"
              />
            </el-form-item>
            <el-form-item v-if="cronValue.second.type == '2'" label="Interval">
              <el-input-number
                v-model="cronValue.second.loop.start"
                :max="59"
                :min="0"
                controls-position="right"
              />
              Start in seconds，Each
              <el-input-number
                v-model="cronValue.second.loop.end"
                :max="59"
                :min="0"
                controls-position="right"
              />
              execute once per second
            </el-form-item>
            <el-form-item v-if="cronValue.second.type == '3'" label="appoint">
              <el-select v-model="cronValue.second.appoint" multiple style="width: 100%">
                <el-option
                  v-for="(item, index) in data.second"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane>
          <template #label>
            <div class="sc-cron-num">
              <h2>Minute</h2>
              <h4>{{ value_minute }}</h4>
            </div>
          </template>
          <el-form>
            <el-form-item label="Type">
              <el-radio-group v-model="cronValue.minute.type">
                <el-radio-button value="0">Any Value</el-radio-button>
                <el-radio-button value="1">Range</el-radio-button>
                <el-radio-button value="2">Interval</el-radio-button>
                <el-radio-button value="3">Designate</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="cronValue.minute.type == '1'" label="Range">
              <el-input-number
                v-model="cronValue.minute.range.start"
                :max="59"
                :min="0"
                controls-position="right"
              />
              <span style="padding: 0 15px">-</span>
              <el-input-number
                v-model="cronValue.minute.range.end"
                :max="59"
                :min="0"
                controls-position="right"
              />
            </el-form-item>
            <el-form-item v-if="cronValue.minute.type == '2'" label="Interval">
              <el-input-number
                v-model="cronValue.minute.loop.start"
                :max="59"
                :min="0"
                controls-position="right"
              />
              Starting in minutes，each
              <el-input-number
                v-model="cronValue.minute.loop.end"
                :max="59"
                :min="0"
                controls-position="right"
              />
              execute once per minute
            </el-form-item>
            <el-form-item v-if="cronValue.minute.type == '3'" label="Designate">
              <el-select v-model="cronValue.minute.appoint" multiple style="width: 100%">
                <el-option
                  v-for="(item, index) in data.minute"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane>
          <template #label>
            <div class="sc-cron-num">
              <h2>Hour</h2>
              <h4>{{ value_hour }}</h4>
            </div>
          </template>
          <el-form>
            <el-form-item label="Type">
              <el-radio-group v-model="cronValue.hour.type">
                <el-radio-button value="0">Any Value</el-radio-button>
                <el-radio-button value="1">Range</el-radio-button>
                <el-radio-button value="2">Interval</el-radio-button>
                <el-radio-button value="3">Designate</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="cronValue.hour.type == '1'" label="Range">
              <el-input-number
                v-model="cronValue.hour.range.start"
                :max="23"
                :min="0"
                controls-position="right"
              />
              <span style="padding: 0 15px">-</span>
              <el-input-number
                v-model="cronValue.hour.range.end"
                :max="23"
                :min="0"
                controls-position="right"
              />
            </el-form-item>
            <el-form-item v-if="cronValue.hour.type == '2'" label="Interval">
              <el-input-number
                v-model="cronValue.hour.loop.start"
                :max="23"
                :min="0"
                controls-position="right"
              />
              Starting from hour，each
              <el-input-number
                v-model="cronValue.hour.loop.end"
                :max="23"
                :min="0"
                controls-position="right"
              />
              execute once per hour
            </el-form-item>
            <el-form-item v-if="cronValue.hour.type == '3'" label="Designate">
              <el-select v-model="cronValue.hour.appoint" multiple style="width: 100%">
                <el-option
                  v-for="(item, index) in data.hour"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane>
          <template #label>
            <div class="sc-cron-num">
              <h2>Day</h2>
              <h4>{{ value_day }}</h4>
            </div>
          </template>
          <el-form>
            <el-form-item label="Type">
              <el-radio-group v-model="cronValue.day.type">
                <el-radio-button value="0">Any Value</el-radio-button>
                <el-radio-button value="1">Range</el-radio-button>
                <el-radio-button value="2">Interval</el-radio-button>
                <el-radio-button value="3">Designate</el-radio-button>
                <el-radio-button value="4">Last Day of This Month</el-radio-button>
                <el-radio-button value="5">Not Specified</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="cronValue.day.type == '1'" label="Range">
              <el-input-number
                v-model="cronValue.day.range.start"
                :max="31"
                :min="1"
                controls-position="right"
              />
              <span style="padding: 0 15px">-</span>
              <el-input-number
                v-model="cronValue.day.range.end"
                :max="31"
                :min="1"
                controls-position="right"
              />
            </el-form-item>
            <el-form-item v-if="cronValue.day.type == '2'" label="Interval">
              <el-input-number
                v-model="cronValue.day.loop.start"
                :max="31"
                :min="1"
                controls-position="right"
              />
              Number start，each
              <el-input-number
                v-model="cronValue.day.loop.end"
                :max="31"
                :min="1"
                controls-position="right"
              />
              execute once a day
            </el-form-item>
            <el-form-item v-if="cronValue.day.type == '3'" label="Designate">
              <el-select v-model="cronValue.day.appoint" multiple style="width: 100%">
                <el-option
                  v-for="(item, index) in data.day"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane>
          <template #label>
            <div class="sc-cron-num">
              <h2>Month</h2>
              <h4>{{ value_month }}</h4>
            </div>
          </template>
          <el-form>
            <el-form-item label="Type">
              <el-radio-group v-model="cronValue.month.type">
                <el-radio-button value="0">Any Value</el-radio-button>
                <el-radio-button value="1">Range</el-radio-button>
                <el-radio-button value="2">Interval</el-radio-button>
                <el-radio-button value="3">Designate</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="cronValue.month.type == '1'" label="Range">
              <el-input-number
                v-model="cronValue.month.range.start"
                :max="12"
                :min="1"
                controls-position="right"
              />
              <span style="padding: 0 15px">-</span>
              <el-input-number
                v-model="cronValue.month.range.end"
                :max="12"
                :min="1"
                controls-position="right"
              />
            </el-form-item>
            <el-form-item v-if="cronValue.month.type == '2'" label="Interval">
              <el-input-number
                v-model="cronValue.month.loop.start"
                :max="12"
                :min="1"
                controls-position="right"
              />
              Starting from the month，each
              <el-input-number
                v-model="cronValue.month.loop.end"
                :max="12"
                :min="1"
                controls-position="right"
              />
              execute once a month
            </el-form-item>
            <el-form-item v-if="cronValue.month.type == '3'" label="Designate">
              <el-select v-model="cronValue.month.appoint" multiple style="width: 100%">
                <el-option
                  v-for="(item, index) in data.month"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane>
          <template #label>
            <div class="sc-cron-num">
              <h2>Week</h2>
              <h4>{{ value_week }}</h4>
            </div>
          </template>
          <el-form>
            <el-form>
              <el-form-item label="Type">
                <el-radio-group v-model="cronValue.week.type">
                  <el-radio-button value="0">Any Value</el-radio-button>
                  <el-radio-button value="1">Range</el-radio-button>
                  <el-radio-button value="2">Interval</el-radio-button>
                  <el-radio-button value="3">Designate</el-radio-button>
                  <el-radio-button value="4">Last week of this month</el-radio-button>
                  <el-radio-button value="5">Not Specified</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="cronValue.week.type == '1'" label="Range">
                <el-select v-model="cronValue.week.range.start">
                  <el-option
                    v-for="(item, index) in data.week"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span style="padding: 0 15px">-</span>
                <el-select v-model="cronValue.week.range.end">
                  <el-option
                    v-for="(item, index) in data.week"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item v-if="cronValue.week.type == '2'" label="Interval">
                execute once on
		<el-select v-model="cronValue.week.loop.end">
                  <el-option
                    v-for="(item, index) in data.week"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
		of the 
		<el-input-number
                  v-model="cronValue.week.loop.start"
                  :max="4"
                  :min="1"
                  controls-position="right"
                />
		week
              </el-form-item>
              <el-form-item v-if="cronValue.week.type == '3'" label="Designate">
                <el-select v-model="cronValue.week.appoint" multiple style="width: 100%">
                  <el-option
                    v-for="(item, index) in data.week"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item v-if="cronValue.week.type == '4'" label="The last week">
                <el-select v-model="cronValue.week.last">
                  <el-option
                    v-for="(item, index) in data.week"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </el-form>
        </el-tab-pane>
        <el-tab-pane>
          <template #label>
            <div class="sc-cron-num">
              <h2>Year</h2>
              <h4>{{ value_year }}</h4>
            </div>
          </template>
          <el-form>
            <el-form-item label="Type">
              <el-radio-group v-model="cronValue.year.type">
                <el-radio-button value="-1">Ignore</el-radio-button>
                <el-radio-button value="0">Any Value</el-radio-button>
                <el-radio-button value="1">Range</el-radio-button>
                <el-radio-button value="2">Interval</el-radio-button>
                <el-radio-button value="3">Designate</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="cronValue.year.type == '1'" label="Range">
              <el-input-number v-model="cronValue.year.range.start" controls-position="right" />
              <span style="padding: 0 15px">-</span>
              <el-input-number v-model="cronValue.year.range.end" controls-position="right" />
            </el-form-item>
            <el-form-item v-if="cronValue.year.type == '2'" label="Interval">
              <el-input-number v-model="cronValue.year.loop.start" controls-position="right" />
              Beginning of the year，each
              <el-input-number
                v-model="cronValue.year.loop.end"
                :min="1"
                controls-position="right"
              />
              Execute once a year
            </el-form-item>
            <el-form-item v-if="cronValue.year.type == '3'" label="Designate">
              <el-select v-model="cronValue.year.appoint" multiple style="width: 100%">
                <el-option
                  v-for="(item, index) in data.year"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>

    <template #footer>
      <el-button @click="dialogVisible = false">Cancel</el-button>
      <el-button type="primary" @click="submit()">Confirm</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.sc-cron:deep(.el-tabs__item) {
  height: auto;
  padding: 0 7px;
  line-height: 1;
  vertical-align: bottom;
}

.sc-cron-num {
  width: 100%;
  margin-bottom: 15px;
  text-align: center;
}

.sc-cron-num h2 {
  margin-bottom: 15px;
  font-size: 12px;
  font-weight: normal;
}

.sc-cron-num h4 {
  display: block;
  width: 100%;
  height: 32px;
  padding: 0 15px;
  font-size: 12px;
  line-height: 30px;
  background: var(--el-color-primary-light-9);
  border-radius: 4px;
}

.sc-cron:deep(.el-tabs__item.is-active) .sc-cron-num h4 {
  color: #fff;
  background: var(--el-color-primary);
}

[data-theme='dark'] .sc-cron-num h4 {
  background: var(--el-color-white);
}

.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}
</style>

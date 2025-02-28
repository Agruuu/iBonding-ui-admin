<template>
  <el-scrollbar height="calc(100vh - 88px - 40px - 50px)">
    <el-row>
      <!-- essential information -->
      <el-col :span="24" class="card-box" shadow="hover">
        <el-card>
          <el-descriptions title="Basic Information" :column="6" border>
            <el-descriptions-item label="Redis Version :">
              {{ cache?.info?.redis_version }}
            </el-descriptions-item>
            <el-descriptions-item label="Operation Mode :">
              {{ cache?.info?.redis_mode == 'standalone' ? 'Stand-alone' : 'Cluster' }}
            </el-descriptions-item>
            <el-descriptions-item label="Port :">
              {{ cache?.info?.tcp_port }}
            </el-descriptions-item>
            <el-descriptions-item label="Number of Clients: ">
              {{ cache?.info?.connected_clients }}
            </el-descriptions-item>
            <el-descriptions-item label="Running Time(day) :">
              {{ cache?.info?.uptime_in_days }}
            </el-descriptions-item>
            <el-descriptions-item label="Using Memory :">
              {{ cache?.info?.used_memory_human }}
            </el-descriptions-item>
            <el-descriptions-item label="Using CPU :">
              {{ cache?.info ? parseFloat(cache?.info?.used_cpu_user_children).toFixed(2) : '' }}
            </el-descriptions-item>
            <el-descriptions-item label="Memory Configuration :">
              {{ cache?.info?.maxmemory_human }}
            </el-descriptions-item>
            <el-descriptions-item label="AOF Enabled :">
              {{ cache?.info?.aof_enabled == '0' ? 'No' : 'Yes' }}
            </el-descriptions-item>
            <el-descriptions-item label="RDB is it Successful :">
              {{ cache?.info?.rdb_last_bgsave_status }}
            </el-descriptions-item>
            <el-descriptions-item label="Number of Key :">
              {{ cache?.dbSize }}
            </el-descriptions-item>
            <el-descriptions-item label="Network Entrance/Export :">
              {{ cache?.info?.instantaneous_input_kbps }}kps/
              {{ cache?.info?.instantaneous_output_kbps }}kps
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <!-- Command statistics -->
      <el-col :span="12" class="mt-3">
        <el-card :gutter="12" shadow="hover">
          <Echart :options="commandStatsRefChika" :height="420" />
        </el-card>
      </el-col>
      <!-- Memory usage statistics -->
      <el-col :span="12" class="mt-3">
        <el-card class="ml-3" :gutter="12" shadow="hover">
          <Echart :options="usedmemoryEchartChika" :height="420" />
        </el-card>
      </el-col>
    </el-row>
  </el-scrollbar>
</template>
<script lang="ts" setup>
import * as RedisApi from '@/api/infra/redis'
import { RedisMonitorInfoVO } from '@/api/infra/redis/types'
const cache = ref<RedisMonitorInfoVO>()

// essential information
const readRedisInfo = async () => {
  const data = await RedisApi.getCache()
  cache.value = data
}

// Memory usage
const usedmemoryEchartChika = reactive<any>({
  title: {
    // Dashboard Title。
    text: 'Memory Usage',
    left: 'center',
    show: true, // Display title or not,default true。
    offsetCenter: [0, '20%'], //Offset position relative to the center of the dashboard，The first item in the array is the horizontal offset，The second item is the vertical offset。It can be an absolute numerical value，It can also be a percentage relative to the radius of the dashboard。
    color: 'yellow', // Color of Text,default #333。
    fontSize: 20 // Font size of text,default 15。
  },
  toolbox: {
    show: false,
    feature: {
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  series: [
    {
      name: 'Peak Value',
      type: 'gauge',
      min: 0,
      max: 50,
      splitNumber: 10,
      //This is the color of the pointer
      color: '#F5C74E',
      radius: '85%',
      center: ['50%', '50%'],
      startAngle: 225,
      endAngle: -45,
      axisLine: {
        // Coordinate axis
        lineStyle: {
          // attribute lineStyle control line style
          color: [
            [0.2, '#7FFF00'],
            [0.8, '#00FFFF'],
            [1, '#FF0000']
          ],
          //width: 6 The size of the outer frame（Width of the ring）
          width: 10
        }
      },
      axisTick: {
        // Coordinate axis small mark
        //What is the length of the thread inside5（short-term）
        length: 5, // attribute length control line
        lineStyle: {
          // attribute lineStyle control line style
          color: '#76D9D7'
        }
      },
      splitLine: {
        // Separation line
        length: 20, // attribute length control line
        lineStyle: {
          // attribute lineStyle（See details lineStyle） control line style
          color: '#76D9D7'
        }
      },
      axisLabel: {
        color: '#76D9D7',
        distance: 15,
        fontSize: 15
      },
      pointer: {
        // Size of pointer
        width: 7,
        show: true
      },
      detail: {
        textStyle: {
          fontWeight: 'normal',
          // The numerical size under the text inside（50）
          fontSize: 15,
          color: '#FFFFFF'
        },
        valueAnimation: true
      },
      progress: {
        show: true
      }
    }
  ]
})

// Usage of instructions
const commandStatsRefChika = reactive({
  title: {
    text: 'Command Statistics',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    type: 'scroll',
    orient: 'vertical',
    right: 30,
    top: 10,
    bottom: 20,
    data: [] as any[],
    textStyle: {
      color: '#a1a1a1'
    }
  },
  series: [
    {
      name: 'Command',
      type: 'pie',
      radius: [20, 120],
      center: ['40%', '60%'],
      data: [] as any[],
      roseType: 'radius',
      label: {
        show: true
      },
      emphasis: {
        label: {
          show: true
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})

/** Load data */
const getSummary = () => {
  // Initialize Command Chart
  initCommandStatsChart()
  usedMemoryInstance()
}

/** Command usage situation */
const initCommandStatsChart = async () => {
  usedmemoryEchartChika.series[0].data = []
  // Initiate a request
  try {
    const data = await RedisApi.getCache()
    cache.value = data
    // Processing data
    const commandStats = [] as any[]
    const nameList = [] as string[]
    data.commandStats.forEach((row) => {
      commandStats.push({
        name: row.command,
        value: row.calls
      })
      nameList.push(row.command)
    })
    commandStatsRefChika.legend.data = nameList
    commandStatsRefChika.series[0].data = commandStats
  } catch {}
}
const usedMemoryInstance = async () => {
  try {
    const data = await RedisApi.getCache()
    cache.value = data
    // Dashboard Details，Used to display data。
    usedmemoryEchartChika.series[0].detail = {
      show: true, // Display details,default true
      offsetCenter: [0, '50%'], // Offset position relative to the center of the dashboard，The first item in the array is the horizontal offset，The second item is the vertical offset。It can be an absolute numerical value，It can also be a percentage relative to the radius of the dashboard。
      color: 'auto', // Color of Text,default auto
      fontSize: 30, // Font size of text,default 15
      formatter: cache.value!.info.used_memory_human // Format function or string
    }

    usedmemoryEchartChika.series[0].data[0] = {
      value: cache.value!.info.used_memory_human,
      name: 'Memory Consumption'
    }
    console.log(cache.value!.info)
    usedmemoryEchartChika.tooltip = {
      formatter: '{b} <br/>{a} : ' + cache.value!.info.used_memory_human
    }
  } catch {}
}

/** initialization **/
onMounted(() => {
  // read redis information
  readRedisInfo()
  // Load data
  getSummary()
})
</script>

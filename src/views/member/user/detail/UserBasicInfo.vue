<template>
  <el-card shadow="never">
    <template #header>
      <slot name="header"></slot>
    </template>
    <el-row v-if="mode === 'member'">
      <el-col :span="4">
        <ElAvatar :size="140" :src="user.avatar || undefined" shape="square" />
      </el-col>
      <el-col :span="20">
        <el-descriptions :column="2">
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label icon="ep:user" label="user name" />
            </template>
            {{ user.name || 'empty' }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label icon="ep:user" label="nickname" />
            </template>
            {{ user.nickname }}
          </el-descriptions-item>
          <el-descriptions-item label="cell-phone number">
            <template #label>
              <descriptions-item-label icon="ep:phone" label="cell-phone number" />
            </template>
            {{ user.mobile }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label icon="fa:mars-double" label="Gender" />
            </template>
            <dict-tag :type="DICT_TYPE.SYSTEM_USER_SEX" :value="user.sex" />
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label icon="ep:location" label="Location:" />
            </template>
            {{ user.areaName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label icon="ep:position" label="register IP" />
            </template>
            {{ user.registerIp }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label icon="fa:birthday-cake" label="birthday" />
            </template>
            {{ user.birthday ? formatDate(user.birthday as any) : 'empty' }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label icon="ep:calendar" label="Registration time" />
            </template>
            {{ user.createTime ? formatDate(user.createTime as any) : 'empty' }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <descriptions-item-label icon="ep:calendar" label="Last login time" />
            </template>
            {{ user.loginDate ? formatDate(user.loginDate as any) : 'empty' }}
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>
    <template v-if="mode === 'kefu'">
      <ElAvatar :size="140" :src="user.avatar || undefined" shape="square" />
      <el-descriptions :column="1" class="kefu-descriptions">
        <el-descriptions-item>
          <template #label>
            <descriptions-item-label icon="ep:user" label="user name" />
          </template>
          {{ user.name || 'empty' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <descriptions-item-label icon="ep:user" label="nickname" />
          </template>
          {{ user.nickname }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <descriptions-item-label icon="ep:phone" label="cell-phone number" />
          </template>
          {{ user.mobile }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <descriptions-item-label icon="fa:mars-double" label="Gender" />
          </template>
          <dict-tag :type="DICT_TYPE.SYSTEM_USER_SEX" :value="user.sex" />
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <descriptions-item-label icon="ep:location" label="Location:" />
          </template>
          {{ user.areaName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <descriptions-item-label icon="ep:position" label="register IP" />
          </template>
          {{ user.registerIp }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <descriptions-item-label icon="fa:birthday-cake" label="birthday" />
          </template>
          {{ user.birthday ? formatDate(user.birthday as any) : 'empty' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <descriptions-item-label icon="ep:calendar" label="Registration time" />
          </template>
          {{ user.createTime ? formatDate(user.createTime as any) : 'empty' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <descriptions-item-label icon="ep:calendar" label="Last login time" />
          </template>
          {{ user.loginDate ? formatDate(user.loginDate as any) : 'empty' }}
        </el-descriptions-item>
      </el-descriptions>
    </template>
  </el-card>
</template>
<script lang="ts" setup>
import { DICT_TYPE } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import * as UserApi from '@/api/member/user'
import { DescriptionsItemLabel } from '@/components/Descriptions/index'

withDefaults(defineProps<{ user: UserApi.UserVO; mode?: string }>(), {
  mode: 'member'
})
</script>
<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

::v-deep(.kefu-descriptions) {
  .el-descriptions__cell {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .el-descriptions__label {
      width: 120px;
      display: block;
      text-align: left;
    }

    .el-descriptions__content {
      flex: 1;
      text-align: end;
    }
  }
}
</style>

<template>
  <el-button-group v-bind="$attrs">
    <slot></slot>
  </el-button-group>
</template>

<script setup lang="ts">
/**
 * Vertical button group
 * Element The official button group only supports horizontal display，Implementing vertical layout by rewriting styles
 */
defineOptions({ name: 'VerticalButtonGroup' })
</script>

<style scoped lang="scss">
.el-button-group {
  display: inline-flex;
  flex-direction: column;
}

.el-button-group > :deep(.el-button:first-child) {
  border-bottom-color: var(--el-button-divide-border-color);
  border-top-right-radius: var(--el-border-radius-base);
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.el-button-group > :deep(.el-button:last-child) {
  border-top-color: var(--el-button-divide-border-color);
  border-top-right-radius: 0;
  border-bottom-left-radius: var(--el-border-radius-base);
  border-top-left-radius: 0;
}

.el-button-group :deep(.el-button--primary:not(:first-child, :last-child)) {
  border-top-color: var(--el-button-divide-border-color);
  border-bottom-color: var(--el-button-divide-border-color);
}

.el-button-group > :deep(.el-button:not(:last-child)) {
  margin-right: 0;
  margin-bottom: -1px;
}
</style>

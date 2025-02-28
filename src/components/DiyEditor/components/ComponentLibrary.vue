<template>
  <el-aside class="editor-left" width="261px">
    <el-scrollbar>
      <el-collapse v-model="extendGroups">
        <el-collapse-item
          v-for="group in groups"
          :key="group.name"
          :name="group.name"
          :title="group.name"
        >
          <draggable
            class="component-container"
            ghost-class="draggable-ghost"
            item-key="index"
            :list="group.components"
            :sort="false"
            :group="{ name: 'component', pull: 'clone', put: false }"
            :clone="handleCloneComponent"
            :animation="200"
            :force-fallback="true"
          >
            <template #item="{ element }">
              <div>
                <div class="drag-placement">Component Placement Area</div>
                <div class="component">
                  <Icon :icon="element.icon" :size="32" />
                  <span class="mt-4px text-12px">{{ element.name }}</span>
                </div>
              </div>
            </template>
          </draggable>
        </el-collapse-item>
      </el-collapse>
    </el-scrollbar>
  </el-aside>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import { componentConfigs } from '../components/mobile/index'
import { cloneDeep } from 'lodash-es'
import { DiyComponent, DiyComponentLibrary } from '@/components/DiyEditor/util'

/** Component library：Currently on the left side【Basic components】、【Graphic and Text Components】part */
defineOptions({ name: 'ComponentLibrary' })

// Component List
const props = defineProps<{
  list: DiyComponentLibrary[]
}>()
// Component grouping
const groups = reactive<any[]>([])
// Unfolded folding panel
const extendGroups = reactive<string[]>([])

// monitor list attribute，according to DiyComponentLibrary of name grouping
watch(
  () => props.list,
  () => {
    // Clear old data
    extendGroups.length = 0
    groups.length = 0
    // Regenerate data
    props.list.forEach((group) => {
      // Do you want to expand the grouping
      if (group.extended) {
        extendGroups.push(group.name)
      }
      // Search for components
      const components = group.components
        .map((name) => componentConfigs[name] as DiyComponent<any>)
        .filter((component) => component)
      if (components.length > 0) {
        groups.push({
          name: group.name,
          components
        })
      }
    })
  },
  {
    immediate: true
  }
)

// Clone components
const handleCloneComponent = (component: DiyComponent<any>) => {
  const instance = cloneDeep(component)
  instance.uid = new Date().getTime()
  return instance
}
</script>

<style scoped lang="scss">
.editor-left {
  z-index: 1;
  flex-shrink: 0;
  user-select: none;
  box-shadow: 8px 0 8px -8px rgb(0 0 0 / 12%);

  :deep(.el-collapse) {
    border-top: none;
  }

  :deep(.el-collapse-item__wrap) {
    border-bottom: none;
  }

  :deep(.el-collapse-item__content) {
    padding-bottom: 0;
  }

  :deep(.el-collapse-item__header) {
    height: 32px;
    padding: 0 24px;
    line-height: 32px;
    background-color: var(--el-bg-color-page);
    border-bottom: none;
  }

  .component-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  .component {
    display: flex;
    width: 86px;
    height: 86px;
    cursor: move;
    border-right: 1px solid var(--el-border-color-lighter);
    border-bottom: 1px solid var(--el-border-color-lighter);
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .el-icon {
      margin-bottom: 4px;
      color: gray;
    }
  }

  .component.active,
  .component:hover {
    color: var(--el-color-white);
    background: var(--el-color-primary);

    .el-icon {
      color: var(--el-color-white);
    }
  }

  .component:nth-of-type(3n) {
    border-right: none;
  }
}

/* Drag and drop placeholder prompt，Default not displayed */
.drag-placement {
  display: none;
  color: #fff;
}

.drag-area {
  /* Style when dragged to the phone area */
  .draggable-ghost {
    display: flex;
    width: 100%;
    height: 40px;

    /* Stripe background */
    background: linear-gradient(
      45deg,
      #91a8d5 0,
      #91a8d5 10%,
      #94b4eb 10%,
      #94b4eb 50%,
      #91a8d5 50%,
      #91a8d5 60%,
      #94b4eb 60%,
      #94b4eb
    );
    background-size: 1rem 1rem;
    transition: all 0.5s;
    justify-content: center;
    align-items: center;

    span {
      display: inline-block;
      width: 140px;
      height: 25px;
      font-size: 12px;
      line-height: 25px;
      color: #fff;
      text-align: center;
      background: #5487df;
    }

    /* Hide components when dragging */
    .component {
      display: none;
    }

    /* Display placeholder prompt when dragging */
    .drag-placement {
      display: block;
    }
  }
}
</style>

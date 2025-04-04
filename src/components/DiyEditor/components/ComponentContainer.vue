<template>
  <div :class="['component', { active: active }]">
    <div
      :style="{
        ...style
      }"
    >
      <component :is="component.id" :property="component.property" />
    </div>
    <div class="component-wrap">
      <!-- left：Component Name（Suspended small stickers） -->
      <div class="component-name" v-if="component.name">
        {{ component.name }}
      </div>
      <!-- right：Component Operation Toolbar -->
      <div class="component-toolbar" v-if="showToolbar && component.name && active">
        <VerticalButtonGroup type="primary">
          <el-tooltip content="Move Up" placement="right">
            <el-button :disabled="!canMoveUp" @click.stop="handleMoveComponent(-1)">
              <Icon icon="ep:arrow-up" />
            </el-button>
          </el-tooltip>
          <el-tooltip content="Move Down" placement="right">
            <el-button :disabled="!canMoveDown" @click.stop="handleMoveComponent(1)">
              <Icon icon="ep:arrow-down" />
            </el-button>
          </el-tooltip>
          <el-tooltip content="Copy" placement="right">
            <el-button @click.stop="handleCopyComponent()">
              <Icon icon="ep:copy-document" />
            </el-button>
          </el-tooltip>
          <el-tooltip content="Delete" placement="right">
            <el-button @click.stop="handleDeleteComponent()">
              <Icon icon="ep:delete" />
            </el-button>
          </el-tooltip>
        </VerticalButtonGroup>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// Register all components
import { components } from '../components/mobile/index'
export default {
  components: { ...components }
}
</script>
<script setup lang="ts">
import { ComponentStyle, DiyComponent } from '@/components/DiyEditor/util'
import { propTypes } from '@/utils/propTypes'
import { object } from 'vue-types'

/**
 * Component Container：Currently in the middle section
 * Used for wrapping components，Provide components with background、Margin 、padding 、Border and other styles
 */
defineOptions({ name: 'ComponentContainer' })

type DiyComponentWithStyle = DiyComponent<any> & { property: { style?: ComponentStyle } }
const props = defineProps({
  component: object<DiyComponentWithStyle>().isRequired,
  active: propTypes.bool.def(false),
  canMoveUp: propTypes.bool.def(false),
  canMoveDown: propTypes.bool.def(false),
  showToolbar: propTypes.bool.def(true)
})

/**
 * Component Style
 */
const style = computed(() => {
  let componentStyle = props.component.property.style
  if (!componentStyle) {
    return {}
  }
  return {
    marginTop: `${componentStyle.marginTop || 0}px`,
    marginBottom: `${componentStyle.marginBottom || 0}px`,
    marginLeft: `${componentStyle.marginLeft || 0}px`,
    marginRight: `${componentStyle.marginRight || 0}px`,
    paddingTop: `${componentStyle.paddingTop || 0}px`,
    paddingRight: `${componentStyle.paddingRight || 0}px`,
    paddingBottom: `${componentStyle.paddingBottom || 0}px`,
    paddingLeft: `${componentStyle.paddingLeft || 0}px`,
    borderTopLeftRadius: `${componentStyle.borderTopLeftRadius || 0}px`,
    borderTopRightRadius: `${componentStyle.borderTopRightRadius || 0}px`,
    borderBottomRightRadius: `${componentStyle.borderBottomRightRadius || 0}px`,
    borderBottomLeftRadius: `${componentStyle.borderBottomLeftRadius || 0}px`,
    overflow: 'hidden',
    background:
      componentStyle.bgType === 'color' ? componentStyle.bgColor : `url(${componentStyle.bgImg})`
  }
})

const emits = defineEmits<{
  (e: 'move', direction: number): void
  (e: 'copy'): void
  (e: 'delete'): void
}>()

/**
 * Mobile components
 * @param direction Movement direction
 */
const handleMoveComponent = (direction: number) => {
  emits('move', direction)
}

/**
 * Copy components
 */
const handleCopyComponent = () => {
  emits('copy')
}

/**
 * remove component
 */
const handleDeleteComponent = () => {
  emits('delete')
}
</script>

<style scoped lang="scss">
$active-border-width: 2px;
$hover-border-width: 1px;
$name-position: -85px;
$toolbar-position: -55px;

/* assembly */
.component {
  position: relative;
  cursor: move;

  .component-wrap {
    position: absolute;
    top: 0;
    left: -$active-border-width;
    display: block;
    width: 100%;
    height: 100%;

    /* When the mouse is placed on a component */
    &:hover {
      border: $hover-border-width dashed var(--el-color-primary);
      box-shadow: 0 0 5px 0 rgb(24 144 255 / 30%);

      .component-name {
        top: $hover-border-width;

        /* Prevent adding borders，Position movement */
        left: $name-position - $hover-border-width;
      }
    }

    /* left：Component Name */
    .component-name {
      position: absolute;
      top: $active-border-width;
      left: $name-position;
      display: block;
      width: 80px;
      height: 25px;
      font-size: 12px;
      color: #6a6a6a;
      line-height: 25px;
      text-align: center;
      background: #fff;
      box-shadow:
        0 0 4px #00000014,
        0 2px 6px #0000000f,
        0 4px 8px 2px #0000000a;

      /* Right small triangle */
      &::after {
        position: absolute;
        top: 7.5px;
        right: -10px;
        width: 0;
        height: 0;
        border: 5px solid transparent;
        border-left-color: #fff;
        content: ' ';
      }
    }

    /* right：Component Operation Toolbar */
    .component-toolbar {
      position: absolute;
      top: 0;
      right: $toolbar-position;
      display: none;

      /* Left small triangle */
      &::before {
        position: absolute;
        top: 10px;
        left: -10px;
        width: 0;
        height: 0;
        border: 5px solid transparent;
        border-right-color: #2d8cf0;
        content: ' ';
      }
    }
  }

  /* When selecting a component */
  &.active {
    margin-bottom: 4px;

    .component-wrap {
      margin-bottom: $active-border-width + $active-border-width;
      border: $active-border-width solid var(--el-color-primary) !important;
      box-shadow: 0 0 10px 0 rgb(24 144 255 / 30%);

      .component-name {
        top: 0 !important;

        /* Prevent adding borders，Position movement */
        left: $name-position - $active-border-width !important;
        color: #fff;
        background: var(--el-color-primary);

        &::after {
          border-left-color: var(--el-color-primary);
        }
      }

      .component-toolbar {
        display: block;
      }
    }
  }
}
</style>

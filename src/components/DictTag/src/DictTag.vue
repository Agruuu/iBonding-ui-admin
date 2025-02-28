<script lang="tsx">
import { computed, defineComponent, PropType } from 'vue'
import { isHexColor } from '@/utils/color'
import { ElTag } from 'element-plus'
import { DictDataType, getDictOptions } from '@/utils/dict'
import { isArray, isBoolean, isNumber, isString } from '@/utils/is'

export default defineComponent({
  name: 'DictTag',
  props: {
    type: {
      type: String as PropType<string>,
      required: true
    },
    value: {
      type: [String, Number, Boolean, Array],
      required: true
    },
    // The string separator is only effective when the value passed to props.value is a string.
    separator: {
      type: String as PropType<string>,
      default: ','
    },
    // The spacing between each tag is set to 5px by default, referring to the gutter of the el - row component. 
    gutter: {
      type: String as PropType<string>,
      default: '5px'
    }
  },
  setup(props) {
    const valueArr: any = computed(() => {
      // 1. This is the situation for the Number type and the Boolean type.
      if (isNumber(props.value) || isBoolean(props.value)) {
        return [String(props.value)]
      }
      // 2. It's a string（Further determine if there is a separator symbol included -> props.sepSymbol ）
      else if (isString(props.value)) {
        return props.value.split(props.separator)
      }
      // 3. array
      else if (isArray(props.value)) {
        return props.value.map(String)
      }
      return []
    })
    const renderDictTag = () => {
      if (!props.type) {
        return null
      }
      // Resolve the issue of custom dictionary labels not rendering when their value is zero
      if (props.value === undefined || props.value === null || props.value === '') {
        return null
      }
      const dictOptions = getDictOptions(props.type)

      return (
        <div
          class="dict-tag"
          style={{
            display: 'inline-flex',
            gap: props.gutter,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {dictOptions.map((dict: DictDataType) => {
            if (valueArr.value.includes(dict.value)) {
              if (dict.colorType + '' === 'primary' || dict.colorType + '' === 'default') {
                dict.colorType = ''
              }
              return (
                // The text color for adding labels is white，Resolve the issue of unclear label text when customizing background colors
                <ElTag
                  style={dict?.cssClass ? 'color: #fff' : ''}
                  type={dict?.colorType || null}
                  color={dict?.cssClass && isHexColor(dict?.cssClass) ? dict?.cssClass : ''}
                  disableTransitions={true}
                >
                  {dict?.label}
                </ElTag>
              )
            }
          })}
        </div>
      )
    }
    return () => renderDictTag()
  }
})
</script>

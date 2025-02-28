<script lang="tsx">
import { ElTable, ElTableColumn, ElPagination } from 'element-plus'
import { defineComponent, PropType, ref, computed, unref, watch, onMounted } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { setIndex } from './helper'
import { getSlot } from '@/utils/tsxHelper'
import type { TableProps } from './types'
import { set } from 'lodash-es'
import { Pagination, TableColumn, TableSetPropsType, TableSlotDefault } from '@/types/table'

export default defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: 'Table',
  props: {
    pageSize: propTypes.number.def(10),
    currentPage: propTypes.number.def(1),
    // Multiple Choice or Not
    selection: propTypes.bool.def(false),
    // Is everything beyond hidden，Priority lower thanschemaIn the middleshowOverflowTooltip,
    showOverflowTooltip: propTypes.bool.def(true),
    // Header
    columns: {
      type: Array as PropType<TableColumn[]>,
      default: () => []
    },
    // Expand Row
    expand: propTypes.bool.def(false),
    // Do you want to display pagination
    pagination: {
      type: Object as PropType<Pagination>,
      default: (): Pagination | undefined => undefined
    },
    // It is only valid for columns with `type=selection`. The type is `Boolean`. If it is `true`, the previously selected data will be retained after the data is updated (you need to specify the `row-key`).
    reserveSelection: propTypes.bool.def(false),
    // Loading status
    loading: propTypes.bool.def(false),
    // Do you want to stack indexes
    reserveIndex: propTypes.bool.def(false),
    // Alignment method
    align: propTypes.string
      .validate((v: string) => ['left', 'center', 'right'].includes(v))
      .def('center'),
    // Header alignment method
    headerAlign: propTypes.string
      .validate((v: string) => ['left', 'center', 'right'].includes(v))
      .def('center'),
    data: {
      type: Array as PropType<Recordable[]>,
      default: () => []
    }
  },
  emits: ['update:pageSize', 'update:currentPage', 'register'],
  setup(props, { attrs, slots, emit, expose }) {
    const elTableRef = ref<ComponentRef<typeof ElTable>>()

    // register
    onMounted(() => {
      const tableRef = unref(elTableRef)
      emit('register', tableRef?.$parent, elTableRef)
    })

    const pageSizeRef = ref(props.pageSize)

    const currentPageRef = ref(props.currentPage)

    // useTable incoming props
    const outsideProps = ref<TableProps>({})

    const mergeProps = ref<TableProps>({})

    const getProps = computed(() => {
      const propsObj = { ...props }
      Object.assign(propsObj, unref(mergeProps))
      return propsObj
    })

    const setProps = (props: TableProps = {}) => {
      mergeProps.value = Object.assign(unref(mergeProps), props)
      outsideProps.value = props
    }

    const setColumn = (columnProps: TableSetPropsType[], columnsChildren?: TableColumn[]) => {
      const { columns } = unref(getProps)
      for (const v of columnsChildren || columns) {
        for (const item of columnProps) {
          if (v.field === item.field) {
            set(v, item.path, item.value)
          } else if (v.children?.length) {
            setColumn(columnProps, v.children)
          }
        }
      }
    }

    const selections = ref<Recordable[]>([])

    const selectionChange = (selection: Recordable[]) => {
      selections.value = selection
    }

    expose({
      setProps,
      setColumn,
      selections
    })

    const pagination = computed(() => {
      // update by Agruuu：Keep the logic consistent with that of the `Pagination` component.
      return Object.assign(
        {
          small: false,
          background: true,
          pagerCount: document.body.clientWidth < 992 ? 5 : 7,
          layout: 'total, sizes, prev, pager, next, jumper',
          pageSizes: [10, 20, 30, 50, 100],
          disabled: false,
          hideOnSinglePage: false,
          total: 10
        },
        unref(getProps).pagination
      )
    })

    watch(
      () => unref(getProps).pageSize,
      (val: number) => {
        pageSizeRef.value = val
      }
    )

    watch(
      () => unref(getProps).currentPage,
      (val: number) => {
        currentPageRef.value = val
      }
    )

    watch(
      () => pageSizeRef.value,
      (val: number) => {
        emit('update:pageSize', val)
      }
    )

    watch(
      () => currentPageRef.value,
      (val: number) => {
        emit('update:currentPage', val)
      }
    )

    const getBindValue = computed(() => {
      const bindValue: Recordable = { ...attrs, ...props }
      delete bindValue.columns
      delete bindValue.data
      return bindValue
    })

    const renderTableSelection = () => {
      const { selection, reserveSelection, align, headerAlign } = unref(getProps)
      // Rendering Multiple Choice
      return selection ? (
        <ElTableColumn
          type="selection"
          reserveSelection={reserveSelection}
          align={align}
          headerAlign={headerAlign}
          width="50"
        ></ElTableColumn>
      ) : undefined
    }

    const renderTableExpand = () => {
      const { align, headerAlign, expand } = unref(getProps)
      // Rendering exhibition run
      return expand ? (
        <ElTableColumn type="expand" align={align} headerAlign={headerAlign}>
          {{
            // @ts-ignore
            default: (data: TableSlotDefault) => getSlot(slots, 'expand', data)
          }}
        </ElTableColumn>
      ) : undefined
    }

    const rnderTreeTableColumn = (columnsChildren: TableColumn[]) => {
      const { align, headerAlign, showOverflowTooltip } = unref(getProps)
      return columnsChildren.map((v) => {
        const props = { ...v }
        if (props.children) delete props.children
        return (
          <ElTableColumn
            showOverflowTooltip={showOverflowTooltip}
            align={align}
            headerAlign={headerAlign}
            {...props}
            prop={v.field}
          >
            {{
              default: (data: TableSlotDefault) =>
                v.children && v.children.length
                  ? rnderTableColumn(v.children)
                  : // @ts-ignore
                    getSlot(slots, v.field, data) ||
                    v?.formatter?.(data.row, data.column, data.row[v.field], data.$index) ||
                    data.row[v.field],
              // @ts-ignore
              header: getSlot(slots, `${v.field}-header`)
            }}
          </ElTableColumn>
        )
      })
    }

    const rnderTableColumn = (columnsChildren?: TableColumn[]) => {
      const {
        columns,
        reserveIndex,
        pageSize,
        currentPage,
        align,
        headerAlign,
        showOverflowTooltip
      } = unref(getProps)
      return [...[renderTableExpand()], ...[renderTableSelection()]].concat(
        (columnsChildren || columns).map((v) => {
          // Custom generated serial number
          if (v.type === 'index') {
            return (
              <ElTableColumn
                type="index"
                index={
                  v.index
                    ? v.index
                    : (index) => setIndex(reserveIndex, index, pageSize, currentPage)
                }
                align={v.align || align}
                headerAlign={v.headerAlign || headerAlign}
                label={v.label}
                width="65px"
              ></ElTableColumn>
            )
          } else {
            const props = { ...v }
            if (props.children) delete props.children
            return (
              <ElTableColumn
                showOverflowTooltip={showOverflowTooltip}
                align={align}
                headerAlign={headerAlign}
                {...props}
                prop={v.field}
              >
                {{
                  default: (data: TableSlotDefault) =>
                    v.children && v.children.length
                      ? rnderTreeTableColumn(v.children)
                      : // @ts-ignore
                        getSlot(slots, v.field, data) ||
                        v?.formatter?.(data.row, data.column, data.row[v.field], data.$index) ||
                        data.row[v.field],
                  // @ts-ignore
                  header: () => getSlot(slots, `${v.field}-header`) || v.label
                }}
              </ElTableColumn>
            )
          }
        })
      )
    }

    return () => (
      <div v-loading={unref(getProps).loading}>
        <ElTable
          // @ts-ignore
          ref={elTableRef}
          data={unref(getProps).data}
          onSelection-change={selectionChange}
          {...unref(getBindValue)}
        >
          {{
            default: () => rnderTableColumn(),
            // @ts-ignore
            append: () => getSlot(slots, 'append')
          }}
        </ElTable>
        {unref(getProps).pagination ? (
          // update by Agruuu：Keep the logic consistent with that of the `Pagination` component.
          <ElPagination
            v-model:pageSize={pageSizeRef.value}
            v-model:currentPage={currentPageRef.value}
            class="float-right mb-15px mt-15px"
            {...unref(pagination)}
          ></ElPagination>
        ) : undefined}
      </div>
    )
  }
})
</script>
<style lang="scss" scoped>
:deep(.el-button.is-text) {
  padding: 8px 4px;
  margin-left: 0;
}

:deep(.el-button.is-link) {
  padding: 8px 4px;
  margin-left: 0;
}
</style>

import { Pagination, TableColumn } from '@/types/table'

export type TableProps = {
  pageSize?: number
  currentPage?: number
  // Multiple Choice or Not
  selection?: boolean
  // Whether to hide all the overflowing content, with a lower priority than the `showOverflowTooltip` in the schema.
  showOverflowTooltip?: boolean
  // Header
  columns?: TableColumn[]
  // Do you want to display pagination
  pagination?: Pagination | undefined
  // It is only valid for columns where `type=selection`. The data type is `Boolean`. If it's set to `true`, the previously selected data will be retained after data updates (a `row-key` needs to be specified). 
  reserveSelection?: boolean
  // Loading status
  loading?: boolean
  // Do you want to stack indexes
  reserveIndex?: boolean
  // Alignment method
  align?: 'left' | 'center' | 'right'
  // Header alignment method
  headerAlign?: 'left' | 'center' | 'right'
  data?: Recordable
  expand?: boolean
} & Recordable

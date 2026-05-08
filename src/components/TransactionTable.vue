<script setup lang="ts">
import { ref, computed, h } from 'vue'
import {
  useVueTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  FlexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from '@tanstack/vue-table'
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { getLocalTimeZone } from '@internationalized/date'
import DatePickerWithRange from '@/components/ui/DatePickerWithRange.vue'
import type { Transaction } from '@/types'
import type { DateRange } from 'reka-ui'

interface Props {
  data: Transaction[]
  categories: Array<{ id: string; name: string }>
  loading?: boolean
  error?: string | null
  onEdit?: (transaction: Transaction) => void
  onDelete?: (id: string) => void
  onTypeFilterChange?: (type: 'all' | 'income' | 'expense') => void
  onCategoryFilterChange?: (categoryId: string) => void
  onDateRangeFilterChange?: (dateRange: DateRange | undefined) => void
  filterType?: 'all' | 'income' | 'expense'
  filterCategory?: string
  filterDateRange?: DateRange
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  filterType: 'all',
  filterCategory: 'all',
})

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})

const emit = defineEmits<{
  'update:filterType': [value: 'all' | 'income' | 'expense']
  'update:filterCategory': [value: string]
  'update:filterDateRange': [value: DateRange | undefined]
}>()

// Apply filters to data
const filteredData = computed(() => {
  let result = [...props.data]
  if (props.filterType !== 'all') {
    result = result.filter((t) => t.type === props.filterType)
  }
  if (props.filterCategory !== 'all') {
    result = result.filter((t) => t.categoryId === props.filterCategory)
  }
  if (props.filterDateRange?.start) {
    const fromDate = props.filterDateRange.start.toDate(getLocalTimeZone())
    result = result.filter((t) => new Date(t.occurredAt) >= fromDate)
  }
  if (props.filterDateRange?.end) {
    const toDate = new Date(props.filterDateRange.end.toDate(getLocalTimeZone()))
    toDate.setHours(23, 59, 59, 999)
    result = result.filter((t) => new Date(t.occurredAt) <= toDate)
  }
  return result
})

function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
  return formatted.replace('Rp', 'Rp ')
}

function formatDate(dateStr: string): string {
  return format(new Date(dateStr), 'MMM d, yyyy')
}

const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'occurredAt',
    header: ({ column }) => {
      return h(Button, {
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Date ', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
    },
    cell: ({ row }) => h('div', { class: 'text-muted-foreground' }, formatDate(row.getValue('occurredAt'))),
  },
  {
    accessorKey: 'description',
    header: ({ column }) => {
      return h(Button, {
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Description ', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
    },
    cell: ({ row }) => {
      const transaction = row.original
      return h('div', { class: 'font-medium' }, transaction.description || transaction.category?.name || 'Transaction')
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const transaction = row.original
      return h('div', { class: 'flex items-center gap-2' }, [
        h('div', {
          class: 'w-3 h-3 rounded-full',
          style: { backgroundColor: transaction.category?.color || '#94A3B8' },
        }),
        h('span', {}, transaction.category?.name || 'Uncategorized'),
      ])
    },
  },
  {
    accessorKey: 'type',
    header: ({ column }) => {
      return h(Button, {
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Type ', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
    },
    cell: ({ row }) => {
      const type = row.getValue('type') as 'income' | 'expense'
      return h(Badge, {
        variant: type === 'income' ? 'default' : 'secondary',
        class: cn('font-semibold', type === 'income' ? 'bg-muted text-foreground' : 'bg-destructive/10 text-destructive'),
      }, () => type)
    },
  },
  {
    accessorKey: 'amount',
    header: () => h('div', { class: 'text-right' }, 'Amount'),
    cell: ({ row }) => {
      const amount = Number(row.getValue('amount'))
      const type = row.original.type
      return h('div', {
        class: cn('text-right font-semibold', type === 'income' ? 'text-green-600' : 'text-red-600'),
      }, `${type === 'income' ? '+' : '-'}${formatCurrency(amount)}`)
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const transaction = row.original

      return h(DropdownMenu, {}, () => [
        h(DropdownMenuTrigger, { asChild: true }, () =>
          h(Button, { variant: 'ghost', class: 'h-8 w-8 p-0' }, () => [
            h('span', { class: 'sr-only' }, 'Open menu'),
            h(MoreHorizontal, { class: 'h-4 w-4' }),
          ])
        ),
        h(DropdownMenuContent, { align: 'end' }, () => [
          h(DropdownMenuLabel, {}, () => 'Actions'),
          props.onEdit && h(DropdownMenuItem, {
            onClick: () => props.onEdit!(transaction),
          }, () => 'Edit Transaction'),
          h(DropdownMenuSeparator),
          h(DropdownMenuItem, {
            onClick: () => props.onDelete?.(transaction.id),
            class: 'text-destructive',
          }, () => 'Delete Transaction'),
        ]),
      ])
    },
  },
]

const table = useVueTable({
  get data() { return filteredData.value },
  columns,
  onSortingChange: (updaterOrValue) => sorting.value = typeof updaterOrValue === 'function' ? updaterOrValue(sorting.value) : updaterOrValue,
  onColumnFiltersChange: (updaterOrValue) => columnFilters.value = typeof updaterOrValue === 'function' ? updaterOrValue(columnFilters.value) : updaterOrValue,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onColumnVisibilityChange: (updaterOrValue) => columnVisibility.value = typeof updaterOrValue === 'function' ? updaterOrValue(columnVisibility.value) : updaterOrValue,
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
  },
})
</script>

<template>
  <div class="w-full">
    <!-- Filters -->
    <div class="flex flex-wrap gap-4 mb-4">
      <Select
        :model-value="filterType"
        @update:model-value="(value) => {
          if (value === 'all' || value === 'income' || value === 'expense') {
            emit('update:filterType', value)
          }
        }"
      >
        <SelectTrigger class="w-[180px]">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="income">Income</SelectItem>
          <SelectItem value="expense">Expense</SelectItem>
        </SelectContent>
      </Select>
      <Select
        :model-value="filterCategory"
        @update:model-value="(value) => {
          if (value && typeof value === 'string') {
            emit('update:filterCategory', value)
          }
        }"
      >
        <SelectTrigger class="w-[180px]">
          <SelectValue placeholder="Filter by category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </SelectItem>
        </SelectContent>
      </Select>
      <DatePickerWithRange
        :model-value="filterDateRange"
        @update:model-value="(value: DateRange | undefined) => emit('update:filterDateRange', value)"
        placeholder="Filter by date range"
      />
      <Input
        aria-label="Search transactions"
        placeholder="Search transactions..."
        :model-value="(table.getColumn('description')?.getFilterValue() as string) ?? ''"
        @update:model-value="(value: string | number) => {
          const sanitized = String(value).replace(/<[^>]*>?/gm, '')
          table.getColumn('description')?.setFilterValue(sanitized)
        }"
        class="max-w-sm flex-1 min-w-[200px]"
      />
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline" class="ml-auto">
            Columns <ChevronDown class="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem
            v-for="column in table.getAllColumns().filter((column) => column.getCanHide())"
            :key="column.id"
            class="capitalize"
            :checked="column.getIsVisible()"
            @update:checked="(value: boolean) => column.toggleVisibility(!!value)"
          >
            {{ column.id }}
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2" style="border-color: var(--primary)"></div>
    </div>

    <div v-else-if="error" class="flex items-center justify-center py-12 text-destructive">
      <p>{{ error }}</p>
    </div>

    <div v-else class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <TableRow
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              :data-state="row.getIsSelected() && 'selected'"
            >
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
              </TableCell>
            </TableRow>
          </template>
          <TableRow v-else>
            <TableCell :colSpan="columns.length" class="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="flex items-center justify-end space-x-2 py-4">
      <div class="flex-1 text-sm text-muted-foreground">
        {{ table.getFilteredRowModel().rows.length }} row(s) total.
      </div>
      <div class="space-x-2">
        <Button
          variant="outline"
          size="sm"
          @click="table.previousPage()"
          :disabled="!table.getCanPreviousPage()"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          @click="table.nextPage()"
          :disabled="!table.getCanNextPage()"
        >
          Next
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="TData extends { id: string | number }">
import { computed, watch } from 'vue'
import {
  FlexRender,
  getCoreRowModel,
  useVueTable,
  type SortingState,
  type Updater,
} from '@tanstack/vue-table'
import { ArrowDown, ArrowUp, ChevronsUpDown, Check, Loader2 } from 'lucide-vue-next'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useDataTable } from '@shared/composables/data-table/useDataTable.ts'
import DataTablePagination from '@shared/components/data-table/DataTablePagination.vue'
import DataTableToolbar from '@shared/components/data-table/DataTableToolbar.vue'
import type {
  AppDataTableProps,
  ExportPayload,
  QueryParamValue,
  RowId,
} from '@shared/types/main-table-types.ts'

const props = withDefaults(defineProps<AppDataTableProps<TData>>(), {
  title: '',
  description: '',
  searchPlaceholder: 'Search…',
  emptyMessage: 'No records to show yet.',
  errorMessage: 'Could not load the data. Try again.',
  initialPageSize: 10,
  pageSizeOptions: () => [10, 25, 50, 100],
  filters: () => [],
  initialFilters: () => ({}),
  initialSorting: () => [],
  canSelect: true,
  hideSearch: false,
  hideFilters: false,
  hidePagination: false,
  hideExport: false,
})

const emit = defineEmits<{
  'update:selectedIds': [ids: RowId[]]
  loaded: [rows: TData[], total: number]
  error: [error: Error]
  reset: []
  export: [payload: ExportPayload<TData>]
}>()

const dataTable = useDataTable<TData>({
  source: () => props.tableData,
  initialPageSize: props.initialPageSize,
  initialSorting: props.initialSorting,
  initialFilters: props.initialFilters,
  queryParams: () => props.queryParams,
  buildQuery: props.buildQuery,
  responseMapper: props.responseMapper,
  request: props.request,
  getRowId: props.getRowId,
  searchableKeys: props.searchableKeys,
  onLoaded: (rows, total) => emit('loaded', rows, total),
  onError: (error) => emit('error', error),
})

const {
  rows,
  loading,
  error,
  page,
  pageSize,
  total,
  pageCount,
  search,
  filters: filterValues,
  sorting,
  selectedIds,
  isRowSelected,
  toggleRow,
  toggleAllOnPage,
  isAllPageSelected,
  isSomePageSelected,
  refresh,
  applySearch,
  resetTable,
  setPage,
  setPageSize,
  setSorting,
  setFilter,
} = dataTable

const table = useVueTable<TData>({
  get data() {
    return rows.value
  },
  get columns() {
    return props.columns
  },
  state: {
    get sorting() {
      return sorting.value
    },
  },
  manualPagination: true,
  manualSorting: true,
  manualFiltering: true,
  getCoreRowModel: getCoreRowModel(),
  getRowId: (row) => String(props.getRowId ? props.getRowId(row) : row.id),
  onSortingChange: (updater: Updater<SortingState>) => {
    const next = typeof updater === 'function' ? updater(sorting.value) : updater
    setSorting(next)
  },
})

const columnCount = computed(() => props.columns.length + (props.canSelect ? 1 : 0))
const showEmptyState = computed(() => !loading.value && !error.value && rows.value.length === 0)

watch(
    selectedIds,
    (ids) => {
      emit('update:selectedIds', [...ids])
    },
    { deep: true },
)

function onFilterUpdate(key: string, value: QueryParamValue): void {
  setFilter(key, value)
}

function onReset(): void {
  resetTable()
  emit('reset')
}

function onExport(): void {
  emit('export', {
    rows: rows.value,
    selectedIds: [...selectedIds.value],
    filters: { ...filterValues.value },
    search: search.value,
  })
}

defineExpose({
  table,
  refresh,
  selectedIds,
  resetTable,
})
</script>

<template>
  <section class="flex w-full flex-col gap-5 p-50">
    <!-- Header -->
    <header
        v-if="title || description || $slots['title-actions']"
        class="flex flex-wrap items-start justify-between gap-4"
    >
      <div class="space-y-1">
        <h2 v-if="title" class="text-2xl font-semibold text-foreground">{{ title }}</h2>
        <p v-if="description" class="text-sm text-muted-foreground">{{ description }}</p>
      </div>
      <slot name="title-actions" />
    </header>

    <!-- Toolbar -->
    <DataTableToolbar
        :search-value="search"
        :search-placeholder="searchPlaceholder"
        :filters="props.filters"
        :filter-values="filterValues"
        :hide-search="hideSearch"
        :hide-filters="hideFilters"
        :hide-export="hideExport"
        :loading="loading"
        @search="applySearch"
        @update:filter="onFilterUpdate"
        @reset="onReset"
        @export="onExport"
    >
      <template #filters>
        <slot name="filters" />
      </template>
      <template #toolbar-actions>
        <slot name="toolbar-actions" />
      </template>
    </DataTableToolbar>

    <!-- Table -->
    <div class="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
      <div class="w-full overflow-x-auto">
        <Table class="min-w-[720px]">
          <TableHeader class="bg-muted/40">
            <TableRow
                v-for="headerGroup in table.getHeaderGroups()"
                :key="headerGroup.id"
                class="h-[56px] border-b border-border/60 hover:bg-transparent"
            >
              <TableHead v-if="canSelect" class="w-14 text-center">
                <button
                    type="button"
                    class="mx-auto flex size-5 items-center justify-center rounded-full border-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    :class="
                    isAllPageSelected
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted-foreground/40 text-transparent'
                  "
                    :aria-label="isAllPageSelected ? 'Clear page selection' : 'Select all rows on this page'"
                    :aria-checked="isAllPageSelected ? 'true' : isSomePageSelected ? 'mixed' : 'false'"
                    role="checkbox"
                    @click="toggleAllOnPage()"
                >
                  <Check class="size-3" aria-hidden="true" />
                </button>
              </TableHead>

              <TableHead
                  v-for="header in headerGroup.headers"
                  :key="header.id"
                  class="h-[56px] px-4 text-center text-sm font-semibold text-foreground"
              >
                <slot
                    :name="`header-${header.column.id}`"
                    :header="header"
                    :column="header.column"
                >
                  <button
                      v-if="header.column.getCanSort()"
                      type="button"
                      class="mx-auto inline-flex items-center gap-1 rounded-md px-1 py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      @click="header.column.getToggleSortingHandler()?.($event)"
                  >
                    <FlexRender
                        :render="header.column.columnDef.header"
                        :props="header.getContext()"
                    />
                    <ArrowUp v-if="header.column.getIsSorted() === 'asc'" class="size-3.5" aria-hidden="true" />
                    <ArrowDown v-else-if="header.column.getIsSorted() === 'desc'" class="size-3.5" aria-hidden="true" />
                    <ChevronsUpDown v-else class="size-3.5 opacity-40" aria-hidden="true" />
                  </button>
                  <FlexRender
                      v-else
                      :render="header.column.columnDef.header"
                      :props="header.getContext()"
                  />
                </slot>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <!-- Loading -->
            <TableRow v-if="loading" class="h-[72px] hover:bg-transparent">
              <TableCell :colspan="columnCount" class="h-[240px] text-center">
                <span class="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 class="size-4 animate-spin" aria-hidden="true" />
                  Loading records…
                </span>
              </TableCell>
            </TableRow>

            <!-- Error -->
            <TableRow v-else-if="error" class="hover:bg-transparent">
              <TableCell :colspan="columnCount" class="h-[240px] text-center">
                <div class="flex flex-col items-center gap-3">
                  <p class="text-sm font-medium text-destructive">{{ errorMessage }}</p>
                  <p class="text-xs text-muted-foreground">{{ error.message }}</p>
                  <button
                      type="button"
                      class="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
                      @click="refresh()"
                  >
                    Try again
                  </button>
                </div>
              </TableCell>
            </TableRow>

            <!-- Empty -->
            <TableRow v-else-if="showEmptyState" class="hover:bg-transparent">
              <TableCell :colspan="columnCount" class="h-[240px] text-center">
                <slot name="empty">
                  <p class="text-sm text-muted-foreground">{{ emptyMessage }}</p>
                </slot>
              </TableCell>
            </TableRow>

            <!-- Rows -->
            <template v-else>
              <TableRow
                  v-for="row in table.getRowModel().rows"
                  :key="row.id"
                  class="h-[72px] border-b border-border/50 last:border-b-0"
                  :data-state="isRowSelected(row.original) ? 'selected' : undefined"
              >
                <TableCell v-if="canSelect" class="w-14 text-center">
                  <button
                      type="button"
                      role="checkbox"
                      :aria-checked="isRowSelected(row.original)"
                      :aria-label="`Select row ${row.id}`"
                      class="mx-auto flex size-5 items-center justify-center rounded-full border-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      :class="
                    isRowSelected(row.original)
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted-foreground/40 text-transparent'
                  "
                      @click="toggleRow(row.original)"
                  >
                    <Check class="size-3" aria-hidden="true" />
                  </button>
                </TableCell>

                <TableCell
                    v-for="cell in row.getVisibleCells()"
                    :key="cell.id"
                    class="px-4 text-center text-sm text-foreground"
                >
                  <slot
                      :name="`cell-${cell.column.id}`"
                      :row="row.original"
                      :value="cell.getValue()"
                      :cell="cell"
                  >
                    <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                  </slot>
                </TableCell>
              </TableRow>
            </template>
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
          v-if="!hidePagination"
          :page="page"
          :page-count="pageCount"
          :page-size="pageSize"
          :total="total"
          :page-size-options="pageSizeOptions"
          @update:page="setPage"
          @update:page-size="setPageSize"
      />
    </div>
  </section>
</template>

import type { ColumnDef, SortingState, Table } from '@tanstack/vue-table'
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'

/* -------------------------------------------------------------------------- */
/* Primitives                                                                  */
/* -------------------------------------------------------------------------- */

export type Primitive = string | number | boolean | null | undefined

export type QueryParamValue = Primitive | Primitive[]

export type QueryParams = Record<string, QueryParamValue>

/** Row shape every table row must satisfy. */
export interface RowLike {
    id: string | number
}

export type RowId = string | number

/* -------------------------------------------------------------------------- */
/* Filters                                                                     */
/* -------------------------------------------------------------------------- */

export type FilterState = Record<string, QueryParamValue>

export interface FilterOption {
    label: string
    value: string | number
}

/**
 * Declarative filter rendered automatically by the toolbar.
 * Use the `filters` slot instead when a filter needs custom markup.
 */
export interface FilterDefinition {
    /** Key sent to the API / matched against the local array. */
    id: string
    label: string
    placeholder?: string
    options: FilterOption[]
}

/* -------------------------------------------------------------------------- */
/* Query building                                                              */
/* -------------------------------------------------------------------------- */

export interface BuildQueryContext {
    page: number
    pageSize: number
    search: string
    sorting: SortingState
    filters: FilterState
    /** Static params passed through the `queryParams` prop. */
    extra: QueryParams
}

export type BuildQueryFn = (context: BuildQueryContext) => QueryParams

/* -------------------------------------------------------------------------- */
/* Response mapping                                                            */
/* -------------------------------------------------------------------------- */

export interface MappedResponse<TData> {
    rows: TData[]
    total: number
    currentPage: number
    lastPage?: number
}

export type ResponseMapper<TData> = (payload: unknown) => MappedResponse<TData>

/** Pluggable transport, so the host app can pass axios instead of fetch. */
export type RequestFn = (
    url: string,
    params: QueryParams,
    signal: AbortSignal,
) => Promise<unknown>

/* -------------------------------------------------------------------------- */
/* Composable                                                                  */
/* -------------------------------------------------------------------------- */

export type TableSource<TData> = string | TData[]

export interface UseDataTableOptions<TData extends RowLike> {
    /** Endpoint string (server mode) or local array (client mode). */
    source: MaybeRefOrGetter<TableSource<TData>>
    initialPageSize?: number
    initialSorting?: SortingState
    initialFilters?: FilterState
    queryParams?: MaybeRefOrGetter<QueryParams | undefined>
    buildQuery?: BuildQueryFn
    responseMapper?: ResponseMapper<TData>
    getRowId?: (row: TData) => RowId
    request?: RequestFn
    /** Keys searched in client mode. Defaults to every own enumerable key. */
    searchableKeys?: string[]
    immediate?: boolean
    onLoaded?: (rows: TData[], total: number) => void
    onError?: (error: Error) => void
}

export interface UseDataTableReturn<TData extends RowLike> {
    rows: ComputedRef<TData[]>
    loading: Ref<boolean>
    error: Ref<Error | null>
    page: Ref<number>
    pageSize: Ref<number>
    total: ComputedRef<number>
    pageCount: ComputedRef<number>
    search: Ref<string>
    filters: Ref<FilterState>
    sorting: Ref<SortingState>
    isServerMode: ComputedRef<boolean>

    selectedIds: ComputedRef<RowId[]>
    selectedRows: ComputedRef<TData[]>
    isRowSelected: (row: TData) => boolean
    toggleRow: (row: TData, value?: boolean) => void
    toggleAllOnPage: (value?: boolean) => void
    isAllPageSelected: ComputedRef<boolean>
    isSomePageSelected: ComputedRef<boolean>
    clearSelection: () => void

    fetchData: () => Promise<void>
    refresh: () => Promise<void>
    applySearch: (value: string) => void
    resetTable: () => void
    setPage: (value: number) => void
    setPageSize: (value: number) => void
    setSorting: (value: SortingState) => void
    setFilters: (value: FilterState) => void
    setFilter: (key: string, value: QueryParamValue) => void
}

/* -------------------------------------------------------------------------- */
/* Component props                                                             */
/* -------------------------------------------------------------------------- */

export interface AppDataTableProps<TData extends RowLike> {
    columns: ColumnDef<TData, unknown>[]
    tableData: TableSource<TData>
    title?: string
    description?: string
    searchPlaceholder?: string
    emptyMessage?: string
    errorMessage?: string
    initialPageSize?: number
    pageSizeOptions?: number[]
    queryParams?: QueryParams
    /** Declarative filters rendered by the toolbar. */
    filters?: FilterDefinition[]
    initialFilters?: FilterState
    initialSorting?: SortingState
    canSelect?: boolean
    hideSearch?: boolean
    hideFilters?: boolean
    hidePagination?: boolean
    hideExport?: boolean
    searchableKeys?: string[]
    getRowId?: (row: TData) => RowId
    buildQuery?: BuildQueryFn
    responseMapper?: ResponseMapper<TData>
    request?: RequestFn
}

export interface ExportPayload<TData extends RowLike> {
    rows: TData[]
    selectedIds: RowId[]
    filters: FilterState
    search: string
}

export type DataTableInstance<TData extends RowLike> = Table<TData>

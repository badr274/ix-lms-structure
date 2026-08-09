import { computed, ref, shallowRef, toValue, watch, type Ref } from 'vue'
import type { SortingState } from '@tanstack/vue-table'
import type {
    FilterState,
    QueryParamValue,
    RowId,
    RowLike,
    UseDataTableOptions,
    UseDataTableReturn,
} from '@shared/types/main-table-types.ts'
import {
    createDefaultResponseMapper,
    defaultBuildQuery,
    defaultRequest,
} from '@shared/types/defaults.ts'
import {
    matchesFilters,
    matchesSearch,
    sortRows,
} from '@core/utils/data-table.ts'
import { useRowSelection } from '@shared/composables/data-table/useRowSelection.ts'

export function useDataTable<TData extends RowLike>(
    options: UseDataTableOptions<TData>,
): UseDataTableReturn<TData> {
    const {
        source,
        initialPageSize = 10,
        initialSorting = [],
        initialFilters = {},
        queryParams,
        buildQuery = defaultBuildQuery,
        responseMapper = createDefaultResponseMapper<TData>(),
        getRowId = (row: TData): RowId => row.id,
        request = defaultRequest,
        searchableKeys,
        immediate = true,
        onLoaded,
        onError,
    } = options

    /* ---------------------------------- state --------------------------------- */

    const serverRows = shallowRef<TData[]>([])
    const serverTotal = ref(0)
    const loading = ref(false)
    const error = ref<Error | null>(null)

    const page = ref(1)
    const pageSize = ref(initialPageSize)
    const search = ref('')
    const filters = ref<FilterState>({ ...initialFilters })
    const sorting = ref<SortingState>([...initialSorting]) as Ref<SortingState>

    const isServerMode = computed(() => typeof toValue(source) === 'string')

    /* ------------------------------ client pipeline --------------------------- */

    const clientMatched = computed<TData[]>(() => {
        const value = toValue(source)
        if (!Array.isArray(value)) return []

        const term = search.value.trim().toLowerCase()
        return value.filter(
            (row) => matchesFilters(row, filters.value) && matchesSearch(row, term, searchableKeys),
        )
    })

    /* --------------------------------- derived -------------------------------- */

    const total = computed(() => (isServerMode.value ? serverTotal.value : clientMatched.value.length))
    const pageCount = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))

    const rows = computed<TData[]>(() => {
        if (isServerMode.value) return serverRows.value
        const start = (page.value - 1) * pageSize.value
        return sortRows(clientMatched.value, sorting.value).slice(start, start + pageSize.value)
    })

    const selection = useRowSelection<TData>(rows, getRowId)

    /* --------------------------------- fetching ------------------------------- */

    let controller: AbortController | null = null
    let requestToken = 0

    async function fetchData(): Promise<void> {
        const endpoint = toValue(source)

        if (typeof endpoint !== 'string' || endpoint === '') {
            error.value = null
            onLoaded?.(rows.value, total.value)
            return
        }

        controller?.abort()
        controller = new AbortController()

        const token = ++requestToken
        loading.value = true
        error.value = null

        try {
            const payload = await request(
                endpoint,
                buildQuery({
                    page: page.value,
                    pageSize: pageSize.value,
                    search: search.value,
                    sorting: sorting.value,
                    filters: filters.value,
                    extra: toValue(queryParams) ?? {},
                }),
                controller.signal,
            )

            // Race protection: only the newest request may commit.
            if (token !== requestToken) return

            const mapped = responseMapper(payload)
            serverRows.value = mapped.rows
            serverTotal.value = mapped.total
            onLoaded?.(mapped.rows, mapped.total)
        } catch (caught) {
            if (token !== requestToken) return
            if (caught instanceof DOMException && caught.name === 'AbortError') return

            const normalized = caught instanceof Error ? caught : new Error('Unexpected request error')
            serverRows.value = []
            serverTotal.value = 0
            error.value = normalized
            onError?.(normalized)
        } finally {
            if (token === requestToken) loading.value = false
        }
    }

    /* --------------------------------- actions -------------------------------- */

    function setPage(value: number): void {
        page.value = Math.min(Math.max(1, Math.trunc(value)), pageCount.value)
    }

    function setPageSize(value: number): void {
        pageSize.value = Math.max(1, Math.trunc(value))
        page.value = 1
    }

    function setSorting(value: SortingState): void {
        sorting.value = value
        page.value = 1
    }

    function setFilters(value: FilterState): void {
        filters.value = { ...value }
        page.value = 1
    }

    function setFilter(key: string, value: QueryParamValue): void {
        setFilters({ ...filters.value, [key]: value })
    }

    function applySearch(value: string): void {
        search.value = value
        page.value = 1
        if (isServerMode.value) void fetchData()
    }

    function resetTable(): void {
        page.value = 1
        pageSize.value = initialPageSize
        search.value = ''
        filters.value = { ...initialFilters }
        sorting.value = [...initialSorting]
        error.value = null
        selection.clearSelection()
        if (isServerMode.value) void fetchData()
    }

    /* --------------------------------- watchers ------------------------------- */

    watch(
        () => [
            toValue(source),
            page.value,
            pageSize.value,
            JSON.stringify(filters.value),
            JSON.stringify(sorting.value),
            JSON.stringify(toValue(queryParams) ?? {}),
        ],
        () => {
            if (isServerMode.value) void fetchData()
        },
        { immediate },
    )

    // Keep the page inside range when the result set shrinks.
    watch([total, pageSize], () => {
        if (page.value > pageCount.value) setPage(pageCount.value)
    })

    return {
        rows,
        loading,
        error,
        page,
        pageSize,
        total,
        pageCount,
        search,
        filters,
        sorting,
        isServerMode,
        ...selection,
        fetchData,
        refresh: fetchData,
        applySearch,
        resetTable,
        setPage,
        setPageSize,
        setSorting,
        setFilters,
        setFilter,
    }
}

import { computed, ref, toValue, type ComputedRef, type MaybeRefOrGetter, type Ref } from 'vue'
import type { RowId, RowLike } from '@/components/shared/data-table/types'

export interface UseRowSelectionReturn<TData> {
    selectedIds: ComputedRef<RowId[]>
    selectedRows: ComputedRef<TData[]>
    isRowSelected: (row: TData) => boolean
    toggleRow: (row: TData, value?: boolean) => void
    toggleAllOnPage: (value?: boolean) => void
    isAllPageSelected: ComputedRef<boolean>
    isSomePageSelected: ComputedRef<boolean>
    clearSelection: () => void
}

/**
 * Keeps the full row object per id, so selections survive paging
 * and `selectedRows` still works for rows that left the current page.
 */
export function useRowSelection<TData extends RowLike>(
    pageRows: MaybeRefOrGetter<TData[]>,
    getRowId: (row: TData) => RowId,
): UseRowSelectionReturn<TData> {
    const selection = ref(new Map<RowId, TData>()) as Ref<Map<RowId, TData>>

    const isRowSelected = (row: TData): boolean => selection.value.has(getRowId(row))

    function toggleRow(row: TData, value?: boolean): void {
        const id = getRowId(row)
        const next = value ?? !selection.value.has(id)
        if (next) selection.value.set(id, row)
        else selection.value.delete(id)
    }

    const isAllPageSelected = computed<boolean>(() => {
        const rows = toValue(pageRows)
        return rows.length > 0 && rows.every(isRowSelected)
    })

    const isSomePageSelected = computed<boolean>(
        () => toValue(pageRows).some(isRowSelected) && !isAllPageSelected.value,
    )

    function toggleAllOnPage(value?: boolean): void {
        const next = value ?? !isAllPageSelected.value
        for (const row of toValue(pageRows)) toggleRow(row, next)
    }

    return {
        selectedIds: computed(() => Array.from(selection.value.keys())),
        selectedRows: computed(() => Array.from(selection.value.values())),
        isRowSelected,
        toggleRow,
        toggleAllOnPage,
        isAllPageSelected,
        isSomePageSelected,
        clearSelection: () => selection.value.clear(),
    }
}

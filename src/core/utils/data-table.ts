import type { SortingState } from '@tanstack/vue-table'
import type { FilterState, QueryParams, QueryParamValue } from '@shared/types/main-table-types'

/* --------------------------------- guards --------------------------------- */

export function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function toNumber(value: unknown): number | undefined {
    if (typeof value === 'number' && Number.isFinite(value)) return value
    if (typeof value === 'string' && value.trim() !== '') {
        const parsed = Number(value)
        if (Number.isFinite(parsed)) return parsed
    }
    return undefined
}

export function isFilled(value: QueryParamValue): boolean {
    if (value === null || value === undefined || value === '') return false
    return Array.isArray(value) ? value.length > 0 : true
}

/* --------------------------------- reading -------------------------------- */

/** Reads `a.b.c` paths safely from an unknown row. */
export function readField(row: unknown, key: string): unknown {
    return key
        .split('.')
        .reduce<unknown>((acc, part) => (isRecord(acc) ? acc[part] : undefined), row)
}

export function stringify(value: unknown): string {
    if (value === null || value === undefined || typeof value === 'object') return ''
    return String(value)
}

/* --------------------------------- queries -------------------------------- */

export function toSearchParams(params: QueryParams): URLSearchParams {
    const search = new URLSearchParams()

    for (const [key, value] of Object.entries(params)) {
        if (!isFilled(value)) continue
        if (Array.isArray(value)) {
            for (const item of value) if (isFilled(item)) search.append(`${key}[]`, String(item))
            continue
        }
        search.append(key, String(value))
    }

    return search
}

/* ----------------------------- client pipeline ---------------------------- */

export function matchesFilters(row: unknown, filters: FilterState): boolean {
    for (const [key, value] of Object.entries(filters)) {
        if (!isFilled(value)) continue
        const cell = stringify(readField(row, key))
        const ok = Array.isArray(value)
            ? value.some((item) => String(item) === cell)
            : String(value) === cell
        if (!ok) return false
    }
    return true
}

export function matchesSearch(row: unknown, term: string, keys?: string[]): boolean {
    if (!term) return true
    const fields = keys ?? (isRecord(row) ? Object.keys(row) : [])
    return fields.some((key) => stringify(readField(row, key)).toLowerCase().includes(term))
}

export function compareValues(a: unknown, b: unknown): number {
    const numA = toNumber(a)
    const numB = toNumber(b)
    if (numA !== undefined && numB !== undefined) return numA - numB

    const dateA = typeof a === 'string' ? Date.parse(a) : Number.NaN
    const dateB = typeof b === 'string' ? Date.parse(b) : Number.NaN
    if (!Number.isNaN(dateA) && !Number.isNaN(dateB)) return dateA - dateB

    return stringify(a).localeCompare(stringify(b), undefined, {
        numeric: true,
        sensitivity: 'base',
    })
}

export function sortRows<TData>(rows: TData[], sorting: SortingState): TData[] {
    if (sorting.length === 0) return rows

    return [...rows].sort((a, b) => {
        for (const rule of sorting) {
            const result = compareValues(readField(a, rule.id), readField(b, rule.id))
            if (result !== 0) return rule.desc ? -result : result
        }
        return 0
    })
}

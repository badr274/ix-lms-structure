import type { BuildQueryFn, MappedResponse, QueryParams, RequestFn, ResponseMapper } from './main-table-types'
import { isFilled, isRecord, toNumber, toSearchParams } from '@core/utils/data-table'

export const defaultBuildQuery: BuildQueryFn = ({
    page,
    pageSize,
    search,
    sorting,
    filters,
    extra,
}) => {
    const query: QueryParams = { ...extra, page, limit: pageSize }

    if (search) query.search = search
    for (const [key, value] of Object.entries(filters)) if (isFilled(value)) query[key] = value
    for (const rule of sorting) query[`order[${rule.id}]`] = rule.desc ? 'desc' : 'asc'

    return query
}

/**
 * Handles `{ data, meta }`, a bare array, and axios responses
 * where the payload sits inside `response.data`.
 */
export function createDefaultResponseMapper<TData>(): ResponseMapper<TData> {
    return (payload: unknown): MappedResponse<TData> => {
        let body: unknown = payload
        if (isRecord(body) && isRecord(body.data)) body = body.data

        if (Array.isArray(body)) {
            const rows = body as TData[]
            return { rows, total: rows.length, currentPage: 1 }
        }

        if (!isRecord(body)) return { rows: [], total: 0, currentPage: 1 }

        const rows = Array.isArray(body.data) ? (body.data as TData[]) : []
        const meta = isRecord(body.meta) ? body.meta : {}

        return {
            rows,
            total: toNumber(meta.total) ?? toNumber(body.total) ?? rows.length,
            currentPage: toNumber(meta.current_page) ?? toNumber(body.current_page) ?? 1,
            lastPage: toNumber(meta.last_page) ?? toNumber(body.last_page),
        }
    }
}

export const defaultRequest: RequestFn = async (url: string, params: QueryParams, signal?: AbortSignal) => {
    const queryString = toSearchParams(params).toString()
    const separator = url.includes('?') ? '&' : '?'
    const fullUrl = queryString ? `${url}${separator}${queryString}` : url

    const response = await fetch(fullUrl, { signal, headers: { Accept: 'application/json' } })
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`)

    return (await response.json()) as unknown
}

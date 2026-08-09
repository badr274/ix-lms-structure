<script setup lang="ts">
import { ref, watch } from 'vue'
import { RotateCcw, Search, Upload } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { FilterDefinition, FilterState, QueryParamValue } from '@shared/types/main-table-types.ts'

const props = withDefaults(
    defineProps<{
      searchValue?: string
      searchPlaceholder?: string
      filters?: FilterDefinition[]
      filterValues?: FilterState
      hideSearch?: boolean
      hideFilters?: boolean
      hideExport?: boolean
      loading?: boolean
    }>(),
    {
      searchValue: '',
      searchPlaceholder: 'Search…',
      filters: () => [],
      filterValues: () => ({}),
      hideSearch: false,
      hideFilters: false,
      hideExport: false,
      loading: false,
    },
)

const emit = defineEmits<{
  search: [value: string]
  'update:filter': [key: string, value: QueryParamValue]
  reset: []
  export: []
}>()

const term = ref(props.searchValue)

watch(
    () => props.searchValue,
    (value) => {
      term.value = value
    },
)

function submitSearch(): void {
  emit('search', term.value.trim())
}

function onFilterChange(key: string, value: unknown): void {
  emit('update:filter', key, value === '' || value === undefined ? null : String(value))
}

function currentFilterValue(key: string): string {
  const value = props.filterValues[key]
  return value === null || value === undefined ? '' : String(value)
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <!-- Search -->
    <div v-if="!hideSearch" class="relative w-full max-w-[240px] min-w-[180px]">
      <Input
          v-model="term"
          type="search"
          :placeholder="searchPlaceholder"
          :aria-label="searchPlaceholder"
          class="h-11 rounded-full border-border/70 bg-background ps-4 pe-10 text-sm shadow-none"
          @keydown.enter.prevent="submitSearch"
      />
      <Search
          class="pointer-events-none absolute end-4 top-1/2 size-4 -translate-y-1/2 text-primary"
          aria-hidden="true"
      />
    </div>

    <!-- Declarative filters -->
    <template v-if="!hideFilters">
      <div
          v-for="filter in filters"
          :key="filter.id"
          class="w-full max-w-[220px] min-w-[170px]"
      >
        <Select
            :model-value="currentFilterValue(filter.id)"
            @update:model-value="(value: unknown) => onFilterChange(filter.id, value)"
        >
          <SelectTrigger
              class="h-11 rounded-full border-border/70 px-4 text-sm"
              :aria-label="filter.label"
          >
            <SelectValue :placeholder="filter.placeholder ?? filter.label" />
          </SelectTrigger>
          <SelectContent class="rounded-2xl">
            <SelectItem value="search">{{ filter.placeholder ?? filter.label }}</SelectItem>
            <SelectItem
                v-for="option in filter.options"
                :key="String(option.value)"
                :value="String(option.value)"
            >
              {{ option.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Custom filters -->
      <slot name="filters" />
    </template>

    <!-- Search action -->
<!--    <Button-->
<!--        v-if="!hideSearch"-->
<!--        type="button"-->
<!--        class="h-11 gap-2 rounded-full px-6"-->
<!--        :disabled="loading"-->
<!--        @click="submitSearch"-->
<!--    >-->
<!--      <Search class="size-4" aria-hidden="true" />-->
<!--      <span>Search</span>-->
<!--    </Button>-->

    <!-- Reset -->
    <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Reset filters"
        class="size-11 rounded-full border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
        @click="emit('reset')"
    >
      <RotateCcw class="size-4" aria-hidden="true" />
    </Button>

    <div class="ms-auto flex items-center gap-3">
      <slot name="toolbar-actions" />

      <Button
          v-if="!hideExport"
          type="button"
          variant="outline"
          class="h-11 gap-2 rounded-full px-5"
          @click="emit('export')"
      >
        <Upload class="size-4" aria-hidden="true" />
        <span>Export</span>
      </Button>
    </div>
  </div>
</template>

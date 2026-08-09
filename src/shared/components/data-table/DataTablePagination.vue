<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { Button } from '@ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/select'

const props = withDefaults(
    defineProps<{
      page: number
      pageCount: number
      pageSize: number
      total: number
      pageSizeOptions?: number[]
      siblingCount?: number
    }>(),
    {
      pageSizeOptions: () => [10, 25, 50, 100],
      siblingCount: 1,
    },
)

const emit = defineEmits<{
  'update:page': [value: number]
  'update:pageSize': [value: number]
}>()

type PageItem = number | 'gap-start' | 'gap-end'

const pageItems = computed<PageItem[]>(() => {
  const { page, pageCount, siblingCount } = props
  const maxVisible = siblingCount * 2 + 5

  if (pageCount <= maxVisible) {
    return Array.from({ length: pageCount }, (_, index) => index + 1)
  }

  const left = Math.max(page - siblingCount, 1)
  const right = Math.min(page + siblingCount, pageCount)
  const showLeftGap = left > 3
  const showRightGap = right < pageCount - 2

  const items: PageItem[] = [1]
  if (showLeftGap) items.push('gap-start')

  const start = showLeftGap ? left : 2
  const end = showRightGap ? right : pageCount - 1
  for (let index = start; index <= end; index += 1) items.push(index)

  if (showRightGap) items.push('gap-end')
  items.push(pageCount)

  return items
})

function goTo(value: number): void {
  const next = Math.min(Math.max(1, value), props.pageCount)
  if (next !== props.page) emit('update:page', next)
}
</script>

<template>
  <div
      class="flex flex-wrap items-center justify-between gap-4 rounded-b-2xl border-t border-border/60 bg-background px-4 py-3"
  >
    <div class="flex items-center gap-3">
      <Select
          :model-value="String(pageSize)"
          @update:model-value="(value: unknown) => emit('update:pageSize', Number(value))"
      >
        <SelectTrigger class="h-10 w-[130px] rounded-full border-border/70 px-4 text-sm" aria-label="Rows per page">
          <SelectValue placeholder="No. of items" />
        </SelectTrigger>
        <SelectContent class="rounded-2xl">
          <SelectItem v-for="option in pageSizeOptions" :key="option" :value="String(option)">
            {{ option }}
          </SelectItem>
        </SelectContent>
      </Select>

      <p class="hidden text-sm text-muted-foreground sm:block">
        {{ total }} records
      </p>
    </div>

    <nav class="flex items-center gap-1" aria-label="Pagination">
      <Button
          type="button"
          variant="ghost"
          size="icon"
          class="size-9 rounded-full"
          aria-label="Previous page"
          :disabled="page <= 1"
          @click="goTo(page - 1)"
      >
        <ChevronLeft class="size-4 rtl:rotate-180" aria-hidden="true" />
      </Button>

      <template v-for="(item, index) in pageItems" :key="`${item}-${index}`">
        <span
            v-if="item === 'gap-start' || item === 'gap-end'"
            class="px-1 text-sm text-muted-foreground"
            aria-hidden="true"
        >
          …
        </span>
        <Button
            v-else
            type="button"
            :variant="item === page ? 'default' : 'ghost'"
            size="icon"
            class="size-9 rounded-full text-sm font-medium"
            :class="item === page ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'text-foreground'"
            :aria-label="`Page ${item}`"
            :aria-current="item === page ? 'page' : undefined"
            @click="goTo(item)"
        >
          {{ item }}
        </Button>
      </template>

      <Button
          type="button"
          variant="ghost"
          size="icon"
          class="size-9 rounded-full"
          aria-label="Next page"
          :disabled="page >= pageCount"
          @click="goTo(page + 1)"
      >
        <ChevronRight class="size-4 rtl:rotate-180" aria-hidden="true" />
      </Button>
    </nav>
  </div>
</template>

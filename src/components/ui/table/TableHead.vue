<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <th
    data-slot="table-head"
    :class="cn('h-[56px] px-4 text-center align-middle text-sm font-semibold text-foreground whitespace-nowrap [&:has([role=checkbox])]:w-14 [&:has([role=checkbox])]:pr-4 *:[[role=checkbox]]:translate-y-0.5', props.class)"
  >
    <slot />
  </th>
</template>

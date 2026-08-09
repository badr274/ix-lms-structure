<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <tr
    data-slot="table-row"
    :class="cn('h-[72px] border-b border-border/50 transition-colors last:border-b-0 hover:bg-muted/50 data-[state=selected]:bg-muted', props.class)"
  >
    <slot />
  </tr>
</template>

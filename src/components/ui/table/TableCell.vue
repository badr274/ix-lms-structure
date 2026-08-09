<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <td
    data-slot="table-cell"
    :class="
      cn(
        'px-4 text-center align-middle text-sm text-foreground whitespace-nowrap [&:has([role=checkbox])]:w-14 [&:has([role=checkbox])]:pr-4 *:[[role=checkbox]]:translate-y-0.5',
        props.class,
      )
    "
  >
    <slot />
  </td>
</template>

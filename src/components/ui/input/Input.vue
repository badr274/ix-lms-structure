<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { useVModel } from "@vueuse/core"
import { cn } from "@/lib/utils"

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes["class"]
}>()

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void
}>()

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue,
})
</script>

<template>
  <input
    v-model="modelValue"
    data-slot="input"
    :class="cn(
      'h-[50px] w-full min-w-0 rounded-[24px] border border-border bg-background px-4 py-2 font-ibm text-[14px] text-foreground placeholder:text-muted-foreground/60 placeholder:font-ibm shadow-none transition-all duration-150 outline-none',
      'focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 hover:border-border/80',
      'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/40',
      'aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 aria-invalid:bg-destructive/5',
      props.class,
    )"
  >
</template>

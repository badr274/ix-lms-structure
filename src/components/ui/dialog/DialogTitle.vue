<script setup lang="ts">
import type { DialogTitleProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { DialogTitle, useForwardProps } from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<DialogTitleProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = reactiveOmit(props, "class")

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <DialogTitle
    data-slot="dialog-title"
    v-bind="forwardedProps"
    :class="cn('font-zain font-bold text-[20px] sm:text-[22px] text-foreground flex items-center gap-3 leading-none', props.class)"
  >
    <span class="w-1.5 h-6 rounded-full bg-primary shrink-0" />
    <span><slot /></span>
  </DialogTitle>
</template>

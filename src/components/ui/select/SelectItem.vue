<script setup lang="ts">
import type { SelectItemProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { Check } from "@lucide/vue"
import { reactiveOmit } from "@vueuse/core"
import {
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  useForwardProps,
} from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<SelectItemProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = reactiveOmit(props, "class")

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <SelectItem
    data-slot="select-item"
    v-bind="forwardedProps"
    :class="
      cn(
        `focus:bg-primary/10 focus:text-primary [&_svg:not([class*='text-'])]:text-primary relative flex w-full cursor-pointer items-center gap-2 rounded-xl py-2 px-3 text-[13px] font-ibm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2`,
        props.class,
      )
    "
  >
    <SelectItemText class="flex-1">
      <slot />
    </SelectItemText>

    <span class="flex size-4 items-center justify-center ms-2">
      <SelectItemIndicator>
        <slot name="indicator-icon">
          <Check class="size-4 text-primary" />
        </slot>
      </SelectItemIndicator>
    </span>
  </SelectItem>
</template>

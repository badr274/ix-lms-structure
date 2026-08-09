<script setup lang="ts">
import { computed } from 'vue'
import type { Component, HTMLAttributes } from 'vue'
import { Ellipsis, Eye } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const iconRegistry = {
  eye: Eye,
  ellipsis: Ellipsis,
} satisfies Record<string, Component>

export type AppIconName = keyof typeof iconRegistry

interface Props {
  icon: AppIconName
  label: string
  type?: 'button' | 'submit' | 'reset'
  tone?: 'primary' | 'muted'
  size?: 'sm' | 'md'
  disabled?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  tone: 'primary',
  size: 'md',
  disabled: false,
})

const iconComponent = computed(() => iconRegistry[props.icon])
</script>

<template>
  <button
      :type="type"
      :aria-label="label"
      :title="label"
      :disabled="disabled"
      :class="cn(
        'inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
        size === 'sm' ? 'size-4' : 'size-5',
        tone === 'primary'
          ? 'text-primary hover:text-primary/80'
          : 'text-muted-foreground hover:text-foreground',
        props.class,
      )"
  >
    <component :is="iconComponent" class="size-full" aria-hidden="true" />
  </button>
</template>

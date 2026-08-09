<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { IconChevronDown, IconBranches } from '@shared/components/icons';

interface Props {
  collapsed?: boolean;
}
withDefaults(defineProps<Props>(), {
  collapsed: false,
});

const { t } = useI18n();

const branches = [
  { id: '1', name: 'IX Training Center' },
  { id: '2', name: 'Cairo Main Campus' },
  { id: '3', name: 'Riyadh Digital Academy' },
  { id: '4', name: 'Dubai Innovation Hub' },
];

const selectedBranch = ref(branches[0]);
const isOpen = ref(false);

function selectBranch(branch: (typeof branches)[0]) {
  selectedBranch.value = branch;
  isOpen.value = false;
}
</script>

<template>
  <div class="relative w-full">
    <!-- Collapsed Icon Trigger -->
    <button
      v-if="collapsed"
      type="button"
      @click="isOpen = !isOpen"
      class="flex size-11 mx-auto items-center justify-center rounded-xl bg-sidebar-accent text-sidebar-foreground transition-all hover:bg-sidebar-foreground/20 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      :title="`Current Branch: ${selectedBranch.name}`"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
    >
      <IconBranches :size="20" />
    </button>

    <!-- Expanded Full Card Trigger -->
    <button
      v-else
      type="button"
      @click="isOpen = !isOpen"
      class="flex w-full flex-col gap-1 rounded-lg bg-sidebar-accent p-3 text-start transition-all hover:bg-sidebar-foreground/15 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
    >
      <span class="font-ibm text-[12px] font-normal text-sidebar-foreground/80 leading-[1.4]">
        {{ t('nav.branch') }}
      </span>
      <div class="flex w-full items-center justify-between">
        <span class="font-ibm text-[14px] font-medium text-sidebar-foreground leading-[1.4] truncate">
          {{ selectedBranch.name }}
        </span>
        <IconChevronDown
          :size="16"
          :class="`shrink-0 text-sidebar-foreground/90 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`"
        />
      </div>
    </button>

    <!-- Branch Picker Dropdown Popup -->
    <div
      v-if="isOpen"
      @click.outside="isOpen = false"
      :class="[
        'absolute bottom-full mb-2 border border-sidebar-border bg-sidebar p-1 shadow-2xl z-50 rounded-xl animate-in fade-in zoom-in-95 duration-150',
        collapsed ? 'start-0 w-56' : 'start-0 w-full',
      ]"
      role="listbox"
    >
      <div class="px-2.5 py-1.5 text-[11px] font-semibold text-sidebar-muted uppercase tracking-wider">
        {{ t('nav.selectBranch') }}
      </div>
      <button
        v-for="branch in branches"
        :key="branch.id"
        type="button"
        @click="selectBranch(branch)"
        :class="[
          'flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-start text-xs transition-colors cursor-pointer',
          selectedBranch.id === branch.id
            ? 'bg-primary text-primary-foreground font-semibold'
            : 'text-sidebar-foreground hover:bg-sidebar-accent',
        ]"
        role="option"
        :aria-selected="selectedBranch.id === branch.id"
      >
        <span>{{ branch.name }}</span>
        <span v-if="selectedBranch.id === branch.id">✓</span>
      </button>
    </div>
  </div>
</template>

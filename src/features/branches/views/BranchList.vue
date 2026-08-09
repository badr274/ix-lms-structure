<script setup lang="ts">
import { ref } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { FilterDefinition } from '@shared/types/main-table-types'
import AppDataTable from '@shared/components/data-table/AppDataTable.vue'
import { Badge } from '@/components/ui/badge'

export interface Branch {
  id: number
  branch_id: string
  name: string
  address: string
  status: 'active' | 'deactive'
}

import { AppIconButton } from '@shared/components/buttons'
const branchColumns: ColumnDef<Branch>[] = [
  {
    id: 'branch_id',
    accessorKey: 'branch_id',
    header: 'Branch ID',
    enableSorting: true,
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Branch Name',
    enableSorting: true,
  },
  {
    id: 'address',
    accessorKey: 'address',
    header: 'Branch Address',
    enableSorting: false,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    enableSorting: true,
  },
  {
    id: 'actions',
    header: 'Actions',
    enableSorting: false,
    cell: () => null, // rendered through the #cell-actions slot
  },
]
const branchFilters: FilterDefinition[] = [
  {
    id: 'status',
    label: 'Status',
    placeholder: 'Filter By Status …',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Deactive', value: 'deactive' },
    ],
  },
]
/** No request is made: search, filter, sort and pagination all run locally. */
const branches = ref<Branch[]>([
  { id: 1, branch_id: '2568713', name: 'IX Training Center', address: '74C Aaliyah River, Bayerhaven', status: 'active' },
  { id: 2, branch_id: '2568714', name: 'IX Training Center', address: '3 Bauch Nook, Howefort', status: 'active' },
  { id: 3, branch_id: '2568715', name: 'IX Training Center', address: '0 / 77 Purdy Crescent, West Arthur', status: 'active' },
  { id: 4, branch_id: '2568716', name: 'IX Training Center', address: 'Level 5 05 Favian Parkway, East Macie', status: 'active' },
  { id: 5, branch_id: '2568717', name: 'IX Training Center', address: '09 Arnulfo Crossing, Botsfordborough', status: 'active' },
  { id: 6, branch_id: '2568718', name: 'IX Training Center', address: '3 / 621 Juvenal Ridge, Port Vestachester', status: 'deactive' },
  { id: 7, branch_id: '2568719', name: 'IX Training Center', address: 'Suite 756 031 Ines Riverway, Rhiannonchester', status: 'deactive' },
  { id: 8, branch_id: '2568720', name: 'IX Training Center', address: 'Suite 756 031 Ines Riverway, Rhiannonchester', status: 'deactive' },
])
</script>

<template>
  <AppDataTable
      :table-data="branches"
      :columns="branchColumns"
      :filters="branchFilters"
      title="Branches List"
      description="Track and manage all branches"
      search-placeholder="Search in branches …"
      :searchable-keys="['branch_id', 'name', 'address', 'status']"
      :initial-page-size="5"
      :page-size-options="[5, 10, 25]"
      hide-export
    >
    <template #cell-status="{ row }">
      <Badge
          class="rounded-full px-4 py-1 text-xs font-medium"
          :class="
            (row as Branch).status === 'active'
              ? 'bg-primary/10 text-primary hover:bg-primary/10'
              : 'bg-muted text-muted-foreground hover:bg-muted'
          "
      >
        {{ (row as Branch).status === 'active' ? 'Active' : 'Deactive' }}
      </Badge>
    </template>
    <template #cell-actions="{ row }">
      <div class="mx-auto inline-flex h-8 items-center rounded-full border border-border bg-background px-4">
        <AppIconButton icon="eye" :label="`View ${row.name}`" />

        <span class="mx-2 h-4 w-px bg-border" aria-hidden="true" />

        <AppIconButton
            icon="ellipsis"
            tone="muted"
            :label="`More actions for ${row.name}`"
        />
      </div>
    </template>
  </AppDataTable>
</template>


<style scoped>

</style>

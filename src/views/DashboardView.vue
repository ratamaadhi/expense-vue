<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import SectionCards from '@/components/SectionCards.vue'
import DataTable from '@/components/DataTable.vue'

const appStore = useAppStore()

onMounted(async () => {
  await appStore.initialize()
  await appStore.fetchTransactions()
})
</script>

<template>
  <div class="flex flex-1 flex-col">
    <div class="@container/main flex flex-1 flex-col gap-2">
      <div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards />
        <div class="px-4 lg:px-6">
          <DataTable />
        </div>
      </div>
    </div>
  </div>
</template>

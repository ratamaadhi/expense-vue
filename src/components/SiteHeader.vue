<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import ThemeToggle from '@/components/ThemeToggle.vue'
import AddTransactionDialog from '@/components/AddTransactionDialog.vue'

const route = useRoute()

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/': 'Dashboard',
    '/transactions': 'Transactions',
    '/categories': 'Categories',
    '/budgets': 'Budgets',
  }
  return titles[route.path] || 'Expense Tracker'
})

const showAddButton = computed(() => {
  return route.path === '/' || route.path === '/transactions'
})
</script>

<template>
  <header class="flex h-16 shrink-0 items-center gap-2 border-b bg-card px-4">
    <SidebarTrigger class="-ml-1" />
    <Separator orientation="vertical" class="mr-2 h-4" />
    <div class="flex flex-1 items-center gap-2">
      <h1 class="font-semibold">{{ pageTitle }}</h1>
    </div>
    <div class="flex items-center gap-2">
      <ThemeToggle />
      <AddTransactionDialog v-if="showAddButton" size="sm" />
    </div>
  </header>
</template>

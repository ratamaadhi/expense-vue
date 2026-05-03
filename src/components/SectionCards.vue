<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Wallet, Wallet as BudgetIcon } from 'lucide-vue-next'

const appStore = useAppStore()

const income = computed(() => appStore.totalIncome)
const expenses = computed(() => appStore.totalExpense)
const balance = computed(() => appStore.netBalance)
const categoriesCount = computed(() => appStore.categories.length)
const budgetsCount = computed(() => appStore.budgets.length)
const overBudgetCount = computed(() =>
  appStore.budgets.filter((b) => b.utilizationPercentage > 100).length
)

function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
  return formatted.replace('Rp', 'Rp ')
}

const balanceColor = computed(() => balance.value >= 0 ? 'var(--chart-3)' : 'var(--chart-1)')
const balanceBgColor = computed(() => balance.value >= 0 ? 'var(--muted)' : 'var(--destructive)')
const balanceIconColor = computed(() => balance.value >= 0 ? 'var(--chart-3)' : 'var(--chart-1)')
</script>

<template>
  <div class="grid grid-cols-1 gap-4 px-4 lg:px-6 sm:grid-cols-2 lg:grid-cols-4">
    <!-- Total Income -->
    <Card>
      <CardHeader class="flex flex-row items-center justify-between pb-4">
        <div class="flex flex-col gap-1">
          <CardDescription class="text-muted-foreground">Total Income</CardDescription>
          <CardTitle class="text-2xl font-semibold" style="color: var(--chart-3)">
            {{ formatCurrency(income) }}
          </CardTitle>
        </div>
        <div class="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
          <TrendingUp class="w-5 h-5" style="color: var(--chart-3)" />
        </div>
      </CardHeader>
    </Card>

    <!-- Total Expenses -->
    <Card>
      <CardHeader class="flex flex-row items-center justify-between pb-4">
        <div class="flex flex-col gap-1">
          <CardDescription class="text-muted-foreground">Total Expenses</CardDescription>
          <CardTitle class="text-2xl font-semibold" style="color: var(--chart-1)">
            {{ formatCurrency(expenses) }}
          </CardTitle>
        </div>
        <div class="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
          <TrendingDown class="w-5 h-5" style="color: var(--chart-1)" />
        </div>
      </CardHeader>
    </Card>

    <!-- Net Balance -->
    <Card>
      <CardHeader class="flex flex-row items-center justify-between pb-4">
        <div class="flex flex-col gap-1">
          <CardDescription class="text-muted-foreground">Net Balance</CardDescription>
          <CardTitle class="text-2xl font-semibold" :style="{ color: balanceColor }">
            {{ formatCurrency(balance) }}
          </CardTitle>
        </div>
        <div
          class="w-10 h-10 rounded-lg flex items-center justify-center"
          :style="{ backgroundColor: balanceBgColor }"
        >
          <Wallet class="w-5 h-5" :style="{ color: balanceIconColor }" />
        </div>
      </CardHeader>
    </Card>

    <!-- Categories & Budgets -->
    <Card>
      <CardHeader class="flex flex-row items-center justify-between pb-4">
        <div class="flex flex-col gap-1">
          <CardDescription class="text-muted-foreground">Categories & Budgets</CardDescription>
          <CardTitle class="text-2xl font-semibold">
            {{ categoriesCount }} / {{ budgetsCount }}
          </CardTitle>
        </div>
        <div class="flex gap-2">
          <div class="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <CategoryIcon class="w-5 h-5" style="color: var(--primary)" />
          </div>
          <div
            v-if="overBudgetCount > 0"
            class="w-10 h-10 rounded-lg flex items-center justify-center relative"
            style="background-color: var(--muted)"
          >
            <BudgetIcon class="w-5 h-5" style="color: var(--chart-5)" />
            <Badge
              variant="destructive"
              class="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {{ overBudgetCount }}
            </Badge>
          </div>
        </div>
      </CardHeader>
    </Card>
  </div>
</template>

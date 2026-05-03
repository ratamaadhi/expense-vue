<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trash2, Eye } from 'lucide-vue-next'
import { format } from 'date-fns'

const appStore = useAppStore()

const recentTransactions = computed(() => {
  return appStore.transactions.slice(0, 15)
})

function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
  return formatted.replace('Rp', 'Rp ')
}

function formatDate(dateStr: string): string {
  return format(new Date(dateStr), 'MMM d, yyyy')
}

async function handleDelete(id: string) {
  if (confirm('Are you sure you want to delete this transaction?')) {
    await appStore.deleteTransaction(id)
  }
}
</script>

<template>
  <Card>
    <CardContent class="p-6">
      <div class="mb-4">
        <h2 class="text-lg font-semibold">Recent Activity</h2>
        <p class="text-sm text-muted-foreground">Your latest financial transactions</p>
      </div>

      <div v-if="appStore.loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2" style="border-color: var(--primary)"></div>
      </div>

      <div v-else-if="recentTransactions.length === 0" class="py-12 text-center text-muted-foreground">
        <p>No transactions recorded yet.</p>
        <RouterLink to="/transactions">
          <Button class="mt-4" size="sm">
            Record Transaction
          </Button>
        </RouterLink>
      </div>

      <div v-else class="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead class="text-right">Amount</TableHead>
              <TableHead class="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="transaction in recentTransactions"
              :key="transaction.id"
              class="hover:bg-muted/50 cursor-pointer"
            >
              <TableCell class="text-muted-foreground">
                {{ formatDate(transaction.occurredAt) }}
              </TableCell>
              <TableCell class="font-medium">
                {{ transaction.description || transaction.category?.name || 'Transaction' }}
              </TableCell>
              <TableCell>
                <div class="flex items-center gap-2">
                  <div
                    class="w-3 h-3 rounded-full"
                    :style="{ backgroundColor: transaction.category?.color || 'var(--border)' }"
                  ></div>
                  <span>{{ transaction.category?.name || 'Uncategorized' }}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  :variant="transaction.type === 'income' ? 'default' : 'secondary'"
                  :class="cn(
                    'font-semibold',
                    transaction.type === 'income'
                      ? 'bg-muted text-foreground'
                      : 'bg-destructive/10 text-destructive'
                  )"
                >
                  {{ transaction.type }}
                </Badge>
              </TableCell>
              <TableCell class="text-right">
                <span
                  :class="cn(
                    'font-semibold',
                    transaction.type === 'income'
                      ? 'text-[color:var(--chart-3)]'
                      : 'text-[color:var(--chart-1)]'
                  )"
                >
                  {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(Number(transaction.amount)) }}
                </span>
              </TableCell>
              <TableCell>
                <div class="flex gap-1">
                  <RouterLink :to="`/transactions`">
                    <Button
                      variant="ghost"
                      size="icon"
                      class="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Eye class="w-4 h-4" />
                    </Button>
                  </RouterLink>
                  <Button
                    variant="ghost"
                    size="icon"
                    @click="handleDelete(transaction.id)"
                    class="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 class="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div class="mt-4 flex justify-center">
        <RouterLink to="/transactions">
          <Button variant="outline" size="sm">
            View All Transactions
          </Button>
        </RouterLink>
      </div>
    </CardContent>
  </Card>
</template>

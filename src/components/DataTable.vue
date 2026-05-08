<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import TransactionTable from '@/components/TransactionTable.vue'

const appStore = useAppStore()

const recentTransactions = computed(() => {
  return appStore.transactions.slice(0, 15)
})

function handleDelete(id: string) {
  if (confirm('Are you sure you want to delete this transaction?')) {
    appStore.deleteTransaction(id)
  }
}

function handleEdit(transaction: any) {
  // Navigate to transactions page for editing
  // Edit dialog will be handled by TransactionsView component
  console.log('Navigate to edit transaction:', transaction.id)
}
</script>

<template>
  <Card>
    <CardContent class="p-6">
      <div class="mb-4">
        <h2 class="text-lg font-semibold">Recent Activity</h2>
        <p class="text-sm text-muted-foreground">Your latest financial transactions</p>
      </div>

      <div v-if="recentTransactions.length === 0" class="py-12 text-center text-muted-foreground">
        <p>No transactions recorded yet.</p>
        <RouterLink to="/transactions">
          <Button class="mt-4" size="sm">
            Record Transaction
          </Button>
        </RouterLink>
      </div>

      <TransactionTable
        v-else
        :data="recentTransactions"
        :categories="appStore.categories"
        :loading="appStore.loading"
        :on-edit="handleEdit"
        :on-delete="handleDelete"
      />

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

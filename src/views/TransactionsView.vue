<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useAppStore } from "@/stores/app";
import AddTransactionDialog from "@/components/AddTransactionDialog.vue";
import EditTransactionDialog from "@/components/EditTransactionDialog.vue";
import TransactionTable from "@/components/TransactionTable.vue";
import type { Transaction } from "@/types";
import type { DateRange } from "reka-ui";
import { getLocalTimeZone } from "@internationalized/date";

const appStore = useAppStore();
const filterType = ref<"all" | "income" | "expense">("all");
const filterCategory = ref<string>("all");
const filterDateRange = ref<DateRange>();
const editingTransaction = ref<Transaction>();
const showEditDialog = ref(false);

async function handleDelete(id: string) {
  if (confirm("Are you sure you want to delete this transaction?")) {
    await appStore.deleteTransaction(id);
  }
}

function handleEdit(transaction: Transaction) {
  editingTransaction.value = transaction;
  showEditDialog.value = true;
}

async function fetchFilteredTransactions() {
  const from = filterDateRange.value?.start
    ? filterDateRange.value.start.toDate(getLocalTimeZone()).toISOString().slice(0, 10)
    : undefined;
  const to = filterDateRange.value?.end
    ? filterDateRange.value.end.toDate(getLocalTimeZone()).toISOString().slice(0, 10)
    : undefined;

  await appStore.fetchTransactions({
    type: filterType.value === "all" ? undefined : filterType.value,
    categoryId: filterCategory.value === "all" ? undefined : filterCategory.value,
    from,
    to,
  });
}

// Watch filter changes and refetch
watch([filterType, filterCategory, filterDateRange], () => {
  fetchFilteredTransactions();
});

onMounted(() => {
  fetchFilteredTransactions();
});
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-6 py-6 px-4 xl:px-0">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Transactions</h1>
        <p class="text-muted-foreground mt-1">Track and manage all your financial transactions</p>
      </div>
      <AddTransactionDialog />
    </div>

    <Card>
      <CardContent class="pt-6">
        <TransactionTable
          :data="appStore.transactions"
          :categories="appStore.categories"
          :loading="appStore.loading"
          :on-edit="handleEdit"
          :on-delete="handleDelete"
          v-model:filter-type="filterType"
          v-model:filter-category="filterCategory"
          v-model:filter-date-range="filterDateRange"
        />
      </CardContent>
    </Card>

    <EditTransactionDialog
      v-model:open="showEditDialog"
      :transaction="editingTransaction"
    />
  </div>
</template>

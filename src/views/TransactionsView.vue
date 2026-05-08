<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useAppStore } from "@/stores/app";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Loader2, Pencil, Search } from "lucide-vue-next";
import { format } from "date-fns";
import AddTransactionDialog from "@/components/AddTransactionDialog.vue";
import EditTransactionDialog from "@/components/EditTransactionDialog.vue";
import { Input } from "@/components/ui/input";
import DatePickerWithRange from "@/components/ui/DatePickerWithRange.vue";
import type { Transaction } from "@/types";
import type { DateRange } from "reka-ui";

const appStore = useAppStore();
const filterType = ref<"all" | "income" | "expense">("all");
const filterCategory = ref<string>("all");
const filterSearch = ref<string>("");
const filterDateRange = ref<DateRange>();
const editingTransaction = ref<Transaction>();
const showEditDialog = ref(false);

const filteredTransactions = computed(() => {
  let result = [...appStore.transactions];
  if (filterType.value !== "all") {
    result = result.filter((t) => t.type === filterType.value);
  }
  if (filterCategory.value !== "all") {
    result = result.filter((t) => t.categoryId === filterCategory.value);
  }
  if (filterSearch.value) {
    const search = filterSearch.value.toLowerCase();
    result = result.filter((t) =>
      t.description?.toLowerCase().includes(search) ||
      t.category?.name.toLowerCase().includes(search)
    );
  }
  if (filterDateRange.value?.start) {
    const fromDate = filterDateRange.value.start.toDate(getLocalTimeZone());
    result = result.filter((t) => new Date(t.occurredAt) >= fromDate);
  }
  if (filterDateRange.value?.end) {
    const toDate = new Date(filterDateRange.value.end.toDate(getLocalTimeZone()));
    toDate.setHours(23, 59, 59, 999);
    result = result.filter((t) => new Date(t.occurredAt) <= toDate);
  }
  return result;
});

function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
  return formatted.replace("Rp", "Rp ");
}

function formatDate(dateStr: string): string {
  return format(new Date(dateStr), "MMM d, yyyy");
}

async function handleDelete(id: string) {
  if (confirm("Are you sure you want to delete this transaction?")) {
    await appStore.deleteTransaction(id);
  }
}

function handleEdit(transaction: Transaction) {
  editingTransaction.value = transaction;
  showEditDialog.value = true;
}

function getLocalTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
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
        <div class="flex flex-wrap gap-4 mb-6">
          <Select v-model="filterType">
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
          <Select v-model="filterCategory">
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem v-for="cat in appStore.categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </SelectItem>
            </SelectContent>
          </Select>
          <div class="relative flex-1 min-w-[200px]">
            <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              v-model="filterSearch"
              type="text"
              placeholder="Search transactions..."
              class="pl-9"
            />
            <Button
              v-if="filterSearch"
              variant="ghost"
              size="icon"
              class="absolute right-1 top-1 h-7 w-7 px-0"
              @click="filterSearch = ''"
            >
              <X class="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div class="flex flex-wrap gap-4 mb-6">
          <DatePickerWithRange v-model="filterDateRange" placeholder="Filter by date range" />
        </div>

        <div v-if="appStore.loading" class="flex items-center justify-center py-12">
          <Loader2 class="w-8 h-8 animate-spin text-muted-foreground" />
        </div>

        <Table v-else>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead class="text-right">Amount</TableHead>
              <TableHead class="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-if="filteredTransactions.length === 0">
              <TableCell colspan="5" class="text-center text-muted-foreground py-8">
                No transactions found.
              </TableCell>
            </TableRow>
            <TableRow v-for="transaction in filteredTransactions" :key="transaction.id">
              <TableCell class="font-medium">
                {{ transaction.description || transaction.category?.name || "Transaction" }}
              </TableCell>
              <TableCell>
                <div class="flex items-center gap-2">
                  <div
                    class="w-3 h-3 rounded-full"
                    :style="{ backgroundColor: transaction.category?.color || '#94A3B8' }"
                  ></div>
                  <span>{{ transaction.category?.name || "Uncategorized" }}</span>
                </div>
              </TableCell>
              <TableCell>
                {{ formatDate(transaction.occurredAt) }}
              </TableCell>
              <TableCell class="text-right">
                <Badge
                  :variant="transaction.type === 'income' ? 'default' : 'secondary'"
                  :class="
                    cn(
                      'font-semibold',
                      transaction.type === 'income'
                        ? 'bg-muted text-foreground'
                        : 'bg-destructive/10 text-destructive',
                    )
                  "
                >
                  {{ transaction.type === "income" ? "+" : "-"
                  }}{{ formatCurrency(Number(transaction.amount)) }}
                </Badge>
              </TableCell>
              <TableCell>
                <div class="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    @click="handleEdit(transaction)"
                    class="text-muted-foreground hover:text-foreground"
                  >
                    <Pencil class="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    @click="handleDelete(transaction.id)"
                    class="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 class="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <EditTransactionDialog
      v-model:open="showEditDialog"
      :transaction="editingTransaction"
    />
  </div>
</template>

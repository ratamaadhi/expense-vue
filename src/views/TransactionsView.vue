<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAppStore } from "@/stores/app";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Loader2 } from "lucide-vue-next";
import { format } from "date-fns";

const appStore = useAppStore();
const showAddModal = ref(false);
const filterType = ref<"all" | "income" | "expense">("all");
const filterCategory = ref<string>("all");

const newTransaction = ref({
  type: "expense" as "income" | "expense",
  amount: "",
  description: "",
  categoryId: "",
  occurredAt: new Date().toISOString().slice(0, 16),
});

const filteredTransactions = computed(() => {
  let result = [...appStore.transactions];
  if (filterType.value !== "all") {
    result = result.filter((t) => t.type === filterType.value);
  }
  if (filterCategory.value !== "all") {
    result = result.filter((t) => t.categoryId === filterCategory.value);
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

async function handleSubmit() {
  try {
    await appStore.createTransaction({
      type: newTransaction.value.type,
      amount: Number(newTransaction.value.amount),
      description: newTransaction.value.description || undefined,
      categoryId: newTransaction.value.categoryId,
      occurredAt: new Date(newTransaction.value.occurredAt).toISOString(),
    });
    showAddModal.value = false;
    newTransaction.value = {
      type: "expense",
      amount: "",
      description: "",
      categoryId: "",
      occurredAt: new Date().toISOString().slice(0, 16),
    };
  } catch (e) {
    console.error(e);
  }
}

async function handleDelete(id: string) {
  if (confirm("Are you sure you want to delete this transaction?")) {
    await appStore.deleteTransaction(id);
  }
}

onMounted(() => {
  appStore.fetchTransactions();
});
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-6 py-6 px-4 xl:px-0">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Transactions</h1>
        <p class="text-muted-foreground mt-1">Track and manage all your financial transactions</p>
      </div>
      <Dialog v-model:open="showAddModal">
        <DialogTrigger as-child>
          <Button>
            <Plus class="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
            <DialogDescription>Create a new income or expense record</DialogDescription>
          </DialogHeader>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid gap-2">
              <Label for="type">Type</Label>
              <Select v-model="newTransaction.type">
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="grid gap-2">
              <Label for="amount">Amount</Label>
              <Input
                id="amount"
                v-model.number="newTransaction.amount"
                type="number"
                step="0.01"
                required
                placeholder="0.00"
              />
            </div>
            <div class="grid gap-2">
              <Label for="category">Category</Label>
              <Select v-model="newTransaction.categoryId" required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="cat in appStore.categories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="grid gap-2">
              <Label for="description">Description</Label>
              <Input
                id="description"
                v-model="newTransaction.description"
                type="text"
                placeholder="Optional description"
              />
            </div>
            <div class="grid gap-2">
              <Label for="date">Date</Label>
              <Input id="date" v-model="newTransaction.occurredAt" type="datetime-local" required />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" @click="showAddModal = false">
                Cancel
              </Button>
              <Button type="submit"> Add Transaction </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>

    <Card>
      <CardContent class="pt-6">
        <div class="flex gap-4 mb-6">
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
              <TableHead class="w-[50px]"></TableHead>
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
                <Button
                  variant="ghost"
                  size="icon"
                  @click="handleDelete(transaction.id)"
                  class="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 class="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>

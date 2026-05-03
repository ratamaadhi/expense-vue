<script setup lang="ts">
import { ref, onMounted } from "vue";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Loader2, Wallet } from "lucide-vue-next";

const appStore = useAppStore();
const showAddModal = ref(false);
const editingBudget = ref<string | null>(null);

const newBudget = ref({
  categoryId: "",
  amount: "",
  period: "monthly" as "monthly" | "yearly",
});

const editingData = ref({
  amount: "",
  period: "monthly" as "monthly" | "yearly",
});

function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
  return formatted.replace("Rp", "Rp ");
}

function getBudgetStatus(percentage: number) {
  if (percentage >= 100) return { color: "text-destructive", bar: "bg-destructive" };
  if (percentage >= 80)
    return { color: "text-[color:var(--chart-5)]", bar: "bg-[color:var(--chart-5)]" };
  return { color: "text-[color:var(--chart-3)]", bar: "bg-[color:var(--chart-3)]" };
}

function startEditing(budget: { id: string; amount: string; period: string }) {
  editingBudget.value = budget.id;
  editingData.value = {
    amount: budget.amount,
    period: budget.period as "monthly" | "yearly",
  };
}

async function handleCreate() {
  try {
    await appStore.createBudget({
      categoryId: newBudget.value.categoryId,
      amount: Number(newBudget.value.amount),
      period: newBudget.value.period,
    });
    showAddModal.value = false;
    newBudget.value = { categoryId: "", amount: "", period: "monthly" };
    await appStore.fetchBudgets();
  } catch (e) {
    console.error(e);
  }
}

async function handleUpdate(id: string) {
  try {
    await appStore.updateBudget(id, {
      amount: Number(editingData.value.amount),
      period: editingData.value.period,
    });
    editingBudget.value = null;
    await appStore.fetchBudgets();
  } catch (e) {
    console.error(e);
  }
}

async function handleDelete(id: string) {
  if (confirm("Are you sure you want to delete this budget?")) {
    try {
      await appStore.deleteBudget(id);
      await appStore.fetchBudgets();
    } catch (e) {
      console.error(e);
    }
  }
}

onMounted(async () => {
  await appStore.fetchBudgets();
});
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6 py-6 px-4 xl:px-0">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Budgets</h1>
        <p class="text-muted-foreground mt-1">Set and track spending limits for each category</p>
      </div>
      <Dialog v-model:open="showAddModal">
        <DialogTrigger as-child>
          <Button>
            <Plus class="w-4 h-4 mr-2" />
            Add Budget
          </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Budget</DialogTitle>
            <DialogDescription>Create a budget to track your spending</DialogDescription>
          </DialogHeader>
          <form @submit.prevent="handleCreate" class="space-y-4">
            <div class="grid gap-2">
              <Label for="b-category">Category</Label>
              <Select v-model="newBudget.categoryId" required>
                <SelectTrigger id="b-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="cat in appStore.categories.filter(
                      (category: { id: string }) => !appStore.budgets.some((b) => b.categoryId === category.id),
                    )"
                    :key="cat.id"
                    :value="cat.id"
                  >
                    {{ cat.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="grid gap-2">
              <Label for="b-amount">Amount</Label>
              <Input
                id="b-amount"
                v-model.number="newBudget.amount"
                type="number"
                step="0.01"
                required
                placeholder="Budget amount"
              />
            </div>
            <div class="grid gap-2">
              <Label for="b-period">Period</Label>
              <Select v-model="newBudget.period">
                <SelectTrigger id="b-period">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" @click="showAddModal = false">
                Cancel
              </Button>
              <Button type="submit"> Add Budget </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>

    <div v-if="appStore.loading" class="flex items-center justify-center py-12">
      <Loader2 class="w-8 h-8 animate-spin text-muted-foreground" />
    </div>

    <Card v-else-if="appStore.budgets.length === 0" class="p-12 text-center">
      <Wallet class="w-16 h-16 text-muted-foreground mx-auto mb-4" />
      <h3 class="text-lg font-medium text-foreground mb-2">No budgets yet</h3>
      <p class="text-muted-foreground">Create a budget to track your spending limits</p>
    </Card>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card
        v-for="budget in appStore.budgets"
        :key="budget.id"
        class="hover:shadow-md transition-shadow"
      >
        <CardContent class="p-6">
          <div v-if="editingBudget === budget.id" class="space-y-4">
            <div class="grid gap-2">
              <Label>Amount</Label>
              <Input
                v-model.number="editingData.amount"
                type="number"
                step="0.01"
                placeholder="Budget amount"
              />
            </div>
            <div class="grid gap-2">
              <Label>Period</Label>
              <Select v-model="editingData.period">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                @click="editingBudget = null"
                class="flex-1"
              >
                Cancel
              </Button>
              <Button type="button" size="sm" @click="handleUpdate(budget.id)" class="flex-1">
                Save
              </Button>
            </div>
          </div>
          <div v-else class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center"
                  :style="{ backgroundColor: budget.category?.color || '#94A3B8' }"
                >
                  <Wallet class="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 class="font-medium text-foreground">
                    {{ budget.category?.name || "Unknown" }}
                  </h3>
                  <p class="text-sm text-muted-foreground capitalize">{{ budget.period }}</p>
                </div>
              </div>
              <div class="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  @click="startEditing(budget)"
                  class="text-muted-foreground hover:text-primary hover:bg-primary/10"
                >
                  <Pencil class="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  @click="handleDelete(budget.id)"
                  class="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 class="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-muted-foreground">Spent</span>
                <span class="font-medium"
                  >{{ formatCurrency(Number(budget.spent)) }} /
                  {{ formatCurrency(Number(budget.amount)) }}</span
                >
              </div>
              <Progress
                :value="Math.min(budget.utilizationPercentage, 100)"
                :class="cn('h-2', getBudgetStatus(budget.utilizationPercentage).bar)"
              />
              <div class="flex justify-between text-sm">
                <Badge
                  :class="cn('font-medium', getBudgetStatus(budget.utilizationPercentage).color)"
                  variant="secondary"
                >
                  {{ budget.utilizationPercentage.toFixed(0) }}% used
                </Badge>
                <span class="text-muted-foreground">
                  {{ formatCurrency(Number(budget.remaining)) }} remaining
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

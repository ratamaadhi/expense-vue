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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Loader2, Tag, TrendingUp, TrendingDown } from "lucide-vue-next";

const appStore = useAppStore();
const showAddModal = ref(false);
const editingCategory = ref<string | null>(null);

const categoryBreakdownMap = computed(() => {
  const map = new Map<string, { totalIncome: string; totalExpense: string; netBalance: string }>();
  appStore.categoryBreakdown.forEach((item) => {
    map.set(item.categoryId, {
      totalIncome: item.totalIncome,
      totalExpense: item.totalExpense,
      netBalance: item.netBalance,
    });
  });
  return map;
});

function formatCurrency(amount: string | number): string {
  const numAmount = typeof amount === "string" ? Number(amount) : amount;
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(numAmount);
  return formatted.replace("Rp", "Rp ");
}

const newCategory = ref({
  name: "",
  color: "#3B82F6",
});

const editingData = ref({
  name: "",
  color: "",
});

const colors = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#6366F1",
  "#14B8A6",
  "#A855F7",
  "#22C55E",
  "#EAB308",
  "#64748B",
];

function startEditing(category: { id: string; name: string; color: string | null }) {
  editingCategory.value = category.id;
  editingData.value = {
    name: category.name,
    color: category.color || "#3B82F6",
  };
}

async function handleCreate() {
  try {
    await appStore.createCategory({
      name: newCategory.value.name,
      color: newCategory.value.color,
    });
    showAddModal.value = false;
    newCategory.value = { name: "", color: "#3B82F6" };
  } catch (e) {
    console.error(e);
  }
}

async function handleUpdate(id: string) {
  try {
    await appStore.updateCategory(id, editingData.value);
    editingCategory.value = null;
  } catch (e) {
    console.error(e);
  }
}

async function handleDelete(id: string) {
  if (confirm("Are you sure you want to delete this category?")) {
    try {
      await appStore.deleteCategory(id);
    } catch (e) {
      console.error(e);
    }
  }
}

onMounted(() => {
  appStore.fetchCategories();
  appStore.fetchCategoryBreakdown();
});
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6 py-6 px-4 xl:px-0">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Categories</h1>
        <p class="text-muted-foreground mt-1">Organize your transactions with custom categories</p>
      </div>
      <Dialog v-model:open="showAddModal">
        <DialogTrigger as-child>
          <Button>
            <Plus class="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>Create a category to organize your transactions</DialogDescription>
          </DialogHeader>
          <form @submit.prevent="handleCreate" class="space-y-4">
            <div class="grid gap-2">
              <Label for="name">Name</Label>
              <Input
                id="name"
                v-model="newCategory.name"
                type="text"
                required
                placeholder="Category name"
              />
            </div>
            <div class="grid gap-2">
              <Label>Color</Label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="color in colors"
                  :key="color"
                  type="button"
                  @click="newCategory.color = color"
                  :class="
                    cn(
                      'w-8 h-8 rounded-full transition-transform duration-150',
                      newCategory.color === color
                        ? 'ring-2 ring-offset-2 ring-offset-background ring-muted-foreground scale-110'
                        : '',
                    )
                  "
                  :style="{ backgroundColor: color }"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" @click="showAddModal = false">
                Cancel
              </Button>
              <Button type="submit"> Add Category </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>

    <div v-if="appStore.loading" class="flex items-center justify-center py-12">
      <Loader2 class="w-8 h-8 animate-spin text-muted-foreground" />
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card
        v-for="category in appStore.categories"
        :key="category.id"
        class="hover:shadow-md transition-shadow"
      >
        <CardContent class="p-6">
          <div v-if="editingCategory === category.id" class="space-y-4">
            <div class="grid gap-2">
              <Label>Name</Label>
              <Input v-model="editingData.name" type="text" placeholder="Category name" />
            </div>
            <div class="grid gap-2">
              <Label>Color</Label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="color in colors"
                  :key="color"
                  type="button"
                  @click="editingData.color = color"
                  :class="
                    cn(
                      'w-8 h-8 rounded-full transition-transform duration-150',
                      editingData.color === color
                        ? 'ring-2 ring-offset-2 ring-offset-background ring-muted-foreground scale-110'
                        : '',
                    )
                  "
                  :style="{ backgroundColor: color }"
                />
              </div>
            </div>
            <div class="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                @click="editingCategory = null"
                class="flex-1"
              >
                Cancel
              </Button>
              <Button type="button" size="sm" @click="handleUpdate(category.id)" class="flex-1">
                Save
              </Button>
            </div>
          </div>
          <div v-else class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center"
                  :style="{ backgroundColor: category.color || '#94A3B8' }"
                >
                  <Tag class="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 class="font-medium text-foreground">{{ category.name }}</h3>
                  <p class="text-sm text-muted-foreground">{{ category.color || "Default" }}</p>
                </div>
              </div>
              <div class="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  @click="startEditing(category)"
                  class="text-muted-foreground hover:text-primary hover:bg-primary/10"
                >
                  <Pencil class="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  @click="handleDelete(category.id)"
                  class="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 class="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div
              v-if="categoryBreakdownMap.has(category.id)"
              class="grid grid-cols-3 gap-3 pt-3 border-t"
            >
              <div class="space-y-1">
                <div class="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp class="w-3 h-3 text-green-500" />
                  <span>Income</span>
                </div>
                <p class="text-sm font-medium text-green-600">
                  {{ formatCurrency(categoryBreakdownMap.get(category.id)!.totalIncome) }}
                </p>
              </div>
              <div class="space-y-1">
                <div class="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingDown class="w-3 h-3 text-red-500" />
                  <span>Expense</span>
                </div>
                <p class="text-sm font-medium text-red-600">
                  {{ formatCurrency(categoryBreakdownMap.get(category.id)!.totalExpense) }}
                </p>
              </div>
              <div class="space-y-1">
                <div class="flex items-center gap-1 text-xs text-muted-foreground">
                  <span class="w-3 h-3 rounded-full bg-muted-foreground" />
                  <span>Net</span>
                </div>
                <p
                  class="text-sm font-medium"
                  :class="
                    Number(categoryBreakdownMap.get(category.id)!.netBalance) >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  "
                >
                  {{ formatCurrency(categoryBreakdownMap.get(category.id)!.netBalance) }}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

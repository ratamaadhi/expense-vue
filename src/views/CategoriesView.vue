<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import type { ChartConfig } from "@/components/ui/chart"
import { useAppStore } from "@/stores/app"
import { cn } from "@/lib/utils"
import { Donut } from "@unovis/ts"
import { VisDonut, VisSingleContainer } from "@unovis/vue"
import {
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Tag,
  TrendingUp,
  TrendingDown,
  TrendingUpDown,
  PieChart,
} from "lucide-vue-next"

const appStore = useAppStore()
const showAddModal = ref(false)
const editingCategory = ref<string | null>(null)

const newCategory = ref({
  name: "",
  color: "#3B82F6",
})

const editingData = ref({
  name: "",
  color: "",
})

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
]

function formatCurrency(amount: string | number): string {
  const numAmount = typeof amount === "string" ? Number(amount) : amount
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(numAmount)
  return formatted.replace("Rp", "Rp ")
}

function getCategoryColor(categoryId: string): string {
  const category = appStore.categories.find((c) => c.id === categoryId)
  return category?.color || "#94A3B8"
}

const categoryBreakdownMap = computed(() => {
  const map = new Map<
    string,
    { totalIncome: string; totalExpense: string; netBalance: string }
  >()
  appStore.categoryBreakdown.forEach((item) => {
    map.set(item.categoryId, {
      totalIncome: item.totalIncome,
      totalExpense: item.totalExpense,
      netBalance: item.netBalance,
    })
  })
  return map
})

// --- Chart Data ---
const expenseChartData = computed(() =>
  appStore.categoryBreakdown
    .filter((item) => Number(item.totalExpense) > 0)
    .map((item) => ({
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      amount: Number(item.totalExpense),
      fill: getCategoryColor(item.categoryId),
    })),
)

const incomeChartData = computed(() =>
  appStore.categoryBreakdown
    .filter((item) => Number(item.totalIncome) > 0)
    .map((item) => ({
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      amount: Number(item.totalIncome),
      fill: getCategoryColor(item.categoryId),
    })),
)

type ExpenseData = (typeof expenseChartData.value)[number]
type IncomeData = (typeof incomeChartData.value)[number]

const expenseChartConfig = computed<ChartConfig>(() => {
  const config: ChartConfig = {}
  expenseChartData.value.forEach((item) => {
    config[item.categoryId] = {
      label: item.categoryName,
      color: item.fill,
    }
  })
  return config
})

const incomeChartConfig = computed<ChartConfig>(() => {
  const config: ChartConfig = {}
  incomeChartData.value.forEach((item) => {
    config[item.categoryId] = {
      label: item.categoryName,
      color: item.fill,
    }
  })
  return config
})

const totalExpense = computed(() =>
  expenseChartData.value.reduce((sum, item) => sum + item.amount, 0),
)

const totalIncome = computed(() =>
  incomeChartData.value.reduce((sum, item) => sum + item.amount, 0),
)

function donutTooltip(chartConfig: ChartConfig) {
  return (d: Record<string, any>) => {
    const item = d && "data" in d ? d.data : d
    if (!item || !item.categoryId)
      return ""

    const cfg = chartConfig[item.categoryId]
    const color = item.fill || cfg?.color || "#94A3B8"
    const label = cfg?.label || item.categoryName || "Unknown"
    const rawValue = item.amount ?? 0
    const amount = formatCurrency(rawValue)

    return `
      <div class="border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl">
        <div class="flex items-center gap-2">
          <div class="h-2.5 w-2.5 shrink-0 rounded-[2px]" style="background-color:${color}"></div>
          <span class="text-muted-foreground">${label}</span>
        </div>
        <span class="text-foreground font-mono font-medium tabular-nums">${amount}</span>
      </div>
    `
  }
}

// --- Actions ---
function startEditing(category: {
  id: string
  name: string
  color: string | null
}) {
  editingCategory.value = category.id
  editingData.value = {
    name: category.name,
    color: category.color || "#3B82F6",
  }
}

async function handleCreate() {
  try {
    await appStore.createCategory({
      name: newCategory.value.name,
      color: newCategory.value.color,
    })
    showAddModal.value = false
    newCategory.value = { name: "", color: "#3B82F6" }
  } catch (e) {
    console.error(e)
  }
}

async function handleUpdate(id: string) {
  try {
    await appStore.updateCategory(id, editingData.value)
    editingCategory.value = null
  } catch (e) {
    console.error(e)
  }
}

async function handleDelete(id: string) {
  if (confirm("Are you sure you want to delete this category?")) {
    try {
      await appStore.deleteCategory(id)
    } catch (e) {
      console.error(e)
    }
  }
}

onMounted(() => {
  appStore.fetchCategories()
  appStore.fetchCategoryBreakdown()
})
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6 py-6 px-4 xl:px-0">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Categories</h1>
        <p class="text-muted-foreground mt-1">
          Organize your transactions with custom categories
        </p>
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
            <DialogDescription>
              Create a category to organize your transactions
            </DialogDescription>
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
              <Button
                type="button"
                variant="outline"
                @click="showAddModal = false"
              >
                Cancel
              </Button>
              <Button type="submit"> Add Category </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>

    <!-- Charts Section -->
    <div
      v-if="!appStore.loading && appStore.categories.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <!-- Expense Breakdown Chart -->
      <Card class="flex flex-col">
        <CardHeader class="items-center pb-0">
          <CardTitle class="flex items-center gap-2">
            <TrendingDown class="w-4 h-4 text-red-500" />
            Expense Breakdown
          </CardTitle>
          <CardDescription>By category</CardDescription>
        </CardHeader>
        <CardContent class="flex-1 pb-0">
          <ChartContainer
            :config="expenseChartConfig"
            class="mx-auto aspect-square max-h-[250px]"
          >
            <VisSingleContainer
              :data="expenseChartData"
              :margin="{ top: 10, bottom: 10 }"
            >
              <VisDonut
                :value="(d: ExpenseData) => d.amount"
                :color="(d: ExpenseData) => d.fill"
                :arc-width="30"
              />
              <ChartTooltip
                :triggers="{
                  [Donut.selectors.segment]: donutTooltip(expenseChartConfig),
                }"
              />
            </VisSingleContainer>
          </ChartContainer>
        </CardContent>
        <CardFooter class="flex-col gap-2 text-sm">
          <div class="flex items-center gap-2 font-medium leading-none">
            Total Expense:
            <span class="text-red-400">{{ formatCurrency(totalExpense) }}</span>
          </div>
        </CardFooter>
      </Card>

      <!-- Income Breakdown Chart -->
      <Card class="flex flex-col">
        <CardHeader class="items-center pb-0">
          <CardTitle class="flex items-center gap-2">
            <TrendingUp class="w-4 h-4 text-green-500" />
            Income Breakdown
          </CardTitle>
          <CardDescription>By category</CardDescription>
        </CardHeader>
        <CardContent class="flex-1 pb-0">
          <ChartContainer
            :config="incomeChartConfig"
            class="mx-auto aspect-square max-h-[250px]"
          >
            <VisSingleContainer
              :data="incomeChartData"
              :margin="{ top: 10, bottom: 10 }"
            >
              <VisDonut
                :value="(d: IncomeData) => d.amount"
                :color="(d: IncomeData) => d.fill"
                :arc-width="30"
              />
              <ChartTooltip
                :triggers="{
                  [Donut.selectors.segment]: donutTooltip(incomeChartConfig),
                }"
              />
            </VisSingleContainer>
          </ChartContainer>
        </CardContent>
        <CardFooter class="flex-col gap-2 text-sm">
          <div class="flex items-center gap-2 font-medium leading-none">
            Total Income:
            <span class="text-green-400">{{ formatCurrency(totalIncome) }}</span>
          </div>
        </CardFooter>
      </Card>
    </div>

    <!-- Loading State -->
    <div v-if="appStore.loading" class="flex items-center justify-center py-12">
      <Loader2 class="w-8 h-8 animate-spin text-muted-foreground" />
    </div>

    <!-- Empty State -->
    <Card
      v-else-if="appStore.categories.length === 0"
      class="p-12 text-center border-dashed"
    >
      <PieChart class="w-16 h-16 text-muted-foreground mx-auto mb-4" />
      <h3 class="text-lg font-medium text-foreground mb-2">No categories yet</h3>
      <p class="text-muted-foreground mb-4">
        Create your first category to organize your transactions
      </p>
      <Button @click="showAddModal = true">
        <Plus class="w-4 h-4 mr-2" />
        Add Category
      </Button>
    </Card>

    <!-- Categories Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card
        v-for="category in appStore.categories"
        :key="category.id"
        class="hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg border-t-4 cursor-default overflow-hidden"
        :style="{ borderTopColor: category.color || '#94A3B8' }"
      >
        <CardContent class="p-6">
          <!-- Edit Mode -->
          <div v-if="editingCategory === category.id" class="space-y-4">
            <div class="grid gap-2">
              <Label>Name</Label>
              <Input
                v-model="editingData.name"
                type="text"
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
              <Button
                type="button"
                size="sm"
                @click="handleUpdate(category.id)"
                class="flex-1"
              >
                Save
              </Button>
            </div>
          </div>

          <!-- View Mode -->
          <div v-else class="space-y-4">
            <!-- Card Header -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  :style="{ backgroundColor: category.color || '#94A3B8' }"
                >
                  <Tag class="w-5 h-5 text-white" />
                </div>
                <div class="min-w-0">
                  <h3 class="font-semibold text-foreground text-base truncate">
                    {{ category.name }}
                  </h3>
                  <p class="text-xs text-muted-foreground font-mono">
                    {{ category.color || "Default" }}
                  </p>
                </div>
              </div>
              <div class="flex gap-1 shrink-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <Button
                        variant="ghost"
                        size="icon"
                        @click="startEditing(category)"
                        class="text-muted-foreground hover:text-primary hover:bg-primary/10 h-8 w-8"
                      >
                        <Pencil class="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit category</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <Button
                        variant="ghost"
                        size="icon"
                        @click="handleDelete(category.id)"
                        class="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                      >
                        <Trash2 class="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete category</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <!-- Financial Stats -->
            <div v-if="categoryBreakdownMap.has(category.id)" class="space-y-3">
              <Separator />
              <div class="grid grid-cols-3 gap-3">
                <div class="space-y-1.5">
                  <Badge
                    variant="outline"
                    class="text-green-400 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800 text-[10px] px-1.5 py-0"
                  >
                    <TrendingUp class="w-3 h-3 mr-1" />
                    Income
                  </Badge>
                  <p class="text-sm font-semibold text-green-400">
                    {{
                      formatCurrency(
                        categoryBreakdownMap.get(category.id)!.totalIncome,
                      )
                    }}
                  </p>
                </div>
                <div class="space-y-1.5">
                  <Badge
                    variant="outline"
                    class="text-red-400 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800 text-[10px] px-1.5 py-0"
                  >
                    <TrendingDown class="w-3 h-3 mr-1" />
                    Expense
                  </Badge>
                  <p class="text-sm font-semibold text-red-400">
                    {{
                      formatCurrency(
                        categoryBreakdownMap.get(category.id)!.totalExpense,
                      )
                    }}
                  </p>
                </div>
                <div class="space-y-1.5">
                  <Badge
                    variant="outline"
                    class="text-muted-foreground border-border text-[10px] px-1.5 py-0"
                  >
                    <TrendingUpDown class="w-3 h-3 mr-1" />
                    Net
                  </Badge>
                  <p
                    class="text-sm font-semibold"
                    :class="
                      Number(categoryBreakdownMap.get(category.id)!.netBalance) >=
                      0
                        ? 'text-green-400'
                        : 'text-red-400'
                    "
                  >
                    {{
                      formatCurrency(
                        categoryBreakdownMap.get(category.id)!.netBalance,
                      )
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

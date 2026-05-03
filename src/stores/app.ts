import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Category, Transaction, Budget, FinancialSummary, CategoryBreakdown } from '@/types'
import { apiClient } from '@/lib/api'

export const useAppStore = defineStore('app', () => {
  const categories = ref<Category[]>([])
  const transactions = ref<Transaction[]>([])
  const budgets = ref<Budget[]>([])
  const summary = ref<FinancialSummary | null>(null)
  const categoryBreakdown = ref<CategoryBreakdown[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const totalIncome = computed(() => Number(summary.value?.totalIncome || 0))
  const totalExpense = computed(() => Number(summary.value?.totalExpense || 0))
  const netBalance = computed(() => Number(summary.value?.netBalance || 0))

  const categoriesById = computed(() => {
    const map = new Map<string, Category>()
    categories.value.forEach((c) => map.set(c.id, c))
    return map
  })

  async function fetchCategories() {
    try {
      loading.value = true
      error.value = null
      categories.value = await apiClient.categories.list()
    } catch (e: any) {
      error.value = e.response?.data?.error?.message || 'Failed to fetch categories'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchTransactions(params?: {
    type?: 'income' | 'expense'
    categoryId?: string
    from?: string
    to?: string
  }) {
    try {
      loading.value = true
      error.value = null
      const data = await apiClient.transactions.list(params)
      const catMap = categoriesById.value
      transactions.value = data.map((t) => ({
        ...t,
        category: catMap.get(t.categoryId),
      }))
    } catch (e: any) {
      error.value = e.response?.data?.error?.message || 'Failed to fetch transactions'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchBudgets() {
    try {
      loading.value = true
      error.value = null
      const data = await apiClient.budgets.list()
      const catMap = categoriesById.value
      budgets.value = data.map((b) => ({
        ...b,
        category: catMap.get(b.categoryId),
      }))
    } catch (e: any) {
      error.value = e.response?.data?.error?.message || 'Failed to fetch budgets'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchSummary() {
    try {
      loading.value = true
      error.value = null
      summary.value = await apiClient.analytics.summary()
    } catch (e: any) {
      error.value = e.response?.data?.error?.message || 'Failed to fetch summary'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchCategoryBreakdown() {
    try {
      loading.value = true
      error.value = null
      categoryBreakdown.value = await apiClient.analytics.byCategory()
    } catch (e: any) {
      error.value = e.response?.data?.error?.message || 'Failed to fetch breakdown'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createTransaction(data: {
    type: 'income' | 'expense'
    amount: number
    description?: string
    categoryId: string
    occurredAt?: string
  }) {
    try {
      loading.value = true
      error.value = null
      const result = await apiClient.transactions.create(data)
      const catMap = categoriesById.value
      transactions.value.unshift({
        ...result,
        category: catMap.get(result.categoryId),
      })
      await fetchSummary()
      return result
    } catch (e: any) {
      error.value = e.response?.data?.error?.message || 'Failed to create transaction'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateTransaction(
    id: string,
    data: {
      type?: 'income' | 'expense'
      amount?: number
      description?: string
      categoryId?: string
      occurredAt?: string
    }
  ) {
    try {
      loading.value = true
      error.value = null
      const result = await apiClient.transactions.update(id, data)
      const catMap = categoriesById.value
      const idx = transactions.value.findIndex((t) => t.id === id)
      if (idx !== -1) {
        transactions.value[idx] = {
          ...result,
          category: catMap.get(result.categoryId),
        }
      }
      await fetchSummary()
      return result
    } catch (e: any) {
      error.value = e.response?.data?.error?.message || 'Failed to update transaction'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteTransaction(id: string) {
    try {
      loading.value = true
      error.value = null
      await apiClient.transactions.delete(id)
      transactions.value = transactions.value.filter((t) => t.id !== id)
      await fetchSummary()
    } catch (e: any) {
      error.value = e.response?.data?.error?.message || 'Failed to delete transaction'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createCategory(data: { name: string; color?: string }) {
    try {
      loading.value = true
      error.value = null
      const result = await apiClient.categories.create(data)
      categories.value.push(result)
      return result
    } catch (e: any) {
      error.value = e.response?.data?.error?.message || 'Failed to create category'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateCategory(id: string, data: { name?: string; color?: string }) {
    try {
      loading.value = true
      error.value = null
      const result = await apiClient.categories.update(id, data)
      const idx = categories.value.findIndex((c) => c.id === id)
      if (idx !== -1) {
        categories.value[idx] = result
      }
      return result
    } catch (e: any) {
      error.value = e.response?.data?.error?.message || 'Failed to update category'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteCategory(id: string) {
    try {
      loading.value = true
      error.value = null
      await apiClient.categories.delete(id)
      categories.value = categories.value.filter((c) => c.id !== id)
    } catch (e: any) {
      error.value = e.response?.data?.error?.message || 'Failed to delete category'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createBudget(data: {
    categoryId: string
    amount: number
    period: 'monthly' | 'yearly'
  }) {
    try {
      loading.value = true
      error.value = null
      const result = await apiClient.budgets.create(data)
      const catMap = categoriesById.value
      budgets.value.push({
        ...result,
        category: catMap.get(result.categoryId),
      })
      return result
    } catch (e: any) {
      error.value = e.response?.data?.error?.message || 'Failed to create budget'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateBudget(
    id: string,
    data: { categoryId?: string; amount?: number; period?: 'monthly' | 'yearly' }
  ) {
    try {
      loading.value = true
      error.value = null
      const result = await apiClient.budgets.update(id, data)
      const catMap = categoriesById.value
      const idx = budgets.value.findIndex((b) => b.id === id)
      if (idx !== -1) {
        budgets.value[idx] = {
          ...result,
          category: catMap.get(result.categoryId),
        }
      }
      return result
    } catch (e: any) {
      error.value = e.response?.data?.error?.message || 'Failed to update budget'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteBudget(id: string) {
    try {
      loading.value = true
      error.value = null
      await apiClient.budgets.delete(id)
      budgets.value = budgets.value.filter((b) => b.id !== id)
    } catch (e: any) {
      error.value = e.response?.data?.error?.message || 'Failed to delete budget'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function initialize() {
    await Promise.all([fetchCategories(), fetchSummary()])
  }

  return {
    categories,
    transactions,
    budgets,
    summary,
    categoryBreakdown,
    loading,
    error,
    totalIncome,
    totalExpense,
    netBalance,
    fetchCategories,
    fetchTransactions,
    fetchBudgets,
    fetchSummary,
    fetchCategoryBreakdown,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    createCategory,
    updateCategory,
    deleteCategory,
    createBudget,
    updateBudget,
    deleteBudget,
    initialize,
  }
})

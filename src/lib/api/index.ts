import axios from 'axios'
import type {
  Category,
  Transaction,
  Budget,
  FinancialSummary,
  CategoryBreakdown,
  ApiError,
} from '@/types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data) {
      error.apiError = error.response.data as ApiError
    }
    return Promise.reject(error)
  }
)

export const apiClient = {
  categories: {
    list: () => api.get<Category[]>('/categories').then((r) => r.data),
    get: (id: string) => api.get<Category>(`/categories/${id}`).then((r) => r.data),
    create: (data: { name: string; color?: string }) =>
      api.post<Category>('/categories', data).then((r) => r.data),
    update: (id: string, data: { name?: string; color?: string }) =>
      api.put<Category>(`/categories/${id}`, data).then((r) => r.data),
    delete: (id: string) => api.delete(`/categories/${id}`).then((r) => r.data),
  },
  transactions: {
    list: (params?: {
      type?: 'income' | 'expense'
      categoryId?: string
      from?: string
      to?: string
    }) => api.get<Transaction[]>('/transactions', { params }).then((r) => r.data),
    get: (id: string) => api.get<Transaction>(`/transactions/${id}`).then((r) => r.data),
    create: (data: {
      type: 'income' | 'expense'
      amount: number
      description?: string
      categoryId: string
      occurredAt?: string
    }) => api.post<Transaction>('/transactions', data).then((r) => r.data),
    update: (
      id: string,
      data: {
        type?: 'income' | 'expense'
        amount?: number
        description?: string
        categoryId?: string
        occurredAt?: string
      }
    ) => api.put<Transaction>(`/transactions/${id}`, data).then((r) => r.data),
    delete: (id: string) => api.delete(`/transactions/${id}`).then((r) => r.data),
  },
  budgets: {
    list: () => api.get<Budget[]>('/budgets').then((r) => r.data),
    get: (id: string) => api.get<Budget>(`/budgets/${id}`).then((r) => r.data),
    create: (data: { categoryId: string; amount: number; period: 'monthly' | 'yearly' }) =>
      api.post<Budget>('/budgets', data).then((r) => r.data),
    update: (
      id: string,
      data: { categoryId?: string; amount?: number; period?: 'monthly' | 'yearly' }
    ) => api.put<Budget>(`/budgets/${id}`, data).then((r) => r.data),
    delete: (id: string) => api.delete(`/budgets/${id}`).then((r) => r.data),
  },
  analytics: {
    summary: () => api.get<FinancialSummary>('/analytics/summary').then((r) => r.data),
    byCategory: () => api.get<CategoryBreakdown[]>('/analytics/by-category').then((r) => r.data),
  },
}

export default api

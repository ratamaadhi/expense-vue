export type TransactionType = 'income' | 'expense'
export type BudgetPeriod = 'monthly' | 'yearly'

export interface Category {
  id: string
  name: string
  color: string | null
  createdAt: string
}

export interface Transaction {
  id: string
  type: TransactionType
  amount: string
  categoryId: string
  description?: string
  occurredAt: string
  createdAt: string
  category?: Category
}

export interface Budget {
  id: string
  categoryId: string
  amount: string
  period: BudgetPeriod
  spent: string
  remaining: string
  utilizationPercentage: number
  category?: Category
}

export interface FinancialSummary {
  totalIncome: string
  totalExpense: string
  netBalance: string
}

export interface CategoryBreakdown {
  categoryId: string
  categoryName: string
  totalIncome: string
  totalExpense: string
  netBalance: string
}

export interface ApiError {
  error: {
    code: string
    message: string
    details?: Array<{
      field: string
      message: string
    }>
  }
}

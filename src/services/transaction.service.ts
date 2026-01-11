import { apiRequest } from './api'

export type TransactionType = 'income' | 'expense'

export type Transaction = {
  id: number
  userId: number
  type: TransactionType
  category: string
  amount: number
  description?: string
  transactionDate: string
  createdAt: string
  updatedAt: string
}

export type CreateTransactionData = {
  type: TransactionType
  category: string
  amount: number
  description?: string
  transactionDate: string
}

export type UpdateTransactionData = Partial<CreateTransactionData>

export type TransactionSummary = {
  totalIncome: number
  totalExpense: number
  balance: number
}

export const transactionService = {
  async create(data: CreateTransactionData): Promise<Transaction> {
    const response = await apiRequest<Transaction>('/transactions', {
      method: 'POST',
      data,
    })
    return response.data
  },

  async getAll(): Promise<Transaction[]> {
    const response = await apiRequest<Transaction[]>('/transactions', {
      method: 'GET',
    })
    return response.data
  },

  async getSummary(): Promise<TransactionSummary> {
    const response = await apiRequest<TransactionSummary>('/transactions/summary', {
      method: 'GET',
    })
    return response.data
  },

  async getOne(id: number): Promise<Transaction> {
    const response = await apiRequest<Transaction>(`/transactions/${id}`, {
      method: 'GET',
    })
    return response.data
  },

  async update(id: number, data: UpdateTransactionData): Promise<Transaction> {
    const response = await apiRequest<Transaction>(`/transactions/${id}`, {
      method: 'PUT',
      data,
    })
    return response.data
  },

  async delete(id: number): Promise<void> {
    await apiRequest(`/transactions/${id}`, {
      method: 'DELETE',
    })
  },
}

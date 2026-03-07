import { baseApi } from './baseApi'
import type { ApiResponse } from '../../types/api.types'

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

export const transactionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query<Transaction[], void>({
      query: () => '/transactions',
      transformResponse: (response: ApiResponse<Transaction[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Transaction' as const, id })),
              { type: 'Transaction', id: 'LIST' },
            ]
          : [{ type: 'Transaction', id: 'LIST' }],
    }),

    getTransactionSummary: builder.query<TransactionSummary, void>({
      query: () => '/transactions/summary',
      transformResponse: (response: ApiResponse<TransactionSummary>) => response.data,
      providesTags: ['TransactionSummary'],
    }),

    getTransaction: builder.query<Transaction, number>({
      query: (id) => `/transactions/${id}`,
      transformResponse: (response: ApiResponse<Transaction>) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'Transaction', id }],
    }),

    createTransaction: builder.mutation<Transaction, CreateTransactionData>({
      query: (data) => ({
        url: '/transactions',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<Transaction>) => response.data,
      invalidatesTags: [
        { type: 'Transaction', id: 'LIST' },
        'TransactionSummary',
      ],
    }),

    updateTransaction: builder.mutation<
      Transaction,
      { id: number; data: UpdateTransactionData }
    >({
      query: ({ id, data }) => ({
        url: `/transactions/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: ApiResponse<Transaction>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Transaction', id },
        { type: 'Transaction', id: 'LIST' },
        'TransactionSummary',
      ],
    }),

    deleteTransaction: builder.mutation<void, number>({
      query: (id) => ({
        url: `/transactions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Transaction', id },
        { type: 'Transaction', id: 'LIST' },
        'TransactionSummary',
      ],
    }),
  }),
})

export const {
  useGetTransactionsQuery,
  useGetTransactionSummaryQuery,
  useGetTransactionQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionsApi

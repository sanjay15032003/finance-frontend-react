import { useState, type FormEvent } from 'react'
import { useToast } from './Toast'
import { useCreateTransactionMutation, type TransactionType } from '../store/api/transactionsApi'
import './TransactionModal.css'

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TransactionModal({ isOpen, onClose }: TransactionModalProps) {
  const { showToast } = useToast()
  const [createTransaction, { isLoading: loading }] = useCreateTransactionMutation()
  const [formData, setFormData] = useState({
    type: 'expense' as TransactionType,
    category: '',
    amount: '',
    description: '',
    transactionDate: new Date().toISOString().split('T')[0],
  })

  const categories = {
    expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare', 'Other'],
    income: ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other'],
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!formData.category || !formData.amount) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    try {
      await createTransaction({
        type: formData.type,
        category: formData.category,
        amount: parseFloat(formData.amount),
        description: formData.description || undefined,
        transactionDate: formData.transactionDate,
      }).unwrap()

      showToast('Transaction added successfully', 'success')

      setFormData({
        type: 'expense',
        category: '',
        amount: '',
        description: '',
        transactionDate: new Date().toISOString().split('T')[0],
      })

      onClose()
    } catch (error: any) {
      showToast(error || 'Failed to add transaction', 'error')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'type' && { category: '' }),
    }))
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Transaction</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">Type *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                {categories[formData.type].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="amount">Amount *</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                placeholder="0.00"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="transactionDate">Date *</label>
              <input
                type="date"
                id="transactionDate"
                name="transactionDate"
                value={formData.transactionDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Optional notes..."
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? 'Adding...' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

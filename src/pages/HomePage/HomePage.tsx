import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../components/Toast'
import { TransactionModal } from '../../components/TransactionModal'
import { transactionService } from '../../services/transaction.service'
import type { Transaction, TransactionSummary } from '../../services/transaction.service'
import './HomePage.css'

export const HomePage = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [summary, setSummary] = useState<TransactionSummary>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [transactionsData, summaryData] = await Promise.all([
        transactionService.getAll(),
        transactionService.getSummary(),
      ])
      setTransactions(transactionsData)
      setSummary(summaryData)
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to load data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleDeleteTransaction = async (id: number) => {
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return
    }

    try {
      await transactionService.delete(id)
      showToast('Transaction deleted successfully', 'success')
      loadData()
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to delete transaction', 'error')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Finance Tracker</h1>
        <div className="header-actions">
          <button onClick={() => navigate('/profile')} className="profile-btn">Profile</button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="home-main">
        <section className="summary-cards">
          <div className="card income">
            <span className="card-label">Total Income</span>
            <span className="card-value">{formatCurrency(summary.totalIncome)}</span>
          </div>
          <div className="card expense">
            <span className="card-label">Total Expenses</span>
            <span className="card-value">{formatCurrency(summary.totalExpense)}</span>
          </div>
          <div className="card balance">
            <span className="card-label">Balance</span>
            <span className="card-value">{formatCurrency(summary.balance)}</span>
          </div>
        </section>

        <section className="transactions">
          <div className="transactions-header">
            <h2>Recent Transactions</h2>
            <button className="add-btn" onClick={() => setIsModalOpen(true)}>
              + Add Transaction
            </button>
          </div>
          <div className="transactions-list">
            {loading ? (
              <p className="empty-state">Loading...</p>
            ) : transactions.length === 0 ? (
              <p className="empty-state">No transactions yet. Add your first one!</p>
            ) : (
              <div className="transaction-items">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className={`transaction-item ${transaction.type}`}>
                    <div className="transaction-info">
                      <div className="transaction-category">{transaction.category}</div>
                      <div className="transaction-date">{formatDate(transaction.transactionDate)}</div>
                      {transaction.description && (
                        <div className="transaction-description">{transaction.description}</div>
                      )}
                    </div>
                    <div className="transaction-right">
                      <div className={`transaction-amount ${transaction.type}`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(Number(transaction.amount))}
                      </div>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        title="Delete transaction"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  )
}


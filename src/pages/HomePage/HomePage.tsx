import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './HomePage.css'

export const HomePage = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Finance Tracker</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      <main className="home-main">
        <section className="summary-cards">
          <div className="card income">
            <span className="card-label">Total Income</span>
            <span className="card-value">$0.00</span>
          </div>
          <div className="card expense">
            <span className="card-label">Total Expenses</span>
            <span className="card-value">$0.00</span>
          </div>
          <div className="card balance">
            <span className="card-label">Balance</span>
            <span className="card-value">$0.00</span>
          </div>
        </section>

        <section className="transactions">
          <div className="transactions-header">
            <h2>Recent Transactions</h2>
            <button className="add-btn">+ Add Transaction</button>
          </div>
          <div className="transactions-list">
            <p className="empty-state">No transactions yet. Add your first one!</p>
          </div>
        </section>
      </main>
    </div>
  )
}


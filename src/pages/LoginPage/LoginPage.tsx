import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../components/Toast'
import { useAuth } from '../../context/AuthContext'
import { useSignUpMutation, useSignInMutation } from '../../store/api/authApi'
import './LoginPage.css'

export const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { showToast } = useToast()
  const { login } = useAuth()
  const navigate = useNavigate()

  const [signUp, { isLoading: isSignUpLoading }] = useSignUpMutation()
  const [signIn, { isLoading: isSignInLoading }] = useSignInMutation()
  const loading = isSignUpLoading || isSignInLoading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const result = isSignUp
        ? await signUp({ name, email, password }).unwrap()
        : await signIn({ email, password }).unwrap()

      login(result.accessToken)
      showToast(isSignUp ? 'Account created successfully!' : 'Logged in successfully!', 'success')
      navigate('/')
    } catch (err: any) {
      showToast(err || 'Something went wrong', 'error')
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <p className="toggle">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button type="button" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  )
}

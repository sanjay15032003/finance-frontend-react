import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useGetProfileQuery, useUpdateProfileMutation } from '../../store/api/userApi'
import { useToast } from '../../components/Toast'
import './ProfilePage.css'

export function ProfilePage() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { data: profile, isLoading: loading, error } = useGetProfileQuery()
  const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation()
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        mobileNumber: profile.mobileNumber || '',
      })
    }
  }, [profile])

  useEffect(() => {
    if (error) {
      showToast('Failed to load profile', 'error')
    }
  }, [error, showToast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await updateProfile(formData).unwrap()
      showToast('Profile updated successfully', 'success')
    } catch (error: any) {
      showToast(error || 'Failed to update profile', 'error')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>Profile</h1>
          <div className="header-actions">
            <button onClick={() => navigate('/')} className="btn-back">
              Back to Home
            </button>
            <button onClick={logout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={profile?.email || ''}
              disabled
              className="input-disabled"
            />
            <small className="input-hint">Email cannot be changed</small>
          </div>

          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="mobileNumber">Mobile Number</label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="Enter your mobile number"
            />
          </div>

          <button type="submit" disabled={saving} className="btn-save">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}

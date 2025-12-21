
// src/pages/Login.jsx
import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { useToast } from '../context/ToastContext'

export default function Login() {
  const { login, signup, resetPassword } = useContext(AuthContext)
  const [mode, setMode] = useState('login') // 'login' | 'signup' | 'forgot'
  const navigate = useNavigate()
  const location = useLocation()

  // Return to the page user came from (e.g., Home) after auth
  const from = location.state?.from?.pathname || '/'

  // feedback state
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // login state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // signup state (avatar removed; phone now required)
  const [name, setName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [phone, setPhone] = useState('')

  // ========= PASSWORD VALIDATION (SIGNUP) =========
  // Min 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special character
  function validatePassword(pw) {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/
    return strongRegex.test(pw)
  }
  const signupPasswordIsValid = validatePassword(signupPassword)

  // SIGNUP
  function handleSignup(e) {
    e.preventDefault()
    setError(''); setSuccess('')

    if (!name || !signupEmail || !signupPassword || !phone) {
      return setError('Please fill all required fields: Name, Email, Phone, Password.')
    }

    // enforce strong password
    if (!signupPasswordIsValid) {
      return setError(
        'Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.'
      )
    }

    // avatar removed; pass null/omit if your AuthContext expects it
    const res = signup({ name, email: signupEmail, password: signupPassword, phone })
    if (!res?.ok) return setError(res?.message ?? 'Signup failed')

    setSuccess('Signup successful — you are logged in')
    navigate(from, { replace: true })
  }

  // LOGIN (unchanged strength; allow existing accounts)
  function handleLogin(e) {
    e.preventDefault()
    setError(''); setSuccess('')

    if (!email || !password) return setError('Enter email and password')

    const res = login({ email, password })
    if (!res?.ok) return setError(res?.message ?? 'Login failed')

    setSuccess('Login successful')
    navigate(from, { replace: true })
  }

  // RESET (optional tab; unchanged)
  function handleReset(e) {
    e.preventDefault()
    setError(''); setSuccess('')

    if (!email) return setError('Enter your email')
    const res = resetPassword(email)
    if (!res?.ok) return setError(res?.message ?? 'Reset failed')
    setSuccess(`Password reset. New password: ${res.newPassword}`)
  }

  const errorStyle = { color: 'var(--danger)' }   // red message color
  const successStyle = { color: 'var(--accent)' } // success color

  return (
    <div className="page-container">
      <div className="auth-card">
        <h2 style={{ margin: 0, marginBottom: 6, textAlign: 'center' }}>
          {mode === 'signup'
            ? 'Create your account'
            : mode === 'forgot'
            ? 'Reset password'
            : 'Welcome back'}
        </h2>

        <p style={{ marginTop: 0, marginBottom: 14, textAlign: 'center', color: 'var(--muted)' }}>
          {mode === 'signup'
            ? 'Sign up to start ordering'
            : 'Sign in to continue'}
        </p>

        <div className="auth-tabs">
          <button
            className={`nav-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            className={`nav-btn ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => setMode('signup')}
          >
            Sign up
          </button>
          {/* Uncomment to enable forgot flow
          <button
            className={`nav-btn ${mode === 'forgot' ? 'active' : ''}`}
            onClick={() => setMode('forgot')}
          >
            Forgot
          </button> */}
        </div>

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="auth-form">
            {error && <div style={errorStyle}>{error}</div>}
            {success && <div style={successStyle}>{success}</div>}

            <input
              aria-label="Email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              aria-label="Password"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="auth-help">
              <div />
              {/* Uncomment to enable forgot flow
              <button
                type="button"
                className="btn-link"
                onClick={() => setMode('forgot')}
              >
                Forgot password?
              </button> */}
            </div>

            <button type="submit" className="btn-primary">Sign in</button>

            <div style={{ textAlign: 'center', marginTop: 6 }}>
              <small className="auth-help">
                Don't have an account?{' '}
                <button type="button" className="btn-link" onClick={() => setMode('signup')}>
                  Create one
                </button>
              </small>
            </div>
          </form>
        )}

        {/* SIGNUP FORM (avatar removed, phone required) */}
        {mode === 'signup' && (
          <form onSubmit={handleSignup} className="auth-form">
            {error && <div style={errorStyle}>{error}</div>}
            {success && <div style={successStyle}>{success}</div>}

            <input
              aria-label="Name"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              aria-label="Email"
              placeholder="Email"
              type="email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              required
            />

            <div style={{ display: 'grid', gap: 6 }}>
              <input
                aria-label="Password"
                placeholder="Password"
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                minLength={8} // basic HTML guard
                required
              />
              {/* Live requirements message in red */}
              {!signupPasswordIsValid && signupPassword.length > 0 && (
                <small style={errorStyle}>
                  Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.
                </small>
              )}
            </div>

            <input
              aria-label="Phone"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            {/* Photo upload removed */}

            <button
              type="submit"
              className="btn-primary"
              // Optionally prevent submit until valid:
              // disabled={!signupPasswordIsValid}
            >
              Create account
            </button>
          </form>
        )}

        {/* FORGOT FORM (optional) */}
        {mode === 'forgot' && (
          <form onSubmit={handleReset} className="auth-form">
            {error && <div style={errorStyle}>{error}</div>}
            {success && <div style={successStyle}>{success}</div>}

            <input
              aria-label="Email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit" className="btn-primary">Reset Password</button>

            <div style={{ textAlign: 'center', marginTop: 6 }}>
              <small className="auth-help">
                Remembered?{' '}
                <button type="button" className="btn-link" onClick={() => setMode('login')}>
                  Sign in
                </button>
              </small>
            </div>
          </form>
        )}
      </div>
       </div>
  )
}
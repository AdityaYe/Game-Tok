import React from 'react'
import { Link } from 'react-router-dom'

import '../../styles/auth-shared.css'

const ChooseRegister = () => {

  return (

    <div className="auth-page-wrapper">

      <div
        className="auth-card"
        role="region"
        aria-labelledby="choose-register-title"
      >

        <header>

          <h1
            id="choose-register-title"
            className="auth-title"
          >
            Join GameTok
          </h1>

          <p className="auth-subtitle">
            Choose how you want to use the platform.
          </p>

        </header>



        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >

          <Link
            to="/user/register"
            className="auth-submit"
            style={{ textDecoration: 'none' }}
          >
            Join as User
          </Link>



          <Link
            to="/creator/register"
            className="auth-submit"
            style={{
              textDecoration: 'none',
              background: 'var(--color-surface-alt)',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)'
            }}
          >
            Join as Creator
          </Link>

        </div>



        <div
          className="auth-alt-action"
          style={{ marginTop: '4px' }}
        >
          Already have an account?{' '}
          <Link to="/user/login">
            Sign in
          </Link>
        </div>

      </div>

    </div>

  )
}

export default ChooseRegister;
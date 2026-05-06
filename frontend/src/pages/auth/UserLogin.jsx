import React from 'react'

import axios from 'axios'

import { Link, useNavigate } from 'react-router-dom'

import '../../styles/auth-shared.css'


const UserLogin = () => {

  const navigate = useNavigate()



  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      const email = e.target.email.value
      const password = e.target.password.value



      await axios.post(
        "http://localhost:3000/api/auth/user/login",
        {
          email,
          password
        },
        {
          withCredentials: true
        }
      )



      navigate("/")

    } catch (err) {

      console.error(err)

    }

  }



  return (

    <div className="auth-page-wrapper">

      <div
        className="auth-card"
        role="region"
        aria-labelledby="user-login-title"
      >

        <header>

          <h1
            id="user-login-title"
            className="auth-title"
          >
            Welcome Back
          </h1>

          <p className="auth-subtitle">
            Sign in to explore trending gaming clips.
          </p>

        </header>



        <form
          className="auth-form"
          onSubmit={handleSubmit}
          noValidate
        >

          <div className="field-group">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
            />

          </div>



          <div className="field-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
            />

          </div>



          <button
            className="auth-submit"
            type="submit"
          >
            Sign In
          </button>

        </form>



        <div className="auth-alt-action">

          New here?{' '}

          <Link to="/user/register">
            Create account
          </Link>

        </div>

      </div>

    </div>

  )
}

export default UserLogin
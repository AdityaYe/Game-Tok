import React from 'react'

import axios from 'axios'

import { Link, useNavigate } from 'react-router-dom'

import '../../styles/auth-shared.css'


const CreatorLogin = () => {

  const navigate = useNavigate()



  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      const email = e.target.email.value
      const password = e.target.password.value



      await axios.post(
        "http://localhost:3000/api/auth/creator/login",
        {
          email,
          password
        },
        {
          withCredentials: true
        }
      )



      navigate("/upload-clip")

    } catch (err) {

      console.error(err)

    }

  }



  return (

    <div className="auth-page-wrapper">

      <div
        className="auth-card"
        role="region"
        aria-labelledby="creator-login-title"
      >

        <header>

          <h1
            id="creator-login-title"
            className="auth-title"
          >
            Creator Login
          </h1>

          <p className="auth-subtitle">
            Upload and manage your gaming clips.
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
              placeholder="creator@example.com"
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
              placeholder="Password"
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

          New creator?{' '}

          <Link to="/creator/register">
            Create an account
          </Link>

        </div>

      </div>

    </div>

  )
}

export default CreatorLogin;
import React from 'react'

import axios from 'axios'

import { Link, useNavigate } from 'react-router-dom'

import '../../styles/auth-shared.css'


const UserRegister = () => {

  const navigate = useNavigate()



  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      const firstName = e.target.firstName.value
      const lastName = e.target.lastName.value
      const email = e.target.email.value
      const password = e.target.password.value



      await axios.post(
        "http://localhost:3000/api/auth/user/register",
        {
          fullName: `${firstName} ${lastName}`,
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
        aria-labelledby="user-register-title"
      >

        <header>

          <h1
            id="user-register-title"
            className="auth-title"
          >
            Create Your Account
          </h1>

          <p className="auth-subtitle">
            Join GameTok and discover gaming clips from creators.
          </p>

        </header>



        <nav
          className="auth-alt-action"
          style={{ marginTop: '-4px' }}
        >

          <strong style={{ fontWeight: 600 }}>
            Switch:
          </strong>

          {' '}

          <Link to="/user/register">
            User
          </Link>

          {' • '}

          <Link to="/creator/register">
            Creator
          </Link>

        </nav>



        <form
          className="auth-form"
          onSubmit={handleSubmit}
          noValidate
        >

          <div className="two-col">

            <div className="field-group">

              <label htmlFor="firstName">
                First Name
              </label>

              <input
                id="firstName"
                name="firstName"
                placeholder="John"
                autoComplete="given-name"
              />

            </div>



            <div className="field-group">

              <label htmlFor="lastName">
                Last Name
              </label>

              <input
                id="lastName"
                name="lastName"
                placeholder="Doe"
                autoComplete="family-name"
              />

            </div>

          </div>



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
              autoComplete="new-password"
            />

          </div>



          <button
            className="auth-submit"
            type="submit"
          >
            Sign Up
          </button>

        </form>



        <div className="auth-alt-action">

          Already have an account?{' '}

          <Link to="/user/login">
            Sign in
          </Link>

        </div>

      </div>

    </div>

  )
}

export default UserRegister
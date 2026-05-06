import React from 'react'

import axios from 'axios'

import { Link, useNavigate } from 'react-router-dom'

import '../../styles/auth-shared.css'


const CreatorRegister = () => {

  const navigate = useNavigate()



  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      const creatorName = e.target.creatorName.value
      const contactName = e.target.contactName.value
      const phone = e.target.phone.value
      const email = e.target.email.value
      const password = e.target.password.value
      const address = e.target.address.value



      await axios.post(
        "http://localhost:3000/api/auth/creator/register",
        {
          name: creatorName,
          contactName,
          phone,
          email,
          password,
          address
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
        aria-labelledby="creator-register-title"
      >

        <header>

          <h1
            id="creator-register-title"
            className="auth-title"
          >
            Creator Sign Up
          </h1>

          <p className="auth-subtitle">
            Share gameplay clips with the community.
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

          <div className="field-group">

            <label htmlFor="creatorName">
              Creator Name
            </label>

            <input
              id="creatorName"
              name="creatorName"
              placeholder="GameClipsTV"
            />

          </div>



          <div className="two-col">

            <div className="field-group">

              <label htmlFor="contactName">
                Contact Name
              </label>

              <input
                id="contactName"
                name="contactName"
                placeholder="John Doe"
              />

            </div>



            <div className="field-group">

              <label htmlFor="phone">
                Phone
              </label>

              <input
                id="phone"
                name="phone"
                placeholder="+1 555 123 4567"
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
              placeholder="Create password"
              autoComplete="new-password"
            />

          </div>



          <div className="field-group">

            <label htmlFor="address">
              Address
            </label>

            <input
              id="address"
              name="address"
              placeholder="Your location"
            />

          </div>



          <button
            className="auth-submit"
            type="submit"
          >
            Create Creator Account
          </button>

        </form>



        <div className="auth-alt-action">

          Already a creator?{' '}

          <Link to="/creator/login">
            Sign in
          </Link>

        </div>

      </div>

    </div>

  )
}

export default CreatorRegister;
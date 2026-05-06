import React from 'react'

import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom'


import UserRegister from '../pages/auth/UserRegister'
import UserLogin from '../pages/auth/UserLogin'

import CreatorRegister from '../pages/auth/CreatorRegister'
import CreatorLogin from '../pages/auth/CreatorLogin'

import ChooseRegister from '../pages/auth/ChooseRegister'

import Home from '../pages/general/Home'
import Saved from '../pages/general/Saved'

import UploadClip from '../pages/creator/UploadClip'
import Profile from '../pages/creator/Profile'

import BottomNav from '../components/BottomNav'


const LayoutWithNav = ({ children }) => {

  return (
    <>
      {children}
      <BottomNav />
    </>
  )

}


const AppRoutes = () => {

  return (

    <Router>

      <Routes>

        {/* AUTH */}
        <Route
          path="/register"
          element={<ChooseRegister />}
        />

        <Route
          path="/user/register"
          element={<UserRegister />}
        />

        <Route
          path="/user/login"
          element={<UserLogin />}
        />

        <Route
          path="/creator/register"
          element={<CreatorRegister />}
        />

        <Route
          path="/creator/login"
          element={<CreatorLogin />}
        />



        {/* GENERAL */}
        <Route
          path="/"
          element={
            <LayoutWithNav>
              <Home />
            </LayoutWithNav>
          }
        />

        <Route
          path="/saved"
          element={
            <LayoutWithNav>
              <Saved />
            </LayoutWithNav>
          }
        />



        {/* CREATOR */}
        <Route
          path="/upload-clip"
          element={<UploadClip />}
        />

        <Route
          path="/creator/:id"
          element={<Profile />}
        />

      </Routes>

    </Router>

  )
}

export default AppRoutes
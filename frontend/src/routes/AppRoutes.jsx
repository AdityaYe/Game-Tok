import React from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import CreatorRoute from "./CreateRoute";

const UserRegister = lazy(() => import("../pages/auth/UserRegister"));
const UserLogin = lazy(() => import("../pages/auth/UserLogin"));

const CreatorRegister = lazy(() => import("../pages/auth/CreatorRegister"));
const CreatorLogin = lazy(() => import("../pages/auth/CreatorLogin"));

const ChooseRegister = lazy(() => import("../pages/auth/ChooseRegister"));
const CreatorDashboard = lazy(
  () => import("../pages/creator/CreatorDashboard"),
);

const Home = lazy(() => import("../pages/general/Home"));
const Saved = lazy(() => import("../pages/general/Saved"));

const UploadClip = lazy(() => import("../pages/creator/UploadClip"));
const Profile = lazy(() => import("../pages/creator/Profile"));

import BottomNav from "../components/BottomNav";
import { Suspense } from "react";

const LayoutWithNav = ({ children }) => {
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <Suspense
        fallback={
          <>
            <FeedSkeleton />
            <FeedSkeleton />
          </>
        }>
        <Routes>
          {/* AUTH */}
          <Route path="/register" element={<ChooseRegister />} />
          <Route path="/user/register" element={<UserRegister />} />
          <Route path="/user/login" element={
             <GuestRoute>
              <UserLogin />
            </GuestRoute>
            } />
          <Route path="/creator/register" element={<CreatorRegister />} />
          <Route path="/creator/login" element={<CreatorLogin />} />
          {/* GENERAL */}
          <Route
            path="/"
            element={
              <LayoutWithNav>
                <Home />
              </LayoutWithNav>
            }
          />

          <Route element={<ProtectedRoute />}>
            <Route
              path="/saved"
              element={
                <ProtectedRoute>
                <LayoutWithNav>
                  <Saved />
                </LayoutWithNav>
                </ProtectedRoute>
              }
            />
          </Route>

          {/* CREATOR */}
          <Route path="/creator/:id" element={<Profile />} />

          <Route element={<CreatorRoute />}>
            <Route path="/upload-clip" element={
              <CreatorRoute>
                <UploadClip />
              </CreatorRoute>
              } />
            <Route path="/creator/dashboard" element={<CreatorDashboard />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;

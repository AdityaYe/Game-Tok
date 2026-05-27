import React, { lazy, Suspense } from "react";

import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./guards/ProtectedRoute";

import GuestRoute from "./guards/GuestRoute";

import FeedSkeleton from "../components/ui/skeletons/FeedSkeleton";
import AppShell from "../app/layouts/AppShell";
import FeedLayout from "../app/layouts/FeedLayout";

/* LAZY PAGES */

const UserRegister = lazy(() => import("../pages/auth/UserRegister"));

const UserLogin = lazy(() => import("../pages/auth/UserLogin"));

const Dashboard = lazy(
  () => import("../pages/creator/CreatorDashboard"),
);

const Home = lazy(() => import("../pages/general/Home"));

const Saved = lazy(() => import("../pages/general/Saved"));

const FollowingFeed = lazy(() => import("../pages/general/FollowingFeed"));

const ProfileHub = lazy(() => import("../pages/general/ProfileHub"));

const ProfileClipFeed = lazy(() => import("../pages/general/ProfileClipFeed"));

const Search = lazy(() => import("../components/Search"));

const SearchClipFeed = lazy(() => import("../pages/general/SearchClipFeed"));

const Notifications = lazy(() => import("../components/Notifications"));

const UploadClip = lazy(() => import("../pages/creator/UploadClip"));

const Profile = lazy(() => import("../pages/creator/Profile"));

const AppRoutes = () => {
  return (
    <Router>
      <Suspense
        fallback={
          <>
            <FeedSkeleton />
            <FeedSkeleton />
          </>
        }
      >
        <Routes>
          {/* AUTH */}

          <Route
            path="/register"
            element={
              <GuestRoute>
                <UserRegister />
              </GuestRoute>
            }
          />

          <Route
            path="/user/register"
            element={
              <GuestRoute>
                <UserRegister />
              </GuestRoute>
            }
          />

          <Route
            path="/user/login"
            element={
              <GuestRoute>
                <UserLogin />
              </GuestRoute>
            }
          />

          <Route path="/creator/register" element={<Navigate to="/user/register" replace />} />

          <Route path="/creator/login" element={<Navigate to="/user/login" replace />} />

          {/* GENERAL */}

          <Route
            path="/"
            element={
              <AppShell variant="feed">
                <FeedLayout>
                  <Home />
                </FeedLayout>
              </AppShell>
            }
          />

          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <AppShell variant="feed">
                  <FollowingFeed />
                </AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AppShell>
                  <ProfileHub />
                </AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/clips/:clipId"
            element={
              <ProtectedRoute>
                <AppShell variant="feed">
                  <ProfileClipFeed />
                </AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/search"
            element={
              <AppShell>
                <Search />
              </AppShell>
            }
          />

          <Route
            path="/search/clips/:clipId"
            element={
              <AppShell variant="feed">
                <SearchClipFeed />
              </AppShell>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <AppShell>
                  <Notifications />
                </AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/saved"
            element={
              <ProtectedRoute>
                <AppShell variant="feed">
                  <FeedLayout>
                    <Saved />
                  </FeedLayout>
                </AppShell>
              </ProtectedRoute>
            }
          />

          {/* CREATOR */}

          <Route
            path="/creator/:id"
            element={
              <AppShell>
                <Profile />
              </AppShell>
            }
          />

          <Route
            path="/profile/:id"
            element={
              <AppShell>
                <Profile />
              </AppShell>
            }
          />

          <Route
            path="/upload-clip"
            element={
              <ProtectedRoute>
                <AppShell>
                  <UploadClip />
                </AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppShell>
                  <Dashboard />
                </AppShell>
              </ProtectedRoute>
            }
          />

          <Route path="/my-clips" element={<Navigate to="/dashboard" replace />} />

          <Route path="/creator/dashboard" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;

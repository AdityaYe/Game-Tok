import React, { useEffect } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import axios from "axios";

import socket from "./socket";

/* PAGES */

import Home from "./pages/Home";

import Login from "./pages/Login";

import Register from "./pages/Register";

import Upload from "./pages/Upload";

import Saved from "./pages/Saved";

import Search from "./pages/Search";

import Notifications from "./pages/Notifications";

import CreatorDashboard from "./pages/CreatorDashboard";

import CreatorProfile from "./pages/CreatorProfile";

/* COMPONENTS */

import BottomNav from "./components/BottomNav";

/* STYLES */

import "./styles/global.css";

const App = () => {
  useEffect(() => {
    async function connectSocket() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/auth/me",

          {
            withCredentials: true,
          },
        );

        const user = response.data.user;

        if (user?._id) {
          socket.emit(
            "join",

            user._id,
          );
        }
      } catch (err) {
        console.log(err);
      }
    }

    connectSocket();
  }, []);

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/upload" element={<Upload />} />

          <Route path="/saved" element={<Saved />} />

          <Route path="/search" element={<Search />} />

          <Route path="/notifications" element={<Notifications />} />

          <Route path="/creator/dashboard" element={<CreatorDashboard />} />

          <Route path="/creator/:id" element={<CreatorProfile />} />
        </Routes>

        <BottomNav />
      </div>
    </BrowserRouter>
  );
};

export default App;

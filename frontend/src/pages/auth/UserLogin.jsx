import React from "react";

import { Link, useNavigate } from "react-router-dom";

import "../../styles/auth-shared.css";
import Button from "../../components/ui/form/Button";
import { useUserLogin } from "../../features/auth/hooks/useAuthMutations";

const UserLogin = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useUserLogin();

  const handleSubmit = (e) => {
    e.preventDefault();

    mutate(
      {
        email: e.target.email.value,
        password: e.target.password.value,
      },
      {
        onSuccess: () => navigate("/"),
      },
    );
  };

  return (
    <div className="auth-page-wrapper">
      <div
        className="auth-card"
        role="region"
        aria-labelledby="user-login-title"
      >
        <header>
          <h1 id="user-login-title" className="auth-title">
            Welcome Back
          </h1>

          <p className="auth-subtitle">
            Sign in to explore trending gaming clips.
          </p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div className="field-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <Button loading={isPending} type="submit">
            Sign In
          </Button>
        </form>

        <div className="auth-alt-action">
          New here? <Link to="/user/register">Create account</Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;

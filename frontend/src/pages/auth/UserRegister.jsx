import React from "react";

import { Link, useNavigate } from "react-router-dom";

import "../../styles/auth-shared.css";
import { useUserRegister } from "../../features/auth/hooks/useAuthMutations";

const UserRegister = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useUserRegister();

  const handleSubmit = (e) => {
    e.preventDefault();

    mutate(
      {
        fullName: `${e.target.firstName.value} ${e.target.lastName.value}`,
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
        aria-labelledby="user-register-title"
      >
        <header>
          <h1 id="user-register-title" className="auth-title">
            Create Your Account
          </h1>

          <p className="auth-subtitle">
            Join GameTok to watch, save, and post gaming clips.
          </p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="two-col">
            <div className="field-group">
              <label htmlFor="firstName">First Name</label>

              <input
                id="firstName"
                name="firstName"
                placeholder="John"
                autoComplete="given-name"
              />
            </div>

            <div className="field-group">
              <label htmlFor="lastName">Last Name</label>

              <input
                id="lastName"
                name="lastName"
                placeholder="Doe"
                autoComplete="family-name"
              />
            </div>
          </div>

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
              placeholder="Password"
              autoComplete="new-password"
            />
          </div>

          <button className="auth-submit" type="submit" disabled={isPending}>
            {isPending ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="auth-alt-action">
          Already have an account? <Link to="/user/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;

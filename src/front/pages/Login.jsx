import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import Animals2 from "../assets/img/animals-homepage2.jpg";

export const Login = () => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const { dispatch } = useGlobalReducer();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback("");

    if (email === "" || password === "") {
      setFeedback("Email and password are required.");
      return;
    }

    setIsLoading(true);

    try {
      const resp = await fetch(`${backendUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        setFeedback(data.msg || "Login failed.");
        return;
      }

      localStorage.setItem("jwt-token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("login-status", true);
      dispatch({ type: "LoggedIn" });

      if (localStorage.getItem("role") === "admin") {
        navigate("/private/clients");
      } else {
        navigate("/");
      }
    } catch (err) {
      setFeedback("Network error. Check backend URL.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container auth-wrap py-5">
        <div className="auth-card">
          <div
            className="auth-left"
            style={{ backgroundImage: `url(${Animals2})` }}
          >
            <div className="auth-left-content">
              <h1 className="auth-brand">VetCare</h1>
              <p className="auth-tagline">
                Keep everything in one place — your profile, your pets, and your appointments.
              </p>

              <div className="auth-badge">
                <span className="auth-dot" />
                Simple, caring veterinary support
              </div>
            </div>
          </div>

          <div className="auth-right">
            <h2 className="auth-title">Log in</h2>
            <p className="auth-subtitle">Sign in with your email and password.</p>

            {feedback !== "" && (
              <div className="alert alert-danger mb-3">{feedback}</div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  className="form-control auth-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Password</label>
                <input
                  className="form-control auth-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div className="auth-actions">
                <button
                  className="btn btn-vet auth-btn w-100"
                  disabled={isLoading}
                  type="submit"
                >
                  {isLoading ? "Loading..." : "Sign in"}
                </button>
              </div>

              <div className="auth-divider" />

              <div className="auth-links">
                <div className="text-center">
                  Don&apos;t have an account? <Link to="/signup">Sign up</Link>
                </div>
                <div className="text-center">
                  <Link to="/request-reset">Forgot your password?</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

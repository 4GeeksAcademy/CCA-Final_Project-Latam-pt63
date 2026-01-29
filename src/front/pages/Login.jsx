import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer"

export const Login = () => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const { store, dispatch } = useGlobalReducer()

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
      if (localStorage.getItem("role") == "admin"){
        navigate("/private/clients")
      }else{
        navigate("/");
      }
    } catch (err) {
      setFeedback("Network error. Check backend URL.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 450 }}>
      <h2 className="mb-3">Login</h2>

      {feedback !== "" && <div className="alert alert-danger">{feedback}</div>}

      <form onSubmit={handleSubmit} className="card p-3">
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            className="form-control"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.uy"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            className="form-control"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button className="btn rounded-0 w-100 text-light" style={{ background: "rgb(48, 130, 114)" }} disabled={isLoading}>
          {isLoading ? "Loading..." : "Sign in"}
        </button>

        <p className="mt-3 mb-0 text-center">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

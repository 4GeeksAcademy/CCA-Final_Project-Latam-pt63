import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Animals2 from "../assets/img/animals-homepage2.jpg";

export const Signup = () => {
  const navigate = useNavigate();

  const rawBase = import.meta.env.VITE_BACKEND_URL || "";
  const base = rawBase.replace(/\/$/, "");
  const apiBase = base.endsWith("/api") ? base : `${base}/api`;

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phonenumber: "",
    address: "",
    password: "",
  });

  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback("");

    const safeForm = {
      ...form,
      email: form.email.trim(),
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      address: form.address.trim(),
      phonenumber: form.phonenumber.trim(),
    };

    if (
      !safeForm.first_name ||
      !safeForm.last_name ||
      !safeForm.email ||
      !safeForm.phonenumber ||
      !safeForm.address ||
      !safeForm.password
    ) {
      setFeedback("All fields are required.");
      return;
    }

    setIsLoading(true);

    try {
      const resp = await fetch(`${apiBase}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(safeForm),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        setFeedback(data.msg || "Signup failed.");
        return;
      }

      navigate("/login");
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
                Create your account to manage your profile, your pets, and your appointments in minutes.
              </p>

              <div className="auth-badge">
                <span className="auth-dot" />
                Get started today — it&apos;s quick
              </div>
            </div>
          </div>

          <div className="auth-right">
            <h2 className="auth-title">Sign up</h2>
            <p className="auth-subtitle">Fill in your details to create an account.</p>

            {feedback !== "" && (
              <div className="alert alert-danger mb-3">{feedback}</div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">First name</label>
                  <input
                    className="form-control auth-input"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    placeholder="John"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Last name</label>
                  <input
                    className="form-control auth-input"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  className="form-control auth-input"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone number</label>
                <input
                  className="form-control auth-input"
                  name="phonenumber"
                  value={form.phonenumber}
                  onChange={handleChange}
                  placeholder="098123456"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Address</label>
                <input
                  className="form-control auth-input"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Street 123"
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Password</label>
                <input
                  className="form-control auth-input"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </div>

              <div className="auth-actions">
                <button
                  className="btn btn-vet auth-btn w-100"
                  disabled={isLoading}
                  type="submit"
                >
                  {isLoading ? "Loading..." : "Create account"}
                </button>
              </div>

              <div className="auth-divider" />

              <div className="auth-links">
                <div className="text-center">
                  Already have an account? <Link to="/login">Log in</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

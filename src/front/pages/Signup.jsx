import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Signup = () => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

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

    if (
      !form.first_name ||
      !form.last_name ||
      !form.email ||
      !form.phonenumber ||
      !form.address ||
      !form.password
    ) {
      setFeedback("All fields are required.");
      return;
    }

    setIsLoading(true);

    try {
      const resp = await fetch(`${backendUrl}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
    <div className="container py-5 min-vh-100" style={{ maxWidth: 520 }}>
      <h2 className="mb-3">Sign up</h2>

      {feedback !== "" && <div className="alert alert-danger">{feedback}</div>}

      <form onSubmit={handleSubmit} className="card p-3 square">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">First name</label>
            <input
              className="form-control square"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Last name</label>
            <input
              className="form-control square"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            className="form-control square"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="email@example.uy"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone number</label>
          <input
            className="form-control square"
            name="phonenumber"
            value={form.phonenumber}
            onChange={handleChange}
            placeholder="098123456"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          <input
            className="form-control square"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Street 123"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            className="form-control square"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <button
          className="btn w-100 text-light square"
          disabled={isLoading}
          style={{ background: "rgb(48, 130, 114)" }}
          type="submit"
        >
          {isLoading ? "Loading..." : "Create account"}
        </button>

        <p className="mt-3 mb-0 text-center">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};


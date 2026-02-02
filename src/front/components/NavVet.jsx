import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const NavVet = () => {
  const navigate = useNavigate();
  const { dispatch } = useGlobalReducer();

  const login = localStorage.getItem("login-status");

  const Logout = () => {
    dispatch({
      type: "LoggedOut",
    });
    localStorage.removeItem("jwt-token");
    localStorage.removeItem("login-status");
  };

  if (login) {
    return (
      <>
        <div className="border-bottom bg-white fixed-top w-100">
          <div className="container py-3">
            <div className="d-flex align-items-center justify-content-between">
              <Link
                to="/"
                className="text-decoration-none text-dark d-flex align-items-center gap-2"
              >
                <img
                  src="https://img.freepik.com/vector-gratis/estilo-impresion-patas_78370-7626.jpg"
                  alt=""
                  style={{ width: 44, height: 44, background: "#000" }}
                />

                <div className="lh-sm">
                  <div className="fw-bold" style={{ letterSpacing: 1 }}>
                    VetCare
                  </div>
                  <small className="text-muted">VETERINARY CLINIC</small>
                </div>
              </Link>

              <div className="d-flex align-items-center gap-4 ms-auto me-4">
                <Link className="nav-link text-dark p-0" to="/">
                  Home
                </Link>
                <Link className="nav-link text-dark p-0" to="/services">
                  Services
                </Link>
                <Link className="nav-link text-dark p-0" to="/about">
                  About Us
                </Link>
                <Link className="nav-link text-dark p-0" to="/book">
                  Book Appointment
                </Link>
                <Link className="nav-link text-dark p-0" to="/profile">
                  Profile
                </Link>
              </div>

              <Link to="/">
                <button
                  className="btn text-white px-4 py-2 rounded-0"
                  style={{ background: "rgb(48, 130, 114)" }}
                  onClick={Logout}
                >
                  Logout
                </button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <div className="border-bottom bg-white fixed-top w-100">
        <div className="container py-3">
          <div className="d-flex align-items-center justify-content-between">
            <Link
              to="/"
              className="text-decoration-none text-dark d-flex align-items-center gap-2"
            >
              <img
                src="https://img.freepik.com/vector-gratis/estilo-impresion-patas_78370-7626.jpg"
                alt=""
                style={{ width: 44, height: 44, background: "#000" }}
              />

              <div className="lh-sm">
                <div className="fw-bold" style={{ letterSpacing: 1 }}>
                  VetCare
                </div>
                <small className="text-muted">VETERINARY CLINIC</small>
              </div>
            </Link>

            <div className="d-flex align-items-center gap-4 ms-auto me-4">
              <Link className="nav-link text-dark p-0" to="/">
                Home
              </Link>
              <Link className="nav-link text-dark p-0" to="/services">
                Services
              </Link>
              <Link className="nav-link text-dark p-0" to="/about">
                About Us
              </Link>
              <Link className="nav-link text-dark p-0" to="/book">
                Book Appointment
              </Link>
            </div>

            <button
              className="btn text-white px-4 py-2 rounded-0"
              style={{ background: "rgb(48, 130, 114)" }}
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }
};

import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const AdminNavbar = () => {
  const { dispatch } = useGlobalReducer();

  const Logout = () => {
    dispatch({
      type: "LoggedOut",
    });
    localStorage.removeItem("jwt-token");
    localStorage.removeItem("login-status");
    localStorage.removeItem("role");
  };
  window.dispatchEvent(new Event("storageUpdate"));

  return (
    <>
      <div
        className="d-flex flex-column flex-shrink-0 p-3 text-white fixed-top min-vh-100 bg-white"
        style={{ width: "15%" }}
      >
        <a
          href="/private/clients"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none"
        >
          <i
            className="fa-solid fa-paw ms-4 fs-2"
            style={{ transform: "rotate(45deg)" }}
          ></i>
          <div className="fs-4 ps-3">VetCare</div>
        </a>
        <hr className="border-secondary"></hr>
        <div className="d-flex flex-column">
          <Link
            to={"/private/clients"}
            className="nav-link active"
            aria-current="page"
          >
            <button
              type="button"
              className="btn w-75 rounded ms-3 admin-navbar-buttons d-flex  align-items-center"
            >
              <i className="fa-solid fa-users justify-self-start ms-4"></i>
              <div className="ms-3">Clients</div>
            </button>
          </Link>
          <Link to={"/private/pets"} href="#" className="nav-link text-white">
            <button
              type="button"
              className=" btn w-75 rounded ms-3 mt-3 admin-navbar-buttons d-flex align-items-center"
            >
              <i className="fa-solid fa-paw justify-self-start ms-4"></i>
              <div className="ms-3">Pets</div>
            </button>
          </Link>
          <Link to={"/private/agenda"} className="nav-link text-white">
            <button
              type="button"
              className="btn w-75 rounded ms-3 mt-3 admin-navbar-buttons d-flex align-items-center"
            >
              <i className="fa-solid fa-calendar justify-self-start ms-4"></i>
              <div className="ms-3">Agenda</div>
            </button>
          </Link>
        </div>
        <hr className="mt-auto border-secondary"></hr>
        <div className="ms-4">
          <Link to="/">
            <button
              type="button"
              className=" w-75 rounded ms-3 bg-light text-dark"
              onClick={Logout}
            >
              <div>Logout</div>
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

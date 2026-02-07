import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import Swal from "sweetalert2";

export const EditProfile = () => {
  const { dispatch } = useGlobalReducer;

  const { userId } = useParams();
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [user, setUser] = useState({
    address: "",
    email: "",
    first_name: "",
    last_name: "",
    phonenumber: "",
    user_id: "",
  });

  const Logout = () => {
    localStorage.removeItem("jwt-token");
    localStorage.removeItem("login-status");
  };

  const HandleSubmit = (e) => {
    e.preventDefault();
  };

  const HandleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const ProfileInfo = async () => {
    try {
      const token = localStorage.getItem("jwt-token");
      const result = await fetch(backendUrl + "/users/" + userId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await result.json();
      if (!result.ok) {
        Swal.fire({
          title: "Error!",
          text: data.msg,
          icon: "error",
          confirmButtonText: "Return",
        });
        navigate("/");
      } else if (result.ok) {
        setUser({ ...data.user });
        console.log("user :", user);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const UpdateInfo = async () => {
    try {
      const token = localStorage.getItem("jwt-token");
      const result = await fetch(backendUrl + "/users/" + userId, {
        method: "PUT",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await result.json();
      if (!result.ok) {
        Swal.fire({
          title: "Error!",
          text: data.msg,
          icon: "error",
          confirmButtonText: "Ok",
        });
      } else {
        Swal.fire({
          title: "Success",
          text: data.msg,
          icon: "success",
          confirmButtonText: "Cool",
        });
        navigate("/profile");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    ProfileInfo();
  }, []);

  return (
    <div className="container py-5 min-vh-100" style={{ maxWidth: "550px" }}>
      <h2 className="mb-3">Edit Profile</h2>

      {}
      <form className="card p-4 border-0 shadow-sm" onSubmit={HandleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">First name</label>
            <input
              className="form-control"
              name="first_name"
              value={user.first_name}
              onChange={HandleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Last name</label>
            <input
              className="form-control"
              name="last_name"
              value={user.last_name}
              onChange={HandleChange}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            className="form-control bg-light"
            type="email"
            name="email"
            value={user.email}
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone number</label>
          <input
            className="form-control"
            name="phonenumber"
            value={user.phonenumber}
            onChange={HandleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          <input
            className="form-control"
            name="address"
            value={user.address}
            onChange={HandleChange}
          />
        </div>

        {}
        <button
          type="button"
          className="btn rounded-0 w-100 text-light mt-2"
          onClick={() => UpdateInfo()}
          style={{ background: "rgb(48, 130, 114)" }}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

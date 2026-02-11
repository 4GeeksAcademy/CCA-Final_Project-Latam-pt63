import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export const EditProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    address: "",
    email: "",
    first_name: "",
    last_name: "",
    phonenumber: "",
    user_id: "",
  });

  const HandleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const ProfileInfo = async () => {
    try {
      const token = localStorage.getItem("jwt-token");
      if (!token) {
        navigate("/");
        return;
      }

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
          text: data.msg || "Could not load profile",
          icon: "error",
          confirmButtonText: "Return",
        });
        navigate("/");
      } else {
        setUser({ ...data.user });
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Connection error", "error");
    } finally {
      setLoading(false);
    }
  };

  const UpdateInfo = async (e) => {
    e.preventDefault();
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
        await Swal.fire({
          title: "Success",
          text: "Profile updated successfully!",
          icon: "success",
          confirmButtonText: "Cool",
        });
        navigate("/profile");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Connection error", "error");
    }
  };

  useEffect(() => {
    ProfileInfo();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div
          className="spinner-border"
          style={{ color: "rgb(48, 130, 114)", width: "3rem", height: "3rem" }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 min-vh-100" style={{ maxWidth: "550px" }}>
      <h2 className="mb-3">Edit Profile</h2>

      <form className="card p-4 border-0 shadow-sm" onSubmit={UpdateInfo}>
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
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary w-50"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn  w-50 text-light"
            style={{ background: "rgb(48, 130, 114)" }}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

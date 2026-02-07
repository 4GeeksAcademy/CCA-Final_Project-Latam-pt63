import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const RequestReset = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();

  const [email, setEmail] = useState({
    email: "",
    confirmemail: "",
  });

  const HandleChange = (e) => {
    setEmail({
      ...email,
      [e.target.name]: e.target.value,
    });
  };
  const HandleSubmit = (e) => {
    e.preventDefault();
  };

  const RequestEmail = async () => {
    try {
      if (email.email !== email.confirmemail) {
        Swal.fire({
          title: "Warning",
          text: "Emails dont match",
          icon: "warning",
          confirmButtonText: "Ok",
        });
        return;
      }
      const result = await fetch(backendUrl + "/send-recovery-link", {
        method: "POST",
        body: JSON.stringify(email),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await result.json();
      if (result.ok) {
        Swal.fire({
          title: "Success",
          text: data.msg,
          icon: "success",
          confirmButtonText: "Return",
        });
        navigate("/");
      } else {
        Swal.fire({
          title: "Error",
          text: data.msg,
          icon: "warning",
          confirmButtonText: "Return",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="container min-vh-100">
        <h1 className="mt-3 text-center">Password Reset</h1>
        <div className="d-flex justify-content-center">
          <form className="card col-6 p-3 mt-5" onSubmit={HandleSubmit}>
            <div className="col-md-12 mb-3">
              <label className="form-label">Enter your email</label>
              <input
                className="form-control"
                name="email"
                value={email.email}
                placeholder="valid@email.com"
                onChange={HandleChange}
              />
            </div>
            <div className="col-md-12 mb-3">
              <label className="form-label">Confirm Email</label>
              <input
                className="form-control"
                name="confirmemail"
                type="email"
                value={email.confirmemail}
                onChange={HandleChange}
              />
            </div>
            <div className="d-flex justify-content-center ">
              <button
                type="button"
                className="btn rounded-1 text-light custom-green-background"
                onClick={() => RequestEmail()}
                style={{ background: "rgb(48, 130, 114)"}}
              >
                Request password reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export const PasswordReset = () => {
  const { Uuid } = useParams();
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [feedback, setFeedback] = useState("");

  const [info, setInfo] = useState({
    password: "",
    confirmpassword: "",
  });

  const HandleChange = (e) => {
    setInfo({
      ...info,
      [e.target.name]: e.target.value,
    });
  };

  const HandleSubmit = (e) => {
    e.preventDefault();
    setFeedback("");
    if ( !info.password || !info.confirmpassword) {
      setFeedback("All fields are required.");
      return;
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(info.password)) {
      setFeedback(
        "Password must be at least 8 characters, with 1 uppercase, 1 lowercase, 1 number, and 1 special character.",
      );
      setForm({ ...info, password: "" });
      return;
    }
  };

  const ResetPassword = async () => {
    try {
      if (info.password !== info.confirmpassword) {
        Swal.fire({
          title: "Error!",
          text: "Passwords dont match",
          icon: "warning",
          confirmButtonText: "Ok",
        });
        return;
      }
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(info.password)) {
        setFeedback(
          "Password must be at least 8 characters, with 1 uppercase, 1 lowercase, 1 number, and 1 special character.",
        );
        setForm({ ...info, password: "", confirmpassword: "" });
        return;
      } else {
        const result = await fetch(backendUrl + "/reset-password/" + Uuid, {
          method: "PUT",
          body: JSON.stringify(info),
          headers: {
            "Content-Type": "application/json",
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
          return;
        } else {
          Swal.fire({
            title: "Success!",
            text: data.msg,
            icon: "success",
            confirmButtonText: "Go to Homepage",
          });
          navigate("/");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div className="container min-vh-100">
        <h1 className="mt-3 text-center d-flex justify-content-center">
          Reset Password
        </h1>
        {feedback !== "" && (
          <div className="d-flex justify-content-center">
            <div className="col-6 alert alert-danger mt-3 d-flex justify-content-center">
              {feedback}
            </div>
          </div>
        )}
        <div className="d-flex justify-content-center">
          <form className="card col-6 p-3 mt-3" onSubmit={HandleSubmit}>
            <div className="col-md-12 mb-3">
              <label className="form-label">New Password</label>
              <input
                className="form-control"
                name="password"
                type="password"
                value={info.password}
                onChange={HandleChange}
              />
            </div>
            <div className="col-md-12 mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                className="form-control"
                type="password"
                name="confirmpassword"
                value={info.confirmpassword}
                onChange={HandleChange}
              />
            </div>
            <div className="d-flex justify-content-center ">
              <button
                className="btn rounded-1 text-light custom-green-background"
                onClick={() => ResetPassword()}
                style={{ background: "rgb(48, 130, 114)" }}
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

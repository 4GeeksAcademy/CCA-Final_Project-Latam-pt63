import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

export const ModalEditClient = ({ show, onClose, onSave, client }) => {
  const [newClient, setNewClient] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phonenumber: "",
    address: "",
    user_id: ""
  });

  const handleChange = (e) => {
    setNewClient({
      ...newClient,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (client) {
      setNewClient({
        first_name: client.first_name,
        last_name: client.last_name,
        email: client.email,
        address: client.address,
        phonenumber: client.phonenumber,
        user_id: client.user_id
      });
    }
  }, [show]);

  const handleSubmit = () => {
    if (
      newClient.first_name.trim() == "" ||
      newClient.last_name.trim() == "" ||
      newClient.email.trim() == "" ||
      newClient.address.trim() == "" ||
      newClient.phonenumber.trim() == ""
    ) {
      Swal.fire({
        title: "Error!",
        text: "Please complete all fields",
        icon: "warning",
        confirmButtonText: "Ok",
      });
      return;
    }
    onSave(newClient);
    handleClose();
  };

  const handleClose = () => {
    setNewClient({
      first_name: "",
      last_name: "",
      email: "",
      phonenumber: "",
      address: "",
    });
    onClose();
  };

  if (!show) return null;

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow rounded-4">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold text-dark">Edit Client</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body p-4">
            <form className=" p-2">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">First name</label>
                  <input
                    className="form-control"
                    name="first_name"
                    value={newClient.first_name}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Last name</label>
                  <input
                    className="form-control"
                    name="last_name"
                    value={newClient.last_name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  className="form-control"
                  type="email"
                  name="email"
                  value={newClient.email}
                  onChange={handleChange}
                  placeholder="email@example.uy"
                  disabled
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone number</label>
                <input
                  className="form-control"
                  name="phonenumber"
                  value={newClient.phonenumber}
                  onChange={handleChange}
                  placeholder="098123456"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Address</label>
                <input
                  className="form-control"
                  name="address"
                  value={newClient.address}
                  onChange={handleChange}
                  placeholder="Street 123"
                />
              </div>

              <button
                type="button"
                className="btn rounded-2 w-100 text-light"
                style={{ background: "rgb(48, 130, 114)" }}
                onClick={() => {
                  handleSubmit();
                }}
              >
                Edit Client
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

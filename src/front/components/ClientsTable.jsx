import { Link, useNavigate } from "react-router-dom";
import { ModalEditClient } from "./ModalEditClient";
import { useState } from "react";
import Swal from "sweetalert2";

export const ClientsTable = ({ user = [], setClients}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;


  const handleEditClient = async (client) => {
    try {
      const token = localStorage.getItem("jwt-token");
      const result = await fetch(backendUrl + "/users/" + client.user_id, {
        method: "PUT",
        body: JSON.stringify(client),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await result.json();
      if (result.ok) {
        setClients((prevClients) =>
          prevClients.map((c) =>
            c.user_id === client.user_id ? { ...c, ...client } : c
          )
        );
        Swal.fire({
          title: "Success",
          text: data.msg,
          icon: "success",
          confirmButtonText: "Ok",
        });
        
      } else {
        Swal.fire({
          title: "Error!",
          text: data.msg,
          icon: "error",
          confirmButtonText: "Return",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container my-4 min-vh-100 ms-5 ps-5">
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden border-top">
        <div className="row bg-light px-4 py-3 fw-semibold text-muted small">
          <div className="col-3">Name</div>
          <div className="col-3">Contact</div>
          <div className="col-3">Address</div>
          <div className="col-2">Pets</div>
          <div className="col-1 text-end">Actions</div>
        </div>

        {user.map((user, i) => (
          <div key={i} className="row align-items-center px-4 py-3 border-top">
            <div className="col-3 d-flex align-items-center gap-2">
              <div
                className="rounded-circle bg-success-subtle text-success fw-bold d-flex align-items-center justify-content-center"
                style={{ width: 36, height: 36 }}
              >
                {user.first_name?.charAt(0)}
              </div>
              <span className="fw-medium">
                {user.first_name} {user.last_name}
              </span>
            </div>
            <div className="col-3 text-muted small">
              <div>
                <i className="fa-solid fa-phone me-2"></i>
                {user.phonenumber}
              </div>
              <div>
                <i className="fa-solid fa-envelope me-2"></i>
                {user.email}
              </div>
            </div>
            <div className="col-3 text-muted small">
              <i className="fa-solid fa-location-dot me-2"></i>
              {user.address}
            </div>
            <div className="col-2">
              <span className="badge rounded-pill bg-success-subtle text-success px-3 py-2">
                {user.pets.length} Pets
              </span>
            </div>
            <div className="col-1 text-end small">
              <Link
                to={`/private/clients/${user.user_id}`}
                className="text-decoration-none"
              >
                <a className="text-success me-2 text-decoration-none">View</a>
              </Link>
              <a
                className="text-muted text-decoration-none pointer"
                onClick={() => {
                  setSelectedClient(user);
                  setShowEditModal(true);
                }}
              >
                Edit
              </a>
            </div>
          </div>
        ))}
      </div>
      <ModalEditClient
        client={selectedClient}
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleEditClient}
      />
    </div>
  );
};

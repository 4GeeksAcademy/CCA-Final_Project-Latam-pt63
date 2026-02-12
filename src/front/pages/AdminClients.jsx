import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { ClientsTable } from "../components/ClientsTable";
import { ModalNewClient } from "../components/ModalNewClient";

export const AdminClients = () => {
  const [showModal, setShowModal] = useState(false);
  const [clients, setClients] = useState(null);
  const Logout = () => {
    localStorage.removeItem("jwt-token");
    localStorage.removeItem("login-status");
    localStorage.removeItem("role");
  };
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleAddClient = async (client) => {
    try {
      const result = await fetch(backendUrl + "/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(client),
      });
      const data = await result.json();
      if (result.ok) {
        Swal.fire({
          title: "Success",
          text: data.msg,
          icon: "success",
          confirmButtonText: "Ok",
        });
        VerifyAdmin();
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

  const VerifyAdmin = async () => {
    try {
      const token = localStorage.getItem("jwt-token");
      const result = await fetch(backendUrl + "/private", {
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
        Logout();
        navigate("/");
      } else {
        const users = await fetch(backendUrl + "/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const clientsData = await users.json();
        if (users.ok) {
          setClients(clientsData.users);
        } else {
          setClients([]);
        }
      }
    } catch (error) {
      console.error(error);
      setClients([]);
    }
  };

  useEffect(() => {
    VerifyAdmin();
  }, []);

  if (!clients) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container min-vh-100">
        <div className="d-flex ms-5 mt-0">
          <div className="ms-2">
            <div className="mt-3 justify-content-between ms-5 ps-1">
              <h1>Clients</h1>
            </div>
          </div>
          <div className="mt-3 ms-auto">
            <button
              type="button"
              className="btn custom-green-background rounded text-white"
              style={{ background: "rgb(48, 130, 114)" }}
              onClick={() => {
                setShowModal(true);
              }}
            >
              + New Client
            </button>
          </div>
        </div>
        <ClientsTable user={clients} setClients={setClients} />
      </div>
      <ModalNewClient
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleAddClient}
      />
    </>
  );
};
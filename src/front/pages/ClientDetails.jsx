import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ClientInfoCard } from "../components/ClientInfoCard";
import { ClientInfoPetCard } from "../components/ClientInfoPetCard";
import { AdminClientHistoryCard } from "../components/AdminClientHistoryCard";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

export const ClientDetails = () => {
  const [clientInfo, setClientInfo] = useState(null);
  const [clientPets, setClientPets] = useState([]);
  const [history, setHistory] = useState([]);

  const navigate = useNavigate();

  const { clientId } = useParams();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const calculateAge = (birthdateString) => {
    if (!birthdateString) return "N/A";
    const birthDate = new Date(birthdateString);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      years--;
    }

    if (years === 0) {
      let months =
        (today.getFullYear() - birthDate.getFullYear()) * 12 +
        (today.getMonth() - birthDate.getMonth());
      if (months < 0) months = 0;
      return months === 1 ? "1 month" : months + " months";
    }

    return years === 1 ? "1 year" : years + " years";
  };

  const AppointmentHistory = async (pets) => {
    const allHistory = pets.map(async (pet) => {
      const token = localStorage.getItem("jwt-token");
      const result = await fetch(backendUrl + "/history/" + pet.pet_id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await result.json();
      return data.history;
    });
    const HistoryData = await Promise.all(allHistory);
    const flatHistory = HistoryData.flat().sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
    setHistory(flatHistory);
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
        navigate("/");
      }

      const user = await fetch(backendUrl + "/users/" + clientId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const userData = await user.json();

      if (!user.ok) {
        Swal.fire({
          title: "Error!",
          text: userData.msg,
          icon: "error",
          confirmButtonText: "Return",
        });
      }

      setClientInfo({ ...userData.user });

      if (userData.user.pets) {
        const petsWithAge = userData.user.pets.map((pet) => ({
          ...pet,
          age: calculateAge(pet.birthdate),
        }));
        setClientPets(petsWithAge);
        AppointmentHistory(userData.user.pets);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    VerifyAdmin();
  }, []);

  if (!clientInfo) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border " role="status" style={{ color: "rgb(48, 130, 114)", width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container min-vh-100 text-capitalize">
       
        <ClientInfoCard info={clientInfo} />

        <div className="mt-3 ms-5 ps-5">
          <div className="card border-0 shadow-sm rounded-4">
            <h5 className="card-header bg-white border-bottom d-flex align-items-center py-3">
              <i className="fa-solid fa-paw me-3 text-success"></i>Registered
              Pets
              <div
                className="rounded-circle bg-success-subtle text-success fw-bold d-flex align-items-center justify-content-center ms-2"
                style={{ width: 30, height: 30 }}
              >
                <div className="text-center fs-6">{clientPets.length}</div>
              </div>
            </h5>
            <div className="card-body bg-light">
              <div className="row g-3">
                {clientPets.length > 0 ? (
                  clientPets.map((pet, index) => {
                    return (
                      <div key={index} className="col-md-6 col-lg-4">
                        <ClientInfoPetCard info={pet} />
                      </div>
                    );
                  })
                ) : (
                  <p className="text-muted text-center m-0">
                    No pets registered.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 ms-5 mb-5 ps-5">
          <div className="card border-0 shadow-sm rounded-4">
            <h5 className="card-header bg-white border-bottom py-3 d-flex align-items-center">
              <i className="fa-solid fa-clock-rotate-left me-3 text-primary"></i>
              Appointment History
              <div
                className="rounded-circle bg-primary-subtle text-primary fw-bold d-flex align-items-center justify-content-center ms-2"
                style={{ width: 30, height: 30 }}
              >
                <div className="text-center fs-6">{history.length}</div>
              </div>
            </h5>
            <div className="card-body p-3">
              {history.length > 0 ? (
                history.map((record, index) => (
                  <AdminClientHistoryCard key={index} record={record} />
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted m-0">
                    No appointment history found for this client.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ClientInfoCard } from "../components/ClientInfoCard";
import { ClientInfoPetCard } from "../components/ClientInfoPetCard";
import { AdminClientHistoryCard } from "../components/AdminClientHistoryCard";
import Swal from "sweetalert2";

export const ClientDetails = () => {
  const [clientInfo, setClientInfo] = useState({});
  const [clientPets, setClientPets] = useState([]);
  const [history, setHistory] = useState([]);

  const navigate = useNavigate();

  const { clientId } = useParams();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

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
    setHistory(HistoryData.flat());
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
      setClientPets(userData.user.pets);
      AppointmentHistory(userData.user.pets);
      console.log(history);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    VerifyAdmin();
  }, []);

  return (
    <>
      <div className="container min-vh-100">
        <ClientInfoCard info={clientInfo} />
        <div className="mt-3 ms-5 ps-5">
          <div class="card rounded-4">
            <h5 class="card-header d-flex align-items-center">
              <i className="fa-solid fa-paw me-3"></i>Registered Pets{" "}
              <div
                className="rounded-circle custom-green-background  fw-bold d-flex align-items-center justify-content-center ms-2"
                style={{ width: 30, height: 30 }}
              >
                <div className="text-center fs-5 ">{clientPets.length}</div>
              </div>
            </h5>
            <div class="card-body">
              <div className="row">
                {clientPets.map((pet) => {
                  return <ClientInfoPetCard info={pet} />;
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 ms-5 mb-5 ps-5">
          <div class="card rounded-4">
            <h5 class="card-header d-flex align-items-center ">
              <i className="fa-solid fa-calendar me-3"></i>Appointment History{" "}
              <div
                className="rounded-circle custom-green-background  fw-bold d-flex align-items-center justify-content-center ms-2"
                style={{ width: 30, height: 30 }}
              >
                <div className="text-center fs-5 ">{history.length}</div>
              </div>
            </h5>
            <div class="card-body">
              {history.map((appointment) => {
                return <AdminClientHistoryCard record={appointment} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

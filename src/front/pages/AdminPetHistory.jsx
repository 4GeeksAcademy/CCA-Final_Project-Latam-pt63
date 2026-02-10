import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AdminPetsAppointmentCard } from "../components/AdminPetsAppointmentCard";
import Swal from "sweetalert2";
import { set } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const AdminPetHistory = () => {
  const [pet, setPet] = useState({});
  const [history, setHistory] = useState([]);
  const [vaccines, setVaccines] = useState([]);

  const Logout = () => {
    localStorage.removeItem("jwt-token");
    localStorage.removeItem("login-status");
    localStorage.removeItem("role");
  };

  const navigate = useNavigate();

  window.dispatchEvent(new Event("storageUpdate"));

  const placeholderImage =
    "https://w7.pngwing.com/pngs/573/926/png-transparent-paw-dog-paw-prints-animals-photography-paw.png";

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { petId } = useParams();

  const calculateAge = (dob) => {
    if (!dob) return "Unknown";
    
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return "Unknown";

    const today = new Date();
    
    let years = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        years--;
    }
    
    if (years === 0) {
        let months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
        if (today.getDate() < birthDate.getDate()) {
            months--;
        }
        if (months <= 0) return "Newborn"; 
        return months === 1 ? "1 month" : `${months} months`;
    }
    
    return years === 1 ? "1 year" : `${years} years`;
  };

  const VerifyAdmin = async () => {
    try {
      const token = localStorage.getItem("jwt-token");
      const result = await fetch(backendUrl + "/pet/" + petId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await result.json();
      if (result.ok) {
        setPet({ ...data });
        const historyResult = await fetch(backendUrl + "/history/" + petId, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const historyData = await historyResult.json();
        if (historyResult.ok) {
          setHistory(historyData.history);
          const vaccinesResult = await fetch(backendUrl + "/vaccine/" + petId, {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              Authorization: "Bearer " + token,
            },
          });
          const vaccineData = await vaccinesResult.json();
          if (vaccinesResult.ok) {
            setVaccines(vaccineData.vaccines);
          }
        }
      } else {
        Swal.fire({
          title: "Error!",
          text: data.msg,
          icon: "error",
          confirmButtonText: "Return",
        });
        Logout();
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    VerifyAdmin();
  }, []);

  return (
    <>
      <div className="container">
        <div className="ms-5">
          <div className="ms-5">
            <div className="ms-5">
              <Link
                to="/private/pets"
                className="text-decoration-none text-muted mb-2 d-inline-block"
              >
                <i className="fa-solid fa-arrow-left me-2"></i> Back to Pets
              </Link>
              <h1>Medical History - {pet.name}</h1>
            </div>
            <div className="banner d-flex bg-vet p-4 rounded-4 ms-5">
              <div style={{ width: "70px", height: "70px", flexShrink: 0 }}>
                <img
                  src={pet.image ? pet.image : placeholderImage}
                  className="w-100 h-100 rounded-circle object-fit-cover"
                  alt={pet.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = placeholderImage;
                  }}
                />
              </div>
              <div className="ms-4">
                <div style={{ fontSize: "14px" }}>Type:</div>
                <div className="mt-1" style={{ fontSize: "14px" }}>
                  Breed:
                </div>
                <div className="mt-1" style={{ fontSize: "14px" }}>
                  Age:
                </div>
              </div>
              <div className="ms-3">
                <div>{pet.pet_type}</div>
                <div>{pet.breed}</div>
                <div>{calculateAge(pet.birthdate || pet.birth_date)}</div>
              </div>
              <div className="ms-auto mt-3">
                <div className="text-center" style={{ fontSize: "14px" }}>
                  Owner
                </div>
                <div>{pet.owner_name}</div>
              </div>
            </div>
          </div>
          <div className="ms-5">
            <div className="alert alert-warning mt-3 rounded-4 d-flex align-items-center ms-5">
              <div className="fs-2">
                <i className="fa-solid fa-circle-exclamation"></i>
              </div>
              <div className="ms-4">
                <div className="fs-5">Allergies and Special Conditions</div>
                <div className="fs-6">{pet.allergies}</div>
              </div>
            </div>
          </div>
          <div className="mt-3 ms-5 mb-5 ps-5">
            <div className="card rounded-4">
              <h5 className="card-header d-flex align-items-center ">
                <i className="fa-regular fa-file-lines me-3"></i>Appointment History
              </h5>
              <div>
                {history.length > 0 ? (
                  history.map((item) => {
                    return <AdminPetsAppointmentCard info={item} />;
                  })
                ) : (
                  <div className="alert alert-light text-center rounded-4 text-muted mt-2 mb-2 ms-2 me-2">
                    No Appointments registered.
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-3 ms-5 mb-5 ps-5">
            <div className="card rounded-4">
              <h5 className="card-header d-flex align-items-center ">
                <i className="fa-solid fa-syringe me-3"></i>Vaccines
              </h5>
              <div className="row ps-3 pe-3 pb-3">
                {vaccines.length > 0 ? (
                  vaccines.map((vaccine) => {
                    return (
                      <div className="col-6 mt-3">
                        <div className="card rounded-4">
                          <div className="card-header">
                            {vaccine.vaccine_name}
                          </div>
                          <div className="card-body pb-0">
                            <div className="d-flex">
                              <p className="card-text col-3">
                                Applied : {vaccine.vaccination_date}
                              </p>
                              <p className="card-text col-3">
                                Expires : {vaccine.expiry_date}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  
                    <div className="alert alert-light rounded-4 text-center text-muted mt-3 mb-0">
                      No vaccines registered.
                    
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
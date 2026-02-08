import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MedicalHistoryCard } from "../components/MedicalHistoryCard";
import petPlaceholder from "../assets/img/pet-placeholder.jpg";
import { VaccineCard } from "../components/VaccineCard";
import Swal from "sweetalert2";

export const PetInfo = () => {
  const Logout = () => {
    localStorage.removeItem("jwt-token");
    localStorage.removeItem("login-status");
    localStorage.removeItem("role");
  };

  const navigate = useNavigate();

  const [pet, setPet] = useState({
    name: "",
    pet_type: "",
    birthdate: "",
    breed: "",
    allergies: "",
    neutered: "",
    info: "",
    image: "",
    vaccines: "",
  });

  const [petHistory, setPetHistory] = useState([]);
  const [vaccines, setVaccines] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { petId } = useParams();
  const token = localStorage.getItem("jwt-token");

  const VerifyUser = async () => {
    try {
      const result = await fetch(backendUrl + "/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      await result.json();

      if (!result.ok) {
        Swal.fire({
          title: "Error!",
          text: "You must be logged in to access this page",
          icon: "error",
          confirmButtonText: "Return",
        });
        Logout();
        navigate("/");
        return;
      }

      const petRes = await fetch(backendUrl + "/pet/" + petId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const petData = await petRes.json();
      if (petRes.ok) setPet({ ...petData });

      const petRecord = await fetch(backendUrl + "/history/" + petId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const recordData = await petRecord.json();
      if (petRecord.ok) setPetHistory(recordData?.history || []);

      const vaccinesRes = await fetch(backendUrl + "/vaccine/" + petId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const vaccineData = await vaccinesRes.json();
      if (vaccinesRes.ok) setVaccines(vaccineData?.vaccines || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    VerifyUser();
  }, []);

  return (
    <>
      <div className="container min-vh-100 px-0 px-md-0">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-4">
          <div>
            <h1 className="m-0">
              <i className="fa-solid fa-paw me-2 text-vet"></i>
              Pet Info
            </h1>
            <div className="text-muted mt-1">
              <i className="fa-regular fa-id-badge me-2"></i>
              Profile & clinical summary
            </div>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-vet-outline square"
              type="button"
              onClick={() => navigate(-1)}
            >
              <i className="fa-solid fa-arrow-left me-2 "></i>
              Back
            </button>

          </div>
        </div>
        <div className="card mb-3 mt-3 pet-info-card pet-info-layout w-100">
          <div className="row g-0 align-items-center mr-2 ">
            <div className="col-12 col-lg-3 pet-left-col">
              <div className="pet-avatar">
                <img
                  src={pet?.image ? pet.image : petPlaceholder}
                  alt={pet.name}
                  className="pet-avatar-img "
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = petPlaceholder;
                  }}
                />
              </div>
            </div>

            <div className="col-12 col-lg-9">
              <div className="card-body pet-right-col">
                <div className="d-flex align-items-start justify-content-between flex-wrap gap-2">
                  <h5 className="card-title fs-1 pet-name m-0">
                    <i className="fa-solid fa-shield-dog me-2"></i>
                    {pet.name}
                  </h5>

                  <span className="badge bg-vet">
                    <i className="fa-solid fa-heart-pulse me-2"></i>
                    Patient
                  </span>
                </div>

                <div className="row mt-3 g-3">
                  <div className="col-12 col-md-6">
                    <div className="border rounded p-3 h-100">
                      <div className="text-muted small mb-1 d-flex align-items-center gap-2">
                        <i className="fa-solid fa-cake-candles"></i>
                        Age
                      </div>
                      <div className="fw-semibold">{pet.birthdate}</div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="border rounded p-3 h-100">
                      <div className="text-muted small mb-1 d-flex align-items-center gap-2">
                        <i className="fa-solid fa-dna"></i>
                        Type
                      </div>
                      <div className="fw-semibold">{pet.pet_type}</div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="border rounded p-3 h-100">
                      <div className="text-muted small mb-1 d-flex align-items-center gap-2">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        Allergies
                      </div>
                      <div className="fw-semibold">{pet.allergies}</div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="border rounded p-3 h-100">
                      <div className="text-muted small mb-1 d-flex align-items-center gap-2">
                        <i className="fa-solid fa-paw"></i>
                        Breed
                      </div>
                      <div className="fw-semibold">{pet.breed}</div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="pet-notes mt-1">
                      <div className="fw-semibold mb-1">
                        <i className="fa-regular fa-note-sticky me-2"></i>
                        Notes
                      </div>
                      {pet.info}
                    </div>
                  </div>
                </div>
              </div>
            </div>
           </div>
        </div>

        <div className="mt-4">
          <h2 className="mb-4">
            <i className="fa-solid fa-file-medical me-2 text-vet"></i>
            Medical History
          </h2>
          {petHistory.map((item, idx) => (
            <MedicalHistoryCard key={item?.id || item?._id || idx} record={item} />
          ))}
        </div>

        <div className="mt-4">
          <h2 className="mb-4">
            <i className="fa-solid fa-syringe me-2 text-vet"></i>
            Vaccines
          </h2>
          {vaccines.map((item, idx) => (
            <VaccineCard key={item?.id || item?._id || idx} vaccine={item} />
          ))}
        </div>
      </div>
    </>
  );
};

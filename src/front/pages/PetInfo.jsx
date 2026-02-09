import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MedicalHistoryCard } from "../components/MedicalHistoryCard";
import petPlaceholder from "../assets/img/pet-placeholder.jpg";
import { VaccineCard } from "../components/VaccineCard";
import Swal from "sweetalert2";

export const PetInfo = () => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { petId } = useParams();
  const token = localStorage.getItem("jwt-token");

  const [loading, setLoading] = useState(true);

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
    sex: "",
    weight: "",
  });

  const [petHistory, setPetHistory] = useState([]);
  const [vaccines, setVaccines] = useState([]);

  const Logout = () => {
    localStorage.removeItem("jwt-token");
    localStorage.removeItem("login-status");
    localStorage.removeItem("role");
  };

  const calculateAge = (birthdateString) => {
    if (!birthdateString) return "N/A";
    const birthDate = new Date(birthdateString);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) years--;

    if (years <= 0) {
      let months =
        (today.getFullYear() - birthDate.getFullYear()) * 12 +
        (today.getMonth() - birthDate.getMonth());
      if (months < 0) months = 0;
      return months === 1 ? "1 month" : `${months} months`;
    }

    return years === 1 ? "1 year" : `${years} years`;
  };

  const VerifyUser = async () => {
    try {
      if (!token) {
        navigate("/");
        return;
      }

      const result = await fetch(backendUrl + "/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

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

      if (petRes.ok) {
        const petData = await petRes.json();
        console.log(petData)
        setPet({ ...petData });
      }

      const petRecord = await fetch(backendUrl + "/history/" + petId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (petRecord.ok) {
        const recordData = await petRecord.json();
        const list = recordData?.history || [];
        // si querés el orden invertido como develop, dejalo así:
        setPetHistory(Array.isArray(list) ? [...list].reverse() : []);
        // si NO querés reverse, cambiá por:
        // setPetHistory(Array.isArray(list) ? list : []);
      }

      const vaccinesRes = await fetch(backendUrl + "/vaccine/" + petId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (vaccinesRes.ok) {
        const vaccineData = await vaccinesRes.json();
        setVaccines(vaccineData?.vaccines || []);
      }
    } catch (error) {
      console.error("Error loading pet info:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    VerifyUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              <i className="fa-solid fa-arrow-left me-2"></i>
              Back
            </button>

            <button className="btn btn-vet square" type="button" onClick={VerifyUser}>
              <i className="fa-solid fa-rotate me-2"></i>
              Refresh
            </button>
          </div>
        </div>

        {/* CARD PRINCIPAL (layout de Chris) */}
        <div className="card mb-3 mt-3 pet-info-card pet-info-layout w-100">
          <div className="row g-0 align-items-center">
            {/* IZQUIERDA */}
            <div className="col-12 col-lg-3 pet-left-col d-flex justify-content-center justify-content-lg-start p-3">
              <div className="pet-avatar">
                <img
                  src={pet?.image ? pet.image : petPlaceholder}
                  alt={pet.name}
                  className="pet-avatar-img"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = petPlaceholder;
                  }}
                />
              </div>
            </div>

            {/* DERECHA */}
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
                      <div className="fw-semibold">{calculateAge(pet.birthdate)}</div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="border rounded p-3 h-100">
                      <div className="text-muted small mb-1 d-flex align-items-center gap-2">
                        <i className="fa-solid fa-dna"></i>
                        Type
                      </div>
                      <div className="fw-semibold">{pet.pet_type || "N/A"}</div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="border rounded p-3 h-100">
                      <div className="text-muted small mb-1 d-flex align-items-center gap-2">
                        <i className="fa-solid fa-venus-mars"></i>
                        Sex
                      </div>
                      <div className="fw-semibold">{pet.sex || "N/A"}</div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="border rounded p-3 h-100">
                      <div className="text-muted small mb-1 d-flex align-items-center gap-2">
                        <i className="fa-solid fa-weight-scale"></i>
                        Weight
                      </div>
                      <div className="fw-semibold">
                        {pet.weight ? `${pet.weight} kg` : "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="border rounded p-3 h-100">
                      <div className="text-muted small mb-1 d-flex align-items-center gap-2">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        Allergies
                      </div>
                      <div className="fw-semibold">{pet.allergies || "None"}</div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="border rounded p-3 h-100">
                      <div className="text-muted small mb-1 d-flex align-items-center gap-2">
                        <i className="fa-solid fa-paw"></i>
                        Breed
                      </div>
                      <div className="fw-semibold">{pet.breed || "N/A"}</div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="pet-notes mt-1">
                      <div className="fw-semibold mb-1">
                        <i className="fa-regular fa-note-sticky me-2"></i>
                        Notes
                      </div>
                      {pet.info || "No additional notes available."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* fin row */}
          </div>
        </div>

        {/* HISTORIAL */}
        <div className="mt-4">
          <h2 className="mb-4">
            <i className="fa-solid fa-file-medical me-2 text-vet"></i>
            Medical History
          </h2>

          {petHistory.length > 0 ? (
            petHistory.map((item, idx) => (
              <MedicalHistoryCard key={item?.id || item?._id || idx} record={item} />
            ))
          ) : (
            <div className="alert alert-light border text-center text-muted">
              No medical history records found.
            </div>
          )}
        </div>

        {/* VACUNAS */}
        <div className="mt-4">
          <h2 className="mb-4">
            <i className="fa-solid fa-syringe me-2 text-vet"></i>
            Vaccines
          </h2>

          {vaccines.length > 0 ? (
            vaccines.map((item, idx) => (
              <VaccineCard key={item?.id || item?._id || idx} vaccine={item} />
            ))
          ) : (
            <div className="alert alert-light border text-center text-muted">
              No vaccines registered.
            </div>
          )}
        </div>
      </div>
    </>
  );
};


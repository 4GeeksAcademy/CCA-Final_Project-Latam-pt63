import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AdminPetCard } from "../components/AdminPetCard";
import { ModalNewPet } from "../components/ModalNewPet";

export const AdminPets = () => {
  const navigate = useNavigate();

  const Logout = () => {
    localStorage.removeItem("jwt-token");
    localStorage.removeItem("login-status");
    localStorage.removeItem("role");
  };

  const [pets, setPets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const calculateAge = (birthdate) => {
    if (!birthdate) return "N/A";

    const birthDate = new Date(birthdate);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();

    if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
      years--;
      months += 12;
    }

    if (years > 0) return `${years} ${years === 1 ? "year" : "years"}`;
    if (months === 0) return "Newborn";
    return `${months} ${months === 1 ? "month" : "months"}`;
  };

  const norm = (v) => (v ?? "").toString().toLowerCase().trim();

  const filteredPets = pets?.filter((pet) => {
    const searchWords = norm(searchTerm).split(/\s+/).filter(Boolean);
    if (searchWords.length === 0) return true;

    const petName = norm(pet?.name);
    const petType = norm(pet?.pet_type);
    const petBreed = norm(pet?.breed);

    const ownerFirst = norm(pet?.owner?.first_name ?? pet?.first_name);
    const ownerLast = norm(pet?.owner?.last_name ?? pet?.last_name);
    const ownerFull = `${ownerFirst} ${ownerLast}`.trim();

    const haystack = `${petName} ${petType} ${petBreed} ${ownerFirst} ${ownerLast} ${ownerFull}`;

    return searchWords.every((word) => haystack.includes(word));
  });

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

      if (result.ok) {
        const petsResponse = await fetch(backendUrl + "/pet", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });

        const petdata = await petsResponse.json();

        if (petsResponse.ok) {
          const petsWithAge = (petdata.pets || []).map((p) => ({
            ...p,
            age: calculateAge(p.birthdate),
          }));
          setPets(petsWithAge);
        } else {
          Swal.fire({
            title: "Error!",
            text: petdata.msg,
            icon: "error",
            confirmButtonText: "Return",
          });
          setPets([]);
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
      setPets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPet = async (pet) => {
    try {
      const token = localStorage.getItem("jwt-token");

      const result = await fetch(backendUrl + "/pet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(pet),
      });

      const data = await result.json();

      if (result.ok) {
        Swal.fire({
          title: "Succes",
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

  useEffect(() => {
    VerifyAdmin();
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
      <div className="container min-vh-100 ">
        <div className="pb-5 ps-5 ms-5 mt-0">
          <div className="mt-4 ms-1 mb-4 d-flex justify-content-between align-items-center justify-content-center">
            <h1>Pets</h1>

            <div>
              <button
                type="button"
                className="btn rounded text-light px-4"
                onClick={() => setShowModal(true)}
                style={{ background: "rgb(48, 130, 114)" }}
              >
                + Add Pet
              </button>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-6">
              <div className="vet-search">
                <input
                  className="form-control vet-search-input"
                  type="text"
                  placeholder="Search pets..."
                  aria-label="Search pets"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <i
                  className="fa-solid fa-magnifying-glass vet-search-icon"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          <div className="row g-3">
            {(filteredPets || []).map((pet) => (
              <AdminPetCard key={pet.pet_id} pet={pet} setPets={setPets} />
            ))}
          </div>
        </div>

        <ModalNewPet
          show={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleAddPet}
        />
      </div>
    </>
  );
};

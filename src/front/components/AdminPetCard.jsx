import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ModalEditPet } from "./ModalEditPet";
import petPlaceholder from "../assets/img/pet-placeholder.jpg";

export const AdminPetCard = ({ pet, setPets }) => {
  const [owner, setOwner] = useState({
    first_name: "",
    last_name: "",
    user_id: "",
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [showModal, setShowModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);

  const handleEditPet = async (editedpet) => {
    try {
      const token = localStorage.getItem("jwt-token");
      const result = await fetch(backendUrl + "/pet/" + pet.pet_id, {
        method: "PUT",
        body: JSON.stringify(editedpet),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      const data = await result.json();
      if (result.ok) {
        setPets((prevPets) =>
          prevPets.map((p) =>
            p.pet_id === editedpet.pet_id ? { ...p, ...editedpet } : p
          )
        );

        Swal.fire({
          title: "Success",
          text: data.msg,
          icon: "success",
          confirmButtonText: "Ok",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const GetOwner = async () => {
    try {
      const token = localStorage.getItem("jwt-token");
      if (pet.owner_id) {
        const result = await fetch(backendUrl + "/users/" + pet.owner_id, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });

        const data = await result.json();
        if (result.ok) {
          setOwner({
            first_name: data.user.first_name,
            last_name: data.user.last_name,
            user_id: data.user.user_id,
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: data.msg,
            icon: "error",
            confirmButtonText: "Return",
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (pet.owner_id) GetOwner();
  }, [pet.owner_id]);

  const ownerName =
    (owner.first_name || owner.last_name)
      ? `${owner.first_name} ${owner.last_name}`.trim()
      : "N/A";

  return (
    <div className="col-12 col-md-6 col-lg-4">
      <div className="card admin-pet-card bg-white h-100 border-1 rounded-4">
        <div className="card-body p-3">
          <div className="d-flex justify-content-between align-items-baseline mb-2">
            <h5 className="m-0 fw-bold text-dark admin-pet-title">
              {pet.name}
            </h5>
            <span className="text-muted admin-pet-type">
              {pet.pet_type}
            </span>
          </div>

           <div className="d-flex gap-3 align-items-start admin-pet-top">
            <div className="admin-pet-thumb">
              <img
                src={pet.image ? pet.image : petPlaceholder}
                alt={pet.name}
                className="admin-pet-thumb-img"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = petPlaceholder;
                }}
              />
            </div>

            <div className="flex-grow-1 small">
              <div className="admin-pet-row">
                <span className="admin-pet-label">Breed:</span>
                <span className="admin-pet-value">{pet.breed || "N/A"}</span>
              </div>

              <div className="admin-pet-row">
                <span className="admin-pet-label">Age:</span>
                <span className="admin-pet-value">{pet.age || "N/A"}</span>
              </div>

              <div className="admin-pet-row">
                <span className="admin-pet-label">Owner:</span>
                <span className="admin-pet-value">{ownerName}</span>
              </div>
            </div>
          </div>

          <hr className="my-3 text-muted opacity-25" />

          <div className="d-flex gap-2">
            <Link
              to={`/private/pets/history/${pet.pet_id}`}
              className="btn btn-sm flex-fill btn-vet text-white rounded"
            >
              History
            </Link>

            <button
              className="btn btn-sm flex-fill btn-outline-secondary rounded"
              onClick={() => {
                setSelectedPet(pet);
                setShowModal(true);
              }}
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      <ModalEditPet
        show={showModal}
        onClose={() => setShowModal(false)}
        selectedpet={selectedPet}
        onSave={handleEditPet}
      />
    </div>
  );
};

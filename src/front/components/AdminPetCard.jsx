import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ModalEditPet } from "./ModalEditPet";
import petPlaceholder from "../assets/img/pet-placeholder.jpg";

export const AdminPetCard = ({ pet, setPets }) => {
  const placeholderImage =
    "https://w7.pngwing.com/pngs/573/926/png-transparent-paw-dog-paw-prints-animals-photography-paw.png";

  const [owner, setOwner] = useState({
    first_name: "",
    last_name: "",
    user_id: "",
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [showModal, setShowModal] = useState(false);
  const [selectedPet, setSelectedPet]= useState(null)

  const handleEditPet = async(editedpet) =>{
    try {
      const token = localStorage.getItem('jwt-token')
      const result = await fetch (backendUrl + "/pet/" + pet.pet_id,{
        method: "PUT",
        body: JSON.stringify(editedpet),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      });
      const data = await result.json()
      if (result.ok){
        setPets((prevPets) =>
          prevPets.map((p) =>
            p.pet_id === editedpet.pet_id ? { ...p, ...editedpet } : p,
          ),
        );
        Swal.fire({
            title: "Success",
            text: data.msg,
            icon: "success",
            confirmButtonText: "Ok",
          });

      }
    } catch (error) {
      console.error(error)
    }
  }

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
    if (pet.owner_id) {
      GetOwner();
    }
  }, [pet.owner_id]);

  return (
    <div className="col-12 col-md-6 col-lg-4">
      <div className="card bg-light h-100 border-1 shadow-sm hover-card-effect rounded-4">
        <div className="card-body">
          <div className="d-flex align-items-center mb-3">
            <div style={{ width: "50px", height: "50px", flexShrink: 0 }}>
              <img
                src={pet.image ? pet.image : petPlaceholder}
                className="w-100 h-100 rounded-circle object-fit-cover"
                alt={pet.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = petPlaceholder;
                }}
              />
            </div>
            <div className="ms-3">
              <h5 className="card-title mb-0 fw-bold text-dark">{pet.name}</h5>
              <small className="text-muted">{pet.pet_type}</small>
            </div>
          </div>

          <div className="small">
            <div className="d-flex justify-content-between mb-2">
              <span className="text-secondary">Breed:</span>
              <span className="fw-medium">{pet.breed}</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-secondary">Age:</span>
              <span className="fw-medium">{pet.age || "N/A"}</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-secondary">Owner:</span>
              <span className="fw-medium">
                {owner.first_name} {owner.last_name}
              </span>
            </div>
          </div>

          <hr className="my-3 text-muted opacity-25"></hr>

          <div className="d-flex gap-2">
            <Link
              to={`/private/pets/history/${pet.pet_id}`}
              className="btn btn-sm w-50 text-white rounded"
              style={{ background: "rgb(48, 130, 114)" }}
            >
              History
            </Link>
            <button className="btn btn-sm w-50 btn-outline-secondary rounded" onClick={()=>{setShowModal(true), setSelectedPet(pet)}}>
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
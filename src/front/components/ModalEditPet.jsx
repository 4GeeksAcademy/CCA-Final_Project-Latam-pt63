import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

export const ModalEditPet = ({ show, onClose, onSave, selectedpet }) => {
  const [pet, setPet] = useState({
    name: "",
    pet_type: "",
    breed: "",
    birthdate: "",
    allergies: "",
    neutered: "",
    info: "",
    owner_name: "",
    pet_id: "",
    weight: ""
  });

  const handleChange = (e) => {
    setPet({
      ...pet,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (selectedpet) {
      setPet({
        name: selectedpet.name,
        pet_type: selectedpet.pet_type,
        breed: selectedpet.breed,
        birthdate: selectedpet.birthdate,
        allergies: selectedpet.allergies,
        neutered: selectedpet.neutered,
        info: selectedpet.info,
        owner_name: selectedpet.owner_name,
        pet_id: selectedpet.pet_id,
        weight: selectedpet.weight
      });
    }
  }, [show]);

  const handleSubmit = () => {
    if (
      pet.name.trim() == "" ||
      pet.pet_type.trim() == "" ||
      pet.breed.trim() == "" ||
      pet.allergies.trim() == ""
    ) {
      Swal.fire({
        title: "Error!",
        text: "Please complete all fields",
        icon: "warning",
        confirmButtonText: "Ok",
      });
      return;
    }
    onSave(pet);
    handleClose();
  };

  const handleClose = () => {
    setPet({
      name: "",
      pet_type: "",
      breed: "",
      birthdate: "",
      allergies: "",
      neutered: "",
      info: "",
      pet_id: "",
      weight: ""
    });
    onClose();
  };

  if (!show) return null;

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow rounded-4">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold text-dark">Edit Pet</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body p-4">
            <form className=" p-2">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Pet name</label>
                  <input
                    className="form-control"
                    name="name"
                    value={pet.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Owner name</label>
                  <input
                    className="form-control"
                    name="owner_name"
                    value={pet.owner_name}
                    disabled
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Type</label>
                <select
                  className="form-select"
                  value={pet.pet_type}
                  onChange={handleChange}
                  name="pet_type"
                >
                  <option value="">Select a type</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Bird">Bird</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Breed</label>
                <input
                  className="form-control"
                  name="breed"
                  value={pet.breed}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                    <label className="form-label">Weight (kg)</label>
                    <input 
                        type="number" 
                        className="form-control"
                        name="weight"
                        value={pet.weight} 
                        onChange={handleChange} 
                        step="0.1"
                        min="0"
                        placeholder="0.0" 
                    />
                </div>

              <div className="mb-3">
                <label className="form-label">Allergies</label>
                <input
                  className="form-control"
                  name="allergies"
                  value={pet.allergies}
                  onChange={handleChange}
                />
              </div>
               <div className="mb-3">
                <label className="form-label">Notes</label>
                <input
                  className="form-control"
                  name="info"
                  value={pet.info}
                  onChange={handleChange}
                />
              </div>

              <button
                type="button"
                className="btn rounded-2 w-100 text-light"
                style={{ background: "rgb(48, 130, 114)" }}
                onClick={() => {
                  handleSubmit();
                }}
              >
                Edit Pet
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

export const ModalNewPet = ({ show, onClose, onSave }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const petBreeds = {
    Dog: ["Golden Retriever", "Poodle", "Bulldog", "Other"],
    Cat: ["Siamese", "Persian", "Maine Coon", "Other"],
    Bird: ["Parrot", "Canary", "Cockatiel", "Other"],
    Other: ["Other", "Mix", "Unknown"],
  };

  const [clientsDB, setClientsDB] = useState([]);

  const [ageYears, setAgeYears] = useState("");
  const [ageMonths, setAgeMonths] = useState("");

  let today = new Date();
  let birthYear = today.getFullYear() - ageYears;
  let birthMonth = today.getMonth() - ageMonths;

  let calculatedDate = new Date(birthYear, birthMonth, 1);
  let birthdateString = calculatedDate.toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value } = e.target;

    const finalValue = name === "neutered" ? value === "true" : value;

    setNewPet({
      ...newPet,
      [name]: finalValue,
    });
  };

  const [newPet, setNewPet] = useState({
    owner_id: "",
    pet_type: "",
    name: "",
    birthdate: "",
    breed: "",
    allergies: "",
    neutered: null,
  });

  useEffect(() => {
    setNewPet((prev) => ({
      ...prev,
    }));
  }, [ageYears, ageMonths, birthdateString]);

  useEffect(() => {
    if (show) getDataFromBackend();
  }, [show]);

  const getDataFromBackend = async () => {
    try {
      const token = localStorage.getItem("jwt-token");
      if (!token) return;
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      };

      const resUsers = await fetch(backendUrl + "/users", {
        method: "GET",
        headers,
      });
      if (resUsers.ok) {
        const dataUsers = await resUsers.json();
        setClientsDB(
          Array.isArray(dataUsers) ? dataUsers : dataUsers.users || [],
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = () => {
    if (
      !newPet.owner_id ||
      newPet.name.trim() == "" ||
      newPet.breed.trim() == "" ||
      newPet.pet_type.trim() == "" ||
      newPet.birthdate.trim() == "" ||
      newPet.allergies.trim() == "" ||
      newPet.neutered == null
    ) {
      Swal.fire({
        title: "Error!",
        text: "Please complete all fields",
        icon: "warning",
        confirmButtonText: "Ok",
      });
      return;
    }
    onSave(newPet);
    handleClose();
  };

  const handleClose = () => {
    setNewPet({
      owner_id: "",
      pet_type: "",
      name: "",
      birthdate: "",
      breed: "",
      allergies: "",
      neutered: null,
    });
    setAgeMonths(0);
    setAgeYears(0);
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
            <h5 className="modal-title fw-bold text-dark">Add New Pet</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body p-4">
            <form>
              <div className="mb-3">
                <label className="form-label small text-muted">Owner</label>
                <select
                  className="form-select"
                  value={newPet.owner_id}
                  onChange={handleChange}
                  name="owner_id"
                >
                  <option value="">Select Owner...</option>
                  {clientsDB.map((client, index) => {
                    const displayName =
                      client.name ||
                      (client.first_name
                        ? `${client.first_name} ${client.last_name || ""}`
                        : client.email);
                    return (
                      <option key={index} value={client.user_id}>
                        {displayName}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small text-muted">Pet Name</label>
                <input
                  className="form-control"
                  onChange={handleChange}
                  value={newPet.name}
                  name="name"
                  placeholder="Name"
                ></input>
              </div>

              <div className="mb-4">
                <label className="form-label small text-muted">Type</label>
                <select
                  className="form-select"
                  value={newPet.pet_type}
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

              <div className="mb-4">
                <label className="form-label small text-muted">Breed</label>
                <select
                  className="form-select"
                  value={newPet.breed}
                  onChange={handleChange}
                  name="breed"
                >
                  <option value="">Select a type</option>
                  {newPet.pet_type &&
                    petBreeds[newPet.pet_type].map((breed, index) => (
                      <option key={index} value={breed}>
                        {breed}
                      </option>
                    ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Age</label>
                <div className="d-flex gap-2">
                  <div className="w-50">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Years"
                      min="0"
                      value={ageYears}
                      onChange={(e) => {
                        (setAgeYears(e.target.value),
                          setNewPet({
                            ...newPet,
                            birthdate: birthdateString,
                          }));
                      }}
                      required
                    />
                    <small className="text-muted">Years</small>
                  </div>
                  <div className="w-50">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Months"
                      min="0"
                      max="11"
                      value={ageMonths}
                      onChange={(e) => {
                        setAgeMonths(e.target.value);
                        setNewPet({
                          ...newPet,
                          birthdate: birthdateString,
                        });
                      }}
                      required
                    />
                    <small className="text-muted">Months</small>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label d-block">Neutered</label>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="neutered"
                    id="yesNeutered"
                    value={"true"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="yesNeutered">
                    Yes
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="neutered"
                    id="noNeutered"
                    value={"false"}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="noNeutered">
                    No
                  </label>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small text-muted">Allergies</label>
                <input
                  className="form-control"
                  onChange={handleChange}
                  value={newPet.allergies}
                  name="allergies"
                  placeholder="Allergies"
                ></input>
                <div id="allergiesHelp" class="form-text">
                  Please write None if the pet has no allergies.
                </div>
              </div>

              <div className="d-grid">
                <button
                  type="button"
                  className="btn btn-vet text-white py-2 rounded-3"
                  onClick={handleSubmit}
                >
                  Add Pet
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

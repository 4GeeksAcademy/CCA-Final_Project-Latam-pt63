import React from "react";
import petPlaceholder from "../assets/img/pet-placeholder.jpg";
import { Link } from "react-router-dom";

export const PetCard = ({ pet }) => {
  return (
    <div className="col-12 col-md-6 col-lg-4">
      <div className="card pet-card h-100">
        <div className="card-body">
          <div className="d-flex gap-3">

            <div className="pet-image-wrapper">
              <img
                src={pet?.image ? pet.image : petPlaceholder}
                alt={pet?.name || "pet"}
                className="pet-image"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = petPlaceholder;
                }}
              />
            </div>

            <div className="flex-grow-1 d-flex flex-column">
              <div className="mb-2 d-flex">
                <span className="pet-label">Name:</span>
                <span className="pet-value">{pet?.name || "n/a"}</span>
              </div>

              <div className="mb-2 d-flex">
                <span className="pet-label">Age:</span>
                <span className="pet-value">{pet?.age ?? "n/a"}</span>
              </div>

              <div className="mb-2 d-flex">
                <span className="pet-label">Type:</span>
                <span className="pet-value">{pet?.pet_type || "n/a"}</span>
              </div>

              <div className="mb-3 d-flex">
                <span className="pet-label">Breed:</span>
                <span className="pet-value">{pet?.breed || "n/a"}</span>
              </div>

              <div className="mt-auto d-flex justify-content-between align-items-center">
                <span className="pet-badge">
                  {pet?.next_appointment || "No appointment"}
                </span>

                <div className="pet-actions">
                  <Link
                    to={`/pets/${pet?.pet_id}`}
                    className="btn btn-outline-dark btn-sm"
                  >
                    History
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

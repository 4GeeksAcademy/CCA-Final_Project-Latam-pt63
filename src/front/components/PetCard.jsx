import React from "react";
import petPlaceholder from "../assets/img/pet-placeholder.jpg";
import { Link } from "react-router-dom";

export const PetCard = ({ pet }) => {
  return (
    <div className="col-12 col-md-6 col-lg-6">
      <div className="card h-100 border-0 shadow-sm overflow-hidden">
        <div className="card-body p-3">
          <div className="d-flex gap-3 align-items-start">

            {}
            <div style={{ width: "110px", height: "110px", flexShrink: 0 }}>
              <img
                src={pet?.image ? pet.image : petPlaceholder}
                alt={pet?.name || "pet"}
                className="w-100 h-100 rounded"
                style={{ objectFit: "cover" }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = petPlaceholder;
                }}
              />
            </div>

            <div className="flex-grow-1 d-flex flex-column h-100">
              <div className="mb-2">
                <h5 className="fw-bold mb-1 text-dark text-capitalize">{pet?.name || "n/a"}</h5>
                <span className="badge bg-light text-secondary border">
                  {pet?.pet_type || "Pet"}
                </span>
              </div>

              <div className="small text-muted mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Age:</span>{" "}
                  <span className="text-dark fw-bold">{pet?.age ?? "n/a"}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Breed:</span>{" "}
                  <span className="text-dark fw-bold">
                    {pet?.breed || "n/a"}
                  </span>
                </div>
              </div>

              <div className="mt-auto d-flex justify-content-between align-items-end">
                <div className="d-flex flex-column">
                  {pet?.next_appointment ? (
                    <>
                      <small className="text-muted fw-bold mb-1" style={{ fontSize: "0.7rem", textTransform: "uppercase" }}>
                        Next Appointment
                      </small>
                      <small className="text-success fw-bold" style={{ fontSize: "0.9rem" }}>
                        <i className="fa-regular fa-calendar me-1"></i> {pet.next_appointment}
                      </small>
                    </>
                  ) : (
                    <small className="text-muted fst-italic" style={{ fontSize: "0.8rem" }}>
                      No upcoming appointment
                    </small>
                  )}
                </div>
                <small
                  className="text-muted fst-italic"
                  style={{ fontSize: "0.8rem" }}
                >
                  {pet?.next_appointment ? "📅 Booked" : "No appointment"}
                </small>

                <Link
                  to={`/pets/${pet?.pet_id}`}
                  className="btn btn-sm rounded-0 text-white px-3"
                  style={{ background: "rgb(48, 130, 114)" }}
                >
                  History
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

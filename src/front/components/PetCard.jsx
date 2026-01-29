// src/front/components/PetCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export const PetCard = ({ pet }) => {
  return (
<div className="card border-0 shadow-sm rounded-4 h-100">
      <div className="card-body">
        <div className="d-flex gap-3 ">

          <div style={{ width: 160, height: 160, borderRadius: 10, overflow: "hidden", flex: "0 0 auto", background: "#f2f2f2", }}>
            <img
              src={pet?.image }
              alt={pet?.name || "image"}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start">
              <div className="w-100">
                <div className="mb-2 d-flex">
                  <div style={{ width: 90 }} className="text-muted">
                    Name:
                  </div>
                  <div className="fw-semibold">
                    {pet?.name || "n/a"}
                  </div>
                </div>

                <div className="mb-2 d-flex">
                  <div style={{ width: 90 }} className="text-muted">
                    Age:
                  </div>
                  <div className="fw-semibold">
                    {pet?.age ?? "n/a"}
                  </div>
                </div>

                <div className="mb-2 d-flex">
                  <div style={{ width: 90 }} className="text-muted">
                    Type:
                  </div>
                  <div className="fw-semibold">
                    {pet?.pet_type || pet?.type || "n/a"}
                  </div>
                </div>

                <div className="mb-3 d-flex">
                  <div style={{ width: 90 }} className="text-muted">
                    Breed:
                  </div>
                  <div className="fw-semibold">
                    {pet?.breed || "n/a"}
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <div className="text-muted">Next appointment:</div>
                  <div className="px-3 py-1 border rounded-pill fw-semibold">
                    {pet?.next_appointment || "n/a"}
                  </div>
                </div>
              </div>


              <div className="ms-3">
                {pet?.pet_id || pet?.id ? (
                  <Link
                    to={`/pets/${pet?.pet_id || pet?.id}`}
                    className="btn btn-outline-dark btn-sm"
                  >
                    History
                  </Link>
                ) : (
                  <button className="btn btn-outline-dark btn-sm" disabled>
                    History
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

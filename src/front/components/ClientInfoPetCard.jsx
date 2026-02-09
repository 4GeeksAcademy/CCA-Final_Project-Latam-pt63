import { useState } from "react";
import { Link } from "react-router-dom";

export const ClientInfoPetCard = ({ info }) => {
  return (
    <>
      <div className="col-12">
        <div class="card border-1 bg-white p-2 rounded-4 shadow-sm hover-shadow-transition border-start  mt-3 hover-card-effect">
          <div class="card-body">
            <div className="d-flex">
              <div
                className="rounded-circle bg-success-subtle text-success fw-bold d-flex align-items-center justify-content-center"
                style={{ width: 60, height: 60 }}
              >
                <div className="text-center fs-2 ms-3">
                  <i className="fa-solid fa-paw me-3"></i>
                </div>
              </div>
              <div className="ms-3">
                <h5 class="card-title mb-1">{info.name}</h5>
                <p class="card-text">{`${info.pet_type} - ${info.breed}`}</p>
              </div>
            </div>
            <div>
              <div className="ms-2 mt-2 mb-2">Age - {info.birthdate}</div>
            </div>

            <Link
              to={`/private/pets/history/${info.pet_id}`}
              class="btn col-12 rounded-4 bg-vet"
            >
              Medical history
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

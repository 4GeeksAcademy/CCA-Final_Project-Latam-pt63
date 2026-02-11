import { useState } from "react";
import { Link } from "react-router-dom";
import petPlaceholder from "../assets/img/pet-placeholder.jpg";

export const ClientInfoPetCard = ({ info }) => {

  const calculateAge = (dob) => {
    if (!dob) return "Unknown";

    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return "Unknown";

    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      years--;
    }

    if (years === 0) {
      let months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
      if (today.getDate() < birthDate.getDate()) {
        months--;
      }
      if (months <= 0) return "Newborn";
      return months === 1 ? "1 month" : `${months} months`;
    }

    return years === 1 ? "1 year" : `${years} years`;
  };

  return (
    <>
      <div className="col-12">
        <div className="card border-1 bg-white p-2 rounded-4 shadow-sm hover-shadow-transition border-start mt-3 hover-card-effect">
          <div className="card-body">
            <div className="d-flex">
              <div
                className="rounded-circle bg-success-subtle text-success fw-bold d-flex align-items-center justify-content-center"
                style={{ width: 60, height: 60 }}
              >
                <div className="text-center fs-2 ">
                  <img
                    src={info.image || petPlaceholder}
                    style={{ width: 60, height: 60, aspectRatio: "1/1", borderRadius: "50%" }}
                    className="object-fit-cover"
                    
                  />
                </div>
              </div>
              <div className="ms-3">
                <h5 className="card-title mb-1">{info.name}</h5>
                <p className="card-text">{`${info.pet_type} - ${info.breed}`}</p>
              </div>
            </div>

            <div>
              <div className="ms-2 mt-2 mb-2">
                Age - {calculateAge(info.birthdate)}
              </div>
            </div>

            <Link
              to={`/private/pets/history/${info.pet_id}`}
              className="btn col-12 rounded-4 bg-vet"
            >
              Medical history
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
import { useState } from "react";
import { Link } from "react-router-dom";

export const AdminClientHistoryCard = ({ record }) => {
  return (
    <div className="card border-1 bg-white p-3 rounded-4 shadow-sm hover-shadow-transition  mt-3 hover-card-effect">
      <div className="d-flex align-items-center">
        <div className="me-4 fs-3">
          <div>
            <i className="fa-regular fa-calendar text-vet"></i>
          </div>
        </div>
        <div>
          <div className="fs-5">
            <strong>{record.motive}</strong>
          </div>
          <div>{`${record.date}  •  Pet: ${record.pet_data.name}`}</div>
        </div>
        <Link
          to={`/private/agenda/details/${record.appointment_id}`}
          className="ms-auto me-2 text-decoration-none text-dark"
        >
          <div className="ms-auto me-2">Details</div>
        </Link>
      </div>
    </div>
  );
};

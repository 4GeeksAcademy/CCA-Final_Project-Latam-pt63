import { useState } from "react";

export const AdminPetsAppointmentCard = ({ info }) => {
  return (
    <>
      <div className="card  bg-light h-100 border-1 shadow-sm hover-card-effect rounded-4 mt-3 ms-3 me-3 mb-4">
        <div className="card-body">
          <div className="d-flex align-items-center mb-3">
            <div>{info.date}</div>
          </div>
          <div className="small">
            <div className="d-flex  mb-2">
              <span className="text-secondary">Doctor:</span>
              <span className="fw-medium ms-2">{info.doctor_name}</span>
            </div>
            <div className="d-flex  mb-2">
              <span className="text-secondary col-1">Diagnostic:</span>
              <span className="fw-medium col-4">{info.anamnesis}</span>
              <div className="d-flex mb-2 ms-5">
                <span className="text-secondary">Treatment:</span>
                <span className="fw-medium ms-2">{info.procedures}</span>
              </div>
            </div>
            <hr className="my-3 text-muted opacity-25"></hr>
            <div className="d-flex mb-2">
              <span className="text-secondary">Observations:</span>
              <span className="fw-medium ms-4">{info.observations}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

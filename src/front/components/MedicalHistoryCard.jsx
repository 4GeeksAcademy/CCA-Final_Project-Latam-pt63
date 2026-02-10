import { Link } from "react-router-dom";

export const MedicalHistoryCard = ({ record }) => {
  return (
    <>
      <div class="card mt-2">
        <div class="card-header">{record.date}</div>
        <div class="card-body">
          <h5 class="card-title mb-4">Motive : {record.motive}</h5>
          <div className="d-flex">
            <p className="card-text col-3"><strong>Doctor</strong> : {record.doctor_name}</p>
            <p className="card-text col-9"><strong>Treatment</strong> : {record.procedures}</p>
            
          </div>
          <div className="d-flex">
            <p className="card-text col-3"><strong>Diagnostic</strong> : {record.anamnesis}</p>
            <p className="card-text col-9"><strong>Medication</strong> : {record.medication}</p>
          </div>
          <div className="d-flex bg-light w-100 p-2 rounded">
            Notes : {record.observations}
          </div>
        </div>
      </div>
    </>
  );
};

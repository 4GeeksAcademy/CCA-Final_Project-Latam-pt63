import { Link } from "react-router-dom";

export const MedicalHistoryCard = ({ record }) => {
    return (
        <>
            <div class="card mt-2">
                <div class="card-header">
                    {record.date}
                </div>
                <div class="card-body">
                    <h5 class="card-title">Motive : {record.motive}</h5>
                    <p class="card-text">Doctor : {record.doctor_name}</p>
                    <div className="d-flex">
                        <p className="card-text col-3">Diagnostic : {record.anamnesis}</p>
                        <p className="card-text col-3">Treatment : {record.procedures}</p>
                    </div>
                    <div className="d-flex bg-light w-100 p-2 rounded">
                        Notes : {record.observations}
                    </div>
                </div>
            </div>
        </>
    )
}
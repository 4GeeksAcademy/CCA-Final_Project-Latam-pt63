import useGlobalReducer from "../hooks/useGlobalReducer";

export const VaccineCard = ({ vaccine }) => {
  return (
    <>
      <div class="card mt-2 col-5">
        <div class="card-header">{vaccine.vaccine_name}</div>
        <div class="card-body pb-0">
          <div className="d-flex">
            <p className="card-text col-3">
              Applied : {vaccine.vaccination_date}
            </p>
            <p className="card-text col-3">Expires : {vaccine.expiry_date}</p>
          </div>
        </div>
      </div>
    </>
  );
};

import { useNavigate } from "react-router-dom";

export const usersTable = ({ user = [] }) => {
  return (
    <div className="container my-4">
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">

        <div className="row bg-light px-4 py-3 fw-semibold text-muted small">
          <div className="col-3">Name</div>
          <div className="col-3">Contact</div>
          <div className="col-3">Address</div>
          <div className="col-2">Pets</div>
          <div className="col-1 text-end">Actions</div>
        </div>


        {user.map((user, i) => (
          <div
            key={i}
            className="row align-items-center px-4 py-3 border-top">
     
            <div className="col-3 d-flex align-items-center gap-2">
              <div
                className="rounded-circle bg-success-subtle text-success fw-bold d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                {user.name?.charAt(0)}
              </div>
              <span className="fw-medium">{user.name}</span>
            </div>


            <div className="col-3 text-muted small">
              <div>
                <i className="fa-solid fa-phone me-2"></i>
                {user.phone}
              </div>
              <div>
                <i className="fa-solid fa-envelope me-2"></i>
                {user.email}
              </div>
            </div>


            <div className="col-3 text-muted small">
              <i className="fa-solid fa-location-dot me-2"></i>
              {user.address}
            </div>

            <div className="col-2">
              <span className="badge rounded-pill bg-success-subtle text-success px-3 py-2">
                {user.pet} Pets
              </span>
            </div>
        
            <div className="col-1 text-end small">
              <a href="#" className="text-success me-2 text-decoration-none">
                View
              </a>
              <a href="#" className="text-muted text-decoration-none">
                Edit
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

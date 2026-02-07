import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const AdminPetCard = ({ pet }) => {
    const placeholderImage = "https://w7.pngwing.com/pngs/573/926/png-transparent-paw-dog-paw-prints-animals-photography-paw.png";
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [owner, setOwner] = useState({
        first_name: "Loading...",
        last_name: "",
        user_id: ""
    });

    useEffect(() => {
        let isMounted = true;
        const getOwnerData = async () => {
            if (!pet.owner_id) {
                if (isMounted) setOwner({ first_name: "Unknown", last_name: "", user_id: "" });
                return;
            }
            try {
                const token = localStorage.getItem('jwt-token');
                const response = await fetch(`${backendUrl}/users/${pet.owner_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token,
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.user && isMounted) setOwner(data.user);
                }
            } catch (error) {
                console.error(error);
            }
        };
        getOwnerData();
        return () => { isMounted = false; };
    }, [pet.owner_id]);

    return (
        <div className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card bg-white h-100 border-0 shadow-sm hover-card-effect rounded-4">
                <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                        <div style={{ width: "60px", height: "60px", flexShrink: 0 }}>
                            <img
                                src={pet.image ? pet.image : placeholderImage}
                                className="w-100 h-100 rounded-circle object-fit-cover shadow-sm border"
                                alt={pet.name}
                                onError={(e) => { e.target.src = placeholderImage; }}
                            />
                        </div>
                        <div className="ms-3">
                            <h5 className="card-title mb-0 fw-bold text-dark">{pet.name}</h5>
                            <span className="badge bg-light text-secondary border rounded-pill mt-1">
                                {pet.pet_type || "Pet"}
                            </span>
                        </div>
                    </div>

                    <div className="small text-secondary bg-light p-3 rounded-3 mb-3">
                        <div className="d-flex justify-content-between mb-2 border-bottom pb-2">
                            <div>
                                <span className="d-block text-muted" style={{ fontSize: "0.7rem" }}>BREED</span>
                                <span className="fw-bold text-dark">{pet.breed || "Mix"}</span>
                            </div>
                            <div className="text-end">
                                <span className="d-block text-muted" style={{ fontSize: "0.7rem" }}>SEX</span>
                                <span className="fw-bold text-dark">{pet.sex || "N/A"}</span>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between mb-2 border-bottom pb-2">
                            <div>
                                <span className="d-block text-muted" style={{ fontSize: "0.7rem" }}>AGE</span>
                                <span className="fw-bold text-dark">{pet.age || "N/A"}</span>
                            </div>
                            <div className="text-end">
                                <span className="d-block text-muted" style={{ fontSize: "0.7rem" }}>WEIGHT</span>
                                <span className="fw-bold text-dark">{pet.weight ? `${pet.weight} kg` : "N/A"}</span>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between pt-1">
                            <span className="text-muted">Owner:</span>
                            <span className="fw-bold text-success text-capitalize">{owner.first_name} {owner.last_name}</span>
                        </div>
                    </div>

                    <div className="d-flex gap-2">
                        <Link to={`/pets/${pet.pet_id}`} className="btn btn-sm w-100 text-white rounded-3 fw-bold py-2" style={{ background: "rgb(48, 130, 114)" }}>
                            History
                        </Link>
                        <button className="btn btn-sm w-100 btn-outline-secondary rounded-3 fw-bold py-2">
                            Edit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
  const placeholderImage =
    "https://w7.pngwing.com/pngs/573/926/png-transparent-paw-dog-paw-prints-animals-photography-paw.png";

  const [owner, setOwner] = useState({
    first_name: "",
    last_name: "",
    user_id: "",
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const GetOwner = async () => {
    try {
      const token = localStorage.getItem("jwt-token");
      if (!pet.owner_id) return;

      const result = await fetch(backendUrl + "/users/" + pet.owner_id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await result.json();
      if (result.ok) {
        setOwner({ ...data.user });
      } else {
        Swal.fire({
          title: "Error!",
          text: data.msg,
          icon: "error",
          confirmButtonText: "Return",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    GetOwner();
  }, [pet.owner_id]);

  return (
    <div className="col-12 col-md-6 col-lg-4">
      <div className="card  bg-light h-100 border-1 shadow-sm hover-card-effect rounded-4">
        <div className="card-body">
          <div className="d-flex align-items-center mb-3">
            <div style={{ width: "50px", height: "50px", flexShrink: 0 }}>
              {}
              <img
                src={pet.image ? pet.image : placeholderImage}
                className="w-100 h-100 rounded-circle object-fit-cover"
                alt={pet.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = placeholderImage;
                }}
              />
            </div>
            <div className="ms-3">
              <h5 className="card-title mb-0 fw-bold text-dark">{pet.name}</h5>
              <small className="text-muted">{pet.pet_type}</small>
            </div>
          </div>

          <div className="small">
            <div className="d-flex justify-content-between mb-2">
              <span className="text-secondary">Breed:</span>
              <span className="fw-medium">{pet.breed}</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-secondary">Age:</span>
              {}
              <span className="fw-medium">{pet.age || "N/A"}</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-secondary">Owner:</span>
              <span className="fw-medium">
                {owner.first_name} {owner.last_name}
              </span>
            </div>
          </div>

          <hr className="my-3 text-muted opacity-25"></hr>

          <div className="d-flex gap-2">
            <Link
              to={`/private/pets/history/${pet.pet_id}`}
              className="btn btn-sm w-50 text-white rounded"
              style={{ background: "rgb(48, 130, 114)" }}
            >
              History
            </Link>
            <button className="btn btn-sm w-50 btn-outline-secondary rounded">
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

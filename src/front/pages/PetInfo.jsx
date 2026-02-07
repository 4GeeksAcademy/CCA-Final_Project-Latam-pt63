import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MedicalHistoryCard } from "../components/MedicalHistoryCard";
import petPlaceholder from "../assets/img/pet-placeholder.jpg";
import { VaccineCard } from "../components/VaccineCard";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export const PetInfo = () => {
  const Logout = () => {
    localStorage.removeItem("jwt-token");
    localStorage.removeItem("login-status");
    localStorage.removeItem("role");
  };

  const navigate = useNavigate();

  const [pet, setPet] = useState({
    name: "",
    pet_type: "",
    birthdate: "",
    breed: "",
    allergies: "",
    neutered: "",
    info: "",
    image: "",
    vaccines: "",
  });
  const [petHistory, setPetHistory] = useState([]);
  const [vaccines, setVaccines] = useState([]);

    const [loading, setLoading] = useState(true);

    const [pet, setPet] = useState({
        name: "",
        pet_type: "",
        birthdate: "",
        breed: "",
        allergies: "",
        neutered: "",
        info: "",
        image: "",
        vaccines: "",
        sex: "",    
        weight: ""  
    });
    const [petHistory, setPetHistory] = useState([])
    const [vaccines, setVaccines] = useState([])
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { petId } = useParams();
  const token = localStorage.getItem("jwt-token");

  const reverseList = () => {
    const newList = [...petHistory].reverse();
    setPetHistory(newList);
  };

    const calculateAge = (birthdateString) => {
        if (!birthdateString) return "N/A";
        const birthDate = new Date(birthdateString);
        const today = new Date();
        let years = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            years--;
        }
        
        if (years === 0) {
            let months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
            if (months < 0) months = 0;
            return months === 1 ? "1 month" : months + " months";
        }
        
        return years === 1 ? "1 year" : years + " years";
    };
  const VerifyUser = async () => {
    try {
      const result = await fetch(backendUrl + "/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await result.json();
      if (result.ok) {
        console.log("first data :", data);
        const pet = await fetch(backendUrl + "/pet/" + petId, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const petData = await pet.json();
        if (pet.ok) {
          console.log("second data :", petData);
          setPet({ ...petData });
          const petRecord = await fetch(backendUrl + "/history/" + petId, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          });
          const recordData = await petRecord.json();
          if (petRecord.ok) {
            setPetHistory(recordData.history);

            console.log("data 3:", recordData.history);
            const vaccines = await fetch(backendUrl + "/vaccine/" + petId, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
              },
            });
            
            if (result.ok) {
                const petRes = await fetch(backendUrl + "/pet/" + petId, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    }
                });
                const petData = await petRes.json()
                
                if (petRes.ok) {
                    setPet({ ...petData })
                    
                    const petRecord = await fetch(backendUrl + "/history/" + petId, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + token,
                        }
                    });
                    const recordData = await petRecord.json()
                    if (petRecord.ok) {
                        setPetHistory(recordData.history)
                        
                        const vaccinesRes = await fetch(backendUrl + "/vaccine/" + petId, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer " + token,
                            }
                        });
                        const vaccineData = await vaccinesRes.json()
                        if (vaccinesRes.ok) {
                            setVaccines(vaccineData.vaccines)
                        }
                    }
                }
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'You must be logged in to access this page',
                    icon: 'error',
                    confirmButtonText: 'Return'
                })
                Logout()
                navigate("/")
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
            const vaccineData = await vaccines.json();
            if (vaccines.ok) {
              setVaccines(vaccineData.vaccines);
            }
          }
        }
      } else {
        Swal.fire({
          title: "Error!",
          text: "You must be logged in to access this page",
          icon: "error",
          confirmButtonText: "Return",
        });
        Logout();
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    VerifyUser();
  }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="spinner-border" style={{ color: "rgb(48, 130, 114)", width: "3rem", height: "3rem" }} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="container min-vh-100 py-5">
                <h1 className="mb-4 fw-bold">Pet Info</h1>
                <div className="card mb-4 border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="row g-0">
                        <div className="col-md-5 col-lg-4" style={{ minHeight: "300px" }}>
                            <img
                                src={pet?.image ? pet.image : petPlaceholder}
                                alt={pet.name}
                                className="w-100 h-100 object-fit-cover"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = petPlaceholder;
                                }}
                            />
                        </div>
                        <div className="col-md-7 col-lg-8">
                            <div className="card-body p-4 p-lg-5 h-100 d-flex flex-column">
                                <h2 className="card-title fw-bold display-6 mb-4 text-dark">{pet.name}</h2>
                                
                                <div className="row g-3 mb-4">
                                    <div className="col-6 col-md-4">
                                        <small className="text-muted text-uppercase fw-bold d-block mb-1">Type</small>
                                        <span className="fs-5">{pet.pet_type}</span>
                                    </div>
                                    <div className="col-6 col-md-4">
                                        <small className="text-muted text-uppercase fw-bold d-block mb-1">Breed</small>
                                        <span className="fs-5">{pet.breed}</span>
                                    </div>
                                    <div className="col-6 col-md-4">
                                        <small className="text-muted text-uppercase fw-bold d-block mb-1">Age</small>
                                        <span className="fs-5">{calculateAge(pet.birthdate)}</span>
                                    </div>

                                    <div className="col-6 col-md-4">
                                        <small className="text-muted text-uppercase fw-bold d-block mb-1">Sex</small>
                                        <span className="fs-5">{pet.sex || "N/A"}</span>
                                    </div>
                                    <div className="col-6 col-md-4">
                                        <small className="text-muted text-uppercase fw-bold d-block mb-1">Weight</small>
                                        <span className="fs-5">{pet.weight ? `${pet.weight} kg` : "N/A"}</span>
                                    </div>
                                    <div className="col-6 col-md-4">
                                        <small className="text-muted text-uppercase fw-bold d-block mb-1">Allergies</small>
                                        <span className="fs-5 text-danger">{pet.allergies || "None"}</span>
                                    </div>
                                </div>

                                <div className="mt-auto p-3 bg-light rounded-3 border">
                                    <h6 className="fw-bold text-secondary mb-2"><i className="fa-solid fa-note-sticky me-2"></i>Notes</h6>
                                    <p className="m-0 text-muted">{pet.info || "No additional notes available."}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-12">
                        <div className="d-flex align-items-center mb-3">
                            <h3 className="fw-bold m-0 me-3">Medical History</h3>
                            <span className="badge bg-secondary rounded-pill">{petHistory.length} Records</span>
                        </div>
                        {petHistory.length > 0 ? (
                            petHistory.map((item, index) => (
                                <MedicalHistoryCard key={index} record={item} />
                            ))
                        ) : (
                            <div className="alert alert-light border text-center text-muted">No medical history records found.</div>
                        )}
                    </div>

                    <div className="col-12 mt-5">
                        <div className="d-flex align-items-center mb-3">
                            <h3 className="fw-bold m-0 me-3">Vaccines</h3>
                            <span className="badge bg-success rounded-pill">{vaccines.length} Active</span>
                        </div>
                        <div className="row g-3">
                            {vaccines.length > 0 ? (
                                vaccines.map((item, index) => (
                                    <div key={index} className="col-md-6 col-xl-4">
                                        <VaccineCard vaccine={item} />
                                    </div>
                                ))
                            ) : (
                                <div className="col-12">
                                    <div className="alert alert-light border text-center text-muted">No vaccines registered.</div>
                                </div>
                            )}
                        </div>
                    </div>
  return (
    <>
      <div className="container min-vh-100">
        <h1 className="mt-4">Pet Info</h1>
        <div className="card mb-3 mt-3 pet-info-card">
          <div className="row g-0">
            <div className="col-md-4 pet-image">
              <img
                src={pet?.image ? pet.image : petPlaceholder}
                alt={pet.name}
                className="pet-info-image"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = petPlaceholder;
                }}
              />
            </div>
            <div className="col-md-8">
              <div className="card-body ps-5 h-100 d-flex flex-column">
                <h5 className="card-title fs-1 pet-name">{pet.name}</h5>
                <div className="d-flex mt-3 ">
                  <h5 className="card-text col-4">Age: {pet.birthdate}</h5>
                  <h5 className="card-text col-4">Type: {pet.pet_type}</h5>
                </div>
                <div className="d-flex mt-2">
                  <h5 className="card-text col-4">
                    Allergies: {pet.allergies}
                  </h5>
                  <h5 className="card-text">Breed: {pet.breed}</h5>
                </div>
                <div className=" w-100 p-2 rounded mt-auto pet-notes">
                  Notes: {pet.info}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <h2 className="mb-4">Medical History</h2>
          {petHistory.map((item) => {
            return <MedicalHistoryCard record={item} />;
          })}
        </div>
        <div className="mt-4">
          <h2 className="mb-4">Vaccines</h2>
          {vaccines.map((item) => {
            return <VaccineCard vaccine={item} />;
          })}
        </div>
      </div>
    </>
  );
};

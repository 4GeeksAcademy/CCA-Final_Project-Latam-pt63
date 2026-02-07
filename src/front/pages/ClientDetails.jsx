import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ClientInfoCard } from "../components/ClientInfoCard";
import { ClientInfoPetCard } from "../components/ClientInfoPetCard";
import { MedicalHistoryCard } from "../components/MedicalHistoryCard";
import Swal from 'sweetalert2'
import { AdminClientHistoryCard } from "../components/AdminClientHistoryCard";
import Swal from "sweetalert2";

export const ClientDetails = () => {
  const [clientInfo, setClientInfo] = useState({});
  const [clientPets, setClientPets] = useState([]);
  const [history, setHistory] = useState([]);

  const navigate = useNavigate();

  const { clientId } = useParams();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const AppointmentHistory = async (pets) => {
    const allHistory = pets.map(async (pet) => {
      const token = localStorage.getItem("jwt-token");
      const result = await fetch(backendUrl + "/history/" + pet.pet_id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await result.json();
      return data.history;
    });
    const HistoryData = await Promise.all(allHistory);
    setHistory(HistoryData.flat());
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

    const AppointmentHistory = async (pets) => {
        const allHistory = pets.map(async (pet) => {
            const token = localStorage.getItem('jwt-token')
            const result = await fetch(backendUrl + "/history/" + pet.pet_id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                }
            });
            const data = await result.json()
            return data.history
        });
        const HistoryData = await Promise.all(allHistory);
        const flatHistory = HistoryData.flat().sort((a, b) => new Date(b.date) - new Date(a.date));
        setHistory(flatHistory);
    }

    const VerifyAdmin = async () => {
        try {
            const token = localStorage.getItem('jwt-token')
            const result = await fetch(backendUrl + "/private", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                }
            });
            const data = await result.json()
            if (!result.ok) {
                Swal.fire({
                    title: 'Error!',
                    text: data.msg,
                    icon: 'error',
                    confirmButtonText: 'Return'
                })
                navigate('/')
            } 
            
            const user = await fetch(backendUrl + "/users/" + clientId, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                }
            });
            const userData = await user.json()
            
            if (!user.ok) {
                Swal.fire({
                    title: 'Error!',
                    text: userData.msg,
                    icon: 'error',
                    confirmButtonText: 'Return'
                })
            }

            setClientInfo({ ...userData.user })

            if (userData.user.pets) {
                const petsWithAge = userData.user.pets.map(pet => ({
                    ...pet,
                    birthdate: calculateAge(pet.birthdate) 
                }));
                setClientPets(petsWithAge);
                AppointmentHistory(userData.user.pets)
            }

        } catch (error) {
            console.error(error)
        }
  const VerifyAdmin = async () => {
    try {
      const token = localStorage.getItem("jwt-token");
      const result = await fetch(backendUrl + "/private", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await result.json();
      if (!result.ok) {
        Swal.fire({
          title: "Error!",
          text: data.msg,
          icon: "error",
          confirmButtonText: "Return",
        });
        navigate("/");
      }
      const user = await fetch(backendUrl + "/users/" + clientId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const userData = await user.json();
      if (!user.ok) {
        Swal.fire({
          title: "Error!",
          text: userData.msg,
          icon: "error",
          confirmButtonText: "Return",
        });
      }
      setClientInfo({ ...userData.user });
      setClientPets(userData.user.pets);
      AppointmentHistory(userData.user.pets);
      console.log(history);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    VerifyAdmin();
  }, []);

    useEffect(() => {
        VerifyAdmin()
    }, [])


    return (
        <>
            <div className="container min-vh-100 text-capitalize">
                
                <ClientInfoCard info={clientInfo} />
                
                <div className="mt-3 ms-5 ps-5">
                    <div className="card border-0 shadow-sm">
                        <h5 className="card-header bg-white border-bottom d-flex align-items-center py-3">
                            <i className="fa-solid fa-paw me-3 text-success"></i>Registered Pets  
                            <div className="rounded-circle bg-success-subtle text-success fw-bold d-flex align-items-center justify-content-center ms-2" style={{ width: 30, height: 30 }}>
                                <div className="text-center fs-6">{clientPets.length}</div>
                            </div>
                        </h5>
                        <div className="card-body bg-light">
                            <div className="row g-3">
                                {clientPets.length > 0 ? (
                                    clientPets.map((pet, index) => {
                                        return ( 
                                            <div key={index} className="col-md-6 col-lg-4">
                                                <ClientInfoPetCard info={pet}/>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <p className="text-muted text-center m-0">No pets registered.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 ms-5 mb-5 ps-5">
                    <div className="card border-0 shadow-sm">
                        <h5 className="card-header bg-white border-bottom py-3">
                            <i className="fa-solid fa-clock-rotate-left me-3 text-primary"></i>Appointment History ({history.length})
                        </h5>
                        <div className="card-body p-0">
                            {history.length > 0 ? (
                                history.map((record, index) => (
                                    <MedicalHistoryCard key={index} record={record} />
                                ))
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-muted m-0">No appointment history found for this client.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
  return (
    <>
      <div className="container min-vh-100">
        <ClientInfoCard info={clientInfo} />
        <div className="mt-3 ms-5 ps-5">
          <div class="card rounded-4">
            <h5 class="card-header d-flex align-items-center">
              <i className="fa-solid fa-paw me-3"></i>Registered Pets{" "}
              <div
                className="rounded-circle custom-green-background  fw-bold d-flex align-items-center justify-content-center ms-2"
                style={{ width: 30, height: 30 }}
              >
                <div className="text-center fs-5 ">{clientPets.length}</div>
              </div>
            </h5>
            <div class="card-body">
              <div className="row">
                {clientPets.map((pet) => {
                  return <ClientInfoPetCard info={pet} />;
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 ms-5 mb-5 ps-5">
          <div class="card rounded-4">
            <h5 class="card-header d-flex align-items-center ">
              <i className="fa-solid fa-calendar me-3"></i>Appointment History{" "}
              <div
                className="rounded-circle custom-green-background  fw-bold d-flex align-items-center justify-content-center ms-2"
                style={{ width: 30, height: 30 }}
              >
                <div className="text-center fs-5 ">{history.length}</div>
              </div>
            </h5>
            <div class="card-body">
              {history.map((appointment) => {
                return <AdminClientHistoryCard record={appointment} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

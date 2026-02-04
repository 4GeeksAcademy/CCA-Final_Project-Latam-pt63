import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

export const AdminPetHistory = () => {

    const [pet, setPet] = useState({})


    const placeholderImage = "https://w7.pngwing.com/pngs/573/926/png-transparent-paw-dog-paw-prints-animals-photography-paw.png";

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { petId } = useParams()

    const VerifyAdmin = async () => {
        try {
            const token = localStorage.getItem("jwt-token")
            const result = await fetch(backendUrl + "/pet/" + petId, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                }
            });
            const data = await result.json()
            if (result.ok) {
                setPet({ ...data })
            }
            else{
                Swal.fire({
                    title: 'Error!',
                    text: data.msg,
                    icon: 'error',
                    confirmButtonText: 'Return'
                })
            }
        } catch (error) {
            console.error(error)
        }

    }

    useEffect(() => {
        VerifyAdmin()
    }, [])


    return (
        <>
            <div className="container">
                <div className="ms-5">
                    <div className="ms-5">
                        <div className="ms-5"><h1>Medical History - {pet.name}</h1></div>
                        <div className="banner d-flex bg-vet p-4 rounded-4 ms-5">
                            <div style={{ width: "70px", height: "70px", flexShrink: 0 }}>
                                { }
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
                            <div className="ms-4">
                                <div style={{ fontSize: "14px" }}>Type:</div>
                                <div className="mt-1" style={{ fontSize: "14px" }}>Breed:</div>
                                <div className="mt-1" style={{ fontSize: "14px" }}>Age:</div>
                            </div>
                            <div className="ms-3">
                                <div>{pet.pet_type}</div>
                                <div>{pet.breed}</div>
                                <div>{pet.birthdate}</div>
                            </div>
                            <div className="ms-auto mt-3">
                                <div className="text-center" style={{ fontSize: "14px" }}>Owner</div>
                                <div>{pet.owner_name}</div>
                            </div>
                        </div>
                    </div>
                    <div className="ms-5">
                        <div className="alert alert-warning mt-3 rounded-4 d-flex align-items-center ms-5">
                            <div className="fs-2">
                                <i class="fa-solid fa-circle-exclamation"></i>
                            </div>
                            <div className="ms-4">
                                <div className="fs-5">Allergies and Special Conditions</div>
                                <div className="fs-6">{pet.allergies}</div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 ms-5 mb-5 ps-5">
                        <div class="card rounded-4">
                            <h5 class="card-header d-flex align-items-center ">
                                <i class="fa-regular fa-file-lines me-3"></i>Appointment History
                            </h5>
                            <div>{pet.name}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
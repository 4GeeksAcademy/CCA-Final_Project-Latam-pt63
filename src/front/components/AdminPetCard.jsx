import { useEffect, useState } from "react";

export const AdminPetCard = ({ pet }) => {

    const [owner, setOwner] = useState({
        first_name: "",
        last_name: "",
        user_id: ""
    })

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const GetOwner = async () => {
        try {
            const token = localStorage.getItem('jwt-token')
            const result = await fetch(backendUrl + "/users/" + pet.owner_id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                }
            });
            const data = await result.json()
            if (result.ok) {
                setOwner({ ...data.user })
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        GetOwner()
    }, [])


    return (
        <div className="col-4">
            <div className="card admin-pet-card">
                <div className="card-body">
                    <div className="d-flex">
                        <img src={pet.image || "https://w7.pngwing.com/pngs/573/926/png-transparent-paw-dog-paw-prints-animals-photography-paw.png"} className="object-fit-cover admin-pet-card-image" alt={pet.name} />
                        <div className=" ms-3">
                            <h5 className="card-title mb-0">{pet.name}</h5>
                            <p className="card-text">{pet.pet_type}</p>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between mt-4 ms-1 me-1 mb-0">
                        <p className="fw-lighter">Breed :</p>
                        <p>{pet.breed}</p>
                    </div>
                    <div className="d-flex justify-content-between ms-1 me-1 mt-0 mb-0">
                        <p className="fw-lighter">Age :</p>
                        <p clas>{pet.birthdate}</p>
                    </div>
                    <div className="d-flex justify-content-between ms-1 me-1 mb-0">
                        <p className="fw-lighter">Owner :</p>
                        <p>{owner.first_name} {owner.last_name}</p>
                    </div>
                    <hr className="mt-0"></hr>
                    <div className="d-flex justify-content-center">
                        <a href="#" className="btn btn-secondary me-2 w-50 admin-pet-card-buttons border-0">History</a>
                        <a href="#" className="btn btn-secondary  ms-2 w-50 admin-pet-card-buttons border-0">Edit</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
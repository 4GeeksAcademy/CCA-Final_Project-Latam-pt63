import { useEffect, useState } from "react";
import { AdminPetCard } from "../components/AdminPetCard";

export const AdminPets = () => {

    const [pets, setPets] = useState([])

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

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
            if (result.ok) {
                const pets = await fetch(backendUrl + "/pet", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    }
                });
                const petdata = await pets.json()
                if (pets.ok) {
                    setPets(petdata.pets)
                    console.log(petdata.pets)
                } else {
                    alert(petdata.msg)
                }
            } else {
                alert(data.msg)
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
            <div className="container min-vh-100">
                <div className="mt-3 mb-3 d-flex justify-content-between">
                    <h1>Pets</h1>
                    <div className="mt-1 col-1">
                        <button type="button" className="btn btn-secondary  custom-green-background w-100">+ Add Pet</button>
                    </div>
                </div>
                
                <div className="row g-3">
                    {pets.map((pet) => {
                        return (
                            <AdminPetCard pet={pet} />)
                    })}
                </div>

            </div>
        </>
    )
}
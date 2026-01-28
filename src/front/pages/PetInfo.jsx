import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MedicalHistoryCard } from "../components/MedicalHistoryCard";
import { VaccineCard } from "../components/VaccineCard";


export const PetInfo = () => {

    const [pet, setPet] = useState({
        name: "",
        pet_type: "",
        birthdate: "",
        breed: "",
        allergies: "",
        neutered: "",
        info: "",
        image: "",
        vaccines: ""
    });
    const [petHistory, setPetHistory] = useState([])
    const [vaccines,setVaccines] = useState([])

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { petId } = useParams()
    const token = localStorage.getItem('jwt-token')

    const VerifyUser = async () => {
        try {
            const result = await fetch(backendUrl + "/users", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                }
            });
            const data = await result.json()
            if (result.ok) {
                console.log("first data :", data)
                const pet = await fetch(backendUrl + "/pet/" + petId, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    }
                });
                const petData = await pet.json()
                if (pet.ok) {
                    console.log("second data :", petData)
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
                        console.log("data 3:", recordData.history)
                        const vaccines = await fetch(backendUrl + "/vaccine/" + petId, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer " + token,
                            }
                        });
                        const vaccineData = await vaccines.json()
                        if (vaccines.ok){
                            setVaccines(vaccineData.vaccines)
                        }
                    }
                }
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        VerifyUser()
    }, [])

    return (
        <>
            <div className="container">
                <h1 className="mt-4">Pet Info :</h1>
                <div className="card mb-3 mt-3">
                    <div className="row g-0">
                        <div className="col-md-4">
                            <img src={pet.image} className="img-fluid rounded-start object-fit-cover h-100" alt="..." />
                        </div>
                        <div className="col-md-8">
                            <div className="card-body ps-5">
                                <h5 className="card-title">Name : {pet.name}</h5>
                                <div className="d-flex mt-3">
                                    <h5 className="card-text col-4">Age : {pet.birthdate}</h5>
                                    <h5 className="card-text col-4">Type : {pet.pet_type}</h5>
                                </div>
                                <div className="d-flex mt-2">
                                    <h5 className="card-text col-4">Allergies : {pet.allergies}</h5>
                                    <h5 className="card-text">Breed: {pet.breed}</h5>
                                </div>
                                <div className="d-flex bg-light w-100 p-2 rounded mt-4">
                                    Notes : {pet.info}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <h2 className="mb-4">Medical History : </h2>
                    {petHistory.map((item) => {
                        return (<MedicalHistoryCard record={item} />)
                    })}
                </div>
                 <div className="mt-4">
                    <h2 className="mb-4">Vaccines : </h2>
                    {vaccines.map((item) => {
                        return (<VaccineCard vaccine={item} />)
                    })}
                </div>
            </div>
        </>
    )
}
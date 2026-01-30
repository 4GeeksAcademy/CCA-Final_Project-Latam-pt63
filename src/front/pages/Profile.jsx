import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { PetCard } from "../components/PetCard";
import Swal from 'sweetalert2'

export const Profile = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [user, setUser] = useState({
        address: "",
        email: "",
        first_name: "",
        last_name: "",
        phonenumber: "",
        user_id: ""
    });

    const Logout = () => {
        localStorage.removeItem("jwt-token");
        localStorage.removeItem("login-status");
        localStorage.removeItem("role");
    };

    const [pets, setPets] = useState([]);

    const navigate = useNavigate();

    const calculateAge = (birthdate) => {
        if (!birthdate) return "N/A";

        const birthDate = new Date(birthdate);
        const today = new Date();
        
        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();

        if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
            years--;
            months += 12;
        }

        if (years > 0) {
            return years + " years";
        } else {
            return months + " months";
        }
    };

    const Verify = async () => {
        try {
            const token = localStorage.getItem('jwt-token')
            const result = await fetch(backendUrl + "/users", {
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
                    text: 'You must be logged in to access this page',
                    icon: 'error',
                    confirmButtonText: 'Return'
                })
                Logout()
                navigate("/")
            }
            else if (result.ok) {
                setUser({ ...data.user })
                setPets(data.user.pets)  
                const pet = await fetch(backendUrl + "/pet", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    }
                });
                const petData = await pet.json()
                if (pet.ok) {
                    const petsWithAge = petData.pets.map((p) => {
                        return {
                            ...p, 
                            age: calculateAge(p.birthdate) 
                        };
                    });
                    setPets(petsWithAge)
                }
            }
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        Verify()
    }, [])

    return (
        <>
            <div className="container min-vh-100">
                <div>
                    <h1 className="mt-4">My Profile</h1>
                </div>
                <div className="card mb-3 mt-5 d-flex p-2" style={{ maxWidth: "540px" }}>
                    <div className="card-body col-12">
                        <div className="d-flex col-12">
                            <p className="card-text col-3">Name:</p>
                            <p className="card-text col-7">{user.first_name} {user.last_name}</p>
                            <Link to={`/editprofile/${user.user_id}`} className="ms-auto">
                                <i class="fa-solid fa-pen ms-auto text-black"></i>
                            </Link>
                        </div>
                        <div className="d-flex">
                            <p className="card-text col-3">Address:</p>
                            <p className="card-text col-7">{user.address}</p>
                        </div>
                        <div className="d-flex">
                            <p className="card-text col-3">Email:</p>
                            <p className="card-text col-7">{user.email}</p>
                        </div>
                        <div className="d-flex">
                            <p className="card-text col-3">Phone:</p>
                            <p className="card-text col-7">{user.phonenumber}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-4 d-flex justify-content-between">
                    <h1>My Pets</h1>
                    <Link to={'/register-pet'}>
                        <button type="button" className="btn custom-green-background">+ Add Pet</button>
                    </Link>
                </div>
                <div className="row g-3">
                    {pets.map((pet) => (
                        <PetCard key={pet.pet_id} pet={pet} />
                    ))}
                </div>
            </div>
        </>
    )
}
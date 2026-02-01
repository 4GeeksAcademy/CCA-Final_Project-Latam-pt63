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

    const [loading, setLoading] = useState(true);

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
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        Verify()
    }, [])

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
        <div className="container py-5 min-vh-100">
            { }
            <div className="row justify-content-center mb-5">
                <div className="col-12 col-md-8">
                    <h2 className="mb-4">My Profile</h2>

                    { }
                    <div className="card p-4 border-0 shadow-sm">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <h4 className="card-title text-muted mb-0">Personal Information</h4>
                                <Link to={`/editprofile/${user.user_id}`} className="text-decoration-none">
                                    <i className="fa-solid fa-pen text-secondary fs-5" title="Edit Profile"></i>
                                </Link>
                            </div>
                            <hr className="my-3" />

                            <div className="row mb-2">
                                <div className="col-sm-3 fw-bold text-secondary">Name:</div>
                                <div className="col-sm-9">{user.first_name} {user.last_name}</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-sm-3 fw-bold text-secondary">Address:</div>
                                <div className="col-sm-9">{user.address || "Not provided"}</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-sm-3 fw-bold text-secondary">Email:</div>
                                <div className="col-sm-9">{user.email}</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-sm-3 fw-bold text-secondary">Phone:</div>
                                <div className="col-sm-9">{user.phonenumber || "Not provided"}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            { }
            <div className="row justify-content-center">
                <div className="col-12 col-md-8">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>My Pets</h2>
                        <Link to={'/register-pet'}>
                            { }
                            <button
                                type="button"
                                className="btn rounded-0 text-light px-4 py-2"
                                style={{ background: "rgb(48, 130, 114)" }}
                            >
                                + Add Pet
                            </button>
                        </Link>
                    </div>

                    { }
                    <div className="row g-4">
                        {pets.length > 0 ? (
                            pets.map((pet) => (
                                <div className="col-12" key={pet.pet_id}>
                                    <PetCard pet={pet} />
                                </div>
                            ))
                        ) : (
                            <div className="alert alert-light text-center shadow-sm">
                                You haven't registered any pets yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
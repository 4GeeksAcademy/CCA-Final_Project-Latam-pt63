import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

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

    const [pets, setPets] = useState([]);

    const navigate = useNavigate();

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
                alert("You must be logged in to access this page")
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
                console.log("test :", user)
                const petData = await pet.json()
                if (pet.ok) {
                    console.log(petData)
                    setPets(petData.pets)
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
            <div className="container">
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
                <div className="mt-4">
                    <h1>My Pets</h1>
                </div>
            </div>
        </>
    )
}
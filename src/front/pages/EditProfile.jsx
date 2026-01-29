import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import Swal from 'sweetalert2'

export const EditProfile = () => {

    const { dispatch } = useGlobalReducer

    const { userId } = useParams()
    const navigate = useNavigate();

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
    };

    const HandleSubmit = (e) => {
        e.preventDefault();
    }

    const HandleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    const ProfileInfo = async () => {
        try {
            const token = localStorage.getItem('jwt-token')
            const result = await fetch(backendUrl + '/users/' + userId, {
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
            } else if (result.ok) {
                setUser({ ...data.user })
                console.log("user :", user)
            }
        } catch (error) {
            console.error(error)

        }
    }

    const UpdateInfo = async () => {
        try {
            const token = localStorage.getItem('jwt-token')
            const result = await fetch(backendUrl + '/users/' + userId, {
                method: "PUT",
                body: JSON.stringify(user),
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
                    confirmButtonText: 'Ok'
                })
            } else {
                Swal.fire({
                    title: 'Success',
                    text: data.msg + ", please log back in",
                    icon: 'success',
                    confirmButtonText: 'Cool'
                })
                Logout()
                navigate("/")
            }
        } catch (error) {
            console.error(error)

        }
    }

    useEffect(() => {
        ProfileInfo()
    }, [])

    return (
        <>
            <div className="container">
                <h1 className="mt-3">Edit Info</h1>
                <form className="card p-3 mt-5" onSubmit={HandleSubmit}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">First name</label>
                            <input
                                className="form-control"
                                name="first_name"
                                value={user.first_name}
                                disabled
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">Last name</label>
                            <input
                                className="form-control"
                                name="last_name"
                                value={user.last_name}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            className="form-control"
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={HandleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Phone number</label>
                        <input
                            className="form-control"
                            name="phonenumber"
                            value={user.phonenumber}
                            onChange={HandleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Address</label>
                        <input
                            className="form-control"
                            name="address"
                            value={user.address}
                            onChange={HandleChange}
                        />
                    </div>
                    <div className="d-flex justify-content-center">
                        <button className="btn rounded-1 text-light" onClick={() => UpdateInfo()} style={{ background: "rgb(48, 130, 114)" }}>Confirm Changes
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}
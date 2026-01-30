import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import { ClientsTable } from "../components/ClientsTable";


export const AdminClients = () => {


    const [clients, setClients] = useState([])

    const Logout = () => {
        localStorage.removeItem("jwt-token");
        localStorage.removeItem("login-status");
        localStorage.removeItem("role");
    };
    const navigate = useNavigate();

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
            const data = await result.json();
            if (!result.ok) {
                Swal.fire({
                    title: 'Error!',
                    text: data.msg,
                    icon: 'error',
                    confirmButtonText: 'Return'
                })
                Logout()
                navigate("/")
            } else {
                const users = await fetch(backendUrl + "/users", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    }
                });
                const clients = await users.json()
                if (users.ok) {
                    setClients(clients.users)
                }
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
            <div className="container vh-100">
                <div className="d-flex justify-content-between">
                    <div className="mt-3 justify-content-between">
                        <h1>Clients</h1>
                    </div>
                    <div className="mt-3">
                        <button type="button" className="btn custom-green-background">+New Client</button>
                    </div>
                </div>
                <ClientsTable user={clients} />
            </div>
        </>
    )
}
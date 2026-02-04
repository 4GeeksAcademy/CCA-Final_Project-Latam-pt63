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
            <div className="container min-vh-100">
                <div className="d-flex ms-5">
                    <div className="ms-2">
                        <div className="mt-3 justify-content-between ms-5 ps-1">
                            <h1>Clients</h1>
                        </div>
                    </div>
                    
                    
                    <div className="mt-3 ms-auto">
                        <button type="button" className="btn custom-green-background rounded">+New Client</button>
                    </div>
                    
                </div>
                <ClientsTable user={clients} />
            </div>
        </>
    )
}
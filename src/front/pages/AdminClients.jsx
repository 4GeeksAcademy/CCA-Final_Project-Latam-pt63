import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";


export const AdminClients = () => {

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
            }
        } catch (error) {
            console.error(error)
        }

    }

    useEffect(()=>{
        VerifyAdmin()
    },[])


    return (
        <>
            <h1>This is a private Page</h1>
        </>
    )
}
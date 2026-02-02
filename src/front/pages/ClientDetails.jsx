import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ClientInfoCard } from "../components/ClientInfoCard";
import Swal from 'sweetalert2'

export const ClientDetails = () => {

    const [clientInfo,setClientInfo] = useState({})
    const [clientPets, setClientPets] = useState([])

    const navigate = useNavigate()

    const { clientId } = useParams()
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const VerifyAdmin = async () => {
        const token = localStorage.getItem('jwt-token')
        const result = await fetch(backendUrl + "/private", {
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
                text: data.msg,
                icon: 'error',
                confirmButtonText: 'Return'
            })
            navigate('/')
        } const user = await fetch(backendUrl + "/users/" + clientId,{
            method: "GET",
            headers: {
                "Content-Type" : "application/json",
                Authorization : "Bearer " + token,
            }
        });
        const userData = await user.json()
        if (!user.ok){
             Swal.fire({
                title: 'Error!',
                text: userData.msg,
                icon: 'error',
                confirmButtonText: 'Return'
            })
        } setClientInfo({...userData.user})
    }


    useEffect(()=>{
        VerifyAdmin()
    },[])



    return (
        <>
            <div className="container">
                <ClientInfoCard info={clientInfo}/>
            </div>
        </>
    )
}
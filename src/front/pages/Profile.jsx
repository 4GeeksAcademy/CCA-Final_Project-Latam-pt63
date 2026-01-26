import { useEffect, useState } from "react";



export const Profile = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [user, setUser] = useState(null);
    const [petName, setPetName] = useState(null);

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
            if (result.ok) {
                console.log(data)
                setUser(`${data.user.first_name} ${data.user.last_name}`)
                const pet = await fetch(backendUrl + "/pet", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    }
                });
                const petData = await pet.json()
                if (pet.ok) {
                    console.log(petData)
                    setPetName(petData.pets[0].name)
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
                    <h1>Hello {user}</h1>
                    <h2>Pets: {petName}</h2>
                </div>
            </div>
        </>
    )
}
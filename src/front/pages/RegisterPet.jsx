import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const RegisterPet = () => {
    const navigate = useNavigate();

    const preset_name = "pet_pictures";
    const cloud_name = "dfbnzltqo";

    const [name, setName] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [petType, setPetType] = useState("");
    const [breed, setBreed] = useState("");
    const [allergies, setAllergies] = useState("");
    const [neutered, setNeutered] = useState(null);
    const [info, setInfo] = useState("");

    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        let imageUrl = "https://unsplash.com/photos/yellow-labrador-retriever-biting-yellow-tulip-flower-Sg3XwuEpybU";

        if (selectedFile) {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("upload_preset", preset_name);

            try {
                const resp = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
                    method: "POST",
                    body: formData
                });
                if (resp.ok) {
                    const data = await resp.json();
                    imageUrl = data.secure_url;
                } else {
                    console.error("Error al subir imagen a Cloudinary");
                }
            } catch (error) {
                console.error("Error de conexión con Cloudinary", error);
            }
        }

        const petData = {
            name: name,
            birthdate: birthdate,
            pet_type: petType,
            breed: breed,
            allergies: allergies,
            neutered: neutered,
            info: info,
            image: imageUrl
        };

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(backendUrl + "/pet", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt-token")
                },
                body: JSON.stringify(petData)
            });

            if (response.ok) {
                alert("Pet registered successfully!");
                setName("");
                setPetType("");
                navigate("/profile");
            } else {
                const errorData = await response.json();
                alert("Error: " + errorData.msg);
            }
        } catch (error) {
            console.error("Error connecting to server:", error);
            alert("Connection error. Is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Register Pet</h1>

            <div className="card p-4 border-custom-green mx-auto" style={{ maxWidth: "600px" }}>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input type="text" className="form-control border-custom-green" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Birthdate</label>
                        <input type="date" className="form-control border-custom-green" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Type</label>
                        <input type="text" className="form-control border-custom-green" value={petType} onChange={(e) => setPetType(e.target.value)} placeholder="Dog, Cat..." required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Breed</label>
                        <input type="text" className="form-control border-custom-green" value={breed} onChange={(e) => setBreed(e.target.value)} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Allergies</label>
                        <input type="text" className="form-control border-custom-green" value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="None, Pollen..." required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label d-block">Neutered</label>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="neuteredOptions" id="yesNeutered" onChange={() => setNeutered(true)} />
                            <label className="form-check-label" htmlFor="yesNeutered">Yes</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="neuteredOptions" id="noNeutered" onChange={() => setNeutered(false)} />
                            <label className="form-check-label" htmlFor="noNeutered">No</label>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Additional info</label>
                        <textarea className="form-control border-custom-green" rows="3" value={info} onChange={(e) => setInfo(e.target.value)}></textarea>
                    </div>

                    <div className="mb-4">
                        <label className="form-label">Upload image</label>
                        { }
                        <input
                            type="file"
                            className="form-control border-custom-green"
                            accept="image/*"
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                        />
                        <small className="text-muted">Select a photo (Optional)</small>
                    </div>

                    <div className="d-grid gap-2">
                        { }
                        <button type="submit" className="btn btn-custom-green btn-lg" disabled={loading}>
                            {loading ? "Uploading..." : "Register"}
                        </button>
                    </div>

                </form>
            </div>

            <button onClick={scrollToTop} className="scroll-to-top">↑ Top</button>
        </div>
    );
};
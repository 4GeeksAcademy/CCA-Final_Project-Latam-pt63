import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const RegisterPet = () => {
    const navigate = useNavigate();

    const preset_name = "pet_pictures";
    const cloud_name = "dfbnzltqo";

    const petBreeds = {
        "Dog": ["Golden Retriever", "Poodle", "Bulldog", "Other"],
        "Cat": ["Siamese", "Persian", "Maine Coon", "Other"],
        "Bird": ["Parrot", "Canary", "Cockatiel", "Other"],
        "Other": ["Other", "Mix", "Unknown"] 
    };

    const [name, setName] = useState("");
    
    const [ageYears, setAgeYears] = useState(0);
    const [ageMonths, setAgeMonths] = useState(0);
    
    const [petType, setPetType] = useState("");
    const [breed, setBreed] = useState("");
    const [allergies, setAllergies] = useState("");
    const [neutered, setNeutered] = useState(null);
    const [info, setInfo] = useState("");

    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleTypeChange = (e) => {
        setPetType(e.target.value);
        setBreed(""); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        let today = new Date();
        let birthYear = today.getFullYear() - ageYears;
        let birthMonth = today.getMonth() - ageMonths;
        
        let calculatedDate = new Date(birthYear, birthMonth, 1);
        let birthdateString = calculatedDate.toISOString().split('T')[0];

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
            birthdate: birthdateString,
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
        <div className="container py-5 min-vh-100" style={{ maxWidth: "550px" }}>
            <h2 className="mb-3">Register Pet</h2>

            {}
            <form onSubmit={handleSubmit} className="card p-3">
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    {}
                    <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Age</label>
                    <div className="d-flex gap-2">
                        <div className="w-50">
                            <input 
                                type="number" 
                                className="form-control" 
                                placeholder="Years" 
                                min="0"
                                value={ageYears} 
                                onChange={(e) => setAgeYears(e.target.value)} 
                                required 
                            />
                            <small className="text-muted">Years</small>
                        </div>
                        <div className="w-50">
                            <input 
                                type="number" 
                                className="form-control" 
                                placeholder="Months" 
                                min="0" 
                                max="11"
                                value={ageMonths} 
                                onChange={(e) => setAgeMonths(e.target.value)} 
                                required 
                            />
                            <small className="text-muted">Months</small>
                        </div>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Type</label>
                    <select 
                        className="form-select" 
                        value={petType} 
                        onChange={handleTypeChange} 
                        required
                    >
                        <option value="">Select a type...</option>
                        <option value="Dog">Dog</option>
                        <option value="Cat">Cat</option>
                        <option value="Bird">Bird</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Breed</label>
                    <select 
                        className="form-select" 
                        value={breed} 
                        onChange={(e) => setBreed(e.target.value)} 
                        required
                        disabled={!petType}
                    >
                        <option value="">Select a breed...</option>
                        {petType && petBreeds[petType].map((raza, index) => (
                            <option key={index} value={raza}>
                                {raza}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Allergies</label>
                    <input type="text" className="form-control" value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="None, Pollen..." required />
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
                    <textarea className="form-control" rows="3" value={info} onChange={(e) => setInfo(e.target.value)}></textarea>
                </div>

                <div className="mb-4">
                    <label className="form-label">Upload image</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                    />
                    <small className="text-muted">Select a photo (Optional)</small>
                </div>

                {}
                <button 
                    type="submit" 
                    className="btn rounded-0 w-100 text-light" 
                    style={{ background: "rgb(48, 130, 114)" }} 
                    disabled={loading}
                >
                    {loading ? "Uploading..." : "Register"}
                </button>

            </form>

        </div>
    );
};
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const BookAppointment = () => {
    const navigate = useNavigate();

    const [pets, setPets] = useState([]);
    const [selectedPet, setSelectedPet] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [motive, setMotive] = useState("");
    const [info, setInfo] = useState("");

    useEffect(() => {
        const loadPets = async () => {
            const token = localStorage.getItem("jwt-token");

            if (!token) {
                alert("You must be logged in to book an appointment");
                navigate("/login");
            } else {
                try {
                    const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/pet", {
                        method: "GET",
                        headers: {
                            "Authorization": "Bearer " + token
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setPets(data.pets);
                    } else {
                        console.log("Error loading pets");
                    }
                } catch (error) {
                    console.log("Connection error:", error);
                }
            };
        }

        loadPets();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedPet === "") {
            alert("Please select a pet");
            return;
        }
        if (date === "") {
            alert("Please select a date");
            return;
        }
        if (time === "") {
            alert("Please select a time");
            return;
        }
        if (motive === "") {
            alert("Please select a motive");
            return;
        }

        const token = localStorage.getItem("jwt-token");
        if (!token) {
            alert("Session expired, please login again");
            navigate("/login");
            return;
        }

        const appointmentData = {
            pet_id: selectedPet,
            date: date,
            time: time,
            motive: motive,
            doctor_id: 1
        };

        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/appointments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(appointmentData)
            });

            if (response.ok) {
                alert("Appointment created successfully!");
                setDate("");
                setTime("");
                setMotive("");
                setInfo("");
            } else {
                const data = await response.json();
                alert("Error: " + data.msg);
            }

        } catch (error) {
            console.error("Error creating appointment:", error);
            alert("Connection error with the server");
        }
    };

    return (
        <div className="container py-5 min-vh-100" style={{ maxWidth: "550px" }}>
            <h2 className="mb-3">Book Appointment</h2>

            <form onSubmit={handleSubmit} className="card p-3">

                <div className="mb-3">
                    <label className="form-label">Pet Name</label>
                    <select
                        className="form-select"
                        value={selectedPet}
                        onChange={(e) => setSelectedPet(e.target.value)}
                    >
                        <option value="">Select a pet</option>
                        {pets.map((pet) => (
                            <option key={pet.pet_id} value={pet.pet_id}>
                                {pet.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={date}
                        onChange={(e) => {
                            setDate(e.target.value);
                            e.target.blur();
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Time</label>
                    <select
                        className="form-select"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    >
                        <option value="">Select a time</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="13:00">1:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Motive</label>
                    <select
                        className="form-select"
                        value={motive}
                        onChange={(e) => setMotive(e.target.value)}
                    >
                        <option value="">Select a service</option>
                        <option value="Wellness Care">General Consultation</option>
                        <option value="Vaccination">Vaccination</option>
                        <option value="Surgery">Surgery</option>
                        <option value="Microchipping">Microchipping</option>
                        <option value="Dental Cleaning">Dental Cleaning</option>
                        <option value="Grooming">Grooming</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Additional Info</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        value={info}
                        onChange={(e) => setInfo(e.target.value)}
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="btn rounded-0 w-100 text-light"
                    style={{ background: "rgb(48, 130, 114)" }}
                >
                    Schedule Appointment
                </button>
            </form>
        </div>
    );
};
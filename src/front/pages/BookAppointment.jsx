import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

export const BookAppointment = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [pets, setPets] = useState([]);
    const [selectedPet, setSelectedPet] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [motive, setMotive] = useState("");
    const [info, setInfo] = useState("");

    const [takenSlots, setTakenSlots] = useState([]);

    const timeSlots = [
        { value: "09:00", label: "9:00 AM" },
        { value: "09:30", label: "9:30 AM" },
        { value: "10:00", label: "10:00 AM" },
        { value: "10:30", label: "10:30 AM" },
        { value: "11:00", label: "11:00 AM" },
        { value: "11:30", label: "11:30 AM" },
        { value: "12:00", label: "12:00 PM" },
        { value: "12:30", label: "12:30 PM" },
        { value: "13:00", label: "1:00 PM" },
        { value: "13:30", label: "1:30 PM" },
        { value: "14:00", label: "2:00 PM" },
        { value: "14:30", label: "2:30 PM" },
        { value: "15:00", label: "3:00 PM" },
        { value: "15:30", label: "3:30 PM" },
        { value: "16:00", label: "4:00 PM" },
        { value: "16:30", label: "4:30 PM" },
        { value: "17:00", label: "5:00 PM" }
    ];

    useEffect(() => {
        const loadPets = async () => {
            const token = localStorage.getItem("jwt-token");
            if (!token) {
                Swal.fire({
                    title: "Oops",
                    text: "You must be logged in to book an appointment",
                    icon: "warning",
                    confirmButtonText: "Return",
                });
                navigate("/login");
                setLoading(false);
                return;
            }
            try {
                const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/pet", {
                    method: "GET",
                    headers: { "Authorization": "Bearer " + token }
                });
                if (response.ok) {
                    const data = await response.json();
                    setPets(data.pets || []);
                } else {
                    console.log("Error loading pets");
                }
            } catch (error) {
                console.error("Connection error:", error);
            } finally {
                setLoading(false);
            }
        };
        loadPets();
    }, []);

    useEffect(() => {
        const checkAvailability = async () => {
            if (!date) return;
            const token = localStorage.getItem("jwt-token");

            try {
                const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/appointments/check", {
                    method: "GET",
                    headers: { "Authorization": "Bearer " + token }
                });

                if (response.ok) {
                    const data = await response.json();

                    if (Array.isArray(data)) {
                        const bookedTimes = data
                            .filter(appt => {
                                const isSameDate = String(appt.date).includes(date);
                                const isActive = appt.status !== "Cancelled";
                                ;
                                
                                return isSameDate && isActive ;
                            })
                            .map(appt => {
                                
                                const timeStr = String(appt.time);
                                return timeStr.substring(0, 5);
                            });

                        setTakenSlots(bookedTimes);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };
        checkAvailability();
    }, [date,]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedPet === "") {
            Swal.fire({
                icon: "warning",
                title: "Missing Information",
                text: "Please select a pet.",
                confirmButtonColor: "#308272"
            });
            return;
        }

        if (takenSlots.includes(time)) {
             Swal.fire({
                icon: "warning",
                title: "Unavailable",
                text: "This time slot is already taken. Please choose another.",
                confirmButtonColor: "#308272"
            });
            return;
        }

        const token = localStorage.getItem("jwt-token");
        if (!token) {
            navigate("/login");
            return;
        }

        const appointmentData = {
            pet_id: selectedPet,
            date: date,
            time: time,
            motive: motive,
            info: info,
            doctor_id: 1,
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
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "Appointment created successfully!",
                    confirmButtonColor: "#308272"
                });

                setDate("");
                setTime("");
                setMotive("");
                setInfo("");
                setSelectedPet("");
                setTakenSlots([]);
            } else {
                const data = await response.json();
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data.msg || "Something went wrong.",
                    confirmButtonColor: "#d33"
                });
            }
        } catch (error) {
            console.error("Error creating appointment:", error);
            Swal.fire({
                icon: "error",
                title: "Connection Error",
                text: "Could not connect to the server.",
                confirmButtonColor: "#d33"
            });
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="spinner-border" style={{ color: "rgb(48, 130, 114)", width: "3rem", height: "3rem" }} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="container py-5 min-vh-100" style={{ maxWidth: "550px" }}>
            <h2 className="mb-3">Book Appointment</h2>

            <form onSubmit={handleSubmit} className="card p-3 shadow-sm border-0">

                <div className="mb-3">
                    <label className="form-label fw-bold">Pet Name</label>
                    <select
                        className="form-select"
                        value={selectedPet}
                        required
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
                    <label className="form-label fw-bold">Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={date}
                        required
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => {
                            setDate(e.target.value);
                            setTime("");
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Time</label>
                    <select
                        className="form-select"
                        value={time}
                        required
                        onChange={(e) => setTime(e.target.value)}
                        disabled={!date}
                    >
                        <option value="">
                            {!date ? "Select a date first" : "Select a time"}
                        </option>
                        {timeSlots.map((slot) => {
                            const isTaken = takenSlots.includes(slot.value);
                            return (
                                <option
                                    key={slot.value}
                                    value={slot.value}
                                    disabled={isTaken}
                                    style={isTaken ? { backgroundColor: "#e0e0e0", color: "#a0a0a0" } : {}}
                                >
                                    {slot.label} {isTaken ? "(Booked)" : ""}
                                </option>
                            );
                        })}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Motive</label>
                    <select
                        className="form-select"
                        value={motive}
                        required
                        onChange={(e) => setMotive(e.target.value)}
                    >
                        <option value="">Select a service</option>
                        <option value="General Consultation">General Consultation</option>
                        <option value="Vaccination">Vaccination</option>
                        <option value="Surgery">Surgery</option>
                        <option value="Microchipping">Microchipping</option>
                        <option value="Dental Cleaning">Dental Cleaning</option>
                        <option value="Grooming">Grooming</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Additional Info</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        value={info}
                        onChange={(e) => setInfo(e.target.value)}
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="btn w-100 text-light fw-bold py-2"
                    style={{ background: "rgb(48, 130, 114)" }}
                >
                    Schedule Appointment
                </button>
            </form>
        </div>
    );
};
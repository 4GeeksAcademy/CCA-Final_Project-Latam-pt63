import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from 'sweetalert2';



export const EditAppointment = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [loading, setLoading] = useState(true);
    const [takenSlots, setTakenSlots] = useState([]);
    const [formData, setFormData] = useState({
        date: "",
        time: "",
        motive: "",
        notes: "" 
    });

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
        const getAppointment = async () => {
            const token = localStorage.getItem("jwt-token");
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await fetch(`${backendUrl}/appointment/${appointmentId}`, {
                    headers: { "Authorization": "Bearer " + token }
                });
                if (response.ok) {
                    const data = await response.json();
                    
                    let formattedTime = data.time;
                    if(data.time && data.time.length > 5) {
                        formattedTime = data.time.substring(0, 5);
                    }

                    setFormData({
                        date: data.date,
                        time: formattedTime,
                        motive: data.motive,
                        notes: data.notes || ""
                    });
                } else {
                    Swal.fire("Error", "Could not load appointment details", "error");
                    navigate("/private/agenda");
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        getAppointment();
    }, [appointmentId, navigate, backendUrl]);

    useEffect(() => {
        const checkAvailability = async () => {
            if (!formData.date) return;
            const token = localStorage.getItem("jwt-token");
            
            try {
                const response = await fetch(`${backendUrl}/appointments`, {
                    method: "GET",
                    headers: { "Authorization": "Bearer " + token }
                });

                if (response.ok) {
                    const data = await response.json();
                    
                    if (Array.isArray(data)) {
                        const bookedTimes = data
                            .filter(appt => {
                                const isSameDate = String(appt.date).includes(formData.date);
                                const isActive = appt.status !== "Cancelled";
                                const isNotCurrentAppt = String(appt.id) !== String(appointmentId) && String(appt.appointment_id) !== String(appointmentId);
                                
                                return isSameDate && isActive && isNotCurrentAppt;
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
    }, [formData.date, appointmentId, backendUrl]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (takenSlots.includes(formData.time)) {
             Swal.fire({
                icon: "error",
                title: "Unavailable",
                text: "This time slot is already taken by another appointment.",
                confirmButtonColor: "#308272"
            });
             return;
        }

        try {
            const token = localStorage.getItem("jwt-token");
            const response = await fetch(`${backendUrl}/appointment/${appointmentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                Swal.fire({
                    title: "Success!",
                    text: "Appointment updated successfully",
                    icon: "success",
                    confirmButtonColor: "#10b981"
                });
                navigate(`/private/agenda/details/${appointmentId}`);
            } else {
                const data = await response.json();
                Swal.fire("Error", data.msg || "Update failed", "error");
            }
        } catch (error) {
            Swal.fire("Error", "Connection error", "error");
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5 min-vh-100" style={{ maxWidth: "600px", marginTop: "60px" }}>
            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-header bg-white border-0 pt-4 px-4">
                    <h3 className="fw-bold text-dark">Edit Appointment</h3>
                    <p className="text-muted">ID: APT-{appointmentId}</p>
                </div>
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        
                        <div className="mb-3">
                            <label className="form-label fw-bold">Date</label>
                            <input
                                type="date"
                                className="form-control"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Time</label>
                            <select
                                className="form-select"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a time</option>
                                {timeSlots.map((slot) => {
                                    const isTaken = takenSlots.includes(slot.value);
                                    return (
                                        <option 
                                            key={slot.value} 
                                            value={slot.value} 
                                            disabled={isTaken}
                                            style={isTaken ? { backgroundColor: "#e0e0e0", color: "#a0a0a0", textDecoration: "line-through" } : {}}
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
                                name="motive"
                                value={formData.motive}
                                onChange={handleChange}
                                required
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

                        <div className="d-flex gap-2 mt-4">
                            <button
                                type="button"
                                className="btn btn-outline-secondary w-50"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-success w-50"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
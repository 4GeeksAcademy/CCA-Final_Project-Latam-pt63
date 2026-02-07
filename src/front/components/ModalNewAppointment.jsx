import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';

export const ModalNewAppointment = ({ show, onClose, onSave }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    
    const [clientsDB, setClientsDB] = useState([]); 
    const [allPetsDB, setAllPetsDB] = useState([]); 
    const [takenSlots, setTakenSlots] = useState([]);
    
    const [selectedClientId, setSelectedClientId] = useState("");
    const [selectedPetId, setSelectedPetId] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [reason, setReason] = useState("");
    
    const [availablePets, setAvailablePets] = useState([]);

    const timeSlots = [
        { value: "09:00", label: "09:00 AM" },
        { value: "09:30", label: "09:30 AM" },
        { value: "10:00", label: "10:00 AM" },
        { value: "10:30", label: "10:30 AM" },
        { value: "11:00", label: "11:00 AM" },
        { value: "11:30", label: "11:30 AM" },
        { value: "12:00", label: "12:00 PM" },
        { value: "12:30", label: "12:30 PM" },
        { value: "13:00", label: "01:00 PM" },
        { value: "13:30", label: "01:30 PM" },
        { value: "14:00", label: "02:00 PM" },
        { value: "14:30", label: "02:30 PM" },
        { value: "15:00", label: "03:00 PM" },
        { value: "15:30", label: "03:30 PM" },
        { value: "16:00", label: "04:00 PM" },
        { value: "16:30", label: "04:30 PM" },
        { value: "17:00", label: "05:00 PM" }
    ];

    useEffect(() => {
        if (show) getDataFromBackend();
    }, [show]);

    useEffect(() => {
        const checkAvailability = async () => {
            if (!date) return;
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
                                return String(appt.date).includes(date) && appt.status !== "Cancelled";
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
    }, [date]);

    const getDataFromBackend = async () => {
        try {
            const token = localStorage.getItem("jwt-token");
            if (!token) return;
            const headers = { "Content-Type": "application/json", "Authorization": "Bearer " + token };

            const resUsers = await fetch(backendUrl + "/users", { method: "GET", headers });
            if (resUsers.ok) {
                const dataUsers = await resUsers.json();
                setClientsDB(Array.isArray(dataUsers) ? dataUsers : (dataUsers.users || []));
            }

            const resPets = await fetch(backendUrl + "/pet", { method: "GET", headers });
            if (resPets.ok) {
                const dataPets = await resPets.json();
                setAllPetsDB(dataPets.pets || []);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleClientChange = (e) => {
        const clientId = e.target.value;
        setSelectedClientId(clientId);
        
        if (clientId) {
            const filteredPets = allPetsDB.filter(pet => String(pet.owner_id) === String(clientId));
            setAvailablePets(filteredPets);
        } else {
            setAvailablePets([]);
        }
        setSelectedPetId(""); 
    };

    const handleSubmit = () => {
        if (!selectedClientId || !selectedPetId || !time || !reason || !date) {
            Swal.fire("Error", "Please complete all fields.", "warning");
            return;
        }

        if (takenSlots.includes(time)) {
             Swal.fire("Error", "This time slot is already taken. Please choose another.", "error");
             return;
        }

        onSave({ 
            pet_id: selectedPetId,
            date: date, 
            time: time, 
            reason: reason 
        });
        
        handleClose(); 
    };

    const handleClose = () => {
        setSelectedClientId("");
        setSelectedPetId("");
        setAvailablePets([]);
        setDate("");
        setTime("");
        setReason("");
        setTakenSlots([]);
        onClose();
    };

    if (!show) return null;

    return (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content shadow rounded-4">
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold text-dark">Book New Appointment</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body p-4">
                        <form>
                            <div className="mb-3">
                                <label className="form-label small text-muted">Owner</label>
                                <select className="form-select" value={selectedClientId} onChange={handleClientChange}>
                                    <option value="">Select Owner...</option>
                                    {clientsDB.map((client, index) => {
                                        const realID = client.id || client.ID || client.user_id || client._id;
                                        const displayName = client.name || (client.first_name ? `${client.first_name} ${client.last_name || ""}` : client.email);
                                        return <option key={index} value={realID}>{displayName}</option>;
                                    })}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label small text-muted">Pet Name</label>
                                <select className="form-select" value={selectedPetId} onChange={(e) => setSelectedPetId(e.target.value)} disabled={!selectedClientId}>
                                    <option value="">Select a pet</option>
                                    {availablePets.length > 0 ? (
                                        availablePets.map((pet, idx) => <option key={idx} value={pet.id || pet.pet_id}>{pet.name}</option>)
                                    ) : <option disabled>No pets registered</option>}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label small text-muted">Date</label>
                                <input 
                                    type="date" 
                                    className="form-control" 
                                    value={date} 
                                    min={new Date().toISOString().split("T")[0]}
                                    onChange={(e) => {
                                        setDate(e.target.value);
                                        setTime("");
                                    }} 
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label small text-muted">Time</label>
                                <select 
                                    className="form-select" 
                                    value={time} 
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
                                                style={isTaken ? { backgroundColor: "#e0e0e0", color: "#a0a0a0", textDecoration: "line-through" } : {}}
                                            >
                                                {slot.label} {isTaken ? "(Occupied)" : ""}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="form-label small text-muted">Motive</label>
                                <select className="form-select" value={reason} onChange={(e) => setReason(e.target.value)}>
                                    <option value="">Select a service</option>
                                    <option value="Wellness Care">General Consultation</option>
                                    <option value="Vaccination">Vaccination</option>
                                    <option value="Surgery">Surgery</option>
                                    <option value="Microchipping">Microchipping</option>
                                    <option value="Dental Cleaning">Dental Cleaning</option>
                                    <option value="Grooming">Grooming</option>
                                </select>
                            </div>

                            <div className="d-grid">
                                <button type="button" className="btn btn-vet text-white py-2 rounded-3" onClick={handleSubmit}>
                                    Schedule Appointment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
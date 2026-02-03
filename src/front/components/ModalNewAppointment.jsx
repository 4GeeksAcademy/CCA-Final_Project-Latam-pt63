import React, { useState, useEffect } from "react";

export const ModalNewAppointment = ({ show, onClose, onSave }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    
    const [clientsDB, setClientsDB] = useState([]); 
    const [allPetsDB, setAllPetsDB] = useState([]); 
    
    const [selectedClientId, setSelectedClientId] = useState("");
    const [selectedPet, setSelectedPet] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [reason, setReason] = useState("");
    
    const [availablePets, setAvailablePets] = useState([]);

    // Horarios
    const timeSlots = [
        "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", 
        "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", 
        "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM"
    ];

    useEffect(() => {
        if (show) getDataFromBackend();
    }, [show]);

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
        const filteredPets = allPetsDB.filter(pet => pet.owner_id == clientId);
        setAvailablePets(filteredPets);
        setSelectedPet(""); 
    };

    const handleSubmit = () => {
        if (!selectedClientId || !selectedPet || !time || !reason) {
            alert("Please complete all fields.");
            return;
        }

        // 1. Buscamos el objeto completo del CLIENTE para sacar su nombre
        const clientObj = clientsDB.find(c => (c.id || c.ID || c.user_id) == selectedClientId);
        let ownerName = "Unknown";
        if (clientObj) {
            ownerName = clientObj.name || (clientObj.first_name ? `${clientObj.first_name} ${clientObj.last_name || ""}` : clientObj.email);
        }

        // 2. Buscamos el objeto completo de la MASCOTA para sacar su ID
        const petObj = availablePets.find(p => p.name === selectedPet);
        
        // Enviamos todo al padre (incluyendo el ID oculto)
        onSave({ 
            pet_id: petObj?.pet_id, // ¡ESTO ES LO IMPORTANTE PARA EL BACKEND!
            ownerName: ownerName, 
            petName: selectedPet, 
            date: date, 
            time: time, 
            reason: reason 
        });
        
        handleClose(); 
    };

    const handleClose = () => {
        setSelectedClientId("");
        setSelectedPet("");
        setAvailablePets([]);
        setDate("");
        setTime("");
        setReason("");
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
                                <select className="form-select" value={selectedPet} onChange={(e) => setSelectedPet(e.target.value)} disabled={!selectedClientId}>
                                    <option value="">Select a pet</option>
                                    {availablePets.length > 0 ? (
                                        availablePets.map((pet, idx) => <option key={idx} value={pet.name}>{pet.name}</option>)
                                    ) : <option disabled>No pets registered</option>}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label small text-muted">Date</label>
                                <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label small text-muted">Time</label>
                                <select className="form-select" value={time} onChange={(e) => setTime(e.target.value)}>
                                    <option value="">Select a time</option>
                                    {timeSlots.map((slot, index) => <option key={index} value={slot}>{slot}</option>)}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="form-label small text-muted">Motive</label>
                                <select className="form-select" value={reason} onChange={(e) => setReason(e.target.value)}>
                                    <option value="">Select a service</option>
                                    <option value="General Consultation">General Consultation</option>
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
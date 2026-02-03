import React, { useState, useEffect } from "react";
import { ModalNewAppointment } from "../components/ModalNewAppointment";
import { Link } from "react-router-dom";
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks } from "date-fns";
import { enUS } from "date-fns/locale";

export const AdminAgenda = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [showModal, setShowModal] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [referenceDate, setReferenceDate] = useState(new Date());
    const [currentWeek, setCurrentWeek] = useState([]);
    const generateWeek = (date) => {
        const start = startOfWeek(date, { weekStartsOn: 1 });
        const daysArray = [];
        for (let i = 0; i < 7; i++) {
            const dayDate = addDays(start, i);
            daysArray.push({
                dayName: format(dayDate, "eee", { locale: enUS }),
                dayNumber: format(dayDate, "d"),
                fullDate: dayDate,
                isToday: isSameDay(dayDate, new Date())
            });
        }
        setCurrentWeek(daysArray);
    };

    const getApptCount = (date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        return appointments.filter(appt => appt.date === dateStr).length;
    };

    const handleNextWeek = () => {
        const newDate = addWeeks(referenceDate, 1);
        setReferenceDate(newDate);
        generateWeek(newDate);
    };

    const handlePrevWeek = () => {
        const newDate = subWeeks(referenceDate, 1);
        setReferenceDate(newDate);
        generateWeek(newDate);
    };

    useEffect(() => {
        generateWeek(referenceDate);
        getAppointments();
    }, []);

    const getAppointments = async () => {
        try {
            const token = localStorage.getItem("jwt-token");
            if (!token) return;
            const response = await fetch(backendUrl + "/appointments", {
                method: "GET",
                headers: { 
                    "Content-Type": "application/json", 
                    "Authorization": "Bearer " + token 
                }
            });
            if (response.ok) {
                const data = await response.json();
                setAppointments(data);
            }
        } catch (error) { 
            console.error("Error fetching appointments:", error); 
        }
    };

    const handleAddAppointment = async (newAppointment) => {
        try {
            const token = localStorage.getItem("jwt-token");
            const payload = {
                pet_id: newAppointment.pet_id,
                date: newAppointment.date,
                time: newAppointment.time,
                motive: newAppointment.reason, 
                doctor_id: 1 
            };
            const response = await fetch(backendUrl + "/appointments", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json", 
                    "Authorization": "Bearer " + token 
                },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                alert("Appointment created successfully! 🎉");
                setShowModal(false);
                getAppointments();
            } else {
                const errorData = await response.json();
                alert("Error: " + (errorData.msg || "Conflict at this time"));
            }
        } catch (error) { 
            console.error(error); 
        }
    };

    const filteredAppointments = appointments.filter(appt => {
        const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
        return appt.date === selectedDateStr;
    });

    return (
        <div className="container-fluid p-4 bg-light min-vh-100" style={{ marginTop: "80px" }}>
            
            {}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-dark">Agenda</h2>
                    <p className="text-muted">Overview for <b>{format(selectedDate, "MMMM do, yyyy")}</b></p>
                </div>
                <button className="btn btn-vet text-white px-4 py-2 rounded-3 shadow-sm" onClick={() => setShowModal(true)}>
                    <i className="fa-solid fa-plus me-2"></i> New Appointment
                </button>
            </div>

            {}
            <div className="card border-0 shadow-sm rounded-4 mb-4 p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold m-0 text-uppercase tracking-wider text-secondary">
                        <i className="fa-regular fa-calendar-days me-2"></i>
                        {format(referenceDate, "MMMM yyyy", { locale: enUS })}
                    </h5>
                    <div className="d-flex gap-2">
                        <button className="btn btn-white border btn-sm rounded-pill px-3 shadow-sm" onClick={handlePrevWeek}>← Previous</button>
                        <button className="btn btn-white border btn-sm rounded-pill px-3 shadow-sm" onClick={handleNextWeek}>Next →</button>
                    </div>
                </div>

                <div className="d-flex justify-content-between text-center overflow-auto gap-3 pb-2">
                    {currentWeek.map((item, index) => {
                        const isSelected = isSameDay(item.fullDate, selectedDate);
                        const count = getApptCount(item.fullDate);
                        
                        return (
                            <div 
                                key={index} 
                                onClick={() => setSelectedDate(item.fullDate)}
                                className={`p-3 rounded-4 flex-fill cursor-pointer transition-all d-flex flex-column align-items-center justify-content-center ${
                                    isSelected ? 'bg-vet text-white shadow-lg scale-105' : 'bg-white border text-muted hover-bg-light'
                                }`}
                                style={{ 
                                    minWidth: "115px", 
                                    height: "140px", 
                                    transition: "0.3s ease",
                                    border: isSelected ? "none" : "1px solid #eee"
                                }}
                            >
                                <small className={`fw-bold text-uppercase mb-1 ${isSelected ? "text-white-50" : "text-secondary"}`} style={{ fontSize: "0.75rem" }}>
                                    {item.dayName}
                                </small>
                                
                                <h2 className="fw-bold m-0">{item.dayNumber}</h2>
                                
                                {count > 0 ? (
                                    <div className={`mt-2 px-2 py-1 rounded-pill small fw-bold ${isSelected ? "bg-white text-vet" : "bg-vet text-white"}`} style={{ fontSize: "0.7rem" }}>
                                        <i className="fa-solid fa-check-double me-1"></i>
                                        {count} {count === 1 ? 'Appt' : 'Appts'}
                                    </div>
                                ) : (
                                    <div className="mt-2 small opacity-50" style={{ fontSize: "0.65rem" }}>
                                        <i className="fa-solid fa-minus me-1"></i> Free
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {}
            <div className="card border-0 shadow-sm rounded-4 p-4">
                <div className="d-flex justify-content-between align-items-center mb-4 p-3 rounded-4" style={{backgroundColor: "rgba(48, 130, 114, 0.08)"}}>
                     <h5 className="fw-bold m-0 text-dark">
                        <i className="fa-solid fa-clock-rotate-left me-2 text-vet"></i>
                        Schedule: {format(selectedDate, "eeee, MMM d")}
                     </h5>
                     <span className="badge bg-vet rounded-pill px-3">{filteredAppointments.length} Active</span>
                </div>

                {filteredAppointments.length === 0 ? (
                    <div className="text-center py-5 text-muted bg-white rounded-4 border border-dashed">
                        <i className="fa-solid fa-calendar-xmark fa-3x mb-3 opacity-25"></i>
                        <h5>No appointments today</h5>
                        <p className="small">The doctor's schedule is empty for this date.</p>
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-3">
                        {filteredAppointments.map((cita, index) => (
                            <div key={index} className="card border-0 bg-white p-3 rounded-4 shadow-sm hover-shadow-transition border-start border-4" style={{ borderLeftColor: "var(--vet-green) !important" }}>
                                <div className="row align-items-center">
                                    <div className="col-md-2 text-center">
                                        <div className="bg-light p-2 rounded-3 text-vet fw-bold shadow-sm">
                                            <i className="fa-regular fa-clock me-2"></i>
                                            {cita.time}
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <h5 className="mb-1 fw-bold text-dark">{cita.motive}</h5>
                                        <span className="text-muted small">
                                            <i className="fa-solid fa-paw me-1 text-vet"></i> Patient: <b>{cita.pet_name}</b>
                                        </span>
                                    </div>
                                    <div className="col-md-3 text-muted small">
                                        <i className="fa-solid fa-user-doctor me-1"></i> Dr. Assigned <br/>
                                        <i className="fa-solid fa-hourglass-half me-1"></i> 30 min session
                                    </div>
                                    <div className="col-md-3 text-end">
                                        <Link to={`/private/agenda/details/${cita.id}`} className="btn btn-outline-vet rounded-pill btn-sm px-3 fw-bold">
                                            Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ModalNewAppointment show={showModal} onClose={() => setShowModal(false)} onSave={handleAddAppointment} />
        </div>
    );
};
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export const AppointmentDetails = () => {
    const { appointmentId } = useParams();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [details, setDetails] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        getDetails();
    }, []);

    const getDetails = async () => {
        try {
            const token = localStorage.getItem("jwt-token");
            const response = await fetch(`${backendUrl}/appointment/${appointmentId}`, {
                headers: { "Authorization": "Bearer " + token }
            });
            if (response.ok) {
                const data = await response.json();
                setDetails(data);
                if (data.pet_id) {
                    getHistory(data.pet_id);
                }
            } else {
                alert("Error loading appointment");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getHistory = async (petId) => {
        try {
            const token = localStorage.getItem("jwt-token");
            const response = await fetch(`${backendUrl}/history/${petId}`, {
                headers: { "Authorization": "Bearer " + token }
            });
            if (response.ok) {
                const data = await response.json();
                const previousAppointments = data.history.filter(appt => appt.appointment_id !== parseInt(appointmentId));
                setHistory(previousAppointments);
            }
        } catch (error) {
            console.error("Error fetching history:", error);
        }
    };

    if (!details) return <div className="text-center mt-5">Loading details...</div>;

    return (
        <div className="container-fluid p-4 bg-light min-vh-100" style={{ marginTop: "80px" }}>

            { }
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <Link to="/private/agenda" className="text-decoration-none text-muted mb-2 d-inline-block">
                        <i className="fa-solid fa-arrow-left me-2"></i> Back to Agenda
                    </Link>
                    <h2 className="fw-bold text-dark">Appointment Details</h2>
                    <p className="text-muted">ID: APT-{details.appointment_id}</p>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-danger text-white"><i className="fa-solid fa-xmark me-2"></i>Cancel</button>
                    <button className="btn btn-primary"><i className="fa-solid fa-pen me-2"></i>Edit</button>
                    <button className="btn btn-success"><i className="fa-solid fa-check me-2"></i>Confirm</button>
                </div>
            </div>

            { }
            <div className="card border-0 shadow-sm rounded-4 mb-4 text-white overflow-hidden" style={{ background: "linear-gradient(90deg, #10b981 0%, #059669 100%)" }}>
                <div className="card-body p-4">
                    <div className="row text-center text-md-start">
                        <div className="col-md-3 border-end border-white border-opacity-25 mb-3 mb-md-0">
                            <small className="opacity-75"><i className="fa-regular fa-calendar me-2"></i>Date & Time</small>
                            <h5 className="fw-bold m-0 mt-1">{details.date} - {details.time}</h5>
                            <small>30 minutes</small>
                        </div>
                        <div className="col-md-3 border-end border-white border-opacity-25 mb-3 mb-md-0">
                            <small className="opacity-75"><i className="fa-solid fa-stethoscope me-2"></i>Reason</small>
                            <h5 className="fw-bold m-0 mt-1">{details.motive}</h5>
                            <small>Priority: Normal</small>
                        </div>
                        <div className="col-md-3 border-end border-white border-opacity-25 mb-3 mb-md-0">
                            <small className="opacity-75"><i className="fa-solid fa-user-doctor me-2"></i>Veterinarian</small>
                            <h5 className="fw-bold m-0 mt-1">{details.doctor_name}</h5>
                            <small>General Medicine</small>
                        </div>
                        <div className="col-md-3">
                            <small className="opacity-75"><i className="fa-solid fa-circle-info me-2"></i>Status</small>
                            <div className="mt-1">
                                <span className={`badge rounded-pill px-3 py-2 ${details.status === 'Confirmed' ? 'bg-white text-success' : 'bg-warning text-dark'}`}>
                                    {details.status || "Pending"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                { }
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-header bg-white border-0 pt-4 px-4">
                            <h5 className="fw-bold text-success"><i className="fa-regular fa-user me-2"></i>Client Information</h5>
                        </div>
                        <div className="card-body px-4 pb-4">
                            <h4 className="fw-bold mb-3">
                                {details.owner_data ? details.owner_data.first_name + " " + details.owner_data.last_name : "N/A"}
                            </h4>
                            <div className="row mb-3">
                                <div className="col-6">
                                    <small className="text-muted d-block">Phone</small>
                                    <span className="fw-medium">{details.owner_data?.phonenumber}</span>
                                </div>
                                <div className="col-6">
                                    <small className="text-muted d-block">Email</small>
                                    <span className="fw-medium text-truncate d-block">{details.owner_data?.email}</span>
                                </div>
                            </div>
                            <div className="mb-3">
                                <small className="text-muted d-block">Address</small>
                                <span className="fw-medium">{details.owner_data?.address || "Not registered"}</span>
                            </div>
                            <div className="alert alert-primary border-0 bg-opacity-10 d-flex align-items-center" role="alert">
                                <i className="fa-solid fa-circle-info me-3 fs-5"></i>
                                <div>
                                    <small className="fw-bold d-block">Client Notes</small>
                                    <small>Frequent client. Prefers morning appointments.</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                { }
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-header bg-white border-0 pt-4 px-4">
                            <h5 className="fw-bold text-success"><i className="fa-solid fa-paw me-2"></i>Pet Information</h5>
                        </div>
                        <div className="card-body px-4 pb-4">
                            <h4 className="fw-bold mb-3">{details.pet_data?.name}</h4>
                            <div className="row g-3">
                                <div className="col-6">
                                    <div className="p-2 border rounded-3 bg-light">
                                        <small className="text-muted d-block">Species</small>
                                        <b>{details.pet_data?.pet_type}</b>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="p-2 border rounded-3 bg-light">
                                        <small className="text-muted d-block">Breed</small>
                                        <b>{details.pet_data?.breed || "Mix"}</b>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="p-2 border rounded-3 bg-light">
                                        <small className="text-muted d-block">Birthdate</small>
                                        <b>{details.pet_data?.birthdate || "N/A"}</b>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="p-2 border rounded-3 bg-light">
                                        <small className="text-muted d-block">Allergies</small>
                                        <b className="text-danger">{details.pet_data?.allergies || "None"}</b>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                { }
                <div className="col-12">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold text-success mb-0"><i className="fa-solid fa-clock-rotate-left me-2"></i>Recent Visit History</h5>
                            <span className="badge bg-light text-muted border">{history.length} records</span>
                        </div>
                        <div className="card-body px-4 pb-4">
                            {history.length === 0 ? (
                                <p className="text-muted text-center py-3">No previous visits recorded.</p>
                            ) : (
                                <div className="list-group list-group-flush">
                                    {history.map((visit, index) => (
                                        <div key={index} className="list-group-item border-0 px-0 py-3 border-bottom d-flex align-items-center justify-content-between">
                                            <div>
                                                <h6 className="fw-bold mb-1 text-dark">{visit.motive}</h6>
                                                <small className="text-muted">
                                                    <i className="fa-regular fa-calendar me-2"></i>{visit.date}
                                                    <span className="mx-2">•</span>
                                                    Dr. {visit.doctor_name || "Unknown"}
                                                </small>
                                            </div>
                                            <span className={`badge rounded-pill px-3 ${visit.status === 'Confirmed' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                                                {visit.status || "Completed"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="text-center mt-3">
                                <button className="btn btn-link text-success text-decoration-none fw-bold small">
                                    View Full History <i className="fa-solid fa-chevron-right ms-1"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                { }
                <div className="col-12">
                    <div className="card border-0 shadow-sm rounded-4 p-4">
                        <h5 className="fw-bold mb-3">Quick Actions</h5>
                        <div className="d-flex gap-3 flex-wrap">
                            <button className="btn btn-success px-4 py-2 rounded-pill shadow-sm"><i className="fa-solid fa-play me-2"></i>Start Consultation</button>
                            <button className="btn btn-primary px-4 py-2 rounded-pill shadow-sm"><i className="fa-regular fa-paper-plane me-2"></i>Send Reminder</button>
                            <button className="btn btn-dark px-4 py-2 rounded-pill shadow-sm"><i className="fa-solid fa-print me-2"></i>Print Details</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export const AppointmentDetails = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [details, setDetails] = useState(null);
    const [history, setHistory] = useState([]);
    const [showConsultation, setShowConsultation] = useState(false);

    useEffect(() => {
        getDetails();
    }, []);

    const calculateAge = (birthdateString) => {
        if (!birthdateString) return "N/A";
        const birthDate = new Date(birthdateString);
        const today = new Date();
        let years = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            years--;
        }
        
        if (years === 0) {
            let months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
            if (months < 0) months = 0;
            return months === 1 ? "1 month" : months + " months";
        }
        
        return years === 1 ? "1 year" : years + " years";
    };

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
            } else if (response.status === 401) {
                Swal.fire({
                    title: 'Session Expired',
                    text: 'Please log in again.',
                    icon: 'warning',
                    confirmButtonColor: '#3085d6',
                }).then(() => {
                    localStorage.removeItem("jwt-token");
                    navigate("/login");
                });
            } else {
                Swal.fire('Error', 'Error loading appointment', 'error');
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
                const currentApptId = parseInt(appointmentId);
                const previousAppointments = data.history.filter(appt => appt.appointment_id !== currentApptId);
                setHistory(previousAppointments);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSaveConsultation = async (medicalData) => {
        try {
            const token = localStorage.getItem("jwt-token");
            const response = await fetch(`${backendUrl}/appointment/${appointmentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    ...medicalData,
                    status: "Completed"
                })
            });

            if (response.ok) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Consultation saved successfully!',
                    icon: 'success',
                    confirmButtonColor: '#10b981',
                });
                setShowConsultation(false);
                getDetails();
            } else if (response.status === 401) {
                Swal.fire('Session Expired', 'Please copy your notes before reloading.', 'warning');
            } else {
                Swal.fire('Error', 'Error saving data.', 'error');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSendReminder = async () => {
        Swal.fire({
            title: 'Simulation',
            text: `Reminder sent to ${details.owner_data.email}`,
            icon: 'info'
        });
    };

    const handleCancelAppointment = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, cancel it!'
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem("jwt-token");
                const response = await fetch(`${backendUrl}/appointment/${appointmentId}`, {
                    method: "DELETE", 
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                });

                if (response.ok) {
                    await Swal.fire(
                        'Cancelled!',
                        'The appointment has been cancelled.',
                        'success'
                    );
                    navigate("/private/agenda");
                } else {
                    const data = await response.json();
                    Swal.fire('Error', data.msg || 'Could not cancel appointment', 'error');
                }
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'Connection error', 'error');
            }
        }
    };

    const handleEditAppointment = () => {
        navigate(`/private/edit-appointment/${appointmentId}`);
    };

    if (!details) return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    return (
        <div className="container-fluid p-4 bg-light min-vh-100" style={{ marginTop: "80px" }}>
            
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <Link to="/private/agenda" className="text-decoration-none text-muted mb-2 d-inline-block">
                        <i className="fa-solid fa-arrow-left me-2"></i> Back to Agenda
                    </Link>
                    <h2 className="fw-bold text-dark">Appointment Details</h2>
                    <p className="text-muted">ID: APT-{details.appointment_id}</p>
                </div>
                {details.status !== 'Completed' && (
                    <div className="d-flex gap-2">
                        <button 
                            className="btn btn-danger text-white" 
                            onClick={handleCancelAppointment}
                        >
                            <i className="fa-solid fa-xmark me-2"></i>Cancel
                        </button>
                        <button 
                            className="btn btn-primary" 
                            onClick={handleEditAppointment}
                        >
                            <i className="fa-solid fa-pen me-2"></i>Edit
                        </button>
                    </div>
                )}
            </div>

            <div className="card border-0 shadow-sm rounded-4 mb-4 text-white overflow-hidden" 
                 style={{ background: "linear-gradient(90deg, #10b981 0%, #059669 100%)" }}>
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
                                <span className={`badge rounded-pill px-3 py-2 ${details.status === 'Completed' ? 'bg-white text-success' : 'bg-warning text-dark'}`}>
                                    {details.status || "Pending"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
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
                                    <small>{details.owner_data?.notes || "No additional notes available for this client."}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

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
                                        <small className="text-muted d-block">Age</small>
                                        <b>{calculateAge(details.pet_data?.birthdate)}</b>
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

                {details.status === "Completed" && (
                    <div className="col-12">
                        <div className="card border-0 shadow-sm rounded-4 bg-white border-success border-start border-5">
                            <div className="card-header bg-white border-0 pt-4 px-4">
                                <h5 className="fw-bold text-dark"><i className="fa-solid fa-file-medical me-2 text-success"></i>Consultation Report</h5>
                            </div>
                            <div className="card-body px-4 pb-4">
                                <div className="row g-4">
                                    <div className="col-md-12">
                                        <h6 className="fw-bold text-secondary">Anamnesis / Diagnosis</h6>
                                        <div className="p-3 bg-light rounded-3">
                                            {details.anamnesis || <em className="text-muted">No details recorded.</em>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="fw-bold text-secondary">Procedures</h6>
                                        <div className="p-3 bg-light rounded-3">
                                            {details.procedures || <em className="text-muted">None.</em>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="fw-bold text-secondary">Medication</h6>
                                        <div className="p-3 bg-light rounded-3">
                                            {details.medication || <em className="text-muted">None.</em>}
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <h6 className="fw-bold text-secondary">Observations</h6>
                                        <div className="p-3 bg-light rounded-3">
                                            {details.observations || <em className="text-muted">No observations.</em>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

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
                                            <span className={`badge rounded-pill px-3 ${visit.status === 'Completed' ? 'bg-secondary-subtle text-secondary' : 'bg-success-subtle text-success'}`}>
                                                {visit.status || "Completed"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-12">
                    <div className="card border-0 shadow-sm rounded-4 p-4">
                        <h5 className="fw-bold mb-3">Quick Actions</h5>
                        <div className="d-flex gap-3 flex-wrap">
                            {details.status !== 'Completed' ? (
                                <button className="btn btn-success px-4 py-2 rounded-pill shadow-sm" onClick={() => setShowConsultation(true)}>
                                    <i className="fa-solid fa-play me-2"></i>Start Consultation
                                </button>
                            ) : (
                                <button className="btn btn-secondary px-4 py-2 rounded-pill shadow-sm" disabled>
                                    <i className="fa-solid fa-check me-2"></i>Consultation Finished
                                </button>
                            )}
                            
                            <button className="btn btn-primary px-4 py-2 rounded-pill shadow-sm" onClick={handleSendReminder}>
                                <i className="fa-regular fa-paper-plane me-2"></i>Send Reminder
                            </button>

                            <button className="btn btn-dark px-4 py-2 rounded-pill shadow-sm" onClick={() => window.print()}>
                                <i className="fa-solid fa-print me-2"></i>Print Details
                            </button>
                        </div>

                        <ModalConsultation
                            show={showConsultation}
                            onClose={() => setShowConsultation(false)}
                            onSave={handleSaveConsultation}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
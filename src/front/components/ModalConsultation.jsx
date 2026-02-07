import React, { useState } from "react";

export const ModalConsultation = ({ show, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        anamnesis: "",
        medication: "",
        procedures: "",
        observations: "",
        hasVaccine: false,
        vaccine_name: "",
        vaccination_date: new Date().toISOString().split('T')[0],
        expiry_date: ""
    });

    if (!show) return null;

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = () => {
        const payload = {
            anamnesis: formData.anamnesis,
            medication: formData.medication,
            procedures: formData.procedures,
            observations: formData.observations,
        };

        if (formData.hasVaccine) {
            payload.vaccine_name = formData.vaccine_name;
            payload.vaccination_date = formData.vaccination_date;
            payload.expiry_date = formData.expiry_date;
        }

        onSave(payload);
        setFormData({
            anamnesis: "",
            medication: "",
            procedures: "",
            observations: "",
            hasVaccine: false,
            vaccine_name: "",
            vaccination_date: new Date().toISOString().split('T')[0],
            expiry_date: ""
        });
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: "1055" }} tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content rounded-4 border-0 shadow">
                    <div className="modal-header bg-success text-white">
                        <h5 className="modal-title"><i className="fa-solid fa-stethoscope me-2"></i>Medical Consultation</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-4 bg-light">
                        <div className="mb-3">
                            <label className="fw-bold text-secondary">Anamnesis / Diagnosis</label>
                            <textarea name="anamnesis" className="form-control" rows="2" value={formData.anamnesis} onChange={handleChange}></textarea>
                        </div>
                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <label className="fw-bold text-secondary">Procedures</label>
                                <textarea name="procedures" className="form-control" rows="2" value={formData.procedures} onChange={handleChange}></textarea>
                            </div>
                            <div className="col-md-6">
                                <label className="fw-bold text-secondary">Medication</label>
                                <textarea name="medication" className="form-control" rows="2" value={formData.medication} onChange={handleChange}></textarea>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="fw-bold text-secondary">Observations</label>
                            <textarea name="observations" className="form-control" rows="2" value={formData.observations} onChange={handleChange}></textarea>
                        </div>

                        <hr />

                        <div className="form-check form-switch mb-3">
                            <input className="form-check-input" type="checkbox" id="vaccineCheck" name="hasVaccine" checked={formData.hasVaccine} onChange={handleChange} />
                            <label className="form-check-label fw-bold text-success" htmlFor="vaccineCheck">
                                <i className="fa-solid fa-syringe me-2"></i>Administer Vaccine?
                            </label>
                        </div>

                        {formData.hasVaccine && (
                            <div className="p-3 bg-white border rounded-3 mb-3">
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <label className="small text-muted">Vaccine Name</label>
                                        <input type="text" name="vaccine_name" className="form-control" placeholder="e.g. Rabies" value={formData.vaccine_name} onChange={handleChange} />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="small text-muted">Date Administered</label>
                                        <input type="date" name="vaccination_date" className="form-control" value={formData.vaccination_date} onChange={handleChange} />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="small text-muted">Expiry Date</label>
                                        <input type="date" name="expiry_date" className="form-control" value={formData.expiry_date} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer border-0">
                        <button className="btn btn-secondary rounded-pill" onClick={onClose}>Cancel</button>
                        <button className="btn btn-success rounded-pill px-4" onClick={handleSubmit}>Finish & Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
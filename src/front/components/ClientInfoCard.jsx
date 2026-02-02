import { useState } from "react";

export const ClientInfoCard = ({ info }) => {
    return (
        <>
            <h1>Client Info</h1>
            <div class="card">
                <h5 class="card-header custom-green-background d-flex align-items-center"> <div
                    className="rounded-circle bg-success-subtle text-success fw-bold d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                    {info.first_name?.charAt(0)}
                </div>
                    <div className="ms-3"> {info.first_name} {info.last_name}</div>
                </h5>
                <div class="card-body">
                    <div className="d-flex">
                        <div>
                            <i className="fa-solid fa-phone me-2"></i>
                        </div>
                        <div className="d-flex flex-column">
                            <div>Phone</div>
                            <div>{info.phonenumber}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
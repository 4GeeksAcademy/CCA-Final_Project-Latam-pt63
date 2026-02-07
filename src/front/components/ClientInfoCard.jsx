import { useState } from "react";

export const ClientInfoCard = ({ info }) => {
  return (
    <>
      <div className="mt-3 ms-5 ps-5">
        <h1>Client Info</h1>
        <div class="card mt-3 rounded-4 border-top-0">
          <h4 class="card-header custom-green-background d-flex align-items-center rounded-top-4">
            {" "}
            <div
              className="rounded-circle bg-white text-success fw-bold d-flex align-items-center justify-content-center"
              style={{ width: 60, height: 60 }}
            >
              {info.first_name?.charAt(0)}
            </div>
            <div className="ms-3">
              {" "}
              {info.first_name} {info.last_name}
            </div>
          </h4>
          <div class="card-body">
            <div className="d-flex">
              <div className="d-flex col-6 ms-2">
                <div>
                  <i className="fa-solid fa-phone me-2 mt-3"></i>
                </div>
                <div className="d-flex flex-column ms-2">
                  <div>Phone</div>
                  <div>{info.phonenumber}</div>
                </div>
              </div>
              <div className="d-flex">
                <div>
                  <i className="fa-solid fa-location-dot me-2 mt-3"></i>
                </div>
                <div className="d-flex flex-column ms-2">
                  <div>Address</div>
                  <div>{info.address}</div>
                </div>
              </div>
            </div>
            <div className="d-flex">
              <div className="d-flex col-6 mt-3 ms-2">
                <div>
                  <i className="fa-solid fa-envelope me-2 mt-3"></i>
                </div>
                <div className="d-flex flex-column ms-2">
                  <div>Email</div>
                  <div>{info.email}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

import React, { useEffect } from "react";
import { TransitionHome } from "./TransitionHome.jsx";
import Animals from "../assets/img/animals-homepage.jpg";
import Animals2 from "../assets/img/animals-homepage2.jpg";

export const Homepage = () => {

  const Navbar = localStorage.getItem("role")

  useEffect(() => {
   }, [Navbar])
   
  return (
    <div className="no-radius">
      <TransitionHome
        image={Animals}
        title="Welcome to VetCare"
        subtitle="Compassionate veterinary care for dogs, cats and a variety of pets, with modern medicine and a friendly team."
        primaryText="Our Services"
        primaryHref="#services"
        secondaryText="Book an Appointment"
        secondaryHref="#contact"
      />

      <section id="services" className="py-5 mt-2 pt-6">
        <div className="container">
          <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-4">
            <h2 className="fw-bold m-0">Services</h2>
            <a className="btn btn-vet-outline btn-lg" href="#contact">
              Ask a question
            </a>
          </div>

          <div className="row g-4 mt-4">
            {[{ t: "Checkups & Consultations", d: "Routine visits, diagnosis, and personalized treatment plans.", },
            { t: "Vaccinations", d: "Core vaccines and tailored prevention schedules for every stage of life.", },
            { t: "Surgery", d: "Soft-tissue procedures with pre-op testing and post-op follow-up.", },
            { t: "In-House Lab", d: "Fast bloodwork and basic testing to speed up answers.", },
            { t: "Grooming", d: "Baths, nail trims, ear cleaning, and coat care for comfort and hygiene.", },
            { t: "Urgent Care", d: "Same-day care for vomiting, injuries, allergic reactions, and more.", },
            ].map((x) => (
              <div className="col-sm-6 col-lg-4" key={x.t}>
                <div className="p-4 border h-100 service-card">
                  <h5 className="mb-2">{x.t}</h5>
                  <p className="mb-3 text-muted">{x.d}</p>
                  <a className="link-vet" href="#contact">
                    Learn more →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TransitionHome
        image={Animals2}
        title="New Patient Special"
        subtitle="First visit exam: 20% off this month. Limited spots available — book early."
        primaryText="Message Us"
        primaryHref="#contact"
        secondaryText="See Services"
        secondaryHref="#services"
      />

      <section id="about" className="py-5 bg-light">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-lg-6">
              <h2 className="fw-bold">About Us</h2>
              <p className="text-muted mb-3">
                VetCare is a small neighborhood clinic focused on warm, honest care. We explain everything in plain
                language, offer transparent pricing, and follow up after every visit.
              </p>
              <ul className="mb-0">
                <li>Friendly, personalized attention</li>
                <li>Post-visit follow-up and guidance</li>
                <li>Modern equipment and clear protocols</li>
              </ul>

              <div className="mt-4">
                <p className="mb-2">
                  <strong>Address:</strong> 1187 W Main St, Santa Maria, CA (reference location)
                </p>
                <p className="mb-0">
                  <strong>Phone:</strong> (805) 555-0137
                </p>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="ratio ratio-16x9 overflow-hidden border">
                <iframe
                  title="Map"
                  src="https://maps.google.com/maps?q=34.9428,-120.4521&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  style={{ border: 0 }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-5">
        <div className="container">
          <h2 className="fw-bold mb-4">Contact</h2>
          <div className="row g-4">
            <div className="col-lg-6">
              <form className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name</label>
                  <input className="form-control" placeholder="Jane Doe" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone</label>
                  <input className="form-control" placeholder="(805) 555-0123" />
                </div>
                <div className="col-12">
                  <label className="form-label">Message</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Tell us your pet’s name, symptoms, and preferred day/time."
                  />
                </div>
                <div className="col-12">
                  <button className="btn btn-vet btn-lg" type="button">
                    Send
                  </button>
                </div>
              </form>
            </div>

            <div className="col-lg-6">
              <div className="p-4 border h-100">
                <h5 className="mb-3">Clinic Info</h5>
                <p className="mb-2">
                  <strong>Address:</strong> 1187 W Main St, Santa Maria, CA (reference location)
                </p>
                <p className="mb-2">
                  <strong>WhatsApp:</strong> +1 (805) 555-0199
                </p>
                <p className="mb-0">
                  <strong>Email:</strong> hello@vetcare.example
                </p>


                <div className="mt-3 small text-muted">
                  For emergencies outside business hours, please visit your nearest 24/7 animal hospital.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

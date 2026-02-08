import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SERVICES = [
  {
    id: "checkups",
    title: "Checkups & Consultations",
    lead: "Routine visits, diagnosis, and personalized treatment plans.",
    bullets: [
      "Full physical exam and history review",
      "Skin/ear/eye checks and pain assessment",
      "Personalized plan with clear next steps",
    ],
    details:
      "Ideal for yearly wellness visits or when you notice changes in appetite, energy, behavior, or mobility. We take time to explain what we see and what we recommend.",
    badge: "Most requested",
  },
  {
    id: "vaccines",
    title: "Vaccinations",
    lead: "Core vaccines and tailored prevention schedules for every stage of life.",
    bullets: [
      "Puppy/kitten schedules and boosters",
      "Adult prevention plans and reminders",
      "Travel & lifestyle risk assessment",
    ],
    details:
      "We build a schedule based on age, lifestyle, and local risk. You’ll leave with a simple calendar and guidance on prevention (parasites, nutrition, etc.).",
    badge: "Prevention",
  },
  {
    id: "surgery",
    title: "Surgery",
    lead: "Soft-tissue procedures with pre-op testing and post-op follow-up.",
    bullets: [
      "Pre-surgical assessment and bloodwork",
      "Modern anesthesia monitoring",
      "Recovery plan + pain control",
    ],
    details:
      "From routine procedures to more specialized interventions, we prioritize safety, hygiene, and comfort. You’ll get clear prep instructions and post-op support.",
    badge: "Safety first",
  },
  {
    id: "lab",
    title: "In-House Lab",
    lead: "Fast bloodwork and basic testing to speed up answers.",
    bullets: [
      "Basic panels and rapid screening",
      "Urinalysis and routine checks",
      "Follow-up interpretation with your vet",
    ],
    details:
      "Quick results help us make better decisions sooner. We always explain what the numbers mean and what we recommend next.",
    badge: "Fast results",
  },
  {
    id: "grooming",
    title: "Grooming",
    lead: "Baths, nail trims, ear cleaning, and coat care for comfort and hygiene.",
    bullets: [
      "Bath + dry + brushing",
      "Nail trim and ear cleaning",
      "Coat care recommendations",
    ],
    details:
      "Comfort-focused grooming with gentle handling. Great for maintaining skin/coat health and spotting issues early (irritations, ticks, ear redness).",
    badge: "Wellness",
  },
  {
    id: "urgent",
    title: "Urgent Care",
    lead: "Same-day care for vomiting, injuries, allergic reactions, and more.",
    bullets: [
      "Triage and immediate assessment",
      "Stabilization and pain management",
      "Clear discharge instructions",
    ],
    details:
      "If your pet isn’t acting like themselves, we’ll guide you quickly. We’ll tell you what to do now, what to watch for, and when to return.",
    badge: "Same day",
  },
];

export const Services = () => {
  const [active, setActive] = useState(null);

  const toggle = (id) => setActive((cur) => (cur === id ? null : id));

  const nav = useNavigate();
  const where = useLocation();
  const navH = 90;

  const goTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const goContact = () => {
    if (where.pathname === "/") {
      goTo("contact");
      return;
    }
    nav("/");
    setTimeout(() => goTo("contact"), 120);
  };
  return (
    <section className="services-page py-5">
      <div className="container">
        <div className="services-hero d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <h1 className="services-title mb-1">Services</h1>
            <p className="services-sub mb-0">
              Practical, warm care—explained clearly, tailored to your pet.
            </p>
          </div>
        </div>

        <div className="row g-4" id="services-list">
          {SERVICES.map((s) => (
            <div className="col-12 col-md-6 col-lg-4" key={s.id}>
              <div className="services-card h-100">
                <div className="services-card-top">
                  <div className="services-badge">{s.badge}</div>
                  <h3 className="services-card-title">{s.title}</h3>
                  <p className="services-card-lead">{s.lead}</p>
                </div>

                <ul className="services-list">
                  {s.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>

                <button
                  type="button"
                  className="services-more"
                  onClick={() => toggle(s.id)}
                  aria-expanded={active === s.id}
                >
                  {active === s.id ? "Hide details" : "Learn more →"}
                </button>

                <div
                  className={`services-details ${active === s.id ? "open" : ""}`}
                >
                  <p className="mb-0">{s.details}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="services-cta mt-5">
          <div className="services-cta-inner">
            <div>
              <h3 className="mb-1">Not sure which service you need?</h3>
              <p className="mb-0 text-muted ">
                Tell us what’s going on and we’ll guide you to the right option.
              </p>
            </div>
            <button
              type="button"
              onClick={goContact}
              className="btn btn-outline-vet px-4 py-2"
            >
              Ask a question
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

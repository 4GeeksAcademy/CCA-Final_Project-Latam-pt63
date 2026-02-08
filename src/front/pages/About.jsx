import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AnimalsAbout from "../assets/img/animals-about.jpg";
import Doctor1 from "../assets/img/Doctor1.jpg";
import Doctor2 from "../assets/img/Doctor2.jpg";
import Doctor3 from "../assets/img/Doctor3.jpg";

export const About = () => {
  const boxRef = useRef(null);

  const nav = useNavigate();
  const where = useLocation();

  const [showIt, setShowIt] = useState(false);
  const [imgReady, setImgReady] = useState(false);

  const navH = 90;

  useEffect(() => {
    const node = boxRef.current;
    if (!node) return;

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e && e.isIntersecting) setShowIt(true);
      },
      { threshold: 0.12 }
    );

    io.observe(node);
    return () => io.disconnect();
  }, []);

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

  const goServices = () => nav("/services");

  const titleWords = [
    { t: "We" },
    { t: "care" },
    { t: "for" },
    { t: "who" },
    { t: "you" },
    { t: "love" },
    { t: "with" },
    { t: "quality,", hi: true },
    { t: "warmth", hi: true },
    { t: "and" },
    { t: "trust.", hi: true },
  ];

  const sigWords = [
    { t: "We" },
    { t: "love" },
    { t: "what" },
    { t: "we" },
    { t: "do," },
    { t: "and" },
    { t: "that’s" },
    { t: "why" },
    { t: "we" },
    { t: "care" },
    { t: "for" },
    { t: "the" },
    { t: "ones" },
    { t: "you" },
    { t: "love—" },
    { t: "every" },
    { t: "day," },
    { t: "with" },
    { t: "patience," },
    { t: "respect," },
    { t: "and" },
    { t: "a" },
    { t: "lot" },
    { t: "of" },
    { t: "heart." },
    { t: "Your" },
    { t: "pet’s" },
    { t: "health" },
    { t: "and" },
    { t: "comfort" },
    { t: "come" },
    { t: "first," },
    { t: "so" },
    { t: "you" },
    { t: "can" },
    { t: "feel" },
    { t: "supported" },
    { t: "and" },
    { t: "confident" },
    { t: "at" },
    { t: "every" },
    { t: "step." },
  ];

  const paintWords = (arr, start = 0) =>
    arr.map((w, i) => (
      <span
        key={`${w.t}-${i}`}
        className={`about-word ${w.hi ? "about-highlight" : ""}`}
        style={{ "--d": `${start + i * 45}ms` }}
      >
        {w.t}&nbsp;
      </span>
    ));

  return (
    <section
      ref={boxRef}
      className={`about-section pt-3 pb-4 ${showIt ? "is-visible" : ""}`}
    >
      <div className="container about-container">
        <div className="row g-4 align-items-start">
          <div className="col-12 col-lg-7">
            <div className="about-copy">
              <div className="about-kicker">About us</div>

              <h2 className="about-title">{paintWords(titleWords, 0)}</h2>

              <p className="about-p">
                Our clinic has been established for{" "}
                <span className="about-highlight">14 years</span>, founded as a
                family business and run by its owners together with a dedicated
                team of professionals. We’ve built a space where you can find
                everything you need for your companion, including a wide range
                of products and services for different species—always with
                friendly guidance from trained staff.
              </p>

              <p className="about-p">
                From the beginning, our priority has been simple: to provide
                excellent medical care while keeping a truly personal approach.
                We believe great veterinary work is not only about equipment and
                protocols—it’s also about listening, explaining clearly, and
                supporting families with empathy at every stage.
              </p>

              <p className="about-p">
                Among our main services is our{" "}
                <span className="about-highlight">Veterinary Clinic</span>, with
                membership-plan care and private consultations. We also perform
                procedures ranging from routine interventions to more
                specialized surgeries, following strict hygiene and safety
                standards. In addition, we offer dog grooming with baths, trims,
                breed-specific cuts, and more.
              </p>

              <p className="about-p mb-0">
                Whether you’re visiting for the first time or you’ve been with
                us for years, you can count on honest recommendations and a team
                that truly cares.
              </p>

              <p className="about-signature mt-3 mb-0">
                {paintWords(sigWords, 120)}
              </p>

              <div className="d-flex gap-2 mt-4 flex-wrap">
                <button
                  className="btn btn-vet px-4 py-2 square"
                  type="button"
                  onClick={goServices}
                >
                  View services
                </button>

                <button
                  className="btn btn-vet-outline px-4 py-2 square"
                  type="button"
                  onClick={goContact}
                >
                  Contact
                </button>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-5">
            <div className="about-imageWrap">
              <div className="about-imageCard">
                {!imgReady && <div className="about-skeleton" />}

                <img
                  src={AnimalsAbout}
                  alt="Veterinary care"
                  className={`img-fluid about-image ${
                    imgReady ? "loaded" : "loading"
                  }`}
                  loading="eager"
                  decoding="async"
                  onLoad={() => setImgReady(true)}
                  onError={() => setImgReady(true)}
                />
              </div>

              <div className="about-badge">
                <span className="dot" />
                Professional and caring attention
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-5 pt-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <div className="text-center mb-4">
              <div className="about-kicker">Our team</div>
              <h3 className="mb-2">Meet our veterinarians</h3>
              <p className="text-muted mb-0">
                A caring team with experience in preventive medicine, internal
                medicine, and surgery—ready to guide you with clear
                recommendations and warmth.
              </p>
            </div>

            <div className="row g-4">
              <div className="col-12 col-md-4">
                <div className="card h-100 border-0 shadow-sm overflow-hidden">
                  <img
                    src={Doctor2}
                    alt="Dr. Sofia Pereira"
                    className="team-doctor-img"
                    loading="lazy"
                  />
                  <div className="card-body p-4">
                    <h5 className="mb-1">Dr. Sofia Pereira</h5>
                    <small className="text-muted d-block mb-3">
                      General Practice • Preventive Care
                    </small>

                    <p className="mb-3 text-muted">
                      Focused on wellness plans, vaccines, nutrition guidance,
                      and early detection. Calm, patient, and great with
                      first-time pet parents.
                    </p>

                    <ul className="mb-0 ps-3">
                      <li>Vaccines & check-ups</li>
                      <li>Nutrition & weight management</li>
                      <li>Senior pet care</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="card h-100 border-0 shadow-sm overflow-hidden">
                  <img
                    src={Doctor1}
                    alt="Dr. Mateo Ríos"
                    className="team-doctor-img"
                    loading="lazy"
                  />
                  <div className="card-body p-4">
                    <h5 className="mb-1">Dr. Mateo Ríos</h5>
                    <small className="text-muted d-block mb-3">
                      Internal Medicine • Dermatology
                    </small>

                    <p className="mb-3 text-muted">
                      Known for thorough diagnostics and clear explanations.
                      Helps families manage allergies, chronic conditions, and
                      recurring discomfort.
                    </p>

                    <ul className="mb-0 ps-3">
                      <li>Skin & ear issues</li>
                      <li>Digestive problems</li>
                      <li>Chronic disease follow-up</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="card h-100 border-0 shadow-sm overflow-hidden">
                  <img
                    src={Doctor3}
                    alt="Dr. Marcos Costa"
                    className="team-doctor-img"
                    loading="lazy"
                  />
                  <div className="card-body p-4">
                    <h5 className="mb-1">Dr. Marcos Costa</h5>
                    <small className="text-muted d-block mb-3">
                      Surgery • Dentistry
                    </small>

                    <p className="mb-3 text-muted">
                      From routine procedures to more complex interventions, he
                      follows strict safety protocols and prioritizes comfort
                      and pain control.
                    </p>

                    <ul className="mb-0 ps-3">
                      <li>Soft tissue surgery</li>
                      <li>Dental cleaning & extractions</li>
                      <li>Post-op recovery support</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-4">
              <p className="text-muted text-about mb-0">
                Want to talk with a vet? We’ll help you find the best time and
                service for your pet,{" "}
                <a
                  className="text-about-link"
                  style={{ cursor: "pointer" }}
                  onClick={goContact}
                >
                  here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


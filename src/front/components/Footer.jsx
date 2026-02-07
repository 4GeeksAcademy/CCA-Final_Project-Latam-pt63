import React from "react";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-a bg-vet text-white">
      <div className="container py-4">
        <div className="d-flex flex-column flex-lg-row gap-3 align-items-lg-center justify-content-between">
          <div>
            <div className="fw-semibold">VetCare</div>
            <small className="footer-a-muted">Modern, friendly veterinary care.</small>
          </div>

          <div className="d-flex gap-2">
            <a
              className="footer-a-icon"
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <i className="fa-brands fa-facebook-f"></i>
            </a>

            <a
              className="footer-a-icon"
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <i className="fa-brands fa-instagram"></i>
            </a>
          </div>
        </div>

        <div className="footer-a-divider my-3"></div>

        <div className="d-flex flex-column flex-md-row gap-2 justify-content-between">
          <small className="footer-a-muted">© {year} VetCare</small>
          <small className="footer-a-muted">Made with care.</small>
        </div>
      </div>
    </footer>
  );
};

import React from "react";

export const TransitionHome = ({
  image,
  title,
  subtitle,
  primaryText = "Ver más",
  primaryHref = "#servicios",
  secondaryText = "Contacto",
  secondaryHref = "#contacto",
}) => {
  return (
    <header
      className="banner-home"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="container banner-home-content text-white">
        <div className="row">
          <div className="col-lg-7">
            <h1 className="display-5 fw-bold">{title}</h1>
            <p className="lead mt-3">{subtitle}</p>

            <div className="d-flex gap-2 mt-4 flex-wrap">
              <a className="btn btn-vet btn-lg" href={primaryHref}>
                {primaryText}
              </a>
              <a className="btn btn-vet-outline-white btn-lg" href={secondaryHref}>
                {secondaryText}
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

import React from "react";
import { Link } from "react-router-dom";

export const TransitionHome = ({
  image,
  title,
  subtitle,
  primaryText,
  primaryHref,
  secondaryText,
  secondaryHref,
}) => {
  return (
    <section className="banner-home" style={{ backgroundImage: `url(${image})` }}>
      <div className="container banner-home-content py-5">
        <h1 className="text-white fw-bold mb-3">{title}</h1>
        <p className="text-white-50 fs-5 mb-4">{subtitle}</p>

        <div className="d-flex gap-2 flex-wrap">
          <a className="btn btn-vet btn-lg" href={primaryHref}>
            {primaryText}
          </a>

          <Link className="btn btn-vet-outline-white btn-lg" to={secondaryHref}>
            {secondaryText}
          </Link>
        </div>
      </div>
    </section>
  );
};
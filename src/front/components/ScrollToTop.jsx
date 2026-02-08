import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const ScrollToTop = ({ children }) => {
  const { pathname } = useLocation();
  const prevPath = useRef(pathname);

  useLayoutEffect(() => {
    if (pathname !== prevPath.current) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      prevPath.current = pathname;
    }
  }, [pathname]);

  return children;
};

export default ScrollToTop;

ScrollToTop.propTypes = {
  children: PropTypes.any,
};

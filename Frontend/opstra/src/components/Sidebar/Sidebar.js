import React, { useRef, useEffect } from "react";
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css"; // Import CSS separately
import { Nav, NavLink as ReactstrapNavLink } from "reactstrap";
import { BackgroundColorContext } from "../../contexts/BackgroundColorContext";
import Link from "next/link";

var ps;

export default function Sidebar(props) {
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(sidebarRef.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }
    return () => {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
    };
  }, []);

  const { routes, logo, toggleSidebar } = props;

  let logoImg = null;
  let logoText = null;

  if (logo !== undefined) {
    if (logo.outterLink !== undefined) {
      logoImg = (
        <a
          href={logo.outterLink}
          className="simple-text logo-mini"
          target="_blank"
          onClick={toggleSidebar}
        >
          <div className="logo-img">
            <img src={logo.imgSrc} alt="react-logo" />
          </div>
        </a>
      );
      logoText = (
        <a
          href={logo.outterLink}
          className="simple-text logo-normal"
          target="_blank"
          onClick={toggleSidebar}
        >
          {logo.text}
        </a>
      );
    } else {
      logoImg = (
        <Link href={logo.innerLink} onClick={toggleSidebar}>
          <p className="simple-text logo-mini">
            <div className="logo-img">
              <img src={logo.imgSrc} alt="react-logo" />
            </div>
          </p>
        </Link>
      );
      logoText = (
        <Link href={logo.innerLink} onClick={toggleSidebar}>
          <p className="simple-text logo-normal">{logo.text}</p>
        </Link>
      );
    }
  }

  return (
    <BackgroundColorContext.Consumer>
      {({ color }) => (
        <div className="sidebar" data={color}>
          <div className="sidebar-wrapper" ref={sidebarRef}>
            {(logoImg || logoText) && (
              <div className="logo">
                {logoImg}
                {logoText}
              </div>
            )}
            <Nav>
              {routes.map((prop, key) => {
                if (prop.redirect) return null;
                return (
                  <li
                    className={key + (prop.pro ? " active-pro" : "")}
                    key={key}
                  >
                    <Link href={prop.layout + prop.path}>
                      <span className="nav-link" onClick={toggleSidebar}>
                        <i className={prop.icon} />
                        {/* <p>{rtlActive ? prop.rtlName : prop.name}</p> */}
                        <p>{prop.name}</p>
                      </span>
                    </Link>
                  </li>
                );
              })}
              <li className="active-pro">
                <ReactstrapNavLink href="https://www.creative-tim.com/product/black-dashboard-pro-react?ref=bdr-user-archive-sidebar-upgrade-pro">
                  <i className="tim-icons icon-spaceship" />
                  <p>Upgrade to PRO</p>
                </ReactstrapNavLink>
              </li>
            </Nav>
          </div>
        </div>
      )}
    </BackgroundColorContext.Consumer>
  );
}

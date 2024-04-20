import React, { useRef, useEffect, useState } from "react";
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css"; // Import CSS separately
import AdminNavbar from "../../components/Navbars/AdminNavbar.js";
import Footer from "../../components/Footer/Footer.js";
import Sidebar from "../../components/Sidebar/Sidebar.js";
import FixedPlugin from "../../components/FixedPlugin/FixedPlugin.js";
import routes from "../../routes.js";
import logo from "../../assets/img/react-logo.png";
import { BackgroundColorContext } from "../../contexts/BackgroundColorContext";
import Link from "next/link";

export default function Admin(props) {
  const mainPanelRef = useRef(null);
  const [sidebarOpened, setsidebarOpened] = useState(false);
  const { children } = props;

  useEffect(() => {
    let ps;
    if (navigator.platform.indexOf("Win") > -1) {
      document.documentElement.classList.add("perfect-scrollbar-on");
      ps = new PerfectScrollbar(mainPanelRef.current, {
        suppressScrollX: true,
      });
    }
    return () => {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
        document.documentElement.classList.remove("perfect-scrollbar-on");
      }
    };
  }, []);

  const toggleSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    setsidebarOpened(!sidebarOpened);
  };

  const getBrandText = (path) => {
    const route = routes.find(
      (route) => path.indexOf(route.layout + route.path) !== -1
    );
    return route ? route.name : "Brand";
  };

  return (
    <BackgroundColorContext.Consumer>
      {({ color, changeColor }) => (
        <React.Fragment>
          <div className="wrapper">
            <Sidebar
              routes={routes}
              logo={{
                outterLink: "https://www.creative-tim.com/",
                text: "Creative Tim",
                imgSrc: logo,
              }}
              toggleSidebar={toggleSidebar}
            />
            <div className="main-panel" ref={mainPanelRef} data={color}>
              <AdminNavbar
                brandText={"location-placeholder"}
                // brandText={getBrandText(location.pathname)}
                toggleSidebar={toggleSidebar}
                sidebarOpened={sidebarOpened}
              />
              {routes.map(
                (prop, key) =>
                  prop.layout === "/admin" && (
                    <Link href={prop.layout + prop.path} key={key}>
                      <p>{prop.name}</p>
                    </Link>
                  )
              )}
              <Link href="/admin/dashboard" passHref>
                {/* <Navigate to="/admin/dashboard" replace /> */}
              </Link>
              {/* {location.pathname === "/admin/maps" ? null : <Footer fluid />} */}
            </div>
          </div>
          <FixedPlugin bgColor={color} handleBgClick={changeColor} />
          {children}
        </React.Fragment>
      )}
    </BackgroundColorContext.Consumer>
  );
}

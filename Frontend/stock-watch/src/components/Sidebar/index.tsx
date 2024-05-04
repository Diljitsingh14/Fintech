import React, { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlassChart } from "@fortawesome/free-solid-svg-icons";
import { NavItems, NavContext } from "@/contexts/NavbarContext.js";

const Sidebar = () => {
  const { activeNavItem, changeNavItem } = useContext(NavContext);
  return (
    <div className="sidebar glass-positive">
      <div className="logo d-flex text-white">
        <h3 className="mx-auto text-center">
          <FontAwesomeIcon icon={faMagnifyingGlassChart} className="mr-2" />
          Opstra
        </h3>
      </div>
      <ul className="nav">
        {NavItems.map((item) => {
          return (
            <li
              key={item.value}
              onClick={() => {
                changeNavItem(item.value);
              }}
            >
              <Link
                href={item.link}
                className={`${
                  item.value == activeNavItem
                    ? " border-b-white border-b-2"
                    : "text-gray-950"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;

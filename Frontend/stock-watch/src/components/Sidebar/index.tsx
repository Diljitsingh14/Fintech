import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faMagnifyingGlassChart,
} from "@fortawesome/free-solid-svg-icons";
import { faOctopusDeploy, faDochub } from "@fortawesome/free-brands-svg-icons";

const Sidebar = () => {
  return (
    <div className="sidebar glass-positive">
      <div className="logo d-flex text-white">
        <h3 className="mx-auto text-center">
          <FontAwesomeIcon icon={faMagnifyingGlassChart} className="mr-2" />
          Opstra
        </h3>
      </div>
      <ul className="nav">
        <li>
          <Link href="/">
            <FontAwesomeIcon icon={faHouse} className="mr-2" />
            Home
          </Link>
        </li>
        <li>
          <Link href="/playground">
            <FontAwesomeIcon icon={faOctopusDeploy} className="mr-2" />
            Playground
          </Link>
        </li>
        <li>
          <Link href="/about">
            <FontAwesomeIcon icon={faDochub} className="mr-2" />
            About Us
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

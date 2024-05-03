import { createContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faMagnifyingGlassChart,
} from "@fortawesome/free-solid-svg-icons";
import { faOctopusDeploy, faDochub } from "@fortawesome/free-brands-svg-icons";

export const NavItems = [
  {
    name: "Home",
    value: "home",
    icon: <FontAwesomeIcon icon={faHouse} className="mr-2" />,
    link: "/",
  },
  {
    name: "Playground",
    value: "playground",
    icon: <FontAwesomeIcon icon={faOctopusDeploy} className="mr-2" />,
    link: "/playground",
  },
  {
    name: "About Us",
    value: "about-us",
    icon: <FontAwesomeIcon icon={faDochub} className="mr-2" />,
    link: "/about_us",
  },
];

export const NavContext = createContext({
  activeNavItem: NavItems[0].value,
  changeNavItem: (t) => {},
});

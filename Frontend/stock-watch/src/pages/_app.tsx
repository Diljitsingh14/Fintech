import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Roboto } from "next/font/google";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { NavContext, NavItems } from "@/contexts/NavbarContext";
import { ThemeContext } from "@/contexts/ThemeContext";
import { BackgroundColorContext } from "@/contexts/BackgroundColorContext";
import { useContext, useState } from "react";

config.autoAddCss = false;

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  const [theme, changeTheme] = useState("dark");
  const [activeNavItem, changeNavItem] = useState(NavItems[0].value);

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      <NavContext.Provider value={{ activeNavItem, changeNavItem }}>
        <main className={roboto.className}>
          <Component {...pageProps} />
        </main>
      </NavContext.Provider>
    </ThemeContext.Provider>
  );
}

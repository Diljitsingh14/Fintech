// import '@/styles/globals.css'
import "../styles/globals.css";
import type { AppProps } from "next/app";
import ThemeContextWrapper from "../components/ThemeWrapper/ThemeWrapper";
import BackgroundColorWrapper from "../components/BackgroundColorWrapper/BackgroundColorWrapper";

import "../assets/scss/black-dashboard-react.scss";
import "../assets/demo/demo.css";
import "../assets/css/nucleo-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeContextWrapper>
      <BackgroundColorWrapper></BackgroundColorWrapper>
      <Component {...pageProps} />
    </ThemeContextWrapper>
  );
}

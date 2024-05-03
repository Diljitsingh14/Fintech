import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import NewsSentiments from "@/components/NewsSentiments";
import StrategyBuilder from "@/components/StrategyBuilder";
import strategies from "@/components/StrategyBuilder/strategy.js";
import RiskCalculator from "@/components/RiskCalculator";
import NiftyPriceChart from "../components/Charts/PredictVsActual.js";
import Layout from "../layouts/Admin";
import { useEffect, useState } from "react";
import { URLS } from "../config.js";

export default function Playground() {
  return (
    <Layout>
      <div className="my-4">
        <h1>PlayGround</h1>
      </div>
    </Layout>
  );
}

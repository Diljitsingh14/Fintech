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

const newsDataSample = [
  {
    title: "Good news for investors",
    content: "Stocks surged today following positive economic indicators.",
    sentiments: 0.8,
    companyEffected: "XYZ Corp",
  },
  {
    title: "Market downturn",
    content:
      "The market experienced a sharp decline due to global economic concerns.",
    sentiments: 0.3,
    companyEffected: "ABC Ltd",
  },
  {
    title: "New product launch",
    content: "Company XYZ launched a new product to positive reviews.",
    sentiments: 0.7,
    companyEffected: "XYZ Corp",
  },
  {
    title: "Earnings report disappointment",
    content:
      "Company ABC reported lower-than-expected earnings, disappointing investors.",
    sentiments: 0.5,
    companyEffected: "ABC Ltd",
  },
];

export default function Home() {
  const aheadData = {
    actual: [
      { date: "2024-03-01", price: 15000 },
      { date: "2024-03-02", price: 15100 },
      { date: "2024-03-03", price: 15150 },
      { date: "2024-03-04", price: 15200 },
      { date: "2024-03-05", price: 15175 },
      { date: "2024-03-06", price: 15250 },
      { date: "2024-03-07", price: 15300 },
      // Add more actual data
    ],
    predicted: [
      { date: "2024-04-19", price: 15200 },
      { date: "2024-04-20", price: 15300 },
      { date: "2024-04-21", price: 15400 },
      { date: "2024-04-22", price: 15350 },
      { date: "2024-04-23", price: 15375 },
      { date: "2024-04-24", price: 15325 },
      { date: "2024-04-25", price: 15250 },
      // Add predicted data for the next 7 days
    ],
  };

  const [predictedData, setPredictedData] = useState({ ...aheadData });
  const [newsData, setNewsData] = useState([...newsDataSample]);
  const [marketMood, setMarketMood] = useState("bullish");
  const [selectedStrategy, setSelectedStrategy] = useState("");
  const [loading, setLoading] = useState(false);

  const formatPredictedData = (data: any) => {
    // Convert actual data from till_today into array of objects
    const actual = Object.entries(data.till_today).map(([timestamp, price]) => {
      const date = new Date(parseInt(timestamp)).toISOString().split("T")[0];
      return { date, price };
    });

    // Convert predicted data into array of objects
    const predicted = data.predicted.map((price: number, index: any) => {
      // Calculate date by adding index days to today's date
      const today = new Date();
      today.setDate(today.getDate() + index);
      const date = today.toISOString().split("T")[0];
      return { date, price };
    });

    return { actual, predicted };
  };

  const getSelectStrategy = () => {
    if (marketMood == "bullish") {
      const s = strategies.bull.find(
        (strategy) => strategy.name == selectedStrategy
      );
      console.log(s);
      return s;
    } else if (marketMood == "bearish") {
      return strategies.bear.find(
        (strategy) => strategy.name == selectedStrategy
      );
    } else {
      return strategies.non_dir.find(
        (strategy) => strategy.name == selectedStrategy
      );
    }
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      // Assume there is an API call here to fetch calculation results
      const apiResponse = await fetch(URLS.latest_news, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await apiResponse.json();
      console.log(data);
      setNewsData([...data]);
    } catch (error) {
      console.error("Error fetching calculation results:", error);
    }
    setLoading(false);
  };

  const fetchAheadPrice = async () => {
    setLoading(true);
    try {
      // Assume there is an API call here to fetch calculation results
      const apiResponse = await fetch(URLS.prediction, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await apiResponse.json();
      console.log(data);
      const preprocess = formatPredictedData(data);
      console.log(preprocess, "pp");

      setPredictedData({
        actual: preprocess.actual,
        predicted: [...preprocess.predicted],
      });
    } catch (error) {
      console.error("Error fetching calculation results:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchNews();
    fetchAheadPrice();
    setLoading(false);
  }, []);

  return (
    <Layout>
      <div className="my-4">
        <div className="chart">
          <h1 className="text-white font-weight-bold">
            Nifty 50 - 7 days prediction
          </h1>
          <NiftyPriceChart data={predictedData} />
          <div className="sentiments">
            <h1 className="text-white font-weight-bold">
              Top News with Sentiments
            </h1>

            <NewsSentiments newsData={newsData} />
          </div>
        </div>
        <div className="strategy mt-4">
          <StrategyBuilder
            mood={marketMood}
            selectedStrategy={selectedStrategy}
            setSelectedStrategy={setSelectedStrategy}
          ></StrategyBuilder>
        </div>

        <div className="riskcal">
          <h1 className="text-white font-weight-bold">
            Back Testing / Risk Calculator on Strategy
          </h1>

          {selectedStrategy ? (
            <RiskCalculator strategy={getSelectStrategy()} />
          ) : (
            " No Strategy Selected"
          )}
        </div>
      </div>
    </Layout>
  );
}

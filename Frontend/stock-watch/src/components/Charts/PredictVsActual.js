import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "chartjs-adapter-moment";

const NiftyPriceChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (data && chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      const actualData = data.actual;
      const predictedData = data.predicted;

      // Destroy existing chart instance
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Extracting dates and prices for the actual data
      const actualDates = actualData.map((entry) => entry.date);
      const actualPrices = actualData.map((entry) => entry.price);

      // Extracting dates and prices for the predicted data
      const predictedDates = predictedData.map((entry) => entry.date);
      const predictedPrices = predictedData.map((entry) => entry.price);

      // Creating datasets for actual and predicted prices
      const datasets = [
        {
          label: "Actual Price",
          data: actualPrices,
          borderColor: "blue",
          backgroundColor: "transparent",
          fill: false,
          yAxisID: "price-axis",
        },
        {
          label: "Predicted Price",
          data: [...actualPrices, ...predictedPrices],
          borderColor: "green",
          backgroundColor: "transparent",
          fill: false,
          yAxisID: "price-axis",
        },
      ];

      // Creating chart
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: [...actualDates, ...predictedDates],
          datasets: datasets,
        },
        options: {
          scales: {
            x: {
              type: "time",
              time: {
                unit: "day",
                displayFormats: {
                  day: "MMM DD",
                },
              },
            },
            y: {
              title: {
                display: true,
                text: "Price",
              },
            },
          },
        },
      });
    }
  }, [data]);

  return (
    <>
      {/* line chart */}
      <div className="m-4">
        <div className="border border-gray-400 pt-0 rounded-xl  w-full h-fit my-auto  shadow-xl">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </>
  );
};

export default NiftyPriceChart;

import React, { useEffect, useState } from "react";
import { URLS } from "../../config.js";

const RiskCalculator = ({ strategy }) => {
  const [legs, setLegs] = useState([]);
  const [calculationResult, setCalculationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (index, field, value) => {
    const updatedLegs = [...legs];
    updatedLegs[index][field] = value;
    setLegs(updatedLegs);
  };

  function convertToStrategyArray(inputArray) {
    return inputArray.map((item) => ({
      type: item.type,
      strike: item.strickPrice, // Assuming strickPrice corresponds to strike
      premium: item.premiumPrice,
      n: item.quantity,
      action: item.action,
    }));
  }

  useEffect(() => {
    const initialLegsState = strategy.template.map((leg) => ({
      ...leg,
      premiumPrice: 0,
      quantity: 0,
      strickPrice: 0,
    }));
    setLegs([...initialLegsState]);
  }, [strategy]);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      // Assume there is an API call here to fetch calculation results
      const processed_data = convertToStrategyArray(legs);
      const apiResponse = await fetch(URLS.risk_calc, {
        method: "POST",
        body: JSON.stringify(processed_data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await apiResponse.json();
      console.log(data);
      setCalculationResult(data);
    } catch (error) {
      console.error("Error fetching calculation results:", error);
    }
    setLoading(false);
  };

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold text-white mb-2">
        {strategy.name} Risk Calculator
      </h2>
      <table className="border border-gray-300 text-white">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Type</th>
            <th className="border border-gray-300 p-2">Action</th>
            <th className="border border-gray-300 p-2">Quantity</th>
            <th className="border border-gray-300 p-2">Strike Price</th>
            <th className="border border-gray-300 p-2">Premium</th>
          </tr>
        </thead>
        <tbody>
          {legs.map((leg, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">{leg.type}</td>
              <td className="border border-gray-300 p-2">{leg.action}</td>
              <td className="border border-gray-300 p-2">
                <input
                  type="number"
                  value={leg.quantity}
                  onChange={(e) =>
                    handleInputChange(index, "quantity", e.target.value)
                  }
                  className="border text-black border-gray-300 rounded-md p-1 w-16"
                />
              </td>
              <td className="border border-gray-300 p-2">
                <input
                  type="number"
                  value={leg.strickPrice}
                  onChange={(e) =>
                    handleInputChange(index, "strickPrice", e.target.value)
                  }
                  className="border text-black border-gray-300 rounded-md p-1 w-24"
                />
              </td>
              <td className="border text-dark border-gray-300 p-2">
                <input
                  type="number"
                  value={leg.premiumPrice}
                  onChange={(e) =>
                    handleInputChange(index, "premiumPrice", e.target.value)
                  }
                  className="border text-black border-gray-300 rounded-md p-1 w-24"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md mt-4"
        onClick={handleCalculate}
        disabled={loading}
      >
        {loading ? "Calculating..." : "Calculate"}
      </button>
      {calculationResult && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-white">
            Calculation Results
          </h3>
          <table className="border border-gray-300 text-white w-full">
            <tbody>
              <tr className="bg-gray-700">
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Value</th>
              </tr>
              <tr>
                <td className="px-4 py-2">Probability of Profit</td>
                <td className="px-4 py-2 text-green">
                  {calculationResult["probability_of_profit"]} %
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">Strategy Cost</td>
                <td className="px-4 py-2">
                  {calculationResult["strategy_cost"]}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">Per Leg Cost</td>
                <td className="px-4 py-2">
                  <ul>
                    {calculationResult["per_leg_cost"].map((cost, index) => (
                      <li key={index}>{cost}</li>
                    ))}
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">Implied Volatility</td>
                <td className="px-4 py-2">
                  <ul>
                    {calculationResult["implied_volatility"].map(
                      (volatility, index) => (
                        <li key={index}>{volatility}</li>
                      )
                    )}
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">In the Money Probability</td>
                <td className="px-4 py-2">
                  <ul>
                    {calculationResult["in_the_money_probability"].map(
                      (probability, index) => (
                        <li key={index}>{probability}</li>
                      )
                    )}
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">Delta</td>
                <td className="px-4 py-2">
                  <ul>
                    {calculationResult["delta"].map((value, index) => (
                      <li key={index}>{value}</li>
                    ))}
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">Gamma</td>
                <td className="px-4 py-2">
                  <ul>
                    {calculationResult["gamma"].map((value, index) => (
                      <li key={index}>{value}</li>
                    ))}
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">Theta</td>
                <td className="px-4 py-2">
                  <ul>
                    {calculationResult["theta"].map((value, index) => (
                      <li key={index}>{value}</li>
                    ))}
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">Vega</td>
                <td className="px-4 py-2">
                  <ul>
                    {calculationResult["vega"].map((value, index) => (
                      <li key={index}>{value}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RiskCalculator;

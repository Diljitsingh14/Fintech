import React from "react";
import Image from "next/image";
import strategies from "./strategy";

const Strategy = ({ name, image, isSelected, onStrategyChange }) => {
  return (
    <div
      className={`strategy w-[200px] h-[150px] cursor-pointer p-2 align-middle text-center mt-2 ${
        isSelected ? "rounded border border-white bg-gray-500" : ""
      }`}
      onClick={() => {
        onStrategyChange(name);
      }}
    >
      <Image
        src={image}
        alt={name}
        width={100}
        height={100}
        className="mx-auto"
      ></Image>
      <h3 className="text-white mt-2">{name}</h3>
    </div>
  );
};

const StrategyBuilder = ({ mood, selectedStrategy, setSelectedStrategy }) => {
  let build_strategies;

  const onStrategyChange = (name) => {
    setSelectedStrategy(name);
  };

  if (mood === "bullish") {
    build_strategies = (
      <>
        {strategies.bull.map((strategy) => (
          <Strategy
            name={strategy.name}
            image={`/bull/${strategy.image}`}
            key={`bull-${strategy.name}`}
            isSelected={selectedStrategy === strategy.name}
            onStrategyChange={onStrategyChange}
          ></Strategy>
        ))}
      </>
    );
  } else if (mood === "bearish") {
    build_strategies = (
      <>
        {strategies.bear.map((strategy) => (
          <Strategy
            name={strategy.name}
            image={`/bear/${strategy.image}`}
            key={`sstt-${strategy.name}`}
            isSelected={selectedStrategy == strategy.name}
            onStrategyChange={onStrategyChange}
          ></Strategy>
        ))}

        {/* <div>Put Ratio Back Spread</div>
        <div>Short Synthetic Put</div>
        <div>Bearish Butterfly</div>
        <div>Bearish Condor</div> */}
      </>
    );
  } else if (mood === "non-directional") {
    build_strategies = (
      <>
        {strategies.non_dir.map((strategy) => (
          <Strategy
            name={strategy.name}
            image={`/non-dir/${strategy.image}`}
            key={`non-dir-${strategy.name}`}
            isSelected={selectedStrategy == strategy.name}
            onStrategyChange={onStrategyChange}
          ></Strategy>
        ))}
        {/* <div>Jade Lizard</div>
        <div>Call Ratio Spread</div>
        <div>Put Ratio Spread</div>
        <div>Butterfly</div>
        <div>Condor</div>
        <div>Iron Fly</div>
        <div>Calendar Spread</div> */}
      </>
    );
  }

  return (
    <div>
      <h1 className="text-white font-weight-bolder">
        Strategies for {mood} Market
      </h1>
      <div className="flex">{build_strategies}</div>
    </div>
  );
};

export default StrategyBuilder;

import React from "react";

const NewsSentiments = ({ newsData }) => {
  const getSentimentClass = (sentiment) => {
    if (parseFloat(sentiment) > 0.05) {
      return "glass-positive";
    } else if (parseFloat(sentiment) < -0.05) {
      return "glass-neg";
    } else {
      return "glass-neu";
    }
  };

  return (
    <div className="flex flex-wrap">
      {newsData.map((item, index) => (
        <div
          key={index}
          className={`w-full md:w-1/2 lg:w-1/4 p-2 text-white mx-auto `}
        >
          <div className={`p-2 h-[240px] ${getSentimentClass(item.sentiment)}`}>
            <a href={item.list}>
              <h3 className="text-lg h-[60px] font-semibold mb-2 overflow-hidden">
                {item.title}
              </h3>
              <hr></hr>
              <p className="mb-4 p-2 text-white">
                {item && item.description?.slice(0, 100) + "..."}
              </p>
              <div className="flex justify-between absolute bottom-2 text-sm text-gray-500">
                <p className="text-white">
                  {item.companyEffected || "Xyz com"}
                </p>
                <p className="text-white ml-[60px]">score : {item.sentiment}</p>
              </div>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsSentiments;

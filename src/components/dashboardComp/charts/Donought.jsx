import React from "react";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

Chart.register(ArcElement, Tooltip, Legend);

const DonoughtCharts = ({ data, totalApplication }) => {
  // const totalCount 
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: data.label,
        data: data.values,
        backgroundColor: ["#0B91BC", "#967DDD", "#4BD9ED"],

        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    cutout: "70%",
    plugins: {
      legend: {
        display: false, // Hide legends
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };
  

  return (
    <div className="z-0 lg:w-[70%] relative  sm:w-[70%] xl:w-[60%] md:w-[110%]"  style={{ margin: "0 auto" }}>
    <Doughnut data={chartData} options={chartOptions} />
  
    {/* New relative container */}
    <span className="flex flex-col items-center absolute top-14 md:left-[52px] sm:left-[49px]  xl:left-[75px]  ">
        <span className="text-[#0B91BC] font-semibold text-[28px]">{totalApplication || "NA"}</span>
        <span className="text-[14px] font-light">Total Applications</span>
      </span>

      <div className="flex flex-wrap justify-center  items-center mt-3 gap-3 text-sidebar text-[12px] ">
      <span className="flex items-center gap-2">
        <span className="bg-[#0B91BC] w-7 border border-black"> .</span> Offer Letter</span>
        <span className="flex items-center gap-2">
        <span className="bg-[#967DDD] w-7 border border-black">.</span> Course Fee</span>
        <span className="flex items-center gap-2">
        <span className="bg-[#4BD9ED] w-7 border border-black">. </span> Visa</span>

      </div>
  </div>
  
  );
};

export default DonoughtCharts;

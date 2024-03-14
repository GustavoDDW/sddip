"use client";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { dataBase } from "@/app/interfaces/database";
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ChartThreeState {
  series: number[];
}

interface ChartThreeProps {
  data: dataBase[];
}

const ChartThree: React.FC <ChartThreeProps> = ({ data }) => {
  const [isLoading, setLoading] = useState(true);
  const [analystNames, setAnalystNames] = useState<string[]>([]);
  const [state, setState] = useState<ChartThreeState>({
    series: [],
  });

  useEffect(() => {
    const analystCounts: { [key: string]: number } = {};
    data.forEach((item: dataBase) => {
      if (item.cs) {
        analystCounts[item.csm] = (analystCounts[item.csm] || 0) + 1;
      }
    });
    const names = Object.keys(analystCounts);
    setAnalystNames(names);

    const analystData = names.map((name) => analystCounts[name]);

    setState({ 
      series: analystData,
    });
    setLoading(false);
  }, [data]);

  const options: ApexOptions = {
    chart: {
      type: "donut",
    },
    colors: ["#10B981", "#375E83", "#259AE6", "#FFA70B"],
    labels: analystNames,
    legend: {
      show: true,
      position: "bottom",
    },
  
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          background: "transparent",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 380,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-4">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            CSM
          </h5>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart
            options={options}
            series={state.series}
            type="donut"
          />
        </div>
      </div>
    </div>
  );
};

export default ChartThree;

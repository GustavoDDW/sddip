"use client";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { dataBase } from "@/app/interfaces/database";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ChartTwoState {
  series: {
    name: string;
    data: number[];
  }[];
}

interface ChartTwoProps {
  data: dataBase[];
}

const ChartTwo: React.FC<ChartTwoProps> = ({ data }) => {
  const [isLoading, setLoading] = useState(true);
  const [analystNames, setAnalystNames] = useState<string[]>([]);
  const [state, setState] = useState<ChartTwoState>({
    series: [],
  });

  useEffect(() => {
    const analystCounts: { [key: string]: number } = {};
    data.forEach((item: dataBase) => {
      if (item.cs) {
        analystCounts[item.cs] = (analystCounts[item.cs] || 0) + 1;
      }
    });
    const names = Object.keys(analystCounts);
    setAnalystNames(names);

    const analystData = names.map((name) => analystCounts[name]);

    setState({
      series: [
        {
          name: "",
          data: analystData,
        },
      ],
    });
    setLoading(false);
  }, [data]);

  const options: ApexOptions = {
    colors: ["#3C50E0", "#80CAEE"],
    chart: {
      // events: {
      //   beforeMount: (chart) => {
      //     chart.windowResizeHandler();
      //   },
      // },
      fontFamily: "Satoshi, sans-serif",
      type: "bar",
      height: 335,
      stacked: true,
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: false,
      },
    },

    responsive: [
      {
        breakpoint: 1536,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 0,
              columnWidth: "35%",
            },
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        columnWidth: "80%",
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
      },
    },
    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories: analystNames,
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Satoshi",
      fontWeight: 500,
      fontSize: "14px",

      markers: {
        radius: 99,
      },
    },
    fill: {
      opacity: 1,
    },
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-8">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            CS
          </h4>
        </div>
      </div>

      <div>
        <div id="chartTwo" className="-ml-5 -mb-9">
          <ApexCharts
            options={options}
            series={state.series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartTwo;

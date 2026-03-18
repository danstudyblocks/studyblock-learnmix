"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import ChartMonthModal from "./ChartMonthModal";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

function WeeklyWorksSummery() {
  const chartData: ApexOptions = {
    series: [
      {
        name: "Orders",
        type: "area",
        data: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67],
      },
      {
        name: "Earnings",
        type: "bar",
        data: [
          89.25, 98.58, 68.74, 108.87, 77.54, 84.03, 51.24, 28.57, 92.57, 42.36,
          88.51, 36.57,
        ],
      },
      {
        name: "Refunds",
        type: "line",
        data: [8, 12, 7, 17, 21, 11, 5, 9, 7, 29, 12, 35],
      },
    ],
    chart: {
      height: 400,
      type: "line",
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },
    stroke: {
      curve: "straight",
      dashArray: [0, 0, 8],
      width: [2, 0, 2.2],
    },
    fill: {
      opacity: [0.1, 0.9, 1],
    },
    markers: {
      size: [0, 0, 0],
      strokeWidth: 2,
      hover: {
        size: 4,
      },
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    grid: {
      show: true,
      borderColor: "#F5F6F7",
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
      padding: {
        top: 0,
        right: -2,
        bottom: 15,
        left: 10,
      },
    },
    legend: {
      show: false,
    },
    plotOptions: {
      bar: {
        columnWidth: "30%",
        barHeight: "70%",
      },
    },
    colors: ["#FFC861", "#0065ff", "#00A385"],
    tooltip: {
      shared: true,
      y: [
        {
          formatter: function (e) {
            return e !== undefined ? e.toFixed(0) : e;
          },
        },
        {
          formatter: function (e) {
            return e !== undefined ? "$" + e.toFixed(2) + "k" : e;
          },
        },
        {
          formatter: function (e) {
            return e !== undefined ? e.toFixed(0) + " Sales" : e;
          },
        },
      ],
    },
    responsive: [
      {
        breakpoint: 1400,
        options: {
          chart: {
            height: 280,
          },
        },
      },
      {
        breakpoint: 400,
        options: {
          chart: {
            height: 200,
          },
        },
      },
    ],
  };
  return (
    <div className="col-span-12 rounded-2xl bg-white max-sm:pr-4 sm:px-8 sm:pt-6 lg:col-span-7">
      <div className="flex items-center justify-between pb-4">
        <p className="heading-4 max-sm:px-4 max-sm:pt-4">Weekly Work Summery</p>
        <ChartMonthModal />
      </div>
      <div className="relative h-px">
        <div className="line-horizontal absolute left-0 top-0 h-full w-full"></div>
      </div>
      <div className="pt-6">
        <ReactApexChart
          options={chartData}
          series={chartData.series}
          type="line"
          width={"100%"}
          height={350}
        />
      </div>
    </div>
  );
}

export default WeeklyWorksSummery;

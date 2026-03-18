"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import ChartMonthModal from "./ChartMonthModal";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

function TotalEarningOverview() {
  const chartData: ApexOptions = {
    series: [
      {
        name: "Total Sales",
        data: [10, 80, 70, 65, 40, 88, 60, 99, 105],
      },
      {
        name: "Total Expense",
        data: [13, 61, 70, 88, 68, 30, 100, 70, 98],
      },
      {
        name: "Total Profit",
        data: [9, 38, 35, 52, 49, 70, 38, 22, 148],
      },
    ],
    chart: {
      height: 400,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    forecastDataPoints: {
      count: 3,
    },
    colors: ["#FFC861", "#00998B", "#5D69F4"],
    stroke: {
      width: 3,
      colors: ["#FFC861", "#00998B", "#5D69F4"],
    },
    xaxis: {
      type: "category",
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
      ],
      tickAmount: 9,
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      max: 150,
      tickAmount: 6,
      labels: {
        offsetX: 0,
      },
    },
    fill: {
      colors: ["#FFC861", "#00998B", "#5D69F4"],
    },
    markers: {
      colors: ["#fff"],
      width: 8,
      height: 8,
      radius: 50,
      shape: "circle",
      size: 6,
      strokeColors: ["#FFC861", "#00998B", "#5D69F4"],
      hover: {
        size: 8,
      },
    },
    dataLabels: {
      enabled: false,
      enabledOnSeries: undefined,
      textAnchor: "middle",
      distributed: false,
      offsetX: 0,
      offsetY: 0,
      background: {
        enabled: true,
        foreColor: "#fff",
        padding: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#fff",
        opacity: 0.9,
      },
    },
    legend: {
      offsetY: 8,
      markers: {
        height: 4,
        width: 4,
        offsetX: -5,
      },
      itemMargin: {
        horizontal: 20,
      },
    },
    grid: {
      borderColor: "#EBECEF",
      padding: {
        bottom: 16,
      },
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
    <div className="col-span-12 rounded-2xl bg-white max-sm:pr-4 sm:px-8 sm:pt-6 lg:col-span-5">
      <div className="flex items-center justify-between pb-6">
        <p className="heading-4 max-sm:px-4 max-sm:pt-4">
          Total Earning Overview
        </p>
        <ChartMonthModal />
      </div>
      <div className="relative h-px">
        <div className="line-horizontal absolute left-0 top-0 h-full w-full"></div>
      </div>
      <div className=" py-6">
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

export default TotalEarningOverview;

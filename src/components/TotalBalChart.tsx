"use client";
import { Chart as ChartJs, ArcElement, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJs.register(ArcElement, Tooltip, Legend);

export default function TotalBalChart({ account }: DoughnutChartProps) {
  const data = {
    datasets: [
      {
        label: "Banks",
        data: [1200, 1250, 1300],
        backgroundColor: ["#0747b6", "#2265d8", "#2f91fa"],
      },
    ],
    labels: ["Bank1", "Bank2", "bank3"],
  };

  return (
    <Doughnut
      data={data}
      options={{
        cutout: "65%",
        plugins: {
          legend: {
            display: false,
          },
        },
      }}
    />
  );
}

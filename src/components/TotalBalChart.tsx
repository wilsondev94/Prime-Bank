"use client";
import { Chart as ChartJs, ArcElement, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJs.register(ArcElement, Tooltip, Legend);

export default function TotalBalChart({ accounts }: DoughnutChartProps) {
  const accountName = accounts.map((acct) => acct.name);
  const balances = accounts.map((acct) => acct.currentBalance);

  const data = {
    datasets: [
      {
        label: "Banks",
        data: balances,
        backgroundColor: ["#0747b6", "#2265d8", "#2f91fa"],
      },
    ],
    labels: accountName,
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

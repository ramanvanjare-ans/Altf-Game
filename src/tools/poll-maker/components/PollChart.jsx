"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
);

export default function PollChart({ options = [], votes = [] }) {
  if (!options.length || !votes.length) return null;

  const maxVotes = Math.max(...votes);

  const palette = ["#F5F5F0", "#E6D8C3", "#C2A68C", "#5D866C"];

  const backgroundColors = votes.map((v, i) => {
    const color = palette[i % palette.length];
    return v === maxVotes && v !== 0 ? "#5D866C" : color;
  });

  const data = {
    labels: options,
    datasets: [
      {
        label: "Votes",
        data: votes,
        backgroundColor: backgroundColors,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Poll Results",
        color: "#5D866C",
        font: { size: 18, weight: "bold" },
      },
      datalabels: {
        color: "#000",
        anchor: "end",
        align: "end",
        formatter: (value) => value,
        font: { weight: "bold", size: 14 },
      },
    },
    animation: {
      duration: 800,
      easing: "easeOutQuart",
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
        grid: {
          color: "rgba(0,0,0,0.05)",
        },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <div className="h-100 w-full bg-(--card) border border-(--border) rounded-2xl p-6 shadow-md mt-5">
      <Bar data={data} options={chartOptions} />
    </div>
  );
}

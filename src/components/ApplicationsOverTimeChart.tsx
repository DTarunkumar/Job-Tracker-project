import { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import type { Job } from "../types/job";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

interface Props {
  jobs: Job[];
}

type GroupingType = "day" | "week" | "month";

export default function ApplicationsLineChart({ jobs }: Props) {
  const [groupBy, setGroupBy] = useState<GroupingType>("day");

  const groupedData = useMemo(() => {
    const map = new Map<string, number>();

    jobs.forEach((job) => {
      const date = new Date(job.applicationDate);

      let key = "";
      if (groupBy === "day") {
        key = date.toISOString().split("T")[0];
      } else if (groupBy === "week") {
        const startOfWeek = new Date(date);
        const day = date.getDay();
        startOfWeek.setDate(date.getDate() - day);
        key = startOfWeek.toISOString().split("T")[0];
      } else if (groupBy === "month") {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      }

      map.set(key, (map.get(key) || 0) + 1);
    });

    const sortedKeys = Array.from(map.keys()).sort();

    return {
      labels: sortedKeys,
      counts: sortedKeys.map((key) => map.get(key) || 0),
    };
  }, [jobs, groupBy]);

  const chartData = {
    labels: groupedData.labels,
    datasets: [
      {
        label: "Applications",
        data: groupedData.counts,
        borderColor: "#3B82F6",
        backgroundColor: "#BFDBFE",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Applications Over Time</h3>
        <select
          className="border rounded px-3 py-1 text-sm"
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value as GroupingType)}
        >
          <option value="day">Daily</option>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
        </select>
      </div>

      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              title: { display: true, text: groupBy.charAt(0).toUpperCase() + groupBy.slice(1) },
            },
            y: {
              beginAtZero: true,
              ticks: { stepSize: 1 },
              title: { display: true, text: "Applications" },
            },
          },
        }}
      />
    </div>
  );
}

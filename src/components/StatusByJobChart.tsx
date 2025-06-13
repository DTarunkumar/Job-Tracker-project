import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Legend, Tooltip } from "chart.js";
import type { Job } from "../types/job";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface Props {
  jobs: Job[];
}

const statusColors: Record<string, string> = {
  Applied: "#3B82F6",
  Interviewing: "#8B5CF6",
  Offer: "#10B981",
  Rejected: "#EF4444",
};

export default function StatusByJobTypeChart({ jobs }: Props) {
  const jobTypes = ["Remote", "Onsite", "Hybrid"];
  const statuses = ["Applied", "Interviewing", "Offer", "Rejected"];

  const statusCountsByType = statuses.map((status) => {
    return {
      label: status,
      backgroundColor: statusColors[status],
      data: jobTypes.map(
        (type) => jobs.filter((j) => j.status === status && j.jobType === type).length
      ),
    };
  });

  const data = {
    labels: jobTypes,
    datasets: statusCountsByType,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
  };

  return <Bar data={data} options={options} />;
}

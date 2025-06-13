interface Props {
  label: string;
  count: number;
  color: "blue" | "purple" | "green" | "red";
}

export default function StatsCard({ label, count, color }: Props) {
  const bgMap: Record<string, string> = {
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 text-center">
      <div className="text-2xl font-bold text-gray-800 mb-1">{count}</div>
      <div
        className={`text-xs inline-block font-medium px-3 py-1 rounded-full ${bgMap[color]}`}
      >
        {label}
      </div>
    </div>
  );
}

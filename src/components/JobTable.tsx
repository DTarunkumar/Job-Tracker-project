import type { Job } from "../types/job";
import { FiExternalLink } from "react-icons/fi";
import { FaEdit, FaTrash } from "react-icons/fa";

const statusStyles: Record<string, string> = {
  Applied: "bg-blue-100 text-blue-700",
  Interviewing: "bg-purple-100 text-purple-700",
  Offer: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

export default function JobTable({
  jobs,
  onEdit,
  onDelete,
}: {
  jobs: Job[];
  onEdit?: (job: Job) => void;
  onDelete?: (jobId: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
    <div className="flex gap-4 py-4 px-1 min-w-full">
    {jobs.length === 0 ? (
      <div className="text-center w-full py-8 text-gray-500">
        You haven’t added any applications yet. Start tracking your job search!
      </div>
    ) : (
      <div className="flex gap-4 overflow-x-auto">
        {jobs.map((job) => (
          <div
      key={job.id}
      className={`min-w-[280px] rounded-xl shadow-md p-4 flex-shrink-0 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group border border-gray-200 ${statusStyles[job.status]}`}>
      {/* Top: Role & Company */}
      <div className="mb-4">
        <h3 className="font-semibold text-lg text-gray-900">{job.jobRole}</h3>
        <p className="text-gray-600">{job.company}</p>
        <p className="text-gray-500 text-sm">{job.location}</p>
      </div>

      {/* Badge with status & date */}
      <div className="flex items-center gap-12 text-xs font-medium mb-3">
        <span className={`rounded-full px-3 py-1 bg-white`}>
          {job.status}
        </span>
        <span className="text-gray-400">
        <span className="font-medium text-gray-500">Applied on:</span>{' '}
          {new Date(job.applicationDate + 'T00:00:00').toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>

      </div>

      {/* Resume & Link */}
      <div className="flex flex-wrap items-center justify-between text-sm text-blue-600 mt-auto">
        {job.resumeUrl && (
          <a
            href={job.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Resume
          </a>
        )}
        {job.jobUrl && (
          <a
            href={job.jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-blue-800"
          >
            <FiExternalLink className="text-sm" />
          </a>
        )}
      </div>

      {/* Hover Actions (optional) */}
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
        <button
          className="text-gray-600 hover:text-blue-600"
          onClick={() => onEdit?.(job)}
          title="Edit"
        >
          <FaEdit />
        </button>
        <button
          className="text-gray-600 hover:text-red-600"
          onClick={() => job.id && onDelete?.(job.id)}
          title="Delete"
        >
          <FaTrash />
        </button>
      </div>
    </div>
    ))}
      </div>
    )}
</div>
</div>
  );
}

import { useEffect, useState, useCallback  } from "react";
import { FaSortUp, FaSortDown, FaEdit, FaTrash } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import AddApplicationModal from "../components/AddApplicationModal";
import { getApplicationsByUser, deleteApplication } from "../firebase/firestoreHelpers";
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "../context/SnackbarContextType";
import type { Job } from "../types/job";

export default function ApplicationsPage() {
  const { currentUser } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Job[]>([]);

  const [jobTypeFilter, setJobTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [companyFilter, setCompanyFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [sortAsc, setSortAsc] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");


  // useCallback so it's stable between renders
  const fetchApplications = useCallback(async () => {
    if (!currentUser?.uid) return;
    const data = await getApplicationsByUser(currentUser.uid);
    setApplications(data as Job[]);
  }, [currentUser?.uid]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleDelete = async (appId: string) => {
      const confirmed = window.confirm("Are you sure you want to delete this application?");
      if (!confirmed || !currentUser?.uid) return;

      try {
        await deleteApplication(currentUser.uid, appId);
        showSnackbar("Application deleted successfully!", "success");
        fetchApplications();
      } catch (error) {
        console.error("Failed to delete application:", error);
        showSnackbar("Failed to delete application.", "error");
      }
  };


  const handleModalClose = async () => {
    setShowAddModal(false);
    setEditingJob(null);
    await fetchApplications();
  };

  const companies = Array.from(new Set(applications.map((j) => j.company)));
  const locations = Array.from(new Set(applications.map((j) => j.location)));

  const filteredJobs = applications
    .filter((job) => jobTypeFilter === "All" || job.jobType === jobTypeFilter)
    .filter((job) => statusFilter === "All" || job.status === statusFilter)
    .filter((job) => companyFilter === "All" || job.company === companyFilter)
    .filter((job) => locationFilter === "All" || job.location === locationFilter)
    .filter((job) =>
        [job.jobRole, job.company, job.location]
          .some(field => (field ?? "").toLowerCase().includes(searchTerm.toLowerCase()))
    )

    .sort((a, b) => {
      const dateA = new Date(a.applicationDate).getTime();
      const dateB = new Date(b.applicationDate).getTime();
      return sortAsc ? dateA - dateB : dateB - dateA;
  });

  const clearAllFilters = () => {
    setJobTypeFilter("All");
    setStatusFilter("All");
    setCompanyFilter("All");
    setLocationFilter("All");
  };



  const statusStyles: Record<string, string> = {
    Applied: "bg-blue-100 text-blue-700",
    Interviewing: "bg-purple-100 text-purple-700",
    Offer: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };

  const exportToCSV = () => {
      const headers = [
        'Job Role', 'Company', 'Job ID', 'Job Type', 'Status', 'Application Date', 'Location', 'Resume URL', 'Cover Letter URL', 'Job Posting URL'
      ];

      const rows = applications.map(app => [
        app.jobRole,
        app.company,
        app.jobId,
        app.jobType,
        app.status,
        app.applicationDate,
        app.location,
        app.resumeUrl,
        app.coverLetterUrl,
        app.jobUrl
      ]);

      const csvContent =
        [headers, ...rows]
          .map(row => row.map(field => `"${(field ?? '').toString().replace(/"/g, '""')}"`).join(','))
          .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'job_applications.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };


  return (
    <div className="p-8 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">All Applications</h1>
        <button
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm"
          onClick={() => {
            setEditingJob(null);
            setShowAddModal(true);
          }}
        >
          Add New Application
        </button>

      </div>

      {/* Filters */}
      <div className="sticky mb-4 p-4 bg-white rounded-xl shadow flex flex-wrap gap-4 items-center">
        <span className="text-gray-700 font-semibold">Filters:</span>
        <input
            type="text"
            placeholder="Search by Job Role, Company, or Location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-3 py-1 text-sm focus:ring-2 ring-blue-300 w-64"
        />

        <select value={jobTypeFilter} onChange={(e) => setJobTypeFilter(e.target.value)} className="border rounded px-3 py-1 text-sm focus:ring-2 ring-blue-300">
          <option value="All">All Job Types</option>
          <option value="Remote">Remote</option>
          <option value="Onsite">Onsite</option>
          <option value="Hybrid">Hybrid</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border rounded px-3 py-1 text-sm focus:ring-2 ring-blue-300">
          <option value="All">All Statuses</option>
          <option>Applied</option>
          <option>Interviewing</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
        <select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} className="border rounded px-3 py-1 text-sm focus:ring-2 ring-blue-300">
          <option value="All">All Companies</option>
          {companies.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="border rounded px-3 py-1 text-sm focus:ring-2 ring-blue-300">
          <option value="All">All Locations</option>
          {locations.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
        <button
          onClick={clearAllFilters}
          className="bg-gray-300 hover:bg-gray-400 text-gray-900 px-4 py-2 rounded-lg text-sm"
        >
          Clear All Filters
        </button>

        <button
          onClick={exportToCSV}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          Export as CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-w-full bg-white rounded-xl shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-3">Job Role</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Job ID</th>
              <th className="px-4 py-3">Job Type</th>
              <th className="px-4 py-3">
                <button onClick={() => setSortAsc(!sortAsc)} className="flex items-center gap-1">
                  App. Date {sortAsc ? <FaSortUp /> : <FaSortDown />}
                </button>
              </th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Resume</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Link</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
              <tr key={job.id} className="border-t">
                <td className="px-4 py-2">{job.jobRole}</td>
                <td className="px-4 py-2">{job.company}</td>
                <td className="px-4 py-2">{job.jobId}</td>
                <td className="px-4 py-2">{job.jobType}</td>
                <td className="px-4 py-2">{new Date(job.applicationDate + 'T00:00:00').toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}</td>
                <td className="px-4 py-2">{job.location}</td>
                <td className="px-4 py-2">
                  {job.resumeUrl && (
                    <a href={job.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      Resume
                    </a>
                  )}
                </td>
                <td className="px-4 py-2">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[job.status]}`}>
                    {job.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1">
                    <FiExternalLink />
                  </a>
                </td>
                <td className="px-4 py-2 text-right space-x-3">
                  <button className="text-gray-600 hover:text-blue-600" onClick={() => setEditingJob(job)} title="Edit">
                    <FaEdit />
                  </button>
                  <button className="text-gray-600 hover:text-red-600" onClick={() => job.id && handleDelete(job.id)} title="Delete">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ):(
            <tr>
              <td colSpan={10} className="text-center text-gray-500 py-6">
                No applications to display.
              </td>
            </tr>
          )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {editingJob && (
        <AddApplicationModal
          onClose={handleModalClose}
          initialData={editingJob}
        />
      )}
      {showAddModal && (
        <AddApplicationModal
          onClose={handleModalClose}
          initialData={null}
        />
      )}
    </div>
  );
}

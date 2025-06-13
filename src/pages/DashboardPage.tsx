import { useEffect, useState, useCallback } from "react";
import AddApplicationModal from "../components/AddApplicationModal";
import StatsCard from "../components/StatsCard";
import JobTable from "../components/JobTable";
import StackedBarChart from "../components/StatusByJobChart";
import ApplicationsLineChart from "../components/ApplicationsOverTimeChart";
import { getApplicationsByUser, deleteApplication } from "../firebase/firestoreHelpers";
import { useAuth } from "../context/AuthContext";
import type { Job } from "../types/job";
import { useSnackbar } from "../context/SnackbarContextType";

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Job[]>([]);

  const fetchApplications = useCallback(async () => {
    if (!currentUser?.uid) return;
    const apps = await getApplicationsByUser(currentUser.uid);
    setApplications(apps as Job[]);
  }, [currentUser?.uid]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleDelete = async (id: string) => {
    if (!currentUser?.uid) return;
    if (confirm("Are you sure you want to delete this application?")) {
      await deleteApplication(currentUser.uid, id);
      setApplications((prev) => prev.filter((app) => app.id !== id));
      showSnackbar("Application deleted");
    }
  };

  const applied = applications.filter((j) => j.status === "Applied").length;
  const interviewing = applications.filter((j) => j.status === "Interviewing").length;
  const offers = applications.filter((j) => j.status === "Offer").length;
  const rejected = applications.filter((j) => j.status === "Rejected").length;

  return (
    <div className="pl-8 pr-8 py-8 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <StatsCard label="Applied" count={applied} color="blue" />
        <StatsCard label="Interviewing" count={interviewing} color="purple" />
        <StatsCard label="Offer" count={offers} color="green" />
        <StatsCard label="Rejected" count={rejected} color="red" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Status by Job Type</h3>
          <StackedBarChart jobs={applications} />
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <ApplicationsLineChart jobs={applications} />
        </div>
      </div>

      {/* Application list header */}
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Recent Applications</h2>
          <button
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm"
            onClick={() => {
              setEditingJob(null);
              setShowModal(true);
            }}
          >
            Add Application
          </button>
        </div>

        {/* Job table */}
        <div className="rounded-xl">
          <JobTable
            jobs={[...applications]
              .sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime())
              .slice(0, 5)}
            onEdit={(job) => setEditingJob(job)}
            onDelete={(id) => handleDelete(id)}
          />
        </div>
      </div>

      {/* Modals */}
      {(showModal || editingJob) && (
        <AddApplicationModal
          initialData={editingJob}
          onClose={() => {
            setShowModal(false);
            setEditingJob(null);
          }}
          onSuccess={() => {
            fetchApplications();
            setShowModal(false);
            setEditingJob(null);
          }}
        />
      )}
    </div>
  );
}

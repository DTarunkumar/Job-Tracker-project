import { useEffect, useRef, useState } from "react";
import { addApplication, updateApplication, uploadFile, generateApplicationDocRef  } from "../firebase/firestoreHelpers";
import { useAuth } from "../context/AuthContext";
import type { Job } from "../types/job";
import { useSnackbar } from "../context/SnackbarContextType";

interface Props {
  onClose: () => void;
  initialData: Job | null;
  onSuccess?: () => void;
}

export default function AddApplicationModal({ onClose, initialData, onSuccess }: Props) {
  const { currentUser } = useAuth();
  const { showSnackbar } = useSnackbar();
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const coverLetterInputRef = useRef<HTMLInputElement>(null);

  const isEdit = !!initialData;

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);


  const [formData, setFormData] = useState<Omit<Job, 'id' | 'createdAt'>>({
    jobRole: "",
    company: "",
    jobId: "",
    jobType: "Onsite",
    location: "",
    status: "Applied",
    applicationDate: "",
    resumeUrl: "",
    coverLetterUrl: "",
    jobUrl: "",
    userId: currentUser?.uid || "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, createdAt, ...rest } = initialData;
      setFormData(rest);
    }
  }, [initialData, currentUser?.uid]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.jobRole.trim()) errors.jobRole = "Job role is required.";
    if (!formData.company.trim()) errors.company = "Company is required.";
    if (!formData.applicationDate) {
      errors.applicationDate = "Application date is required.";
    } else {
      const today = new Date();
      const selected = new Date(formData.applicationDate + 'T00:00:00');

      // Compare only the dates
      if (selected > new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
        errors.applicationDate = "Date cannot be in the future.";
      }
    }

    if (formData.jobUrl && !/^https?:\/\/.+\..+/.test(formData.jobUrl))
      errors.jobUrl = "Enter a valid job URL.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentUser?.uid) return alert("User not authenticated.");

      if (!validateForm()) return;

      try {
        setSubmitting(true); 
        let resumeUrl = formData.resumeUrl;
        let coverLetterUrl = formData.coverLetterUrl;

        // If editing an existing application
        if (isEdit && initialData?.id) {
          if (resumeFile) {
            resumeUrl = await uploadFile(resumeFile, currentUser.uid, initialData.id, "resume");
          }
          if (coverLetterFile) {
            coverLetterUrl = await uploadFile(coverLetterFile, currentUser.uid, initialData.id, "coverLetter");
          }

          await updateApplication(currentUser.uid, initialData.id, {
            ...formData,
            resumeUrl,
            coverLetterUrl,
            userId: currentUser.uid,
          });

          showSnackbar("Application updated successfully", "success");
        } else {
          // For new applications, generate a document ref first
          const docRef = generateApplicationDocRef(currentUser.uid);
          const applicationId = docRef.id;

          if (resumeFile) {
            resumeUrl = await uploadFile(resumeFile, currentUser.uid, applicationId, "resume");
          }
          if (coverLetterFile) {
            coverLetterUrl = await uploadFile(coverLetterFile, currentUser.uid, applicationId, "coverLetter");
          }

          await addApplication(currentUser.uid, applicationId, {
            ...formData,
            resumeUrl,
            coverLetterUrl,
            userId: currentUser.uid,
          });

          showSnackbar("Application added successfully", "success");
        }

        onClose();
        onSuccess?.(); // refresh list
      } catch (err) {
        console.error("Failed to submit application:", err);
        showSnackbar("Error submitting application", "error");
      } finally {
          setSubmitting(false);
      }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl p-8 shadow-xl relative my-8 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isEdit ? "Edit Application" : "Add Application"}
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Job Role */}
          <div>
            <input
              type="text"
              name="jobRole"
              placeholder="Job Role"
              className="w-full input-style"
              value={formData.jobRole}
              onChange={handleChange}
            />
            {formErrors.jobRole && <p className="text-sm text-red-600 mt-1 pl-2">{formErrors.jobRole}</p>}
          </div>

          {/* Company */}
          <div>
            <input
              type="text"
              name="company"
              placeholder="Company"
              className="w-full input-style"
              value={formData.company}
              onChange={handleChange}
            />
            {formErrors.company && <p className="text-sm text-red-600 mt-1 pl-2">{formErrors.company}</p>}
          </div>

          {/* Job ID */}
          <input
            type="text"
            name="jobId"
            placeholder="Job ID"
            className="w-full input-style"
            value={formData.jobId}
            onChange={handleChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Job Type */}
            <select name="jobType" className="input-style" value={formData.jobType} onChange={handleChange}>
              <option value="Remote">Remote</option>
              <option value="Onsite">Onsite</option>
              <option value="Hybrid">Hybrid</option>
            </select>

            {/* Status */}
            <select name="status" className="input-style" value={formData.status} onChange={handleChange}>
              <option>Applied</option>
              <option>Interviewing</option>
              <option>Offer</option>
              <option>Rejected</option>
            </select>

            {/* Application Date */}
            <div>
              <input
                type="date"
                name="applicationDate"
                className="input-style"
                value={formData.applicationDate}
                onChange={handleChange}
              />
              {formErrors.applicationDate && (
                <p className="text-sm text-red-600 mt-1 pl-2">{formErrors.applicationDate}</p>
              )}
            </div>

            {/* Location */}
            <input
              type="text"
              name="location"
              placeholder="Location"
              className="input-style"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          {/* Job URL */}
          <div>
            <input
              type="url"
              name="jobUrl"
              placeholder="Job Posting URL"
              className="w-full input-style"
              value={formData.jobUrl}
              onChange={handleChange}
            />
            {formErrors.jobUrl && <p className="text-sm text-red-600 mt-1">{formErrors.jobUrl}</p>}
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block text-gray-700 mb-1">Resume</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              ref={resumeInputRef}
              onChange={(e) => e.target.files && setResumeFile(e.target.files[0])}
              className="input-style"
            />
            {formData.resumeUrl && (
              <p className="text-sm mt-1 text-blue-600">
                Current:{" "}
                <a href={formData.resumeUrl} target="_blank" rel="noopener noreferrer">
                  View
                </a>
              </p>
            )}
          </div>

          {/* Cover Letter Upload */}
          <div>
            <label className="block text-gray-700 mb-1">Cover Letter</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              ref={coverLetterInputRef}
              onChange={(e) => e.target.files && setCoverLetterFile(e.target.files[0])}
              className="input-style"
            />
            {formData.coverLetterUrl && (
              <p className="text-sm mt-1 text-blue-600">
                Current:{" "}
                <a href={formData.coverLetterUrl} target="_blank" rel="noopener noreferrer">
                  View
                </a>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3 rounded-xl text-lg text-white mt-2
                        ${submitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {submitting ? "Saving…" : isEdit ? "Save Changes" : "Add Application"}
          </button>
        </form>

        <button onClick={onClose} className="absolute top-4 right-5 text-xl font-bold text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>
    </div>
  );
}

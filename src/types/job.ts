// src/types/Job.ts
import { Timestamp } from "firebase/firestore";

export interface Job {
  id?: string;
  jobRole: string;
  company: string;
  jobId?: string;
  jobType: 'Remote' | 'Onsite' | 'Hybrid';
  location?: string;
  status: 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';
  applicationDate: string;
  resumeUrl?: string;
  coverLetterUrl?: string;
  jobUrl: string;
  createdAt?: Timestamp;
  userId: string;
}

// src/types/Job.ts
import { Timestamp } from "firebase/firestore";

export interface Job {
  id?: string; // Optional when creating, will be set from Firestore doc ID
  jobRole: string;
  company: string;
  jobId?: string;
  jobType: 'Remote' | 'Onsite' | 'Hybrid';
  location?: string;
  status: 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';
  applicationDate: string; // You can change this to Timestamp if preferred
  resumeUrl?: string;
  coverLetterUrl?: string;
  jobUrl: string;
  createdAt?: Timestamp;
  userId: string;
}

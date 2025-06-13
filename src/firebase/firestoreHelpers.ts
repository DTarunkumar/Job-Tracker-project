import { db, storage } from '../firebase';
import { collection, Timestamp, query,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
  setDoc,
  getDoc, } from 'firebase/firestore';
import type { Job } from '../types/job';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { UserProfile } from '../types/user';
import type { WithFieldValue } from 'firebase/firestore';


// 1. Generate new application ID before upload
export function generateApplicationDocRef(userId: string) {
  return doc(collection(db, 'users', userId, 'applications'));
}


export async function addApplication(userId: string, applicationId: string, applicationData: Job) {
  try {
    const docRef = doc(db, 'users', userId, 'applications', applicationId);

    const newApp = {
      ...applicationData,
      id: applicationId,
      createdAt: Timestamp.now(),
    };

    await setDoc(docRef, newApp);
  } catch (error) {
    console.error('Error adding application:', error);
    throw error;
  }
}

export async function getApplicationsByUser(userId: string) {
  const appsRef = collection(db, 'users', userId, 'applications');
  const q = query(appsRef, orderBy('applicationDate', 'desc'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function updateApplication(userId: string, appId: string, updatedData: Partial<Job>) {
  const appRef = doc(db, 'users', userId, 'applications', appId);
  await updateDoc(appRef, updatedData);
}


export async function deleteApplication(userId: string, appId: string) {
  const appRef = doc(db, 'users', userId, 'applications', appId);
  await deleteDoc(appRef);
}

// 2. Update uploadFile to accept applicationId
export async function uploadFile(file: File, userId: string, applicationId: string, type: 'resume' | 'coverLetter') {
  const fileRef = ref(storage, `users/${userId}/applications/${applicationId}/${type}.pdf`);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
}


// New: Save user profile data
export async function saveUserProfile(userId: string, profileData: WithFieldValue<UserProfile>): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, profileData, { merge: true });
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
}

// New: Upload profile picture
export async function uploadProfilePicture(file: File, userId: string): Promise<string> {
  const fileRef = ref(storage, `users/${userId}/profile.jpg`);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}



import { useEffect, useState, useRef } from 'react';
import { FiUpload } from 'react-icons/fi';
import { FaCheckCircle, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, saveUserProfile, uploadProfilePicture } from '../firebase/firestoreHelpers';
import { useSnackbar } from '../context/SnackbarContextType';
import type { UserProfile } from '../types/user';
import isEqual from 'lodash.isequal';

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const { showSnackbar } = useSnackbar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [initialData, setInitialData] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    linkedin: '',
    github: '',
    portfolio: '',
    profilePic: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser?.uid) {
        const data = await getUserProfile(currentUser.uid);
        if (data) {
          setFormData({ ...data });
          setInitialData({ ...data });
        }
      }
    };
    fetchProfile();
  }, [currentUser?.uid]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value.trimStart() }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentUser?.uid) {
      try {
        const url = await uploadProfilePicture(file, currentUser.uid);
        setFormData(prev => ({ ...prev, profilePic: url }));
        showSnackbar('Profile picture updated!', 'success');
      } catch {
        showSnackbar('Failed to upload image', 'error');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.uid) return;

    const { firstName, lastName, email } = formData;

    if (!firstName.trim() || !lastName.trim()) {
      showSnackbar('First name and last name are required.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showSnackbar('Please enter a valid email address.', 'error');
      return;
    }

    try {
      await saveUserProfile(currentUser.uid, formData);
      showSnackbar('Profile saved successfully!', 'success');
      setInitialData({ ...formData });
    } catch {
      showSnackbar('Failed to save profile', 'error');
    }
  };

  const isFieldUpdated = (field: keyof UserProfile) =>
    initialData ? formData[field]?.trim() !== initialData[field]?.trim() : false;

  const renderInput = (
    name: keyof UserProfile,
    placeholder: string,
    type: 'text' | 'email' = 'text',
    className = ''
  ) => (
    <div className={`relative ${className}`}>
      <input
        name={name}
        placeholder={placeholder}
        type={type}
        value={formData[name] || ''}
        onChange={handleChange}
        className="input-style w-full pr-10"
      />
      {isFieldUpdated(name) && (
        <FaCheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-8 text-white">Profile</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8"
      >
        {/* Profile Picture */}
        <div className="flex justify-center mb-6">
          <div className="relative w-28 h-28">
            {formData.profilePic ? (
              <img
                src={formData.profilePic}
                alt="Profile"
                className="rounded-full object-cover w-full h-full border-4 border-blue-500"
              />
            ) : (
              <FaUserCircle className="text-blue-500 w-full h-full" />
            )}
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer">
              <FiUpload />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
              />
            </label>
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderInput('firstName', 'First Name')}
          {renderInput('lastName', 'Last Name')}
          {renderInput('email', 'Email', 'email')}
          <div className="relative md:col-span-2">
            <textarea
              name="address"
              placeholder="Address"
              rows={2}
              className="input-style w-full pr-10"
              value={formData.address || ''}
              onChange={handleChange}
            />
            {isFieldUpdated('address') && (
              <FaCheckCircle className="absolute right-3 top-3 text-green-500" />
            )}
          </div>
          {renderInput('linkedin', 'LinkedIn')}
          {renderInput('portfolio', 'Portfolio')}
          {renderInput('github', 'GitHub', 'text', 'md:col-span-2')}
        </div>

        <div className="text-center mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!initialData || isEqual(formData, initialData)}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { saveUserProfile } from '../firebase/firestoreHelpers';
import { useSnackbar } from '../context/SnackbarContextType';

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const validateField = (name: string, value: string) => {
    let message = '';
    if (!value.trim()) {
      message = 'This field is required.';
    } else if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        message = 'Invalid email address.';
      }
    } else if (name === 'password') {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
      if (!passwordRegex.test(value)) {
        message = 'Password must be at least 6 characters and include a number.';
      }
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
    return message;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) validateField(name, value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    let hasError = false;

    // Validate all fields on submit
    Object.entries(form).forEach(([key, value]) => {
      const msg = validateField(key, value);
      if (msg) hasError = true;
    });

    if (hasError) {
      setSubmitting(false);
      return;
    }

    try {
      const { firstName, lastName, email, password } = form;

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`,
      });

      await saveUserProfile(userCredential.user.uid, {
        firstName,
        lastName,
        email,
      });

      showSnackbar('Account created successfully!', 'success');
      navigate('/login');
    } catch (err) {
        console.error("Registration error:", err);
        if (err instanceof Error && 'code' in err) {
          const errorCode = (err as { code: string }).code;
          if (errorCode === 'auth/email-already-in-use') {
            showSnackbar('Email already in use. Please try logging in.', 'error');
            setErrors(prev => ({ ...prev, email: 'This email is already registered.' }));
          } else {
            showSnackbar('Failed to register. Please try again.', 'error');
          }
        } else {
          showSnackbar('Unexpected error. Please try again.', 'error');
        }
      } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-gray-700">First Name*</label>
            <input
              type="text"
              name="firstName"
              className="w-full mt-1 input-style"
              value={form.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.firstName && errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="text-gray-700">Last Name*</label>
            <input
              type="text"
              name="lastName"
              className="w-full mt-1 input-style"
              value={form.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.lastName && errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>

          <div>
            <label className="text-gray-700">Email*</label>
            <input
              type="email"
              name="email"
              className="w-full mt-1 input-style"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.email && errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="text-gray-700">Password*</label>
            <input
              type="password"
              name="password"
              className="w-full mt-1 input-style"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.password && errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={
              submitting || Object.values(form).some((val) => !val.trim())
            }
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg transition disabled:opacity-50"
          >
            {submitting ? 'Registering...' : 'Register'}
          </button>



          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

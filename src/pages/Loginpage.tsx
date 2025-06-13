import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useSnackbar } from '../context/SnackbarContextType';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!form.email.trim()) {
      newErrors.email = 'Email is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        newErrors.email = 'Invalid email format.';
      }
    }

    if (!form.password.trim()) {
      newErrors.password = 'Password is required.';
    }

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const field = e.target.name as keyof typeof touched;
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentErrors = validate();
    setTouched({ email: true, password: true });
    setErrors(currentErrors);

    if (Object.keys(currentErrors).length > 0) {
      return;
    }

    try {
      setSubmitting(true);
      await signInWithEmailAndPassword(auth, form.email, form.password);
      showSnackbar('Login successful!', 'success');
      navigate('/dashboard');
    } catch (err: unknown) {
          console.error(err);

          let errorCode = '';
          if (typeof err === 'object' && err !== null && 'code' in err) {
            errorCode = (err as { code: string }).code;
          }

          if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
            showSnackbar('Invalid email or password.', 'error');
            setErrors({ password: 'Invalid email or password. Please try again.' });
          } else if (errorCode === 'auth/network-request-failed') {
            showSnackbar('Network error. Please check your connection.', 'error');
          } else if (
            errorCode === 'auth/too-many-requests' ||
            errorCode === 'auth/internal-error' ||
            errorCode === 'auth/visibility-check-was-unavailable.' ||
            errorCode === 'auth/quota-exceeded'
          ) {
            showSnackbar('Service temporarily unavailable. Please try again later.', 'error');
          } else {
            showSnackbar('Unexpected error occurred. Please try again.', 'error');
          }
        } finally {
      setSubmitting(false);
    }
  };

  const isButtonDisabled = submitting || !form.email.trim() || !form.password.trim();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full mt-1 input-style"
              placeholder="you@example.com"
            />
            {touched.email && errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full mt-1 input-style"
              placeholder="••••••••"
            />
            {touched.password && errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isButtonDisabled}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Logging in...' : 'Login'}
          </button>

          <div className="text-right text-sm">
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

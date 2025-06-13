import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { useSnackbar } from "../context/SnackbarContextType";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showSnackbar("Please enter a valid email address.", "error");
      setLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      showSnackbar("Password reset link sent! Check your email.", "success");
    } catch (err: unknown) {
      if (err instanceof Error) {
        showSnackbar(err.message, "error");
      } else {
        showSnackbar("An unexpected error occurred.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Reset Password
        </h2>
        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label className="text-gray-700">Email</label>
            <input
              type="email"
              className="w-full mt-1 input-style"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={!email || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}

import { useSnackbar } from "../context/SnackbarContextType";

export default function Snackbar() {
  const { isVisible, message, type } = useSnackbar();

  if (!isVisible) return null;

  const backgroundColor = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
  }[type];

  return (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl text-white shadow-lg z-50 ${backgroundColor}`}>
      {message}
    </div>
  );
}

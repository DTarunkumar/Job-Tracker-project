// src/components/Sidebar.tsx
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { IoClose } from "react-icons/io5";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user) return null;

  const sidebarContent = (
    <aside className="w-60 h-full bg-gray-900 text-white flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold">Job Tracker</h1>
          {onClose && (
            <button onClick={onClose} className="md:hidden text-white text-2xl">
              <IoClose />
            </button>
          )}
        </div>
        <nav className="flex flex-col">
          {["Dashboard", "Applications", "Profile"].map((label) => (
            <NavLink
              key={label}
              to={`/${label.toLowerCase()}`}
              onClick={onClose}
              className={({ isActive }) =>
                `p-4 hover:bg-gray-700 ${isActive ? "bg-gray-800" : ""}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="text-left p-4 hover:bg-gray-700"
      >
        Logout
      </button>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:block fixed h-screen">{sidebarContent}</div>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50">
          <div className="w-60 h-full bg-gray-900 shadow-lg">{sidebarContent}</div>
        </div>
      )}
    </>
  );
}

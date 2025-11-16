// src/components/Sidebar.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftToLine,
  Home,
  BookOpen,
  Calendar,
  Baby,
  User,
  Crown,
  LogOut,
  BookImage,
  ScanHeart
} from "lucide-react";
import { authService } from "../../services/authService";


interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [user, setUser] = useState<{
    fullName: string;
    profilePic?: string;
  } | null>(null);

  const [bloomStage, setBloomStage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const API_BASE = (window as any).__API_URL__ || "http://localhost:3000";

  // Helper: map canonical enum -> UI label
  const enumToUi = (val: string | null | undefined): string | null => {
    switch (val) {
      case "pregnant":
        return "Pregnant";
      case "postpartum":
        return "Postpartum";
      case "childcare":
        return "Early Childcare";
      default:
        return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const fetchUserData = async () => {
      setLoading(true);

      try {
        const token = authService.getToken() ?? localStorage.getItem("token");
        if (!token) {
          if (mounted) setLoading(false);
          return;
        }

        // Fetch user info
        try {
          const userRes = await fetch(`${API_BASE}/api/users/me`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (userRes.ok) {
            const userJson = await userRes.json();
            console.log("User API response:", userJson); // Debug log
            
            // Handle different possible response structures
            const userData = userJson.user || userJson;
            
            const name = userData.fullName || userData.name || "User";
            const profilePic = userData.profilePic || userData.profilePicture || userData.avatar;
            
            if (mounted) {
              setUser({ 
                fullName: name,
                profilePic: profilePic
              });
            }
          } else {
            console.warn("Could not fetch user info:", userRes.status);
            // Set default user if fetch fails but we have a token
            if (mounted) {
              setUser({ fullName: "User" });
            }
          }
        } catch (err) {
          console.error("Failed to fetch user:", err);
          if (mounted) {
            setUser({ fullName: "User" });
          }
        }

        // Fetch mother profile for bloom stage
        try {
          const profRes = await fetch(`${API_BASE}/api/mother-profiles/me`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (profRes.status === 401) {
            console.warn("Unauthorized when fetching mother profile");
            return;
          }

          if (profRes.status === 404) {
            // no profile yet
            if (mounted) {
              setBloomStage(null);
            }
          } else if (!profRes.ok) {
            const text = await profRes.text().catch(() => null);
            console.error("Failed to fetch mother profile:", profRes.status, text);
          } else {
            const profile = await profRes.json();
            console.log("Mother profile API response:", profile); // Debug log
            
            // profile.stage is enum 'pregnant'|'postpartum'|'childcare' (canonical)
            if (mounted) {
              const stage = profile.stage || profile.motherhoodStage || null;
              setBloomStage(stage);

              // update optimistic cache using canonical key
              try {
                if (stage) localStorage.setItem("lastStage", String(stage));
              } catch (e) {
                // ignore localStorage errors
              }
            }
          }
        } catch (err) {
          console.error("Failed to fetch mother profile:", err);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUserData();

    return () => {
      mounted = false;
    };
  }, []);

  // Fallback to optimistic cache if DB hasn't provided anything
  const cachedStage = localStorage.getItem("lastStage"); // cached canonical key
  
  // Final stage selection order (canonical key): db -> cached -> null
  const canonicalStageKey = bloomStage ?? (cachedStage || null);
  
  // Readable label for UI
  const stageLabel = enumToUi(canonicalStageKey);

  const handleNavigation = (path: string) => {
    onClose();
    setTimeout(() => {
      navigate(path);
    }, 500);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    onClose();
    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const menuItems = [
    { icon: Home, label: "Home", path: "/dashboard" },
    { icon: BookOpen, label: "BloomGuide", path: "/bloomguide" },
    { icon: Calendar, label: "Planner", path: "/planner" },
    { icon: ScanHeart, label: "Health Tracker", path: "/healthtracker" },
    { icon: Baby, label: "BB's Tools", path: "/bbtools" },
    { icon: BookImage, label: "Journal", path: "/journal" },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-600 ease-in-out ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 overflow-y-auto transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-[#F875AA] text-white p-3">
          <div className="flex justify-between items-start mb-3">
            <div className="ml-3 mt-2">
              <h2 className="text-xl font-bold text-[#474747]">Bloom stage:</h2>
              <h2 className="text-xl font-bold text-white">
                {loading ? "Loading..." : stageLabel ?? "Not Set"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/10 rounded-lg transition-colors w-10 h-10 flex items-center justify-center"
            >
              <ArrowLeftToLine size={24} />
            </button>
          </div>
          <div className="w-full h-px bg-white/30 mb-2"></div>

          {/* User Profile */}
          <Link
            to="/userprofile"
            onClick={() => handleNavigation("/userprofile")}
            className="w-full flex items-center space-x-3 p-1 hover:bg-white/10 rounded-lg transition-colors text-left"
          >
            <div className="w-12 h-12 rounded-full border-2 border-white/10 overflow-hidden bg-white/20 flex items-center justify-center">
              {user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={24} />
              )}
            </div>

            <div>
              <p className="font-semibold">{user?.fullName || "Loading..."}</p>
              <p className="text-sm text-white/80">View and Edit Profile</p>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <div className="p-6 pb-48">
          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.path)}
                className="w-full flex items-center space-x-3 p-3 text-gray-700 hover:bg-pink-50 rounded-lg transition-colors duration-300"
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Premium + Logout + Footer */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-4 bg-white">
          {/* Premium Banner */}
          <button
            onClick={() => handleNavigation("/premium")}
            className="p-1 bg-gradient-to-r from-[#F875AA] to-[#F4C69D] rounded-lg text-white w-full hover:from-[#F9649C] hover:to-[#F3B287] transition-colors block"
          >
            <div className="flex items-center space-x-2 mb-2 ml-2">
              <Crown size={20} />
              <span className="font-bold">Get BB Premium!</span>
            </div>
            <p className="text-sm text-white/90 text-left ml-2">
              Bloom Even Better.
            </p>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 p-2 w-full mt-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-300"
          >
            <LogOut size={20} color="#7a7a7a" />
            <span className="text-gray-500">Log Out</span>
          </button>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-center text-gray-500 text-xs">
              © 2025 BloomBuhay by Mixed Berries Productions. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-auto shadow-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Are you sure?
            </h3>
            <p className="text-gray-600 mb-6">
              You're about to log out of your account. Are you sure you want to
              leave?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={cancelLogout}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
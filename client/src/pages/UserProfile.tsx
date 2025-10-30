import React from "react";
import { useState, useEffect, useRef } from "react";
import "../index.css";
import Header from '../components/Header';
import Sidebar from "../components/Sidebar";
import InputField from "../components/inputField";
import { Edit, LogOut } from 'lucide-react';
import { userService } from '../services/userService';
import { authService } from '../services/authService';

export default function UserProfile() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // User profile data
  const [userData, setUserData] = useState<{
    fullName: string;
    email: string;
    profilePic?: string;
  } | null>(null);

  // Form state for editing
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleAvatarClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfilePic(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      
      const result = await userService.getProfile();
      
      if (result.success && result.user) {
        setUserData({
          fullName: result.user.fullName,
          email: result.user.email,
          profilePic: result.user.profilePic,
        });
        setFullName(result.user.fullName);
        setEmail(result.user.email);
        setProfilePic(result.user.profilePic || "");
      } else {
        setError(result.error || "Failed to load profile");
        // If not authenticated, try to get from localStorage
        const storedUser = authService.getUser();
        if (storedUser) {
          setUserData({
            fullName: storedUser.fullName,
            email: storedUser.email,
            profilePic: storedUser.profilePic,
          });
          setFullName(storedUser.fullName);
          setEmail(storedUser.email);
          setProfilePic(storedUser.profilePic || "");
        }
      }
      
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = "/";
  };

  const handleEditClick = () => {
    // Reset form with current user data
    if (userData) {
      setFullName(userData.fullName);
      setEmail(userData.email);
      setProfilePic(userData.profilePic || "");
    }
    setPassword("");
    setConfirmPassword("");
    setValidationErrors({});
    setError(null);
    setShowEditModal(true);
  };

  const handleCancel = () => {
    setShowEditModal(false);
    setValidationErrors({});
    setError(null);
    // Reset form
    if (userData) {
      setFullName(userData.fullName);
      setEmail(userData.email);
      setProfilePic(userData.profilePic || "");
    }
    setPassword("");
    setConfirmPassword("");
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setValidationErrors({});

    // Prepare update data
    const updateData: {
      fullName?: string;
      email?: string;
      profilePic?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (fullName !== userData?.fullName) {
      updateData.fullName = fullName;
    }
    if (email !== userData?.email) {
      updateData.email = email;
    }
    if (profilePic !== (userData?.profilePic || "")) {
      updateData.profilePic = profilePic || "";
    }
    if (password) {
      updateData.password = password;
      updateData.confirmPassword = confirmPassword;
    }

    const result = await userService.updateProfile(updateData);

    if (result.success && result.user) {
      setUserData({
        fullName: result.user.fullName,
        email: result.user.email,
        profilePic: result.user.profilePic,
      });
      setProfilePic(result.user.profilePic || "");
      setShowEditModal(false);
      setPassword("");
      setConfirmPassword("");
    } else {
      if (result.errors) {
        // Convert errors array to object for easier access
        const errorsObj: Record<string, string> = {};
        result.errors.forEach((err) => {
          errorsObj[err.field] = err.message;
        });
        setValidationErrors(errorsObj);
      } else {
        setError(result.error || "Failed to update profile");
      }
    }

    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col font-poppins">
      <Header onMenuClick={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className="container mx-auto p-8 items-center justify-center">
        <div className="flex flex-col gap-3 max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-bloomBlack">User Profile</h1>
            <button
              onClick={handleEditClick}
              className="flex items-center gap-2 bg-gradient-to-r from-bloomPink to-bloomYellow text-white px-4 py-2 rounded-2xl hover:from-[#F9649C] hover:to-[#F3D087] transition-all duration-300 shadow-md"
            >
              <Edit size={18} />
              <span>Edit</span>
            </button>
          </div>

          {/* Profile Display */}
          {loading ? (
            <div className="bg-white rounded-2xl p-6 shadow-md text-center">
              <p className="text-gray-600">Loading profile...</p>
            </div>
          ) : error && !userData ? (
            <div className="bg-white rounded-2xl p-6 shadow-md text-center">
              <p className="text-red-600">{error}</p>
            </div>
          ) : userData ? (
            <div className="bg-white rounded-2xl p-6 shadow-md space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-pink-100 overflow-hidden flex items-center justify-center">
                  {userData.profilePic ? (
                    <img src={userData.profilePic} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-pink-600 font-bold text-xl">
                      {userData.fullName?.charAt(0).toUpperCase() + userData.fullName?.charAt(userData.fullName?.length - 1) || 'U'}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-gray-800 text-xl font-semibold">{userData.fullName}</p>
                  <p className="text-gray-500 text-sm">{userData.email}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                <p className="text-gray-800 text-lg">{userData.fullName}</p>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <p className="text-gray-800 text-lg">{userData.email}</p>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                <p className="text-gray-600 text-lg">••••••••</p>
              </div>
            </div>
          ) : null}
        </div>
        <div className="mt-6 flex justify-start ml-20">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm">Log out</span>
          </button>
        </div>
        </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-auto shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Edit Profile</h3>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div onClick={handleAvatarClick} className="h-16 w-16 rounded-full bg-pink-100 overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-90 transition">
                  {profilePic ? (
                    <img src={profilePic} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-pink-600 font-bold text-xl">
                      {fullName?.charAt(0).toUpperCase() + fullName?.charAt(fullName?.length - 1) || 'U'}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500">Click to upload</div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <InputField 
                label="Name" 
                type="text" 
                value={fullName} 
                onChange={setFullName} 
                placeholder="Enter your name"
                error={validationErrors.fullName}
              />
              <InputField 
                label="Email" 
                type="email" 
                value={email} 
                onChange={setEmail} 
                placeholder="Enter your email"
                error={validationErrors.email}
              />
              <InputField 
                label="Change Password" 
                type="password" 
                value={password} 
                onChange={setPassword} 
                placeholder="Enter your password (leave empty to keep current)"
                error={validationErrors.password}
              />
              <InputField 
                label="Confirm Password" 
                type="password" 
                value={confirmPassword} 
                onChange={setConfirmPassword} 
                placeholder="Confirm your password"
                error={validationErrors.confirmPassword}
              />
              
              <div className="flex justify-center gap-8 mt-4">
                <button 
                  onClick={handleCancel}
                  disabled={saving}
                  className="bg-white text-bloomPink border border-bloomPink px-4 py-2 rounded-2xl hover:bg-bloomPink hover:text-white transition-all duration-300 shadow-md w-40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-gradient-to-r from-bloomPink to-bloomYellow text-white px-4 py-2 rounded-2xl hover:from-[#F9649C] hover:to-[#F3D087] transition-all duration-300 shadow-md w-40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

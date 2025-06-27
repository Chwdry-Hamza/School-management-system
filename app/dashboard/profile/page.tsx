'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Profile() {
  const [user, setUser] = useState({ username: '', email: '' });
  const [profilePhoto, setProfilePhoto] = useState('https://via.placeholder.com/150'); // Default photo
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  // Fetch user data from localStorage or sessionStorage on mount
  useEffect(() => {
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!userData || !token) {
      setError('Please log in to access this page.');
      router.push('/auth/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser({ username: parsedUser.username || '', email: parsedUser.email || '' });
      // Optionally fetch profile photo from backend if stored
      // For now, using placeholder; replace with actual logic if photo URL is stored
    } catch (err) {
      console.error('Error parsing user data:', err);
      setError('Failed to load user data.');
    }
  }, [router]);

  // Handle profile photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit.');
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    try {
      const response = await axios.post('https://backend-sms-chi.vercel.app/user/upload-photo', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setProfilePhoto(response.data.photoUrl); // Assuming backend returns the new photo URL
        setSuccess('Profile photo updated successfully!');
      }
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Failed to upload photo.');
    }
  };

  // Handle profile update (full name, email)
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user.username && !user.email) {
      setError('Please fill at least one field to update.');
      return;
    }

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        router.push('/auth/login');
        return;
      }

      const updateData: { username?: string; email?: string } = {};
      if (user.username) updateData.username = user.username;
      if (user.email) updateData.email = user.email;

      const response = await axios.put('https://backend-sms-chi.vercel.app/user/update', updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        // Update localStorage or sessionStorage
        const updatedUser = {
          ...JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}'),
          username: updateData.username || user.username,
          email: updateData.email || user.email,
        };
        const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
        storage.setItem('user', JSON.stringify(updatedUser));

        setSuccess('Profile updated successfully!');
      }
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Failed to update profile.');
    }
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError('All password fields are required.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        setPasswordError('No authentication token found. Please log in.');
        router.push('/auth/login');
        return;
      }

      const response = await axios.put(
        'https://backend-sms-chi.vercel.app/user/change-password',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setPasswordSuccess('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (err: any) {
      setPasswordError(err.response?.data?.msg || 'Failed to change password.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl flex flex-col md:flex-row gap-6">
        {/* Profile Details Section */}
        <div className="w-full md:w-1/2">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">Profile Details</h2>

          {/* {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
          {success && <div className="text-green-600 text-sm mb-4">{success}</div>} */}

          {/* <div className="flex items-center mb-6">
            <img
              src={profilePhoto}
              alt="Profile"
              className="w-24 h-24 rounded-full mr-4 object-cover"
            />
            <div>
              <label className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700 transition">
                Upload New Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-gray-500 mt-1">Max file size: 10 MB</p>
            </div>
          </div> */}

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
                <input
                  type="text"
                  value={user.username}
                  onChange={(e) => setUser({ ...user, username: e.target.value })}
                  className="w-full focus:outline-none text-gray-800"
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="w-full focus:outline-none text-gray-800"
                  placeholder="Your email"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Update Profile
            </button>
          </form>
        </div>

        {/* 
        <div className="w-full md:w-1/2">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">Change Password</h2>

          {passwordError && <div className="text-red-600 text-sm mb-4">{passwordError}</div>}
          {passwordSuccess && <div className="text-green-600 text-sm mb-4">{passwordSuccess}</div>}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
                <svg
                  className="w-5 h-5 text-gray-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 11c0-1.1.9-2 2-2s2 .9 2 2-2 5-2 5m-4-5c0-1.1.9-2 2-2s2 .9 2 2m-6 0c0-1.1.9-2 2-2s2 .9 2 2m-2 6H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3"
                  />
                </svg>
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full focus:outline-none text-gray-800"
                  placeholder="Current Password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="ml-2 text-gray-500"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={showCurrentPassword ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' : 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M12 5c-4.478 0-8.268 2.943-9.543 7 1.275 4.057 5.065 7 9.543 7 4.478 0 8.268-2.943 9.543-7-1.275-4.057-5.065-7-9.543-7z'}
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
                <svg
                  className="w-5 h-5 text-gray-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 11c0-1.1.9-2 2-2s2 .9 2 2-2 5-2 5m-4-5c0-1.1.9-2 2-2s2 .9 2 2m-6 0c0-1.1.9-2 2-2s2 .9 2 2m-2 6H5a2 2 0 01-2-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3"
                  />
                </svg>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full focus:outline-none text-gray-800"
                  placeholder="New Password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="ml-2 text-gray-500"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={showNewPassword ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' : 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M12 5c-4.478 0-8.268 2.943-9.543 7 1.275 4.057 5.065 7 9.543 7 4.478 0 8.268-2.943 9.543-7-1.275-4.057-5.065-7-9.543-7z'}
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
                <svg
                  className="w-5 h-5 text-gray-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 11c0-1.1.9-2 2-2s2 .9 2 2-2 5-2 5m-4-5c0-1.1.9-2 2-2s2 .9 2 2m-6 0c0-1.1.9-2 2-2s2 .9 2 2m-2 6H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3"
                  />
                </svg>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full focus:outline-none text-gray-800"
                  placeholder="Confirm New Password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="ml-2 text-gray-500"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={showConfirmPassword ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' : 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M12 5c-4.478 0-8.268 2.943-9.543 7 1.275 4.057 5.065 7 9.543 7 4.478 0 8.268-2.943 9.543-7-1.275-4.057-5.065-7-9.543-7z'}
                    />
                  </svg>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Change Password
            </button>
          </form>
        </div> */}
      </div>
    </div>
  );
}
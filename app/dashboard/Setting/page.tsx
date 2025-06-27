// app/settings/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Define interfaces for type safety
interface User {
  user_id: string;
  name: string;
  email: string;
  role: 'Student' | 'Teacher' | 'Admin' | 'Parent';
}

interface NewUser {
  name: string;
  email: string;
  role: 'Student' | 'Teacher' | 'Admin' | 'Parent';
  password: string;
}

interface Settings {
  school_name: string;
  session_start: Date;
  session_end: Date;
}

interface Log {
  log_id: string;
  user: string;
  action: string;
  timestamp: string;
}

export default function SettingsPage() {
  // Initialize state with proper types
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<NewUser>({
    name: '',
    email: '',
    role: 'Student',
    password: '',
  });
  const [editUser, setEditUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<Settings>({
    school_name: '',
    session_start: new Date('2025-01-01'),
    session_end: new Date('2025-12-31'),
  });
  const [logs, setLogs] = useState<Log[]>([]);
  const [showUserForm, setShowUserForm] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'users' | 'system' | 'logs'>('users');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Load dummy data
  useEffect(() => {
    // Simulate API response for users
    const dummyUsers: User[] = [
      {
        user_id: 'U001',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Student',
      },
      {
        user_id: 'U002',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        role: 'Teacher',
      },
      {
        user_id: 'U003',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'Admin',
      },
    ];
    setUsers(dummyUsers);

    // Simulate API response for settings
    const dummySettings: Settings = {
      school_name: 'Springfield High School',
      session_start: new Date('2025-01-01'),
      session_end: new Date('2025-12-31'),
    };
    setSettings(dummySettings);

    // Simulate API response for logs
    const dummyLogs: Log[] = [
      {
        log_id: 'L001',
        user: 'admin@example.com',
        action: 'Updated user profile',
        timestamp: '2025-06-01T10:00:00Z',
      },
      {
        log_id: 'L002',
        user: 'admin@example.com',
        action: 'Changed system settings',
        timestamp: '2025-06-02T12:00:00Z',
      },
    ];
    setLogs(dummyLogs);
  }, []);

  // Save user
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) {
      alert('Name and email are required.');
      return;
    }
    if (!editUser && !newUser.password.trim()) {
      alert('Password is required for new users.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      alert('Please enter a valid email address.');
      return;
    }
    try {
      if (editUser) {
        // Simulate updating user
        const updatedUser: User = {
          user_id: editUser.user_id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        };
        setUsers(
          users.map((user) =>
            user.user_id === editUser.user_id ? updatedUser : user,
          ),
        );
        setSuccessMessage('User updated successfully!');
      } else {
        // Simulate creating user
        const createdUser: User = {
          user_id: `U${Math.random().toString(36).substr(2, 9)}`, // Temporary ID
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        };
        setUsers([...users, createdUser]);
        setSuccessMessage('User added successfully!');
      }
      setShowUserForm(false);
      setEditUser(null);
      setNewUser({ name: '', email: '', role: 'Student', password: '' });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to save user.');
    }
  };

  // Delete user
  const handleDeleteUser = async (user_id: string) => {
    try {
      setUsers(users.filter((user) => user.user_id !== user_id));
      setSuccessMessage('User deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user.');
    }
  };

  // Save settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings.school_name.trim()) {
      alert('School name is required.');
      return;
    }
    if (settings.session_start > settings.session_end) {
      alert('Session start date must be before session end date.');
      return;
    }
    try {
      // Simulate saving settings
      setSuccessMessage('Settings saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>

        {/* Tabs */}
        <div className="mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 mr-2 rounded-md ${
              activeTab === 'users' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`px-4 py-2 mr-2 rounded-md ${
              activeTab === 'system' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            System
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'logs' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            Audit Logs
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Manage Users</h2>
            <button
              onClick={() => {
                setShowUserForm(!showUserForm);
                setEditUser(null);
                setNewUser({ name: '', email: '', role: 'Student', password: '' });
              }}
              className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {showUserForm ? 'Cancel' : 'Add User'}
            </button>

            {/* User Form */}
            {showUserForm && (
              <form
                onSubmit={handleSaveUser}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        role: e.target.value as 'Student' | 'Teacher' | 'Admin' | 'Parent',
                      })
                    }
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                    required
                  >
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Admin">Admin</option>
                    <option value="Parent">Parent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                    required={!editUser}
                    placeholder={editUser ? 'Leave blank to keep unchanged' : ''}
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    {editUser ? 'Update User' : 'Add User'}
                  </button>
                </div>
              </form>
            )}

            {/* User List */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.user_id}>
                      <td className="px-6 py-4 text-sm">{user.name}</td>
                      <td className="px-6 py-4 text-sm">{user.email}</td>
                      <td className="px-6 py-4 text-sm">{user.role}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => {
                            setEditUser(user);
                            setNewUser({
                              name: user.name,
                              email: user.email,
                              role: user.role,
                              password: '',
                            });
                            setShowUserForm(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.user_id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">System Configuration</h2>
            <form
              onSubmit={handleSaveSettings}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">School Name</label>
                <input
                  type="text"
                  value={settings.school_name}
                  onChange={(e) =>
                    setSettings({ ...settings, school_name: e.target.value })
                  }
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Session Start</label>
                <DatePicker
                  selected={settings.session_start}
                  onChange={(date: Date | null) =>
                    date && setSettings({ ...settings, session_start: date })
                  }
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Session End</label>
                <DatePicker
                  selected={settings.session_end}
                  onChange={(date: Date | null) =>
                    date && setSettings({ ...settings, session_end: date })
                  }
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Audit Logs</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log.log_id}>
                      <td className="px-6 py-4 text-sm">{log.user}</td>
                      <td className="px-6 py-4 text-sm">{log.action}</td>
                      <td className="px-6 py-4 text-sm">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
}
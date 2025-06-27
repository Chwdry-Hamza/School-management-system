'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function LoginPage() {
  const [username, setUsername] = useState(''); // Changed from email to username to match backend
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Check for existing token on component mount
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      // Optionally verify token with backend or assume valid and redirect
      router.push('/dashboard/admin');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('https://backend-sms-chi.vercel.app/user/login', {
        username,
        password,
      });

      if (response.status === 200) {
        // Store token based on rememberMe
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('token', response.data.token);
        storage.setItem('user', JSON.stringify({
          username: response.data.username,
          userType: response.data.userType,
          phone: response.data.phone,
          _id: response.data._id,
          email: response.data.email,
        }));

        // Redirect to dashboard
        router.push('/dashboard/admin');
      }
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.msg || err.response.data.mes || 'Login failed. Please try again.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="w-full h-[95vh] overflow-hidden flex items-center justify-center bg-[#9DC5C3]">
      <div className="flex w-full max-w-4xl bg-[#FDF8F5] rounded-[2rem] overflow-hidden shadow-xl">
        {/* Left Column with Education Image */}
        <div className="w-1/2 hidden md:block relative">
          <img
            src="https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Education"
            className="h-full w-full object-cover"
          />
          <div className="absolute top-8 left-8 text-white drop-shadow">
            <h1 className="text-3xl font-bold">Blooming</h1>
            <p className="text-sm">Scholars Academy</p>
          </div>
        </div>

        {/* Right Column with Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex items-center justify-center">
          <div className="w-full max-w-sm">
            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5 bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-center text-teal-700 mb-6">Login</h2>

              {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border-b border-gray-300 focus:outline-none focus:border-teal-600 py-1"
                  placeholder="Your username"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b border-gray-300 focus:outline-none focus:border-teal-600 py-1"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex justify-between items-center text-sm mt-2">
                <label className="flex items-center gap-2 text-teal-700">
                  <input
                    type="checkbox"
                    className="accent-teal-600"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  Remember me
                </label>
                <Link href="/auth/forgot-password" className="text-teal-700 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-teal-700 text-white py-2 rounded-md hover:bg-teal-800 transition"
              >
                Sign In
              </button>

              {/* Social Icons */}
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500 mb-2">Don't have an account?</p>
                <Link className="text-teal-700 hover:underline" href="/auth/signup">
                  Sign Up
                </Link>
                <div className="flex justify-center gap-4 text-teal-700 text-xl mt-4">
                  <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-facebook-f hover:text-blue-600" />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-twitter hover:text-blue-400" />
                  </a>
                  <a href="mailto:example@example.com">
                    <i className="far fa-envelope hover:text-gray-600" />
                  </a>
                  <a href="https://vk.com" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-vk hover:text-blue-500" />
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
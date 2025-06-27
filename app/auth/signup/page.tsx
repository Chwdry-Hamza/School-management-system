'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter for redirection

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(''); // Added phone field
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState(''); // Added for error feedback
  const [loading, setLoading] = useState(false); // Added for loading state

  const router = useRouter(); // Initialize router

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setLoading(true); // Set loading state

    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate required fields
    if (!name || !email || !phone || !password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    // Prepare data for backend
    const userData = {
      username: name,
      email,
      phone,
      password,
      userType: 'user', // Default userType, modify as needed
    };

    try {
      const response = await fetch('https://backend-sms-chi.vercel.app/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // Successful signup
        alert('Signup successful! Please log in.');
        router.push('/auth/login'); // Redirect to login page
      } else {
        // Handle backend errors
        setError(data.error?.message || 'Signup failed');
      }
    } catch (err) {
      // Handle network or other errors
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="w-full h-[95vh] overflow-hidden flex items-center justify-center bg-[#9DC5C3]">
      <div className="flex w-full max-w-5xl bg-[#FDF8F5] rounded-[2rem] overflow-hidden shadow-xl">
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
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex items-center justify-center">
          <div className="w-full max-w-sm">
            {/* Heading for Sign Up */}
            <h2 className="text-2xl font-semibold text-center text-teal-700 mb-6">Sign Up</h2>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm text-center mb-4">{error}</div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSignUp} className="space-y-5 bg-white rounded-xl p-6 shadow-lg">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-b border-gray-300 focus:outline-none focus:border-teal-600 py-1"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-b border-gray-300 focus:outline-none focus:border-teal-600 py-1"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border-b border-gray-300 focus:outline-none focus:border-teal-600 py-1"
                  placeholder="Your phone number"
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

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border-b border-gray-300 focus:outline-none focus:border-teal-600 py-1"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex items-center gap-2 text-sm mt-2">
                <label className="flex items-center text-teal-700">
                  <input
                    type="checkbox"
                    className="accent-teal-600"
                    checked={acceptTerms}
                    onChange={() => setAcceptTerms(!acceptTerms)}
                  />
                  I agree to the terms and conditions
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-teal-700 text-white py-2 rounded-md hover:bg-teal-800 transition"
                disabled={!acceptTerms || loading}
              >
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>

              {/* Social Icons */}
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500 mb-2">Already have an account?</p>
                <Link className="text-teal-700 hover:underline" href="/auth/login">
                  Login
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
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface TokenResponse {
  access_token: string;
  token_type: string;
  role: string;
}

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resp = await axios.post<TokenResponse>('/api/v1/auth/token', {
        username,
        password,
      });
      const { access_token, role } = resp.data;
      // Store token (demo purpose)
      localStorage.setItem('authToken', access_token);
      // Redirect based on role
      const rolePath = role.toLowerCase().replace(/\s+/g, '');
      router.push(`/dashboard/${rolePath}`);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700">
      <div className="w-full max-w-md rounded-xl bg-white bg-opacity-10 backdrop-blur-lg shadow-xl p-8 text-white">
        <h1 className="mb-6 text-3xl font-bold text-center">KAVACH AI Login</h1>
        {error && <p className="mb-4 rounded bg-red-500/30 p-2 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full rounded bg-white bg-opacity-20 px-4 py-2 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded bg-white bg-opacity-20 px-4 py-2 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full rounded bg-purple-600 px-4 py-2 font-semibold hover:bg-purple-500 transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

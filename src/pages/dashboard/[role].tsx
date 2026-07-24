import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string;
  role: string;
  exp: number;
  permissions: string[];
}

export default function RoleDashboard() {
  const router = useRouter();
  const { role } = router.query;
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    const token = typeof window !== 'undefined' && localStorage.getItem('authToken');
    if (!token) {
      router.replace('/login');
      return;
    }
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setUserRole(decoded.role);
      // If URL role mismatches token role, redirect to correct dashboard
      if (role && role !== decoded.role.toLowerCase().replace(/\s+/g, '')) {
        router.replace(`/dashboard/${decoded.role.toLowerCase().replace(/\s+/g, '')}`);
      }
    } catch (e) {
      console.error('Invalid token');
      router.replace('/login');
    }
  }, [router, role]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
      <h1 className="mb-4 text-4xl font-bold">{userRole} Dashboard</h1>
      <p className="text-lg">Welcome, you have access to the {userRole} capabilities.</p>
      {/* Add role‑specific widgets or components here */}
    </div>
  );
}

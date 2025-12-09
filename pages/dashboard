import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (!data.user) {
        router.replace('/login');
      } else {
        setUser(data.user);
      }
    }
    load();
  }, [router]);

  async function logout() {
    await fetch('/api/auth/logout');
    router.push('/login');
  }

  if (!user) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      <p>Welcome, <strong>{user.name}</strong></p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

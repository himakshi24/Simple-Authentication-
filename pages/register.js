import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    setMessage(null);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage({ type: 'success', text: 'Registered successfully. You can login now.' });
      setName(''); setEmail(''); setPassword('');
      // optionally redirect to login
      setTimeout(() => router.push('/login'), 900);
    } else {
      setMessage({ type: 'error', text: data.message || 'Error' });
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Register</h1>
      {message && (
        <p style={{ color: message.type === 'error' ? 'crimson' : 'green' }}>{message.text}</p>
      )}
      <form onSubmit={submit}>
        <div>
        <label>Name</label>
        </div>
        <div>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" />
        </div>
        <div>
        <label>Email</label>
        </div>
        <div>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" />
        </div>
        <div>
        <label>Password</label>
        </div>
        <div>
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" type="password" />
        </div>
        <div>
        <button type="submit">Register</button>
        </div>
      </form>
      <p>Already have an account? <Link href="/login">Login</Link></p>
    </div>
  );
}

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    setMessage(null);
    
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    let data = {};
    
    try {
      data = await res.json(); 
    } catch (parseError) {
      setMessage({ 
        type: 'error', 
        text: 'A critical server error occurred (500/404). Check the terminal for API route logs.' 
      });
      console.error("Failed to parse JSON (Received HTML Error Page):", parseError);
      return; 
    }
    
    if (res.ok) {
      // Login successful logic
      setMessage({ type: 'success', text: 'Login successful! Redirecting to your dashboard...' });
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000); 
    } else {
      setMessage({ type: 'error', text: data.message || 'Login failed' });
    }
  }
  
  const getMessageClassName = (type) => {
    return type === 'success' ? 'message-success' : 'message-error';
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Login</h1>
      
      {message && (
        <p className={getMessageClassName(message.type)}>
          {message.text}
        </p>
      )}

    <form onSubmit={submit}>
        <div>
        <label>Email</label>
        </div>
        <div>
        <input value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
        <label>Password</label>
        </div>
        <div>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" />
        </div>
        <button type="submit">Login</button>
      </form>
      
      <p>Don&apos;t have an account? <Link href="/register">Register</Link></p>
    </div>
  );
}

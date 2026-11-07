'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message || 'Signup failed');
      return;
    }

    localStorage.setItem('absojadata_token', data.token);
    localStorage.setItem('absojadata_user', JSON.stringify(data.user));
    router.push('/dashboard');
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="brand-row">
          <span className="brand">ABSOJADATA</span>
        </div>
        <h1>Create an account</h1>
        <p>Register to start buying data and airtime securely.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Full Name
            <input value={form.fullName} onChange={(e) => updateField('fullName', e.target.value)} required />
          </label>
          <label>
            Phone Number
            <input value={form.phoneNumber} onChange={(e) => updateField('phoneNumber', e.target.value)} required />
          </label>
          <label>
            Email
            <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" value={form.password} onChange={(e) => updateField('password', e.target.value)} required />
          </label>
          {error && <div className="error-box">{error}</div>}
          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <Link href="/login">Already have an account?</Link>
          <Link href="/">Back home</Link>
        </div>
      </section>
    </main>
  );
}

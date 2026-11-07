'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="landing-page">
      <header className="topbar">
        <div className="logo">ABSOJADATA</div>
        <nav>
          <Link href="/login">Login</Link>
          <Link href="/register">Create Account</Link>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">YOUR CONNECTIVITY PARTNER</p>
          <h1>Stay connected. Spend less.</h1>
          <p className="subtitle">
            Buy mobile data, airtime recharge, and fund your wallet with a secure VTU platform built for Nigeria.
          </p>
          <div className="cta-row">
            <Link href="/register" className="primary-btn">Get Started</Link>
            <Link href="/login" className="secondary-btn">Sign In</Link>
          </div>
          <div className="stats-row">
            <div>
              <strong>4</strong>
              <span>Networks</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>Service</span>
            </div>
            <div>
              <strong>₦</strong>
              <span>Fast Payments</span>
            </div>
          </div>
        </div>

        <div className="hero-card">
          <h3>Quick Access</h3>
          <div className="menu-grid">
            <div>Buy Data</div>
            <div>Buy Airtime</div>
            <div>Wallet</div>
            <div>History</div>
          </div>
        </div>
      </section>
    </main>
  );
}

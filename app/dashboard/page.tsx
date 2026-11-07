'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Transaction = {
  id: string;
  type: string;
  network?: string;
  phoneNumber?: string;
  planName?: string;
  amount: number;
  status: string;
  createdAt: string;
};

type Plan = {
  id: string;
  network: string;
  name: string;
  size: string;
  validity: string;
  sellingPrice: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState('MTN');
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [phone, setPhone] = useState('');
  const [airtimeAmount, setAirtimeAmount] = useState('100');
  const [balance, setBalance] = useState(0);
  const [fundAmount, setFundAmount] = useState('1000');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('absojadata_token') : '';

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const savedUser = localStorage.getItem('absojadata_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    fetchData();
  }, [router, token]);

  async function fetchData() {
    const [plansRes, txRes, meRes] = await Promise.all([
      fetch('/api/plans'),
      fetch('/api/transactions', { headers: { Authorization: `Bearer ${token}` } }),
      fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
    ]);

    const plansData = await plansRes.json();
    const txData = await txRes.json();
    const meData = await meRes.json();

    setPlans(plansData.plans || []);
    setTransactions(txData.transactions || []);
    setUser(meData.user || null);
    setBalance(meData.user?.wallet?.balance || 0);
  }

  function logout() {
    localStorage.removeItem('absojadata_token');
    localStorage.removeItem('absojadata_user');
    router.push('/login');
  }

  function getPlanPrice() {
    return plans.find((plan) => plan.id === selectedPlan)?.sellingPrice || 0;
  }

  async function buyData() {
    if (!selectedPlan || !phone) {
      setMessage('Select a plan and provide a valid phone number.');
      return;
    }

    setLoading(true);
    setMessage('');

    const res = await fetch('/api/data/purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        network: selectedNetwork,
        phoneNumber: phone,
        planId: selectedPlan,
      }),
    });

    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setMessage(data.message || 'Purchase failed');
      return;
    }

    setMessage('Data purchase successful!');
    fetchData();
  }

  async function buyAirtime() {
    if (!phone || !airtimeAmount) {
      setMessage('Enter a phone number and airtime amount.');
      return;
    }

    setLoading(true);
    setMessage('');

    const res = await fetch('/api/airtime/purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        network: selectedNetwork,
        phoneNumber: phone,
        amount: Number(airtimeAmount),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMessage(data.message || 'Airtime purchase failed');
      return;
    }

    setMessage('Airtime recharge successful!');
    fetchData();
  }

  async function fundWallet() {
    if (!fundAmount) return;
    const res = await fetch('/api/wallet/fund', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount: Number(fundAmount) }),
    });

    const data = await res.json();
    if (!res.ok) {
      setMessage(data.message || 'Wallet top-up failed');
      return;
    }

    setMessage('Wallet funded successfully!');
    fetchData();
  }

  const visiblePlans = plans.filter((plan) => plan.network === selectedNetwork);

  if (!user) return <main className="loading-shell">Loading your dashboard...</main>;

  return (
    <main className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand">ABSOJADATA</div>
        <nav>
          <a href="#overview">Overview</a>
          <a href="#data">Buy Data</a>
          <a href="#airtime">Buy Airtime</a>
          <a href="#history">Recent Transactions</a>
        </nav>
        <button className="secondary-btn" onClick={logout}>Logout</button>
      </aside>

      <section className="content-area">
        <header className="topbar-card" id="overview">
          <div>
            <p className="eyebrow">Welcome back</p>
            <h2>{user.fullName}</h2>
          </div>
          <div className="wallet-box">
            <span>Wallet Balance</span>
            <strong>₦{balance.toLocaleString()}</strong>
          </div>
        </header>

        <div className="stats-grid">
          <div className="stat-card green">
            <span>Buy Data</span>
            <strong>Data bundles</strong>
          </div>
          <div className="stat-card">
            <span>Buy Airtime</span>
            <strong>Instant recharge</strong>
          </div>
          <div className="stat-card">
            <span>Transaction History</span>
            <strong>{transactions.length} records</strong>
          </div>
          <div className="stat-card">
            <span>Fund Wallet</span>
            <strong>Top up now</strong>
          </div>
        </div>

        <div className="panel-grid">
          <div className="panel" id="data">
            <h3>Buy Data</h3>
            <div className="network-row">
              {['MTN', 'Airtel', 'Glo', '9mobile'].map((network) => (
                <button
                  key={network}
                  className={selectedNetwork === network ? 'network-btn active' : 'network-btn'}
                  onClick={() => setSelectedNetwork(network)}
                >
                  {network}
                </button>
              ))}
            </div>

            <label>
              Phone Number
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0803..." />
            </label>

            <select value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}>
              <option value="">Choose bundle</option>
              {visiblePlans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - {plan.size} - ₦{plan.sellingPrice}
                </option>
              ))}
            </select>

            <div className="amount-line">
              <span>Estimated total</span>
              <strong>₦{getPlanPrice().toLocaleString()}</strong>
            </div>

            <button className="primary-btn" onClick={buyData} disabled={loading}>
              {loading ? 'Processing...' : 'Purchase Data'}
            </button>
          </div>

          <div className="panel" id="airtime">
            <h3>Buy Airtime</h3>

            <label>
              Phone Number
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0803..." />
            </label>
            <label>
              Amount (₦)
              <input value={airtimeAmount} onChange={(e) => setAirtimeAmount(e.target.value)} type="number" min="100" step="50" />
            </label>
            <button className="primary-btn" onClick={buyAirtime} disabled={loading}>
              {loading ? 'Recharging...' : 'Recharge Airtime'}
            </button>
          </div>
        </div>

        <div className="panel wallet-fund-panel">
          <h3>Fund Wallet</h3>
          <div className="wallet-input-group">
            <input value={fundAmount} onChange={(e) => setFundAmount(e.target.value)} type="number" min="100" />
            <button className="secondary-btn" onClick={fundWallet}>Top Up</button>
          </div>
        </div>

        {message && <div className="success-box">{message}</div>}

        <div className="panel" id="history">
          <h3>Recent Transactions</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Network</th>
                  <th>Phone</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{tx.type}</td>
                    <td>{tx.network || 'N/A'}</td>
                    <td>{tx.phoneNumber || 'N/A'}</td>
                    <td>₦{tx.amount.toLocaleString()}</td>
                    <td>{tx.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}

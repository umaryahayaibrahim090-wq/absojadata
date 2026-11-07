'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('absojadata_token') : '';

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    Promise.all([
      fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
      fetch('/api/transactions', { headers: { Authorization: `Bearer ${token}` } }),
      fetch('/api/plans'),
      fetch('/api/admin/settings', { headers: { Authorization: `Bearer ${token}` } }),
    ])
      .then(async ([statsRes, txRes, plansRes, settingsRes]) => {
        const [statsData, txData, plansData, settingsData] = await Promise.all([
          statsRes.json(),
          txRes.json(),
          plansRes.json(),
          settingsRes.json(),
        ]);

        setStats(statsData.stats || {});
        setTransactions(txData.transactions || []);
        setPlans(plansData.plans || []);
        setSettings(settingsData.settings || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router, token]);

  if (loading) return <main className="loading-shell">Loading admin dashboard...</main>;

  return (
    <main className="admin-shell">
      <aside className="sidebar admin-sidebar">
        <div className="brand">ABSOJADATA Admin</div>
        <nav>
          <a href="#overview">Overview</a>
          <a href="#customers">Customers</a>
          <a href="#plans">Plans</a>
          <a href="#settings">API Settings</a>
        </nav>
      </aside>

      <section className="content-area admin-content">
        <header className="topbar-card" id="overview">
          <div>
            <p className="eyebrow">Administrator</p>
            <h2>Operations Dashboard</h2>
          </div>
        </header>

        <div className="stats-grid">
          <div className="stat-card"><span>Total Customers</span><strong>{stats?.customerCount || 0}</strong></div>
          <div className="stat-card"><span>Total Wallet Deposits</span><strong>₦{Number(stats?.walletDeposits || 0).toLocaleString()}</strong></div>
          <div className="stat-card"><span>Data Sales</span><strong>₦{Number(stats?.dataSales || 0).toLocaleString()}</strong></div>
          <div className="stat-card"><span>Airtime Sales</span><strong>₦{Number(stats?.airtimeSales || 0).toLocaleString()}</strong></div>
        </div>

        <div className="panel" id="plans">
          <h3>Manage Data Bundles and Prices</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Network</th>
                  <th>Plan</th>
                  <th>Size</th>
                  <th>Validity</th>
                  <th>Selling Price</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => (
                  <tr key={plan.id}>
                    <td>{plan.network}</td>
                    <td>{plan.name}</td>
                    <td>{plan.size}</td>
                    <td>{plan.validity}</td>
                    <td>₦{Number(plan.sellingPrice).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel" id="settings">
          <h3>API Integration Settings</h3>
          <div className="api-settings-list">
            {settings.length ? settings.map((setting) => (
              <div key={setting.id} className="setting-row">
                <span>{setting.providerName}</span>
                <strong>{setting.providerType}</strong>
                <small>{setting.baseUrl}</small>
              </div>
            )) : <p>No API settings saved yet.</p>}
          </div>
        </div>

        <div className="panel">
          <h3>All Transactions</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>User</th>
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
                    <td>{tx.user?.fullName || 'User'}</td>
                    <td>{tx.network || 'N/A'}</td>
                    <td>{tx.phoneNumber || 'N/A'}</td>
                    <td>₦{Number(tx.amount).toLocaleString()}</td>
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

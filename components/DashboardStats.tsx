'use client';

import { useEffect, useState } from 'react';

interface Stats {
  total_users: number;
  completed_predictions_count: number;
  total_group_matches: number;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-100 rounded-lg p-6">
        <p className="text-center text-gray-600">Loading statistics...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-red-100 rounded-lg p-6">
        <p className="text-center text-red-600">Failed to load statistics</p>
      </div>
    );
  }

  const completionRate = stats.total_users > 0
    ? ((stats.completed_predictions_count / stats.total_users) * 100).toFixed(1)
    : '0';

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Competition Statistics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-6 text-center shadow">
          <div className="text-4xl font-bold text-blue-600">{stats.total_users}</div>
          <div className="text-gray-600 mt-2">Total Registered Users</div>
        </div>
        <div className="bg-white rounded-lg p-6 text-center shadow">
          <div className="text-4xl font-bold text-green-600">
            {stats.completed_predictions_count}
          </div>
          <div className="text-gray-600 mt-2">Completed Predictions</div>
          <div className="text-sm text-gray-500 mt-1">
            ({completionRate}% completion rate)
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 text-center shadow">
          <div className="text-4xl font-bold text-purple-600">
            {stats.total_group_matches}
          </div>
          <div className="text-gray-600 mt-2">Group Stage Matches</div>
        </div>
      </div>
    </div>
  );
}

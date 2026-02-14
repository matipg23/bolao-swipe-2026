'use client';

import { useEffect, useState } from 'react';
import CountdownTimer from '@/components/CountdownTimer';
import DashboardStats from '@/components/DashboardStats';
import Link from 'next/link';

export default function Home() {
  const [deadline, setDeadline] = useState<string>('2026-06-06T00:00:00Z');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          setDeadline(data.deadline_editable_until);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🏆 World Cup 2026 Predictor
        </h1>
        <p className="text-xl text-gray-600">
          Predict match scores and compete with other fans!
        </p>
      </div>

      {!loading && <CountdownTimer deadline={deadline} />}

      <DashboardStats />

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Get Started</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 rounded-full p-3">
              <span className="text-2xl">1️⃣</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Register</h3>
              <p className="text-gray-600">
                Create your account to start making predictions
              </p>
            </div>
            <Link
              href="/register"
              className="ml-auto bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Register Now
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-green-100 rounded-full p-3">
              <span className="text-2xl">2️⃣</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Make Predictions</h3>
              <p className="text-gray-600">
                Submit your score predictions for all group stage matches
              </p>
            </div>
            <Link
              href="/predictions"
              className="ml-auto bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Start Predicting
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-purple-100 rounded-full p-3">
              <span className="text-2xl">3️⃣</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">View Results</h3>
              <p className="text-gray-600">
                After the deadline, see how your predictions compare to others
              </p>
            </div>
            <Link
              href="/predictions/view"
              className="ml-auto bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
            >
              View Predictions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

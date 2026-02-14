'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';

interface Prediction {
  id: string;
  goalsTeam1: number;
  goalsTeam2: number;
  user: {
    id: string;
    email: string;
    name?: string | null;
  };
  match: {
    id: string;
    team1: { name: string; flagEmoji?: string | null };
    team2: { name: string; flagEmoji?: string | null };
    groupName: string | null;
  };
}

export default function ViewPredictionsPage() {
  const router = useRouter();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [filterUser, setFilterUser] = useState<string>('all');

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await fetch('/api/predictions');
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch predictions');
        }
        const data = await response.json();
        setPredictions(data.predictions || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load predictions');
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [router]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading predictions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  // Get unique groups and users for filters
  const groups = Array.from(new Set(predictions.map((p) => p.match.groupName).filter(Boolean))).sort();
  const users = Array.from(
    new Set(predictions.map((p) => ({ id: p.user.id, name: p.user.name || p.user.email })))
  );

  // Filter predictions
  const filteredPredictions = predictions.filter((p) => {
    if (filterGroup !== 'all' && p.match.groupName !== filterGroup) return false;
    if (filterUser !== 'all' && p.user.id !== filterUser) return false;
    return true;
  });

  // Group by match
  const predictionsByMatch = new Map<string, Prediction[]>();
  filteredPredictions.forEach((pred) => {
    if (!predictionsByMatch.has(pred.match.id)) {
      predictionsByMatch.set(pred.match.id, []);
    }
    predictionsByMatch.get(pred.match.id)!.push(pred);
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">All Predictions</h1>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800">
          📊 View all users' predictions. This page is read-only.
        </p>
      </div>

      <div className="flex gap-4 flex-wrap">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Group
          </label>
          <select
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Groups</option>
            {groups.map((group) => (
              <option key={group} value={group}>
                Group {group}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by User
          </label>
          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Users</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name || user.id}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {Array.from(predictionsByMatch.entries()).map(([matchId, matchPredictions]) => {
          const match = matchPredictions[0].match;
          return (
            <div key={matchId} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-2xl">{match.team1.flagEmoji || '🏳️'}</span>
                <span className="font-bold text-lg">{match.team1.name}</span>
                <span className="text-gray-500">vs</span>
                <span className="font-bold text-lg">{match.team2.name}</span>
                <span className="text-2xl">{match.team2.flagEmoji || '🏳️'}</span>
                {match.groupName && (
                  <span className="ml-auto bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">
                    Group {match.groupName}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchPredictions.map((pred) => (
                  <div
                    key={pred.id}
                    className="bg-gray-50 border border-gray-200 rounded p-3"
                  >
                    <div className="text-sm text-gray-600 mb-1">
                      {pred.user.name || pred.user.email}
                    </div>
                    <div className="text-xl font-bold">
                      {pred.goalsTeam1} - {pred.goalsTeam2}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {filteredPredictions.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No predictions found matching your filters.
        </div>
      )}
    </div>
  );
}

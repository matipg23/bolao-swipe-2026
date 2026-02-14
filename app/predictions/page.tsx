'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MatchCard from '@/components/MatchCard';
import CountdownTimer from '@/components/CountdownTimer';

interface Match {
  id: string;
  team1: { name: string; flagEmoji?: string | null };
  team2: { name: string; flagEmoji?: string | null };
  scheduledAt?: string | null;
  groupName: string | null;
}

interface Prediction {
  matchId: string;
  goalsTeam1: number;
  goalsTeam2: number;
}

export default function PredictionsPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Map<string, Prediction>>(new Map());
  const [deadline, setDeadline] = useState<string>('2026-06-06T00:00:00Z');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [afterDeadline, setAfterDeadline] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch settings for deadline
        const settingsResponse = await fetch('/api/settings');
        if (settingsResponse.ok) {
          const settings = await settingsResponse.json();
          setDeadline(settings.deadline_editable_until);
          const deadlineDate = new Date(settings.deadline_editable_until);
          setAfterDeadline(new Date() >= deadlineDate);
        }

        // Fetch matches
        const matchesResponse = await fetch('/api/matches?stage=group');
        if (!matchesResponse.ok) {
          if (matchesResponse.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch matches');
        }
        const matchesData = await matchesResponse.json();
        setMatches(matchesData.matches);

        // Fetch predictions
        const predictionsResponse = await fetch('/api/predictions');
        if (predictionsResponse.ok) {
          const predictionsData = await predictionsResponse.json();
          const predictionsMap = new Map<string, Prediction>();
          predictionsData.predictions.forEach((pred: any) => {
            predictionsMap.set(pred.match.id, {
              matchId: pred.match.id,
              goalsTeam1: pred.goalsTeam1,
              goalsTeam2: pred.goalsTeam2,
            });
          });
          setPredictions(predictionsMap);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleSave = async (matchId: string, goalsTeam1: number, goalsTeam2: number) => {
    try {
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId,
          goalsTeam1,
          goalsTeam2,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save prediction');
      }

      // Update local state
      setPredictions((prev) => {
        const newMap = new Map(prev);
        newMap.set(matchId, { matchId, goalsTeam1, goalsTeam2 });
        return newMap;
      });

      alert('Prediction saved successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save prediction');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading matches...</p>
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

  // Group matches by group name
  const matchesByGroup = new Map<string, Match[]>();
  matches.forEach((match) => {
    const group = match.groupName || 'Unknown';
    if (!matchesByGroup.has(group)) {
      matchesByGroup.set(group, []);
    }
    matchesByGroup.get(group)!.push(match);
  });

  const totalMatches = matches.length;
  const predictedMatches = predictions.size;
  const progress = totalMatches > 0 ? (predictedMatches / totalMatches) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Predictions</h1>
        <div className="text-sm text-gray-600">
          Progress: {predictedMatches} / {totalMatches} matches ({progress.toFixed(1)}%)
        </div>
      </div>

      {!afterDeadline && <CountdownTimer deadline={deadline} />}

      {afterDeadline && (
        <div className="bg-red-100 border-2 border-red-500 rounded-lg p-4">
          <p className="text-red-700 font-semibold">
            ⚠️ The prediction deadline has passed. Editing is no longer allowed.
          </p>
        </div>
      )}

      <div className="space-y-8">
        {Array.from(matchesByGroup.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([groupName, groupMatches]) => (
            <div key={groupName} className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Group {groupName}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    prediction={predictions.get(match.id) || null}
                    onSave={handleSave}
                    disabled={afterDeadline}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

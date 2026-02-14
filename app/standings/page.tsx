'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface TeamStanding {
  teamId: string;
  teamName: string;
  groupName: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export default function StandingsPage() {
  const router = useRouter();
  const [standings, setStandings] = useState<{ [group: string]: TeamStanding[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const response = await fetch('/api/qualification');
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch standings');
        }
        const data = await response.json();
        setStandings(data.standings || {});
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load standings');
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, [router]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading standings...</p>
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

  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Group Standings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {groups.map((group) => {
          const groupStandings = standings[group] || [];
          if (groupStandings.length === 0) {
            return (
              <div key={group} className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Group {group}</h2>
                <p className="text-gray-500">No standings available yet</p>
              </div>
            );
          }

          return (
            <div key={group} className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Group {group}</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Team</th>
                      <th className="text-center p-2">P</th>
                      <th className="text-center p-2">W</th>
                      <th className="text-center p-2">D</th>
                      <th className="text-center p-2">L</th>
                      <th className="text-center p-2">GF</th>
                      <th className="text-center p-2">GA</th>
                      <th className="text-center p-2">GD</th>
                      <th className="text-center p-2 font-bold">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupStandings.map((team, index) => (
                      <tr
                        key={team.teamId}
                        className={`border-b ${
                          index < 2 ? 'bg-green-50 font-semibold' : ''
                        }`}
                      >
                        <td className="p-2">{team.teamName}</td>
                        <td className="text-center p-2">{team.played}</td>
                        <td className="text-center p-2">{team.wins}</td>
                        <td className="text-center p-2">{team.draws}</td>
                        <td className="text-center p-2">{team.losses}</td>
                        <td className="text-center p-2">{team.goalsFor}</td>
                        <td className="text-center p-2">{team.goalsAgainst}</td>
                        <td className="text-center p-2">
                          {team.goalDifference > 0 ? '+' : ''}
                          {team.goalDifference}
                        </td>
                        <td className="text-center p-2 font-bold">{team.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {groupStandings.length >= 2 && (
                <p className="text-xs text-green-600 mt-2">
                  🟢 Top 2 teams qualify
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';

interface MatchCardProps {
  match: {
    id: string;
    team1: { name: string; flagEmoji?: string | null };
    team2: { name: string; flagEmoji?: string | null };
    scheduledAt?: string | null;
  };
  prediction?: {
    goalsTeam1: number;
    goalsTeam2: number;
  } | null;
  onSave: (matchId: string, goalsTeam1: number, goalsTeam2: number) => void;
  disabled?: boolean;
}

export default function MatchCard({
  match,
  prediction,
  onSave,
  disabled = false,
}: MatchCardProps) {
  const [goalsTeam1, setGoalsTeam1] = useState(
    prediction?.goalsTeam1?.toString() || ''
  );
  const [goalsTeam2, setGoalsTeam2] = useState(
    prediction?.goalsTeam2?.toString() || ''
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const team1Goals = parseInt(goalsTeam1) || 0;
    const team2Goals = parseInt(goalsTeam2) || 0;

    if (team1Goals < 0 || team2Goals < 0) {
      alert('Goals must be non-negative numbers');
      return;
    }

    setSaving(true);
    try {
      await onSave(match.id, team1Goals, team2Goals);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{match.team1.flagEmoji || '🏳️'}</span>
            <span className="font-medium">{match.team1.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{match.team2.flagEmoji || '🏳️'}</span>
            <span className="font-medium">{match.team2.name}</span>
          </div>
        </div>
        {match.scheduledAt && (
          <div className="text-xs text-gray-500 text-right">
            {new Date(match.scheduledAt).toLocaleDateString()}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <input
          type="number"
          min="0"
          value={goalsTeam1}
          onChange={(e) => setGoalsTeam1(e.target.value)}
          disabled={disabled || saving}
          className="w-16 px-2 py-1 border border-gray-300 rounded text-center disabled:bg-gray-100"
          placeholder="0"
        />
        <span className="text-gray-500">-</span>
        <input
          type="number"
          min="0"
          value={goalsTeam2}
          onChange={(e) => setGoalsTeam2(e.target.value)}
          disabled={disabled || saving}
          className="w-16 px-2 py-1 border border-gray-300 rounded text-center disabled:bg-gray-100"
          placeholder="0"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={disabled || saving || goalsTeam1 === '' || goalsTeam2 === ''}
        className="w-full bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {saving ? 'Saving...' : prediction ? 'Update' : 'Save'}
      </button>
    </div>
  );
}

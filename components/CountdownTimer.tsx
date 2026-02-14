'use client';

import { useEffect, useState } from 'react';
import { differenceInSeconds } from 'date-fns';

interface CountdownTimerProps {
  deadline: string;
}

export default function CountdownTimer({ deadline }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    expired: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

  useEffect(() => {
    const updateTimer = () => {
      const deadlineDate = new Date(deadline);
      const now = new Date();
      const diff = differenceInSeconds(deadlineDate, now);

      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          expired: true,
        });
        return;
      }

      const days = Math.floor(diff / (60 * 60 * 24));
      const hours = Math.floor((diff % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((diff % (60 * 60)) / 60);
      const seconds = diff % 60;

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        expired: false,
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  if (timeLeft.expired) {
    return (
      <div className="bg-red-100 border-2 border-red-500 rounded-lg p-6 text-center">
        <p className="text-2xl font-bold text-red-700">
          ⏰ Prediction Deadline Has Passed
        </p>
        <p className="text-red-600 mt-2">
          Editing predictions is no longer allowed. You can now view all predictions.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-6">
      <h2 className="text-xl font-bold text-blue-900 mb-4 text-center">
        Time Remaining to Submit/Edit Predictions
      </h2>
      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-3xl font-bold text-blue-600">{timeLeft.days}</div>
          <div className="text-sm text-gray-600 mt-1">Days</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-3xl font-bold text-blue-600">{timeLeft.hours}</div>
          <div className="text-sm text-gray-600 mt-1">Hours</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-3xl font-bold text-blue-600">{timeLeft.minutes}</div>
          <div className="text-sm text-gray-600 mt-1">Minutes</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-3xl font-bold text-blue-600">{timeLeft.seconds}</div>
          <div className="text-sm text-gray-600 mt-1">Seconds</div>
        </div>
      </div>
      <p className="text-center text-sm text-gray-600 mt-4">
        Deadline: {new Date(deadline).toLocaleString()}
      </p>
    </div>
  );
}

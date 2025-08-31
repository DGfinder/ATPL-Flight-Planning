import React, { useEffect, useMemo, useState } from 'react';

interface ExamTimerProps {
  endTime: Date;
  onExpire: () => void;
}

const pad = (n: number) => String(n).padStart(2, '0');

const ExamTimer: React.FC<ExamTimerProps> = ({ endTime, onExpire }) => {
  const [now, setNow] = useState<number>(Date.now());
  const remainingMs = Math.max(0, endTime.getTime() - now);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (remainingMs === 0) onExpire();
  }, [remainingMs, onExpire]);

  const { h, m, s } = useMemo(() => {
    const total = Math.floor(remainingMs / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return { h, m, s };
  }, [remainingMs]);

  const urgency = remainingMs <= 5 * 60 * 1000 ? 'text-red-600' : remainingMs <= 30 * 60 * 1000 ? 'text-amber-600' : 'text-green-700';

  return (
    <div className={`px-2 py-1 rounded bg-white/10 ${urgency} font-mono`} title="Exam timer">
      {pad(h)}:{pad(m)}:{pad(s)}
    </div>
  );
};

export default ExamTimer;



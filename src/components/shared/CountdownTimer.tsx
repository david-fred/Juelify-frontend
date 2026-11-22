import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: string;
  className?: string;
  compact?: boolean;
}

export function CountdownTimer({ targetDate, className = '', compact = false }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.expired) {
    return (
      <span className={`text-red-400 text-xs font-medium ${className}`}>
        Expired
      </span>
    );
  }

  if (compact) {
    return (
      <span className={`text-text-muted text-xs flex items-center gap-1 ${className}`}>
        <Clock size={12} />
        {timeLeft.days > 0 && `${timeLeft.days}d `}
        {timeLeft.hours}h {timeLeft.minutes}m
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Clock size={14} className="text-text-muted" />
      <div className="flex items-center gap-1.5">
        {timeLeft.days > 0 && <TimeUnit value={timeLeft.days} label="d" />}
        <TimeUnit value={timeLeft.hours} label="h" />
        <TimeUnit value={timeLeft.minutes} label="m" />
        <TimeUnit value={timeLeft.seconds} label="s" />
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <span className="bg-surface-overlay px-1.5 py-0.5 rounded text-xs font-mono font-semibold text-text-primary">
      {String(value).padStart(2, '0')}<span className="text-text-muted">{label}</span>
    </span>
  );
}

function getTimeLeft(targetDate: string) {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  };
}


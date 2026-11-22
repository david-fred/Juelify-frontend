import type { Severity } from '@/api/types';
import { SEVERITY_COLORS } from '@/lib/constants';

interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
}

/** Urgent = red, Important = amber, General = blue. */
export function SeverityBadge({ severity, className = '' }: SeverityBadgeProps) {
  const colors = SEVERITY_COLORS[severity];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${colors.bg} ${colors.text} ${colors.border} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {severity}
    </span>
  );
}

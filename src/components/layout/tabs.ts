import {
  BarChart3,
  CalendarDays,
  FolderLock,
  MessageSquare,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

export interface TabItem {
  path: string;
  label: string;
  Icon: LucideIcon;
}

/** Primary navigation, shared by the bottom bar (mobile) and the top bar (desktop). */
export const TABS: readonly TabItem[] = [
  { path: '/feed', label: 'Feed', Icon: MessageSquare },
  { path: '/materials', label: 'Materials', Icon: FolderLock },
  { path: '/contributions', label: 'Contribute', Icon: Wallet },
  { path: '/calendar', label: 'Calendar', Icon: CalendarDays },
  { path: '/polls', label: 'Polls', Icon: BarChart3 },
];

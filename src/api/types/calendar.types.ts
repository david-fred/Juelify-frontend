import type { Severity } from './feed.types';

export type EventTrack = 'community' | 'personal';

export interface CalendarEvent {
  id: string;
  communityId?: string;
  userId?: string;
  title: string;
  description: string;
  severity: Severity;
  track: EventTrack;
  startDate: string;
  endDate?: string;
  allDay: boolean;
  notifyBefore?: number[]; // minutes before event
  createdAt: string;
}

export interface CreateEventPayload {
  communityId?: string;
  title: string;
  description: string;
  severity: Severity;
  track: EventTrack;
  startDate: string;
  endDate?: string;
  allDay: boolean;
  notifyBefore?: number[];
}

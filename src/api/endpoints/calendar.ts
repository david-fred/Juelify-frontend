import api from '../client';
import type { CalendarEvent, CreateEventPayload } from '../types';

export const calendarApi = {
  getEvents: async (params: {
    communityId?: string;
    startDate?: string;
    endDate?: string;
    track?: string;
  }): Promise<CalendarEvent[]> => {
    const { data } = await api.get<CalendarEvent[]>('/api/events', { params });
    return data;
  },

  createEvent: async (payload: CreateEventPayload): Promise<CalendarEvent> => {
    const { data } = await api.post<CalendarEvent>('/api/events', payload);
    return data;
  },

  updateEvent: async (eventId: string, payload: Partial<CreateEventPayload>): Promise<CalendarEvent> => {
    const { data } = await api.patch<CalendarEvent>(`/api/events/${eventId}`, payload);
    return data;
  },

  deleteEvent: async (eventId: string): Promise<void> => {
    await api.delete(`/api/events/${eventId}`);
  },
};


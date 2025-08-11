export interface CalendarDay {
  date: Date | null;
  available: boolean;
  selected: boolean;
  isToday: boolean;
  isCheckIn: boolean;
  isCheckOut: boolean;
  isInRange: boolean;
}

export interface BookingEvent {
  start: Date;
  end: Date;
  summary: string;
}
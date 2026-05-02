export type Instrument = 'phq2' | 'gad2' | 'phq9' | 'gad7' | 'who5' | 'sleep' | 'stress';

export interface Checkin {
  id?: number;
  timestamp: Date;
  type: Instrument;
  score: number | null;
  severityBand: string | null;
  durationSeconds: number;
}

export interface Response {
  id?: number;
  checkinId: number;
  questionId: string;
  value: number | null;
}

export interface Note {
  id?: number;
  timestamp: Date;
  content: string;
}

export interface Setting {
  key: string;
  value: unknown;
}

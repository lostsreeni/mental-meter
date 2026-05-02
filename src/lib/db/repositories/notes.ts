import { db } from '../database';
import { Note } from '../schema';

export async function createNote(note: Omit<Note, 'id'>): Promise<number | null> {
  if (typeof window === 'undefined') return null;
  return await db.notes.add(note as Note);
}

export async function getNotesInRange(startDate: Date, endDate: Date): Promise<Note[] | null> {
  if (typeof window === 'undefined') return null;
  return await db.notes
    .where('timestamp')
    .between(startDate, endDate)
    .toArray();
}

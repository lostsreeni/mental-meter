import { db } from '../database';
import { Note } from '../schema';

export async function createNote(note: Omit<Note, 'id'>): Promise<number | null> {
  if (typeof window === 'undefined') return null;
  return await db.notes.add(note as Note);
}

export async function updateNote(id:number, patch: Partial<Note>): Promise<number | null> {
  if (typeof window === 'undefined') return null;
  return await db.notes.update(id, { ...patch, editedAt: new Date() });
}

export async function deleteNote(id:number): Promise<void> {
  if (typeof window === 'undefined') return;
  await db.notes.delete(id);
}

export async function getNoteForCheckin(checkinId:number): Promise<Note | null> {
  if (typeof window === 'undefined') return null;
  return (await db.notes.where('checkinId').equals(checkinId).first()) ?? null;
}

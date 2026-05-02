import { db } from '../database';
import { Checkin, Instrument, Response } from '../schema';

export async function createCheckin(checkin: Omit<Checkin, 'id'>, responses: Omit<Response, 'id' | 'checkinId'>[]): Promise<number | null> {
  if (typeof window === 'undefined') return null;
  return await db.transaction('rw', db.checkins, db.responses, async () => {
    const checkinId = await db.checkins.add(checkin as Checkin);
    const responsesWithIds = responses.map(r => ({ ...r, checkinId }));
    await db.responses.bulkAdd(responsesWithIds as Response[]);
    return checkinId;
  });
}

export async function getCheckinsInRange(startDate: Date, endDate: Date, type?: Instrument): Promise<Checkin[] | null> {
  if (typeof window === 'undefined') return null;

  if (type) {
    return await db.checkins
      .where('[type+timestamp]')
      .between([type, startDate], [type, endDate])
      .toArray();
  }

  return await db.checkins
    .where('timestamp')
    .between(startDate, endDate)
    .toArray();
}

export async function getResponsesForCheckin(checkinId: number): Promise<Response[] | null> {
  if (typeof window === 'undefined') return null;
  return await db.responses.where('checkinId').equals(checkinId).toArray();
}

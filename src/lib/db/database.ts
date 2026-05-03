import Dexie, { Table } from 'dexie';
import { Checkin, Response, Note, Setting } from './schema';

export class MindMeterDatabase extends Dexie {
  checkins!: Table<Checkin, number>;
  responses!: Table<Response, number>;
  notes!: Table<Note, number>;
  settings!: Table<Setting, string>;

  constructor() {
    super('mindcheck');
    this.version(1).stores({
      checkins: '++id, timestamp, type, [type+timestamp]',
      responses: '++id, checkinId',
      notes: '++id, timestamp',
      settings: 'key',
    });
    // v2: score and severityBand may be null (skipped questions), added durationSeconds
    this.version(2).stores({
      checkins: '++id, timestamp, type, [type+timestamp]',
      responses: '++id, checkinId',
      notes: '++id, timestamp',
      settings: 'key',
    });
    this.version(3).stores({
      checkins: '++id, timestamp, type, [type+timestamp]',
      responses: '++id, checkinId',
      notes: '++id, timestamp, checkinId',
      settings: 'key',
    });
  }
}

export const db = new MindMeterDatabase();

import { db } from './database';
import { Instrument } from './schema';

export async function seedDevData() {
  if (typeof window === 'undefined') return;
  if (process.env.NODE_ENV !== 'development') return;

  try {
    // Check if data already exists to avoid duplicate seeding
    const checkinCount = await db.checkins.count();
    if (checkinCount > 0) {
        console.log('Database already has data, skipping seed.');
        return;
    }

    console.log('Seeding development data...');

    const now = new Date();
    const checkinsToInsert: any[] = [];
    const responsesToInsert: any[] = [];
    const notesToInsert: any[] = [];

    const instruments: Instrument[] = ['phq9', 'gad7', 'who5'];

    let checkinIdCounter = 1;

    for (let i = 30; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);

      // Randomly pick an instrument for the day
      const instrument = instruments[Math.floor(Math.random() * instruments.length)];

      // Generate some random scores and responses based on instrument
      let score = 0;
      const numQuestions = instrument === 'phq9' ? 9 : (instrument === 'gad7' ? 7 : 5);
      const maxValue = instrument === 'who5' ? 5 : 3;

      const currentCheckinId = checkinIdCounter++;

      for (let q = 1; q <= numQuestions; q++) {
          const value = Math.floor(Math.random() * (maxValue + 1));
          score += value;
          responsesToInsert.push({
              checkinId: currentCheckinId,
              questionId: `q${q}`,
              value
          });
      }

      // Convert score for who5
      if (instrument === 'who5') {
          score = score * 4;
      }

      checkinsToInsert.push({
        id: currentCheckinId,
        timestamp: date,
        type: instrument,
        score
      });

      // Add a note roughly 30% of the time
      if (Math.random() < 0.3) {
          notesToInsert.push({
              timestamp: date,
              content: `Sample note for ${date.toDateString()}`
          });
      }
    }

    await db.transaction('rw', db.checkins, db.responses, db.notes, async () => {
        await db.checkins.bulkAdd(checkinsToInsert);
        await db.responses.bulkAdd(responsesToInsert);
        await db.notes.bulkAdd(notesToInsert);
    });

    console.log('Development data seeded successfully.');
  } catch (error) {
    console.error('Error seeding development data:', error);
  }
}

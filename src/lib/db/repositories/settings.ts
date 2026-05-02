import { db } from '../database';

export async function setSetting(key: string, value: unknown): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  return await db.settings.put({ key, value });
}

export async function getSetting(key: string): Promise<unknown | null> {
  if (typeof window === 'undefined') return null;
  const setting = await db.settings.get(key);
  return setting ? setting.value : null;
}

export async function clearAllData(): Promise<boolean | null> {
  if (typeof window === 'undefined') return null;
  try {
    await db.delete();
    await db.open();
    return true;
  } catch (error) {
    console.error("Failed to clear database:", error);
    return false;
  }
}

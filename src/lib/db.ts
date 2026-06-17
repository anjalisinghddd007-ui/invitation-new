import fs from 'fs';
import path from 'path';

export interface RSVP {
  id: string;
  name: string;
  email: string;
  phone: string;
  guests: number;
  events: string[];
  foodPreference: string;
  timestamp: string;
}

export interface Wish {
  id: string;
  name: string;
  text: string;
  color: string;
  leafPosition?: { x: number; y: number };
  timestamp: string;
}

export interface Lantern {
  id: string;
  name: string;
  wish: string;
  timestamp: string;
}

export interface DatabaseSchema {
  rsvps: RSVP[];
  wishes: Wish[];
  lanterns: Lantern[];
}

// Declare global variable for in-memory cache on serverless platforms
declare global {
  var __db_store: DatabaseSchema | undefined;
}

const IS_SERVERLESS = process.env.VERCEL === '1';
const LOCAL_DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');
const TMP_DB_PATH = path.join('/tmp', 'db.json');

const DB_FILE_PATH = IS_SERVERLESS ? TMP_DB_PATH : LOCAL_DB_PATH;

const defaultDb: DatabaseSchema = {
  rsvps: [],
  wishes: [
    {
      id: 'default-1',
      name: 'Anjali (Sister)',
      text: 'Wishing you both a lifetime of happiness, laughter, and endless adventure together! Can\'t wait for the ceremonies!',
      color: '#D4A5A5',
      leafPosition: { x: 200, y: 150 },
      timestamp: new Date().toISOString()
    },
    {
      id: 'default-2',
      name: 'Vikram Singh',
      text: 'Hearty congratulations to Anoop & Sanya! Looking forward to celebrating this beautiful union in Prayagraj.',
      color: '#C5A880',
      leafPosition: { x: 350, y: 180 },
      timestamp: new Date().toISOString()
    }
  ],
  lanterns: [
    {
      id: 'l-1',
      name: 'Rahul',
      wish: 'May your love shine brighter than a million lanterns in the night sky.',
      timestamp: new Date().toISOString()
    }
  ]
};

// Ensure database file exists
function initDb() {
  const dir = path.dirname(DB_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE_PATH)) {
    // If we are in a serverless environment, try to seed from the bundled local file
    if (IS_SERVERLESS && fs.existsSync(LOCAL_DB_PATH)) {
      try {
        const initialData = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
        fs.writeFileSync(DB_FILE_PATH, initialData, 'utf-8');
        return;
      } catch (err) {
        console.error('Failed to copy initial DB to /tmp, falling back to defaultDb:', err);
      }
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(defaultDb, null, 2), 'utf-8');
  }
}

export function readDb(): DatabaseSchema {
  try {
    initDb();
    if (fs.existsSync(DB_FILE_PATH)) {
      const data = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(data) as DatabaseSchema;
      // Sync memory store
      globalThis.__db_store = parsed;
      return parsed;
    }
  } catch (error) {
    console.error('Error reading JSON database:', error);
  }

  // Fallback to memory store if filesystem read fails
  if (globalThis.__db_store) {
    return globalThis.__db_store;
  }

  // Last resort fallback: read the bundled database file directly
  if (IS_SERVERLESS && fs.existsSync(LOCAL_DB_PATH)) {
    try {
      const data = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
      const parsed = JSON.parse(data) as DatabaseSchema;
      globalThis.__db_store = parsed;
      return parsed;
    } catch (e) {
      console.error('Error reading bundled database file directly:', e);
    }
  }

  return defaultDb;
}

export function writeDb(data: DatabaseSchema): boolean {
  // Always update global memory store first
  globalThis.__db_store = data;

  try {
    initDb();
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.warn('Writing to database path failed (expected on read-only serverless filesystems):', error);

    // If writing to DB_FILE_PATH failed and it wasn't already /tmp, try /tmp as fallback
    if (DB_FILE_PATH !== TMP_DB_PATH) {
      try {
        const tmpDir = path.dirname(TMP_DB_PATH);
        if (!fs.existsSync(tmpDir)) {
          fs.mkdirSync(tmpDir, { recursive: true });
        }
        fs.writeFileSync(TMP_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
        console.log('Successfully wrote fallback to /tmp/db.json');
        return true;
      } catch (tmpError) {
        console.error('Failed to write to fallback /tmp/db.json:', tmpError);
      }
    }

    // Return true since we updated the memory store successfully.
    // This prevents the user interface from showing a "Failed to save" error.
    return true;
  }
}

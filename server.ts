import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

// Ensure /data directory exists for persistent shares storage
const DATA_DIR = path.join(__dirname, 'data');
const SHARES_FILE = path.join(DATA_DIR, 'shares.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory cache + file sync
let sharesCache: Record<string, any> = {};
if (fs.existsSync(SHARES_FILE)) {
  try {
    sharesCache = JSON.parse(fs.readFileSync(SHARES_FILE, 'utf-8'));
  } catch (e) {
    console.warn('Failed reading shares.json, starting with empty cache:', e);
    sharesCache = {};
  }
}

function persistShares() {
  try {
    fs.writeFileSync(SHARES_FILE, JSON.stringify(sharesCache, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed writing shares.json:', e);
  }
}

function generateShareId(): string {
  const chars = '23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
  let id = '';
  for (let i = 0; i < 7; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

// API: Save settings bundle and get clean short share ID
app.post('/api/share', (req: Request, res: Response) => {
  try {
    const bundle = req.body;
    if (!bundle || !bundle.themes) {
      res.status(400).json({ error: 'Invalid bundle payload' });
      return;
    }

    const shareId = generateShareId();
    sharesCache[shareId] = {
      id: shareId,
      createdAt: new Date().toISOString(),
      bundle,
    };

    persistShares();

    res.json({
      success: true,
      id: shareId,
    });
  } catch (err: any) {
    console.error('Save share error:', err);
    res.status(500).json({ error: 'Failed to save share bundle' });
  }
});

// API: Load settings bundle by share ID
app.get('/api/share/:id', (req: Request, res: Response) => {
  const shareId = req.params.id;
  const share = sharesCache[shareId];

  if (!share) {
    res.status(404).json({ error: 'Preset not found or expired' });
    return;
  }

  res.json({
    success: true,
    bundle: share.bundle,
    createdAt: share.createdAt,
  });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: Date.now(), shareCount: Object.keys(sharesCache).length });
});

// Mount Vite or static server
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`TileFX Studio server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();

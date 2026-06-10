import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerPath = path.resolve(__dirname, '../../swagger.json');

router.get('/swagger.json', (req, res) => {
  res.sendFile(swaggerPath);
});

export default router;

import { Router } from 'express';
import { getBalance, addRecyclePoints, getLedger } from '../controllers/points.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { verifyHmac } from '../middleware/hmac.js';

export const router = Router();

router.get('/balance', requireAuth, verifyHmac, getBalance);
router.post('/recycle', requireAuth, verifyHmac, addRecyclePoints);
router.get('/ledger', requireAuth, verifyHmac, getLedger);

export default router;

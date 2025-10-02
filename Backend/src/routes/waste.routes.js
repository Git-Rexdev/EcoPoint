
import { Router } from 'express';
import { submitWaste, reviewWaste } from '../controllers/waste.controller.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import { verifyHmac } from '../middleware/hmac.js';

export const router = Router();

router.post('/submit', requireAuth, verifyHmac, submitWaste);

// Get all waste submissions for the logged-in user
router.get('/my', requireAuth, async (req, res, next) => {
	try {
		const subs = await (await import('../models/WasteSubmission.js')).WasteSubmission.find({ userId: req.user.sub }).sort({ createdAt: -1 });
		res.json(subs);
	} catch (e) { next(e); }
});

// BUSINESS and ADMIN: Get all waste submissions (schedules)
router.get('/all', requireAuth, requireRoles('BUSINESS', 'ADMIN'), async (req, res, next) => {
	try {
		const subs = await (await import('../models/WasteSubmission.js')).WasteSubmission.find().sort({ createdAt: -1 });
		res.json(subs);
	} catch (e) { next(e); }
});

router.post('/:id/review', requireAuth, requireRoles('ADMIN'), reviewWaste);

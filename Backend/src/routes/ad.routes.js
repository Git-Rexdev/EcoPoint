
import { Router } from 'express';
import {
  createAd,
  listAds,
  listAllAds,
  listMyAds,
  updateAd,
  deleteAd
} from '../controllers/ad.controller.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';

export const router = Router();

router.get('/', listAds);
router.get(
  '/all',
  requireAuth,
  requireRoles('ADMIN'),
  listAllAds
);
router.post(
  '/',
  requireAuth,
  requireRoles('BUSINESS', 'ADMIN'),
  createAd
);
router.get(
  '/my',
  requireAuth,
  requireRoles('BUSINESS', 'ADMIN'),
  listMyAds
);
router.patch(
  '/:id',
  requireAuth,
  requireRoles('BUSINESS', 'ADMIN'),
  updateAd
);
router.delete(
  '/:id',
  requireAuth,
  requireRoles('BUSINESS', 'ADMIN'),
  deleteAd
);

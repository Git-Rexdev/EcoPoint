
import { Router } from 'express';
import { listCoupons, listAllCoupons, createCoupon, listMyCoupons, updateCoupon, deleteCoupon, redeemCoupon, verifyAndUse, getVerificationHistory } from '../controllers/coupon.controller.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import { verifyHmac } from '../middleware/hmac.js';

export const router = Router();

router.get('/', listCoupons);
router.get('/all', requireAuth, requireRoles('ADMIN'), listAllCoupons);
router.post('/', requireAuth, requireRoles('BUSINESS', 'ADMIN'), createCoupon);
router.get('/my', requireAuth, requireRoles('BUSINESS', 'ADMIN'), listMyCoupons);
router.get('/verification-history', requireAuth, requireRoles('BUSINESS', 'ADMIN'), getVerificationHistory);
router.patch('/:id', requireAuth, requireRoles('BUSINESS', 'ADMIN'), updateCoupon);
router.delete('/:id', requireAuth, requireRoles('BUSINESS', 'ADMIN'), deleteCoupon);
router.post('/redeem', requireAuth, verifyHmac, redeemCoupon);
router.post('/verify', requireAuth, requireRoles('BUSINESS','ADMIN'), verifyAndUse);
